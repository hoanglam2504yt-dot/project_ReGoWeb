import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { FaShoppingCart, FaHeart, FaBell, FaSun, FaMoon, FaCrown, FaUser, FaSignOutAlt, FaBars, FaPlusCircle } from "react-icons/fa";
import { useState } from "react";

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, setTheme, isPremiumThemeAllowed } = useTheme();
    const { items: cartItems } = useCart();
    const { items: wishlistItems } = useWishlist();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const totalCartItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
    const totalWishlistItems = wishlistItems.length;

    return (
        <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            ReGo
                        </span>
                        <span className="text-xs text-gray-500 hidden sm:inline">♻️ Mua bán đồ cũ</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-purple-600 transition">
                            Trang chủ
                        </Link>
                        <Link to="/products" className="text-gray-700 dark:text-gray-200 hover:text-purple-600 transition">
                            Sản phẩm
                        </Link>
                        <Link to="/free-items" className="text-gray-700 dark:text-gray-200 hover:text-purple-600 transition">
                            Đồ miễn phí
                        </Link>
                        {user && (
                            <>
                                <Link to="/my-products" className="text-gray-700 dark:text-gray-200 hover:text-purple-600 transition">
                                    Tin của tôi
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-3">
                        {/* Nút Đăng tin nổi bật */}
                        {user && (
                            <Link
                                to="/post-ad"
                                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold hover:shadow-lg transition"
                            >
                                <FaPlusCircle /> Đăng tin
                            </Link>
                        )}

                        {/* Theme Toggle */}
                        <button
                            onClick={() => {
                                if (theme === "light") setTheme("dark");
                                else if (theme === "dark") setTheme(isPremiumThemeAllowed ? "premium" : "light");
                                else setTheme("light");
                            }}
                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            aria-label="Đổi theme"
                        >
                            {theme === "light" && <FaSun className="text-yellow-500" />}
                            {theme === "dark" && <FaMoon className="text-blue-400" />}
                            {theme === "premium" && <FaCrown className="text-yellow-500" />}
                        </button>

                        {user ? (
                            <>
                                <Link to="/favorites" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                                    <FaHeart className="text-red-500" />
                                    {totalWishlistItems > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {totalWishlistItems}
                                        </span>
                                    )}
                                </Link>
                                <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                                    <FaShoppingCart className="text-purple-600" />
                                    {totalCartItems > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {totalCartItems}
                                        </span>
                                    )}
                                </Link>
                                <Link to="/notifications" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                                    <FaBell className="text-gray-600 dark:text-gray-300" />
                                </Link>
                                <div className="relative group">
                                    <button className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <FaUser className="text-gray-700 dark:text-gray-200" />
                                    </button>
                                    <div className="absolute right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hidden group-hover:block">
                                        <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Hồ sơ</Link>
                                        <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Đơn hàng</Link>
                                        <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Cài đặt</Link>
                                        <hr className="my-1" />
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <FaSignOutAlt className="inline mr-2" /> Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex space-x-2">
                                <Link to="/login" className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition">
                                    Đăng nhập
                                </Link>
                                <Link to="/register" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                                    Đăng ký
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-md focus:outline-none"
                        >
                            <FaBars className="text-gray-700 dark:text-gray-200" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        <Link to="/" className="block py-2 text-gray-700 dark:text-gray-200">Trang chủ</Link>
                        <Link to="/products" className="block py-2 text-gray-700 dark:text-gray-200">Sản phẩm</Link>
                        <Link to="/free-items" className="block py-2 text-gray-700 dark:text-gray-200">Đồ miễn phí</Link>
                        {user && (
                            <>
                                <Link to="/post-ad" className="block py-2 text-purple-600 font-semibold">+ Đăng tin</Link>
                                <Link to="/my-products" className="block py-2 text-gray-700 dark:text-gray-200">Tin của tôi</Link>
                                <Link to="/profile" className="block py-2 text-gray-700 dark:text-gray-200">Hồ sơ</Link>
                                <Link to="/orders" className="block py-2 text-gray-700 dark:text-gray-200">Đơn hàng</Link>
                                <Link to="/settings" className="block py-2 text-gray-700 dark:text-gray-200">Cài đặt</Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;