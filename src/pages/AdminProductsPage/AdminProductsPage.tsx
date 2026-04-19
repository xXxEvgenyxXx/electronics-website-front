// AdminProductsPage.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, message, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AdminLayout } from '@/widgets';
import s from './AdminProductsPage.module.scss';

interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  categoryName?: string; // предположим, что приходит с бэка
  inStock: number;
}

interface Category {
  id: number;
  name: string;
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get<Product[]>('/api/products'),
        axios.get<Category[]>('/api/categories')
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      message.error('Не удалось загрузить данные');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    // Фильтр по категории
    if (categoryFilter !== null && product.categoryId !== categoryFilter) {
      return false;
    }
    // Фильтр по наличию
    if (stockFilter === 'low' && (product.inStock > 10 || product.inStock === 0)) {
      return false;
    }
    if (stockFilter === 'out' && product.inStock !== 0) {
      return false;
    }
    return true;
  });

  const columns: ColumnsType<Product> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString()} ₽`,
    },
    {
      title: 'Категория',
      key: 'category',
      render: (_, record) => {
        const cat = categories.find(c => c.id === record.categoryId);
        return cat?.name || '—';
      },
    },
    {
      title: 'Остаток',
      dataIndex: 'inStock',
      key: 'inStock',
      render: (inStock: number) => (
        <span style={{ color: inStock === 0 ? 'red' : inStock <= 10 ? 'orange' : 'inherit' }}>
          {inStock}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className={s.products}>
        <h1>Все товары ({filteredProducts.length})</h1>

        <div className={s.filters}>
          <div className={s.filterGroup}>
            <label htmlFor="categoryFilter">Категория:</label>
            <select
              id="categoryFilter"
              value={categoryFilter ?? ''}
              onChange={(e) => setCategoryFilter(e.target.value ? Number(e.target.value) : null)}
              className={s.select}
            >
              <option value="">Все категории</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className={s.filterGroup}>
            <label htmlFor="stockFilter">Наличие:</label>
            <select
              id="stockFilter"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as 'all' | 'low' | 'out')}
              className={s.select}
            >
              <option value="all">Все товары</option>
              <option value="low">Заканчивается (≤10)</option>
              <option value="out">Нет в наличии</option>
            </select>
          </div>
        </div>

        <Spin spinning={loading}>
          <Table
            dataSource={filteredProducts}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            style={{ width: '100%' }}
          />
        </Spin>
      </div>
    </AdminLayout>
  );
}