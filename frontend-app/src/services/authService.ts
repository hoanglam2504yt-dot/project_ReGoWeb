import type { User } from "../types/index.ts";
import { API_BASE_URL } from "../config/api";

/** Backend có thể trả lỗi: text thuần, JSON string, hoặc JSON object có message */
function messageFromErrorBody(text: string, status: number): string {
    const raw = text.trim();
    if (!raw) return `Yêu cầu thất bại (mã ${status}).`;
    try {
        const j = JSON.parse(raw) as unknown;
        if (typeof j === "string") return j;
        if (j && typeof j === "object" && "message" in j) {
            const m = (j as { message: unknown }).message;
            if (typeof m === "string" && m) return m;
        }
    } catch {
        /* không phải JSON — dùng nguyên bản text */
    }
    return raw;
}

const USERS_STORAGE_KEY = "app_users";
const CURRENT_USER_KEY = "current_user";

// Helper để lấy danh sách users từ localStorage
const getUsers = (): User[] => {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
};

// Lưu danh sách users
const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// Lưu user hiện tại
export const saveCurrentUser = (user: User | null) => {
    if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(CURRENT_USER_KEY);
    }
};

// Lấy user hiện tại
export const getCurrentUser = (): User | null => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
};

// Đăng ký - gọi Backend API
export const registerUser = async (
    name: string,
    email: string,
    password: string,
    phoneNumber?: string
): Promise<User> => {
    const phone = phoneNumber?.trim();
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            fullName: name,
            email,
            password,
            phoneNumber: phone && phone.length > 0 ? phone : null,
        }),
    });

    const text = await response.text();

    if (!response.ok) {
        throw new Error(messageFromErrorBody(text, response.status));
    }

    let data: Record<string, unknown>;
    try {
        data = JSON.parse(text) as Record<string, unknown>;
    } catch {
        throw new Error("Phản hồi đăng ký không phải JSON hợp lệ.");
    }

    if (data.userId == null) {
        throw new Error("Phản hồi đăng ký không hợp lệ (thiếu userId).");
    }

    const newUser: User = {
        id: String(data.userId),
        email: (typeof data.email === "string" && data.email) || email,
        name: (typeof data.fullName === "string" && data.fullName) || name,
        isPremium: false,
    };

    // Lưu vào localStorage để tương thích với các phần khác
    const users = getUsers();
    if (!users.find((u) => u.email === email)) {
        users.push(newUser);
        saveUsers(users);
    }

    return newUser;
};

// Đăng nhập - gọi Backend API
export const loginUser = async (
    email: string,
    password: string
): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const text = await response.text();

    if (!response.ok) {
        throw new Error(messageFromErrorBody(text, response.status));
    }

    let data: Record<string, unknown>;
    try {
        data = JSON.parse(text) as Record<string, unknown>;
    } catch {
        throw new Error("Phản hồi đăng nhập không phải JSON hợp lệ.");
    }

    if (data.userId == null) {
        throw new Error("Phản hồi đăng nhập không hợp lệ (thiếu userId). Hãy khởi động lại backend bản mới nhất.");
    }

    if (typeof data.accessToken === "string") {
        localStorage.setItem("accessToken", data.accessToken);
    }
    if (typeof data.refreshToken === "string") {
        localStorage.setItem("refreshToken", data.refreshToken);
    }

    const user: User = {
        id: String(data.userId),
        email: (typeof data.email === "string" && data.email) || email,
        name: (typeof data.fullName === "string" && data.fullName) || email,
        isPremium: false,
    };

    return user;
};

// Nâng cấp premium
export const upgradeToPremiumUser = (userId: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        const users = getUsers();
        const userIndex = users.findIndex((u) => u.id === userId);
        if (userIndex === -1) {
            reject(new Error("User not found"));
            return;
        }
        users[userIndex].isPremium = true;
        saveUsers(users);
        resolve(users[userIndex]);
    });
};

// Cập nhật thông tin user
export const updateUserInfo = (updatedUser: User): Promise<User> => {
    return new Promise((resolve, reject) => {
        const users = getUsers();
        const userIndex = users.findIndex((u) => u.id === updatedUser.id);
        if (userIndex === -1) {
            reject(new Error("User not found"));
            return;
        }
        users[userIndex] = updatedUser;
        saveUsers(users);
        resolve(updatedUser);
    });
};