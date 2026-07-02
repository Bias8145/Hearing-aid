import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { ShieldCheck, Activity, Medal, HeartPulse } from 'lucide-react';
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

      <section id="why-us" className="py-20 md:py-32 bg-white dark:bg-slate-900/30 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] mb-5 border border-slate-200 dark:border-slate-700">
              <ShieldCheck size={12} className="text-blue-600" /> Komitmen Profesional
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter uppercase">INTEGRITAS LAYANAN KAMI</h2>
            <p className="text-slate-400 dark:text-slate-500 text-sm md:text-lg font-medium leading-relaxed">Kami mengedepankan transparansi dalam setiap aspek, memastikan Anda mendapatkan solusi pendengaran yang tepat dengan nilai yang sebanding.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            {[
              {
                icon: <Medal className="w-7 h-7 text-blue-600 dark:text-blue-400" />,
                title: "Kualitas Terstandarisasi",
                desc: "Seluruh perangkat kami melalui kurasi ketat untuk memastikan performa akustik yang optimal sesuai standar medis.",
                color: "bg-blue-50/50 dark:bg-blue-900/10"
              },
              {
                icon: <Activity className="w-7 h-7 text-slate-600 dark:text-slate-400" />,
                title: "Transparansi Nilai",
                desc: "Kami menyajikan struktur biaya yang jelas tanpa biaya tersembunyi, memberikan efisiensi investasi bagi kesehatan Anda.",
                color: "bg-slate-50/50 dark:bg-slate-800/20"
              },
              {
                icon: <HeartPulse className="w-7 h-7 text-red-500 dark:text-red-400" />,
                title: "Dukungan Berkelanjutan",
                desc: "Layanan purna jual dan bantuan teknis profesional untuk memastikan kenyamanan mendengar Anda tetap terjaga.",
                color: "bg-red-50/50 dark:bg-red-900/10"
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className={`${item.color} p-7 rounded-[2rem] mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500 border border-transparent dark:border-slate-800/50`}>
                  {item.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-black mb-4 tracking-tighter text-slate-900 dark:text-white uppercase">{item.title}</h3>
                <p className="text-slate-400 dark:text-slate-500 text-xs md:text-sm leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" className="py-20 md:py-32 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16 md:mb-24 text-center lg:text-left">
          <div className="inline-block bg-slate-900 dark:bg-blue-600 text-white text-[8px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full mb-6">
            Katalog Solusi Pendengaran
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter uppercase">PILIHAN PERANGKAT TERBAIK</h2>
          <p className="text-slate-400 dark:text-slate-500 max-w-xl text-sm md:text-lg font-medium leading-relaxed mx-auto lg:mx-0">Kurasi perangkat dengan fitur esensial untuk mendukung produktivitas dan kualitas hidup Anda.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 animate-pulse">
                <div className="w-full aspect-square bg-slate-50 dark:bg-slate-800 rounded-2xl mb-8"></div>
                <div className="h-6 bg-slate-50 dark:bg-slate-800 rounded-lg w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-50 dark:bg-slate-800 rounded-lg w-1/2 mb-10"></div>
                <div className="h-12 bg-slate-50 dark:bg-slate-800 rounded-xl w-full"></div>
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
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '25px 25px' }}></div>
        <div className="max-w-3xl mx-auto px-6 relative z-10 text-center text-white">
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase leading-tight">DAPATKAN <br /> ANALISIS PROFESIONAL</h2>
          <p className="text-slate-400 dark:text-slate-500 text-sm md:text-xl mb-12 font-medium leading-relaxed max-w-xl mx-auto">
            Diskusikan kebutuhan pendengaran Anda dengan tim ahli kami untuk mendapatkan rekomendasi yang paling sesuai dengan profil klinis Anda.
          </p>
          <a 
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 bg-blue-600 text-white px-10 md:px-14 py-5 md:py-7 rounded-[2rem] font-black text-[10px] md:text-base hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/40 group active:scale-95"
          >
            <WhatsAppIcon className="w-6 h-6 md:w-8 md:h-8" /> 
            <span className="tracking-widest uppercase">Hubungi Tim Ahli via WhatsApp</span>
          </a>
        </div>
      </section>
    </main>
  );
};

export default Home;
