import { useEffect, useState, useRef, useCallback } from 'react';
import { MainLayout } from '@/widgets';
import { Form, Input, Button, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getAllProducts, updateUserCart, type User } from '@/shared';
import type { Product } from '@/widgets';
import s from './DeliveryPage.module.scss';

export function DeliveryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const isSubmittingRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const fetchData = async () => {
      try {
        const fetchedUser = await getCurrentUser();
        
        if (!fetchedUser) {
          message.error('Необходимо войти в систему');
          navigate('/login');
          return;
        }

        if (fetchedUser.cart.length === 0) {
          message.warning('Корзина пуста');
          navigate('/cart');
          return;
        }

        const fetchedProducts = await getAllProducts();
        
        if (!isMountedRef.current) return;
        
        setUser(fetchedUser);
        setProducts(fetchedProducts);
        
        // Заполняем форму данными пользователя
        const fullName = `${fetchedUser.surname} ${fetchedUser.name} ${fetchedUser.patronymic || ''}`.trim();
        form.setFieldsValue({
          fullName: fullName,
          email: fetchedUser.email,
          phone: '',
          address: '',
        });
      } catch (error) {
        if (isMountedRef.current) {
          console.error('Failed to fetch data:', error);
          message.error('Ошибка загрузки данных');
          navigate('/cart');
        }
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMountedRef.current = false;
    };
  }, [navigate, form]);

  const getProductById = useCallback((id: number) => products.find(p => p.id === id), [products]);

  const totalPrice = user?.cart.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0) || 0;

  const onFinish = useCallback(async (values: any) => {
    if (isSubmittingRef.current || submitting || !user) {
      console.log('Отправка уже выполняется или пользователь не авторизован');
      return;
    }

    if (user.cart.length === 0) {
      message.error('Корзина пуста');
      navigate('/cart');
      return;
    }

    isSubmittingRef.current = true;
    setSubmitting(true);

    let createdOrderId: number | null = null;

    try {
      // 1. Создаём заказ
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userID: Number(user.id),
          statusID: 1,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Не удалось создать заказ');
      }

      const order = await orderResponse.json();
      createdOrderId = order.id;

      // 2. Добавляем товары в заказ
      for (const item of user.cart) {
        const product = getProductById(item.productId);
        if (!product) {
          throw new Error(`Товар с id ${item.productId} не найден`);
        }

        const orderItemData = {
          orderID: createdOrderId,
          productID: product.id,
          quantity: item.quantity,
          priceAtTime: Math.floor(product.price),
        };

        const itemResponse = await fetch('/api/order-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderItemData),
        });

        if (!itemResponse.ok) {
          const errorData = await itemResponse.json().catch(() => ({}));
          throw new Error(errorData.message || `Не удалось добавить товар ${product.name}`);
        }
      }

      // 3. Очищаем корзину пользователя
      await updateUserCart(user.id, []);

      if (isMountedRef.current) {
        message.success('Заказ успешно оформлен!');
        navigate('/catalog');
      }
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);

      // Откат: если заказ был создан, но товары не добавились – удаляем заказ
      if (createdOrderId !== null && isMountedRef.current) {
        try {
          await fetch(`/api/orders/${createdOrderId}`, { method: 'DELETE' });
          console.log(`Удалён пустой заказ #${createdOrderId}`);
        } catch (deleteError) {
          console.error('Не удалось удалить заказ:', deleteError);
        }
      }

      if (isMountedRef.current) {
        const errorMessage = error instanceof Error ? error.message : 'Ошибка при оформлении заказа';
        message.error(errorMessage);
      }
    } finally {
      if (isMountedRef.current) {
        setSubmitting(false);
      }
      isSubmittingRef.current = false;
    }
  }, [user, products, getProductById, navigate, submitting]);

  if (loading) {
    return (
      <MainLayout>
        <div className={s.loadingContainer}>
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  if (!user || user.cart.length === 0) {
    return (
      <MainLayout>
        <div className={s.emptyCart}>
          <p>Корзина пуста</p>
          <Button type="primary" onClick={() => navigate('/catalog')}>
            Перейти в каталог
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={s.deliveryPageWrapper}>
        <h1>Оформление заказа</h1>
        <div className={s.deliveryContent}>
          <div className={s.orderSummary}>
            <h2>Ваш заказ</h2>
            {user.cart.map(item => {
              const product = getProductById(item.productId);
              if (!product) return null;
              return (
                <div key={item.productId} className={s.summaryItem}>
                  <span>{product.name} x {item.quantity}</span>
                  <span>{product.price * item.quantity} ₽</span>
                </div>
              );
            })}
            <div className={s.total}>Итого: {totalPrice} ₽</div>
          </div>

          <div className={s.deliveryForm}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item name="fullName" label="ФИО">
                <Input disabled />
              </Form.Item>
              <Form.Item name="email" label="Email">
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Телефон"
                rules={[
                  { required: true, message: 'Введите телефон' },
                  { pattern: /^[\d+\s\-()]+$/, message: 'Введите корректный номер телефона' }
                ]}
              >
                <Input placeholder="+7 (123) 456-78-90" />
              </Form.Item>
              <Form.Item
                name="address"
                label="Адрес доставки"
                rules={[{ required: true, message: 'Введите адрес доставки' }]}
              >
                <Input.TextArea rows={3} placeholder="Город, улица, дом, квартира" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  disabled={submitting}
                  block
                  size="large"
                >
                  {submitting ? 'Оформление...' : 'Подтвердить заказ'}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}