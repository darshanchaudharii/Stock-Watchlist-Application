import { useState, useEffect, useCallback } from 'react';
import { X, Search, Plus, Loader2, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { searchStocks, addToWatchlist, type StockSearchResult } from '../services/api';

interface AddStockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStockAdded: () => void;
}

export function AddStockModal({ isOpen, onClose, onStockAdded }: AddStockModalProps) {
    const { showSuccess, showError } = useToast();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<StockSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [addingSymbol, setAddingSymbol] = useState<string | null>(null);
    const [addedSymbols, setAddedSymbols] = useState<Set<string>>(new Set());
    const [error, setError] = useState<string | null>(null);

    // Debounced search
    const performSearch = useCallback(async (searchQuery: string) => {
        if (searchQuery.length < 1) {
            setResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await searchStocks(searchQuery);
            setResults(data);
        } catch (err) {
            setError('Failed to search stocks. Please try again.');
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            performSearch(query);
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [query, performSearch]);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setResults([]);
            setAddedSymbols(new Set());
            setError(null);
        }
    }, [isOpen]);

    const handleAddStock = async (stock: StockSearchResult) => {
        setAddingSymbol(stock.symbol);
        setError(null);

        try {
            await addToWatchlist(stock.symbol, stock.description);
            setAddedSymbols(prev => new Set(prev).add(stock.symbol));
            showSuccess(`${stock.symbol} added to watchlist`);
            onStockAdded();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to add stock';
            setError(message);
            showError(message);
        } finally {
            setAddingSymbol(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white dark:bg-[#14141e] 
                            border border-gray-200 dark:border-white/10 
                            rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden
                            max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-5 
                        border-b border-gray-200 dark:border-white/10">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Add Stock to Watchlist
                    </h2>
                    <button
                        onClick={onClose}
                        title="Close modal"
                        className="p-2 rounded-lg text-gray-500 dark:text-gray-400 
                                   hover:bg-gray-100 dark:hover:bg-white/5 
                                   transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search Input */}
                <div className="p-5">
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by ticker or company name..."
                            autoFocus
                            className="w-full py-3.5 px-4 pl-11 
                         bg-gray-100 dark:bg-white/5 
                         border border-gray-200 dark:border-white/10 rounded-xl
                         text-gray-900 dark:text-white 
                         placeholder-gray-500 text-[15px]
                         focus:outline-none focus:border-indigo-500 
                         focus:bg-white dark:focus:bg-white/10
                         focus:ring-4 focus:ring-indigo-500/10
                         transition-all duration-300"
                        />
                    </div>

                    {error && (
                        <p className="mt-3 text-sm text-red-500">{error}</p>
                    )}
                </div>

                {/* Results */}
                <div className="max-h-[350px] overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 size={32} className="animate-spin text-indigo-500" />
                        </div>
                    ) : results.length > 0 ? (
                        <div className="px-5 pb-5 space-y-2">
                            {results.map((stock) => {
                                const isAdded = addedSymbols.has(stock.symbol);
                                const isAdding = addingSymbol === stock.symbol;

                                return (
                                    <div
                                        key={stock.symbol}
                                        className="flex items-center justify-between p-4 
                               bg-gray-50 dark:bg-white/5 
                               border border-gray-100 dark:border-white/5 
                               rounded-xl hover:bg-gray-100 dark:hover:bg-white/10
                               transition-colors"
                                    >
                                        <div className="flex-1 min-w-0 mr-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-900 dark:text-white">
                                                    {stock.symbol}
                                                </span>
                                                {stock.type && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full 
                                           bg-gray-200 dark:bg-white/10 
                                           text-gray-600 dark:text-gray-400">
                                                        {stock.type}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                {stock.description}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleAddStock(stock)}
                                            disabled={isAdded || isAdding}
                                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm
                                 transition-all duration-200
                                 ${isAdded
                                                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                                                }
                                 disabled:opacity-60 disabled:cursor-not-allowed`}
                                        >
                                            {isAdding ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : isAdded ? (
                                                <>
                                                    <Check size={16} />
                                                    <span>Added</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Plus size={16} />
                                                    <span>Add</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : query.length >= 1 && !loading ? (
                        <div className="text-center py-12 text-gray-500">
                            No stocks found for "{query}"
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            Start typing to search for stocks
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
