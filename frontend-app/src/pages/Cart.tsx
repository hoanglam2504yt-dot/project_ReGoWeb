import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { FaTrashAlt, FaShoppingCart, FaArrowLeft } from "react-icons/fa";

const Cart = () => {
  const { user } = useAuth();
  const { items, selectedTotalPrice, selectedItems, removeFromCart, updateQuantity, clearCart, toggleSelectItem, toggleSelectAll, allSelected } = useCart();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-8">
          <p className="text-gray-700 dark:text-gray-300">Vui lòng đăng nhập để xem giỏ hàng.</p>
          <Link to="/login" className="inline-block mt-4 px-5 py-2 bg-purple-600 text-white rounded-lg">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-8">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Hãy thêm sản phẩm từ trang yêu thích hoặc trang chủ.</p>
          <Link to="/" className="inline-block px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-purple-600 dark:text-purple-400 hover:underline text-sm inline-flex items-center gap-2"
      >
        <FaArrowLeft /> Quay lại
      </button>

      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FaShoppingCart /> Giỏ hàng ({items.reduce((sum, i) => sum + i.quantity, 0)} sản phẩm)
            </h2>
          </div>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
          >
            <FaTrashAlt /> Xóa tất cả
          </button>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {items.map((item) => (
            <div key={item.id} className="p-5 flex gap-5">
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => toggleSelectItem(item.id)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 mt-2"
              />
              <img
                src={item.image}
                alt={item.name}
                className="w-28 h-28 object-cover rounded-lg"
              />
              <div className="flex-1 space-y-2">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">{item.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.condition}</p>
                <p className="text-purple-600 font-semibold">{item.price.toLocaleString("vi-VN")}đ</p>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Xóa"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Đã chọn {selectedItems.length} sản phẩm ({selectedItems.reduce((sum, i) => sum + i.quantity, 0)} món)</span>
          </div>
          <div className="flex justify-between items-center text-lg font-semibold mb-4">
            <span>Tổng cộng:</span>
            <span className="text-2xl text-purple-600">{selectedTotalPrice.toLocaleString("vi-VN")}đ</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={selectedItems.length === 0}
            className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tiến hành thanh toán ({selectedItems.length} sản phẩm)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;