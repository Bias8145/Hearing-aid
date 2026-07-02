import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { Zap, Award, HeartPulse, ShieldCheck, Activity, Medal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Setting } from '../hooks/useSettings';
import { Product } from '../App';
import { WhatsAppIcon } from '../components/BrandIcons';

interface HomeProps {
  settings: Setting[];
}

const Home = ({ settings }: HomeProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const whatsappNumber = settings.find(s => s.key === 'whatsapp_number')?.value || "6281234567890";

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <main className="bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500">
      <Hero settings={settings} />

      <section id="why-us" className="py-24 md:py-40 bg-white dark:bg-slate-900/50 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
            <div className="inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-6 border border-slate-200 dark:border-slate-700">
              <ShieldCheck size={12} className="text-blue-600" /> Standar Medis
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">LAYANAN PROFESIONAL KAMI</h2>
            <p className="text-slate-400 dark:text-slate-500 text-base md:text-xl font-medium leading-relaxed">Kami berdedikasi untuk menghadirkan teknologi pendengaran tercanggih dengan transparansi harga dan dukungan ahli berkelanjutan.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
            {[
              {
                icon: <Medal className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
                title: "Kualitas Global",
                desc: "Setiap perangkat telah melewati uji klinis ketat untuk memastikan kejernihan suara yang maksimal.",
                color: "bg-blue-50/50 dark:bg-blue-900/10"
              },
              {
                icon: <Activity className="w-8 h-8 text-slate-600 dark:text-slate-400" />,
                title: "Teknologi Terkini",
                desc: "Model bisnis langsung memungkinkan Anda mendapatkan teknologi premium tanpa biaya tambahan yang tidak perlu.",
                color: "bg-slate-50/50 dark:bg-slate-800/20"
              },
              {
                icon: <HeartPulse className="w-8 h-8 text-red-500 dark:text-red-400" />,
                title: "Dukungan Ahli",
                desc: "Layanan konsultasi dan purna jual yang responsif untuk memastikan kenyamanan pendengaran Anda.",
                color: "bg-red-50/50 dark:bg-red-900/10"
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className={`${item.color} p-8 rounded-[2.5rem] mb-10 shadow-sm group-hover:scale-110 transition-transform duration-700 border border-transparent dark:border-slate-800/50`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-5 tracking-tighter text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-slate-400 dark:text-slate-500 text-sm md:text-base leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" className="py-24 md:py-40 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-20 md:mb-32 text-center lg:text-left">
          <div className="inline-block bg-slate-900 dark:bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full mb-8">
            Katalog Eksklusif 2025
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">TEKNOLOGI TERKINI</h2>
          <p className="text-slate-400 dark:text-slate-500 max-w-2xl text-base md:text-xl font-medium leading-relaxed mx-auto lg:mx-0">Pilihan perangkat pendengaran tercanggih dengan fitur Bluetooth, Rechargeable, dan AI-Noise Reduction.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 animate-pulse">
                <div className="w-full aspect-square bg-slate-50 dark:bg-slate-800 rounded-3xl mb-10"></div>
                <div className="h-8 bg-slate-50 dark:bg-slate-800 rounded-xl w-3/4 mb-5"></div>
                <div className="h-4 bg-slate-50 dark:bg-slate-800 rounded-xl w-1/2 mb-12"></div>
                <div className="h-16 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} whatsappNumber={whatsappNumber} />
            ))}
          </div>
        )}
      </section>

      <section className="py-24 md:py-40 bg-slate-900 dark:bg-blue-900/20 relative overflow-hidden mx-6 rounded-[4rem] mb-24 border border-transparent dark:border-blue-800/30">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center text-white">
          <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter">MULAI PERJALANAN <br /> PENDENGARAN ANDA</h2>
          <p className="text-slate-400 dark:text-slate-500 text-base md:text-2xl mb-16 font-medium leading-relaxed max-w-2xl mx-auto">
            Tim ahli kami siap memberikan solusi yang paling sesuai dengan kebutuhan dan gaya hidup Anda secara personal.
          </p>
          <a 
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-5 bg-blue-600 text-white px-12 md:px-16 py-6 md:py-8 rounded-[2.5rem] font-black text-xs md:text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/40 group active:scale-95"
          >
            <WhatsAppIcon className="w-7 h-7 md:w-9 md:h-9" /> 
            <span className="tracking-widest uppercase">Chat WhatsApp Sekarang</span>
          </a>
        </div>
      </section>
    </main>
  );
};

export default Home;
