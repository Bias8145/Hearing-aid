import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { 
  Plus, Settings, Package, LogOut, Trash2, Edit3, 
  Save, Globe, Phone, MapPin, Upload, X, Image as ImageIcon,
  ShoppingBag, Share2, Loader2, ChevronRight
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
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setEditingProduct(prev => ({
        ...prev,
        image_urls: [publicUrl]
      }));
      
      toast.success('Foto berhasil diunggah');
    } catch (error: any) {
      toast.error('Gagal upload: ' + error.message);
    } finally {
      setUploading(false);
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
      features: (formData.get('features') as string).split(',').map(f => f.trim()).filter(f => f),
    };

    let error;
    if (editingProduct?.id) {
      ({ error } = await supabase.from('products').update(productData).eq('id', editingProduct.id));
    } else {
      ({ error } = await supabase.from('products').insert([productData]));
    }

    if (!error) {
      toast.success('Katalog berhasil diperbarui');
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } else {
      toast.error('Gagal menyimpan produk');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Hapus produk ini secara permanen?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      toast.success('Produk dihapus');
      fetchProducts();
    }
  };

  const updateSetting = async (key: string, value: string) => {
    const { error } = await supabase.from('site_settings').update({ value }).eq('key', key);
    if (!error) {
      setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
      toast.success(`${key.replace('_', ' ')} diperbarui`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Control Panel</h1>
            <p className="text-slate-500 font-medium mt-1">Kelola HearPremium secara real-time</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white text-red-600 font-black text-xs uppercase tracking-widest px-6 py-3 rounded-2xl border border-red-100 hover:bg-red-50 transition-all shadow-sm"
          >
            <LogOut size={16} /> Keluar Sesi
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-10 bg-white p-1.5 rounded-[2rem] border border-slate-200 w-fit shadow-sm">
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-8 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Katalog Produk
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-8 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Pengaturan Web
          </button>
        </div>

        {activeTab === 'products' ? (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <Package className="text-blue-600" />
                Daftar Produk ({products.length})
              </h2>
              <button 
                onClick={() => {
                  setEditingProduct({});
                  setIsModalOpen(true);
                }}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
              >
                <Plus size={18} /> Tambah Katalog Baru
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {products.map(product => (
                  <motion.div 
                    layout
                    key={product.id} 
                    className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
                  >
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="relative w-24 h-24 rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                        <img src={product.image_urls[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {product.brand}
                          </span>
                        </div>
                        <h3 className="font-black text-xl text-slate-900">{product.name}</h3>
                        <p className="text-slate-400 text-sm font-bold">
                          Rp {product.our_price.toLocaleString()} 
                          <span className="mx-2 text-slate-200">|</span>
                          <span className="text-slate-300 line-through">Rp {product.market_price.toLocaleString()}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      <button 
                        onClick={() => {
                          setEditingProduct(product);
                          setIsModalOpen(true);
                        }}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-50 text-slate-600 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all"
                      >
                        <Edit3 size={16} /> Edit
                      </button>
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-50 text-red-600 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all"
                      >
                        <Trash2 size={16} /> Hapus
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact & Address */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <Phone className="text-blue-600" /> Kontak & Alamat
              </h3>
              <div className="space-y-6">
                {['whatsapp_number', 'address', 'email'].map(key => {
                  const setting = settings.find(s => s.key === key);
                  return (
                    <div key={key}>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                        {key.replace('_', ' ')}
                      </label>
                      <input 
                        type="text"
                        defaultValue={setting?.value}
                        onBlur={(e) => updateSetting(key, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-700"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Marketplace & Socials */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <Globe className="text-blue-600" /> Marketplace & Sosial Media
              </h3>
              <div className="space-y-6">
                {['shopee_url', 'tokopedia_url', 'blibli_url', 'tiktok_shop_url', 'instagram_url', 'facebook_url', 'tiktok_url'].map(key => {
                  const setting = settings.find(s => s.key === key);
                  return (
                    <div key={key}>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                        {key.replace('_', ' ')}
                      </label>
                      <input 
                        type="text"
                        defaultValue={setting?.value}
                        onBlur={(e) => updateSetting(key, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-700"
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
                className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl p-8 md:p-12"
              >
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-8 right-8 p-3 hover:bg-slate-50 rounded-2xl transition-all"
                >
                  <X />
                </button>

                <h2 className="text-3xl font-black text-slate-900 mb-10">
                  {editingProduct?.id ? 'Edit Katalog' : 'Tambah Katalog Baru'}
                </h2>

                <form onSubmit={handleSaveProduct} className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    {/* Image Upload */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Foto Produk</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="relative aspect-video rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group overflow-hidden"
                      >
                        {editingProduct?.image_urls?.[0] ? (
                          <>
                            <img src={editingProduct.image_urls[0]} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Upload className="text-white" />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="bg-white p-4 rounded-2xl shadow-sm">
                              {uploading ? <Loader2 className="animate-spin text-blue-600" /> : <Upload className="text-slate-400" />}
                            </div>
                            <p className="text-xs font-bold text-slate-400">Klik untuk unggah foto</p>
                          </>
                        )}
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        accept="image/*"
                      />
                    </div>

                    <div className="grid gap-6">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nama Produk</label>
                        <input name="name" defaultValue={editingProduct?.name} required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500/20 font-bold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Brand</label>
                        <input name="brand" defaultValue={editingProduct?.brand} required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500/20 font-bold" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Harga Pasar (Rp)</label>
                        <input name="market_price" type="number" defaultValue={editingProduct?.market_price} required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500/20 font-bold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Harga Kami (Rp)</label>
                        <input name="our_price" type="number" defaultValue={editingProduct?.our_price} required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500/20 font-bold" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Fitur Utama (Pisahkan dengan koma)</label>
                      <textarea name="features" defaultValue={editingProduct?.features?.join(', ')} rows={3} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500/20 font-bold resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input name="shopee_url" placeholder="Link Shopee" defaultValue={editingProduct?.shopee_url} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold" />
                      <input name="tokopedia_url" placeholder="Link Tokopedia" defaultValue={editingProduct?.tokopedia_url} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold" />
                      <input name="blibli_url" placeholder="Link Blibli" defaultValue={editingProduct?.blibli_url} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold" />
                      <input name="tiktok_shop_url" placeholder="Link TikTok Shop" defaultValue={editingProduct?.tiktok_shop_url} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold" />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
                    >
                      Simpan Perubahan Katalog
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
