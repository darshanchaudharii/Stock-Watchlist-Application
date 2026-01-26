import { TrendingUp, Shield, Zap, BarChart3 } from 'lucide-react';
import { Header } from '../components/Header';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { getGoogleLoginUrl } from '../services/api';

export function LandingPage() {
    const handleSignIn = () => {
        window.location.href = getGoogleLoginUrl();
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-[#0a0a0f]">
            <Header showSignIn onSignIn={handleSignIn} />

            {/* Animated Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="gradient-orb gradient-orb-1"></div>
                <div className="gradient-orb gradient-orb-2"></div>
                <div className="gradient-orb gradient-orb-3"></div>
                <div className="grid-overlay"></div>
            </div>

            {/* Hero Section */}
            <main className="relative z-[1] min-h-screen pt-[90px] sm:pt-[120px] pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8
                             grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16
                             max-w-[1400px] mx-auto items-center">
                <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2
                          bg-indigo-100 dark:bg-indigo-500/15 
                          border border-indigo-200 dark:border-indigo-500/30 rounded-full
                          text-indigo-600 dark:text-indigo-400 text-sm font-medium w-fit">
                        <Zap size={14} />
                        <span>Real-time stock tracking</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight 
                         text-gray-900 dark:text-white">
                        Track Your Favorite
                        <br />
                        <span className="text-gradient">Stocks in Real-Time</span>
                    </h1>

                    <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400 max-w-[500px]">
                        Build your personalized watchlist, monitor live prices, and never miss
                        a market movement. Simple, fast, and beautifully designed.
                    </p>

                    <div className="flex flex-col items-center lg:items-start gap-4 mt-4">
                        <GoogleSignInButton onClick={handleSignIn} />
                        <p className="text-sm text-gray-500">Free forever • No credit card required</p>
                    </div>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-4">
                        <div className="flex items-center gap-2 px-4 py-2.5
                            bg-gray-100 dark:bg-white/5 
                            border border-gray-200 dark:border-white/10 rounded-full
                            text-sm text-gray-600 dark:text-gray-400 
                            hover:bg-gray-200 dark:hover:bg-white/10 
                            hover:text-gray-900 dark:hover:text-white
                            transition-all duration-300">
                            <TrendingUp size={16} />
                            <span>Live Prices</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2.5
                            bg-gray-100 dark:bg-white/5 
                            border border-gray-200 dark:border-white/10 rounded-full
                            text-sm text-gray-600 dark:text-gray-400 
                            hover:bg-gray-200 dark:hover:bg-white/10 
                            hover:text-gray-900 dark:hover:text-white
                            transition-all duration-300">
                            <Shield size={16} />
                            <span>Secure Login</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2.5
                            bg-gray-100 dark:bg-white/5 
                            border border-gray-200 dark:border-white/10 rounded-full
                            text-sm text-gray-600 dark:text-gray-400 
                            hover:bg-gray-200 dark:hover:bg-white/10 
                            hover:text-gray-900 dark:hover:text-white
                            transition-all duration-300">
                            <BarChart3 size={16} />
                            <span>Price Alerts</span>
                        </div>
                    </div>
                </div>

                {/* Dashboard Preview */}
                <div className="flex justify-center items-center">
                    <div className="w-full max-w-[450px] 
                          bg-white dark:bg-[#14141e]/60 
                          backdrop-blur-xl
                          border border-gray-200 dark:border-white/10 
                          rounded-[20px] overflow-hidden
                          shadow-xl dark:shadow-2xl dark:shadow-black/50 
                          animate-[previewFloat_6s_ease-in-out_infinite]">
                        <div className="flex items-center gap-4 px-5 py-4
                            bg-gray-50 dark:bg-white/5 
                            border-b border-gray-100 dark:border-white/5">
                            <div className="flex gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-[#28ca42]"></span>
                            </div>
                            <span className="text-[13px] text-gray-500">My Watchlist</span>
                        </div>
                        <div className="p-2">
                            {[
                                { symbol: 'AAPL', name: 'Apple Inc.', price: '$178.52', change: '+1.23%', positive: true },
                                { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$141.80', change: '-0.45%', positive: false },
                                { symbol: 'MSFT', name: 'Microsoft', price: '$378.91', change: '+0.89%', positive: true },
                                { symbol: 'TSLA', name: 'Tesla Inc.', price: '$248.50', change: '+2.34%', positive: true },
                            ].map((stock) => (
                                <div key={stock.symbol} className="flex justify-between items-center px-5 py-4
                                                    rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-bold text-gray-900 dark:text-white">{stock.symbol}</span>
                                        <span className="text-[13px] text-gray-500">{stock.name}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="font-semibold text-gray-900 dark:text-white">{stock.price}</span>
                                        <span className={`text-[13px] font-semibold px-2 py-0.5 rounded-md
                                     ${stock.positive
                                                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10'
                                                : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10'}`}>
                                            {stock.change}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
