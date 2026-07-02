import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'success' | 'info';
  confirmText?: string;
}

export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'info',
  confirmText = 'Konfirmasi'
}: ConfirmModalProps) => {
  const colors = {
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
    info: 'bg-blue-600 text-white hover:bg-blue-700'
  };

  const icons = {
    danger: <Trash2 className="w-8 h-8 text-red-500" />,
    success: <CheckCircle2 className="w-8 h-8 text-green-500" />,
    info: <AlertCircle className="w-8 h-8 text-blue-600" />
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 md:p-10 text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-slate-50 p-5 rounded-3xl">
                {icons[type]}
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
            <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed">{message}</p>
            
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 bg-slate-50 text-slate-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg ${colors[type]}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
