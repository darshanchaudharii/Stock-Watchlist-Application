import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, LogOut, RefreshCw, User, Sun, Moon, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { AddStockModal } from '../components/AddStockModal';
import { getWatchlist, removeFromWatchlist, type WatchlistItem } from '../services/api';

export function Dashboard() {
    const { user, logout, loading: authLoading } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { showSuccess, showError } = useToast();

    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [removingSymbol, setRemovingSymbol] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [imageError, setImageError] = useState(false);

    // Reset image error when user picture changes
    useEffect(() => {
        setImageError(false);
    }, [user?.picture]);

    // Fetch watchlist
    const fetchWatchlist = useCallback(async (showRefreshing = false) => {
        if (showRefreshing) setRefreshing(true);

        try {
            const data = await getWatchlist();
            setWatchlist(data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Failed to fetch watchlist:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Initial fetch and auto-refresh every 30 seconds
    useEffect(() => {
        if (user) {
            fetchWatchlist();

            const interval = setInterval(() => {
                fetchWatchlist();
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [user, fetchWatchlist]);

    // Handle remove stock
    const handleRemove = async (symbol: string) => {
        setRemovingSymbol(symbol);
        try {
            await removeFromWatchlist(symbol);
            setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
            showSuccess(`${symbol} removed from watchlist`);
        } catch (error) {
            console.error('Failed to remove stock:', error);
            showError('Failed to remove stock');
        } finally {
            setRemovingSymbol(null);
        }
    };

    // Format last updated time
    const getTimeSinceUpdate = () => {
        const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
        if (seconds < 10) return 'Just now';
        if (seconds < 60) return `${seconds} seconds ago`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6
                      bg-gray-50 dark:bg-[#0a0a0f]">
                <div className="loader"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
            </div>
        );
    }

    if (!user) {
        window.location.href = '/';
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
            {/* Header */}
            <header className="sticky top-0 z-[100] 
                               bg-white/90 dark:bg-[#0a0a0f]/90
                               backdrop-blur-xl 
                               border-b border-gray-200 dark:border-white/5">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4
                                flex items-center justify-between gap-3 sm:gap-8">
                    {/* Logo - hidden on mobile to save space */}
                    <div className="hidden sm:flex items-center gap-2.5">
                        <img src="/logo.png" alt="StockWatch" className="w-9 h-9 sm:w-11 sm:h-11 object-contain" />
                        <span className="text-lg sm:text-xl font-bold bg-gradient-to-r 
                                         from-gray-900 to-gray-600 dark:from-white dark:to-gray-400
                                         bg-clip-text text-transparent">
                            StockWatch
                        </span>
                    </div>

                    {/* Mobile Logo - small icon only */}
                    <div className="sm:hidden flex items-center">
                        <img src="/logo.png" alt="StockWatch" className="w-8 h-8 object-contain" />
                    </div>

                    {/* Search */}
                    <div className="flex-1 max-w-[480px] relative">
                        <Search size={16} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search stocks..."
                            onClick={() => setIsModalOpen(true)}
                            readOnly
                            className="w-full py-2.5 sm:py-3 px-3 sm:px-4 pl-9 sm:pl-11 cursor-pointer
                                       bg-gray-100 dark:bg-white/5
                                       border border-gray-200 dark:border-white/10 rounded-lg sm:rounded-xl
                                       text-gray-900 dark:text-white 
                                       placeholder-gray-500 text-sm sm:text-[15px]
                                       hover:bg-gray-50 dark:hover:bg-white/10
                                       transition-all duration-300"
                        />
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 sm:p-2.5 rounded-lg 
                                       bg-gray-100 dark:bg-white/5
                                       border border-gray-200 dark:border-white/10
                                       text-gray-600 dark:text-gray-400 
                                       hover:text-gray-900 dark:hover:text-white 
                                       hover:bg-gray-200 dark:hover:bg-white/10
                                       transition-all duration-300"
                            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <div className="flex items-center gap-2 sm:gap-3">
                            {user.picture && !imageError ? (
                                <img
                                    src={user.picture}
                                    alt={user.name}
                                    referrerPolicy="no-referrer"
                                    onError={() => setImageError(true)}
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover 
                                               border-2 border-gray-200 dark:border-white/10"
                                />
                            ) : (
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full 
                                                bg-gray-100 dark:bg-white/10
                                                flex items-center justify-center 
                                                text-gray-500 dark:text-gray-400">
                                    <User size={16} />
                                </div>
                            )}
                            <span className="font-medium text-gray-900 dark:text-white text-[15px] hidden md:block">
                                {user.name}
                            </span>
                        </div>

                        <button
                            onClick={logout}
                            title="Logout"
                            className="p-2.5 rounded-lg 
                         bg-gray-100 dark:bg-white/5 
                         border border-gray-200 dark:border-white/10
                         text-gray-600 dark:text-gray-400 
                         hover:bg-red-100 dark:hover:bg-red-500/10 
                         hover:border-red-200 dark:hover:border-red-500/30 
                         hover:text-red-600 dark:hover:text-red-400
                         transition-all duration-300"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="max-w-[1000px] mx-auto">
                    {/* Watchlist Header */}
                    <div className="flex items-center justify-between mb-6 sm:mb-8 flex-col sm:flex-row gap-4">
                        <div className="flex items-baseline gap-2 sm:gap-4">
                            <h1 className="text-xl sm:text-[28px] font-bold text-gray-900 dark:text-white">My Watchlist</h1>
                            <span className="text-sm sm:text-[15px] text-gray-500">{watchlist.length} stock{watchlist.length !== 1 ? 's' : ''}</span>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-3
                         bg-gradient-to-r from-indigo-500 to-purple-500
                         rounded-xl text-white font-semibold text-[15px]
                         hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30
                         transition-all duration-300 w-full sm:w-auto justify-center"
                        >
                            <Plus size={18} />
                            <span>Add Stock</span>
                        </button>
                    </div>

                    {/* Watchlist Content */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="loader"></div>
                            <p className="mt-4 text-gray-500">Loading your watchlist...</p>
                        </div>
                    ) : watchlist.length > 0 ? (
                        <div className="space-y-3">
                            {watchlist.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3
                                               bg-white dark:bg-white/[0.02]
                                               border border-gray-200 dark:border-white/10
                                               rounded-xl hover:shadow-md dark:hover:bg-white/[0.04]
                                               transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between sm:justify-start gap-4 flex-1">
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                                                {item.symbol}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate max-w-[180px] sm:max-w-none">
                                                {item.companyName}
                                            </p>
                                        </div>

                                        {/* Mobile: Price next to symbol */}
                                        <div className="sm:hidden text-right">
                                            <p className="font-semibold text-base text-gray-900 dark:text-white">
                                                {item.currentPrice != null ? `$${item.currentPrice.toFixed(2)}` : '-'}
                                            </p>
                                            {item.percentChange != null && (
                                                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded
                                                                  ${item.percentChange >= 0
                                                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10'
                                                        : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10'
                                                    }`}>
                                                    {item.percentChange >= 0 ? '+' : ''}{item.percentChange.toFixed(2)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Desktop: Price and remove button */}
                                    <div className="hidden sm:flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="font-semibold text-lg text-gray-900 dark:text-white">
                                                {item.currentPrice != null ? `$${item.currentPrice.toFixed(2)}` : '-'}
                                            </p>
                                            {item.percentChange != null && (
                                                <p className={`text-sm font-semibold px-2 py-0.5 rounded-md inline-block
                                                              ${item.percentChange >= 0
                                                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10'
                                                        : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10'
                                                    }`}>
                                                    {item.percentChange >= 0 ? '+' : ''}{item.percentChange.toFixed(2)}%
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handleRemove(item.symbol)}
                                            disabled={removingSymbol === item.symbol}
                                            className="p-2.5 rounded-lg
                                                       text-gray-400 hover:text-red-500
                                                       hover:bg-red-100 dark:hover:bg-red-500/10
                                                       transition-all duration-200
                                                       disabled:opacity-50"
                                            title="Remove from watchlist"
                                        >
                                            {removingSymbol === item.symbol ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={18} />
                                            )}
                                        </button>
                                    </div>

                                    {/* Mobile: Remove button as full width */}
                                    <button
                                        onClick={() => handleRemove(item.symbol)}
                                        disabled={removingSymbol === item.symbol}
                                        className="sm:hidden flex items-center justify-center gap-2 w-full py-2
                                                   text-sm text-gray-500 hover:text-red-500
                                                   border-t border-gray-100 dark:border-white/5
                                                   -mx-4 px-4 -mb-4 mt-2
                                                   transition-all duration-200
                                                   disabled:opacity-50"
                                    >
                                        {removingSymbol === item.symbol ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={14} />
                                        )}
                                        <span>Remove</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-20 px-8 text-center
                            bg-white dark:bg-white/[0.02] 
                            border border-dashed border-gray-300 dark:border-white/10 
                            rounded-[20px] shadow-sm dark:shadow-none">
                            <div className="flex flex-col items-center justify-center gap-1
                              w-[120px] h-[120px] 
                              bg-indigo-100 dark:bg-indigo-500/10 
                              rounded-full mb-6">
                                <img src="/logo.png" alt="StockWatch" className="w-[50px] h-[50px] object-contain" />
                                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wide">StockWatch</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Your watchlist is empty</h2>
                            <p className="text-gray-600 dark:text-gray-400 max-w-[400px] mb-8">
                                Start tracking your favorite stocks by adding them to your watchlist
                            </p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2.5 px-8 py-4
                           bg-gradient-to-r from-indigo-500 to-purple-500
                           rounded-xl text-white font-semibold
                           hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30
                           transition-all duration-300"
                            >
                                <Plus size={20} />
                                <span>Add Your First Stock</span>
                            </button>
                        </div>
                    )}

                    {/* Last Updated */}
                    {watchlist.length > 0 && (
                        <div className="flex items-center justify-between mt-8 pt-6
                            border-t border-gray-200 dark:border-white/5 
                            text-gray-500 text-sm">
                            <span>Last updated: {getTimeSinceUpdate()}</span>
                            <button
                                onClick={() => fetchWatchlist(true)}
                                disabled={refreshing}
                                className="flex items-center gap-2 px-4 py-2
                           bg-transparent 
                           border border-gray-200 dark:border-white/10 rounded-lg
                           text-gray-600 dark:text-gray-400 
                           hover:bg-gray-100 dark:hover:bg-white/5 
                           hover:border-gray-300 dark:hover:border-white/20 
                           hover:text-gray-900 dark:hover:text-white
                           transition-all duration-300
                           disabled:opacity-50"
                            >
                                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Add Stock Modal */}
            <AddStockModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onStockAdded={() => fetchWatchlist()}
            />
        </div>
    );
}
