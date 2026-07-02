import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Star, ShieldCheck, Medal, Activity } from 'lucide-react';
import { Setting } from '../hooks/useSettings';

interface HeroProps {
  settings: Setting[];
}

export const Hero = ({ settings }: HeroProps) => {
  const whatsappNumber = settings.find(s => s.key === 'whatsapp_number')?.value || "6281234567890";
  const heroImage = settings.find(s => s.key === 'hero_image_url')?.value || "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1600";
  const heroTitle = settings.find(s => s.key === 'hero_title')?.value || "Solusi Pendengaran Presisi & Terpercaya.";
  const heroLabel = settings.find(s => s.key === 'hero_label')?.value || "Standar Medis Global";

  return (
    <section className="relative pt-6 pb-16 lg:pt-28 lg:pb-40 overflow-hidden bg-white dark:bg-[#020617] transition-colors duration-500">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.015] dark:opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-[-5%] right-[-2%] w-[500px] h-[500px] bg-blue-50 dark:bg-blue-900/5 rounded-full blur-[100px] opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-20 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 text-center lg:text-left order-2 lg:order-1"
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm"
            >
              <ShieldCheck size={12} className="text-blue-600" /> {heroLabel}
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.05] mb-6 tracking-tighter">
              {heroTitle.split(' ').map((word, i) => (
                <span key={i} className={word.toLowerCase().includes('presisi') || word.toLowerCase().includes('terpercaya') ? 'text-blue-600' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h1>
            
            <p className="text-sm lg:text-lg text-slate-400 dark:text-slate-500 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
              Kami menghadirkan solusi pendengaran berkualitas dengan prinsip transparansi. Fokus kami adalah memberikan kejernihan suara yang optimal dengan nilai investasi yang rasional.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10 justify-center lg:justify-start">
              <a href="#catalog" className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 dark:shadow-blue-900/20 flex items-center justify-center gap-2.5 group active:scale-95">
                Eksplorasi Katalog <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href={`https://wa.me/${whatsappNumber}`} className="bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700 px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2.5 shadow-sm active:scale-95">
                <MessageCircle size={14} className="text-green-500" /> Konsultasi Profesional
              </a>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 pt-8 border-t border-slate-100 dark:border-slate-800/50">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-9 h-9 rounded-xl border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?u=${i + 60}`} alt="User" />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex text-amber-400 mb-0.5">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={10} fill="currentColor" />)}
                </div>
                <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Dipercaya oleh Ratusan Pengguna</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-7 relative order-1 lg:order-2"
          >
            <div className="relative z-10 rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden shadow-2xl border-[6px] lg:border-[12px] border-white dark:border-slate-800 bg-slate-50 dark:bg-slate-800 group">
              <div className="relative aspect-[4/5] lg:aspect-[1.4/1] overflow-hidden">
                <img 
                  src={heroImage} 
                  alt="Solusi Pendengaran Profesional"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>
              </div>
              
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute bottom-3 left-3 right-3 lg:bottom-8 lg:left-8 lg:right-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-5 lg:p-8 rounded-[2rem] border border-white/40 dark:border-slate-700/40 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 sm:gap-0">
                  <div className="text-center sm:text-left">
                    <p className="text-slate-400 dark:text-slate-500 text-[8px] font-black uppercase tracking-[0.3em] mb-2">Estimasi Harga Pasar</p>
                    <p className="text-lg lg:text-2xl line-through text-slate-300 dark:text-slate-700 font-black tracking-tight">Rp 45.000.000+</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-[8px] font-black px-3 py-1.5 rounded-lg mb-3 tracking-widest uppercase shadow-md">
                      <Activity size={10} /> NILAI TRANSPARAN
                    </div>
                    <p className="text-3xl lg:text-5xl text-slate-900 dark:text-white font-black tracking-tighter leading-none">
                      Rp 10jt <span className="text-blue-600">-</span> 18jt
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute -top-4 -right-2 lg:-top-8 lg:-right-4 bg-white dark:bg-slate-900 p-4 lg:p-6 rounded-[1.5rem] shadow-xl border border-slate-100 dark:border-slate-800 z-20 hidden xl:block"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-100 dark:shadow-blue-900/20">
                  <Medal className="text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Jaminan Kualitas</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">Garansi Resmi 2 Tahun</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
