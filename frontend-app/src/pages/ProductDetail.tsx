import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSpinner, FaCartShopping } from "react-icons/fa6";
import { getProductById } from "../services/productService";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import type { Product } from "../types";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const pid = id ? parseInt(id, 10) : NaN;
    if (Number.isNaN(pid)) {
      setError("Sản phẩm không hợp lệ");
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getProductById(pid);
        if (!cancelled) {
          setProduct(data);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Không tìm thấy sản phẩm hoặc có lỗi khi tải.");
          setProduct(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!product) return;
    setAddingToCart(true);
    try {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        condition: product.condition || "Đã qua sử dụng",
        seller: product.userName || "Người bán",
        location: product.location || "Chưa rõ",
        image: product.image || `https://picsum.photos/seed/${product.id}/300/200`,
      }, quantity);
      alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    } catch (error) {
      console.error(error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!product) return;
    setAddingToCart(true);
    try {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        condition: product.condition || "Đã qua sử dụng",
        seller: product.userName || "Người bán",
        location: product.location || "Chưa rõ",
        image: product.image || `https://picsum.photos/seed/${product.id}/300/200`,
      }, quantity);
      navigate("/checkout");
    } catch (error) {
      console.error(error);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <FaSpinner className="inline-block animate-spin text-4xl text-purple-600" aria-hidden />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <p className="text-red-600 dark:text-red-400 mb-6">{error || "Không tìm thấy sản phẩm"}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 mr-2"
        >
          Quay lại
        </button>
        <Link
          to="/"
          className="inline-block px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
        >
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 text-purple-600 dark:text-purple-400 hover:underline text-sm inline-flex items-center gap-2"
      >
        <FaArrowLeft aria-hidden />
        Quay lại
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="md:flex">
          {/* Hình ảnh */}
          <div className="md:w-1/2">
            <img
              src={product.image || `https://picsum.photos/seed/${product.id}/600/400`}
              alt={product.name}
              className="w-full h-80 md:h-full object-cover"
            />
          </div>
          {/* Thông tin chi tiết */}
          <div className="md:w-1/2 p-6 md:p-8 space-y-4">
            <div className="flex justify-between items-start">
              <span className="inline-block text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200">
                {product.categoryName || "Chưa phân loại"}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>

            <div>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {product.price.toLocaleString("vi-VN")}đ
              </p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-sm text-gray-400 line-through">
                  Giá gốc: {product.originalPrice.toLocaleString("vi-VN")}đ
                </p>
              )}
            </div>

            {product.condition && (
              <div className="text-sm">
                <span className="font-semibold">Tình trạng:</span> {product.condition}
              </div>
            )}

            {product.location && (
              <div className="text-sm">
                <span className="font-semibold">Địa chỉ:</span> {product.location}
              </div>
            )}

            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                Người bán
              </h2>
              <div className="flex items-center gap-3">
                {product.sellerAvatar && (
                  <img
                    src={product.sellerAvatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <p className="text-gray-800 dark:text-gray-200">
                  {product.userName || "Người bán"}
                </p>
              </div>
              {product.sellerPhone && (
                <p className="text-sm text-gray-500 mt-1">📞 {product.sellerPhone}</p>
              )}
            </div>

            <div className="pt-2">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                Mô tả
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">
                {product.description?.trim() ? product.description : "Chưa có mô tả chi tiết."}
              </p>
            </div>

            {/* Chọn số lượng */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm font-medium">Số lượng:</span>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-1 border-r hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  -
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3 py-1 border-l hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  +
                </button>
              </div>
            </div>

            {/* Hành động */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 py-2 px-4 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 transition flex items-center justify-center gap-2"
              >
                <FaCartShopping /> {addingToCart ? "Đang thêm..." : "Thêm vào giỏ"}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;