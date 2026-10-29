import React from 'react';
import { useStore } from '../../context/StoreContext';
import { BottleVisual } from '../common/BottleVisual';
import { Sparkles, ArrowDown, Award, ShieldCheck, Flame, Droplets } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { products, setIsQuizOpen, setActiveCategory } = useStore();
  const visibleProducts = products.filter((p) => p.status !== 'draft');
  const heroProduct = visibleProducts.find((p) => p.isFeatured || p.isBestseller) || visibleProducts[0];

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full bg-[#080808] border-b border-[#C5A059]/20 overflow-hidden pt-4 pb-7 sm:pt-6 sm:pb-12 lg:py-16">
      {/* Background Decorative Atmospheric Effects */}
      <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-gradient-to-b from-[#C5A059]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-amber-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* 2-Column Split Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-center">
          {/* Text Column (7 cols on lg) */}
          <div className="min-w-0 lg:col-span-7 space-y-4 sm:space-y-6 text-right">
            {/* Quiet Editorial Kicker with Calligraphy Accent */}
            <div className="inline-flex max-w-full flex-wrap items-center gap-2 text-xs text-[#C5A059] font-medium tracking-wide">
              <span className="w-6 h-[1px] bg-[#C5A059]" />
              <span>حكاية الطيب والأصالة من حُرّ للعطور في مصر</span>
              <span className="w-2 h-2 rotate-45 border border-[#C5A059] inline-block" />
            </div>

            {/* Display Headline with balanced typography */}
            <h1 className="max-w-full break-words text-[1.7rem] sm:text-5xl lg:text-6xl font-serif font-bold text-[#FBF9F5] leading-[1.25] tracking-tight [text-wrap:balance]">
              طيبٌ من روح الشرق.. <br />
              <span className="gold-gradient-text">أثرٌ طيب يبقى في الذاكرة</span>
            </h1>

            {/* Prose description */}
            <p className="max-w-full text-sm sm:text-lg text-[#B0A99B] leading-relaxed max-w-2xl font-light">
              من وحي العود والعنبر والمسك، نصوغ توليفات عطرية بروح شرقية واهتمام بالتفاصيل،
              ونحرص على وضوح المكونات وجودة التجربة، لترافقك رائحة تعبّر عن ذوقك وتترك أثراً طيباً.
            </p>

            {/* Interactive Scent Feature Highlight */}
            <div className="w-full min-w-0 p-4 bg-[#121212]/80 border border-[#C5A059]/30 rounded-xl flex items-center justify-between gap-4 max-w-xl backdrop-blur-sm">
              <div className="flex min-w-0 items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center text-[#E5C378] shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-[#EDE8DC]">وعد حُرّ بالجودة</h4>
                  <p className="text-xs text-[#8A8275]">
                    نوضح مواصفات كل منتج وشروط الطلب قبل إتمام الشراء
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={scrollToCatalog}
                className="px-6 py-3.5 bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#E5C378] hover:from-[#D4AF37] hover:to-[#FFF3D1] text-[#0A0A0A] font-bold text-sm rounded-lg shadow-[0_4px_20px_rgba(197,160,89,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
              >
                <span>اكتشف مجموعة حُرّ</span>
                <ArrowDown className="w-4 h-4 text-[#0A0A0A]" />
              </button>

              <button
                onClick={() => setIsQuizOpen(true)}
                className="px-5 py-3.5 bg-[#141414] hover:bg-[#1E1E1E] text-[#EDE8DC] hover:text-[#C5A059] border border-[#C5A059]/40 hover:border-[#C5A059] font-medium text-sm rounded-lg transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>دليل اختيار العطر (اكتشف ما يناسبك)</span>
              </button>
            </div>
          </div>

          {/* Product showcase renders only when a real catalog item exists. */}
          <div className="min-w-0 lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-[280px] sm:max-w-md aspect-square rounded-2xl sm:rounded-2xl bg-gradient-to-b from-[#161513] via-[#101010] to-[#0A0A0A] border border-[#C5A059]/25 p-3 sm:p-6 flex flex-col items-center justify-center shadow-2xl overflow-hidden">
              <div className="absolute inset-3 border border-[#C5A059]/15 rounded-xl pointer-events-none" />
              {heroProduct ? (
                <>
                  <div className="absolute top-6 right-6 z-20 flex items-center gap-1.5 px-3 py-1 bg-[#C5A059]/20 border border-[#C5A059]/50 rounded-full text-[11px] font-semibold text-[#E5C378]">
                    <Award className="w-3.5 h-3.5" />
                    <span>من مجموعة حُرّ</span>
                  </div>
                  <div className="relative z-10 py-2 sm:py-4"><BottleVisual product={heroProduct} size="md" showAromaMist={true} /></div>
                  <div className="relative z-20 w-full bg-[#111111]/90 border border-[#C5A059]/30 rounded-lg p-3 text-center mt-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-right min-w-0">
                        <span className="text-xs text-[#C5A059] font-semibold block">{heroProduct.nameAr}</span>
                        <span className="text-[11px] text-[#8C8475]">{heroProduct.concentration || heroProduct.volume}</span>
                      </div>
                      <div className="text-left shrink-0">
                        <span className="text-sm font-bold text-[#EDE8DC] font-sans tabular-nums">{heroProduct.price.toLocaleString('ar-EG')} ج.م</span>
                        {heroProduct.originalPrice && <span className="text-[10px] text-[#6E6759] line-through block tabular-nums">{heroProduct.originalPrice.toLocaleString('ar-EG')} ج.م</span>}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="relative z-10 text-center space-y-5 px-4">
                  <div className="mx-auto w-24 h-32 rounded-[2rem_2rem_1.2rem_1.2rem] border border-[#C5A059]/50 bg-gradient-to-b from-[#3b3321] via-[#17140e] to-[#090909] shadow-[0_0_55px_rgba(197,160,89,0.14)] flex items-center justify-center">
                    <span className="font-serif text-3xl text-[#D4AF37]">حُرّ</span>
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#E5C378]">مجموعة حُرّ</h2>
                  <p className="text-sm text-[#A69F90] leading-7">نعمل على تجهيز المنتجات المعتمدة. ستظهر التفاصيل والأسعار هنا عند نشرها من لوحة الإدارة.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4-Column KPI Trust Bar below the hero split */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 sm:mt-12 pt-5 sm:pt-8 border-t border-[#1C1C1C]">
          <div className="p-4 bg-[#101010] border border-[#222] rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#8A8275] block">اختيار واعٍ</span>
              <span className="text-sm font-bold text-[#EDE8DC]">تفاصيل المنتج المعتمد</span>
            </div>
          </div>

          <div className="p-4 bg-[#101010] border border-[#222] rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#8A8275] block">مواصفات العطر</span>
              <span className="text-sm font-bold text-[#EDE8DC]">تفاصيل واضحة لكل منتج</span>
            </div>
          </div>

          <div className="p-4 bg-[#101010] border border-[#222] rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#8A8275] block">خيارات التوصيل</span>
              <span className="text-sm font-bold text-[#EDE8DC]">تُحدد عند تأكيد الطلب</span>
            </div>
          </div>

          <div className="p-4 bg-[#101010] border border-[#222] rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#8A8275] block">تجربة شراء واضحة</span>
              <span className="text-sm font-bold text-[#EDE8DC]">تقييمات موثقة بعد الشراء</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
