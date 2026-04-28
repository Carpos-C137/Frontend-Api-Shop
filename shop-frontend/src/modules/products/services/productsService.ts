import { apiClient } from "@/lib/api";
import { Product, CreateProductDto, UpdateProductDto } from "@/types/api";
export const productsService = {
  getAll: () => apiClient.get<Product[]>("/api/products"),
  getAllAdmin: () => apiClient.get<Product[]>("/api/products/admin/all"),
  getBySku: (sku: string) => apiClient.get<Product>(`/api/products/${sku}`),
  create: (data: CreateProductDto) => apiClient.post<Product>("/api/products", data),
  update: (sku: string, data: UpdateProductDto) => apiClient.patch<Product>(`/api/products/${sku}`, data),
  delete: (sku: string) => apiClient.delete<void>(`/api/products/${sku}`),
};
