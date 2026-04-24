import React, { createContext, useContext, useState, useEffect } from "react";
import type { ThemeContextType } from "../types/index";
import { useAuth } from "./AuthContext";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { user } = useAuth();
    const [theme, setThemeState] = useState<"light" | "dark" | "premium">(
        () => (localStorage.getItem("app_theme") as any) || "light"
    );

    const isPremiumThemeAllowed = user?.isPremium === true;

    const setTheme = (newTheme: "light" | "dark" | "premium") => {
        if (newTheme === "premium" && !isPremiumThemeAllowed) {
            alert("Bạn cần nâng cấp Premium để sử dụng chế độ nền này!");
            return;
        }
        setThemeState(newTheme);
        localStorage.setItem("app_theme", newTheme);
    };

    useEffect(() => {
        // Nếu user không còn premium và theme đang là premium -> chuyển về light
        if (theme === "premium" && !isPremiumThemeAllowed) {
            setThemeState("light");
            localStorage.setItem("app_theme", "light");
        }
    }, [isPremiumThemeAllowed, theme]);

    useEffect(() => {
        // Cập nhật class trên body để hỗ trợ dark mode của Tailwind
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, isPremiumThemeAllowed }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};