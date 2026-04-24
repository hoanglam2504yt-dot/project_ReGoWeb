import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  FaArrowRight,
  FaArrowsRotate,
  FaBoxOpen,
  FaCircleCheck,
  FaFire,
  FaFolderOpen,
  FaHandshake,
  FaLeaf,
  FaMagnifyingGlass,
  FaSpinner,
} from "react-icons/fa6";
import { useAuth } from "../contexts/AuthContext";
import {
  getAllProducts,
  getProductsByCategory,
  searchProducts,
} from "../services/productService";
import { getCategoriesForDisplay } from "../services/categoryService";
import type { Product, Category } from "../types";
import { getCategoryIconComponent } from "../utils/categoryIcons";
import ProductCard from "../components/ProductCard";

type SortOption = "newest" | "price_asc" | "price_desc";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const qParam = searchParams.get("q")?.trim() || "";
  const categoryParam = searchParams.get("category")?.trim() || "";

  const [searchKeyword, setSearchKeyword] = useState(qParam);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sort, setSort] = useState<SortOption>("newest");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Display success message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      navigate(location.pathname + location.search, { replace: true, state: {} });
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state, location.pathname, location.search, navigate]);

  useEffect(() => {
    setSearchKeyword(qParam);
  }, [qParam]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cats = await getCategoriesForDisplay();
        if (!cancelled) setCategories(cats);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingProducts(true);
        let list: Product[];

        const catId = categoryParam ? parseInt(categoryParam, 10) : NaN;
        const categoryOk = !Number.isNaN(catId);

        if (categoryParam && !categoryOk) {
          list = [];
        } else if (categoryOk && qParam) {
          list = await getProductsByCategory(catId);
          const ql = qParam.toLowerCase();
          list = list.filter(
            (p) =>
              p.name.toLowerCase().includes(ql) ||
              (p.description && p.description.toLowerCase().includes(ql))
          );
        } else if (categoryOk) {
          list = await getProductsByCategory(catId);
        } else if (qParam) {
          list = await searchProducts(qParam);
        } else {
          list = await getAllProducts();
        }

        if (!cancelled) {
          setProducts(list);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        if (!cancelled) {
          setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [qParam, categoryParam]);

  const sortedProducts = useMemo(() => {
    const copy = [...products];
    if (sort === "price_asc") {
      copy.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      copy.sort((a, b) => b.price - a.price);
    } else {
      copy.sort((a, b) => b.id - a.id);
    }
    return copy;
  }, [products, sort]);
  
  // Recent sale products (max 5)
  const recentSaleProducts = useMemo(() => {
    return products
      .filter(p => p.productType === 'sale')
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);
  }, [products]);
  
  // Recent free products (max 5)
  const recentFreeProducts = useMemo(() => {
    return products
      .filter(p => p.productType === 'free')
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);
  }, [products]);

  const isFiltered = Boolean(qParam || categoryParam);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const kw = searchKeyword.trim();
    if (!kw) {
      navigate(categoryParam ? `/?category=${categoryParam}` : "/");
      return;
    }
    const params = new URLSearchParams();
    params.set("q", kw);
    if (categoryParam) params.set("category", categoryParam);
    navigate(`/?${params.toString()}`);
  };

  const activeCategoryName = categoryParam
    ? categories.find((c) => String(c.id) === categoryParam)?.name
    : null;

  return (
    <div className="space-y-12">
      {successMessage && (
        <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-200 font-bold"
          >
            ✕
          </button>
        </div>
      )}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-6 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Mua bán & Trao đổi đồ cũ dễ dàng
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Hàng ngàn sản phẩm chất lượng, giá tốt từ cộng đồng. Hãy tìm đồ bạn cần!
          </p>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Bạn muốn tìm gì hôm nay? Ví dụ: iPhone, tủ lạnh, sách..."
              className="flex-1 px-5 py-3 rounded-full text-gray-800 bg-white/90 backdrop-blur focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-full transition shadow-lg inline-flex items-center justify-center gap-2"
            >
              <FaMagnifyingGlass className="text-lg" aria-hidden />
              Tìm kiếm
            </button>
          </form>
          {!user && (
            <div className="mt-8">
              <Link
                to="/register"
                className="inline-block px-6 py-2 bg-white text-purple-700 rounded-full font-medium hover:bg-gray-100 transition shadow"
              >
                Đăng ký miễn phí để đăng tin
              </Link>
            </div>
          )}
        </div>
      </section>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {isFiltered && !loadingProducts && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-600 dark:text-gray-400">Bộ lọc:</span>
          {qParam && (
            <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200">
              Từ khóa: &quot;{qParam}&quot;
            </span>
          )}
          {categoryParam && activeCategoryName && (
            <span className="px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-800 dark:text-pink-200">
              Danh mục: {activeCategoryName}
            </span>
          )}
          <Link
            to="/"
            className="text-purple-600 dark:text-purple-400 hover:underline ml-2"
          >
            Xóa bộ lọc
          </Link>
        </div>
      )}

      {categories.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FaFolderOpen className="text-purple-600 dark:text-purple-400 shrink-0" aria-hidden />
              Danh mục nổi bật
            </h2>
            <Link
              to="/"
              className="text-purple-600 hover:underline text-sm inline-flex items-center gap-1"
            >
              Xem tất cả
              <FaArrowRight className="text-xs" aria-hidden />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat) => {
              const CatIcon = getCategoryIconComponent(cat.name);
              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-4 text-center cursor-pointer hover:scale-105 transition transform shadow-md block"
                >
                  <div className="flex justify-center mb-2">
                    <CatIcon
                      className="w-9 h-9 text-purple-600 dark:text-purple-300"
                      aria-hidden
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {cat.name}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {loadingProducts && (
        <div className="text-center py-8">
          <FaSpinner
            className="inline-block animate-spin text-4xl text-purple-600 mx-auto"
            aria-hidden
          />
          <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">Đang tải sản phẩm...</p>
        </div>
      )}

      {!loadingProducts && !isFiltered && recentSaleProducts.length > 0 && (
        <section>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FaFire className="text-orange-500 shrink-0" aria-hidden />
              Sản phẩm mới
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recentSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
      
      {!loadingProducts && !isFiltered && recentFreeProducts.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FaLeaf className="text-green-500 shrink-0" aria-hidden />
              Sản phẩm đồ tặng
            </h2>
            <Link
              to="/free-items"
              className="text-purple-600 hover:underline text-sm inline-flex items-center gap-1"
            >
              Xem tất cả
              <FaArrowRight className="text-xs" aria-hidden />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recentFreeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {!loadingProducts && sortedProducts.length > 0 && isFiltered && (
        <section>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FaFire className="text-orange-500 shrink-0" aria-hidden />
              Kết quả tìm kiếm
            </h2>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-600 dark:text-gray-400">
                Sắp xếp:
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm px-3 py-2"
              >
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá thấp → cao</option>
                <option value="price_desc">Giá cao → thấp</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {!loadingProducts && sortedProducts.length === 0 && !error && (
        <section className="text-center py-12">
          <FaBoxOpen
            className="w-20 h-20 mx-auto mb-4 text-gray-400 dark:text-gray-500"
            aria-hidden
          />
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {isFiltered ? "Không có sản phẩm phù hợp" : "Chưa có sản phẩm nào"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {isFiltered
              ? "Thử bỏ bộ lọc hoặc từ khóa khác."
              : "Hãy là người đầu tiên đăng tin bán hàng!"}
          </p>
          {isFiltered && (
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition mr-2"
            >
              Xóa bộ lọc
            </Link>
          )}
          {user && (
            <Link
              to="/post-ad"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition"
            >
              Đăng tin ngay
            </Link>
          )}
        </section>
      )}

      <section className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 md:p-10 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-5">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
              <FaArrowsRotate aria-hidden />
              Bạn muốn trao đổi đồ?
            </h3>
            <p className="opacity-90">
              Đăng tin miễn phí, kết nối ngay với người cùng nhu cầu.
            </p>
          </div>
          <Link
            to={user ? "/my-products" : "/register"}
            className="px-6 py-2 bg-white text-orange-600 font-semibold rounded-full hover:bg-gray-100 transition shadow"
          >
            {user ? "Quản lý tin đăng" : "Đăng ký ngay"}
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow">
          <div className="flex justify-center mb-3">
            <FaCircleCheck className="w-10 h-10 text-green-600 dark:text-green-400" aria-hidden />
          </div>
          <h3 className="text-xl font-semibold mb-2">Hàng thật, giá tốt</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Sản phẩm được kiểm duyệt, người bán uy tín.
          </p>
        </div>
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow">
          <div className="flex justify-center mb-3">
            <FaHandshake className="w-10 h-10 text-amber-600 dark:text-amber-400" aria-hidden />
          </div>
          <h3 className="text-xl font-semibold mb-2">Trao đổi an toàn</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Hỗ trợ gặp mặt trực tiếp hoặc giao hàng qua đơn vị vận chuyển.
          </p>
        </div>
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow">
          <div className="flex justify-center mb-3">
            <FaLeaf className="w-10 h-10 text-emerald-600 dark:text-emerald-400" aria-hidden />
          </div>
          <h3 className="text-xl font-semibold mb-2">Bảo vệ môi trường</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Kéo dài vòng đời sản phẩm, giảm rác thải điện tử.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
