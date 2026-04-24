import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, AuthContextType } from "../types/index";
import {
    getCurrentUser,
    saveCurrentUser,
    loginUser,
    registerUser,
    upgradeToPremiumUser,
    updateUserInfo,
} from "../services/authService";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const loggedInUser = await loginUser(email, password);
        setUser(loggedInUser);
        saveCurrentUser(loggedInUser);
        return true;
    };

    const register = async (
        name: string,
        email: string,
        password: string,
        phoneNumber?: string
    ) => {
        try {
            await registerUser(name, email, password, phoneNumber);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        saveCurrentUser(null);
    };

    const updateUser = async (updatedUser: User) => {
        try {
            const savedUser = await updateUserInfo(updatedUser);
            setUser(savedUser);
            saveCurrentUser(savedUser);
        } catch (error) {
            console.error(error);
        }
    };

    const upgradeToPremium = async () => {
        if (!user) return;
        try {
            const upgradedUser = await upgradeToPremiumUser(user.id);
            setUser(upgradedUser);
            saveCurrentUser(upgradedUser);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, login, register, logout, updateUser, upgradeToPremium }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};