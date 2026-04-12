import { 
  DropboxOutlined, 
  LoadingOutlined, 
  CheckOutlined, 
  CloseOutlined, 
  ReloadOutlined, 
  ShoppingOutlined, 
  WarningOutlined 
} from "@ant-design/icons";
import axios from 'axios';
import { useState, useEffect } from 'react';

// Интерфейсы для типизации ответов API
interface Product {
  inStock: number;
  // другие поля при необходимости
}

interface Order {
  statusID: number;
  // другие поля при необходимости
}

// Базовый массив объектов (без statsNumber)
const baseAdminStats = [
  { name: "Всего товаров", icon: DropboxOutlined },
  { name: "Активные заказы", icon: LoadingOutlined },
  { name: "Выполнено заказов", icon: CheckOutlined },
  { name: "Отменено заказов", icon: CloseOutlined },
  { name: "Возвращено заказов", icon: ReloadOutlined },
  { name: "Осталось на складе", icon: ShoppingOutlined },
  { name: "Заканчивается", icon: WarningOutlined },
  { name: "Нет в наличии", icon: CloseOutlined },
];

// Кастомный хук для получения статистики
export const useAdminStats = () => {
  const [stats, setStats] = useState(
    baseAdminStats.map(item => ({ ...item, statsNumber: null as number | null }))
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Параллельные запросы к API
        const [productsRes, ordersRes] = await Promise.all([
          axios.get<Product[]>('/api/products'),
          axios.get<Order[]>('/api/orders')
        ]);

        const products = productsRes.data;
        const orders = ordersRes.data;

        // Вычисления согласно заданию с явной типизацией
        const totalProducts = products.length;
        const activeOrders = orders.filter((o: Order) => o.statusID >= 1 && o.statusID <= 5).length;
        const completedOrders = orders.filter((o: Order) => o.statusID === 6).length;
        const cancelledOrders = orders.filter((o: Order) => o.statusID === 7).length;
        const returnedOrders = orders.filter((o: Order) => o.statusID === 8).length;
        const totalInStock = products.reduce((sum: number, p: Product) => sum + (p.inStock || 0), 0);
        const lowStock = products.filter((p: Product) => p.inStock <= 10).length;
        const outOfStock = products.filter((p: Product) => p.inStock === 0).length;

        const statsNumbers = [
          totalProducts,
          activeOrders,
          completedOrders,
          cancelledOrders,
          returnedOrders,
          totalInStock,
          lowStock,
          outOfStock
        ];

        // Добавляем statsNumber к каждому объекту
        const updatedStats = baseAdminStats.map((item, index) => ({
          ...item,
          statsNumber: statsNumbers[index]
        }));

        setStats(updatedStats);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};