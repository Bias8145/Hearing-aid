import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { 
  Plus, Settings, Package, LogOut, Trash2, Edit3, 
  Globe, Phone, MapPin, Upload, X, Loader2, 
  Eye, Save, Image as ImageIcon, Type, ShieldCheck
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
    const { error } = await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' });
    if (!error) {
      setSettings(prev => {
        const exists = prev.find(s => s.key === key);
        if (exists) return prev.map(s => s.key === key ? { ...s, value } : s);
        return [...prev, { key, value }];
      });
      toast.success('Pengaturan Diperbarui');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const productData = {
      name: formData.get('name') as string,
      brand: formData.get('brand') as string,
      description: formData.get('description') as string,
      market_price: Number(formData.get('market_price')),
      our_price: Number(formData.get('our_price')),
      shopee_url: formData.get('shopee_url') as string,
      tokopedia_url: formData.get('tokopedia_url') as string,
      blibli_url: formData.get('blibli_url') as string,
      tiktok_shop_url: formData.get('tiktok_shop_url') as string,
      image_urls: editingProduct?.image_urls || [],
      features: (formData.get('features') as string).split(',').map(f => f.trim()).filter(f => f !== ''),
    };

    setConfirmModal({
      isOpen: true,
      title: editingProduct?.id ? 'Simpan Perubahan' : 'Tambah Produk',
      message: 'Apakah Anda yakin ingin menyimpan data produk ini?',
      type: 'success',
      onConfirm: async () => {
        let error;
        if (editingProduct?.id) {
          const { error: updateError } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
          error = updateError;
        } else {
          const { error: insertError } = await supabase.from('products').insert([productData]);
          error = insertError;
        }

        if (!error) {
          toast.success('Produk Berhasil Disimpan');
          setIsModalOpen(false);
          fetchProducts();
        } else {
          toast.error('Gagal Menyimpan Produk');
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] pt-20 pb-24 transition-colors duration-500">
      <ConfirmModal 
        {...confirmModal} 
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">ADMIN <span className="text-blue-600">PANEL</span></h1>
            <p className="text-slate-400 dark:text-slate-500 font-black text-[9px] uppercase tracking-[0.3em] mt-3">Manajemen Konten & Pengaturan</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={() => navigate('/')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest px-8 py-4 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95"
            >
              <Eye size={16} /> Preview Situs
            </button>
            <button 
              onClick={handleLogout}
              className="flex-1 md:flex-none flex items-center justify-center gap-2.5 bg-white dark:bg-slate-900 text-red-500 font-black text-[10px] uppercase tracking-widest px-8 py-4 rounded-[1.5rem] border border-red-50 dark:border-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all shadow-sm active:scale-95"
            >
              <LogOut size={16} /> Keluar
            </button>
          </div>
        </div>

        <div className="flex gap-2.5 mb-12 bg-white dark:bg-slate-900 p-2 rounded-[2rem] border border-slate-100 dark:border-slate-800 w-fit shadow-sm">
          {[
            { id: 'products', label: 'Katalog Produk', icon: <Package size={14} /> },
            { id: 'settings', label: 'Pengaturan Web', icon: <Settings size={14} /> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all duration-500 ${activeTab === tab.id ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-lg' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'products' ? (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4 tracking-tight uppercase">
                <Package className="text-blue-600" size={20} /> Daftar Inventaris ({products.length})
              </h2>
              <button 
                onClick={() => {
                  setEditingProduct({ features: [], image_urls: [] });
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 dark:shadow-blue-900/20 active:scale-95"
              >
                <Plus size={20} /> Tambah Produk
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Memuat Data...</p>
                </div>
              ) : products.map(product => (
                <div key={product.id} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 group hover:shadow-xl transition-all duration-500">
                  <div className="flex flex-col sm:flex-row items-center gap-8 w-full md:w-auto text-center sm:text-left">
                    <div className="relative w-28 h-28 rounded-[1.5rem] overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shrink-0 group-hover:scale-105 transition-transform duration-500">
                      <img src={product.image_urls[0] || 'https://placehold.co/400x400?text=No+Image'} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full mb-3 inline-block">
                        {product.brand}
                      </span>
                      <h3 className="font-black text-2xl text-slate-900 dark:text-white tracking-tighter mb-2">{product.name}</h3>
                      <div className="flex items-center gap-4 justify-center sm:justify-start">
                        <p className="text-slate-300 dark:text-slate-700 line-through text-xs font-bold">Rp {product.market_price.toLocaleString('id-ID')}</p>
                        <p className="text-blue-600 dark:text-blue-400 text-xl font-black tracking-tighter">Rp {product.our_price.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-500"
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
                            toast.success('Produk Dihapus');
                          }
                        });
                      }}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2.5 bg-red-50 dark:bg-red-900/10 text-red-500 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-500"
                    >
                      <Trash2 size={16} /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-10 md:p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-10 flex items-center gap-4 tracking-tight uppercase">
                <ImageIcon className="text-blue-600" size={20} /> Konten Visual
              </h3>
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5 ml-1">Latar Belakang Utama (Hero)</label>
                  <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 group mb-6">
                    <img src={settings.find(s => s.key === 'hero_image_url')?.value} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => heroInputRef.current?.click()}
                      className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-3 text-white"
                    >
                      {uploading ? <Loader2 className="animate-spin" size={24} /> : <Upload size={32} />}
                      <span className="text-[10px] font-black uppercase tracking-widest">Ganti Foto</span>
                    </button>
                  </div>
                  <input type="file" ref={heroInputRef} onChange={(e) => handleImageUpload(e, true)} className="hidden" accept="image/*" />
                </div>

                {[
                  { key: 'hero_title', label: 'Judul Utama', icon: <Type size={14} /> },
                  { key: 'hero_label', label: 'Label Kecil', icon: <ShieldCheck size={14} /> }
                ].map(field => {
                  const setting = settings.find(s => s.key === field.key);
                  return (
                    <div key={field.key}>
                      <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1">
                        {field.icon} {field.label}
                      </label>
                      <input 
                        type="text"
                        defaultValue={setting?.value}
                        onBlur={(e) => updateSetting(field.key, e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-700 dark:text-slate-300"
                        placeholder={`Masukkan ${field.label}...`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-10 md:p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-10 flex items-center gap-4 tracking-tight uppercase">
                <Phone className="text-blue-600" size={20} /> Kontak & Informasi
              </h3>
              <div className="space-y-8">
                {[
                  { key: 'whatsapp_number', label: 'WhatsApp (62...)', icon: <Phone size={14} /> },
                  { key: 'email', label: 'Email Bisnis', icon: <Globe size={14} /> },
                  { key: 'address', label: 'Alamat Operasional', icon: <MapPin size={14} />, type: 'textarea' }
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
                          placeholder="Masukkan alamat..."
                        />
                      ) : (
                        <input 
                          type="text"
                          defaultValue={setting?.value}
                          onBlur={(e) => updateSetting(field.key, e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-700 dark:text-slate-300"
                          placeholder={`Masukkan ${field.label}...`}
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

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-[2.5rem] shadow-2xl p-8 md:p-10 custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                  {editingProduct?.id ? 'Edit Data Produk' : 'Tambah Produk Baru'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-900 transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Nama Produk</label>
                      <input name="name" defaultValue={editingProduct?.name} required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Brand</label>
                      <input name="brand" defaultValue={editingProduct?.brand} required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Market Price</label>
                        <input name="market_price" type="number" defaultValue={editingProduct?.market_price} required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Our Price</label>
                        <input name="our_price" type="number" defaultValue={editingProduct?.our_price} required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Foto Katalog</label>
                      <div className="grid grid-cols-4 gap-3 mb-3">
                        {editingProduct?.image_urls?.map((url, i) => (
                          <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700">
                            <img src={url} className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => setEditingProduct(prev => ({ ...prev, image_urls: prev?.image_urls?.filter((_, idx) => idx !== i) }))}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md shadow-lg"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all"
                        >
                          {uploading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={20} />}
                          <span className="text-[7px] font-black uppercase tracking-widest">Upload</span>
                        </button>
                      </div>
                      <input type="file" ref={fileInputRef} onChange={(e) => handleImageUpload(e)} className="hidden" accept="image/*" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Fitur Utama (Pisahkan dengan koma)</label>
                      <textarea name="features" defaultValue={editingProduct?.features?.join(', ')} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold resize-none" rows={3} />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tautan Marketplace</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['shopee_url', 'tokopedia_url', 'blibli_url', 'tiktok_shop_url'].map(key => (
                      <div key={key}>
                        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{key.replace('_', ' ').toUpperCase()}</label>
                        <input name={key} defaultValue={(editingProduct as any)?.[key]} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-xs" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-slate-900 dark:bg-blue-600 text-white py-5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 dark:hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-3"
                  >
                    <Save size={18} /> Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
