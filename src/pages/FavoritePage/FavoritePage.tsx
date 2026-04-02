import { useEffect, useState } from 'react';
import { MainLayout } from '@/widgets';
import { CatalogCard, type Product } from '@/widgets';
import { Spin, message, Empty } from 'antd';
import s from './FavoritePage.module.scss';

const FAVORITES_KEY = 'catalog_favorites';
const CART_KEY = 'catalog_cart';

const getFavorites = (): number[] => {
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setFavorites = (ids: number[]) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
};

const addToCart = (productId: number) => {
  const stored = localStorage.getItem(CART_KEY);
  const cart = stored ? JSON.parse(stored) : [];
  const existing = cart.find((item: { id: number }) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  message.success('Товар добавлен в корзину');
};

export function FavoritePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>(getFavorites());
  const [loading, setLoading] = useState(true);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        message.error('Ошибка загрузки товаров');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products that are in favorites
  const favoriteProducts = products.filter(product => favorites.includes(product.id));

  const handleToggleFavorite = (productId: number) => {
    const updatedFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    setFavorites(updatedFavorites);
    setFavorites(updatedFavorites); // save to localStorage via the setter's side effect? Actually we need to persist.
    // We'll write a helper that updates localStorage directly.
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
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
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}