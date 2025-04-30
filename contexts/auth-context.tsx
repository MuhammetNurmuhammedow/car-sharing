"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "driver" | "passenger";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    role: UserRole;
  }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Check for user in localStorage on initial load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    // For demo purposes, we'll simulate a successful login if the user exists
    try {
      setIsLoading(true);
      
      // Check if the user exists in our "database" (localStorage)
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = users.find(
        (u: any) => u.username === username && u.password === password
      );
      
      if (!foundUser) {
        return false;
      }
      
      // Remove password before storing in state
      const { password: _, ...userWithoutPassword } = foundUser;
      
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    role: UserRole;
  }): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call
      // For demo purposes, we'll store users in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Check if username already exists
      if (users.some((u: any) => u.username === userData.username)) {
        return false;
      }
      
      // Create new user with ID
      const newUser = {
        ...userData,
        id: `user_${Date.now()}`,
      };
      
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      // Log in the user after registration
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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