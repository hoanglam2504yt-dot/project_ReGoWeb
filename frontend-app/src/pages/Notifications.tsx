import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

// Mock dữ liệu thông báo
const mockNotifications = [
  { id: 1, title: "🎉 Chào mừng bạn đến với Oreka!", content: "Hãy khám phá hàng ngàn sản phẩm chất lượng.", time: "2 giờ trước", isRead: false },
  { id: 2, title: "❤️ Sản phẩm bạn yêu thích đã giảm giá", content: "iPhone 12 Pro Max giảm 15% chỉ còn 10.6 triệu.", time: "Hôm qua", isRead: false },
  { id: 3, title: "📦 Đơn hàng #OR1234 đã được giao thành công", content: "Cảm ơn bạn đã mua sắm tại Oreka.", time: "2 ngày trước", isRead: true },
  { id: 4, title: "💬 Người dùng đã nhắn tin về sản phẩm của bạn", content: "Bạn có tin nhắn mới từ Nguyen Van A về MacBook.", time: "3 ngày trước", isRead: true },
];

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(noti => (noti.id === id ? { ...noti, isRead: true } : noti))
    );
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(noti => ({ ...noti, isRead: true })));
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-8">
          <p className="text-gray-700 dark:text-gray-300">Vui lòng đăng nhập để xem thông báo.</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Thông báo {unreadCount > 0 && `(${unreadCount} mới)`}
          </h2>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-sm text-purple-600 hover:underline"
            >
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {notifications.length === 0 ? (
            <div className="p-10 text-center text-gray-500 dark:text-gray-400">
              📭 Bạn chưa có thông báo nào.
            </div>
          ) : (
            notifications.map(noti => (
              <div
                key={noti.id}
                className={`p-4 transition ${!noti.isRead ? "bg-purple-50 dark:bg-purple-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-700/30"}`}
                onClick={() => markAsRead(noti.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{noti.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{noti.content}</p>
                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-2 block">{noti.time}</span>
                  </div>
                  {!noti.isRead && <span className="w-2 h-2 bg-purple-500 rounded-full mt-2"></span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;