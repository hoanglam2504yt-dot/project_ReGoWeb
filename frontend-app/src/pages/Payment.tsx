import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaWandMagicSparkles, FaTrophy, FaCheck, FaCreditCard } from "react-icons/fa6";

const Payment = () => {
    const { user, upgradeToPremium } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpgrade = async () => {
        if (!user) return;
        setLoading(true);
        // Giả lập thanh toán thành công sau 1s
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await upgradeToPremium();
        setLoading(false);
        alert("Nâng cấp Premium thành công! Giờ bạn có thể sử dụng chế độ nền Premium.");
        navigate("/settings");
    };

    if (!user) {
        return (
            <div className="max-w-md mx-auto text-center">
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-8">
                    <p className="text-gray-700 dark:text-gray-300">
                        Vui lòng đăng nhập để thực hiện thanh toán.
                    </p>
                </div>
            </div>
        );
    }

    if (user.isPremium) {
        return (
            <div className="max-w-md mx-auto text-center">
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-8">
                    <div className="text-5xl mb-4 flex justify-center"><FaTrophy className="text-yellow-500" /></div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        Bạn đã là Premium Member!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Cảm ơn bạn đã ủng hộ. Hãy tận hưởng chế độ nền Premium.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-6">
                    <div className="text-6xl mb-3 flex justify-center"><FaWandMagicSparkles className="text-purple-500" /></div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                        Nâng cấp Premium
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Mở khóa chế độ nền độc quyền và trải nghiệm cao cấp
                    </p>
                </div>

                <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-6 mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-semibold">Gói Premium</span>
                        <span className="text-2xl font-bold text-purple-600">$9.99</span>
                    </div>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                        <li className="flex items-center gap-2"><FaCheck className="text-green-500" /> Chế độ nền Premium gradient</li>
                        <li className="flex items-center gap-2"><FaCheck className="text-green-500" /> Huy hiệu Premium trên hồ sơ</li>
                        <li className="flex items-center gap-2"><FaCheck className="text-green-500" /> Ưu đãi độc quyền trong tương lai</li>
                        <li className="flex items-center gap-2"><FaCheck className="text-green-500" /> Hỗ trợ phát triển dự án</li>
                    </ul>
                </div>

                <button
                    onClick={handleUpgrade}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition disabled:opacity-50"
                >
                    {loading ? "Đang xử lý thanh toán..." : <><FaCreditCard className="inline mr-2" />Thanh toán ngay</>}
                </button>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-5">
                    * Đây là thanh toán giả lập, không thực hiện giao dịch thật.
                </p>
            </div>
        </div>
    );
};

export default Payment;