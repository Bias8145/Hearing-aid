import React from 'react';
import { Ear, Phone, Mail, MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { Setting } from '../hooks/useSettings';

interface FooterProps {
  settings: Setting[];
}

export const Footer = ({ settings }: FooterProps) => {
  const getVal = (key: string) => settings.find(s => s.key === key)?.value || "";

  return (
    <footer className="bg-slate-900 text-slate-400 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20">
                <Ear className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-black tracking-tighter text-white uppercase">Hear<span className="text-blue-500">Premium</span></span>
            </div>
            <p className="max-w-md text-xl leading-relaxed mb-12 text-slate-400 font-medium">
              Misi kami adalah memberikan akses teknologi pendengaran kelas dunia bagi semua orang dengan harga yang jujur dan transparan.
            </p>
            <div className="flex gap-8">
              {getVal('instagram_url') && <a href={getVal('instagram_url')} className="hover:text-blue-500 transition-all hover:scale-110"><Instagram size={28} /></a>}
              {getVal('facebook_url') && <a href={getVal('facebook_url')} className="hover:text-blue-500 transition-all hover:scale-110"><Facebook size={28} /></a>}
              {getVal('tiktok_url') && <a href={getVal('tiktok_url')} className="hover:text-blue-500 transition-all hover:scale-110"><MessageCircle size={28} /></a>}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-10">Hubungi Kami</h4>
            <ul className="space-y-8">
              <li className="flex items-start gap-5">
                <div className="bg-slate-800 p-3 rounded-xl"><MapPin className="w-5 h-5 text-blue-500" /></div>
                <span className="text-sm font-bold leading-relaxed">{getVal('address')}</span>
              </li>
              <li className="flex items-center gap-5">
                <div className="bg-slate-800 p-3 rounded-xl"><Phone className="w-5 h-5 text-blue-500" /></div>
                <span className="text-sm font-bold">+{getVal('whatsapp_number')}</span>
              </li>
              <li className="flex items-center gap-5">
                <div className="bg-slate-800 p-3 rounded-xl"><Mail className="w-5 h-5 text-blue-500" /></div>
                <span className="text-sm font-bold">{getVal('email')}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-10">Official Store</h4>
            <ul className="space-y-6">
              {getVal('shopee_url') && <li><a href={getVal('shopee_url')} className="hover:text-white font-bold text-sm transition-colors flex items-center gap-3">Shopee Official</a></li>}
              {getVal('tokopedia_url') && <li><a href={getVal('tokopedia_url')} className="hover:text-white font-bold text-sm transition-colors flex items-center gap-3">Tokopedia Merchant</a></li>}
              {getVal('blibli_url') && <li><a href={getVal('blibli_url')} className="hover:text-white font-bold text-sm transition-colors flex items-center gap-3">Blibli Store</a></li>}
              {getVal('tiktok_shop_url') && <li><a href={getVal('tiktok_shop_url')} className="hover:text-white font-bold text-sm transition-colors flex items-center gap-3">TikTok Shop</a></li>}
            </ul>
          </div>
        </div>
        
        <div className="pt-16 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <p>© 2025 HearPremium Indonesia. Solusi Pendengaran Profesional.</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
