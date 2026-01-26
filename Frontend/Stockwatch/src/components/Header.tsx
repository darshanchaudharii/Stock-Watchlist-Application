import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
    showSignIn?: boolean;
    onSignIn?: () => void;
}

export function Header({ showSignIn = true, onSignIn }: HeaderProps) {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="fixed top-0 left-0 right-0 z-[1000] px-4 sm:px-6 lg:px-8 py-3 sm:py-4 
                           bg-white/80 dark:bg-[#0a0a0f]/80 
                           backdrop-blur-xl border-b border-gray-200 dark:border-white/5">
            <div className="max-w-[1400px] mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2 sm:gap-3">
                    <img src="/logo.png" alt="StockWatch" className="w-9 h-9 sm:w-12 sm:h-12 object-contain" />
                    <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 
                                     dark:from-white dark:to-gray-400 
                                     bg-clip-text text-transparent">
                        StockWatch
                    </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 sm:p-2.5 rounded-lg bg-gray-100 dark:bg-white/5 
                                   border border-gray-200 dark:border-white/10
                                   text-gray-600 dark:text-gray-400 
                                   hover:text-gray-900 dark:hover:text-white 
                                   hover:bg-gray-200 dark:hover:bg-white/10
                                   transition-all duration-300"
                        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {showSignIn && (
                        <button
                            onClick={onSignIn}
                            className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold 
                                       text-gray-700 dark:text-white
                                       bg-transparent border border-gray-300 dark:border-white/20 rounded-lg
                                       hover:bg-gray-100 dark:hover:bg-white/10 
                                       hover:border-gray-400 dark:hover:border-white/40
                                       transition-all duration-300"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
