export interface AuthResponse {
  message: string;
  user: { id: number; name: string; email: string; role: string };
  access_token: string;
}
export interface LoginDto { email: string; password: string; }
export interface RegisterDto { name: string; email: string; password: string; age?: number; }
export interface User { id: number; name: string; email: string; role: string; age?: number; }
export interface UpdateUserDto { name?: string; email?: string; age?: number; }
export interface Category { id: number; name: string; description?: string; products?: Product[]; }
export interface CreateCategoryDto { name: string; description?: string; }
export interface Product {
  sku: string; name: string; description?: string;
  price: number; stock: number; isActive: boolean; category?: Category;
}
export interface CreateProductDto {
  sku: string; name: string; description?: string;
  price: number; stock?: number; categoryId?: number; isActive?: boolean;
}
export interface UpdateProductDto {
  name?: string; description?: string; price?: number;
  stock?: number; categoryId?: number; isActive?: boolean;
}
export interface CartItem { id: number; quantity: number; product: Product; }
export interface Cart { id: number; items: CartItem[]; updatedAt: string; }
export interface AddToCartDto { productSku: string; quantity: number; }
export interface UpdateCartItemDto { quantity: number; }
export interface OrderItem { id: number; quantity: number; unitPrice: number; product: Product; }
export interface Order {
  id: number; total: number; status: 'pending' | 'confirmed' | 'cancelled';
  date: string; user: User; items: OrderItem[];
}
export interface CreateOrderDto { items: { productSku: string; quantity: number }[]; }
