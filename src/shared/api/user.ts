import type { User, CartItem } from "../types";

export async function getCurrentUser(): Promise<User> {
  const res = await fetch('/api/users/me');
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

export async function updateUserFavorites(userId: number, favoriteIds: number[]): Promise<User> {
  return updateUser(userId, { favoriteItems: favoriteIds as any });
}

export async function updateUserCart(userId: number, cart: CartItem[]): Promise<User> {
  return updateUser(userId, { cart });
}