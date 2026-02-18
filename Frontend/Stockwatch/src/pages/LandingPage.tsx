import {
    Activity,
    ArrowRight,
    BarChart3,
    CheckCircle2,
    Shield,
    Sparkles,
    TrendingUp,
    Zap,
} from 'lucide-react';
import { Header } from '../components/Header';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { getGoogleLoginUrl } from '../services/api';

const marketHighlights = [
    { label: 'US Markets', value: '+1.42%', positive: true },
    { label: 'Tech Momentum', value: '+2.31%', positive: true },
    { label: 'Energy Index', value: '-0.18%', positive: false },
];

const trustPoints = [
    'Google authentication with secure sessions',
    'Live quote updates from trusted market data APIs',
    'Fast, responsive dashboard with dark mode support',
];

export function LandingPage() {
    const handleSignIn = () => {
        window.location.href = getGoogleLoginUrl();
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-[#0a0a0f]">
            <Header showSignIn onSignIn={handleSignIn} />

            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="gradient-orb gradient-orb-1"></div>
                <div className="gradient-orb gradient-orb-2"></div>
                <div className="gradient-orb gradient-orb-3"></div>
                <div className="grid-overlay"></div>
            </div>

            <main className="relative z-[1] min-h-screen pt-[100px] sm:pt-[120px] pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
                <section className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center">
                    <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 rounded-full text-indigo-600 dark:text-indigo-400 text-sm font-medium w-fit">
                            <Sparkles size={14} />
                            <span>Designed for focused investors</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-gray-900 dark:text-white">
                            Your watchlist,{' '}
                            <span className="text-gradient">elevated into a live market command center</span>
                        </h1>

                        <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400 max-w-[560px]">
                            Spot opportunities faster with real-time pricing, clean visual insights, and a sleek
                            dashboard crafted to keep your best ideas front and center.
                        </p>

                        <div className="w-full max-w-[560px] grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                            {marketHighlights.map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-md px-4 py-3 text-left shadow-sm"
                                >
                                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{item.label}</p>
                                    <p
                                        className={`mt-1 text-lg font-bold ${
                                            item.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                                        }`}
                                    >
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mt-2">
                            <GoogleSignInButton onClick={handleSignIn} />
                            <button
                                onClick={handleSignIn}
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-300 dark:border-white/15 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:border-indigo-400/60 dark:hover:border-indigo-400/50 transition-colors"
                            >
                                View live demo feel
                                <ArrowRight size={16} />
                            </button>
                        </div>

                        <p className="text-sm text-gray-500">Free forever • No credit card required</p>
                    </div>

                    <div className="relative">
                        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-indigo-400/30 blur-3xl"></div>
                        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-emerald-400/20 blur-3xl"></div>

                        <div className="relative w-full max-w-[520px] mx-auto bg-white dark:bg-[#14141e]/70 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[24px] overflow-hidden shadow-2xl dark:shadow-black/50 animate-[previewFloat_6s_ease-in-out_infinite]">
                            <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></span>
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#28ca42]"></span>
                                    </div>
                                    <span className="text-[13px] text-gray-500">Finoculus Portfolio Radar</span>
                                </div>
                                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                    <Activity size={12} /> Live
                                </span>
                            </div>

                            <div className="p-3 space-y-2">
                                {[
                                    { symbol: 'AAPL', name: 'Apple Inc.', price: '$178.52', change: '+1.23%', positive: true },
                                    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$738.40', change: '+3.90%', positive: true },
                                    { symbol: 'MSFT', name: 'Microsoft', price: '$378.91', change: '+0.89%', positive: true },
                                    { symbol: 'TSLA', name: 'Tesla Inc.', price: '$248.50', change: '-1.12%', positive: false },
                                ].map((stock) => (
                                    <div
                                        key={stock.symbol}
                                        className="flex justify-between items-center px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-gray-900 dark:text-white">{stock.symbol}</span>
                                            <span className="text-[13px] text-gray-500">{stock.name}</span>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="font-semibold text-gray-900 dark:text-white">{stock.price}</span>
                                            <span
                                                className={`text-[13px] font-semibold px-2 py-0.5 rounded-md ${
                                                    stock.positive
                                                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10'
                                                        : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10'
                                                }`}
                                            >
                                                {stock.change}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="relative mt-14 grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-sm px-6 py-5 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Zap size={18} className="text-indigo-500" />
                            Why traders switch to Finoculus
                        </h2>
                        <div className="mt-4 grid sm:grid-cols-2 gap-3">
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                                <TrendingUp className="text-indigo-500 mt-0.5" size={18} />
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-100">Faster decision-making</p>
                                    <p className="text-sm text-gray-500">Watch key movements instantly, all in one place.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                                <BarChart3 className="text-emerald-500 mt-0.5" size={18} />
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-100">Clean market visibility</p>
                                    <p className="text-sm text-gray-500">Focus on essentials with a distraction-free interface.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-sm px-6 py-5 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Shield size={18} className="text-indigo-500" />
                            Trusted foundations
                        </h3>
                        <ul className="mt-4 space-y-3">
                            {trustPoints.map((point) => (
                                <li key={point} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
}
