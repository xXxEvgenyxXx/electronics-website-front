import { useEffect, useState } from 'react';
import { MainLayout } from '@/widgets';
import { useNavigate } from 'react-router-dom';
import { Button, InputNumber, message, Empty } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { getCurrentUser,  updateUserCart, getAllProducts, type User, type CartItem } from '@/shared';
import type { Product } from '@/widgets';
import s from './CartPage.module.scss';

export function CartPage() {
  const [user, setUser] = useState<User | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedUser, fetchedProducts] = await Promise.all([
          getCurrentUser(),
          getAllProducts()
        ]);
        setUser(fetchedUser);
        setAllProducts(fetchedProducts);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        message.error('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getProductById = (id: number): Product | undefined => {
    return allProducts.find(p => p.id === id);
  };

  const updateCart = async (newCart: CartItem[]) => {
    if (!user) return;
    
    const previousCart = user.cart;
    setUser({ ...user, cart: newCart });
    
    try {
      const updatedUser = await updateUserCart(user.id, newCart);
      setUser(updatedUser);
    } catch (error) {
      setUser({ ...user, cart: previousCart });
      message.error('Не удалось обновить корзину');
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (!user) return;
    
    const updatedCart = user.cart.map(item =>
      item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    updateCart(updatedCart);
  };

  const removeItem = (productId: number) => {
    if (!user) return;
    
    const updatedCart = user.cart.filter(item => item.productId !== productId);
    updateCart(updatedCart);
    
    if (updatedCart.length === 0) {
      message.info('Корзина пуста');
    }
  };

  const totalPrice = user?.cart.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0) || 0;

  const handleCheckout = () => {
    if (!user || user.cart.length === 0) {
      message.warning('Корзина пуста');
      return;
    }
    navigate('/delivery');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className={s.loadingContainer}>
          <div className={s.loading}>Загрузка...</div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className={s.emptyCart}>
          <Empty description="Не удалось загрузить данные пользователя" />
        </div>
      </MainLayout>
    );
  }

  if (user.cart.length === 0) {
    return (
      <MainLayout>
        <div className={s.emptyCart}>
          <Empty description="Корзина пуста" />
          <Button type="primary" onClick={() => navigate('/catalog')}>
            Перейти в каталог
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={s.cartPageWrapper}>
        <h1>Корзина</h1>
        <div className={s.cartContent}>
          <div className={s.itemsList}>
            {user.cart.map(item => {
              const product = getProductById(item.productId);
              if (!product) return null;
              return (
                <div key={item.productId} className={s.cartItem}>
                  <div className={s.itemInfo}>
                    <div className={s.itemName}>{product.name}</div>
                    <div className={s.itemPrice}>{product.price} ₽</div>
                  </div>
                  <div className={s.itemActions}>
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(val) => updateQuantity(item.productId, val || 1)}
                    />
                    <Button
                      onClick={() => removeItem(item.productId)}
                      icon={<DeleteOutlined />}
                      danger
                    />
                  </div>
                  <div className={s.itemTotal}>
                    {product.price * item.quantity} ₽
                  </div>
                </div>
              );
            })}
          </div>
          <div className={s.summary}>
            <h3>Итого: {totalPrice} ₽</h3>
            <Button type="primary" size="large" onClick={handleCheckout} icon={<ShoppingOutlined />}>
              Оформить заказ
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}