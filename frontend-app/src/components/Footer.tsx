import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                            ReGo
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Nền tảng mua bán & trao đổi đồ cũ hàng đầu Việt Nam. Kết nối người bán và người mua một cách an toàn, tiện lợi.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Liên kết nhanh</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">Trang chủ</Link></li>
                            <li><Link to="/products" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">Sản phẩm</Link></li>
                            <li><Link to="/free-items" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">Đồ miễn phí</Link></li>
                            <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">Về chúng tôi</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Hỗ trợ</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">Câu hỏi thường gặp</Link></li>
                            <li><Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">Chính sách bảo mật</Link></li>
                            <li><Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">Điều khoản sử dụng</Link></li>
                            <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">Liên hệ</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Theo dõi</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-500 hover:text-purple-600 transition"><FaFacebook size={24} /></a>
                            <a href="#" className="text-gray-500 hover:text-purple-600 transition"><FaTwitter size={24} /></a>
                            <a href="#" className="text-gray-500 hover:text-purple-600 transition"><FaInstagram size={24} /></a>
                            <a href="#" className="text-gray-500 hover:text-purple-600 transition"><FaYoutube size={24} /></a>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                            © 2025 ReGo. Mọi quyền được bảo lưu.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;