import type { User, CartItem } from "../types";

const getUserId = (): number => {
  // 1. Пробуем прямые ключи
  const directId = localStorage.getItem('userId') || localStorage.getItem('id');
  if (directId) return Number(directId);

  // 2. Пробуем извлечь из объекта user
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.id) return Number(user.id);
    } catch {
      // игнорируем ошибку парсинга
    }
  }

  throw new Error('User not authenticated');
};

export async function getCurrentUser(): Promise<User> {
  const userId = getUserId();
  const res = await fetch(`/api/users/${userId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch user');
  }
  return res.json();
}

export async function updateUser(userId: number, updates: Partial<User>): Promise<User> {
  const res = await fetch(`/api/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) {
    throw new Error('Failed to update user');
  }
  return res.json();
}

export async function addFavorite(userId: number, productId: number): Promise<User> {
  const res = await fetch(`/api/users/${userId}/favorites/${productId}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to add favorite');
  return res.json();
}

export async function removeFavorite(userId: number, productId: number): Promise<User> {
  const res = await fetch(`/api/users/${userId}/favorites/${productId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to remove favorite');
  return res.json();
}

export async function updateUserCart(userId: number, cart: CartItem[]): Promise<User> {
  return updateUser(userId, { cart });
}
export function logout() {
  localStorage.removeItem('userId');
  localStorage.removeItem('id');
  localStorage.removeItem('user');
  // можно также сделать редирект на /login
}