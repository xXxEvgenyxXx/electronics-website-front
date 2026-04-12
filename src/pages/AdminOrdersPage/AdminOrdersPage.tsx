import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, message, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AdminLayout } from '@/widgets';
import { orderStatuses } from '@/shared';
import s from './AdminOrdersPage.module.scss';

interface OrderItem {
  priceAtTime: number;
}

interface Order {
  id: number;
  createdAt: string;
  items: OrderItem[];
  statusID: number;
}

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Order[]>('/api/orders');
      setOrders(response.data);
    } catch (error) {
      message.error('Не удалось загрузить заказы');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: number, newStatusId: number) => {
    setUpdatingStatusId(orderId);
    try {
      await axios.put(`/api/orders/${orderId}`, { statusID: newStatusId });
      message.success('Статус заказа обновлён');
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, statusID: newStatusId } : order
        )
      );
    } catch (error) {
      message.error('Ошибка при обновлении статуса');
      console.error(error);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const columns: ColumnsType<Order> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Дата',
      key: 'createdAt',
      render: (_, record) => {
        const date = new Date(record.createdAt);
        const formatted = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}.${date.getFullYear()}`;
        return formatted;
      },
    },
    {
      title: 'Количество товаров',
      key: 'quantity',
      render: (_, record) => record.items.length,
    },
    {
      title: 'Сумма',
      key: 'total',
      render: (_, record) => {
        const total = record.items.reduce((sum, item) => sum + (item.priceAtTime || 0), 0);
        return `${total.toLocaleString()} ₽`;
      },
    },
    {
      title: 'Статус',
      key: 'status',
      render: (_, record) => {
        const currentStatus = orderStatuses.find(s => s.id === record.statusID);
        return (
          <select
            value={record.statusID}
            onChange={(e) => updateOrderStatus(record.id, Number(e.target.value))}
            disabled={updatingStatusId === record.id}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--background-body)',
              color: 'var(--color-text)',
              cursor: updatingStatusId === record.id ? 'wait' : 'pointer'
            }}
          >
            {orderStatuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <div className={s.orders}>
        <h1>Все заказы ({orders.length})</h1>
        <Spin spinning={loading}>
          <Table
            dataSource={orders}
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