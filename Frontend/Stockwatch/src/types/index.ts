export interface User {
    id: string;
    email: string;
    name: string;
    picture: string;
    authenticated: boolean;
}

export interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    checkAuth: () => Promise<void>;
    logout: () => void;
}
