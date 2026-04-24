import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CartProvider } from "./contexts/CartContext";
import { OrderProvider } from "./contexts/OrderContext";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Payment from "./pages/Payment";
import PostAd from "./pages/PostAd";
import ProductDetail from "./pages/ProductDetail";
import MyProducts from "./pages/MyProducts";
import AllProducts from "./pages/AllProducts";
import FreeItems from "./pages/FreeItems";
import CategoryPage from "./pages/CategoryPage";
import Notifications from "./pages/Notifications";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import { useTheme } from "./contexts/ThemeContext";

const AppContent = () => {
  const { theme } = useTheme();

  const getThemeClasses = () => {
    if (theme === "light")
      return "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900";
    if (theme === "dark")
      return "dark:bg-gray-900 dark:text-gray-100 bg-gray-900 text-gray-100";
    if (theme === "premium")
      return "bg-gradient-to-br from-purple-700 via-pink-600 to-red-500 text-white";
    return "";
  };

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 ${getThemeClasses()}`}>
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/free-items" element={<FreeItems />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/post-ad" element={<ProtectedRoute><PostAd /></ProtectedRoute>} />
          <Route path="/my-products" element={<ProtectedRoute><MyProducts /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <WishlistProvider>
            <CartProvider>
              <OrderProvider>
                <AppContent />
              </OrderProvider>
            </CartProvider>
          </WishlistProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;