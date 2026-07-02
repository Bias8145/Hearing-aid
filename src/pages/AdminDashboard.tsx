import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { 
  Plus, Settings, Package, LogOut, Trash2, Edit3, 
  Globe, Phone, MapPin, Upload, X, Loader2, 
  ShoppingBag, Instagram, Facebook, Music2
} from 'lucide-react';
import { Setting } from '../hooks/useSettings';
import { Product } from '../App';
import { motion, AnimatePresence } from 'framer-motion';

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
  const navigate = useNavigate();

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
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const newUrls = [...(editingProduct?.image_urls || [])];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
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
        
        newUrls.push(publicUrl);
      }

      setEditingProduct(prev => ({ ...prev, image_urls: newUrls }));
      toast.success(`${files.length} Foto Berhasil Diunggah`);
    } catch (error: any) {
      toast.error('Gagal Upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setEditingProduct(prev => ({
      ...prev,
      image_urls: prev?.image_urls?.filter((_, i) => i !== index)
    }));
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
      features: (formData.get('features') as string).split(',').map(f => f.trim()).filter(f => f),
    };

    let error;
    if (editingProduct?.id) {
      ({ error } = await supabase.from('products').update(productData).eq('id', editingProduct.id));
    } else {
      ({ error } = await supabase.from('products').insert([productData]));
    }

    if (!error) {
      toast.success('Katalog Berhasil Diperbarui');
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } else {
      toast.error('Gagal Menyimpan Produk');
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
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Control <span className="text-blue-600">Center</span></h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] mt-2">HearPremium Management System v3.0</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 bg-white text-red-600 font-black text-[10px] uppercase tracking-[0.2em] px-8 py-4 rounded-[1.5rem] border border-red-50 hover:bg-red-50 transition-all shadow-sm"
          >
            <LogOut size={16} /> Keluar Sesi
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-12 bg-white p-2 rounded-[2.5rem] border border-slate-100 w-fit shadow-sm">
          {[
            { id: 'products', label: 'Katalog Produk', icon: <Package size={16} /> },
            { id: 'settings', label: 'Pengaturan Web', icon: <Settings size={16} /> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-10 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-2xl shadow-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'products' ? (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <Package className="text-blue-600" size={20} />
                </div>
                Inventaris Produk ({products.length})
              </h2>
              <button 
                onClick={() => {
                  setEditingProduct({ features: [], image_urls: [] });
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100"
              >
                <Plus size={20} /> Tambah Katalog Baru
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="animate-spin text-blue-600" size={40} />
                </div>
              ) : products.map(product => (
                <motion.div 
                  layout
                  key={product.id} 
                  className="bg-white p-8 rounded-[3rem] border border-slate-50 flex flex-col lg:flex-row items-center justify-between gap-8 group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-700"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-8 w-full lg:w-auto">
                    <div className="relative w-32 h-32 rounded-[2rem] overflow-hidden bg-[#f8fafc] border border-slate-100 shrink-0">
                      <img src={product.image_urls[0] || 'https://placehold.co/400x400?text=No+Image'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="text-center sm:text-left">
                      <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3 inline-block">
                        {product.brand}
                      </span>
                      <h3 className="font-black text-2xl text-slate-900 tracking-tight mb-2">{product.name}</h3>
                      <p className="text-slate-900 text-lg font-black tracking-tight">Rp {product.our_price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full lg:w-auto">
                    <button 
                      onClick={() => {
                        setEditingProduct(product);
                        setIsModalOpen(true);
                      }}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-slate-50 text-slate-900 px-8 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all duration-500"
                    >
                      <Edit3 size={16} /> Edit
                    </button>
                    <button 
                      onClick={async () => {
                        if (confirm('Hapus produk?')) {
                          await supabase.from('products').delete().eq('id', product.id);
                          fetchProducts();
                        }
                      }}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-red-50 text-red-600 px-8 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all duration-500"
                    >
                      <Trash2 size={16} /> Hapus
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Settings */}
            <div className="bg-white p-12 rounded-[4rem] border border-slate-50 shadow-sm">
              <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <Phone className="text-blue-600" size={20} />
                </div>
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
                      <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                        {field.icon} {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea 
                          defaultValue={setting?.value}
                          onBlur={(e) => updateSetting(field.key, e.target.value)}
                          className="w-full bg-[#f8fafc] border border-slate-100 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-700 resize-none"
                          rows={3}
                        />
                      ) : (
                        <input 
                          type="text"
                          defaultValue={setting?.value}
                          onBlur={(e) => updateSetting(field.key, e.target.value)}
                          className="w-full bg-[#f8fafc] border border-slate-100 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-700"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social & Marketplace */}
            <div className="bg-white p-12 rounded-[4rem] border border-slate-50 shadow-sm">
              <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <Globe className="text-blue-600" size={20} />
                </div>
                Ekosistem Digital
              </h3>
              <div className="space-y-8 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                {[
                  { key: 'shopee_url', label: 'Shopee Store', color: 'text-orange-500', icon: <ShoppingBag size={14} /> },
                  { key: 'tokopedia_url', label: 'Tokopedia Store', color: 'text-green-500', icon: <ShoppingBag size={14} /> },
                  { key: 'blibli_url', label: 'Blibli Store', color: 'text-blue-500', icon: <ShoppingBag size={14} /> },
                  { key: 'tiktok_shop_url', label: 'TikTok Shop', color: 'text-black', icon: <ShoppingBag size={14} /> },
                  { key: 'instagram_url', label: 'Instagram', color: 'text-pink-500', icon: <Instagram size={14} /> },
                  { key: 'facebook_url', label: 'Facebook', color: 'text-blue-700', icon: <Facebook size={14} /> },
                  { key: 'tiktok_url', label: 'TikTok Profile', color: 'text-slate-900', icon: <Music2 size={14} /> }
                ].map(field => {
                  const setting = settings.find(s => s.key === field.key);
                  return (
                    <div key={field.key}>
                      <label className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${field.color}`}>
                        {field.icon} {field.label}
                      </label>
                      <input 
                        type="text"
                        defaultValue={setting?.value}
                        onBlur={(e) => updateSetting(field.key, e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-[#f8fafc] border border-slate-100 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-700"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Product Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 40 }}
                className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[4rem] shadow-2xl p-10 md:p-16"
              >
                <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 p-4 hover:bg-slate-50 rounded-[1.5rem] transition-all">
                  <X />
                </button>

                <div className="mb-12 text-center md:text-left">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                    {editingProduct?.id ? 'Edit Katalog' : 'Buat Katalog Baru'}
                  </h2>
                </div>

                <form onSubmit={handleSaveProduct} className="grid lg:grid-cols-2 gap-16">
                  <div className="space-y-10">
                    {/* Multi-Image Upload */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Visual Produk (Bisa Banyak)</label>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {editingProduct?.image_urls?.map((url, i) => (
                          <div key={i} className="relative aspect-square rounded-[2rem] overflow-hidden group border border-slate-100">
                            <img src={url} className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-[2rem] border-4 border-dashed border-slate-100 bg-[#f8fafc] flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-all group"
                        >
                          {uploading ? (
                            <Loader2 className="animate-spin text-blue-600" />
                          ) : (
                            <Upload className="text-slate-300 group-hover:text-blue-400" />
                          )}
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-400">Tambah Foto</span>
                        </button>
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" multiple />
                    </div>

                    <div className="grid gap-8">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Nama Model</label>
                        <input name="name" defaultValue={editingProduct?.name} required className="w-full bg-[#f8fafc] border border-slate-100 rounded-[1.5rem] px-8 py-5 outline-none font-bold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Brand</label>
                        <input name="brand" defaultValue={editingProduct?.brand} required className="w-full bg-[#f8fafc] border border-slate-100 rounded-[1.5rem] px-8 py-5 outline-none font-bold" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Harga Center (Rp)</label>
                        <input name="market_price" type="number" defaultValue={editingProduct?.market_price} required className="w-full bg-[#f8fafc] border border-slate-100 rounded-[1.5rem] px-8 py-5 outline-none font-black" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Harga Kami (Rp)</label>
                        <input name="our_price" type="number" defaultValue={editingProduct?.our_price} required className="w-full bg-[#f8fafc] border border-slate-100 rounded-[1.5rem] px-8 py-5 outline-none font-black text-blue-600" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Fitur (Pisahkan dengan koma)</label>
                      <textarea name="features" defaultValue={editingProduct?.features?.join(', ')} rows={3} className="w-full bg-[#f8fafc] border border-slate-100 rounded-[2rem] px-8 py-5 outline-none font-bold resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input name="shopee_url" placeholder="Link Shopee" defaultValue={editingProduct?.shopee_url} className="bg-[#f8fafc] border border-slate-100 rounded-xl py-4 px-6 text-[10px] font-bold" />
                      <input name="tokopedia_url" placeholder="Link Tokopedia" defaultValue={editingProduct?.tokopedia_url} className="bg-[#f8fafc] border border-slate-100 rounded-xl py-4 px-6 text-[10px] font-bold" />
                      <input name="blibli_url" placeholder="Link Blibli" defaultValue={editingProduct?.blibli_url} className="bg-[#f8fafc] border border-slate-100 rounded-xl py-4 px-6 text-[10px] font-bold" />
                      <input name="tiktok_shop_url" placeholder="Link TikTok Shop" defaultValue={editingProduct?.tiktok_shop_url} className="bg-[#f8fafc] border border-slate-100 rounded-xl py-4 px-6 text-[10px] font-bold" />
                    </div>

                    <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200">
                      Simpan Katalog
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
