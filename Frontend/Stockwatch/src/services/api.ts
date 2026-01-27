import { API_BASE_URL, AUTH_URL } from '../config/api';

// Types
export interface StockSearchResult {
    symbol: string;
    description: string;
    type: string;
}

export interface StockQuote {
    symbol: string;
    name?: string;
    currentPrice: number;
    change: number;
    percentChange: number;
    highPrice?: number;
    lowPrice?: number;
    openPrice?: number;
    previousClose?: number;
    timestamp?: number;
}

export interface WatchlistItem {
    id: number;
    symbol: string;
    companyName: string;
    currentPrice: number | null;
    change: number | null;
    percentChange: number | null;
    addedAt: string;
}

// Auth functions
export async function fetchCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user');
    }

    return response.json();
}

export async function checkAuthStatus() {
    const response = await fetch(`${API_BASE_URL}/api/auth/status`, {
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to check auth status');
    }

    return response.json();
}

export function getGoogleLoginUrl() {
    return AUTH_URL;
}

export function getLogoutUrl() {
    return `${API_BASE_URL}/api/auth/logout`;
}

// Stock API functions
export async function searchStocks(query: string): Promise<StockSearchResult[]> {
    if (!query || query.trim().length < 1) {
        return [];
    }

    const response = await fetch(`${API_BASE_URL}/api/stocks/search?q=${encodeURIComponent(query)}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to search stocks');
    }

    return response.json();
}

export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
    const response = await fetch(`${API_BASE_URL}/api/stocks/quote/${symbol}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        return null;
    }

    return response.json();
}

// Watchlist API functions
export async function getWatchlist(): Promise<WatchlistItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/watchlist`, {
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch watchlist');
    }

    return response.json();
}

export async function addToWatchlist(symbol: string, companyName: string): Promise<WatchlistItem> {
    const response = await fetch(`${API_BASE_URL}/api/watchlist`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ symbol, companyName }),
    });

    if (response.status === 409) {
        throw new Error('Stock already in watchlist');
    }

    if (!response.ok) {
        throw new Error('Failed to add stock to watchlist');
    }

    return response.json();
}

export async function removeFromWatchlist(symbol: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/watchlist/${symbol}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to remove stock from watchlist');
    }
}
