'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface NotificationContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  showNotification: (notification: { type?: ToastType; title?: string; message: string }) => void;
  removeToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  toasts: [],
  showToast: () => {},
  showNotification: () => {},
  removeToast: () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message }: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, message }]);

      setTimeout(() => {
        removeToast(id);
      }, 5000);
    },
    [removeToast]
  );

  const showNotification = useCallback(
    ({ type = 'info', title, message }: { type?: ToastType; title?: string; message: string }) => {
      showToast({
        type,
        title: title || (type === 'error' ? 'Error' : type === 'success' ? 'Success' : 'Notice'),
        message,
      });
    },
    [showToast]
  );

  return (
    <NotificationContext.Provider value={{ toasts, showToast, showNotification, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-xl bg-[#18181b]/95 text-white"
              style={{
                borderColor:
                  t.type === 'success'
                    ? 'rgba(198, 255, 59, 0.4)'
                    : t.type === 'error'
                    ? 'rgba(239, 68, 68, 0.4)'
                    : 'rgba(255, 90, 31, 0.4)',
              }}
            >
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#c6ff3b] shrink-0 mt-0.5" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-[#ff5a1f] shrink-0 mt-0.5" />}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight text-white">{t.title}</p>
                {t.message && <p className="text-xs text-zinc-400 mt-1 leading-snug">{t.message}</p>}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-zinc-400 hover:text-white transition-colors p-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
