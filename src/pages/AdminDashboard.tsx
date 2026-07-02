import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { 
  Plus, Settings, Package, LogOut, Trash2, Edit3, 
  Globe, Phone, MapPin, Upload, X, Loader2, 
  ShoppingBag, Instagram, Facebook, Music2, Eye,
  Save, Image as ImageIcon
} from 'lucide-react';
import { Setting } from '../hooks/useSettings';
import { Product } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmModal } from '../components/ConfirmModal';

interface AdminDashboardProps {
  settings: Setting[];
}

const AdminDashboard = ({ settings: initialSettings }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Setting[]>(initialSettings);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'success' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'info'
  });

  useEffect(() => {
    checkAuth();
    fetchProducts();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate('/login');
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setProducts(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    setConfirmModal({
      isOpen: true,
      title: 'Keluar Sesi',
      message: 'Apakah Anda yakin ingin keluar dari panel admin?',
      type: 'info',
      onConfirm: async () => {
        await supabase.auth.signOut();
        navigate('/login');
      }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isHero = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      if (isHero) {
        await updateSetting('hero_image_url', publicUrl);
      } else {
        const newUrls = [...(editingProduct?.image_urls || []), publicUrl];
        setEditingProduct(prev => ({ ...prev, image_urls: newUrls }));
      }
      toast.success('Foto Berhasil Diunggah');
    } catch (error: any) {
      toast.error('Gagal Upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    const { error } = await supabase.from('site_settings').update({ value }).eq('key', key);
    if (!error) {
      setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
      toast.success('Pengaturan Diperbarui');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] pt-20 pb-20 transition-colors duration-500">
      <ConfirmModal 
        {...confirmModal} 
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">COMMAND <span className="text-blue-600">CENTER</span></h1>
            <p className="text-slate-400 dark:text-slate-500 font-black text-[9px] uppercase tracking-[0.4em] mt-3">HearPremium Management System</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={() => navigate('/')}
              className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest px-8 py-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
              <Eye size={16} /> Preview
            </button>
            <button 
              onClick={handleLogout}
              className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-white dark:bg-slate-900 text-red-500 font-black text-[10px] uppercase tracking-widest px-8 py-5 rounded-[1.5rem] border border-red-50 dark:border-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all shadow-sm"
            >
              <LogOut size={16} /> Keluar
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-12 bg-white dark:bg-slate-900 p-2 rounded-[2rem] border border-slate-100 dark:border-slate-800 w-fit shadow-sm">
          {[
            { id: 'products', label: 'Katalog Produk', icon: <Package size={14} /> },
            { id: 'settings', label: 'Pengaturan Web', icon: <Settings size={14} /> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all duration-500 ${activeTab === tab.id ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-xl' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'products' ? (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4 tracking-tight">
                <div className="bg-blue-600 p-2 rounded-xl"><Package className="text-white" size={20} /></div>
                Inventory ({products.length})
              </h2>
              <button 
                onClick={() => {
                  setEditingProduct({ features: [], image_urls: [] });
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 dark:shadow-blue-900/20"
              >
                <Plus size={20} /> Tambah Produk
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <div className="flex justify-center py-32">
                  <Loader2 className="animate-spin text-blue-600" size={40} />
                </div>
              ) : products.map(product => (
                <div key={product.id} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 group hover:shadow-2xl transition-all duration-500">
                  <div className="flex flex-col sm:flex-row items-center gap-8 w-full md:w-auto text-center sm:text-left">
                    <div className="relative w-28 h-28 rounded-[1.5rem] overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shrink-0 shadow-inner">
                      <img src={product.image_urls[0] || 'https://placehold.co/400x400?text=No+Image'} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full mb-3 inline-block">
                        {product.brand}
                      </span>
                      <h3 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight mb-2">{product.name}</h3>
                      <div className="flex items-center gap-4 justify-center sm:justify-start">
                        <p className="text-slate-300 dark:text-slate-700 line-through text-xs font-bold">Rp {product.market_price.toLocaleString('id-ID')}</p>
                        <p className="text-blue-600 dark:text-blue-400 text-xl font-black tracking-tighter">Rp {product.our_price.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                      className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-300"
                    >
                      <Edit3 size={16} /> Edit
                    </button>
                    <button 
                      onClick={() => {
                        setConfirmModal({
                          isOpen: true,
                          title: 'Hapus Produk',
                          message: `Apakah Anda yakin ingin menghapus ${product.name}?`,
                          type: 'danger',
                          onConfirm: async () => {
                            await supabase.from('products').delete().eq('id', product.id);
                            fetchProducts();
                            toast.success('Produk Berhasil Dihapus');
                          }
                        });
                      }}
                      className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-red-50 dark:bg-red-900/10 text-red-500 px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                      <Trash2 size={16} /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white dark:bg-slate-900 p-10 md:p-14 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-10 flex items-center gap-4 tracking-tight">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-xl"><ImageIcon className="text-blue-600" size={20} /></div>
                Visual Utama (Hero)
              </h3>
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1">Hero Background Image</label>
                  <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 group mb-6">
                    <img src={settings.find(s => s.key === 'hero_image_url')?.value} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => heroInputRef.current?.click()}
                      className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3 text-white"
                    >
                      {uploading ? <Loader2 className="animate-spin" /> : <Upload size={32} />}
                      <span className="text-[10px] font-black uppercase tracking-widest">Ganti Foto Utama</span>
                    </button>
                  </div>
                  <input type="file" ref={heroInputRef} onChange={(e) => handleImageUpload(e, true)} className="hidden" accept="image/*" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-10 md:p-14 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-10 flex items-center gap-4 tracking-tight">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-xl"><Phone className="text-blue-600" size={20} /></div>
                Kontak & Lokasi
              </h3>
              <div className="space-y-8">
                {[
                  { key: 'whatsapp_number', label: 'WhatsApp (62...)', icon: <Phone size={14} /> },
                  { key: 'email', label: 'Email Bisnis', icon: <Globe size={14} /> },
                  { key: 'address', label: 'Alamat Lengkap', icon: <MapPin size={14} />, type: 'textarea' }
                ].map(field => {
                  const setting = settings.find(s => s.key === field.key);
                  return (
                    <div key={field.key}>
                      <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1">
                        {field.icon} {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea 
                          defaultValue={setting?.value}
                          onBlur={(e) => updateSetting(field.key, e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-700 dark:text-slate-300 resize-none"
                          rows={4}
                        />
                      ) : (
                        <input 
                          type="text"
                          defaultValue={setting?.value}
                          onBlur={(e) => updateSetting(field.key, e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-700 dark:text-slate-300"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
