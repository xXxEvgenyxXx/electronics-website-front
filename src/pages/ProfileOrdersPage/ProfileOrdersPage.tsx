import { useEffect, useState } from 'react';
import s from './ProfileOrdersPage.module.scss';
import { ProfileLayout } from '@/widgets';
import { orderStatuses } from '@/shared';

// Типы на основе ответа API
interface User {
  id: number;
  login: string;
  email: string;
  name: string;
  surname: string;
  patronymic: string;
}

interface Order {
  id: number;
  user: User;
  createdAt: string;
  statusID: number;
  items: unknown[];
}

export function ProfileOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // 1. Получаем текущего пользователя из localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          throw new Error('Пользователь не найден в localStorage. Пожалуйста, войдите в систему.');
        }
        const currentUser = JSON.parse(userStr) as User;
        const currentUserId = currentUser.id;

        // 2. Запрашиваем все заказы с API
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error(`Не удалось загрузить заказы: ${response.statusText}`);
        }
        const allOrders = (await response.json()) as Order[];

        // 3. Фильтруем заказы, принадлежащие текущему пользователю
        const userOrders = allOrders.filter(
          (order) => order.user.id === currentUserId
        );

        setOrders(userOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Форматирование даты в русскоязычном формате
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('ru-RU');
  };

  // Получение названия статуса из массива orderStatuses
  const getStatusText = (statusID: number) => {
    const status = orderStatuses.find((s) => s.id === statusID);
    return status ? status.name : 'Неизвестный статус';
  };

  if (loading) {
    return (
      <ProfileLayout>
        <div className={s.profileOrders}>
          <div className={s.loading}>Загрузка заказов...</div>
        </div>
      </ProfileLayout>
    );
  }

  if (error) {
    return (
      <ProfileLayout>
        <div className={s.profileOrders}>
          <div className={s.error}>Ошибка: {error}</div>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <div className={s.profileOrders}>
        <h2 className={s.title}>Мои заказы</h2>
        {orders.length === 0 ? (
          <div className={s.noOrders}>У вас нет заказов.</div>
        ) : (
          <div className={s.orderList}>
            {orders.map((order) => (
              <div key={order.id} className={s.orderCard}>
                <div className={s.orderHeader}>
                  <span className={s.orderId}>Заказ №{order.id}</span>
                  <span className={s.orderDate}>{formatDate(order.createdAt)}</span>
                </div>
                <div className={s.orderDetails}>
                  <div>Статус: {getStatusText(order.statusID)}</div>
                  <div>Товаров: {order.items.length}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}