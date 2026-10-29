import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import {
  Search,
  CheckCircle,
  Clock,
  Truck,
  Package,
  MessageCircle,
  Printer,
  ArrowRight,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface OrderTrackingPageProps {
  initialOrder?: Order | null;
  onBackToStore: () => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrder,
  onBackToStore,
}) => {
  const { trackOrder } = useStore();
  const [searchQuery, setSearchQuery] = useState(initialOrder ? initialOrder.id : '');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(initialOrder || null);
  const [hasSearched, setHasSearched] = useState(Boolean(initialOrder));
  const [searchError, setSearchError] = useState('');
  const [trackingToken, setTrackingToken] = useState((initialOrder as (Order & { trackingToken?: string }) | null)?.trackingToken || (initialOrder ? localStorage.getItem(`hurr_track_${initialOrder.id}`) || '' : ''));

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const clean = searchQuery.trim();
    if (!clean) return;

    setHasSearched(true);
    const token = trackingToken || localStorage.getItem(`hurr_track_${clean}`) || '';
    const found = await trackOrder(clean, token);

    if (found) {
      setCurrentOrder(found);
      setSearchError('');
    } else {
      setCurrentOrder(null);
      setSearchError('تعذر التحقق من الطلب. أدخل رقم الطلب ورمز التتبع المرسل بعد إتمام الشراء.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-right">
      {/* Return button */}
      <button
        onClick={onBackToStore}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#A69F90] hover:text-[#C5A059] mb-6 transition-colors print:hidden"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة إلى المتجر</span>
      </button>

      {/* Title */}
      <div className="mb-8 border-b border-[#222] pb-4 print:hidden">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FBF9F5]">
          تتبّع طلبك والشحنة
        </h1>
        <p className="text-xs sm:text-sm text-[#8A8275] mt-1">
          تابع مسار شحنتك لحظة بلحظة عبر كافة محافظات جمهورية مصر العربية
        </p>
      </div>

      {/* Search Input Bar (Hidden when printing invoice) */}
      <div className="mb-8 p-5 bg-[#121212] border border-[#222] rounded-xl print:hidden">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#C5A059] absolute right-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="أدخل رقم الطلب (مثال: HURR-EG-10842) أو رقم هاتفك المحمول"
              className="w-full pr-10 pl-3 py-2.5 bg-[#181818] border border-[#333] focus:border-[#C5A059] rounded-lg text-sm text-[#EDE8DC] focus:outline-none"
            />
          </div>
          <input type="password" value={trackingToken} onChange={(e) => setTrackingToken(e.target.value)} placeholder="رمز التتبع الخاص بك" className="flex-1 px-3 py-2.5 bg-[#181818] border border-[#333] focus:border-[#C5A059] rounded-lg text-sm text-[#EDE8DC]" />
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0A0A0A] font-bold text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap"
          >
            تتبع الشحنة
          </button>
        </form>
        {searchError && <p className="text-xs text-red-400 mt-2">{searchError}</p>}
      </div>

      {/* Order Tracking Display / Invoice */}
      {currentOrder && (
        <div className="space-y-6">
          {/* Top Status & WhatsApp Action Card */}
          <div className="p-6 bg-[#111111] border border-[#C5A059]/30 rounded-2xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-4">
              <div>
                <span className="text-xs text-[#8A8275] block">رقم الطلب:</span>
                <span className="text-xl font-bold font-sans text-[#E5C378] tracking-wider">
                  {currentOrder.id}
                </span>
                <span className="text-xs text-[#666] block mt-0.5">
                  تاريخ التسجيل: {new Date(currentOrder.createdAt).toLocaleDateString('ar-EG')}
                </span>
              </div>

              {currentOrder.trackingToken && (
                <div className="sm:max-w-sm p-3 bg-[#181611] border border-[#C5A059]/30 rounded-lg print:hidden">
                  <span className="text-[11px] text-[#A69F90] block">احتفظ برمز التتبع الخاص لعرض حالة الطلب لاحقاً:</span>
                  <code className="block mt-1 text-xs text-[#E5C378] break-all select-all">{currentOrder.trackingToken}</code>
                </div>
              )}

              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    currentOrder.shippingStatus === 'delivered'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : currentOrder.shippingStatus === 'shipped'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      : 'bg-[#C5A059]/10 text-[#E5C378] border border-[#C5A059]/30'
                  }`}
                >
                  {currentOrder.shippingStatus === 'new' && 'تم استلام وتأكيد الطلب'}
                  {currentOrder.shippingStatus === 'processing' && 'قيد التجهيز والتعطير في المعمل'}
                  {currentOrder.shippingStatus === 'shipped' && 'في الطريق مع مندوب الشحن'}
                  {currentOrder.shippingStatus === 'delivered' && 'تم التسليم بنجاح'}
                  {currentOrder.shippingStatus === 'cancelled' && 'تم إلغاء الطلب'}
                </span>

                <button
                  onClick={handlePrint}
                  className="p-2 bg-[#181818] hover:bg-[#222] border border-[#333] rounded-lg text-[#EDE8DC] text-xs flex items-center gap-1.5 print:hidden"
                  title="طباعة الفاتورة"
                >
                  <Printer className="w-4 h-4 text-[#C5A059]" />
                  <span className="hidden sm:inline">طباعة الفاتورة</span>
                </button>
              </div>
            </div>

            {/* Tracking Progress Timeline */}
            <div className="py-4">
              <h3 className="text-xs uppercase tracking-wider text-[#A69F90] mb-6 font-semibold">
                مراحل تجهيز طلبك وتوصيله:
              </h3>

              <div className="relative">
                {/* Horizontal / Vertical connection line */}
                <div className="absolute top-4 right-4 left-4 h-0.5 bg-[#222] hidden sm:block -z-0" />

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
                  {currentOrder.trackingHistory.map((step, idx) => {
                    return (
                      <div
                        key={step.status}
                        className={`p-3 rounded-xl border text-right transition-all ${
                          step.completed
                            ? 'bg-[#181611] border-[#C5A059]/50'
                            : 'bg-[#121212] border-[#222] opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              step.completed
                                ? 'bg-[#C5A059] text-[#0A0A0A]'
                                : 'bg-[#222] text-[#666]'
                            }`}
                          >
                            {step.completed ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                          </div>
                          <span
                            className={`text-xs font-semibold truncate ${
                              step.completed ? 'text-[#E5C378]' : 'text-[#888]'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#A69F90] block">{step.date}</span>
                        <p className="text-[11px] text-[#7A7467] mt-1 leading-tight">
                          {step.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Printable Luxury Invoice Block */}
          <div className="p-6 sm:p-8 bg-[#111111] border border-[#222] rounded-2xl space-y-6 shadow-xl print:bg-white print:text-black print:border-none">
            {/* Invoice Header */}
            <div className="flex items-center justify-between border-b border-[#222] pb-6">
              <BrandLogo size="md" />
              <div className="text-left">
                <h3 className="font-serif font-bold text-lg text-[#EDE8DC] print:text-black">
                  فاتورة شراء رسمية
                </h3>
                <span className="text-xs text-[#8A8275] block">
                  سجل تجاري وبطاقة ضريبية معتمدة
                </span>
                <span className="text-xs font-mono text-[#C5A059] block">
                  {currentOrder.id}
                </span>
              </div>
            </div>

            {/* Recipient & Shipping Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#A69F90] border-b border-[#222] pb-6">
              <div>
                <span className="text-[#C5A059] font-semibold block mb-1">بيانات العميل:</span>
                <p className="text-[#EDE8DC] font-bold text-sm">{currentOrder.customerName}</p>
                <p>هاتف المستلم: {currentOrder.customerPhone}</p>
                {currentOrder.customerEmail && <p>البريد: {currentOrder.customerEmail}</p>}
              </div>

              <div>
                <span className="text-[#C5A059] font-semibold block mb-1">عنوان الشحن في مصر:</span>
                <p className="text-[#EDE8DC] font-bold">
                  {currentOrder.governorate} — {currentOrder.city}
                </p>
                <p>{currentOrder.detailedAddress}</p>
                {currentOrder.notes && (
                  <p className="text-amber-400 mt-1">ملاحظة: {currentOrder.notes}</p>
                )}
              </div>
            </div>

            {/* Order Items Table */}
            <div>
              <table className="w-full text-xs text-right">
                <thead>
                  <tr className="border-b border-[#222] text-[#8A8275]">
                    <th className="py-2">العطر والمواصفات</th>
                    <th className="py-2 text-center">الكمية</th>
                    <th className="py-2 text-left">السعر</th>
                    <th className="py-2 text-left">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C1C1C]">
                  {currentOrder.items.map((item, i) => (
                    <tr key={i} className="text-[#EDE8DC]">
                      <td className="py-3">
                        <span className="font-semibold block">{item.productName}</span>
                        <span className="text-[10px] text-[#777]">{item.selectedSize}</span>
                      </td>
                      <td className="py-3 text-center tabular-nums">{item.quantity}</td>
                      <td className="py-3 text-left tabular-nums">
                        {item.unitPrice.toLocaleString('ar-EG')} ج.م
                      </td>
                      <td className="py-3 text-left tabular-nums font-bold text-[#E5C378]">
                        {item.totalPrice.toLocaleString('ar-EG')} ج.م
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="pt-4 border-t border-[#222] flex flex-col items-end space-y-1.5 text-xs text-[#8A8275]">
              {currentOrder.customerName && <div className="w-full max-w-xs flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="tabular-nums text-[#EDE8DC]">
                  {currentOrder.subtotal.toLocaleString('ar-EG')} ج.م
                </span>
              </div>}

              {currentOrder.discountAmount > 0 && (
                <div className="w-full max-w-xs flex justify-between text-emerald-400">
                  <span>الخصم المطبق ({currentOrder.couponCode || 'كوبون'}):</span>
                  <span className="tabular-nums">
                    - {currentOrder.discountAmount.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
              )}

              <div className="w-full max-w-xs flex justify-between">
                <span>مصاريف الشحن:</span>
                <span className="tabular-nums text-[#EDE8DC]">
                  {currentOrder.shippingFee === 0 ? 'مجاني' : `${currentOrder.shippingFee} ج.م`}
                </span>
              </div>

              <div className="w-full max-w-xs flex justify-between text-base font-bold text-[#FBF9F5] border-t border-[#222] pt-2 mt-2">
                <span>المبلغ الإجمالي المطلوب:</span>
                <span className="gold-gradient-text tabular-nums text-lg">
                  {currentOrder.totalAmount.toLocaleString('ar-EG')} ج.م
                </span>
              </div>

              <div className="w-full max-w-xs flex justify-between text-[11px] text-[#A69F90] pt-1">
                <span>طريقة الدفع:</span>
                <span className="font-semibold text-[#EDE8DC]">
                  {currentOrder.paymentMethod === 'cod' && 'الدفع نقداً عند الاستلام'}
                  {currentOrder.paymentMethod === 'card' && 'مدفوع إلكترونياً (بطاقة بنكية)'}
                  {currentOrder.paymentMethod === 'vodafone_cash' && 'فودافون كاش / إنستاباي'}
                  {currentOrder.paymentMethod === 'instapay' && 'إنستاباي مصر'}
                </span>
              </div>
            </div>

            {/* Direct WhatsApp Concierge Help Button */}
            <div className="p-4 bg-[#14120C] border border-[#C5A059]/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
              <div className="flex items-center gap-2 text-xs text-[#E5C378]">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>هل لديك أي استفسار حول موعد تسليم شحنتك؟</span>
              </div>
              <a
                href={`https://wa.me/201062003963?text=${encodeURIComponent(
                  `مرحباً دار حُرّ، أود الاستفسار عن طلبي رقم: ${currentOrder.id}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#25D366] hover:bg-[#1fb355] text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>تواصل مع الدعم عبر واتساب</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
