import { useEffect, useState } from 'react';
import { Collapse } from 'antd';
import s from './ProfileOrdersPage.module.scss';
import { ProfileLayout } from '@/widgets';
import { orderStatuses, getAllProducts } from '@/shared';
import type { Product } from '@/widgets';

const { Panel } = Collapse;

interface User {
  id: number;
  login: string;
  email: string;
  name: string;
  surname: string;
  patronymic: string;
}

interface OrderItem {
  id: number;         // это productId
  quantity: number;
  priceAtTime: number;
}

interface Order {
  id: number;
  user: User;
  createdAt: string;
  statusID: number;
  items: OrderItem[];
}

export function ProfileOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [productsMap, setProductsMap] = useState<Map<number, Product>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          throw new Error('Пользователь не найден в localStorage. Пожалуйста, войдите в систему.');
        }
        const currentUser = JSON.parse(userStr) as User;
        const currentUserId = currentUser.id;

        // Параллельная загрузка заказов и всех товаров
        const [ordersResponse, productsData] = await Promise.all([
          fetch('/api/orders'),
          getAllProducts()
        ]);

        if (!ordersResponse.ok) {
          throw new Error(`Не удалось загрузить заказы: ${ordersResponse.statusText}`);
        }
        const allOrders = (await ordersResponse.json()) as Order[];

        const userOrders = allOrders.filter(
          (order) => order.user.id === currentUserId
        );

        // Создаём Map для быстрого поиска продукта по id
        const map = new Map<number, Product>();
        productsData.forEach(product => map.set(product.id, product));

        setOrders(userOrders);
        setProductsMap(map);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('ru-RU');
  };

  const getStatusText = (statusID: number) => {
    const status = orderStatuses.find((s) => s.id === statusID);
    return status ? status.name : 'Неизвестный статус';
  };

  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + item.priceAtTime * item.quantity, 0);
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
                  <div>Сумма: {calculateTotal(order.items)} ₽</div>
                </div>
                <Collapse ghost className={s.orderCollapse}>
                  <Panel header="Состав заказа" key="1">
                    {order.items.length === 0 ? (
                      <div>Нет товаров в заказе</div>
                    ) : (
                      <div className={s.itemsList}>
                        {order.items.map((item) => {
                          const product = productsMap.get(item.id);
                          const productName = product?.name || `Товар #${item.id}`;
                          return (
                            <div key={`${order.id}-${item.id}`} className={s.itemRow}>
                              <span className={s.itemName}>
                                {productName} x {item.quantity}
                              </span>
                              <span className={s.itemPrice}>
                                {item.priceAtTime * item.quantity} ₽
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Panel>
                </Collapse>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}