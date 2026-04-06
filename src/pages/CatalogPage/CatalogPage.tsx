import { useEffect, useState } from 'react';
import { MainLayout } from '@/widgets';
import { CatalogCard, type Product, type Category } from '@/widgets';
import { Checkbox, Spin, message, Pagination } from 'antd';
import s from './CatalogPage.module.scss';
// localStorage helpers (unchanged)
const FAVORITES_KEY = 'catalog_favorites';
const CART_KEY = 'catalog_cart';

const getFavorites = (): number[] => {
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setFavorites = (ids: number[]) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
};

const toggleFavorite = (productId: number, currentFavorites: number[]): number[] => {
  const updated = currentFavorites.includes(productId)
    ? currentFavorites.filter(id => id !== productId)
    : [...currentFavorites, productId];
  setFavorites(updated);
  return updated;
};

const getCartIds = (): number[] => {
  const stored = localStorage.getItem(CART_KEY);
  const cart = stored ? JSON.parse(stored) : [];
  return cart.map((item: { id: number }) => item.id);
};

const PAGE_SIZE = 6;

export function CatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
  const [favorites, setFavorites] = useState<number[]>(getFavorites());
  const [cartIds, setCartIds] = useState<number[]>(getCartIds());
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products'),
        ]);
        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();
        setCategories(categoriesData);
        setProducts(productsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        message.error('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter products when selectedCategories or products change
  useEffect(() => {
    let filtered: Product[];
    if (selectedCategories.size === 0) {
      filtered = products;
    } else {
      filtered = products.filter(product => selectedCategories.has(product.category.id));
    }
    setFilteredProducts(filtered);
    setCurrentPage(1); // reset to first page when filters change
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

  const handleToggleFavorite = (productId: number) => {
    const updated = toggleFavorite(productId, favorites);
    setFavorites(updated);
  };

  const handleAddToCart = (productId: number) => {
    const stored = localStorage.getItem(CART_KEY);
    const cart = stored ? JSON.parse(stored) : [];
    const existing = cart.find((item: { id: number }) => item.id === productId);
    if (!existing) {
      cart.push({ id: productId, quantity: 1 });
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      setCartIds(prev => [...prev, productId]);
      message.success('Товар добавлен в корзину');
    }
  };

  // Pagination: slice the filtered products
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / PAGE_SIZE);

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
            {paginatedProducts.map(product => (
              <CatalogCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                isInCart={cartIds.includes(product.id)}
                onToggleFavorite={handleToggleFavorite}
                onAddToCart={handleAddToCart}
              />
            ))}
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