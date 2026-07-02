import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ear, MessageCircle, Menu, X, Sun, Moon } from 'lucide-react';
import { Setting } from '../hooks/useSettings';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  settings: Setting[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Navbar = ({ settings, theme, toggleTheme }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = settings.find(s => s.key === 'whatsapp_number')?.value || "6281234567890";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/50 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <div className="bg-blue-600 p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-lg shadow-blue-100 dark:shadow-blue-900/20">
              <Ear className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
              HEAR<span className="text-blue-600">PREMIUM</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            <a href="#catalog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Katalog</a>
            <a href="#why-us" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Layanan</a>
            <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Admin</Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-slate-100 dark:border-slate-700/50"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <a 
              href={`https://wa.me/${whatsappNumber}`} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white px-5 md:px-7 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-100 dark:shadow-blue-900/20"
            >
              <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Konsultasi</span>
            </a>
            
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-[#020617] border-b border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
              <a href="#catalog" onClick={() => setIsOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-400">Katalog Produk</a>
              <a href="#why-us" onClick={() => setIsOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-400">Standar Layanan</a>
              <Link to="/login" onClick={() => setIsOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-400">Panel Admin</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
