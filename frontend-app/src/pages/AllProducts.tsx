import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaFilter, FaHeart, FaRegHeart } from "react-icons/fa";
import { useWishlist } from "../contexts/WishlistContext";
import { useAuth } from "../contexts/AuthContext";

// Mock dữ liệu sản phẩm (bạn có thể thay bằng API thực)
const allProducts = [
  { id: 1, name: "iPhone 12 Pro Max", price: 12500000, originalPrice: 28990000, condition: "Đã qua sử dụng", location: "Hà Nội", category: "Điện thoại", image: "https://picsum.photos/id/0/300/200", seller: "Nguyễn Văn A" },
  { id: 2, name: "MacBook Air M1", price: 15900000, originalPrice: 24990000, condition: "Còn mới", location: "TP HCM", category: "Laptop", image: "https://picsum.photos/id/1/300/200", seller: "Trần Thị B" },
  { id: 3, name: "Tủ lạnh Samsung", price: 4200000, originalPrice: 8900000, condition: "Đã qua sử dụng", location: "Đà Nẵng", category: "Đồ gia dụng", image: "https://picsum.photos/id/20/300/200", seller: "Lê Văn C" },
  { id: 4, name: "Áo sơ mi nam", price: 120000, originalPrice: 450000, condition: "Mới", location: "Hải Phòng", category: "Thời trang", image: "https://picsum.photos/id/26/300/200", seller: "Phạm Thị D" },
  { id: 5, name: "Xe đạp thể thao", price: 2750000, originalPrice: 8500000, condition: "Đã qua sử dụng", location: "Bình Dương", category: "Xe cộ", image: "https://picsum.photos/id/58/300/200", seller: "Ngô Thị F" },
  { id: 6, name: "Sách Lập trình React", price: 180000, originalPrice: 350000, condition: "Mới", location: "Hà Nội", category: "Sách", image: "https://picsum.photos/id/24/300/200", seller: "Nhà sách ABC" },
  { id: 7, name: "Đồng hồ thông minh", price: 850000, originalPrice: 2500000, condition: "Đã qua sử dụng", location: "Hà Nội", category: "Phụ kiện", image: "https://picsum.photos/id/82/300/200", seller: "Nguyễn Văn E" },
  { id: 8, name: "Máy ảnh Canon", price: 5200000, originalPrice: 12000000, condition: "Còn tốt", location: "TP HCM", category: "Điện tử", image: "https://picsum.photos/id/96/300/200", seller: "Trần Văn G" },
];

const categories = ["Tất cả", "Điện thoại", "Laptop", "Đồ gia dụng", "Thời trang", "Xe cộ", "Sách", "Phụ kiện", "Điện tử"];
const locations = ["Tất cả", "Hà Nội", "TP HCM", "Đà Nẵng", "Hải Phòng", "Bình Dương"];

const AllProducts = () => {
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedLocation, setSelectedLocation] = useState("Tất cả");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState(allProducts);

  // Lọc sản phẩm
  useEffect(() => {
    let filtered = allProducts;
    if (searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedCategory !== "Tất cả") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (selectedLocation !== "Tất cả") {
      filtered = filtered.filter(p => p.location === selectedLocation);
    }
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    setProducts(filtered);
  }, [searchTerm, selectedCategory, selectedLocation, priceRange]);

  const handleWishlist = (product: any) => {
    if (!user) {
      alert("Vui lòng đăng nhập để thêm vào yêu thích");
      return;
    }
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        condition: product.condition,
        seller: product.seller,
        location: product.location,
        image: product.image,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Our Collection</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Khám phá những sản phẩm chất lượng với giá tốt nhất</p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden px-5 py-3 bg-purple-600 text-white rounded-xl flex items-center justify-center gap-2"
        >
          <FaFilter /> Bộ lọc
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar - Desktop */}
        <div className={`md:block w-64 shrink-0 ${showFilters ? "block" : "hidden"} md:block`}>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><FaFilter /> Bộ lọc</h3>

            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">Danh mục</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                {categories.map(cat => <option key={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">Địa điểm</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                {locations.map(loc => <option key={loc}>{loc}</option>)}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">Khoảng giá (VNĐ)</label>
              <div className="flex justify-between text-sm">
                <span>{priceRange[0].toLocaleString()}</span>
                <span>{priceRange[1].toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50000000"
                step="500000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full mt-2"
              />
            </div>

            <button
              onClick={() => {
                setSelectedCategory("Tất cả");
                setSelectedLocation("Tất cả");
                setPriceRange([0, 50000000]);
                setSearchTerm("");
              }}
              className="w-full py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">Không tìm thấy sản phẩm phù hợp.</div>
            ) : (
              products.map(product => (
                <div key={product.id} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                  <Link to={`/products/${product.id}`}>
                    <div className="relative overflow-hidden h-48">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={(e) => { e.preventDefault(); handleWishlist(product); }}
                          className="bg-white/80 dark:bg-gray-700/80 rounded-full p-2 shadow hover:bg-white transition"
                        >
                          {isInWishlist(product.id) ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-600" />}
                        </button>
                      </div>
                      {product.originalPrice > product.price && (
                        <span className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate">{product.name}</h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xl font-bold text-purple-600">{product.price.toLocaleString()}đ</span>
                        <span className="text-sm text-gray-400 line-through">{product.originalPrice.toLocaleString()}đ</span>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                        <span>{product.condition}</span>
                        <span>📍 {product.location}</span>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-xs text-gray-400">👤 {product.seller}</span>
                        <Link to={`/products/${product.id}`} className="text-purple-600 text-sm font-medium hover:underline">
                          Xem chi tiết →
                        </Link>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;