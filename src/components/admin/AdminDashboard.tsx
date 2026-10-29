import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, Order, Coupon, ShippingStatus, ProductCategory } from '../../types';
import { EGYPTIAN_GOVERNORATES } from '../../data/governorates';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Tag,
  Settings,
  Database,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  AlertTriangle,
  LogOut,
  Search,
  Eye,
  TrendingUp,
  DollarSign,
  Truck,
  Lock,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    coupons,
    addCoupon,
    toggleCouponStatus,
    deleteCoupon,
    shippingRates,
    updateShippingRate,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'coupons' | 'shipping' | 'database'>('analytics');

  // Login Form
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Product Add / Edit Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state for product
  const [formNameAr, setFormNameAr] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('unisex');
  const [formPrice, setFormPrice] = useState(0);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | undefined>(undefined);
  const [formStock, setFormStock] = useState(0);
  const [formVolume, setFormVolume] = useState('100 مل / Extrait de Parfum');
  const [formScentFamily, setFormScentFamily] = useState('oud');
  const [formScentFamilyAr, setFormScentFamilyAr] = useState('عود شرقي فاخر');
  const [formTopNotes, setFormTopNotes] = useState('');
  const [formHeartNotes, setFormHeartNotes] = useState('');
  const [formBaseNotes, setFormBaseNotes] = useState('');

  // Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponVal, setNewCouponVal] = useState(0);
  const [newCouponMin, setNewCouponMin] = useState(0);
  const [newCouponMaxUses, setNewCouponMaxUses] = useState('');
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Orders Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Product Search
  const [productSearch, setProductSearch] = useState('');

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#111111] border border-[#C5A059]/40 rounded-2xl p-6 sm:p-8 text-right space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-[#181611] border border-[#C5A059]/50 flex items-center justify-center mx-auto text-[#C5A059]">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-serif font-bold text-[#FBF9F5]">
              لوحة تحكم دار حُرّ الإدارية
            </h2>
            <p className="text-xs text-[#8A8275]">
              الوصول مقصور على إدارة المتجر لمتابعة المخزون والطلبات في مصر
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void loginAdmin(adminEmail, adminPassword);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-[#EDE8DC] mb-1">
                بيانات دخول المدير
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="البريد الإلكتروني للمدير"
                className="w-full p-2.5 bg-[#181818] border border-[#333] focus:border-[#C5A059] rounded-lg text-sm text-[#EDE8DC] focus:outline-none"
              />
              <input type="password" required value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="كلمة المرور" className="mt-2 w-full p-2.5 bg-[#181818] border border-[#333] focus:border-[#C5A059] rounded-lg text-sm text-[#EDE8DC] focus:outline-none" />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0A0A0A] font-bold text-sm rounded-lg transition-colors"
            >
              تسجيل الدخول للإدارة
            </button>

            <p className="text-[11px] text-[#777] text-center">يُنشأ حساب المدير من لوحة إدارة قاعدة البيانات ويُمنح صلاحية المدير.</p>
          </form>
        </div>
      </div>
    );
  }

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalDelivered = orders.filter((o) => o.shippingStatus === 'delivered').length;
  const lowStockItems = products.filter((p) => p.stock <= 5);

  const openNewProductModal = () => {
    setEditingProduct(null);
    setFormNameAr('');
    setFormTagline('');
    setFormDescription('');
    setFormImageUrl('');
    setFormCategory('unisex');
    setFormPrice(0);
    setFormOriginalPrice(undefined);
    setFormStock(0);
    setFormVolume('100 مل / Extrait de Parfum');
    setFormScentFamily('oud');
    setFormScentFamilyAr('عود شرقي فاخر');
    setFormTopNotes('');
    setFormHeartNotes('');
    setFormBaseNotes('');
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormNameAr(prod.nameAr);
    setFormTagline(prod.tagline);
    setFormDescription(prod.description);
    setFormImageUrl(prod.images?.[0] || '');
    setFormCategory(prod.category);
    setFormPrice(prod.price);
    setFormOriginalPrice(prod.originalPrice);
    setFormStock(prod.stock);
    setFormVolume(prod.volume);
    setFormScentFamily(prod.scentFamily);
    setFormScentFamilyAr(prod.scentFamilyAr);
    setFormTopNotes(prod.notes.top.join('، '));
    setFormHeartNotes(prod.notes.heart.join('، '));
    setFormBaseNotes(prod.notes.base.join('، '));
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Number.isFinite(Number(formPrice)) || Number(formPrice) <= 0) {
      showToast('أدخل سعرًا حقيقيًا أكبر من صفر قبل حفظ المنتج.', 'error');
      return;
    }
    if (formImageUrl.trim()) {
      try { const imageUrl = new URL(formImageUrl.trim()); if (!['http:', 'https:'].includes(imageUrl.protocol)) throw new Error(); }
      catch { showToast('رابط صورة المنتج غير صالح. استخدم رابطًا يبدأ بـ https:// أو http://', 'error'); return; }
    }
    const topArray = formTopNotes.split('،').map((s) => s.trim()).filter(Boolean);
    const heartArray = formHeartNotes.split('،').map((s) => s.trim()).filter(Boolean);
    const baseArray = formBaseNotes.split('،').map((s) => s.trim()).filter(Boolean);

    let saved = false;
    if (editingProduct) {
      saved = await updateProduct({
        ...editingProduct,
        name: formNameAr,
        nameAr: formNameAr,
        tagline: formTagline,
        description: formDescription,
        images: formImageUrl.trim() ? [formImageUrl.trim(), ...(editingProduct.images || []).slice(1)] : [],
        category: formCategory,
        price: Number(formPrice),
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
        discountPercentage: formOriginalPrice && formOriginalPrice > formPrice
          ? Math.round(((formOriginalPrice - formPrice) / formOriginalPrice) * 100)
          : undefined,
        stock: Number(formStock),
        volume: formVolume,
        scentFamily: formScentFamily as any,
        scentFamilyAr: formScentFamilyAr,
        notes: {
          top: topArray,
          heart: heartArray,
          base: baseArray,
        },
        status: Number(formStock) <= 0 ? 'out_of_stock' : 'active',
      });
    } else {
      saved = await addProduct({
        name: formNameAr,
        nameAr: formNameAr,
        slug: formNameAr.toLowerCase().replace(/\s+/g, '-'),
        tagline: formTagline,
        description: formDescription,
        story: formDescription,
        category: formCategory,
        price: Number(formPrice),
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
        discountPercentage: formOriginalPrice && formOriginalPrice > formPrice
          ? Math.round(((formOriginalPrice - formPrice) / formOriginalPrice) * 100)
          : undefined,
        stock: Number(formStock),
        images: formImageUrl.trim() ? [formImageUrl.trim()] : [],
        bottleStyle: 'obsidian',
        rating: 0,
        reviewsCount: 0,
        volume: formVolume,
        concentration: 'Extrait de Parfum',
        longevity: 'تُحدد بعد اعتماد المواصفات',
        sillage: 'تُحدد بعد اعتماد المواصفات',
        notes: {
          top: topArray,
          heart: heartArray,
          base: baseArray,
        },
        scentFamily: formScentFamily as any,
        scentFamilyAr: formScentFamilyAr,
        occasion: 'تُحدد حسب المنتج',
        season: 'غير محدد',
        status: Number(formStock) <= 0 ? 'out_of_stock' : 'active',
      });
    }

    if (saved) setIsProductModalOpen(false);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim() || !Number.isFinite(newCouponVal) || newCouponVal <= 0 || !Number.isFinite(newCouponMin) || newCouponMin < 0) {
      showToast('أدخل كودًا صحيحًا وقيمة خصم موجبة وحدًا أدنى صالحًا.', 'error');
      return;
    }
    if (newCouponType === 'percentage' && newCouponVal > 100) { showToast('لا يمكن أن تتجاوز نسبة الخصم 100%.', 'error'); return; }
    if (newCouponMaxUses.trim() && (!Number.isInteger(Number(newCouponMaxUses)) || Number(newCouponMaxUses) < 1)) { showToast('حد الاستخدام يجب أن يكون رقمًا صحيحًا يبدأ من 1.', 'error'); return; }

    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      value: Number(newCouponVal),
      minOrderAmount: Number(newCouponMin),
      isActive: true,
      usageCount: 0,
      maxUses: newCouponMaxUses.trim() ? Number(newCouponMaxUses) : null,
      description: newCouponDesc.trim() || `خصم ${newCouponVal}${newCouponType === 'percentage' ? '%' : ' ج.م'} على الطلبات الأصيلة`,
    });

    setNewCouponCode('');
    setNewCouponDesc('');
    setNewCouponMaxUses('');
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'all' || o.shippingStatus === orderStatusFilter;
    const matchesSearch =
      !orderSearch ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch);
    return matchesStatus && matchesSearch;
  });

  // Filtered products
  const filteredProducts = products.filter((p) => {
    return (
      !productSearch ||
      p.nameAr.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.tagline.toLowerCase().includes(productSearch.toLowerCase())
    );
  });

  return (
    <div className="admin-dashboard w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 text-right space-y-5 sm:space-y-8">
      {/* Admin Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#222] pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#FBF9F5]">
              لوحة الإدارة والمخزون الأصيل · دار حُرّ
            </h1>
            <span className="text-xs text-[#8A8275]">
              إدارة منتجات العطور، الطلبات، أكواد الخصم، وتعيين أسعار الشحن لمصر
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={logoutAdmin}
            className="p-2 text-[#777] hover:text-red-400 bg-[#181818] border border-[#333] rounded-lg transition-colors"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#111111] border border-[#222] rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8A8275]">
            <span>إجمالي المبيعات</span>
            <DollarSign className="w-4 h-4 text-[#C5A059]" />
          </div>
          <span className="text-xl font-bold font-sans text-[#EDE8DC] tabular-nums block">
            {totalRevenue.toLocaleString('ar-EG')} ج.م
          </span>
          <span className="text-[10px] text-[#888] block">إجمالي قيمة الطلبات المسجلة</span>
        </div>

        <div className="p-4 bg-[#111111] border border-[#222] rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8A8275]">
            <span>إجمالي الطلبات</span>
            <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
          </div>
          <span className="text-xl font-bold font-sans text-[#EDE8DC] tabular-nums block">
            {orders.length} طلب
          </span>
          <span className="text-[10px] text-[#888] block">{totalDelivered} تم تسليمه بنجاح</span>
        </div>

        <div className="p-4 bg-[#111111] border border-[#222] rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8A8275]">
            <span>العطور النشطة</span>
            <Package className="w-4 h-4 text-[#C5A059]" />
          </div>
          <span className="text-xl font-bold font-sans text-[#EDE8DC] tabular-nums block">
            {products.length} تركيبة
          </span>
          <span className="text-[10px] text-[#C5A059] block">دهن عود وعنبر ومسك</span>
        </div>

        <div className="p-4 bg-[#111111] border border-[#222] rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8A8275]">
            <span>تنبيهات انخفاض المخزون</span>
            <AlertTriangle className={`w-4 h-4 ${lowStockItems.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`} />
          </div>
          <span className="text-xl font-bold font-sans text-[#EDE8DC] tabular-nums block">
            {lowStockItems.length} عطور
          </span>
          <span className={`text-[10px] block ${lowStockItems.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {lowStockItems.length > 0 ? 'أقل من 5 قطع بالمخزن' : 'المخزون متوفر بالكامل'}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#222] pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'analytics', label: 'الرؤى والتحليلات', icon: TrendingUp },
          { id: 'products', label: `إدارة المنتجات (${products.length})`, icon: Package },
          { id: 'orders', label: `إدارة الطلبات (${orders.length})`, icon: ShoppingBag },
          { id: 'coupons', label: `كوبونات الخصم (${coupons.length})`, icon: Tag },
          { id: 'shipping', label: 'الشحن والمحتوى', icon: Truck },
          { id: 'database', label: 'إعدادات المتجر', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-[#C5A059] text-[#0A0A0A] shadow-md'
                  : 'bg-[#141414] text-[#A69F90] hover:text-[#EDE8DC] hover:bg-[#1A1A1A]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Analytics Overview */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#111111] border border-[#222] rounded-2xl space-y-4">
            <h3 className="text-base font-serif font-bold text-[#EDE8DC]">
              أداء مبيعات دار حُرّ في المحافظات المصرية
            </h3>

            <div className="rounded-xl border border-[#262626] bg-[#141414] p-5 text-sm leading-7 text-[#A69F90]">
              تظهر تحليلات المنتجات والمحافظات بعد تسجيل طلبات حقيقية عبر المتجر. لا توجد بيانات مبيعات تجريبية في لوحة الإدارة.
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Products Manager */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#C5A059] absolute right-3 top-3" />
              <input
                type="text"
                placeholder="ابحث باسم العطر..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pr-9 pl-3 py-2 bg-[#141414] border border-[#333] rounded-lg text-xs text-[#EDE8DC] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <button
              onClick={openNewProductModal}
              className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0A0A0A] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة عطر شرقي جديد</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-[#111111] border border-[#222] rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-[#181818] border-b border-[#222] text-[#8A8275]">
                  <tr>
                    <th className="py-3 px-4">العطر</th>
                    <th className="py-3 px-4">الفئة العطرية</th>
                    <th className="py-3 px-4">السعر</th>
                    <th className="py-3 px-4">المخزون الحالي</th>
                    <th className="py-3 px-4">الحالة</th>
                    <th className="py-3 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C1C1C]">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#141414] transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-serif font-bold text-sm text-[#EDE8DC] block">
                          {prod.nameAr}
                        </span>
                        <span className="text-[11px] text-[#777] block">{prod.volume}</span>
                      </td>
                      <td className="py-3 px-4 text-[#A69F90]">{prod.scentFamilyAr}</td>
                      <td className="py-3 px-4 font-sans font-bold text-[#EDE8DC] tabular-nums">
                        {prod.price.toLocaleString('ar-EG')} ج.م
                        {prod.originalPrice && (
                          <span className="text-[10px] text-[#666] line-through block">
                            {prod.originalPrice.toLocaleString('ar-EG')} ج.م
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-sans font-bold tabular-nums ${
                            prod.stock <= 5 ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          {prod.stock} قطع
                        </span>
                        {prod.stock <= 5 && prod.stock > 0 && (
                          <span className="text-[10px] text-amber-500 block">منخفض!</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            prod.stock > 0
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {prod.stock > 0 ? 'نشط في المتجر' : 'نفد المخزون'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditProductModal(prod)}
                            className="p-1.5 text-[#C5A059] hover:bg-[#222] rounded"
                            title="تعديل العطر"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف عطر "${prod.nameAr}"؟`)) {
                                deleteProduct(prod.id);
                              }
                            }}
                            className="p-1.5 text-red-400 hover:bg-[#222] rounded"
                            title="حذف العطر"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Orders Manager */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Orders Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#C5A059] absolute right-3 top-3" />
              <input
                type="text"
                placeholder="بحث برقم الطلب، الاسم، أو الهاتف..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pr-9 pl-3 py-2 bg-[#141414] border border-[#333] rounded-lg text-xs text-[#EDE8DC] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'new', label: 'جديد' },
                { id: 'processing', label: 'قيد التجهيز' },
                { id: 'shipped', label: 'خرج للشحن' },
                { id: 'delivered', label: 'تم التسليم' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setOrderStatusFilter(st.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    orderStatusFilter === st.id
                      ? 'bg-[#C5A059] text-[#0A0A0A]'
                      : 'bg-[#181818] text-[#888] hover:text-[#EDE8DC]'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Cards / Table */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 bg-[#111111] border border-[#222] hover:border-[#C5A059]/40 rounded-xl space-y-4 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C1C1C] pb-3">
                  <div>
                    <span className="text-xs font-bold font-sans text-[#E5C378] ml-2">
                      {order.id}
                    </span>
                    <span className="text-xs text-[#888]">
                      تاريخ: {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#888]">حالة الشحن:</span>
                    <select
                      value={order.shippingStatus}
                      onChange={(e) => void updateOrderStatus(order.id, e.target.value as ShippingStatus).catch((error: Error) => showToast(error.message || 'تعذر تحديث حالة الطلب', 'error'))}
                      className="p-1.5 bg-[#181818] border border-[#333] focus:border-[#C5A059] rounded text-xs text-[#EDE8DC] focus:outline-none"
                    >
                      <option value="new">طلب جديد</option>
                      <option value="processing">قيد التجهيز بالمعمل</option>
                      <option value="shipped">خرج مع مندوب التوصيل</option>
                      <option value="delivered">تم التسليم بنجاح</option>
                      <option value="cancelled">ملغي</option>
                    </select>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#8A8275]">
                  <div>
                    <span className="text-[#C5A059] font-semibold block">المستلم:</span>
                    <p className="text-[#EDE8DC] font-bold">{order.customerName}</p>
                    <p>هاتف: {order.customerPhone}</p>
                  </div>
                  <div>
                    <span className="text-[#C5A059] font-semibold block">العنوان:</span>
                    <p className="text-[#EDE8DC]">{order.governorate} — {order.city}</p>
                    <p className="text-[11px] truncate">{order.detailedAddress}</p>
                  </div>
                  <div>
                    <span className="text-[#C5A059] font-semibold block">الدفع والإجمالي:</span>
                    <p className="text-[#EDE8DC] font-bold font-sans tabular-nums">
                      {order.totalAmount.toLocaleString('ar-EG')} ج.م
                    </p>
                    <p className="text-[11px]">
                      {order.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : order.paymentMethod}
                    </p>
                  </div>
                </div>

                {/* Items in order */}
                <div className="bg-[#141414] p-3 rounded-lg space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#888]">المنتجات المطلوبة</span>
                    <span className="text-[#E5C378] font-bold">{order.items.length} صنف</span>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={`${order.id}-${item.productId}-${index}`} className="flex items-center gap-3 rounded-lg border border-[#252525] bg-[#101010] p-2">
                        {(item.productImage || products.find((product) => product.id === item.productId)?.images?.[0]) ? <img src={item.productImage || products.find((product) => product.id === item.productId)?.images?.[0] || ''} alt={item.productName} referrerPolicy="no-referrer" className="h-14 w-14 rounded-md bg-[#222] object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} /> : <div className="h-14 w-14 rounded-md bg-[#222] flex items-center justify-center text-[#777]"><Package className="h-5 w-5" /></div>}
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[#EDE8DC]">{item.productName}</p>
                          <p className="mt-1 text-[#8A8275]">الكمية: {item.quantity}{item.selectedSize ? ` · الحجم: ${item.selectedSize}` : ''}</p>
                        </div>
                        <p className="shrink-0 font-bold text-[#E5C378]">{Number(item.totalPrice || item.unitPrice * item.quantity).toLocaleString('ar-EG')} ج.م</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Coupons Manager */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          {/* Add Coupon Form */}
          <form
            onSubmit={handleCreateCoupon}
            className="p-5 bg-[#111111] border border-[#222] rounded-xl space-y-4"
          >
            <h3 className="text-sm font-semibold text-[#E5C378]">إنشاء كود خصم ترويجي جديد</h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs text-[#8A8275] mb-1">كود الخصم (Code)</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: HURR20"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="w-full p-2 bg-[#181818] border border-[#333] rounded text-xs text-[#EDE8DC] uppercase font-bold"
                />
              </div>

              <div>
                <label className="block text-xs text-[#8A8275] mb-1">نوع الخصم</label>
                <select
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value as any)}
                  className="w-full p-2 bg-[#181818] border border-[#333] rounded text-xs text-[#EDE8DC]"
                >
                  <option value="percentage">نسبة مئوية (%)</option>
                  <option value="fixed">مبلغ ثابت (ج.م)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#8A8275] mb-1">قيمة الخصم</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={newCouponVal}
                  onChange={(e) => setNewCouponVal(Number(e.target.value))}
                  className="w-full p-2 bg-[#181818] border border-[#333] rounded text-xs text-[#EDE8DC]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#8A8275] mb-1">الحد الأدنى للطلب (ج.م)</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(Number(e.target.value))}
                  className="w-full p-2 bg-[#181818] border border-[#333] rounded text-xs text-[#EDE8DC]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#8A8275] mb-1">حد الاستخدام (فارغ = بلا حد)</label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={newCouponMaxUses}
                  onChange={(e) => setNewCouponMaxUses(e.target.value)}
                  placeholder="مثال: 1"
                  className="w-full p-2 bg-[#181818] border border-[#333] rounded text-xs text-[#EDE8DC]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0A0A0A] font-bold text-xs rounded-lg transition-colors"
            >
              حفظ كود الخصم
            </button>
          </form>

          {/* Coupons List */}
          <div className="bg-[#111111] border border-[#222] rounded-xl overflow-hidden">
            <table className="w-full text-xs text-right">
              <thead className="bg-[#181818] border-b border-[#222] text-[#8A8275]">
                <tr>
                  <th className="py-3 px-4">كود الكوبون</th>
                  <th className="py-3 px-4">نوع وقيمة الخصم</th>
                  <th className="py-3 px-4">الحد الأدنى للطلب</th>
                  <th className="py-3 px-4">مرات الاستخدام</th>
                  <th className="py-3 px-4">حد الاستخدام</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C1C]">
                {coupons.map((c) => (
                  <tr key={c.code} className="hover:bg-[#141414]">
                    <td className="py-3 px-4 font-bold text-sm text-[#E5C378] font-mono">
                      {c.code}
                    </td>
                    <td className="py-3 px-4 text-[#EDE8DC]">
                      {c.value} {c.discountType === 'percentage' ? '%' : 'ج.م'}
                    </td>
                    <td className="py-3 px-4 text-[#888] tabular-nums">
                      {c.minOrderAmount.toLocaleString('ar-EG')} ج.م
                    </td>
                    <td className="py-3 px-4 text-[#EDE8DC] tabular-nums">{c.usageCount} مرة</td>
                    <td className="py-3 px-4 text-[#EDE8DC] tabular-nums">{c.maxUses == null ? 'بلا حد' : `${c.maxUses} مرة`}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleCouponStatus(c.code)}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                          c.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {c.isActive ? 'مفعل' : 'معطل'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteCoupon(c.code)}
                        className="p-1 text-red-400 hover:bg-[#222] rounded"
                        title="حذف الكود"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Shipping Rates & Store Content */}
      {activeTab === 'shipping' && (
        <div className="space-y-6">
          <div className="p-5 bg-[#111111] border border-[#222] rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-[#E5C378]">
              أسعار الشحن المعتمدة للمحافظات المصرية (27 محافظة)
            </h3>
            <p className="text-xs text-[#8A8275]">
              راجع رسوم التوصيل وحد الشحن المجاني واعتمد القيم التجارية الصحيحة قبل إطلاق الطلبات.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {EGYPTIAN_GOVERNORATES.map((gov) => (
                <div key={gov.id} className="p-3 bg-[#161616] border border-[#262626] rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#EDE8DC] block">{gov.nameAr}</span>
                    <span className="text-[10px] text-[#777]">{gov.estimatedDelivery}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input aria-label={`سعر شحن ${gov.nameAr}`} type="number" min={0} step="1" defaultValue={shippingRates.find((rate) => rate.id === gov.id)?.fee ?? gov.fee}
                      key={`${gov.id}-${shippingRates.find((rate) => rate.id === gov.id)?.fee ?? gov.fee}`}
                      onBlur={(e) => {
                        const fee = Number(e.currentTarget.value);
                        const current = shippingRates.find((rate) => rate.id === gov.id) || gov;
                        if (Number.isFinite(fee) && fee >= 0 && fee !== current.fee) void updateShippingRate(current, fee);
                      }}
                      className="w-20 rounded border border-[#333] bg-[#0A0A0A] px-2 py-1 text-left font-sans font-bold text-[#C5A059] tabular-nums" />
                    <span className="text-[#8A8275]">ج.م</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Store configuration */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="p-4 sm:p-6 bg-[#111111] border border-[#C5A059]/30 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#222] pb-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#C5A059]" />
                <h3 className="text-base font-serif font-bold text-[#EDE8DC]">إعدادات الاتصال والبيانات</h3>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold">
                اتصال البيانات عبر إعدادات البيئة
              </span>
            </div>

            <p className="text-xs text-[#B0A99B] leading-relaxed">
              تم تجهيز المتجر بمخطط قاعدة بيانات PostgreSQL متكامل مع سياسات الأمان على مستوى الصفوف (Row Level Security)، وتحديث المخزون الذري لمنع بيع كميات غير متوفرة (Atomic Inventory Updates)، وجداول مخصصة للعملاء والطلبات والكوبونات والشحن.
            </p>

            {/* إعدادات الاتصال */}
            <div className="p-4 bg-[#141414] border border-[#222] rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-[#E5C378]">متغيرات البيئة للربط المباشر:</h4>
              <div className="bg-[#0A0A0A] p-3 rounded font-mono text-xs text-[#C5A059] space-y-1 overflow-x-auto">
                <p>رابط قاعدة البيانات</p>
                <p>مفتاح الاتصال العام</p>
              </div>
              <p className="text-[11px] text-[#777]">
                تُضبط إعدادات الاتصال الآمنة من إعدادات استضافة الموقع قبل استقبال طلبات حقيقية.
              </p>
            </div>

            <div className="rounded-xl border border-[#333] bg-[#141414] p-4 text-sm leading-7 text-[#B0A99B]">
              تُدار بنية البيانات وصلاحياتها من لوحة إدارة قاعدة البيانات. لا يتم تنزيل ملفات قاعدة البيانات من واجهة المتجر.
            </div>
          </div>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsProductModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#111111] border border-[#C5A059]/40 rounded-2xl p-4 sm:p-8 text-right shadow-2xl my-auto space-y-4 max-h-[90dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-serif font-bold text-[#FBF9F5] border-b border-[#222] pb-3">
              {editingProduct ? 'تعديل بيانات العطر الأصيل' : 'إضافة عطر شرقي جديد إلى المتجر'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#8A8275] mb-1">اسم العطر بالعربية *</label>
                  <input
                    type="text"
                    required
                    value={formNameAr}
                    onChange={(e) => setFormNameAr(e.target.value)}
                    placeholder="مثال: عود كشميري معتق"
                    className="w-full p-2 bg-[#181818] border border-[#333] rounded text-xs text-[#EDE8DC]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#8A8275] mb-1">التصنيف</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full p-2 bg-[#181818] border border-[#333] rounded text-xs text-[#EDE8DC]"
                  >
                    <option value="unisex">عطور للجنسين (Unisex)</option>
                    <option value="men">عطور رجالية (Men)</option>
                    <option value="women">عطور نسائية (Women)</option>
                    <option value="private_collection">النيش الخاص (Private Collection)</option>
                    <option value="offers">عروض حصرية (Offers)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#8A8275] mb-1">وصف موجز (Tagline) *</label>
                <input
                  type="text"
                  required
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  placeholder="مثال: دهن عود كمبودي معتق مع نفحات العنبر"
                  className="w-full p-2 bg-[#181818] border border-[#333] rounded text-xs text-[#EDE8DC]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#8A8275] mb-1">الوصف الكامل للعطر *</label>
                <textarea
                  rows={2}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="وصف مشاعر العطر ونغماته وتأثيره..."
                  className="w-full p-2 bg-[#181818] border border-[#333] rounded text-xs text-[#EDE8DC]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#8A8275] mb-1">رابط صورة المنتج</label>
                <input
                  type="url"
                  dir="ltr"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://example.com/perfume.jpg"
                  className="w-full p-2 bg-[#181818] border border-[#333] rounded text-xs text-[#EDE8DC] text-left"
                />
                {formImageUrl.trim() && (
                  <div className="mt-2 flex items-center gap-3 rounded-lg border border-[#333] p-2">
                    <img src={formImageUrl} alt="معاينة صورة المنتج" className="h-16 w-16 rounded object-cover bg-[#222]" onError={(e) => { e.currentTarget.style.opacity = '0.25'; }} />
                    <span className="text-[11px] text-[#A69F90]">معاينة الصورة من الرابط المدخل</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-[#8A8275] mb-1">السعر (ج.م) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full p-2 bg-[#181818] border border-[#333] rounded text-xs text-[#EDE8DC]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#8A8275] mb-1">السعر الأصلي قبل الخصم</label>
                  <input
                    type="number"
                    value={formOriginalPrice || ''}
                    onChange={(e) => setFormOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full p-2 bg-[#181818] border border-[#333] rounded text-xs text-[#EDE8DC]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#8A8275] mb-1">الكمية المتوفرة بالمخزن *</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full p-2 bg-[#181818] border border-[#333] rounded text-xs text-[#EDE8DC]"
                  />
                </div>
              </div>

              {/* Scent Pyramid Notes */}
              <div className="space-y-2 border-t border-[#222] pt-3">
                <span className="text-xs font-semibold text-[#E5C378] block">الهرم العطري (نوتات مفصولة بفاصلة):</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-[#777] mb-0.5">الافتتاحية (Top)</label>
                    <input
                      type="text"
                      value={formTopNotes}
                      onChange={(e) => setFormTopNotes(e.target.value)}
                      className="w-full p-1.5 bg-[#181818] border border-[#333] rounded text-xs text-[#EDE8DC]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#777] mb-0.5">القلب (Heart)</label>
                    <input
                      type="text"
                      value={formHeartNotes}
                      onChange={(e) => setFormHeartNotes(e.target.value)}
                      className="w-full p-1.5 bg-[#181818] border border-[#333] rounded text-xs text-[#EDE8DC]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#777] mb-0.5">القاعدة (Base)</label>
                    <input
                      type="text"
                      value={formBaseNotes}
                      onChange={(e) => setFormBaseNotes(e.target.value)}
                      className="w-full p-1.5 bg-[#181818] border border-[#333] rounded text-xs text-[#EDE8DC]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-[#222] text-[#AAA] hover:text-[#FFF] rounded-lg text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0A0A0A] font-bold text-xs rounded-lg transition-colors"
                >
                  حفظ العطر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
