import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product, CartItem, Order, Coupon, GovernorateShipping, ProductCategory, ShippingStatus, PaymentStatus,
} from '../types';
import { EGYPTIAN_GOVERNORATES, FREE_SHIPPING_THRESHOLD } from '../data/governorates';
import { supabase, fromDbProduct, toDbProduct, fromDbCoupon } from '../lib/supabase';

export interface ToastMessage { id: string; message: string; type: 'success' | 'info' | 'warning' | 'error'; }
type NewOrder = Omit<Order, 'id' | 'createdAt' | 'trackingHistory'>;
interface StoreContextType {
  products: Product[]; activeCategory: ProductCategory | 'all'; setActiveCategory: (cat: ProductCategory | 'all') => void;
  searchQuery: string; setSearchQuery: (q: string) => void; selectedFamily: string; setSelectedFamily: (fam: string) => void;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'rating'; setSortBy: (sort: 'featured' | 'price_asc' | 'price_desc' | 'rating') => void;
  cart: CartItem[]; isCartOpen: boolean; setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, selectedSize?: string) => void; removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void; clearCart: () => void; cartCount: number;
  wishlist: string[]; toggleWishlist: (productId: string) => void; isInWishlist: (productId: string) => boolean;
  selectedGovernorate: GovernorateShipping; shippingRates: GovernorateShipping[]; setSelectedGovernorateById: (id: string) => void;
  activeCoupon: Coupon | null; applyCoupon: (code: string) => { success: boolean; message: string }; removeCoupon: () => void;
  subtotal: number; discountAmount: number; shippingFee: number; totalAmount: number; isFreeShipping: boolean; freeShippingProgress: number;
  orders: Order[]; placeOrder: (orderData: NewOrder) => Promise<Order>;
  updateOrderStatus: (orderId: string, shippingStatus: ShippingStatus, paymentStatus?: PaymentStatus) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined; getOrdersByPhone: (phone: string) => Order[]; trackOrder: (id: string, token: string) => Promise<Order | null>;
  isAdminLoggedIn: boolean; loginAdmin: (email: string, password: string) => Promise<boolean>; logoutAdmin: () => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<boolean>; updateProduct: (product: Product) => Promise<boolean>; deleteProduct: (productId: string) => void;
  coupons: Coupon[]; addCoupon: (coupon: Coupon) => void; toggleCouponStatus: (code: string) => void; deleteCoupon: (code: string) => void;
  updateShippingRate: (governorate: GovernorateShipping, fee: number) => Promise<boolean>;
  isQuizOpen: boolean; setIsQuizOpen: (open: boolean) => void; quickViewProduct: Product | null; setQuickViewProduct: (product: Product | null) => void;
  toasts: ToastMessage[]; showToast: (message: string, type?: ToastMessage['type']) => void; removeToast: (id: string) => void;
}
const StoreContext = createContext<StoreContextType | undefined>(undefined);

