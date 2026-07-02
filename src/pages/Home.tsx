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
            <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Mengapa Memilih Kami?</h2>
            <p className="text-slate-500 font-medium">Kami menghadirkan teknologi pendengaran terbaik dunia langsung ke tangan Anda dengan transparansi harga yang nyata.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
                title: "Kualitas Premium",
                desc: "Hanya menyediakan perangkat dengan teknologi terbaru yang telah teruji secara klinis.",
                color: "bg-blue-50"
              },
              {
                icon: <Zap className="w-8 h-8 text-amber-600" />,
                title: "Efisiensi Biaya",
                desc: "Hemat jutaan rupiah dengan model bisnis langsung tanpa perantara yang mahal.",
                color: "bg-amber-50"
              },
              {
                icon: <CheckCircle2 className="w-8 h-8 text-green-600" />,
                title: "Layanan Profesional",
                desc: "Dukungan teknis dan konsultasi berkelanjutan untuk memastikan kenyamanan maksimal Anda.",
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
                <div className={`${item.color} p-6 rounded-[2rem] mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-black mb-4 uppercase tracking-tight">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-block bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6">
              Katalog Premium 2025
            </div>
            <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">Koleksi Teknologi Pendengaran</h2>
            <p className="text-slate-500 max-w-xl font-medium">Pilihan perangkat tercanggih dengan fitur Noise Cancellation, Bluetooth, dan Rechargeable Battery.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[4rem] p-12 border border-slate-100 animate-pulse">
                <div className="w-full aspect-square bg-slate-50 rounded-[3rem] mb-8"></div>
                <div className="h-8 bg-slate-50 rounded-xl w-3/4 mb-6"></div>
                <div className="h-4 bg-slate-50 rounded-lg w-1/2 mb-10"></div>
                <div className="h-16 bg-slate-50 rounded-2xl w-full"></div>
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
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
          <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter">Ingin Konsultasi Dulu?</h2>
          <p className="text-slate-400 text-xl mb-16 max-w-2xl mx-auto font-medium">
            Tim ahli kami siap membantu Anda memilih perangkat yang paling sesuai dengan profil pendengaran dan gaya hidup Anda. Gratis tanpa biaya.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <a 
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-blue-700 transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] flex items-center justify-center gap-4 group"
            >
              <MessageCircle size={28} /> Chat WhatsApp Sekarang
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
