import { apiClient } from "@/lib/api";
import { AuthResponse, LoginDto, RegisterDto } from "@/types/api";
export const authService = {
  login: (data: LoginDto) => apiClient.post<AuthResponse>("/api/auth/login", data),
  register: (data: RegisterDto) => apiClient.post<AuthResponse>("/api/auth/register", data),
  profile: () => apiClient.get<AuthResponse["user"]>("/api/auth/profile"),
};
