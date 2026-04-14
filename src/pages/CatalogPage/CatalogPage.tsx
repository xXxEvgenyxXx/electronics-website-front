import { useEffect, useState } from 'react';
import { MainLayout } from '@/widgets';
import { CatalogCard, type Product, type Category } from '@/widgets';
import { Checkbox, Spin, message, Pagination } from 'antd';
import { getCurrentUser, addFavorite, removeFavorite, updateUserCart } from '@/shared/api/user';
import { getAllProducts } from '@/shared/api/products';
import type { User } from '@/shared/types';
import s from './CatalogPage.module.scss';

const PAGE_SIZE = 6;

export function CatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Загрузка категорий, товаров и текущего пользователя
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch('/api/categories'),
          getAllProducts(), // или fetch, если нет готового API
        ]);

        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
        setProducts(productsRes); // getAllProducts возвращает массив

        // Пытаемся получить пользователя (может быть null, если не авторизован)
        const currentUser = await getCurrentUser().catch(() => null);
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        message.error('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Фильтрация товаров по выбранным категориям
  useEffect(() => {
    let filtered: Product[];
    if (selectedCategories.size === 0) {
      filtered = products;
    } else {
      filtered = products.filter(product => selectedCategories.has(product.category.id));
    }
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [selectedCategories, products]);

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // --- Работа с избранным (через API) ---
  const handleToggleFavorite = async (productId: number) => {
    if (!user) {
      message.warning('Необходимо войти в систему');
      return;
    }

    const favs = user.favoriteItems || [];
    const isFavorite = favs.some(item => item.id === productId);
    const previousFavs = favs;
    const newFavs = isFavorite
      ? favs.filter(item => item.id !== productId)
      : [...favs, products.find(p => p.id === productId)!];

    // Оптимистичное обновление UI
    setUser({ ...user, favoriteItems: newFavs });

    try {
      const updatedUser = isFavorite
        ? await removeFavorite(user.id, productId)
        : await addFavorite(user.id, productId);
      setUser(updatedUser);
    } catch (error) {
      setUser({ ...user, favoriteItems: previousFavs });
      message.error('Не удалось обновить избранное');
    }
  };

  // --- Работа с корзиной (через API) ---
  const handleAddToCart = async (productId: number) => {
    if (!user) {
      message.warning('Необходимо войти в систему');
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product || product.inStock === 0) {
      message.error('Товар недоступен');
      return;
    }

    const cart = user.cart || [];
    const existingItem = cart.find(item => item.productId === productId);
    let newCart;
    if (existingItem) {
      newCart = cart.map(item =>
        item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { productId, quantity: 1 }];
    }

    const previousCart = cart;
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

  // Пагинация
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);
  const totalProducts = filteredProducts.length;

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
      <div className={s.catalogPageWrapper}>
        <aside className={s.filtersWrapper}>
          <h3>Категории</h3>
          {categories.map(cat => (
            <Checkbox
              key={cat.id}
              checked={selectedCategories.has(cat.id)}
              onChange={() => handleCategoryToggle(cat.id)}
            >
              {cat.name}
            </Checkbox>
          ))}
        </aside>

        <div className={s.cardsContainer}>
          <div className={s.cardsWrapper}>
            {paginatedProducts.map(product => {
              const isFavorite = user?.favoriteItems?.some(item => item.id === product.id) || false;
              const isInCart = user?.cart?.some(item => item.productId === product.id) || false;

              return (
                <CatalogCard
                  key={product.id}
                  product={product}
                  isFavorite={isFavorite}
                  isInCart={isInCart}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToCart={handleAddToCart}
                />
              );
            })}
          </div>

          {totalProducts > 0 && (
            <div className={s.paginationWrapper}>
              <Pagination
                current={currentPage}
                pageSize={PAGE_SIZE}
                total={totalProducts}
                onChange={page => setCurrentPage(page)}
                showSizeChanger={false}
                showQuickJumper={false}
              />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}