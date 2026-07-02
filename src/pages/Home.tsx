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
    <main>
      <Hero settings={settings} />

      {/* Trust Section */}
      <section id="why-us" className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Mengapa Memilih Kami?</h2>
            <p className="text-slate-500">Kami memangkas biaya sewa gedung mewah dan iklan mahal untuk memberikan harga terbaik bagi pendengaran Anda.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
                title: "100% Original",
                desc: "Semua produk kami dijamin asli, baru, dan tersegel dari pabrik brand ternama dunia.",
                color: "bg-blue-50"
              },
              {
                icon: <Zap className="w-8 h-8 text-amber-600" />,
                title: "Harga Pabrik",
                desc: "Hemat hingga 70% dibandingkan Hearing Center konvensional tanpa mengurangi kualitas teknologi.",
                color: "bg-amber-50"
              },
              {
                icon: <CheckCircle2 className="w-8 h-8 text-green-600" />,
                title: "Dukungan Ahli",
                desc: "Konsultasi gratis dan panduan teknis seumur hidup untuk memastikan kenyamanan Anda.",
                color: "bg-green-50"
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
                <div className={`${item.color} p-5 rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-block bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4">
              Premium Catalog 2025
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4">Koleksi Alat Bantu Dengar</h2>
            <p className="text-slate-500 max-w-xl">Pilihan teknologi terbaik dari Phonak, Oticon, dan Signia dengan fitur Noise Cancellation dan Bluetooth terkini.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-100 animate-pulse">
                <div className="w-full aspect-square bg-slate-100 rounded-2xl mb-6"></div>
                <div className="h-6 bg-slate-100 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2 mb-8"></div>
                <div className="h-12 bg-slate-100 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} whatsappNumber={whatsappNumber} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-black mb-8">Masih Ragu Memilih?</h2>
          <p className="text-blue-100 text-lg mb-12 max-w-2xl mx-auto">
            Konsultasikan kebutuhan pendengaran Anda dengan tim ahli kami secara gratis melalui WhatsApp. Kami siap membantu Anda menemukan solusi terbaik.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-50 transition-all shadow-2xl flex items-center justify-center gap-3"
            >
              <MessageCircle size={24} /> Chat WhatsApp Sekarang
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
