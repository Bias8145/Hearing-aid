import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Star, TrendingDown, ShieldCheck } from 'lucide-react';
import { Setting } from '../hooks/useSettings';

interface HeroProps {
  settings: Setting[];
}

export const Hero = ({ settings }: HeroProps) => {
  const whatsappNumber = settings.find(s => s.key === 'whatsapp_number')?.value || "6281234567890";

  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden bg-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-50"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-100 rounded-full blur-[120px] opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8"
            >
              <TrendingDown size={14} /> Hemat Hingga Rp 35.000.000
            </motion.div>
            
            <h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
              Teknologi Premium, <br />
              <span className="text-blue-600">Harga Jujur.</span>
            </h1>
            
            <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-xl">
              Dapatkan alat bantu dengar kelas dunia dari Phonak & Oticon dengan harga 70% lebih murah dibanding Hearing Center. Kualitas profesional, tanpa biaya tambahan.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 mb-12">
              <a href="#catalog" className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 group">
                Lihat Katalog <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href={`https://wa.me/${whatsappNumber}`} className="bg-white text-slate-900 border-2 border-slate-100 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <MessageCircle className="text-green-500" /> Konsultasi Gratis
              </a>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-slate-100">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex text-amber-400 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-sm font-bold text-slate-900">500+ Pengguna Puas</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1590611357128-7a2863182148?auto=format&fit=crop&q=80&w=1200" 
                alt="Premium Hearing Aid"
                className="w-full aspect-[4/5] object-cover"
              />
              
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-10 left-10 right-10 bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 shadow-2xl"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Hearing Center</p>
                    <p className="text-2xl line-through text-slate-300 font-bold">Rp 55.000.000</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-block bg-green-500 text-white text-[10px] font-black px-2 py-0.5 rounded mb-2">HEMAT 37JT</div>
                    <p className="text-blue-600 text-xs font-black uppercase tracking-widest mb-1">HearPremium</p>
                    <p className="text-4xl text-slate-900 font-black">Rp 18.000.000</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="absolute -top-10 -right-10 bg-white p-6 rounded-[2rem] shadow-xl border border-slate-50 z-20 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-2xl">
                  <ShieldCheck className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Garansi Resmi</p>
                  <p className="text-lg font-black text-slate-900">100% Original</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
