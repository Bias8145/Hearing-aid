import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { ShieldCheck, Zap, CheckCircle2, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Setting } from '../hooks/useSettings';
import { Product } from '../App';

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
    <main className="bg-[#f8fafc]">
      <Hero settings={settings} />

      {/* Trust Section - Compact for Mobile */}
      <section id="why-us" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-20">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">MENGAPA HEARPREMIUM?</h2>
            <p className="text-slate-500 text-sm md:text-base font-medium">Teknologi pendengaran terbaik dunia dengan transparansi harga yang nyata.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />,
                title: "Kualitas Global",
                desc: "Perangkat dengan teknologi terbaru yang teruji secara klinis.",
                color: "bg-blue-50"
              },
              {
                icon: <Zap className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />,
                title: "Harga Pabrik",
                desc: "Hemat hingga 70% dengan model bisnis langsung tanpa perantara.",
                color: "bg-amber-50"
              },
              {
                icon: <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-green-600" />,
                title: "Layanan Ahli",
                desc: "Dukungan profesional untuk kenyamanan pendengaran Anda.",
                color: "bg-green-50"
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-slate-50 transition-colors"
              >
                <div className={`${item.color} p-4 md:p-6 rounded-2xl mb-6 shadow-sm`}>
                  {item.icon}
                </div>
                <h3 className="text-lg md:text-xl font-black mb-3 tracking-tight">{item.title}</h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12 md:mb-20">
          <div className="inline-block bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Katalog Premium 2025
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">TEKNOLOGI TERBARU</h2>
          <p className="text-slate-500 max-w-xl text-sm md:text-base font-medium">Pilihan perangkat tercanggih dengan fitur Bluetooth & Rechargeable.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 animate-pulse">
                <div className="w-full aspect-square bg-slate-50 rounded-2xl mb-6"></div>
                <div className="h-6 bg-slate-50 rounded-lg w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-50 rounded-lg w-1/2 mb-8"></div>
                <div className="h-12 bg-slate-50 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} whatsappNumber={whatsappNumber} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-slate-900 relative overflow-hidden mx-6 rounded-[3rem] mb-16">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">KONSULTASI GRATIS HARI INI</h2>
          <p className="text-slate-400 text-sm md:text-lg mb-10 font-medium">
            Tim ahli kami siap membantu Anda memilih perangkat yang paling sesuai dengan gaya hidup Anda.
          </p>
          <a 
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 md:px-12 py-4 md:py-6 rounded-2xl font-black text-sm md:text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20"
          >
            <MessageCircle size={24} /> Chat WhatsApp Sekarang
          </a>
        </div>
      </section>
    </main>
  );
};

export default Home;
