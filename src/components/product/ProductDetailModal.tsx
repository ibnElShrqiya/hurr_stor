import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { BottleVisual } from '../common/BottleVisual';
import {
  X,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  Droplets,
  Star,
  CheckCircle,
  Clock,
  Sparkles,
  Share2,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onInstantCheckout: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onInstantCheckout,
}) => {
  const { addToCart, toggleWishlist, isInWishlist, selectedGovernorate, showToast } = useStore();
  const [selectedSize, setSelectedSize] = useState(product.volume);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'notes' | 'reviews'>('details');

  // New review form state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewCity, setReviewCity] = useState(selectedGovernorate.nameAr);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
  };

  const handleInstantBuy = () => {
    addToCart(product, quantity, selectedSize);
    onClose();
    onInstantCheckout();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `HURR | ${product.nameAr}`,
          text: product.tagline,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('تم نسخ رابط العطر للمشاركة بنجاح', 'success');
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) {
      showToast('يرجى ملء جميع حقول التقييم', 'warning');
      return;
    }
    showToast('شكراً لك! تم إرسال تقييمك وسيظهر بعد المراجعة', 'success');
    setReviewAuthor('');
    setReviewComment('');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#0E0E0E] border border-[#C5A059]/40 rounded-2xl overflow-hidden shadow-2xl text-right my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="إغلاق تفاصيل العطر"
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-[#181818] border border-[#333] hover:border-[#C5A059] flex items-center justify-center text-[#EDE8DC] hover:text-[#C5A059] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Visual Showcase (5 cols on md) */}
          <div className="md:col-span-5 bg-gradient-to-b from-[#181714] via-[#12110F] to-[#0A0A0A] p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-l border-[#222] relative">
            <div className="relative py-8 transform transition-transform">
              <BottleVisual product={product} size="lg" showAromaMist={true} />
            </div>

            {/* Quick trust strip under bottle */}
            <div className="w-full bg-[#121212]/90 border border-[#C5A059]/20 rounded-xl p-3 space-y-1.5 text-center mt-4">
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#E5C378]">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span className="font-semibold">وعد حُرّ لتجربة مطمئنة</span>
              </div>
              <p className="text-[11px] text-[#8C8475] leading-relaxed">
                عينة مجانية 3 مل مرفقة مع كل زجاجة. جرّب العينة أولاً، وإذا لم يناسبك العطر يمكنك
                استرجاعه مجاناً واسترداد كامل المبلغ.
              </p>
            </div>
          </div>

          {/* Details & Purchasing Column (7 cols on md) */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category, Concentration & Ratings */}
              <div className="flex items-center justify-between text-xs text-[#8A8275]">
                <div className="flex items-center gap-2">
                  <span>{product.scentFamilyAr}</span>
                  <span>·</span>
                  <span className="text-[#C5A059]">{product.concentration}</span>
                </div>
                <div className="flex items-center gap-1 text-[#E5C378]">
                  <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-[#777]">({product.reviewsCount} تقييم)</span>
                </div>
              </div>

              {/* Title & Tagline */}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FBF9F5] mt-2">
                {product.nameAr}
              </h2>
              <p className="text-sm text-[#C5A059] mt-1 font-medium">{product.tagline}</p>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-2xl sm:text-3xl font-bold text-[#EDE8DC] tabular-nums">
                  {product.price.toLocaleString('ar-EG')}{' '}
                  <span className="text-sm text-[#C5A059] font-normal">جنيه مصري</span>
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#6B6559] line-through tabular-nums">
                    {product.originalPrice.toLocaleString('ar-EG')} ج.م
                  </span>
                )}
                {product.discountPercentage && (
                  <span className="text-xs bg-[#C5A059]/15 text-[#E5C378] border border-[#C5A059]/30 px-2 py-0.5 rounded font-semibold">
                    وفر {product.discountPercentage}%
                  </span>
                )}
              </div>

              {/* Stock Indicator */}
              <div className="mt-2 text-xs">
                {product.stock > 0 ? (
                  <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>متوفر في المخزن الرئيسي بالقاهرة ({product.stock} قطع متاحة)</span>
                  </span>
                ) : (
                  <span className="text-red-400">نفد المخزون حالياً</span>
                )}
              </div>

              {/* Navigation Tabs inside modal */}
              <div className="flex items-center gap-2 border-b border-[#222] mt-6 pb-2 text-xs font-medium">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-1 px-1 transition-colors ${
                    activeTab === 'details'
                      ? 'text-[#E5C378] border-b-2 border-[#C5A059] font-bold'
                      : 'text-[#8A8275] hover:text-[#EDE8DC]'
                  }`}
                >
                  عن العطر والقصة
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`pb-1 px-1 transition-colors ${
                    activeTab === 'notes'
                      ? 'text-[#E5C378] border-b-2 border-[#C5A059] font-bold'
                      : 'text-[#8A8275] hover:text-[#EDE8DC]'
                  }`}
                >
                  الهرم العطري والنفحات
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-1 px-1 transition-colors ${
                    activeTab === 'reviews'
                      ? 'text-[#E5C378] border-b-2 border-[#C5A059] font-bold'
                      : 'text-[#8A8275] hover:text-[#EDE8DC]'
                  }`}
                >
                  آراء العملاء في مصر ({product.reviews?.length || 0})
                </button>
              </div>

              {/* Tab 1: Details & Story */}
              {activeTab === 'details' && (
                <div className="space-y-4 pt-4 text-xs sm:text-sm text-[#B0A99B] leading-relaxed">
                  <p>{product.description}</p>
                  <div className="p-3 bg-[#141414] rounded-lg border border-[#222] text-xs">
                    <span className="text-[#C5A059] font-semibold block mb-1">حكاية العطر:</span>
                    <p className="text-[#8C8475]">{product.story}</p>
                  </div>

                  {/* Sillage & Longevity Specs */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-2.5 bg-[#121212] border border-[#222] rounded-lg">
                      <span className="text-[11px] text-[#777] block">الثبات على الملابس:</span>
                      <span className="text-xs font-semibold text-[#EDE8DC]">{product.longevity}</span>
                    </div>
                    <div className="p-2.5 bg-[#121212] border border-[#222] rounded-lg">
                      <span className="text-[11px] text-[#777] block">درجة الفوحان:</span>
                      <span className="text-xs font-semibold text-[#EDE8DC]">{product.sillage}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Scent Notes Pyramid */}
              {activeTab === 'notes' && (
                <div className="space-y-4 pt-4">
                  {/* Top Notes */}
                  <div className="p-3 bg-[#141414] border border-[#222] rounded-lg">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#E5C378] mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>افتتاحية العطر (Top Notes):</span>
                    </div>
                    <p className="text-xs text-[#CDC7B9] leading-relaxed">
                      {product.notes.top.join(' · ')}
                    </p>
                  </div>

                  {/* Heart Notes */}
                  <div className="p-3 bg-[#141414] border border-[#222] rounded-lg">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#E5C378] mb-1.5">
                      <Droplets className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>قلب العطر (Heart Notes):</span>
                    </div>
                    <p className="text-xs text-[#CDC7B9] leading-relaxed">
                      {product.notes.heart.join(' · ')}
                    </p>
                  </div>

                  {/* Base Notes */}
                  <div className="p-3 bg-[#141414] border border-[#222] rounded-lg">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#E5C378] mb-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>قاعدة العطر العميقة (Base Notes):</span>
                    </div>
                    <p className="text-xs text-[#CDC7B9] leading-relaxed">
                      {product.notes.base.join(' · ')}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 3: Customer Reviews */}
              {activeTab === 'reviews' && (
                <div className="space-y-4 pt-4">
                  {/* Reviews List */}
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                      {product.reviews.map((rev) => (
                        <div key={rev.id} className="p-3 bg-[#141414] border border-[#222] rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#EDE8DC]">{rev.author}</span>
                            <span className="text-[10px] text-[#777]">{rev.city} · {rev.date}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[#D4AF37] text-xs my-1">
                            {'★'.repeat(rev.rating)}
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] text-emerald-400 mr-2 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> مشترٍ موثوق
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#9E9687] leading-relaxed">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#777]">كن أول من يكتب تقييماً لهذا العطر!</p>
                  )}

                  {/* Add Review Quick Form */}
                  <form onSubmit={handleAddReview} className="p-3 bg-[#121212] border border-[#222] rounded-lg space-y-2">
                    <span className="text-xs font-semibold text-[#E5C378] block">شاركنا رأيك في العطر:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="الاسم الكريم"
                        value={reviewAuthor}
                        onChange={(e) => setReviewAuthor(e.target.value)}
                        className="p-2 bg-[#1A1A1A] border border-[#333] rounded text-xs text-[#EDE8DC] focus:outline-none focus:border-[#C5A059]"
                      />
                      <input
                        type="text"
                        placeholder="المدينة / المحافظة"
                        value={reviewCity}
                        onChange={(e) => setReviewCity(e.target.value)}
                        className="p-2 bg-[#1A1A1A] border border-[#333] rounded text-xs text-[#EDE8DC] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                    <textarea
                      placeholder="كيف كانت تجربتك مع ثبات وفوحان العطر والتغليف؟"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={2}
                      className="w-full p-2 bg-[#1A1A1A] border border-[#333] rounded text-xs text-[#EDE8DC] focus:outline-none focus:border-[#C5A059]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#C5A059] text-[#0A0A0A] font-bold text-xs rounded hover:bg-[#D4AF37] transition-colors"
                    >
                      إرسال التقييم
                    </button>
                  </form>
                </div>
              )}

              {/* Delivery Timeline info for Egypt */}
              <div className="mt-5 p-3 bg-[#111111] border border-[#222] rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#A69F90]">
                  <Truck className="w-4 h-4 text-[#C5A059]" />
                  <span>
                    التوصيل إلى <strong className="text-[#EDE8DC]">{selectedGovernorate.nameAr}</strong>:{' '}
                    {selectedGovernorate.estimatedDelivery}
                  </span>
                </div>
                <span className="text-[#C5A059] font-medium font-sans">
                  {selectedGovernorate.fee} ج.م
                </span>
              </div>
            </div>

            {/* Action Bar (Contiguous Purchase Module) */}
            <div className="pt-4 border-t border-[#1F1E1B] space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center bg-[#181818] border border-[#333] rounded-lg overflow-hidden shrink-0">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-10 flex items-center justify-center text-sm text-[#EDE8DC] hover:bg-[#252525]"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#EDE8DC] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="w-8 h-10 flex items-center justify-center text-sm text-[#EDE8DC] hover:bg-[#252525]"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 py-3 bg-[#181818] hover:bg-[#222] text-[#EDE8DC] border border-[#C5A059]/60 hover:border-[#C5A059] font-semibold text-xs sm:text-sm rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                  <span>إضافة إلى سلة الشراء</span>
                </button>

                {/* Instant Buy (Fast Track Checkout) */}
                <button
                  onClick={handleInstantBuy}
                  disabled={isOutOfStock}
                  className="flex-1 py-3 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#E5C378] text-[#0A0A0A] font-bold text-xs sm:text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>شراء فوري</span>
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="قائمة الرغبات"
                  className="p-3 bg-[#181818] hover:bg-[#222] border border-[#333] rounded-lg text-[#EDE8DC] hover:text-[#C5A059]"
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-[#C5A059] text-[#C5A059]' : ''}`} />
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  aria-label="مشاركة العطر"
                  className="p-3 bg-[#181818] hover:bg-[#222] border border-[#333] rounded-lg text-[#EDE8DC] hover:text-[#C5A059]"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
