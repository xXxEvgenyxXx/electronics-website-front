import { HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import s from './CatalogCard.module.scss';

export interface Category {
  id: number;
  name: string;
}

export interface Manufacturer {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  inStock: number;
  price: number;
  category: Category;
  manufacturer: Manufacturer;
}

interface CatalogCardProps {
  product: Product;
  isFavorite: boolean;
  isInCart?: boolean;
  onToggleFavorite: (productId: number) => void;
  onAddToCart: (productId: number) => void;
}

export function CatalogCard({
  product,
  isFavorite,
  isInCart = false,
  onToggleFavorite,
  onAddToCart,
}: CatalogCardProps) {
  const stockStatus = product.inStock > 0 ? 'Есть в наличии' : 'Нет в наличии';
  const stockClass = product.inStock > 0 ? s.inStock : s.outOfStock;

  return (
    <div className={s.catalogCard}>
      <div className={s.cardHeader}>
        <h4>{product.name}</h4>
        <Button
          type="text"
          icon={isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
          onClick={() => onToggleFavorite(product.id)}
        />
      </div>
      <div className={s.cardBody}>
        <p className={s.price}>{product.price} ₽</p>
        <p className={s.manufacturer}>Производитель: {product.manufacturer.name}</p>
        <p className={`${s.stock} ${stockClass}`}>{stockStatus}</p>
      </div>
      <div className={s.cardFooter}>
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={() => onAddToCart(product.id)}
          disabled={product.inStock === 0 || isInCart}
        >
          {isInCart ? 'В корзине' : 'В корзину'}
        </Button>
      </div>
    </div>
  );
}