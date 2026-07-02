import React from 'react';
import { Link } from 'react-router-dom';
import { Ear, MessageCircle } from 'lucide-react';
import { Setting } from '../hooks/useSettings';

interface NavbarProps {
  settings: Setting[];
}

export const Navbar = ({ settings }: NavbarProps) => {
  const whatsappNumber = settings.find(s => s.key === 'whatsapp_number')?.value || "6281234567890";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Ear className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">
              HEAR<span className="text-blue-600">PREMIUM</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-black uppercase tracking-widest text-slate-500">
            <a href="#catalog" className="hover:text-blue-600 transition-colors">Katalog</a>
            <a href="#why-us" className="hover:text-blue-600 transition-colors">Keunggulan</a>
            <Link to="/login" className="hover:text-blue-600 transition-colors">Admin</Link>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href={`https://wa.me/${whatsappNumber}`} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Konsultasi</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
