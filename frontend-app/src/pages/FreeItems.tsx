import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaBoxOpen,
  FaMagnifyingGlass,
  FaSpinner,
} from "react-icons/fa6";
import { getFreeProducts } from "../services/productService";
import type { Product } from "../types";
import ProductCard from "../components/ProductCard";

type SortOption = "newest" | "oldest";

const FreeItems = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState<SortOption>("newest");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getFreeProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching free products:", err);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(keyword) ||
          p.description?.toLowerCase().includes(keyword)
      );
    }

    // Sort
    if (sort === "oldest") {
      result.sort((a, b) => a.id - b.id);
    } else {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, searchKeyword, sort]);

  return (
    <div className="space-y-8">
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Tất cả sản phẩm đồ tặng
        </h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm kiếm sản phẩm tặng..."
              className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Sắp xếp:
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm px-3 py-3"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <FaSpinner className="inline-block animate-spin text-4xl text-green-600 mx-auto" />
          <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">Đang tải sản phẩm...</p>
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <FaBoxOpen className="w-20 h-20 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Chưa có sản phẩm tặng nào
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchKeyword ? "Không tìm thấy sản phẩm phù hợp." : "Hãy là người đầu tiên đăng tin tặng đồ!"}
          </p>
          <Link
            to="/post-ad"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition"
          >
            Đăng tin tặng đồ
          </Link>
        </div>
      )}

      {!loading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FreeItems;
