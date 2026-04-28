import { apiClient } from "@/lib/api";
import { Cart, AddToCartDto, UpdateCartItemDto } from "@/types/api";
export const cartService = {
  getCart: () => apiClient.get<Cart>("/api/cart"),
  addItem: (data: AddToCartDto) => apiClient.post<Cart>("/api/cart/items", data),
  updateItem: (id: number, data: UpdateCartItemDto) => apiClient.patch<Cart>(`/api/cart/items/${id}`, data),
  removeItem: (id: number) => apiClient.delete<Cart>(`/api/cart/items/${id}`),
  clearCart: () => apiClient.delete<{ message: string }>("/api/cart"),
};
