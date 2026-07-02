import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Zap, CheckCircle2 } from 'lucide-react';
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500"
    >
      <ProductSlider images={product.image_urls} />

      <div className="p-6 md:p-8">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-100">
            {product.brand}
          </div>
          <div className="bg-red-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <Zap size={10} fill="currentColor" /> -{discountPercent}%
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex flex-wrap gap-1.5 mb-6">
          {product.features.slice(0, 2).map((feature, i) => (
            <span key={i} className="text-[8px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 uppercase tracking-wider">
              {feature}
            </span>
          ))}
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[8px] text-slate-400 font-black uppercase tracking-wider">Market Price</span>
            <span className="text-xs text-slate-300 line-through font-bold">{formatPrice(product.market_price)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-blue-600 font-black uppercase tracking-wider">HearPremium</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">{formatPrice(product.our_price)}</span>
          </div>
        </div>

        {/* Compact Marketplace Links */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {product.shopee_url && (
            <a href={product.shopee_url} target="_blank" className="flex items-center justify-center bg-[#EE4D2D]/10 text-[#EE4D2D] py-3 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-[#EE4D2D] hover:text-white transition-all">
              Shopee
            </a>
          )}
          {product.tokopedia_url && (
            <a href={product.tokopedia_url} target="_blank" className="flex items-center justify-center bg-[#03AC0E]/10 text-[#03AC0E] py-3 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-[#03AC0E] hover:text-white transition-all">
              Tokopedia
            </a>
          )}
        </div>
        
        <a 
          href={`https://wa.me/${whatsappNumber}?text=Halo, saya tertarik dengan ${product.name}`}
          target="_blank" 
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
        >
          <MessageCircle size={16} /> Konsultasi Sekarang
        </a>
      </div>
    </motion.div>
  );
};
