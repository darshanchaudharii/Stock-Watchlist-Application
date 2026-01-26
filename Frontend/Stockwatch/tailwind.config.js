/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6366f1',
                    light: '#818cf8',
                    dark: '#4f46e5',
                },
                accent: {
                    primary: '#6366f1',
                    secondary: '#8b5cf6',
                    tertiary: '#06b6d4',
                },
                success: '#10b981',
                warning: '#f59e0b',
                danger: '#ef4444',
                dark: {
                    bg: '#0a0a0f',
                    'bg-secondary': '#14141e',
                    'bg-tertiary': '#1a1a28',
                },
                light: {
                    bg: '#f8fafc',
                    'bg-secondary': '#f1f5f9',
                    'bg-tertiary': '#e2e8f0',
                }
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            },
            animation: {
                'float': 'float 20s ease-in-out infinite',
                'preview-float': 'previewFloat 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                    '33%': { transform: 'translate(30px, -30px) scale(1.05)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
                },
                previewFloat: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
}