const mapOrder = (row: any): Order => ({
  id: String(row.id), customerName: row.customer_name ?? '', customerPhone: row.customer_phone ?? '', customerEmail: row.customer_email || undefined,
  governorate: row.governorate ?? '', city: row.city ?? '', detailedAddress: row.detailed_address ?? '', notes: row.notes || undefined,
  paymentMethod: row.payment_method ?? 'cod', paymentStatus: row.payment_status ?? 'pending', shippingStatus: row.shipping_status ?? 'new',
  subtotal: Number(row.subtotal ?? 0), shippingFee: Number(row.shipping_fee ?? 0), discountAmount: Number(row.discount_amount ?? 0),
  couponCode: row.coupon_code || undefined, totalAmount: Number(row.total_amount ?? 0),
  items: (row.order_items || []).map((item: any) => ({
    productId: item.product_id ?? '', productName: item.product_name ?? '', productImage: item.product_image ?? '',
    quantity: Number(item.quantity ?? 0), unitPrice: Number(item.unit_price ?? 0),
    totalPrice: Number(item.total_price ?? Number(item.unit_price ?? 0) * Number(item.quantity ?? 0)), selectedSize: item.selected_size ?? '',
  })), createdAt: row.created_at ?? new Date().toISOString(), trackingHistory: row.tracking_history || [],
});

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(() => { try { const saved = localStorage.getItem('hurr_cart_v2'); return saved ? JSON.parse(saved) : []; } catch { return []; } });
  const [wishlist, setWishlist] = useState<string[]>(() => { try { const saved = localStorage.getItem('hurr_wishlist_v2'); return saved ? JSON.parse(saved) : []; } catch { return []; } });
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [shippingRates, setShippingRates] = useState<GovernorateShipping[]>(EGYPTIAN_GOVERNORATES);
  const [selectedGovernorate, setSelectedGovernorate] = useState<GovernorateShipping>(EGYPTIAN_GOVERNORATES[0]);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 4500);
  };
  const removeToast = (id: string) => setToasts((prev) => prev.filter((toast) => toast.id !== id));

  const applyShippingRows = (rows: any[]) => {
    setShippingRates((current) => current.map((gov) => { const row = rows.find((r) => r.governorate === gov.nameAr); return row ? { ...gov, fee: Number(row.fee) } : gov; }));
    setSelectedGovernorate((current) => { const row = rows.find((r) => r.governorate === current.nameAr); return row ? { ...current, fee: Number(row.fee) } : current; });
  };
  const getAdminRole = async (userId: string): Promise<string | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('admin_roles').select('role').eq('user_id', userId).maybeSingle();
    if (!error && data?.role) return data.role;
    if (error) console.warn('[HUR admin] admin_roles lookup failed:', error.message, error.code);
    const { data: profile, error: profileError } = await supabase.from('profiles').select('role').eq('user_id', userId).maybeSingle();
    if (!profileError && profile?.role) return profile.role;
    if (profileError) console.warn('[HUR admin] profiles lookup failed:', profileError.message, profileError.code);
    return null;
  };

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    const loadPublicData = async () => {
      const [productResult, couponResult, shippingResult] = await Promise.all([
        supabase!.from('products').select('*').order('created_at', { ascending: false }),
        supabase!.from('coupons').select('*').order('created_at', { ascending: false }),
        supabase!.from('shipping_rates').select('*'),
      ]);
      if (!alive) return;
      if (productResult.data) setProducts(productResult.data.map(fromDbProduct));
      else if (productResult.error) console.warn('[HUR store] Products load failed:', productResult.error.message);
      if (couponResult.data) setCoupons(couponResult.data.map(fromDbCoupon));
      else if (couponResult.error) console.warn('[HUR store] Coupons load failed:', couponResult.error.message);
      if (shippingResult.data) applyShippingRows(shippingResult.data);
    };
    const syncSession = async (session: any) => {
      if (!session) { if (alive) setIsAdminLoggedIn(false); return; }
      const role = await getAdminRole(session.user.id);
      if (!alive) return;
      setIsAdminLoggedIn(role === 'admin');
      if (role === 'admin') {
        const [p, c, o, s] = await Promise.all([
          supabase!.from('products').select('*').order('created_at', { ascending: false }),
          supabase!.from('coupons').select('*').order('created_at', { ascending: false }),
          supabase!.from('orders').select('*,order_items(*)').order('created_at', { ascending: false }),
          supabase!.from('shipping_rates').select('*'),
        ]);
        if (!alive) return;
        if (p.data) setProducts(p.data.map(fromDbProduct));
        if (c.data) setCoupons(c.data.map(fromDbCoupon));
        if (o.data) setOrders(o.data.map(mapOrder));
        if (s.data) applyShippingRows(s.data);
      }
    };
    void loadPublicData();
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) return syncSession(data.session);
      return supabase!.auth.signInAnonymously().then(({ data: anon, error }) => {
        if (error) console.warn('[HUR store] Anonymous sign-in failed:', error.message);
        if (anon.session) return syncSession(anon.session);
      });
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { void syncSession(session); });
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, []);
  useEffect(() => { try { localStorage.setItem('hurr_cart_v2', JSON.stringify(cart)); } catch (e) { console.warn('[HUR] Cart storage unavailable', e); } }, [cart]);
  useEffect(() => { try { localStorage.setItem('hurr_wishlist_v2', JSON.stringify(wishlist)); } catch (e) { console.warn('[HUR] Wishlist storage unavailable', e); } }, [wishlist]);

  const addToCart = (product: Product, quantity = 1, selectedSize?: string) => {
    if (product.stock <= 0) { showToast('عذراً، هذا العطر نفد مؤقتاً من المخزن', 'error'); return; }
    const size = selectedSize || product.volume;
    setCart((prev) => {
      const index = prev.findIndex((item) => item.productId === product.id && item.selectedSize === size);
      if (index >= 0) {
        const updated = [...prev]; const next = updated[index].quantity + quantity;
        if (next > product.stock) { showToast(`الكمية المتاحة حالياً في المخزن هي ${product.stock} قطع فقط`, 'warning'); return prev; }
        updated[index] = { ...updated[index], quantity: next }; return updated;
      }
      return [...prev, { productId: product.id, product, quantity: Math.min(quantity, product.stock), selectedSize: size }];
    });
    showToast(`تمت إضافة "${product.nameAr}" إلى سلة مشترياتك`, 'success'); setIsCartOpen(true);
  };
  const removeFromCart = (productId: string) => { setCart((prev) => prev.filter((item) => item.productId !== productId)); showToast('تم حذف المنتج من السلة', 'info'); };
  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart((prev) => prev.map((item) => {
      if (item.productId !== productId) return item;
      if (quantity > item.product.stock) { showToast(`أقصى كمية متوفرة هي ${item.product.stock} قطع`, 'warning'); return item; }
      return { ...item, quantity };
    }));
  };
  const clearCart = () => setCart([]);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const toggleWishlist = (productId: string) => setWishlist((prev) => {
    if (prev.includes(productId)) { showToast('تمت إزالة العطر من قائمة الرغبات', 'info'); return prev.filter((id) => id !== productId); }
    showToast('تم حفظ العطر في قائمة رغباتك', 'success'); return [...prev, productId];
  });
  const isInWishlist = (productId: string) => wishlist.includes(productId);
  const setSelectedGovernorateById = (id: string) => { const found = shippingRates.find((gov) => gov.id === id); if (found) setSelectedGovernorate(found); };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = activeCoupon && subtotal >= activeCoupon.minOrderAmount
    ? activeCoupon.discountType === 'percentage' ? Math.round(subtotal * activeCoupon.value / 100) : Math.min(subtotal, activeCoupon.value) : 0;
  const isFreeShipping = subtotal - discountAmount >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : selectedGovernorate.fee;
  const freeShippingProgress = Math.min(100, Math.round(subtotal / FREE_SHIPPING_THRESHOLD * 100));
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);
  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase(); const found = coupons.find((c) => c.code.toUpperCase() === clean && c.isActive && (!c.expiresAt || new Date(c.expiresAt).getTime() > Date.now()) && (c.maxUses == null || c.usageCount < c.maxUses));
    if (!found) return { success: false, message: 'كود الخصم غير صحيح أو منتهي الصلاحية أو استنفد عدد استخداماته' };
    if (subtotal < found.minOrderAmount) return { success: false, message: `هذا الكوبون يتطلب حداً أدنى للطلب بقيمة ${found.minOrderAmount} ج.م` };
    setActiveCoupon(found); return { success: true, message: `تم تفعيل كوبون الخصم: ${found.description}` };
  };
  const removeCoupon = () => { setActiveCoupon(null); showToast('تم إلغاء كود الخصم', 'info'); };

  const placeOrder = async (orderData: NewOrder): Promise<Order> => {
    if (!supabase) throw new Error('المتجر غير متصل بقاعدة الطلبات الآمنة. يرجى المحاولة لاحقاً.');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) console.warn('[HUR checkout] Session lookup failed:', sessionError.message);
    if (!sessionData.session) {
      const { data: anonData, error: authError } = await supabase.auth.signInAnonymously();
      if (authError || !anonData.session) throw new Error('تعذر إنشاء جلسة آمنة للطلب. تحقق من تفعيل الدخول المجهول في إعدادات المصادقة.');
    }
    const { data, error } = await supabase.functions.invoke('create-order', { body: {
      customerName: orderData.customerName, customerPhone: orderData.customerPhone.replace(/\s/g, ''),
      customerEmail: orderData.customerEmail, governorate: orderData.governorate, city: orderData.city,
      detailedAddress: orderData.detailedAddress, notes: orderData.notes, paymentMethod: orderData.paymentMethod,
      couponCode: orderData.couponCode,
      items: orderData.items.map((item) => ({ productId: item.productId, quantity: item.quantity, selectedSize: item.selectedSize })),
    } });
    // Support both response contracts: {id, trackingToken} and {success:true, order:{id, trackingToken}}.
    const response = data?.order ?? data;
    const context = (error as any)?.context;
    if (error || data?.success === false || !response?.id || !response?.trackingToken) {
      let serverMessage = data?.error as string | undefined;
      if (!serverMessage && context && typeof context.clone === 'function') {
        try { const body = await context.clone().json(); serverMessage = body?.error || body?.message; } catch { /* response may not be JSON */ }
      }
      console.error('[HUR checkout] create-order failed', { message: error?.message, serverMessage, status: context?.status, code: (error as any)?.name });
      if ((error?.message || '').toLowerCase().includes('failed to send a request') || (error as any)?.name === 'FunctionsFetchError') throw new Error('تعذر الاتصال بخدمة الطلبات. تحقق من نشر خدمة الطلبات وصحة إعدادات الاتصال في الموقع.');
      if (context?.status === 401 || context?.status === 403) throw new Error('خدمة الطلبات رفضت الاتصال. تحقق من إعدادات التحقق من الهوية ونشر خدمة الطلبات.');
      throw new Error(serverMessage || 'تعذر حفظ الطلب. راجع سجل أخطاء خدمة الطلبات لمعرفة السبب.');
    }
    const newOrder: Order = {
      ...orderData, id: String(response.id), subtotal: Number(response.subtotal ?? orderData.subtotal),
      shippingFee: Number(response.shippingFee ?? orderData.shippingFee), discountAmount: Number(response.discountAmount ?? orderData.discountAmount),
      totalAmount: Number(response.totalAmount ?? orderData.totalAmount),
      items: (response.items || orderData.items).map((item: any) => ({
        productId: item.productId ?? item.product_id ?? '', productName: item.productName ?? item.product_name ?? '',
        productImage: item.productImage ?? item.product_image ?? '', quantity: Number(item.quantity ?? 0),
        unitPrice: Number(item.unitPrice ?? item.unit_price ?? 0), totalPrice: Number(item.totalPrice ?? item.total_price ?? Number(item.unitPrice ?? item.unit_price ?? 0) * Number(item.quantity ?? 0)),
        selectedSize: item.selectedSize ?? item.selected_size ?? '',
      })),
      createdAt: new Date().toISOString(), trackingToken: String(response.trackingToken),
      trackingHistory: [
        { status: 'new', label: 'تم استلام وتأكيد الطلب', date: 'الآن', description: 'تم تسجيل طلبك في نظام دار حُرّ وسيقوم قسم المبيعات بمراجعته فوراً', completed: true },
        { status: 'processing', label: 'قيد التجهيز في مشغل العطور', date: 'خلال 4 ساعات', description: 'سيتم تجهيز وتغليف طلبك بعناية', completed: false },
        { status: 'shipped', label: 'خرج للشحن مع المندوب', date: selectedGovernorate.estimatedDelivery, description: `تسليم الشحنة لشركة التوصيل إلى ${orderData.governorate}`, completed: false },
        { status: 'delivered', label: 'تم التسليم بنجاح', date: 'عند الوصول', description: 'فحص المنتج مع المندوب واستلام الفاتورة', completed: false },
      ],
    };
    try { window.localStorage.setItem(`hurr_track_${newOrder.id}`, newOrder.trackingToken!); }
    catch (storageError) { console.warn('[HUR checkout] Could not persist tracking token:', storageError); }
    setProducts((prev) => prev.map((product) => { const item = orderData.items.find((entry) => entry.productId === product.id); return item ? { ...product, stock: Math.max(0, product.stock - item.quantity) } : product; }));
    if (activeCoupon) {
      const usedCode = activeCoupon.code.toUpperCase();
      setCoupons((prev) => prev.map((coupon) => coupon.code.toUpperCase() === usedCode ? { ...coupon, usageCount: coupon.usageCount + 1, isActive: coupon.maxUses != null && coupon.usageCount + 1 >= coupon.maxUses ? false : coupon.isActive } : coupon));
      setActiveCoupon(null);
    }
    setOrders((prev) => [newOrder, ...prev]); clearCart(); return newOrder;
  };

  const updateOrderStatus = async (orderId: string, shippingStatus: ShippingStatus, paymentStatus?: PaymentStatus): Promise<void> => {
    if (!supabase || !isAdminLoggedIn) throw new Error('يلزم تسجيل دخول المدير');
    const update: Record<string, string> = { shipping_status: shippingStatus }; if (paymentStatus) update.payment_status = paymentStatus;
    const { data, error } = await supabase.from('orders').update(update).eq('id', orderId).select('id').maybeSingle();
    if (error) { console.error('[HUR admin] Failed to update order status:', { orderId, code: error.code, message: error.message, details: error.details, hint: error.hint }); throw new Error(error.message || 'تعذر تحديث الطلب في قاعدة البيانات'); }
    if (!data) throw new Error('لم يُحدّث الطلب. تحقق من صلاحية المدير وسياسات الوصول إلى الطلبات.');
    setOrders((prev) => prev.map((order) => order.id !== orderId ? order : ({ ...order, shippingStatus, paymentStatus: paymentStatus || order.paymentStatus, trackingHistory: order.trackingHistory.map((step) => step.status === shippingStatus ? { ...step, completed: true, date: 'تم التحديث الآن' } : { ...step, completed: false }) })));
    showToast(`تم تحديث حالة الطلب ${orderId} إلى: ${shippingStatus}`, 'success');
  };
  const getOrderById = (id: string) => orders.find((order) => order.id.toUpperCase() === id.trim().toUpperCase());
  const getOrdersByPhone = (phone: string) => { const clean = phone.replace(/[^0-9]/g, ''); return orders.filter((order) => order.customerPhone.replace(/[^0-9]/g, '').includes(clean)); };
  const trackOrder = async (id: string, token: string): Promise<Order | null> => {
    if (!supabase || !id.trim() || token.length < 32) return null;
    const { data, error } = await supabase.functions.invoke('track-order', { body: { id: id.trim().toUpperCase(), trackingToken: token } });
    if (error || !data?.id) return null;
    return { id: data.id, customerName: '', customerPhone: '', governorate: '', city: '', detailedAddress: '', paymentStatus: data.paymentStatus,
      shippingStatus: data.shippingStatus, subtotal: Number(data.subtotal || 0), shippingFee: Number(data.shippingFee || 0), discountAmount: Number(data.discountAmount || 0), totalAmount: Number(data.totalAmount || 0),
      paymentMethod: data.paymentMethod || 'cod', items: (data.items || []).map((i: any) => ({ productId: '', productName: i.productName, productImage: '', quantity: Number(i.quantity || 0), unitPrice: Number(i.unitPrice || 0), totalPrice: Number(i.totalPrice || 0), selectedSize: i.selectedSize || '' })),
      createdAt: data.createdAt, trackingHistory: data.trackingHistory || [] };
  };
  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    if (!supabase) { showToast('أكمل إعدادات الاتصال أولاً لتفعيل لوحة الإدارة', 'error'); return false; }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { showToast('تعذر تسجيل الدخول. تحقق من البريد وكلمة المرور وصلاحية المدير.', 'error'); return false; }
    const { data } = await supabase.auth.getUser(); const role = data.user?.id ? await getAdminRole(data.user.id) : null;
    if (role !== 'admin') { await supabase.auth.signOut(); showToast('تم تسجيل الدخول لكن الحساب غير مخوّل للإدارة. تحقق من جدول admin_roles وصلاحيات القراءة.', 'error'); return false; }
    setIsAdminLoggedIn(true); showToast('تم تسجيل الدخول إلى لوحة حُرّ', 'success'); return true;
  };
  const logoutAdmin = async () => { if (supabase) await supabase.auth.signOut(); setIsAdminLoggedIn(false); showToast('تم تسجيل الخروج من لوحة التحكم', 'info'); };

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<boolean> => {
    if (!supabase || !isAdminLoggedIn) { showToast('يلزم اتصال قاعدة البيانات وتسجيل دخول المدير لحفظ المنتج.', 'error'); return false; }
    const draft: Product = { ...productData, id: '', createdAt: new Date().toISOString() };
    const { data, error } = await supabase.from('products').insert(toDbProduct(draft)).select('*').single();
    if (error || !data) { showToast(error?.message || 'تعذر حفظ المنتج في قاعدة البيانات.', 'error'); return false; }
    const saved = fromDbProduct(data); setProducts((prev) => [saved, ...prev]); showToast(`تمت إضافة العطر "${saved.nameAr}" بنجاح`, 'success'); return true;
  };
  const updateProduct = async (updated: Product): Promise<boolean> => {
    if (!supabase || !isAdminLoggedIn) { showToast('يلزم اتصال قاعدة البيانات وتسجيل دخول المدير لتعديل المنتج.', 'error'); return false; }
    const { data, error } = await supabase.from('products').update(toDbProduct(updated)).eq('id', updated.id).select('*').single();
    if (error || !data) { showToast(error?.message || 'تعذر تحديث المنتج في قاعدة البيانات.', 'error'); return false; }
    const saved = fromDbProduct(data); setProducts((prev) => prev.map((product) => product.id === updated.id ? saved : product)); showToast(`تم تحديث بيانات العطر "${saved.nameAr}"`, 'success'); return true;
  };
  const deleteProduct = async (productId: string) => {
    if (!supabase || !isAdminLoggedIn) { showToast('يلزم اتصال قاعدة البيانات وتسجيل دخول المدير لحذف المنتج.', 'error'); return; }
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) { showToast(error.message, 'error'); return; }
    setProducts((prev) => prev.filter((product) => product.id !== productId)); showToast('تم حذف المنتج من المتجر', 'info');
  };
  const addCoupon = async (coupon: Coupon): Promise<void> => {
    if (!supabase || !isAdminLoggedIn) { showToast('يلزم اتصال قاعدة البيانات وتسجيل دخول المدير لإضافة كوبون.', 'error'); return; }
    if (!Number.isFinite(Number(coupon.value)) || Number(coupon.value) <= 0 || (coupon.discountType === 'percentage' && Number(coupon.value) > 100)) { showToast('أدخل قيمة خصم صحيحة، ولا تجعل النسبة أكبر من 100%.', 'error'); return; }
    if (coupon.maxUses != null && (!Number.isInteger(Number(coupon.maxUses)) || Number(coupon.maxUses) < 1)) { showToast('حد الاستخدام يجب أن يكون رقمًا صحيحًا يبدأ من 1.', 'error'); return; }
    const code = coupon.code.trim().toUpperCase(); if (!code) { showToast('أدخل كود كوبون صحيحًا.', 'error'); return; }
    const couponValue = Number(coupon.value);
    // Keep the legacy NOT NULL column populated while also writing the canonical fields.
    // For fixed-amount coupons, legacy percentage is set to zero; `value` remains authoritative.
    const { data, error } = await supabase.from('coupons').insert({
      code,
      discount_percent: coupon.discountType === 'percentage' ? couponValue : 0,
      discount_type: coupon.discountType,
      value: couponValue,
      min_order_amount: Number(coupon.minOrderAmount || 0),
      is_active: Boolean(coupon.isActive),
      usage_count: 0,
      max_uses: coupon.maxUses == null ? null : Number(coupon.maxUses),
      expires_at: coupon.expiresAt || null,
      description: coupon.description || '',
    }).select('*').single();
    if (error || !data) { console.error('[HURR] Failed to add coupon:', error); showToast(`تعذرت إضافة الكوبون: ${error?.message || 'خطأ غير معروف'}`, 'error'); return; }
    const saved: Coupon = fromDbCoupon(data);
    setCoupons((prev) => [saved, ...prev.filter((item) => item.code !== saved.code)]); showToast(`تمت إضافة كود الخصم "${saved.code}" بنجاح`, 'success');
  };
  const toggleCouponStatus = async (code: string) => {
    if (!supabase || !isAdminLoggedIn) { showToast('يلزم اتصال قاعدة البيانات وتسجيل دخول المدير لتعديل الكوبون.', 'error'); return; }
    const current = coupons.find((coupon) => coupon.code === code); if (!current) return;
    const { error } = await supabase.from('coupons').update({ is_active: !current.isActive }).eq('code', code);
    if (error) { showToast(error.message, 'error'); return; }
    setCoupons((prev) => prev.map((coupon) => coupon.code === code ? { ...coupon, isActive: !current.isActive } : coupon));
  };
  const deleteCoupon = async (code: string) => {
    if (!supabase || !isAdminLoggedIn) { showToast('يلزم اتصال قاعدة البيانات وتسجيل دخول المدير لحذف الكوبون.', 'error'); return; }
    const { error } = await supabase.from('coupons').delete().eq('code', code); if (error) { showToast(error.message, 'error'); return; }
    setCoupons((prev) => prev.filter((coupon) => coupon.code !== code)); showToast('تم حذف كود الخصم', 'info');
  };
  const updateShippingRate = async (governorate: GovernorateShipping, fee: number): Promise<boolean> => {
    if (!supabase || !isAdminLoggedIn) { showToast('يلزم تسجيل دخول المدير لتعديل أسعار الشحن.', 'error'); return false; }
    if (!Number.isFinite(fee) || fee < 0) { showToast('أدخل سعر شحن صحيحًا لا يقل عن صفر.', 'error'); return false; }
    const { error } = await supabase.from('shipping_rates').upsert({ governorate: governorate.nameAr, fee: Number(fee), active: true }, { onConflict: 'governorate' });
    if (error) { showToast(`تعذر حفظ سعر الشحن: ${error.message}`, 'error'); return false; }
    const updated = { ...governorate, fee: Number(fee) }; setShippingRates((prev) => prev.map((g) => g.id === governorate.id ? updated : g));
    setSelectedGovernorate((prev) => prev.id === governorate.id ? updated : prev); showToast(`تم حفظ سعر شحن ${governorate.nameAr}`, 'success'); return true;
  };

  return <StoreContext.Provider value={{
    products, activeCategory, setActiveCategory, searchQuery, setSearchQuery, selectedFamily, setSelectedFamily, sortBy, setSortBy,
    cart, isCartOpen, setIsCartOpen, addToCart, removeFromCart, updateCartQuantity, clearCart, cartCount, wishlist, toggleWishlist, isInWishlist,
    selectedGovernorate, shippingRates, setSelectedGovernorateById, activeCoupon, applyCoupon, removeCoupon, subtotal, discountAmount, shippingFee, totalAmount, isFreeShipping, freeShippingProgress,
    orders, placeOrder, updateOrderStatus, getOrderById, getOrdersByPhone, trackOrder, isAdminLoggedIn, loginAdmin, logoutAdmin, addProduct, updateProduct, deleteProduct,
    coupons, addCoupon, toggleCouponStatus, deleteCoupon, updateShippingRate, isQuizOpen, setIsQuizOpen, quickViewProduct, setQuickViewProduct, toasts, showToast, removeToast,
  }}>{children}</StoreContext.Provider>;
};
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
