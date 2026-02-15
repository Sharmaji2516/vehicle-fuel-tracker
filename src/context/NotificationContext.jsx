import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification && (
                <div className="fixed top-4 right-4 z-50 animate-fade-in">
                    <div className={`px-6 py-4 rounded-xl shadow-2xl border ${notification.type === 'success'
                            ? 'bg-emerald-600 border-emerald-500'
                            : notification.type === 'error'
                                ? 'bg-rose-600 border-rose-500'
                                : 'bg-blue-600 border-blue-500'
                        }`}>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">
                                {notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️'}
                            </span>
                            <p className="text-white font-bold">{notification.message}</p>
                        </div>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};
