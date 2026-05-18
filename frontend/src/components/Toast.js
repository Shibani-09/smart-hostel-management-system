import { useState, useEffect, useCallback } from "react";

export const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgColor = {
    success: "bg-emerald-500/10 border-emerald-400/20 text-emerald-200",
    error: "bg-rose-500/10 border-rose-400/20 text-rose-200",
    info: "bg-blue-500/10 border-blue-400/20 text-blue-200",
    warning: "bg-amber-500/10 border-amber-400/20 text-amber-200"
  }[type];

  return (
    <div className={`fixed top-4 right-4 rounded-lg px-4 py-3 border ${bgColor} z-50 animate-in fade-in slide-in-from-top-2`}>
      {message}
    </div>
  );
};

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "info", duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  return { toast, showToast, Toast: <Toast {...toast} onClose={() => setToast(null)} /> };
};
