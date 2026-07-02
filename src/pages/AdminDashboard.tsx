import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { 
  Plus, Settings, Package, LogOut, Trash2, Edit3, 
  Globe, Phone, MapPin, Upload, X, Loader2, 
  ShoppingBag, Instagram, Facebook, Music2, Eye
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
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">COMMAND <span className="text-blue-600">CENTER</span></h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] mt-2">HearPremium Pro Dashboard</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => navigate('/')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-slate-600 font-black text-[10px] uppercase tracking-widest px-6 py-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Eye size={16} /> Web
            </button>
            <button 
              onClick={handleLogout}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-red-600 font-black text-[10px] uppercase tracking-widest px-6 py-4 rounded-2xl border border-red-50 hover:bg-red-50 transition-all shadow-sm"
            >
              <LogOut size={16} /> Keluar
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-10 bg-white p-1.5 rounded-[2rem] border border-slate-100 w-fit shadow-sm">
          {[
            { id: 'products', label: 'Produk', icon: <Package size={14} /> },
            { id: 'settings', label: 'Settings', icon: <Settings size={14} /> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'products' ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <Package className="text-blue-600" size={18} />
                Katalog ({products.length})
              </h2>
              <button 
                onClick={() => {
                  setEditingProduct({ features: [], image_urls: [] });
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                <Plus size={18} /> Tambah Produk
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
              ) : products.map(product => (
                <motion.div 
                  layout
                  key={product.id} 
                  className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 group hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                      <img src={product.image_urls[0] || 'https://placehold.co/400x400?text=No+Image'} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center sm:text-left">
                      <span className="text-[8px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-2 inline-block">
                        {product.brand}
                      </span>
                      <h3 className="font-black text-xl text-slate-900 tracking-tight mb-1">{product.name}</h3>
                      <div className="flex items-center gap-3 justify-center sm:justify-start">
                        <p className="text-slate-300 line-through text-[10px] font-bold">Rp {product.market_price.toLocaleString('id-ID')}</p>
                        <p className="text-blue-600 text-base font-black tracking-tight">Rp {product.our_price.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <button 
                      onClick={() => {
                        setEditingProduct(product);
                        setIsModalOpen(true);
                      }}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-50 text-slate-900 px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button 
                      onClick={async () => {
                        if (confirm('Hapus produk?')) {
                          await supabase.from('products').delete().eq('id', product.id);
                          fetchProducts();
                        }
                      }}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-50 text-red-600 px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                    >
                      <Trash2 size={14} /> Hapus
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Settings */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <Phone className="text-blue-600" size={18} />
                Kontak & Lokasi
              </h3>
              <div className="space-y-6">
                {[
                  { key: 'whatsapp_number', label: 'WhatsApp (62...)', icon: <Phone size={12} /> },
                  { key: 'email', label: 'Email Bisnis', icon: <Globe size={12} /> },
                  { key: 'address', label: 'Alamat Lengkap', icon: <MapPin size={12} />, type: 'textarea' }
                ].map(field => {
                  const setting = settings.find(s => s.key === field.key);
                  return (
                    <div key={field.key}>
                      <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        {field.icon} {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea 
                          defaultValue={setting?.value}
                          onBlur={(e) => updateSetting(field.key, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-700 resize-none"
                          rows={3}
                        />
                      ) : (
                        <input 
                          type="text"
                          defaultValue={setting?.value}
                          onBlur={(e) => updateSetting(field.key, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-700"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social & Marketplace */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <Globe className="text-blue-600" size={18} />
                Ekosistem Digital
              </h3>
              <div className="space-y-6">
                {[
                  { key: 'shopee_url', label: 'Shopee', color: 'text-orange-500', icon: <ShoppingBag size={12} /> },
                  { key: 'tokopedia_url', label: 'Tokopedia', color: 'text-green-500', icon: <ShoppingBag size={12} /> },
                  { key: 'blibli_url', label: 'Blibli', color: 'text-blue-500', icon: <ShoppingBag size={12} /> },
                  { key: 'tiktok_shop_url', label: 'TikTok Shop', color: 'text-black', icon: <ShoppingBag size={12} /> },
                  { key: 'instagram_url', label: 'Instagram', color: 'text-pink-500', icon: <Instagram size={12} /> },
                  { key: 'facebook_url', label: 'Facebook', color: 'text-blue-700', icon: <Facebook size={12} /> },
                  { key: 'tiktok_url', label: 'TikTok Profile', color: 'text-slate-900', icon: <Music2 size={12} /> }
                ].map(field => {
                  const setting = settings.find(s => s.key === field.key);
                  return (
                    <div key={field.key}>
                      <label className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest mb-3 ${field.color}`}>
                        {field.icon} {field.label}
                      </label>
                      <input 
                        type="text"
                        defaultValue={setting?.value}
                        onBlur={(e) => updateSetting(field.key, e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-700"
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
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl p-8 md:p-12"
              >
                <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-slate-50 rounded-xl transition-all">
                  <X size={20} />
                </button>

                <div className="mb-10">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    {editingProduct?.id ? 'EDIT KATALOG' : 'TAMBAH KATALOG'}
                  </h2>
                </div>

                <form onSubmit={handleSaveProduct} className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Visual Produk</label>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {editingProduct?.image_urls?.map((url, i) => (
                          <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-100">
                            <img src={url} className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-all group"
                        >
                          {uploading ? <Loader2 className="animate-spin text-blue-600" /> : <Upload className="text-slate-300 group-hover:text-blue-400" />}
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-400">Upload</span>
                        </button>
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" multiple />
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Nama Model</label>
                        <input name="name" defaultValue={editingProduct?.name} required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 outline-none font-bold" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Brand</label>
                        <input name="brand" defaultValue={editingProduct?.brand} required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 outline-none font-bold" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Market Price</label>
                        <input name="market_price" type="number" defaultValue={editingProduct?.market_price} required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 outline-none font-black" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Our Price</label>
                        <input name="our_price" type="number" defaultValue={editingProduct?.our_price} required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 outline-none font-black text-blue-600" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Fitur (Pisahkan dengan koma)</label>
                      <textarea name="features" defaultValue={editingProduct?.features?.join(', ')} rows={3} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 outline-none font-bold resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input name="shopee_url" placeholder="Shopee Link" defaultValue={editingProduct?.shopee_url} className="bg-slate-50 border border-slate-100 rounded-lg py-3 px-4 text-[9px] font-bold" />
                      <input name="tokopedia_url" placeholder="Tokopedia Link" defaultValue={editingProduct?.tokopedia_url} className="bg-slate-50 border border-slate-100 rounded-lg py-3 px-4 text-[9px] font-bold" />
                    </div>

                    <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg">
                      SIMPAN KATALOG
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
