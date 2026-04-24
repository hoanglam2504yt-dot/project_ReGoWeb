import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaHeart, FaRegHeart, FaUser } from "react-icons/fa";
import { useWishlist } from "../contexts/WishlistContext";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Tính phần trăm giảm giá (giả định giá gốc cao hơn 20%)
  const discountPercent = product.productType === "sale" && product.price > 0 
    ? Math.round(((product.price * 0.2) / (product.price * 1.2)) * 100)
    : 0;

  const originalPrice = product.productType === "sale" && product.price > 0
    ? Math.round(product.price * 1.2)
    : 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={`https://picsum.photos/seed/${product.id}/600/450`}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-lg">
            -{discountPercent}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
        >
          {isFavorite ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-gray-600 dark:text-gray-400 text-lg" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 mb-3">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mb-3">
          {product.productType === "free" ? (
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              Miễn phí
            </span>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
              {originalPrice > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  {originalPrice.toLocaleString("vi-VN")}đ
                </span>
              )}
            </div>
          )}
        </div>

        {/* Condition & Location */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            {product.productType === "free" ? "Đồ tặng" : "Đã qua sử dụng"}
          </span>
          <span className="flex items-center gap-1">
            <FaMapMarkerAlt className="text-red-500" />
            Hà Nội
          </span>
        </div>

        {/* Seller & View Details */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <FaUser className="text-gray-400" />
            <span className="truncate max-w-[120px]">
              {product.userName || "Người bán"}
            </span>
          </div>
          <span className="text-purple-600 dark:text-purple-400 font-medium text-sm group-hover:underline">
            Xem chi tiết →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
