import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Star, Award, ShieldCheck } from 'lucide-react';
import { Setting } from '../hooks/useSettings';

interface HeroProps {
  settings: Setting[];
}

export const Hero = ({ settings }: HeroProps) => {
  const whatsappNumber = settings.find(s => s.key === 'whatsapp_number')?.value || "6281234567890";
  const heroImage = settings.find(s => s.key === 'hero_image_url')?.value || "https://images.unsplash.com/photo-1590611357128-7a2863182148?auto=format&fit=crop&q=80&w=1200";

  return (
    <section className="relative pt-12 pb-16 lg:pt-32 lg:pb-32 overflow-hidden bg-white dark:bg-[#020617] transition-colors duration-500">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-[100px] opacity-40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100/50 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-8"
            >
              <Award size={12} /> Komitmen Kualitas Terbaik
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.05] mb-8 tracking-tighter">
              Akses Teknologi <br />
              <span className="text-blue-600 dark:text-blue-500">Tanpa Batas.</span>
            </h1>
            
            <p className="text-sm sm:text-base lg:text-lg text-slate-400 dark:text-slate-500 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              Kami menghadirkan solusi pendengaran tercanggih dengan transparansi harga yang nyata. Kualitas profesional untuk kenyamanan hidup Anda.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start">
              <a href="#catalog" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 dark:shadow-blue-900/20 flex items-center justify-center gap-2 group">
                Lihat Katalog <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href={`https://wa.me/${whatsappNumber}`} className="bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm">
                <MessageCircle size={14} className="text-green-500" /> Konsultasi Ahli
              </a>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 pt-8 border-t border-slate-50 dark:border-slate-800/50">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="User" />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex text-amber-400 mb-0.5">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Dipercaya Ribuan Pasien</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative z-10 rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] border-[6px] lg:border-[12px] border-white dark:border-slate-800">
              <img 
                src={heroImage} 
                alt="Premium Technology"
                className="w-full aspect-[4/5] lg:aspect-square object-cover"
              />
              
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-4 left-4 right-4 lg:bottom-10 lg:left-10 lg:right-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 lg:p-8 rounded-[2rem] border border-white/20 dark:border-slate-700/50 shadow-2xl"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-[8px] font-black uppercase tracking-[0.2em] mb-2">Harga Pasaran</p>
                    <p className="text-lg lg:text-2xl line-through text-slate-300 dark:text-slate-700 font-bold">Rp 45.000.000+</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-block bg-green-500 text-white text-[7px] font-black px-2 py-0.5 rounded-sm mb-2 tracking-widest uppercase">HARGA TERBAIK</div>
                    <p className="text-blue-600 dark:text-blue-400 text-[8px] font-black uppercase tracking-[0.3em] mb-1">HEARPREMIUM</p>
                    <p className="text-2xl lg:text-4xl text-slate-900 dark:text-white font-black tracking-tighter">Rp 10jt - 18jt</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-slate-50 dark:border-slate-800 z-20 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-100 dark:shadow-blue-900/20">
                  <ShieldCheck className="text-white w-5 h-5" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Kualitas Terjamin</p>
                  <p className="text-xs font-black text-slate-900 dark:text-white">Garansi Resmi</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
