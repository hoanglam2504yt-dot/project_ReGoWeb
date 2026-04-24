import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useOrders } from "../contexts/OrderContext";
import { FaMapMarkerAlt, FaBox, FaTruck, FaMoneyBillWave, FaCreditCard, FaCheckCircle, FaEdit } from "react-icons/fa";

// Các phương thức vận chuyển
const shippingMethods = [
  { id: "standard", name: "Giao hàng tiêu chuẩn", fee: 30000, days: "2-4 ngày làm việc" },
  { id: "express", name: "Giao hàng nhanh", fee: 50000, days: "1-2 ngày làm việc" },
];

const Checkout = () => {
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const [selectedShipping, setSelectedShipping] = useState(shippingMethods[0]);
  const [paymentMethod, setPaymentMethod] = useState<"banking" | "cod" | "momo">("banking");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [noteForSeller, setNoteForSeller] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
  });

  // Tính toán
  const discountShipping = 15000; // Giảm giá phí vận chuyển
  const shippingFee = selectedShipping.fee;
  const finalAmount = totalPrice + shippingFee - discountShipping;

  // Nếu chưa đăng nhập
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <p className="text-gray-700 dark:text-gray-300 mb-4">Vui lòng đăng nhập để thanh toán.</p>
          <Link to="/login" className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  // Nếu giỏ hàng trống
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-2 dark:text-white">Giỏ hàng trống</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">Hãy thêm sản phẩm trước khi thanh toán.</p>
          <Link to="/" className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert("Vui lòng đồng ý với Điều khoản Dịch vụ trước khi thanh toán.");
      return;
    }
    
    // Validate shipping info
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng.");
      return;
    }
    
    setIsProcessing(true);
    try {
      await createOrder({
        items: items.map(item => ({ ...item })),
        totalAmount: totalPrice,
        shippingFee,
        discountAmount: discountShipping,
        finalAmount,
        shippingInfo: {
          fullName: shippingInfo.fullName,
          email: user.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          note: noteForSeller,
        },
        paymentMethod: paymentMethod === "cod" ? "COD" : paymentMethod === "banking" ? "Chuyển khoản ngân hàng" : "Ví MoMo",
        status: "pending",
      });
      
      clearCart();
      alert("✅ Đặt hàng thành công! Cảm ơn bạn đã mua sắm.");
      navigate("/orders");
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveAddress = () => {
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    setIsEditingAddress(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cột trái - Thông tin chính */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Địa chỉ giao hàng */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-teal-600 text-xl" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Địa chỉ giao hàng</h3>
              </div>
              <button 
                onClick={() => setIsEditingAddress(!isEditingAddress)}
                className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
              >
                <FaEdit /> {isEditingAddress ? "Hủy" : "Thay đổi"}
              </button>
            </div>
            
            {isEditingAddress ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.fullName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                    placeholder="Nhập họ và tên"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                    placeholder="Nhập số điện thoại"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Địa chỉ chi tiết <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    placeholder="Số nhà, tên đường, phường/xã"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quận/Huyện, Tỉnh/Thành phố
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    placeholder="VD: Quận 1, TP. Hồ Chí Minh"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                
                <button
                  onClick={handleSaveAddress}
                  className="w-full py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
                >
                  Lưu địa chỉ
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="font-medium text-gray-800 dark:text-white">
                  {shippingInfo.fullName} | {shippingInfo.phone || "(+84) 912 345 678"}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {shippingInfo.address || "123 Đường Lê Lợi, Phường Bến Nghé"}{shippingInfo.city ? `, ${shippingInfo.city}` : ", Quận 1, TP. Hồ Chí Minh, Việt Nam"}
                </p>
              </div>
            )}
          </div>

          {/* 2. Sản phẩm */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <FaBox className="text-teal-600 text-xl" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Sản phẩm</h3>
            </div>
            
            {items.map((item, index) => (
              <div key={index} className="flex gap-4 pb-4 mb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0 last:mb-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-1">{item.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Người bán: {item.seller}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">SL: {item.quantity}</span>
                    <span className="font-semibold text-teal-600">{item.price.toLocaleString("vi-VN")} ₫</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Tin nhắn cho người bán */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tin nhắn cho người bán (Không bắt buộc)
              </label>
              <textarea
                rows={2}
                value={noteForSeller}
                onChange={(e) => setNoteForSeller(e.target.value)}
                placeholder="Lưu ý cho người bán..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          {/* 3. Phương thức vận chuyển */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <FaTruck className="text-teal-600 text-xl" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Phương thức vận chuyển</h3>
            </div>
            
            <div className="space-y-3">
              {shippingMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition ${
                    selectedShipping.id === method.id
                      ? "border-teal-600 bg-teal-50 dark:bg-teal-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-teal-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={selectedShipping.id === method.id}
                      onChange={() => setSelectedShipping(method)}
                      className="w-4 h-4 text-teal-600"
                    />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{method.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Dự kiến giao hàng: {method.days}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {method.fee.toLocaleString("vi-VN")} ₫
                    </p>
                    {selectedShipping.id === method.id && (
                      <button className="text-teal-600 text-sm hover:underline mt-1">
                        Thay đổi
                      </button>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 4. Phương thức thanh toán */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <FaMoneyBillWave className="text-teal-600 text-xl" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Phương thức thanh toán</h3>
            </div>
            
            <div className="space-y-3">
              <label
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                  paymentMethod === "momo"
                    ? "border-teal-600 bg-teal-50 dark:bg-teal-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-teal-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="momo"
                  checked={paymentMethod === "momo"}
                  onChange={() => setPaymentMethod("momo")}
                  className="w-4 h-4 text-teal-600"
                />
                <img 
                  src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo.png" 
                  className="h-6" 
                  alt="MoMo" 
                />
                <span className="font-medium text-gray-800 dark:text-white">Ví MoMo</span>
              </label>

              <label
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                  paymentMethod === "banking"
                    ? "border-teal-600 bg-teal-50 dark:bg-teal-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-teal-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="banking"
                  checked={paymentMethod === "banking"}
                  onChange={() => setPaymentMethod("banking")}
                  className="w-4 h-4 text-teal-600"
                />
                <FaCreditCard className="text-blue-600 text-xl" />
                <span className="font-medium text-gray-800 dark:text-white">Chuyển khoản ngân hàng</span>
              </label>

              <label
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                  paymentMethod === "cod"
                    ? "border-teal-600 bg-teal-50 dark:bg-teal-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-teal-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="w-4 h-4 text-teal-600"
                />
                <FaMoneyBillWave className="text-green-600 text-xl" />
                <span className="font-medium text-gray-800 dark:text-white">Thanh toán khi nhận hàng (COD)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Cột phải - Chi tiết thanh toán */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Chi tiết thanh toán</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Tổng tiền hàng</span>
                <span className="font-medium">{totalPrice.toLocaleString("vi-VN")} ₫</span>
              </div>
              
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Phí vận chuyển</span>
                <span className="font-medium">{shippingFee.toLocaleString("vi-VN")} ₫</span>
              </div>
              
              <div className="flex justify-between text-green-600">
                <span>Giảm giá phí vận chuyển</span>
                <span className="font-medium">-{discountShipping.toLocaleString("vi-VN")} ₫</span>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800 dark:text-white">Tổng thanh toán</span>
                  <span className="text-xl font-bold text-teal-600">{finalAmount.toLocaleString("vi-VN")} ₫</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Đã bao gồm VAT (nếu có)</p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="w-full py-3 bg-teal-600 text-white rounded-xl font-semibold text-lg hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
            >
              {isProcessing ? (
                "Đang xử lý..."
              ) : (
                <>
                  <FaCheckCircle /> Xác nhận thanh toán
                </>
              )}
            </button>

            <label className="flex items-start gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-teal-600"
              />
              <span className="text-gray-600 dark:text-gray-400">
                Bằng việc nhấn "Xác nhận thanh toán", bạn đồng ý với{" "}
                <Link to="/terms" className="text-teal-600 hover:underline">
                  Điều khoản Dịch vụ
                </Link>{" "}
                của EcoMarket.
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
