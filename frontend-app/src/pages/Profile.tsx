import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [bio, setBio] = useState("Nhà thiết kế sản phẩm đam mê sự tối giản và tính bền vững.");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!user) return null;

    const handleUpdate = async () => {
        setLoading(true);
        await updateUser({ ...user, name });
        setLoading(false);
        setIsEditing(false);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Thông tin cá nhân</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Quản lý thông tin hồ sơ của bạn</p>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Họ và Tên</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                            />
                        ) : (
                            <p className="text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">{user.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <p className="text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">{user.email}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thời sự (Bio)</label>
                        {isEditing ? (
                            <textarea
                                rows={3}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                            />
                        ) : (
                            <p className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">{bio}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleUpdate}
                                    disabled={loading}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                                >
                                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                                >
                                    Hủy
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                            >
                                Chỉnh sửa hồ sơ
                            </button>
                        )}
                    </div>
                </div>

                {user.isPremium && (
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                        <p className="text-yellow-800 dark:text-yellow-300 text-sm">⭐ Bạn đang là thành viên Premium! Cảm ơn bạn đã ủng hộ.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;