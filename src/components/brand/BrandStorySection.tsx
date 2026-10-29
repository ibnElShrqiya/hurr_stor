import React from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { Sparkles, Award, ShieldCheck, Heart, Feather } from 'lucide-react';

interface BrandStorySectionProps {
  onBackToStore?: () => void;
}

export const BrandStorySection: React.FC<BrandStorySectionProps> = ({ onBackToStore }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#0A0A0A] border-t border-b border-[#C5A059]/20 text-right relative overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-b from-[#C5A059]/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        {/* Brand Lockup & Calligraphy Emblem */}
        <div className="text-center space-y-4">
          <div className="inline-block mx-auto">
            <BrandLogo size="xl" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#FBF9F5] mt-4">
            قصة دار حُرّ.. حين تلتقي الأصالة الشرقية بروح العطر
          </h2>
          <p className="text-sm sm:text-base text-[#C5A059] max-w-2xl mx-auto font-light leading-relaxed">
            «حُرّ» ليست مجرد زجاجة عطر.. بل هي حكاية عطرية تستلهم الطيب والأصالة وحسن الاختيار
          </p>
        </div>

        {/* Story Narrative Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-6">
          <div className="space-y-4 text-sm sm:text-base text-[#BDB7A9] leading-relaxed font-light">
            <p>
              انطلقت دار <strong className="text-[#EDE8DC] font-serif font-bold">حُــرّ</strong> من قلب القاهرة، مهد الحضارات وعاصمة الذوق الرفيع، لتؤسس مفهوماً مغايراً لعطور النيش الشرقية الفاخرة. رأينا في أسواق العطور طوفاناً من الروائح المكررة والزيوت المخففة تجارياً، فقررنا أن نكون <strong className="text-[#E5C378]">«أحراراً»</strong> في فلسفتنا: لا مساومة على نقاء المكونات، ولا تهاون في مدة التعتيق.
            </p>

            <p>
              نستلهم مجموعاتنا من روائح العود والعنبر والمسك والورد، ونعتني بتناسق النفحات وتقديم وصف واضح لكل تركيبة، حتى يختار كل شخص ما يناسب ذوقه ومناسبته.
            </p>
          </div>

          <div className="p-6 sm:p-8 bg-[#12110F] border border-[#C5A059]/30 rounded-2xl space-y-6 shadow-xl">
            <h3 className="text-lg font-serif font-bold text-[#E5C378] flex items-center gap-2 border-b border-[#222] pb-3">
              <Award className="w-5 h-5 text-[#C5A059]" />
              <span>قيم حُرّ في صناعة العطر</span>
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#C5A059] mt-2 shrink-0" />
                <div>
                  <h4 className="font-bold text-[#EDE8DC]">عناية بالمكونات ووقت النضج</h4>
                  <p className="text-[#8A8275] mt-0.5 leading-relaxed">
                    تُترك زيوتنا لتنضج في بيئات معتمة ومضبوطة الحرارة لشهور طويلة لتكتسب قواماً مخملياً متماسكاً.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#C5A059] mt-2 shrink-0" />
                <div>
                  <h4 className="font-bold text-[#EDE8DC]">أعلى تركيز في عالم العطور</h4>
                  <p className="text-[#8A8275] mt-0.5 leading-relaxed">
                    نسبة تركيز زيتي تتراوح بين 30% إلى 40% (خلاصة عطرية Extrait de Parfum) لتركيبة متوازنة صُممت لتمنحك تجربة عطرية مميزة.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#C5A059] mt-2 shrink-0" />
                <div>
                  <h4 className="font-bold text-[#EDE8DC]">احترام ذوق العميل المصري</h4>
                  <p className="text-[#8A8275] mt-0.5 leading-relaxed">
                    نوفر عينة للتجربة مع بعض المنتجات وفق العرض المعلن، ونوضح شروط الاسترجاع قبل إتمام الطلب.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Poetic Verse / Closing */}
        <div className="p-8 bg-gradient-to-r from-[#12110D] via-[#1A1812] to-[#12110D] border border-[#C5A059]/40 rounded-2xl text-center space-y-3">
          <p className="text-lg sm:text-xl font-serif text-[#EDE8DC] italic leading-relaxed">
            «للطيب أثرٌ جميل، وللخلق الحسن أثرٌ أبقى»
          </p>
          <span className="text-xs text-[#C5A059] tracking-widest font-sans uppercase">
            دار حُرّ · طيبٌ يترك أثراً
          </span>
        </div>
      </div>
    </section>
  );
};
