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
    <nav className="sticky top-0 z-[100] bg-white/70 dark:bg-[#020617]/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-blue-900/20 group-hover:scale-110 transition-transform duration-500">
              <Ear className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                HEAR<span className="text-blue-600">PREMIUM</span>
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1">Professional Care</span>
            </div>
          </Link>
          
          <div className="hidden lg:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
            <a href="#catalog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group">
              Katalog
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </a>
            <a href="#why-us" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group">
              Keunggulan
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </a>
            <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group">
              Admin
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <button 
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-slate-100 dark:border-slate-700/50 shadow-sm"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <a 
              href={`https://wa.me/${whatsappNumber}`} 
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-3 bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200 dark:shadow-blue-900/20 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konsultasi</span>
            </a>
            
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 rounded-2xl transition-all border border-slate-100 dark:border-slate-700/50"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-[#020617] border-b border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden"
          >
            <div className="px-8 py-12 flex flex-col gap-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
              <a href="#catalog" onClick={() => setIsOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between">
                Katalog Produk <Ear size={14} />
              </a>
              <a href="#why-us" onClick={() => setIsOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between">
                Standar Layanan <Sun size={14} />
              </a>
              <Link to="/login" onClick={() => setIsOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between">
                Panel Admin <X size={14} />
              </Link>
              <a 
                href={`https://wa.me/${whatsappNumber}`}
                className="bg-blue-600 text-white py-5 rounded-2xl text-center shadow-lg shadow-blue-100 dark:shadow-blue-900/20"
              >
                Konsultasi Gratis
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
