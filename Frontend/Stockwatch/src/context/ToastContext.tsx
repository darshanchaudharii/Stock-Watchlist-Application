import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newToast = { id, message, type };

        setToasts(prev => [...prev, newToast]);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, [removeToast]);

    const showSuccess = useCallback((message: string) => showToast(message, 'success'), [showToast]);
    const showError = useCallback((message: string) => showToast(message, 'error'), [showToast]);
    const showInfo = useCallback((message: string) => showToast(message, 'info'), [showToast]);

    const getIcon = (type: ToastType) => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} className="text-emerald-400" />;
            case 'error':
                return <XCircle size={20} className="text-red-400" />;
            case 'info':
                return <AlertCircle size={20} className="text-blue-400" />;
        }
    };

    const getBorderColor = (type: ToastType) => {
        switch (type) {
            case 'success':
                return 'border-l-emerald-500';
            case 'error':
                return 'border-l-red-500';
            case 'info':
                return 'border-l-blue-500';
        }
    };

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center gap-3 
                       min-w-[300px] max-w-[420px] p-4 pr-12
                       bg-white dark:bg-[#1a1a28] 
                       border border-gray-200 dark:border-white/10
                       border-l-4 ${getBorderColor(toast.type)}
                       rounded-lg shadow-xl
                       animate-[slideIn_0.3s_ease-out]`}
                        style={{
                            animation: 'slideIn 0.3s ease-out'
                        }}
                    >
                        {getIcon(toast.type)}
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 flex-1">
                            {toast.message}
                        </p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 
                         text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                         rounded-lg hover:bg-gray-100 dark:hover:bg-white/5
                         transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>

            <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
