import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Star, ShieldCheck, Medal, Activity } from 'lucide-react';
import { Setting } from '../hooks/useSettings';

interface HeroProps {
  settings: Setting[];
}

export const Hero = ({ settings }: HeroProps) => {
  const whatsappNumber = settings.find(s => s.key === 'whatsapp_number')?.value || "6281234567890";
  const heroImage = settings.find(s => s.key === 'hero_image_url')?.value || "https://images.unsplash.com/photo-1590611357128-7a2863182148?auto=format&fit=crop&q=80&w=1200";
  const heroTitle = settings.find(s => s.key === 'hero_title')?.value || "Akses Teknologi Tanpa Batas.";
  const heroLabel = settings.find(s => s.key === 'hero_label')?.value || "Premium Hearing Aid";

  return (
    <section className="relative pt-12 pb-20 lg:pt-32 lg:pb-48 overflow-hidden bg-white dark:bg-[#020617] transition-colors duration-500">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.02] dark:opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#2563eb 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }}></div>
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 text-center lg:text-left order-2 lg:order-1"
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] mb-8 shadow-sm"
            >
              <Medal size={14} className="text-blue-600" /> {heroLabel}
            </motion.div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-slate-900 dark:text-white leading-[0.95] mb-8 tracking-tighter">
              {heroTitle.split(' ').map((word, i) => (
                <span key={i} className={word.toLowerCase().includes('teknologi') || word.toLowerCase().includes('batas') ? 'text-blue-600' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h1>
            
            <p className="text-sm lg:text-xl text-slate-400 dark:text-slate-500 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              Kami menghadirkan solusi pendengaran tercanggih dengan transparansi harga yang nyata. Kualitas profesional untuk kenyamanan hidup Anda.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start">
              <a href="#catalog" className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 dark:shadow-blue-900/20 flex items-center justify-center gap-3 group active:scale-95">
                Jelajahi Katalog <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
              </a>
              <a href={`https://wa.me/${whatsappNumber}`} className="bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700 px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95">
                <MessageCircle size={16} className="text-green-500" /> Konsultasi Ahli
              </a>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-8 pt-10 border-t border-slate-100 dark:border-slate-800/50">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-2xl border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-md">
                    <img src={`https://i.pravatar.cc/150?u=${i + 40}`} alt="User" />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex text-amber-400 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Dipercaya Ribuan Pengguna</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-7 relative mt-12 lg:mt-0"
          >
            <div className="relative z-10 rounded-[3rem] lg:rounded-[4rem] overflow-hidden shadow-2xl border-[8px] lg:border-[16px] border-white dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
              <img 
                src={heroImage} 
                alt="Professional Hearing Technology"
                className="w-full aspect-[4/5] lg:aspect-[1.3/1] object-cover"
              />
              
              <motion.div 
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute bottom-4 left-4 right-4 lg:bottom-10 lg:left-10 lg:right-10 bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl p-6 lg:p-10 rounded-[2.5rem] border border-white/40 dark:border-slate-700/50 shadow-2xl"
              >
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 sm:gap-0">
                  <div className="text-center sm:text-left">
                    <p className="text-slate-400 dark:text-slate-500 text-[8px] font-black uppercase tracking-[0.3em] mb-2">Estimasi Harga Pasaran</p>
                    <p className="text-lg lg:text-3xl line-through text-slate-300 dark:text-slate-700 font-black tracking-tight">Rp 45.000.000+</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="inline-flex items-center gap-2 bg-blue-600 text-white text-[8px] font-black px-3 py-1.5 rounded-lg mb-3 tracking-widest uppercase shadow-lg shadow-blue-600/20">
                      <Activity size={10} /> TEKNOLOGI GLOBAL
                    </div>
                    <p className="text-3xl lg:text-5xl text-slate-900 dark:text-white font-black tracking-tighter">Rp 10jt - 18jt</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute -top-6 -right-2 lg:-top-12 lg:-right-8 bg-white dark:bg-slate-900 p-5 lg:p-7 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 z-20 hidden xl:block"
            >
              <div className="flex items-center gap-5">
                <div className="bg-blue-600 p-4 rounded-2xl shadow-xl shadow-blue-100 dark:shadow-blue-900/20">
                  <ShieldCheck className="text-white w-7 h-7" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Kualitas Terjamin</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">Garansi Resmi 2 Tahun</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
