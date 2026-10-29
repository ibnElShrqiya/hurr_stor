import React from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { Phone, MessageCircle, MapPin, ShieldCheck, RefreshCw, Truck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenBrandStory: () => void;
  onOpenFaq: () => void;
  onOpenTracking: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBrandStory,
  onOpenFaq,
  onOpenTracking,
}) => {
  return (
    <footer className="bg-[#070707] text-[#C5BFB0] border-t border-[#C5A059]/20 pt-16 pb-12 overflow-hidden relative">
      {/* Subtle background ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Trust Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-14 border-b border-[#1E1E1E]">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#141414] border border-[#C5A059]/30 flex items-center justify-center shrink-0 text-[#C5A059]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#EDE8DC]">زيوت نقية 100%</h4>
              <p className="text-xs text-[#8A8275] mt-1 leading-relaxed">
                مستخلصة من أندر مصادر العود والعنبر الطبيعي بدون تخفيف
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#141414] border border-[#C5A059]/30 flex items-center justify-center shrink-0 text-[#C5A059]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#EDE8DC]">شحن لكافة محافظات مصر</h4>
              <p className="text-xs text-[#8A8275] mt-1 leading-relaxed">
                توصيل خلال 24-48 ساعة للقاهرة والجيزة وجميع أنحاء الجمهورية
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#141414] border border-[#C5A059]/30 flex items-center justify-center shrink-0 text-[#C5A059]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#EDE8DC]">الضمان الذهبي للتجربة</h4>
              <p className="text-xs text-[#8A8275] mt-1 leading-relaxed">
                عينة مجانية مع كل طلب للتجربة قبل فتح التغليف واسترجاع 14 يوماً
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#141414] border border-[#C5A059]/30 flex items-center justify-center shrink-0 text-[#C5A059]">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#EDE8DC]">الدفع عند الاستلام</h4>
              <p className="text-xs text-[#8A8275] mt-1 leading-relaxed">
                افحص العطر مع المندوب وادفع كاش أو عبر فودافون كاش وإنستاباي
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-14 border-b border-[#1E1E1E]">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" />
            <p className="text-sm text-[#9E9687] leading-relaxed max-w-sm mt-3">
              دار حُرّ للعطور الشرقية الأصيلة — تجسيد مصري للأصالة الأصيلة والروح العطرية.
              نبتكر خلطات استثنائية من دهن العود المعتق، العنبر النقي، والمسك المخملي لنمنحك حضوراً
              طاغياً يدوم أياماً.
            </p>

            {/* Official Contact Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="tel:+201062003963"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#141414] hover:bg-[#1C1C1C] border border-[#C5A059]/30 rounded-lg text-xs text-[#EDE8DC] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#C5A059]" />
                <span dir="ltr">01062003963</span>
              </a>

              <a
                href="https://wa.me/201062003963"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#141414] hover:bg-[#1C1C1C] border border-[#25D366]/40 hover:border-[#25D366] rounded-lg text-xs text-[#EDE8DC] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>واتساب المبيعات</span>
              </a>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#E5C378] font-semibold">
              المجموعات الأصيلة
            </h4>
            <ul className="space-y-2 text-sm text-[#9E9687]">
              <li>
                <a href="#catalog-section" className="hover:text-[#EDE8DC] transition-colors">
                  عطور العود
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-[#EDE8DC] transition-colors">
                  عطور العنبر والتوابل
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-[#EDE8DC] transition-colors">
                  عطور المسك والزهور
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-[#EDE8DC] transition-colors">
                  العطور الخشبية والجلدية
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-[#EDE8DC] transition-colors">
                  المجموعات والباقات
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#E5C378] font-semibold">
              خدمة العملاء
            </h4>
            <ul className="space-y-2 text-sm text-[#9E9687]">
              <li>
                <button
                  onClick={onOpenTracking}
                  className="hover:text-[#EDE8DC] transition-colors text-right"
                >
                  تتبع مسار شحنتك
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBrandStory}
                  className="hover:text-[#EDE8DC] transition-colors text-right"
                >
                  حكاية دار حُرّ والأصالة
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFaq}
                  className="hover:text-[#EDE8DC] transition-colors text-right"
                >
                  الأسئلة الشائعة
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFaq}
                  className="hover:text-[#EDE8DC] transition-colors text-right"
                >
                  سياسة الاستبدال والاسترجاع في مصر
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFaq}
                  className="hover:text-[#EDE8DC] transition-colors text-right"
                >
                  مناطق التوصيل ورسوم الشحن
                </button>
              </li>
            </ul>
          </div>

          {/* Social Channels & Headquarters */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#E5C378] font-semibold">
              تابع مجتمع حُرّ
            </h4>
            <p className="text-xs text-[#8A8275] leading-relaxed">
              شاهد كواليس تعتيق العود، تقييمات العملاء، والعروض الحصرية على حساباتنا الرسمية:
            </p>

            {/* Social Icons with exact requested links */}
            <div className="flex items-center gap-3 pt-1">
              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@hurr771"
                target="_blank"
                rel="noopener noreferrer"
                title="حساب تيك توك دار حُرّ"
                className="w-9 h-9 rounded-full bg-[#181818] hover:bg-[#000000] border border-[#333] hover:border-[#C5A059] flex items-center justify-center text-[#EDE8DC] hover:text-[#C5A059] transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=bx67p60"
                target="_blank"
                rel="noopener noreferrer"
                title="إنستغرام دار حُرّ"
                className="w-9 h-9 rounded-full bg-[#181818] hover:bg-[#E1306C]/20 border border-[#333] hover:border-[#E1306C] flex items-center justify-center text-[#EDE8DC] hover:text-[#E1306C] transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/hurrgg1"
                target="_blank"
                rel="noopener noreferrer"
                title="فيسبوك دار حُرّ"
                className="w-9 h-9 rounded-full bg-[#181818] hover:bg-[#1877F2]/20 border border-[#333] hover:border-[#1877F2] flex items-center justify-center text-[#EDE8DC] hover:text-[#1877F2] transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.889C10.5 0 9 1.583 9 4.667V8z" />
                </svg>
              </a>
            </div>

            <div className="pt-2 text-[11px] text-[#7A7467] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span>جمهورية مصر العربية · القاهرة الجديدة والتوصيل للجمهورية</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Payment Logos & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#6B6559]">
          <div className="flex items-center gap-2">
            <span>جميع الحقوق محفوظة © {new Date().getFullYear()}</span>
            <span className="text-[#C5A059] font-serif font-bold">دار حُرّ للعطور الفاخرة</span>
            <span>· HURR PARFUMS</span>
          </div>

          {/* Egyptian Payment Accepted Methods */}
          <div className="flex items-center gap-3 text-[11px] text-[#8C8474]">
            <span className="bg-[#141414] px-2 py-1 rounded border border-[#222]">الدفع عند الاستلام (COD)</span>
            <span className="bg-[#141414] px-2 py-1 rounded border border-[#222]">فودافون كاش & إنستاباي</span>
            <span className="bg-[#141414] px-2 py-1 rounded border border-[#222]">ميزة Meeza</span>
            <span className="bg-[#141414] px-2 py-1 rounded border border-[#222]">Visa / Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
