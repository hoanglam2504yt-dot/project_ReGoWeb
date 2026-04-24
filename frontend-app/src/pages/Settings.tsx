import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { FaUser, FaBell, FaShieldAlt, FaCreditCard, FaExchangeAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

type TabType = "account" | "notifications" | "security" | "payment" | "transactions";

const Settings = () => {
    const { user } = useAuth();
    useTheme();
    const [activeTab, setActiveTab] = useState<TabType>("account");
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    const tabs = [
        { id: "account", label: "Tài khoản", icon: FaUser },
        { id: "notifications", label: "Thông báo", icon: FaBell },
        { id: "security", label: "Bảo mật", icon: FaShieldAlt },
        { id: "payment", label: "Thanh toán", icon: FaCreditCard },
        { id: "transactions", label: "Giao dịch", icon: FaExchangeAlt },
    ];

    if (!user) return null;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar */}
                <div className="md:w-64 shrink-0">
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Cài đặt</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Quản lý tài khoản và trải nghiệm của bạn</p>
                        <nav className="space-y-1">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition ${activeTab === tab.id
                                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Nội dung chính */}
                <div className="flex-1">
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        {activeTab === "account" && (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Thông tin cá nhân</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Họ và Tên</label>
                                        <input type="text" defaultValue={user.name} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                        <input type="email" defaultValue={user.email} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thời sự (Bio)</label>
                                        <textarea rows={3} defaultValue="Nhà thiết kế sản phẩm đam mê sự tối giản và tính bền vững." className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"></textarea>
                                    </div>
                                    <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">Lưu thay đổi</button>
                                </div>

                                {/* Vùng nguy hiểm - chỉ hiển thị ở tab Tài khoản */}
                                <div className="mt-8 pt-6 border-t-2 border-red-200 dark:border-red-800">
                                    <h4 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">Vùng nguy hiểm</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        Xóa tài khoản là hành động không thể hoàn tất. Tất cả dữ liệu, bài đăng và lịch sử giao dịch của bạn sẽ bị xóa vĩnh viễn.
                                    </p>
                                    <button className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                                        Xóa tài khoản
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === "notifications" && (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Thông báo</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                        <div>
                                            <p className="font-medium">Email thông báo</p>
                                            <p className="text-sm text-gray-500">Nhận cảnh báo về các hoạt động quan trọng</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                        <div>
                                            <p className="font-medium">Tin nhắn trực tiếp</p>
                                            <p className="text-sm text-gray-500">Thông báo khi có tin nhắn mới</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                        <div>
                                            <p className="font-medium">Ưu đãi độc quyền</p>
                                            <p className="text-sm text-gray-500">Khuyến mãi dành riêng cho thành viên</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Bảo mật</h3>
                                <div className="space-y-4">
                                    <div>
                                        <button className="w-full md:w-auto px-5 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-left">Đổi mật khẩu</button>
                                        <p className="text-xs text-gray-500 mt-1">Nên đổi mật khẩu định kỳ 3 tháng một lần.</p>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                        <div>
                                            <p className="font-medium">Xác thực 2 yếu tố</p>
                                            <p className="text-sm text-gray-500">Tăng cường bảo mật tài khoản</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={twoFactorEnabled} onChange={() => setTwoFactorEnabled(!twoFactorEnabled)} />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>
                                    <div>
                                        <button className="px-5 py-2 bg-red-500 text-white rounded-lg">Quản lý thiết bị đã đăng nhập</button>
                                        <p className="text-xs text-gray-500 mt-1">Đăng xuất khỏi các thiết bị lạ.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "payment" && (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Thanh toán</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Phương thức thanh toán mặc định</label>
                                        <select className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
                                            <option>COD (Thanh toán khi nhận hàng)</option>
                                            <option>Chuyển khoản ngân hàng</option>
                                            <option>Ví MoMo</option>
                                        </select>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Gói Premium</span>
                                        <Link to="/payment" className="text-purple-600 hover:underline">Nâng cấp ngay</Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "transactions" && (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Lịch sử giao dịch</h3>
                                <div className="space-y-3">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <p className="font-medium">Mua hàng - Mã #ORD12345</p>
                                        <p className="text-sm text-gray-500">Ngày 15/03/2025 - 1.250.000đ</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <p className="font-medium">Nâng cấp Premium</p>
                                        <p className="text-sm text-gray-500">Ngày 01/02/2025 - 99.000đ</p>
                                    </div>
                                    <p className="text-center text-gray-500 text-sm">Hiển thị 2 trên tổng số 8 giao dịch</p>
                                </div>
                            </div>
                        )}


                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;