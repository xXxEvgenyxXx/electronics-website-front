import { useEffect, useState } from 'react';
import s from './ProfileOrdersPage.module.scss';
import { ProfileLayout } from '@/widgets';

// Types based on the API response
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
  items: unknown[]; // Adjust if you have a more specific type for items
}

export function ProfileOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // 1. Get logged-in user from localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          throw new Error('User not found in localStorage. Please log in.');
        }
        const currentUser = JSON.parse(userStr) as User;
        const currentUserId = currentUser.id;

        // 2. Fetch all orders from the API
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.statusText}`);
        }
        const allOrders = (await response.json()) as Order[];

        // 3. Filter orders that belong to the current user
        const userOrders = allOrders.filter(
          (order) => order.user.id === currentUserId
        );

        setOrders(userOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper to format the createdAt date
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  // Helper to get status text (you can extend this mapping)
  const getStatusText = (statusID: number) => {
    switch (statusID) {
      case 1:
        return 'Pending';
      // Add more status mappings as needed
      default:
        return `Status ${statusID}`;
    }
  };

  if (loading) {
    return (
      <ProfileLayout>
        <div className={s.profileOrders}>
          <div className={s.loading}>Загружаем заказы...</div>
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
                  <span className={s.orderId}>Order #{order.id}</span>
                  <span className={s.orderDate}>{formatDate(order.createdAt)}</span>
                </div>
                <div className={s.orderDetails}>
                  <div>Status: {getStatusText(order.statusID)}</div>
                  <div>Items: {order.items.length}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}