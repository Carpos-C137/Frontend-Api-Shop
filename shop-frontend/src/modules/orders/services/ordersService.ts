import { apiClient } from "@/lib/api";
import { Order, CreateOrderDto } from "@/types/api";
export const ordersService = {
  getAll: () => apiClient.get<Order[]>("/api/orders"),
  getMyOrders: () => apiClient.get<Order[]>("/api/orders/my-orders"),
  getById: (id: number) => apiClient.get<Order>(`/api/orders/${id}`),
  create: (data: CreateOrderDto) => apiClient.post<Order>("/api/orders", data),
  delete: (id: number) => apiClient.delete<void>(`/api/orders/${id}`),
};
