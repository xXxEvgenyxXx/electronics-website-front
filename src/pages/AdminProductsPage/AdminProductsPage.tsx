import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Input, message, Spin, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AdminLayout } from '@/widgets';
import s from './AdminProductsPage.module.scss';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  inStock: number;
  price: number;
  category: Category;
  manufacturer: {
    id: number;
    name: string;
  };
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editStockValue, setEditStockValue] = useState<number>(0);
  const [updating, setUpdating] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Product[]>('/api/products');
      setProducts(response.data);
    } catch (error) {
      message.error('Не удалось загрузить товары');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const startEdit = (product: Product) => {
    setEditingProductId(product.id);
    setEditStockValue(product.inStock);
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setEditStockValue(0);
  };

  const saveStock = async (product: Product) => {
    if (editStockValue < 0) {
        message.warning('Количество не может быть отрицательным');
        return;
    }

    setUpdating(true);
    try {
        // Prepare the full payload with updated stock
        const payload = {
        name: product.name,
        categoryID: product.category.id,
        price: product.price,
        manufacturerID: product.manufacturer.id,
        inStock: editStockValue,
        };

        await axios.put(`/api/products/${product.id}`, payload);
        message.success('Количество на складе обновлено');
        await fetchProducts(); // refresh list
        cancelEdit();
    } catch (error) {
        message.error('Ошибка при обновлении');
        console.error(error);
    } finally {
        setUpdating(false);
    }
    };

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
      title: 'Категория',
      key: 'category',
      render: (_, record) => record.category.name,
    },
    {
      title: 'Цена',
      key: 'price',
      render: (_, record) => `${record.price.toLocaleString()} ₽`,
    },
    {
      title: 'Количество на складе',
      key: 'inStock',
      render: (_, record) => {
        if (editingProductId === record.id) {
          return (
            <Input
              type="number"
              min={0}
              value={editStockValue}
              onChange={(e) => setEditStockValue(Number(e.target.value))}
              style={{ width: 100 }}
              disabled={updating}
            />
          );
        }
        return record.inStock;
      },
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => {
        if (editingProductId === record.id) {
          return (
            <Space>
              <Button
                type="primary"
                size="small"
                onClick={() => saveStock(record)}
                loading={updating}
                icon={<SaveOutlined/>}
              />
              <Button size="small" onClick={cancelEdit} disabled={updating} icon={<CloseOutlined/>}/>
            </Space>
          );
        }
        return (
          <Button
            type="default"
            size="small"
            onClick={() => startEdit(record)}
          >
            Изменить количество на складе
          </Button>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <div className={s.products}>
        <h1>Все товары ({products.length})</h1>
        <Spin spinning={loading}>
          <Table
            dataSource={products}
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