import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X, Loader } from 'lucide-react';
import '../components/Toast.css';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, hiding: false }]);

        if (duration > 0) {
            setTimeout(() => {
                hideToast(id);
            }, duration);
        }
        return id;
    }, []);

    const hideToast = useCallback((id) => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, hiding: true } : t));
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 300); // Wait for animation
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={20} />;
            case 'error': return <AlertCircle size={20} />;
            case 'loading': return <Loader size={20} className="spinner" />;
            default: return <Info size={20} />;
        }
    };

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast ${toast.type} ${toast.hiding ? 'hiding' : ''}`}>
                        <div className="toast-icon">
                            {getIcon(toast.type)}
                        </div>
                        <div className="toast-content">
                            {toast.message}
                        </div>
                        {toast.type !== 'loading' && (
                            <button className="toast-close" onClick={() => hideToast(toast.id)}>
                                <X size={16} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
