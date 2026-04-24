import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaSpinner } from "react-icons/fa6";
import { useAuth } from "../contexts/AuthContext";
import { getProductsByUser } from "../services/productService";
import type { Product } from "../types";

const MyProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const uid = parseInt(user.id, 10);
    if (Number.isNaN(uid)) {
      setError("Vui lòng đăng xuất và đăng nhập lại để tải tin đăng.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getProductsByUser(uid);
        if (!cancelled) {
          setProducts(data);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Không thể tải danh sách tin đăng.");
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tin đăng của tôi</h1>
        <Link
          to="/post-ad"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium inline-flex items-center gap-2"
        >
          <FaPlus aria-hidden />
          Đăng tin mới
        </Link>
      </div>

      {loading && (
        <div className="text-center py-12">
          <FaSpinner
            className="inline-block animate-spin text-3xl text-purple-600"
            aria-hidden
          />
        </div>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-12 bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Bạn chưa có tin đăng nào.</p>
          <Link to="/post-ad" className="text-purple-600 hover:underline font-medium">
            Đăng tin đầu tiên
          </Link>
        </div>
      )}

      {!loading && products.length > 0 && (
        <ul className="space-y-4">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex gap-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition"
            >
              <img
                src={`https://picsum.photos/seed/${p.id}/120/80`}
                alt=""
                className="w-28 h-20 object-cover rounded-lg shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${p.id}`}
                  className="font-semibold text-gray-900 dark:text-white hover:text-purple-600 line-clamp-2"
                >
                  {p.name}
                </Link>
                <p className="text-purple-600 dark:text-purple-400 font-medium mt-1">
                  {p.price.toLocaleString("vi-VN")}đ
                </p>
                <p className="text-xs text-gray-500 mt-1">{p.categoryName || "—"}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyProducts;
