import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface StoredUser extends AuthUser {
  password: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    setUser(saved ? JSON.parse(saved) : null);
    setIsLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    const users: StoredUser[] = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error("帳號或密碼錯誤");
    const { password: _, ...authUser } = found;
    setUser(authUser);
    localStorage.setItem("currentUser", JSON.stringify(authUser));
  }

  async function signUp(email: string, password: string) {
    const users: StoredUser[] = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u) => u.email === email)) throw new Error("此 Email 已被註冊");
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email,
      name: email.split("@")[0],
      password,
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    const { password: _, ...authUser } = newUser;
    setUser(authUser);
    localStorage.setItem("currentUser", JSON.stringify(authUser));
  }

  async function signOut() {
    setUser(null);
    localStorage.removeItem("currentUser");
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
