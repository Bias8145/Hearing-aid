import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { Zap, Award, HeartPulse, Sparkles } from 'lucide-react';
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

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <main className="bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500">
      <Hero settings={settings} />

      <section id="why-us" className="py-20 md:py-32 bg-white dark:bg-slate-900/50 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-6">
              <Sparkles size={12} /> Komitmen Kami
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">STANDAR LAYANAN PROFESIONAL</h2>
            <p className="text-slate-400 dark:text-slate-500 text-sm md:text-lg font-medium leading-relaxed">Kami berdedikasi untuk menghadirkan teknologi pendengaran tercanggih dengan transparansi harga dan dukungan ahli berkelanjutan.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            {[
              {
                icon: <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
                title: "Kualitas Medis",
                desc: "Setiap perangkat telah melewati uji klinis ketat untuk memastikan kejernihan suara yang maksimal.",
                color: "bg-blue-50/50 dark:bg-blue-900/10"
              },
              {
                icon: <Zap className="w-8 h-8 text-amber-500 dark:text-amber-400" />,
                title: "Efisiensi Biaya",
                desc: "Model bisnis langsung memungkinkan Anda mendapatkan teknologi premium tanpa biaya tambahan yang tidak perlu.",
                color: "bg-amber-50/50 dark:bg-amber-900/10"
              },
              {
                icon: <HeartPulse className="w-8 h-8 text-red-500 dark:text-red-400" />,
                title: "Dukungan Penuh",
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
                <div className={`${item.color} p-7 rounded-[2rem] mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500 border border-transparent dark:border-slate-800/50`}>
                  {item.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-black mb-4 tracking-tight text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-slate-400 dark:text-slate-500 text-xs md:text-sm leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" className="py-20 md:py-32 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16 md:mb-24 text-center lg:text-left">
          <div className="inline-block bg-slate-900 dark:bg-blue-600 text-white text-[8px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full mb-6">
            Katalog Eksklusif 2025
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">TEKNOLOGI TERKINI</h2>
          <p className="text-slate-400 dark:text-slate-500 max-w-xl text-sm md:text-lg font-medium leading-relaxed mx-auto lg:mx-0">Pilihan perangkat pendengaran tercanggih dengan fitur Bluetooth, Rechargeable, dan AI-Noise Reduction.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 animate-pulse">
                <div className="w-full aspect-square bg-slate-50 dark:bg-slate-800 rounded-2xl mb-8"></div>
                <div className="h-7 bg-slate-50 dark:bg-slate-800 rounded-lg w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-50 dark:bg-slate-800 rounded-lg w-1/2 mb-10"></div>
                <div className="h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} whatsappNumber={whatsappNumber} />
            ))}
          </div>
        )}
      </section>

      <section className="py-20 md:py-32 bg-slate-900 dark:bg-blue-900/20 relative overflow-hidden mx-6 rounded-[3rem] mb-20 border border-transparent dark:border-blue-800/30">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center text-white">
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">MULAI PERJALANAN <br /> PENDENGARAN ANDA</h2>
          <p className="text-slate-400 dark:text-slate-500 text-sm md:text-xl mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
            Tim ahli kami siap memberikan solusi yang paling sesuai dengan kebutuhan dan gaya hidup Anda secara personal.
          </p>
          <a 
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 bg-blue-600 text-white px-10 md:px-14 py-5 md:py-7 rounded-[2rem] font-black text-[10px] md:text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/40 group"
          >
            <WhatsAppIcon className="w-6 h-6 md:w-8 md:h-8" /> 
            <span className="tracking-widest uppercase">Chat WhatsApp Sekarang</span>
          </a>
        </div>
      </section>
    </main>
  );
};

export default Home;
