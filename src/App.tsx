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
  created_at: string;
}

const App = () => {
  const { settings, loading } = useSettings();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold animate-pulse">Memuat HearPremium...</p>
        </div>
      </div>
    );
  }

  const whatsappNumber = settings.find(s => s.key === 'whatsapp_number')?.value || "6281234567890";

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <Toaster position="top-center" toastOptions={{
          style: {
            borderRadius: '1rem',
            background: '#0f172a',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: '600'
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
          className="fixed bottom-8 right-8 z-[100] bg-green-500 text-white p-5 rounded-full shadow-[0_20px_50px_rgba(34,197,94,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={32} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-3 transition-all duration-500 font-bold whitespace-nowrap text-sm">
            Tanya Konsultan
          </span>
        </a>
      </div>
    </Router>
  );
};

export default App;
