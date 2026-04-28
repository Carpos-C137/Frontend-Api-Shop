import { apiClient } from "@/lib/api";
import { Category, CreateCategoryDto } from "@/types/api";
export const categoriesService = {
  getAll: () => apiClient.get<Category[]>("/api/categories"),
  getById: (id: number) => apiClient.get<Category>(`/api/categories/${id}`),
  create: (data: CreateCategoryDto) => apiClient.post<Category>("/api/categories", data),
  delete: (id: number) => apiClient.delete<void>(`/api/categories/${id}`),
};
