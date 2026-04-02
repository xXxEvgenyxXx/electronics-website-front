import { useEffect, useState, useRef, useCallback } from 'react';
import { MainLayout } from '@/widgets';
import { Form, Input, Button, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Product } from '@/widgets';
import s from './DeliveryPage.module.scss';

interface CartItem {
  id: number;
  quantity: number;
}

interface User {
  id: number;
  login: string;
  email: string;
  name: string;
  surname: string;
  patronymic: string;
  role: { id: number; name: string };
}

const CART_KEY = 'catalog_cart';
const USER_KEY = 'user';

const getCart = (): CartItem[] => {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
};

const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};

const getUser = (): User | null => {
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export function DeliveryPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const isSubmittingRef = useRef(false);
  const isMountedRef = useRef(true);
  const hasInitializedRef = useRef(false);

  // Проверка авторизации и загрузка данных
  useEffect(() => {
    isMountedRef.current = true;

    const user = getUser();
    if (!user) {
      message.error('Необходимо войти в систему');
      navigate('/login');
      return;
    }

    const cart = getCart();
    if (cart.length === 0) {
      message.warning('Корзина пуста');
      navigate('/cart');
      return;
    }

    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    setCartItems(cart);

    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Ошибка загрузки товаров');
        const allProducts: Product[] = await res.json();
        if (!isMountedRef.current) return;

        const cartProductIds = cart.map(item => item.id);
        const cartProducts = allProducts.filter(p => cartProductIds.includes(p.id));
        setProducts(cartProducts);
      } catch (error) {
        if (isMountedRef.current) {
          message.error('Ошибка загрузки товаров');
          navigate('/cart');
        }
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMountedRef.current = false;
    };
  }, [navigate]);

  // Заполнение формы данными пользователя
  useEffect(() => {
    const user = getUser();
    if (user && !loading) {
      const fullName = `${user.surname} ${user.name} ${user.patronymic}`.trim();
      form.setFieldsValue({
        fullName: fullName,
        email: user.email,
        phone: '',
        address: '',
      });
    }
  }, [loading, form]);

  const getProductById = useCallback((id: number) => products.find(p => p.id === id), [products]);

  const totalPrice = cartItems.reduce((sum, item) => {
    const product = getProductById(item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const onFinish = useCallback(async (values: any) => {
    if (isSubmittingRef.current || submitting) {
      console.log('Отправка уже выполняется, игнорируем');
      return;
    }

    const user = getUser();
    if (!user) {
      message.error('Пользователь не авторизован');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      message.error('Корзина пуста');
      navigate('/cart');
      return;
    }

    isSubmittingRef.current = true;
    setSubmitting(true);

    let createdOrderId: number | null = null;

    try {
      // 1. Создаём заказ (только userID и statusID)
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userID: Number(user.id),
          statusID: 1, // "Новый"
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Не удалось создать заказ');
      }

      const order = await orderResponse.json();
      createdOrderId = order.id;

      // 2. Добавляем товары в заказ через /api/order-items
      for (const item of cartItems) {
        const product = getProductById(item.id);
        if (!product) {
          throw new Error(`Товар с id ${item.id} не найден`);
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

      // Успех – очищаем корзину и уходим в каталог
      if (isMountedRef.current) {
        message.success('Заказ успешно оформлен!');
        clearCart();
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
  }, [cartItems, products, getProductById, navigate, submitting]);

  if (loading) {
    return (
      <MainLayout>
        <div className={s.loadingContainer}>
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  if (cartItems.length === 0) {
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
            {cartItems.map(item => {
              const product = getProductById(item.id);
              if (!product) return null;
              return (
                <div key={item.id} className={s.summaryItem}>
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