import { useEffect, useState } from 'react';
import { MainLayout } from '@/widgets';
import { useNavigate } from 'react-router-dom';
import { Button, InputNumber, message, Empty, Popconfirm } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import type { Product } from '@/widgets';
import s from './CartPage.module.scss';

interface CartItem {
  id: number;
  quantity: number;
}

const CART_KEY = 'catalog_cart';

const getCart = (): CartItem[] => {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveCart = (cart: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = getCart();
    setCartItems(cart);
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const allProducts: Product[] = await res.json();
        const cartProductIds = cart.map(item => item.id);
        const cartProducts = allProducts.filter(p => cartProductIds.includes(p.id));
        setProducts(cartProducts);
      } catch (error) {
        message.error('Ошибка загрузки товаров');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const updateQuantity = (productId: number, quantity: number) => {
    const updatedCart = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  const removeItem = (productId: number) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    saveCart(updatedCart);
    setProducts(prev => prev.filter(p => p.id !== productId));
    if (updatedCart.length === 0) {
      message.info('Корзина пуста');
    }
  };

  const getProductById = (id: number) => products.find(p => p.id === id);

  const totalPrice = cartItems.reduce((sum, item) => {
    const product = getProductById(item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.warning('Корзина пуста');
      return;
    }
    navigate('/delivery');
  };

  if (loading) {
    return <MainLayout><div className={s.loading}>Загрузка...</div></MainLayout>;
  }

  if (cartItems.length === 0) {
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
            {cartItems.map(item => {
              const product = getProductById(item.id);
              if (!product) return null;
              return (
                <div key={item.id} className={s.cartItem}>
                  <div className={s.itemInfo}>
                    <div className={s.itemName}>{product.name}</div>
                    <div className={s.itemPrice}>{product.price} ₽</div>
                  </div>
                  <div className={s.itemActions}>
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(val) => updateQuantity(item.id, val || 1)}
                    />
                    <Popconfirm
                      title="Удалить товар?"
                      onConfirm={() => removeItem(item.id)}
                      okText="Да"
                      cancelText="Нет"
                    >
                      <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
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