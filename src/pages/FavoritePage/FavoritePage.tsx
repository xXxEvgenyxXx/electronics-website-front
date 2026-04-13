import { useEffect, useState } from 'react';
import { MainLayout } from '@/widgets';
import { CatalogCard, type Product } from '@/widgets';
import { Spin, message, Empty } from 'antd';
//import { getCurrentUser, updateUserFavorites } from '@/api/user';
import { getCurrentUser, updateUserFavorites } from '@/shared';
import { getAllProducts } from '@/shared';
import type { User } from '@/shared';
import s from './FavoritePage.module.scss';

export function FavoritePage() {
  const [user, setUser] = useState<User | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedUser, fetchedProducts] = await Promise.all([
          getCurrentUser(),
          getAllProducts()
        ]);
        setUser(fetchedUser);
        setAllProducts(fetchedProducts);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        message.error('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleFavorite = async (productId: number) => {
    if (!user) return;

    const isFavorite = user.favoriteItems.some(item => item.id === productId);
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = user.favoriteItems.filter(item => item.id !== productId);
    } else {
      const productToAdd = allProducts.find(p => p.id === productId);
      if (!productToAdd) return;
      newFavorites = [...user.favoriteItems, productToAdd];
    }

    const previousFavorites = user.favoriteItems;
    setUser({ ...user, favoriteItems: newFavorites });

    try {
      const favoriteIds = newFavorites.map(item => item.id);
      const updatedUser = await updateUserFavorites(user.id, favoriteIds);
      setUser(updatedUser);
    } catch (error) {
      setUser({ ...user, favoriteItems: previousFavorites });
      message.error('Не удалось обновить избранное');
    }
  };

  const handleAddToCart = async (productId: number) => {
    if (!user) {
      message.error('Необходимо авторизоваться');
      return;
    }

    const product = allProducts.find(p => p.id === productId);
    if (!product || product.inStock === 0) {
      message.error('Товар недоступен');
      return;
    }

    const existingItem = user.cart.find(item => item.productId === productId);
    let newCart;
    
    if (existingItem) {
      newCart = user.cart.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...user.cart, { productId, quantity: 1 }];
    }

    const previousCart = user.cart;
    setUser({ ...user, cart: newCart });

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: newCart })
      });
      if (!response.ok) throw new Error('Failed to update cart');
      const updatedUser = await response.json();
      setUser(updatedUser);
      message.success('Товар добавлен в корзину');
    } catch (error) {
      setUser({ ...user, cart: previousCart });
      message.error('Не удалось добавить в корзину');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className={s.loadingContainer}>
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className={s.errorContainer}>
          <Empty description="Не удалось загрузить данные пользователя" />
        </div>
      </MainLayout>
    );
  }

  const favoriteProducts = user.favoriteItems;

  return (
    <MainLayout>
      <div className={s.favoritesPageWrapper}>
        <h1 className={s.pageTitle}>Избранное</h1>
        {favoriteProducts.length === 0 ? (
          <Empty description="У вас пока нет избранных товаров" />
        ) : (
          <div className={s.cardsWrapper}>
            {favoriteProducts.map(product => (
              <CatalogCard
                key={product.id}
                product={product}
                isFavorite={true}
                onToggleFavorite={handleToggleFavorite}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}