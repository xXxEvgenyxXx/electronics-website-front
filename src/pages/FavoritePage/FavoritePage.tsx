import { useEffect, useState } from 'react';
import { MainLayout } from '@/widgets';
import { CatalogCard, type Product } from '@/widgets';
import { Spin, message, Empty } from 'antd';
import { getCurrentUser, addFavorite, removeFavorite, updateUserCart } from '@/shared/api/user';
import { getAllProducts } from '@/shared/api/products';
import type { User } from '@/shared/types';
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

    const favorites = user.favoriteItems || [];
    const existingItem = favorites.find(item => item.productId === productId);
    const isFavorite = !!existingItem;

    const newFavorites = isFavorite
      ? favorites.filter(item => item.productId !== productId)
      : [...favorites, { productId, quantity: 1 }];

    const previousFavorites = favorites;
    setUser({ ...user, favoriteItems: newFavorites });

    try {
      const updatedUser = isFavorite
        ? await removeFavorite(user.id, productId)
        : await addFavorite(user.id, productId);
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
      const updatedUser = await updateUserCart(user.id, newCart);
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

  const favoriteProductIds = user.favoriteItems?.map(item => item.productId) || [];
  const favoriteProducts = allProducts.filter(product =>
    favoriteProductIds.includes(product.id)
  );

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