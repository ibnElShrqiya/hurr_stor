import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none text-right">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-[#121212]/95 border border-[#C5A059]/40 rounded-xl shadow-2xl backdrop-blur-md text-xs text-[#EDE8DC] animate-in slide-in-from-bottom-2 fade-in duration-300"
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && (
                <CheckCircle className="w-4 h-4 text-[#C5A059] shrink-0" />
              )}
              {toast.type === 'warning' && (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              {toast.type === 'error' && (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              {toast.type === 'info' && (
                <Info className="w-4 h-4 text-blue-400 shrink-0" />
              )}
              <span className="font-medium leading-relaxed">{toast.message}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#777] hover:text-[#EDE8DC] p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
