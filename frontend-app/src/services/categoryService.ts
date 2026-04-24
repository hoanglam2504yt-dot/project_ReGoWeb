import axios from "axios";
import { API_BASE_URL } from "../config/api";

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  parent?: Category;
  subCategories?: Category[];
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Lấy tất cả categories
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get<ApiResponse<Category[]>>(`${API_BASE_URL}/categories`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Lấy parent categories
export const getParentCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get<ApiResponse<Category[]>>(`${API_BASE_URL}/categories/parents`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching parent categories:', error);
    throw error;
  }
};

/**
 * Danh mục để hiển thị trên UI (trang chủ, form đăng tin).
 * Ưu tiên danh mục gốc (parent_id = null); nếu không có thì lấy toàn bộ
 * (trường hợp DB chỉ có danh mục con hoặc dữ liệu phẳng).
 */
export const getCategoriesForDisplay = async (): Promise<Category[]> => {
  const parents = await getParentCategories();
  if (parents.length > 0) {
    return parents;
  }
  return getAllCategories();
};

// Lấy category theo ID
export const getCategoryById = async (id: number): Promise<Category> => {
  try {
    const response = await axios.get<ApiResponse<Category>>(`${API_BASE_URL}/categories/${id}`);
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Category not found');
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

// Lấy sub-categories
export const getSubCategories = async (parentId: number): Promise<Category[]> => {
  try {
    const response = await axios.get<ApiResponse<Category[]>>(`${API_BASE_URL}/categories/${parentId}/subcategories`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
};
