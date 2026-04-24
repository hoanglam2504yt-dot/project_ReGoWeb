import axios from 'axios';
import { API_BASE_URL } from '../config/api';

function extractApiMessage(err: unknown): string | undefined {
  if (axios.isAxiosError(err)) {
    const d = err.response?.data as { message?: string } | undefined;
    return typeof d?.message === 'string' ? d.message : undefined;
  }
  return undefined;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  productType: 'sale' | 'free';
  categoryId?: number;
  categoryName?: string;
  userId?: number;
  userName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  productType: 'sale' | 'free';
  categoryId?: number;
  userId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Lấy tất cả sản phẩm
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<ApiResponse<Product[]>>(`${API_BASE_URL}/products`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Lấy sản phẩm theo ID
export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await axios.get<ApiResponse<Product>>(`${API_BASE_URL}/products/${id}`);
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Product not found');
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Tạo sản phẩm mới với ảnh
export const createProduct = async (product: ProductRequest, images?: File[]): Promise<Product> => {
  try {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('productType', product.productType);
    formData.append('categoryId', product.categoryId?.toString() || '');
    formData.append('userId', product.userId.toString());
    
    // Thêm ảnh nếu có
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }
    
    const response = await axios.post<ApiResponse<Product>>(`${API_BASE_URL}/products`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to create product');
  } catch (error) {
    console.error('Error creating product:', error);
    const msg = extractApiMessage(error);
    if (msg) throw new Error(msg);
    throw error;
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (id: number, product: ProductRequest): Promise<Product> => {
  try {
    const response = await axios.put<ApiResponse<Product>>(`${API_BASE_URL}/products/${id}`, product);
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to update product');
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Xóa sản phẩm
export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/products/${id}`);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Lấy sản phẩm theo category
export const getProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  try {
    const response = await axios.get<ApiResponse<Product[]>>(`${API_BASE_URL}/products/category/${categoryId}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

// Lấy sản phẩm theo user
export const getProductsByUser = async (userId: number): Promise<Product[]> => {
  try {
    const response = await axios.get<ApiResponse<Product[]>>(`${API_BASE_URL}/products/user/${userId}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching products by user:', error);
    throw error;
  }
};

// Tìm kiếm sản phẩm
export const searchProducts = async (keyword: string): Promise<Product[]> => {
  try {
    const response = await axios.get<ApiResponse<Product[]>>(`${API_BASE_URL}/products/search`, {
      params: { keyword }
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// Lấy sản phẩm theo loại (sale hoặc free)
export const getProductsByType = async (type: 'sale' | 'free'): Promise<Product[]> => {
  try {
    const response = await axios.get<ApiResponse<Product[]>>(`${API_BASE_URL}/products/type/${type}`);
    return response.data.data || [];
  } catch (error) {
    console.error(`Error fetching ${type} products:`, error);
    const msg = extractApiMessage(error);
    if (msg) throw new Error(msg);
    throw error;
  }
};

// Lấy sản phẩm đăng bán
export const getSaleProducts = async (): Promise<Product[]> => {
  return getProductsByType('sale');
};

// Lấy sản phẩm tặng
export const getFreeProducts = async (): Promise<Product[]> => {
  return getProductsByType('free');
};
