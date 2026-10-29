import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  // Official Egypt WhatsApp link for HURR: 01062003963
  const whatsappUrl = `https://wa.me/201062003963?text=${encodeURIComponent(
    'مرحباً دار حُرّ للعطور الشرقية الأصيلة، أود الاستفسار عن المجموعات المتاحة وطلب استشارة عطرية أصيلة.'
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل عبر واتساب دار حُرّ"
      className="fixed bottom-6 left-6 z-40 group flex items-center gap-3 bg-[#0E0E0E]/95 hover:bg-[#161616] border border-[#C5A059]/40 hover:border-[#C5A059] p-2.5 sm:px-4 sm:py-3 rounded-full shadow-[0_12px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(37,211,102,0.25)] backdrop-blur-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1"
    >
      <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-[#25D366] to-[#128C7E] text-white shadow-md transform group-hover:scale-115 group-hover:rotate-6 transition-transform duration-300 ease-out">
        {/* Gentle pulsating glow ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none duration-1000" />
        <MessageCircle className="w-5 h-5 fill-current relative z-10" />
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#C5A059] rounded-full border-2 border-[#111111] z-20 animate-pulse" />
      </div>

      <div className="hidden sm:flex flex-col text-right">
        <span className="text-[11px] text-[#A69F90] leading-none">مستشار العطور الأصيل</span>
        <span className="text-xs font-semibold text-[#EDE8DC] group-hover:text-[#C5A059] transition-colors mt-0.5">
          اطلب عبر واتساب 01062003963
        </span>
      </div>
    </a>
  );
};
