import { API_BASE_URL } from "../config/api";

export interface OrderItem {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  quantity: number;
  subtotal: number;
}

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  shippingInfo: ShippingInfo;
  paymentMethod: string;
}

export interface OrderResponse {
  id: number;
  userId: number;
  items: Array<{
    id: number;
    productId: number;
    productName: string;
    productPrice: number;
    productImage: string;
    quantity: number;
    subtotal: number;
  }>;
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  shippingInfo: ShippingInfo;
  paymentMethod: string;
  status: string;
  statusHistory: Array<{
    status: string;
    note?: string;
    time: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const createOrder = async (orderData: CreateOrderRequest): Promise<OrderResponse> => {
  const token = localStorage.getItem("accessToken");
  
  if (!token) {
    throw new Error("No authentication token found. Please login again.");
  }
  
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to create order:", errorText);
    throw new Error(`Failed to create order: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const getUserOrders = async (): Promise<OrderResponse[]> => {
  const token = localStorage.getItem("accessToken");
  
  console.log("Fetching orders with token:", token ? "Token exists" : "No token");
  
  if (!token) {
    throw new Error("No authentication token found. Please login again.");
  }
  
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("Response status:", response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to fetch orders:", errorText);
    throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const getOrderById = async (orderId: number): Promise<OrderResponse> => {
  const token = localStorage.getItem("accessToken");
  
  if (!token) {
    throw new Error("No authentication token found. Please login again.");
  }
  
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to fetch order:", errorText);
    throw new Error(`Failed to fetch order: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const cancelOrder = async (orderId: number): Promise<OrderResponse> => {
  const token = localStorage.getItem("accessToken");
  
  if (!token) {
    throw new Error("No authentication token found. Please login again.");
  }
  
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to cancel order:", errorText);
    throw new Error(`Failed to cancel order: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
