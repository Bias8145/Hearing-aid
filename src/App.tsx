import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MessageCircle } from 'lucide-react';
import { useSettings } from './hooks/useSettings';
import { WhatsAppIcon } from './components/BrandIcons';

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  features: string[];
  market_price: number;
  our_price: number;
  image_urls: string[];
  shopee_url: string;
  tokopedia_url: string;
  blibli_url: string;
  tiktok_shop_url: string;
  created_at: string;
}

const App = () => {
  const { settings, loading } = useSettings();
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#020617]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-blue-100 dark:border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <p className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-[0.3em]">HearPremium</p>
            <p className="text-slate-400 text-[10px] font-bold mt-1">Sistem Sedang Memuat...</p>
          </div>
        </div>
      </div>
    );
  }

  const whatsappNumber = settings.find(s => s.key === 'whatsapp_number')?.value || "6281234567890";

  return (
    <Router>
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] font-sans text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900/30 selection:text-blue-900 transition-colors duration-500">
        <Toaster position="top-center" toastOptions={{
          style: {
            borderRadius: '1.5rem',
            background: theme === 'dark' ? '#1e293b' : '#0f172a',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '1rem 2rem',
            border: theme === 'dark' ? '1px solid #334155' : 'none'
          }
        }} />
        
        <Navbar settings={settings} theme={theme} toggleTheme={toggleTheme} />
        
        <Routes>
          <Route path="/" element={<Home settings={settings} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard settings={settings} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer settings={settings} />

        {/* Floating WhatsApp */}
        <a 
          href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] bg-[#25D366] text-white p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_20px_50px_rgba(37,211,102,0.3)] hover:scale-110 active:scale-95 transition-all duration-500 flex items-center justify-center group"
          aria-label="Chat on WhatsApp"
        >
          <WhatsAppIcon className="w-6 h-6 md:w-7 md:h-7" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-4 transition-all duration-500 font-black whitespace-nowrap text-[10px] uppercase tracking-widest">
            Konsultasi Ahli
          </span>
        </a>
      </div>
    </Router>
  );
};

export default App;
