import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  condition: string;
  seller: string;
  location: string;
  image: string;
  quantity: number;
  selected: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity' | 'selected'>, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  toggleSelectItem: (id: number) => void; // Toggle chọn 1 sản phẩm
  toggleSelectAll: () => void; // Toggle chọn tất cả
  clearCart: () => void;
  totalPrice: number;
  selectedItems: CartItem[]; // Danh sách sản phẩm được chọn
  selectedTotalPrice: number; // Tổng tiền sản phẩm được chọn
  allSelected: boolean; // Tất cả có được chọn không
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`cart_${user.id}`);
      if (stored) setItems(JSON.parse(stored));
      else setItems([]);
    } else {
      setItems([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(items));
    }
  }, [items, user]);

  const addToCart = (item: Omit<CartItem, 'quantity' | 'selected'>, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...item, quantity, selected: true }]; // Mặc định chọn sản phẩm mới
    });
  };

  const removeFromCart = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const toggleSelectItem = (id: number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, selected: !item.selected } : item));
  };

  const toggleSelectAll = () => {
    const allSelected = items.every(item => item.selected);
    setItems(prev => prev.map(item => ({ ...item, selected: !allSelected })));
  };

  const clearCart = () => setItems([]);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedItems = items.filter(item => item.selected);
  const selectedTotalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const allSelected = items.length > 0 && items.every(item => item.selected);

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      toggleSelectItem,
      toggleSelectAll,
      clearCart, 
      totalPrice,
      selectedItems,
      selectedTotalPrice,
      allSelected
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};