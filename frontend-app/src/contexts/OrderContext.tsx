import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import type { CartItem } from "./CartContext";
import * as orderService from "../services/orderService";

export interface OrderItem extends CartItem {
  // Kế thừa từ CartItem
}

export type OrderStatus = "pending" | "processing" | "shipping" | "delivered" | "cancelled";

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  time: string;
  note?: string;
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  shippingInfo: ShippingInfo;
  paymentMethod: string;
  status: OrderStatus;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  createOrder: (orderData: Omit<Order, "id" | "userId" | "createdAt" | "updatedAt" | "statusHistory">) => Promise<void>;
  cancelOrder: (orderId: number) => Promise<void>;
  getOrderById: (orderId: number) => Order | undefined;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Tải đơn hàng từ backend khi user đăng nhập
  const refreshOrders = async () => {
    if (!user) {
      console.log("No user logged in, skipping order fetch");
      setOrders([]);
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.log("No token found, user needs to login");
      setOrders([]);
      return;
    }

    try {
      setLoading(true);
      const fetchedOrders = await orderService.getUserOrders();
      // Convert OrderResponse to Order
      const convertedOrders: Order[] = fetchedOrders.map(orderRes => ({
        id: orderRes.id,
        userId: orderRes.userId,
        items: orderRes.items.map(item => ({
          id: item.productId,
          name: item.productName,
          price: item.productPrice,
          originalPrice: item.productPrice,
          condition: "Đã qua sử dụng",
          seller: "Người bán",
          location: "Chưa rõ",
          image: item.productImage,
          quantity: item.quantity,
          selected: false,
        })),
        totalAmount: orderRes.totalAmount,
        shippingFee: orderRes.shippingFee,
        discountAmount: orderRes.discountAmount,
        finalAmount: orderRes.finalAmount,
        shippingInfo: orderRes.shippingInfo,
        paymentMethod: orderRes.paymentMethod,
        status: orderRes.status as OrderStatus,
        statusHistory: orderRes.statusHistory.map(h => ({
          status: h.status as OrderStatus,
          time: h.time,
          note: h.note,
        })),
        createdAt: orderRes.createdAt,
        updatedAt: orderRes.updatedAt,
      }));
      setOrders(convertedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshOrders();
  }, [user]);

  const createOrder = async (orderData: Omit<Order, "id" | "userId" | "createdAt" | "updatedAt" | "statusHistory">) => {
    if (!user) return;

    try {
      const orderRequest: orderService.CreateOrderRequest = {
        items: orderData.items.map(item => ({
          productId: item.id,
          productName: item.name,
          productPrice: item.price,
          productImage: item.image,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        })),
        totalAmount: orderData.totalAmount,
        shippingFee: orderData.shippingFee,
        discountAmount: orderData.discountAmount,
        finalAmount: orderData.finalAmount,
        shippingInfo: orderData.shippingInfo,
        paymentMethod: orderData.paymentMethod,
      };

      const newOrder = await orderService.createOrder(orderRequest);
      // Convert OrderResponse to Order
      const convertedOrder: Order = {
        id: newOrder.id,
        userId: newOrder.userId,
        items: newOrder.items.map(item => ({
          id: item.productId,
          name: item.productName,
          price: item.productPrice,
          originalPrice: item.productPrice,
          condition: "Đã qua sử dụng",
          seller: "Người bán",
          location: "Chưa rõ",
          image: item.productImage,
          quantity: item.quantity,
          selected: false,
        })),
        totalAmount: newOrder.totalAmount,
        shippingFee: newOrder.shippingFee,
        discountAmount: newOrder.discountAmount,
        finalAmount: newOrder.finalAmount,
        shippingInfo: newOrder.shippingInfo,
        paymentMethod: newOrder.paymentMethod,
        status: newOrder.status as OrderStatus,
        statusHistory: newOrder.statusHistory.map(h => ({
          status: h.status as OrderStatus,
          time: h.time,
          note: h.note,
        })),
        createdAt: newOrder.createdAt,
        updatedAt: newOrder.updatedAt,
      };
      setOrders(prev => [convertedOrder, ...prev]);
    } catch (error) {
      console.error("Failed to create order:", error);
      throw error;
    }
  };

  const cancelOrder = async (orderId: number) => {
    try {
      const updatedOrder = await orderService.cancelOrder(orderId);
      // Convert OrderResponse to Order
      const convertedOrder: Order = {
        id: updatedOrder.id,
        userId: updatedOrder.userId,
        items: updatedOrder.items.map(item => ({
          id: item.productId,
          name: item.productName,
          price: item.productPrice,
          originalPrice: item.productPrice,
          condition: "Đã qua sử dụng",
          seller: "Người bán",
          location: "Chưa rõ",
          image: item.productImage,
          quantity: item.quantity,
          selected: false,
        })),
        totalAmount: updatedOrder.totalAmount,
        shippingFee: updatedOrder.shippingFee,
        discountAmount: updatedOrder.discountAmount,
        finalAmount: updatedOrder.finalAmount,
        shippingInfo: updatedOrder.shippingInfo,
        paymentMethod: updatedOrder.paymentMethod,
        status: updatedOrder.status as OrderStatus,
        statusHistory: updatedOrder.statusHistory.map(h => ({
          status: h.status as OrderStatus,
          time: h.time,
          note: h.note,
        })),
        createdAt: updatedOrder.createdAt,
        updatedAt: updatedOrder.updatedAt,
      };
      setOrders(prev => prev.map(order => 
        order.id === orderId ? convertedOrder : order
      ));
    } catch (error) {
      console.error("Failed to cancel order:", error);
      throw error;
    }
  };

  const getOrderById = (orderId: number) => orders.find(o => o.id === orderId);

  return (
    <OrderContext.Provider value={{ orders, loading, createOrder, cancelOrder, getOrderById, refreshOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within OrderProvider");
  return context;
};