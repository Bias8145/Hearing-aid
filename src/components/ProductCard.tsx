import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, MessageCircle, ArrowUpRight, Zap, CheckCircle2 } from 'lucide-react';
import { Product } from '../App';

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-[0_50px_100px_-30px_rgba(0,0,0,0.12)] transition-all duration-700"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f8fafc]">
        <img 
          src={product.image_urls[0] || 'https://images.unsplash.com/photo-1590611380053-da6447021fbb?q=80&w=800'} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        
        <div className="absolute top-8 left-8 flex flex-col gap-3">
          <div className="bg-white/90 backdrop-blur-xl text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-full shadow-sm border border-blue-100/50">
            {product.brand}
          </div>
          <div className="bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2">
            <Zap size={12} fill="currentColor" /> Hemat {discountPercent}%
          </div>
        </div>
      </div>

      <div className="p-10">
        <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {product.features.slice(0, 3).map((feature, i) => (
            <span key={i} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              {feature}
            </span>
          ))}
        </div>

        <div className="bg-[#f8fafc] rounded-[2rem] p-6 mb-8 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Hearing Center</span>
            <span className="text-sm text-slate-300 line-through font-bold">{formatPrice(product.market_price)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-600 font-black uppercase tracking-widest">HearPremium</span>
            <span className="text-3xl font-black text-slate-900 tracking-tighter">{formatPrice(product.our_price)}</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200/50 text-[10px] text-green-600 font-black uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 size={14} /> Anda Berhemat {formatPrice(savings)}
          </div>
        </div>

        {/* Marketplace Links */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {product.shopee_url && (
            <a href={product.shopee_url} target="_blank" className="flex items-center justify-center gap-2 bg-[#EE4D2D] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-orange-100">
              Shopee
            </a>
          )}
          {product.tokopedia_url && (
            <a href={product.tokopedia_url} target="_blank" className="flex items-center justify-center gap-2 bg-[#03AC0E] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-green-100">
              Tokopedia
            </a>
          )}
          {product.blibli_url && (
            <a href={product.blibli_url} target="_blank" className="flex items-center justify-center gap-2 bg-[#0095DA] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-blue-100">
              Blibli
            </a>
          )}
          {product.tiktok_shop_url && (
            <a href={product.tiktok_shop_url} target="_blank" className="flex items-center justify-center gap-2 bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-slate-200">
              TikTok Shop
            </a>
          )}
        </div>
        
        <a 
          href={`https://wa.me/${whatsappNumber}?text=Halo, saya tertarik dengan ${product.name}`}
          target="_blank" 
          className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200"
        >
          <MessageCircle size={18} /> Konsultasi & Pesan
        </a>
      </div>
    </motion.div>
  );
};
