import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, MessageCircle, Zap, CheckCircle2 } from 'lucide-react';
import { Product } from '../App';
import { ProductSlider } from './ProductSlider';

interface ProductCardProps {
  product: Product;
  whatsappNumber: string;
}

export const ProductCard = ({ product, whatsappNumber }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const savings = product.market_price - product.our_price;
  const discountPercent = Math.round((savings / product.market_price) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="group bg-white rounded-[4rem] overflow-hidden border border-slate-50 shadow-sm hover:shadow-[0_50px_100px_-30px_rgba(0,0,0,0.1)] transition-all duration-700"
    >
      <ProductSlider images={product.image_urls} />

      <div className="p-10 md:p-12">
        <div className="flex justify-between items-start mb-6">
          <div className="bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full border border-blue-100">
            {product.brand}
          </div>
          <div className="bg-red-500 text-white text-[9px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full shadow-lg flex items-center gap-2">
            <Zap size={12} fill="currentColor" /> Hemat {discountPercent}%
          </div>
        </div>

        <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tighter group-hover:text-blue-600 transition-colors duration-500">
          {product.name}
        </h3>
        
        <div className="flex flex-wrap gap-2 mb-10">
          {product.features.slice(0, 3).map((feature, i) => (
            <span key={i} className="text-[9px] font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 uppercase tracking-widest">
              {feature}
            </span>
          ))}
        </div>

        <div className="bg-[#f8fafc] rounded-[2.5rem] p-8 mb-10 border border-slate-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">Hearing Center</span>
            <span className="text-sm text-slate-300 line-through font-bold">{formatPrice(product.market_price)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em]">HearPremium</span>
            <span className="text-4xl font-black text-slate-900 tracking-tighter">{formatPrice(product.our_price)}</span>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-200/50 text-[10px] text-green-600 font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <CheckCircle2 size={16} /> Anda Berhemat {formatPrice(savings)}
          </div>
        </div>

        {/* Marketplace Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {product.shopee_url && (
            <a href={product.shopee_url} target="_blank" className="flex items-center justify-center gap-2 bg-[#EE4D2D] text-white py-5 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-orange-100">
              Shopee
            </a>
          )}
          {product.tokopedia_url && (
            <a href={product.tokopedia_url} target="_blank" className="flex items-center justify-center gap-2 bg-[#03AC0E] text-white py-5 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-green-100">
              Tokopedia
            </a>
          )}
          {product.blibli_url && (
            <a href={product.blibli_url} target="_blank" className="flex items-center justify-center gap-2 bg-[#0095DA] text-white py-5 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-blue-100">
              Blibli
            </a>
          )}
          {product.tiktok_shop_url && (
            <a href={product.tiktok_shop_url} target="_blank" className="flex items-center justify-center gap-2 bg-black text-white py-5 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-slate-200">
              TikTok Shop
            </a>
          )}
        </div>
        
        <a 
          href={`https://wa.me/${whatsappNumber}?text=Halo, saya tertarik dengan ${product.name}`}
          target="_blank" 
          className="w-full flex items-center justify-center gap-4 bg-slate-900 text-white py-6 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all duration-500 shadow-2xl shadow-slate-200"
        >
          <MessageCircle size={20} /> Konsultasi & Pesan
        </a>
      </div>
    </motion.div>
  );
};
