import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { EGYPTIAN_GOVERNORATES } from '../../data/governorates';
import { PaymentMethod, Order } from '../../types';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface CheckoutPageProps {
  onBackToStore: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onBackToStore,
  onOrderCompleted,
}) => {
  const {
    cart,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    selectedGovernorate,
    setSelectedGovernorateById,
    activeCoupon,
    placeOrder,
    showToast,
  } = useStore();

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [city, setCity] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  // Vodafone Cash / Instapay details
  const [senderWalletPhone, setSenderWalletPhone] = useState('');
  const [walletTransactionId, setWalletTransactionId] = useState('');

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation
  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!customerName.trim() || customerName.trim().length < 3) {
      errs.customerName = 'يرجى إدخال الاسم بالكامل ثلاثياً لضمان دقة التوصيل';
    }

    // Egyptian phone validation: 11 digits starting with 010, 011, 012, or 015
    const cleanPhone = customerPhone.replace(/\s+/g, '');
    const egPhoneRegex = /^(010|011|012|015)[0-9]{8}$/;
    if (!egPhoneRegex.test(cleanPhone)) {
      errs.customerPhone = 'يرجى إدخال رقم هاتف مصري صحيح (11 رقماً يبدأ بـ 010 أو 011 أو 012 أو 015)';
    }

    if (!city.trim()) {
      errs.city = 'يرجى تحديد المدينة أو الحي (مثل: المعادي، الشيخ زايد، سموحة)';
    }

    if (!detailedAddress.trim() || detailedAddress.trim().length < 10) {
      errs.detailedAddress = 'يرجى كتابة العنوان بالتفصيل (اسم الشارع، رقم العمارة، الشقة، علامة مميزة)';
    }

    if (paymentMethod === 'card') {
    }

    if (paymentMethod === 'vodafone_cash' || paymentMethod === 'instapay') {
      if (!senderWalletPhone.trim()) {
        errs.senderWalletPhone = 'يرجى كتابة رقم المحفظة / الحساب الذي قمت بالتحويل منه للتحقق الفوري';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('سلة المشتريات فارغة', 'error');
      onBackToStore();
      return;
    }

    if (!validateForm()) {
      showToast('يرجى تصحيح الأخطاء في استمارة الطلب للمتابعة', 'error');
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate brief network verification
      const orderItems = cart.map((item) => ({
        productId: item.productId,
        productName: item.product.nameAr,
        productImage: item.product.images[0] || '',
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: item.product.price * item.quantity,
        selectedSize: item.selectedSize,
      }));

      const newOrder = await placeOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        governorate: selectedGovernorate.nameAr,
        city: city.trim(),
        detailedAddress: detailedAddress.trim(),
        notes: notes.trim() || undefined,
        paymentMethod,
        paymentStatus: 'pending',
        shippingStatus: 'new',
        subtotal,
        shippingFee,
        discountAmount,
        couponCode: activeCoupon?.code,
        totalAmount,
        items: orderItems,
        paymentReference:
          paymentMethod === 'vodafone_cash' || paymentMethod === 'instapay'
            ? `محفظة: ${senderWalletPhone} | عملية: ${walletTransactionId || 'قيد المراجعة'}`
            : undefined,
      });

      showToast(`تم تسجيل طلبك الأصيل بنجاح برقم: ${newOrder.id}`, 'success');
      onOrderCompleted(newOrder);
    } catch (err: any) {
      console.error('[HURR checkout] Order submission failed:', err);
      showToast(err.message || 'حدث خطأ أثناء حفظ الطلب', 'error');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-serif font-bold text-[#EDE8DC]">لا توجد منتجات لإتمام الطلب</h2>
        <button
          onClick={onBackToStore}
          className="px-6 py-2.5 bg-[#C5A059] text-[#0A0A0A] font-bold text-xs rounded-lg"
        >
          العودة للتسوق
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-right">
      {/* Return to Store Header Link */}
      <button
        onClick={onBackToStore}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#A69F90] hover:text-[#C5A059] mb-6 transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة إلى متجر حُرّ</span>
      </button>

      <div className="mb-8 border-b border-[#222] pb-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FBF9F5]">
          إتمام الطلب الأصيل
        </h1>
        <p className="text-xs sm:text-sm text-[#8A8275] mt-1">
          شحن موثوق وسريع لكافة محافظات جمهورية مصر العربية مع حق الفحص قبل الاستلام
        </p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left / Input Fields (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Contact Details */}
            <div className="p-5 sm:p-6 bg-[#111111] border border-[#222] rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-[#E5C378] flex items-center gap-2 border-b border-[#1C1C1C] pb-3">
                <span className="w-5 h-5 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span>بيانات المستلم والتواصل</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#C8C2B3] mb-1">
                    الاسم بالكامل (ثلاثي) <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: المستشار طارق عبد الرحمن الشريف"
                    className="w-full p-2.5 bg-[#181818] border border-[#333] focus:border-[#C5A059] rounded-lg text-sm text-[#EDE8DC] focus:outline-none"
                  />
                  {errors.customerName && (
                    <p className="text-[11px] text-red-400 mt-1">{errors.customerName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#C8C2B3] mb-1">
                      رقم الهاتف المحمول (واتساب) <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="01062003963"
                      className="w-full p-2.5 bg-[#181818] border border-[#333] focus:border-[#C5A059] rounded-lg text-sm text-[#EDE8DC] focus:outline-none"
                    />
                    {errors.customerPhone && (
                      <p className="text-[11px] text-red-400 mt-1">{errors.customerPhone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#C8C2B3] mb-1">
                      البريد الإلكتروني (اختياري - لاستلام الفاتورة)
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full p-2.5 bg-[#181818] border border-[#333] focus:border-[#C5A059] rounded-lg text-sm text-[#EDE8DC] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address in Egypt */}
            <div className="p-5 sm:p-6 bg-[#111111] border border-[#222] rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-[#E5C378] flex items-center gap-2 border-b border-[#1C1C1C] pb-3">
                <span className="w-5 h-5 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <span>عنوان التوصيل في مصر</span>
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Egyptian Governorate Dropdown */}
                  <div>
                    <label className="block text-xs font-medium text-[#C8C2B3] mb-1">
                      المحافظة المصرية <span className="text-amber-500">*</span>
                    </label>
                    <select
                      value={selectedGovernorate.id}
                      onChange={(e) => setSelectedGovernorateById(e.target.value)}
                      className="w-full p-2.5 bg-[#181818] border border-[#333] focus:border-[#C5A059] rounded-lg text-sm text-[#EDE8DC] focus:outline-none"
                    >
                      {EGYPTIAN_GOVERNORATES.map((gov) => (
                        <option key={gov.id} value={gov.id}>
                          {gov.nameAr}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City / Area */}
                  <div>
                    <label className="block text-xs font-medium text-[#C8C2B3] mb-1">
                      المدينة / الحي أو المنطقة <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="مثال: التجمع الخامس، الشيخ زايد، سموحة..."
                      className="w-full p-2.5 bg-[#181818] border border-[#333] focus:border-[#C5A059] rounded-lg text-sm text-[#EDE8DC] focus:outline-none"
                    />
                    {errors.city && <p className="text-[11px] text-red-400 mt-1">{errors.city}</p>}
                  </div>
                </div>

                {/* Detailed Address */}
                <div>
                  <label className="block text-xs font-medium text-[#C8C2B3] mb-1">
                    العنوان بالتفصيل <span className="text-amber-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={detailedAddress}
                    onChange={(e) => setDetailedAddress(e.target.value)}
                    placeholder="اسم الشارع، رقم العمارة، رقم الشقة أو الفيلا، وأقرب علامة مميزة لمندوب الشحن"
                    className="w-full p-2.5 bg-[#181818] border border-[#333] focus:border-[#C5A059] rounded-lg text-sm text-[#EDE8DC] focus:outline-none"
                  />
                  {errors.detailedAddress && (
                    <p className="text-[11px] text-red-400 mt-1">{errors.detailedAddress}</p>
                  )}
                </div>

                {/* Notes for Courier */}
                <div>
                  <label className="block text-xs font-medium text-[#8A8275] mb-1">
                    ملاحظات للمندوب أو وقت التسليم المفضل (اختياري)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="مثال: يرجى الاتصال قبل الوصول بساعة، التوصيل بعد الساعة 4 عصراً"
                    className="w-full p-2.5 bg-[#181818] border border-[#333] focus:border-[#C5A059] rounded-lg text-sm text-[#EDE8DC] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="p-5 sm:p-6 bg-[#111111] border border-[#222] rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-[#E5C378] flex items-center gap-2 border-b border-[#1C1C1C] pb-3">
                <span className="w-5 h-5 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <span>طريقة الدفع المعتمدة في مصر</span>
              </h3>

              <div className="space-y-3">
                {/* 1. Cash on Delivery (COD) */}
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-[#1C1A14] border-[#C5A059]'
                      : 'bg-[#141414] border-[#262626] hover:border-[#444]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-[#C5A059] focus:ring-[#C5A059]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#EDE8DC] flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-[#C5A059]" />
                        <span>الدفع عند الاستلام (كاش مع المعاينة)</span>
                      </span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                        الأكثر طلباً في مصر
                      </span>
                    </div>
                    <p className="text-xs text-[#8A8275] mt-1 leading-relaxed">
                      ادفع نقداً لمندوب الشحن عند استلام الطرد وفحصه والتأكد من سلامة الزجاجات والعينة.
                    </p>
                  </div>
                </label>

                {/* 2. Vodafone Cash & InstaPay */}
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'vodafone_cash' || paymentMethod === 'instapay'
                      ? 'bg-[#1C1A14] border-[#C5A059]'
                      : 'bg-[#141414] border-[#262626] hover:border-[#444]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vodafone_cash"
                    checked={paymentMethod === 'vodafone_cash' || paymentMethod === 'instapay'}
                    onChange={() => setPaymentMethod('vodafone_cash')}
                    className="mt-1 text-[#C5A059] focus:ring-[#C5A059]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#EDE8DC] flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-[#C5A059]" />
                        <span>فودافون كاش & إنستاباي مصر (تحويل فوري)</span>
                      </span>
                      <span className="text-[10px] bg-[#C5A059]/10 text-[#E5C378] border border-[#C5A059]/30 px-2 py-0.5 rounded">
                        01062003963
                      </span>
                    </div>
                    <p className="text-xs text-[#8A8275] mt-1 leading-relaxed">
                      حوّل المبلغ مباشرة على رقم دار حُرّ المعتمد: <strong>01062003963</strong>
                    </p>
                  </div>
                </label>

                {/* Extra Wallet Fields if selected */}
                {(paymentMethod === 'vodafone_cash' || paymentMethod === 'instapay') && (
                  <div className="p-4 bg-[#181611] border border-[#C5A059]/40 rounded-xl space-y-3 mr-6 animate-in fade-in">
                    <p className="text-xs text-[#E5C378] leading-relaxed">
                      📌 يرجى تحويل مبلغ <strong className="text-white tabular-nums">{totalAmount.toLocaleString('ar-EG')} ج.م</strong> إلى رقم فودافون كاش / إنستاباي: <strong className="text-white">01062003963</strong> ثم كتابة رقمك بالأسفل للتحقق الفوري.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#A69F90] mb-1">
                          رقم المحفظة المحول منها <span className="text-amber-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={senderWalletPhone}
                          onChange={(e) => setSenderWalletPhone(e.target.value)}
                          placeholder="010XXXXXXXX"
                          className="w-full p-2 bg-[#121212] border border-[#333] rounded text-xs text-[#EDE8DC]"
                        />
                        {errors.senderWalletPhone && (
                          <p className="text-[10px] text-red-400 mt-1">{errors.senderWalletPhone}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#A69F90] mb-1">
                          رقم المعاملة / العملية (اختياري)
                        </label>
                        <input
                          type="text"
                          value={walletTransactionId}
                          onChange={(e) => setWalletTransactionId(e.target.value)}
                          placeholder="رقم مرجع التحويل"
                          className="w-full p-2 bg-[#121212] border border-[#333] rounded text-xs text-[#EDE8DC]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Online Cards (Visa / Mastercard / Meeza) */}
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-[#1C1A14] border-[#C5A059]'
                      : 'bg-[#141414] border-[#262626] hover:border-[#444]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    disabled
                    className="mt-1 text-[#C5A059] focus:ring-[#C5A059]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#EDE8DC] flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#C5A059]" />
                        <span>الدفع بالبطاقة (يتطلب تفعيل بوابة الدفع)</span>
                      </span>
                      <span className="text-[10px] text-[#8A8275] flex items-center gap-1">
                        بوابة الدفع غير مفعّلة
                      </span>
                    </div>
                    <p className="text-xs text-[#8A8275] mt-1 leading-relaxed">
                      دفع إلكتروني آمن ومباشر عبر البوابة البنكية المعتمدة للبنك المركزي المصري.
                    </p>
                  </div>
                </label>

                <p className="text-[10px] text-[#8A8275]">تُفعّل البطاقات بعد ربط بوابة دفع معتمدة.</p>
              </div>
            </div>
          </div>

          {/* Right / Order Summary Sticky Box (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 p-5 sm:p-6 bg-[#111111] border border-[#C5A059]/30 rounded-2xl space-y-4 shadow-xl">
              <h3 className="text-base font-serif font-bold text-[#FBF9F5] border-b border-[#222] pb-3 flex items-center justify-between">
                <span>ملخص الطلب الأصيل</span>
                <span className="text-xs font-normal text-[#C5A059]">
                  {cart.length} أصناف عطرية
                </span>
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={`${item.productId}-${item.selectedSize}`}
                    className="flex items-center justify-between gap-3 text-xs border-b border-[#1C1C1C] pb-2.5"
                  >
                    <div>
                      <h4 className="font-semibold text-[#EDE8DC]">{item.product.nameAr}</h4>
                      <span className="text-[10px] text-[#8C8475]">
                        {item.selectedSize} × {item.quantity}
                      </span>
                    </div>
                    <span className="font-sans font-bold text-[#EDE8DC] tabular-nums">
                      {(item.product.price * item.quantity).toLocaleString('ar-EG')} ج.م
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="space-y-2 text-xs text-[#8A8275] pt-2 border-t border-[#1C1C1C]">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-sans text-[#EDE8DC] tabular-nums">
                    {subtotal.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>خصم الكوبون ({activeCoupon?.code}):</span>
                    <span className="font-sans tabular-nums">
                      - {discountAmount.toLocaleString('ar-EG')} ج.م
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>
                    شحن لـ {selectedGovernorate.nameAr} ({selectedGovernorate.estimatedDelivery}):
                  </span>
                  <span className="font-sans text-[#EDE8DC] tabular-nums">
                    {shippingFee === 0 ? (
                      <span className="text-[#C5A059] font-bold">مجاني</span>
                    ) : (
                      `${shippingFee} ج.م`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-[#FBF9F5] border-t border-[#222] pt-3 mt-3">
                  <span>المبلغ الإجمالي المستحق:</span>
                  <span className="gold-gradient-text font-sans tabular-nums text-lg">
                    {totalAmount.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
              </div>

              {/* Royal Guarantee Note */}
              <div className="p-3 bg-[#161512] border border-[#C5A059]/20 rounded-xl space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-[#E5C378] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>تعهد دار حُرّ الأصيل:</span>
                </div>
                <p className="text-[11px] text-[#8C8475] leading-relaxed">
                  يحق لك فحص العطر وتجربة العينة المرفقة قبل فتح الزجاجة، والاسترجاع خلال 14 يوماً
                  وفقاً لقانون حماية المستهلك المصري.
                </p>
              </div>

              {/* Final Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#E5C378] hover:from-[#D4AF37] hover:to-[#FFF3D1] text-[#0A0A0A] font-bold text-sm sm:text-base rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 ${
                  isSubmitting ? 'opacity-70 cursor-wait' : 'active:scale-98'
                }`}
              >
                {isSubmitting ? (
                  <span>جاري تسجيل الطلب وتأكيد المخزون...</span>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-[#0A0A0A]" />
                    <span>تأكيد الطلب وشحن العطر الآن</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
