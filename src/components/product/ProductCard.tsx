import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { BottleVisual } from '../common/BottleVisual';
import { ShoppingBag, Eye, Heart, Sparkles, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useStore();
  const inWishlist = isInWishlist(product.id);

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <article className="group relative bg-[#121212] border border-[#222222] hover:border-[#C5A059]/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.8)] flex flex-col justify-between">
      {/* Visual Container */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[4/3] bg-gradient-to-b from-[#181818] to-[#0E0E0E] p-2 sm:p-4 flex items-center justify-center overflow-hidden">
        {/* Wishlist Floating Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label="إضافة لقائمة الرغبات"
          className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-[#0A0A0A]/70 backdrop-blur-md border border-[#333] hover:border-[#C5A059] flex items-center justify-center text-[#C5BFB0] hover:text-[#C5A059] transition-all"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-[#C5A059] text-[#C5A059]' : ''}`} />
        </button>

        {/* Status Indicators (Discipline: Quiet text / Subtle single tag) */}
        {product.discountPercentage && (
          <div className="absolute top-3 right-3 z-10 text-[10px] font-semibold text-[#D4AF37] bg-[#0A0A0A]/80 border border-[#C5A059]/40 px-2 py-0.5 rounded backdrop-blur-md">
            خصم {product.discountPercentage}%
          </div>
        )}

        {/* Flacon Render */}
        <div className="relative z-0 transform group-hover:scale-105 transition-transform duration-500">
          <BottleVisual product={product} size="md" />
        </div>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <button
            onClick={() => setQuickViewProduct(product)}
            className="px-4 py-2 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-[#EDE8DC] border border-[#C5A059]/60 text-xs font-semibold rounded-lg shadow-lg flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>نظرة سريعة</span>
          </button>
        </div>
      </div>

      {/* Card Body & Unboxed Metadata */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3 text-right">
        <div>
          {/* Unboxed Metadata Line with typographic separators */}
          <div className="flex items-center justify-start gap-1.5 text-xs text-[#8A8275]">
            <span>{product.scentFamilyAr}</span>
            <span aria-hidden="true">·</span>
            <span>{product.volume}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#C5A059]">{product.rating} ★</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => setQuickViewProduct(product)}
            className="text-base sm:text-lg font-serif font-bold text-[#FBF9F5] hover:text-[#C5A059] cursor-pointer transition-colors mt-1"
          >
            {product.nameAr}
          </h3>

          {/* Short Tagline */}
          <p className="text-xs text-[#9E9687] line-clamp-2 mt-1 leading-relaxed font-light">
            {product.tagline}
          </p>
        </div>

        {/* Scent Top Notes Preview */}
        <div className="pt-1 flex flex-wrap gap-1 text-[11px] text-[#A69F90]">
          <span className="text-[#C5A059]/90 font-medium">النفحات:</span>
          <span>{product.notes.top.slice(0, 2).join('، ')}</span>
        </div>

        {/* Stock status urgency */}
        {isLowStock && (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-medium pt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>متبقي في المخزن {product.stock} قطع فقط!</span>
          </div>
        )}

        {isOutOfStock && (
          <div className="text-[11px] text-red-400 font-medium pt-0.5">
            نفد من المخزن مؤقتاً
          </div>
        )}

        {/* Pricing & Purchase CTA */}
        <div className="pt-2 sm:pt-3 border-t border-[#1F1E1B] flex items-center justify-between gap-2">
          {/* Price */}
          <div className="text-right">
            <div className="text-base sm:text-lg font-bold text-[#EDE8DC] tabular-nums">
              {product.price.toLocaleString('ar-EG')} <span className="text-xs font-normal text-[#C5A059]">ج.م</span>
            </div>
            {product.originalPrice && (
              <span className="text-xs text-[#6B6559] line-through block tabular-nums">
                {product.originalPrice.toLocaleString('ar-EG')} ج.م
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              isOutOfStock
                ? 'bg-[#222] text-[#666] cursor-not-allowed'
                : 'bg-[#1C1A16] hover:bg-[#C5A059] text-[#E5C378] hover:text-[#0A0A0A] border border-[#C5A059]/40 hover:border-[#C5A059] shadow-sm active:scale-95'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'نفد' : 'أضف للسلة'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
