import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaTrashAlt, FaCloudUploadAlt } from "react-icons/fa";
import { createProduct } from "../services/productService";
import { getCategoriesForDisplay, type Category } from "../services/categoryService";

const conditions = ["Mới 100%", "Đã qua sử dụng - Còn tốt", "Đã qua sử dụng - Bình thường", "Cần sửa chữa"];

interface PostForm {
    title: string;
    categoryId: string;
    condition: string;
    price: string;
    productType: 'sale' | 'free';
    description: string;
    images: File[];
    imagePreviews: string[];
}

const PostAd = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState<PostForm>({
        title: "",
        categoryId: "",
        condition: "",
        price: "",
        productType: "sale",
        description: "",
        images: [],
        imagePreviews: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);

    // Lấy danh sách categories từ backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cats = await getCategoriesForDisplay();
                setCategories(cats);
            } catch (err) {
                console.error("Error loading categories:", err);
                setError("Không thể tải danh mục. Vui lòng thử lại.");
            }
        };
        fetchCategories();
    }, []);

    // Xử lý chọn file từ input
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        
        const fileArray = Array.from(files);
        addFiles(fileArray);
    };

    // Xử lý drag & drop
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        
        const files = e.dataTransfer.files;
        if (!files) return;
        
        const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'));
        addFiles(fileArray);
    };

    // Thêm files vào state
    const addFiles = (files: File[]) => {
        const currentCount = formData.images.length;
        const remainingSlots = 10 - currentCount;
        const filesToAdd = files.slice(0, remainingSlots);
        
        const newFiles = [...formData.images, ...filesToAdd];
        const newPreviews = [...formData.imagePreviews, ...filesToAdd.map(file => URL.createObjectURL(file))];
        
        setFormData(prev => ({ 
            ...prev, 
            images: newFiles, 
            imagePreviews: newPreviews 
        }));
    };

    const removeImage = (index: number) => {
        const newImages = [...formData.images];
        const newPreviews = [...formData.imagePreviews];
        URL.revokeObjectURL(newPreviews[index]);
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);
        setFormData(prev => ({ ...prev, images: newImages, imagePreviews: newPreviews }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert("Vui lòng đăng nhập để đăng tin.");
            navigate("/login");
            return;
        }

        // Validation cơ bản
        if (!formData.title.trim()) {
            setError("Vui lòng nhập tên sản phẩm");
            return;
        }
        if (!formData.categoryId) {
            setError("Vui lòng chọn danh mục");
            return;
        }
        if (!formData.condition) {
            setError("Vui lòng chọn tình trạng sản phẩm");
            return;
        }
        
        // Kiểm tra giá cho sản phẩm bán
        if (formData.productType === 'sale') {
            if (!formData.price || parseFloat(formData.price) <= 0) {
                setError("Vui lòng nhập giá bán hợp lệ");
                return;
            }
        }
        
        if (formData.images.length === 0) {
            setError("Vui lòng thêm ít nhất một ảnh sản phẩm");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Tạo product request
            const productData = {
                name: formData.title,
                description: `${formData.condition}\n\n${formData.description}`,
                price: formData.productType === 'sale' ? parseFloat(formData.price) : 0,
                productType: formData.productType,
                categoryId: parseInt(formData.categoryId),
                userId: parseInt(user.id)
            };

            // Gọi API tạo sản phẩm với ảnh
            const createdProduct = await createProduct(productData, formData.images);
            
            console.log("Sản phẩm đã tạo:", createdProduct);
            
            alert("Đăng tin thành công! Sản phẩm của bạn đã được tạo với " + formData.images.length + " ảnh.");
            
            // Clean up object URLs
            formData.imagePreviews.forEach(url => URL.revokeObjectURL(url));
            
            navigate("/");
        } catch (err) {
            console.error("Error creating product:", err);
            const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">Đăng tin bán hàng</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Điền thông tin chi tiết để thu hút người mua và chốt đơn nhanh chóng.
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* 1. Ảnh sản phẩm */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">1. Ảnh sản phẩm</h2>
                        <p className="text-sm text-gray-500 mb-3">Đăng tải đa dạng ảnh. Ảnh đầu tiên sẽ là ảnh bìa.</p>
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('file-input')?.click()}
                            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                                isDragging
                                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                                    : "border-gray-300 dark:border-gray-600 hover:border-purple-400"
                            }`}
                        >
                            <input
                                id="file-input"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {isDragging ? "Thả ảnh vào đây" : "Kéo thả hoặc bấm để chọn ảnh"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Tối đa 10 ảnh, mỗi ảnh ≤ 5MB</p>
                        </div>

                        {formData.imagePreviews.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                                {formData.imagePreviews.map((src, idx) => (
                                    <div key={idx} className="relative group">
                                        <img src={src} alt={`preview-${idx}`} className="w-full h-24 object-cover rounded-lg border" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <FaTrashAlt size={12} />
                                        </button>
                                        {idx === 0 && <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1 rounded">Ảnh bìa</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 2. Thông tin cơ bản */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">2. Thông tin cơ bản</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên sản phẩm</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="VD: Áo khoác len mùa đông, Giày thể thao Nike..."
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Danh mục</label>
                                    <select
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                        required
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tình trạng</label>
                                    <select
                                        name="condition"
                                        value={formData.condition}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                        required
                                    >
                                        <option value="">Chọn tình trạng</option>
                                        {conditions.map(cond => <option key={cond}>{cond}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Loại sản phẩm & Giá */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">3. Loại sản phẩm & Giá</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Loại sản phẩm</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="productType"
                                            value="sale"
                                            checked={formData.productType === 'sale'}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300">Đăng bán</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="productType"
                                            value="free"
                                            checked={formData.productType === 'free'}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300">Cho tặng miễn phí</span>
                                    </label>
                                </div>
                            </div>
                            
                            {formData.productType === 'sale' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Giá bán (VNĐ)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₫</span>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder="0"
                                            className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                            required={formData.productType === 'sale'}
                                        />
                                    </div>
                                </div>
                            )}
                            
                            {formData.productType === 'free' && (
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <p className="text-sm text-green-700 dark:text-green-300">
                                        💚 Sản phẩm này sẽ được đăng miễn phí và không có giá bán
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 4. Mô tả */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">4. Mô tả chi tiết</h2>
                        <div>
                            <textarea
                                name="description"
                                rows={5}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Mô tả kích thước, chất liệu, xuất xứ, lỗi (nếu có) để người mua dễ hình dung..."
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                            />
                        </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                        >
                            {loading ? "Đang đăng..." : "Đăng tin ngay"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            Lưu nháp
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostAd;