import React from 'react';
import { Ear, Phone, Mail, MapPin, Instagram, Facebook, Music2, MessageCircle } from 'lucide-react';
import { Setting } from '../hooks/useSettings';

interface FooterProps {
  settings: Setting[];
}

export const Footer = ({ settings }: FooterProps) => {
  const getVal = (key: string) => settings.find(s => s.key === key)?.value || "";

  return (
    <footer className="bg-slate-900 text-slate-400 pt-32 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-20 mb-32">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-5 mb-12">
              <div className="bg-blue-600 p-4 rounded-[1.5rem] shadow-2xl shadow-blue-600/20">
                <Ear className="w-10 h-10 text-white" />
              </div>
              <span className="text-4xl font-black tracking-tighter text-white uppercase">Hear<span className="text-blue-500">Premium</span></span>
            </div>
            <p className="max-w-md text-2xl leading-relaxed mb-16 text-slate-400 font-medium tracking-tight">
              Misi kami adalah memberikan akses teknologi pendengaran kelas dunia bagi semua orang dengan harga yang jujur dan transparan.
            </p>
            <div className="flex gap-10">
              {[
                { url: getVal('instagram_url'), icon: <Instagram size={32} /> },
                { url: getVal('facebook_url'), icon: <Facebook size={32} /> },
                { url: getVal('tiktok_url'), icon: <Music2 size={32} /> }
              ].map((social, i) => social.url && (
                <a key={i} href={social.url} target="_blank" className="text-slate-600 hover:text-blue-500 transition-all duration-500 hover:scale-125">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.4em] mb-12">Hubungi Kami</h4>
            <ul className="space-y-10">
              <li className="flex items-start gap-6">
                <div className="bg-slate-800 p-4 rounded-2xl"><MapPin className="w-6 h-6 text-blue-500" /></div>
                <span className="text-sm font-bold leading-relaxed">{getVal('address')}</span>
              </li>
              <li className="flex items-center gap-6">
                <div className="bg-slate-800 p-4 rounded-2xl"><Phone className="w-6 h-6 text-blue-500" /></div>
                <span className="text-sm font-black tracking-widest text-white">+{getVal('whatsapp_number')}</span>
              </li>
              <li className="flex items-center gap-6">
                <div className="bg-slate-800 p-4 rounded-2xl"><Mail className="w-6 h-6 text-blue-500" /></div>
                <span className="text-sm font-bold">{getVal('email')}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.4em] mb-12">Official Store</h4>
            <ul className="space-y-8">
              {[
                { url: getVal('shopee_url'), label: 'Shopee Official' },
                { url: getVal('tokopedia_url'), label: 'Tokopedia Merchant' },
                { url: getVal('blibli_url'), label: 'Blibli Store' },
                { url: getVal('tiktok_shop_url'), label: 'TikTok Shop' }
              ].map((shop, i) => shop.url && (
                <li key={i}>
                  <a href={shop.url} target="_blank" className="group flex items-center gap-4 text-slate-500 hover:text-white transition-all duration-500">
                    <div className="w-2 h-2 bg-blue-600 rounded-full group-hover:scale-150 transition-transform"></div>
                    <span className="font-black text-[10px] uppercase tracking-widest">{shop.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-20 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-10 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">
          <p>© 2025 HearPremium Indonesia. Solusi Pendengaran Profesional.</p>
          <div className="flex gap-12">
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
