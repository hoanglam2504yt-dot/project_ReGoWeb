import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useOrders } from "../contexts/OrderContext";
import type { OrderStatus } from "../contexts/OrderContext";

const statusLabels: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-500" },
  processing: { label: "Đang xử lý", color: "bg-blue-500" },
  shipping: { label: "Đang giao hàng", color: "bg-purple-500" },
  delivered: { label: "Đã giao", color: "bg-green-500" },
  cancelled: { label: "Đã hủy", color: "bg-red-500" },
};

const Orders = () => {
  const { user } = useAuth();
  const { orders, loading, cancelOrder } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-8">
          <p className="text-gray-700 dark:text-gray-300">Vui lòng đăng nhập để xem đơn hàng.</p>
          <Link to="/login" className="inline-block mt-4 px-5 py-2 bg-purple-600 text-white rounded-lg">Đăng nhập</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-8">
          <p className="text-gray-700 dark:text-gray-300">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-8">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Chưa có đơn hàng nào</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Hãy mua sắm và quay lại để theo dõi đơn hàng.</p>
          <Link to="/" className="px-5 py-2 bg-purple-600 text-white rounded-lg">Mua sắm ngay</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">📋 Đơn hàng của tôi</h1>
      {orders.map(order => (
        <div key={order.id} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Mã đơn: <span className="font-mono">{order.id}</span></p>
              <p className="text-xs text-gray-400">Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusLabels[order.status].color}`}>
                {statusLabels[order.status].label}
              </span>
              {(order.status === "pending" || order.status === "processing") && (
                <button
                  onClick={async () => {
                    if (confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
                      try {
                        await cancelOrder(order.id);
                        alert("Đã hủy đơn hàng thành công!");
                      } catch (error) {
                        alert("Không thể hủy đơn hàng. Vui lòng thử lại!");
                      }
                    }
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Hủy đơn
                </button>
              )}
              <button
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                className="text-purple-600 hover:underline text-sm"
              >
                {expandedOrder === order.id ? "Thu gọn" : "Chi tiết"}
              </button>
            </div>
          </div>
          <div className="p-5">
            <div className="flex justify-between text-sm">
              <span>Tổng tiền:</span>
              <span className="font-bold text-purple-600">{order.finalAmount.toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>Phương thức thanh toán:</span>
              <span>{order.paymentMethod}</span>
            </div>
          </div>
          {expandedOrder === order.id && (
            <div className="p-5 pt-0 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-2">Sản phẩm:</h3>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500">x{item.quantity} • {item.price.toLocaleString("vi-VN")}đ</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-1">Thông tin giao hàng:</h3>
                <p className="text-sm">{order.shippingInfo.fullName} - {order.shippingInfo.phone}</p>
                <p className="text-sm">{order.shippingInfo.address}, {order.shippingInfo.city}</p>
                {order.shippingInfo.note && <p className="text-sm text-gray-500">Ghi chú: {order.shippingInfo.note}</p>}
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-1">Lịch sử trạng thái:</h3>
                <div className="space-y-1 text-xs text-gray-500">
                  {order.statusHistory.map((h, idx) => (
                    <div key={idx}>• {new Date(h.time).toLocaleString()} - {statusLabels[h.status].label} {h.note && `(${h.note})`}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Orders;
