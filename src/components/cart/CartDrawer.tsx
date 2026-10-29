import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BottleVisual } from '../common/BottleVisual';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowLeft,
  Sparkles,
  Tag,
  Truck,
  CheckCircle,
} from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD } from '../../data/governorates';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    isFreeShipping,
    freeShippingProgress,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    selectedGovernorate,
    showToast,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (res.success) {
      showToast(res.message, 'success');
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-start animate-in fade-in duration-200"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="w-full max-w-md bg-[#0D0D0D] border-r border-[#C5A059]/30 h-full flex flex-col justify-between text-right shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#222] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
            <h3 className="text-base font-serif font-bold text-[#EDE8DC]">سلة مشترياتك</h3>
            <span className="text-xs text-[#8A8275]">({cart.length} أصناف)</span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="إغلاق السلة"
            className="p-1.5 text-[#8A8275] hover:text-[#EDE8DC] rounded-full hover:bg-[#1A1A1A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#14120C] border-b border-[#C5A059]/20 px-4 py-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5 text-[#E5C378]">
              <Truck className="w-3.5 h-3.5" />
              <span>
                {isFreeShipping
                  ? 'تهانينا! حصلت على شحن مجاني لكافة محافظات مصر'
                  : `أضف بقيمة ${remainingForFreeShipping.toLocaleString('ar-EG')} ج.م للشحن المجاني`}
              </span>
            </div>
            <span className="text-[11px] text-[#A69F90] tabular-nums">{freeShippingProgress}%</span>
          </div>
          {/* Progress track */}
          <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C5A059] to-[#D4AF37] transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#181818] border border-[#333] flex items-center justify-center text-[#777]">
                <ShoppingBag className="w-8 h-8 text-[#C5A059]/50" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-[#EDE8DC]">سلتك فارغة حالياً</h4>
                <p className="text-xs text-[#8A8275] max-w-xs leading-relaxed">
                  استكشف أندر خلطات العود والعنبر والمسك في مجموعات دار حُرّ واختر بصمتك العطرية.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  const el = document.getElementById('catalog-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 bg-[#C5A059] text-[#0A0A0A] font-bold text-xs rounded-lg hover:bg-[#D4AF37] transition-colors"
              >
                تصفح العطور الآن
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.productId}-${item.selectedSize}`}
                className="p-3 bg-[#131313] border border-[#222] rounded-xl flex items-center gap-3 relative group"
              >
                {/* Visual Thumbnail */}
                <div className="w-16 h-20 bg-[#1A1A1A] rounded-lg border border-[#333] flex items-center justify-center shrink-0 overflow-hidden">
                  <BottleVisual product={item.product} size="sm" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-serif font-bold text-[#EDE8DC] truncate">
                    {item.product.nameAr}
                  </h4>
                  <span className="text-[10px] text-[#8C8475] block mt-0.5">{item.selectedSize}</span>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-bold text-[#E5C378] tabular-nums">
                      {(item.product.price * item.quantity).toLocaleString('ar-EG')} ج.م
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center bg-[#1A1A1A] border border-[#333] rounded-md overflow-hidden">
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-[#B0A99B] hover:bg-[#252525]"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-semibold text-[#EDE8DC] tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-[#B0A99B] hover:bg-[#252525]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.productId)}
                  aria-label="حذف من السلة"
                  className="p-1 text-[#666] hover:text-red-400 self-start"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer & Order Summary */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#222] bg-[#111111] space-y-4">
            {/* Coupon Application Box */}
            <div>
              {activeCoupon ? (
                <div className="p-2.5 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#E5C378]">
                    <Tag className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="font-bold">{activeCoupon.code}</span>
                    <span className="text-[11px] text-[#A69F90]">({activeCoupon.description})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[11px] text-red-400 hover:underline"
                  >
                    إلغاء
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="كوبون الخصم (جرب HURR10 أو WELCOME200)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 p-2 bg-[#181818] border border-[#333] rounded-lg text-xs text-[#EDE8DC] placeholder-[#666] focus:outline-none focus:border-[#C5A059]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-[#222] hover:bg-[#C5A059] text-[#EDE8DC] hover:text-[#0A0A0A] border border-[#444] text-xs font-semibold rounded-lg transition-colors"
                    >
                      تطبيق
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-400">{couponError}</p>}
                </form>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-[#8A8275] border-t border-[#1C1C1C] pt-3">
              <div className="flex justify-between">
                <span>قيمة المنتجات:</span>
                <span className="font-sans tabular-nums text-[#EDE8DC]">
                  {subtotal.toLocaleString('ar-EG')} ج.م
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>الخصم المطبق:</span>
                  <span className="font-sans tabular-nums">
                    - {discountAmount.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>الشحن إلى ({selectedGovernorate.nameAr}):</span>
                <span className="font-sans tabular-nums text-[#EDE8DC]">
                  {isFreeShipping ? (
                    <span className="text-[#C5A059] font-bold">مجاني</span>
                  ) : (
                    `${shippingFee} ج.م`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm font-bold text-[#FBF9F5] border-t border-[#222] pt-2 mt-2">
                <span>الإجمالي النهائي:</span>
                <span className="gold-gradient-text font-sans tabular-nums text-base">
                  {totalAmount.toLocaleString('ar-EG')} ج.م
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#E5C378] hover:from-[#D4AF37] hover:to-[#FFF3D1] text-[#0A0A0A] font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>متابعة إتمام الطلب</span>
              <ArrowLeft className="w-4 h-4 text-[#0A0A0A]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
