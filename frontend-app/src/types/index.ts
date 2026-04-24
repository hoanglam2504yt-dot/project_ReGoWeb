export interface User {
    id: string;
    email: string;
    name: string;
    isPremium: boolean;
    avatar?: string;
    phone?: string;
    address?: string;
    city?: string;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (
        name: string,
        email: string,
        password: string,
        phoneNumber?: string
    ) => Promise<boolean>;
    logout: () => void;
    updateUser: (updatedUser: User) => void;
    upgradeToPremium: () => void;
}

export interface ThemeContextType {
    theme: "light" | "dark" | "premium";
    setTheme: (theme: "light" | "dark" | "premium") => void;
    isPremiumThemeAllowed: boolean;
}

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    productType: 'sale' | 'free';
    categoryId?: number;
    categoryName?: string;
    userId?: number;
    userName?: string;
    createdAt?: string;
    updatedAt?: string;
    // Thêm các thuộc tính mới cho chi tiết sản phẩm
    originalPrice?: number;
    condition?: string;
    location?: string;
    image?: string;
    sellerAvatar?: string;
    sellerPhone?: string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
    icon?: string;
    parent?: Category;
    subCategories?: Category[];
    createdAt?: string;
}