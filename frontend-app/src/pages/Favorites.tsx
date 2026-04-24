import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";

const Favorites = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      condition: product.condition,
      seller: product.seller,
      location: product.location,
      image: product.image,
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          Sản phẩm Yêu thích
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Những sản phẩm bạn đã lưu lại đê xem sau
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <FaHeart className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Chưa có sản phẩm yêu thích nào
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Hãy quay lại trang sản phẩm và thêm những món đồ bạn thích nhé!
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product) => (
            <div
              key={product.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <Link to={`/products/${product.id}`}>
                <div className="relative overflow-hidden h-48">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {product.originalPrice > product.price && (
                    <span className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/products/${product.id}`}>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate">
                    {product.name}
                    </h3>
                </Link>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold text-purple-600">
                    {product.price.toLocaleString()}đ
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {product.originalPrice.toLocaleString()}đ
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <span>{product.condition}</span>
                  <span>📍 {product.location}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 py-2 bg-purple-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 transition"
                  >
                    <FaShoppingCart /> Thêm vào giỏ
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="p-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    title="Xóa khỏi danh sách"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
