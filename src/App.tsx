import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MessageCircle } from 'lucide-react';
import { useSettings } from './hooks/useSettings';

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <p className="text-slate-900 font-black text-xs uppercase tracking-[0.3em]">HearPremium</p>
            <p className="text-slate-400 text-[10px] font-bold mt-1">Sistem Sedang Memuat...</p>
          </div>
        </div>
      </div>
    );
  }

  const whatsappNumber = settings.find(s => s.key === 'whatsapp_number')?.value || "6281234567890";

  return (
    <Router>
      <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <Toaster position="top-center" toastOptions={{
          style: {
            borderRadius: '1.5rem',
            background: '#0f172a',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '1rem 2rem'
          }
        }} />
        
        <Navbar settings={settings} />
        
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
          className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(37,211,102,0.3)] hover:scale-110 active:scale-95 transition-all duration-500 flex items-center justify-center group"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={28} fill="currentColor" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-4 transition-all duration-500 font-black whitespace-nowrap text-xs uppercase tracking-widest">
            Konsultasi Ahli
          </span>
        </a>
      </div>
    </Router>
  );
};

export default App;
