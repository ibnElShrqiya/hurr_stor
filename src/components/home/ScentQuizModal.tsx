import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BottleVisual } from '../common/BottleVisual';
import { X, Sparkles, Check, ArrowLeft, RefreshCw, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';

export const ScentQuizModal: React.FC = () => {
  const { isQuizOpen, setIsQuizOpen, products, addToCart, setQuickViewProduct } = useStore();
  const availableProducts = products.filter((product) => product.status !== 'draft');
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({
    family: '',
    occasion: '',
    intensity: '',
  });
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);

  if (!isQuizOpen) return null;
  if (availableProducts.length === 0) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setIsQuizOpen(false)}>
      <section dir="rtl" className="w-full max-w-md rounded-2xl border border-[#C5A059]/40 bg-[#0E0E0E] p-6 text-right shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <button onClick={() => setIsQuizOpen(false)} className="mb-4 rounded-lg border border-[#333] px-3 py-2 text-sm text-[#EDE8DC]">إغلاق</button>
        <h2 className="mb-3 text-xl font-bold text-[#E5C378]">مستشار عطور حُرّ</h2>
        <p className="text-sm leading-7 text-[#B0A99B]">ستصبح الاستشارة متاحة بعد نشر المنتجات المعتمدة في المتجر. لا نوصي بمنتج غير متوفر في الكتالوج.</p>
      </section>
    </div>
  );

  const handleSelectAnswer = (key: 'family' | 'occasion' | 'intensity', val: string) => {
    const updated = { ...answers, [key]: val };
    setAnswers(updated);

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate matching product
      let match = availableProducts[0];
      if (updated.family === 'oud') {
        match = availableProducts.find((p) => p.scentFamily === 'oud') || availableProducts[0];
      } else if (updated.family === 'amber') {
        match = availableProducts.find((p) => p.scentFamily === 'amber') || availableProducts[0];
      } else if (updated.family === 'musk') {
        match = availableProducts.find((p) => p.scentFamily === 'musk') || availableProducts[0];
      } else if (updated.family === 'leather') {
        match = availableProducts.find((p) => p.scentFamily === 'leather') || availableProducts[0];
      }
      setRecommendedProduct(match);
      setCurrentStep(4); // Result step
    }
  };

  const resetQuiz = () => {
    setCurrentStep(1);
    setAnswers({ family: '', occasion: '', intensity: '' });
    setRecommendedProduct(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={() => setIsQuizOpen(false)}
    >
      <div
        className="relative w-full max-w-xl bg-[#0E0E0E] border border-[#C5A059]/40 rounded-2xl p-6 sm:p-8 text-right shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsQuizOpen(false)}
          className="absolute top-4 left-4 p-2 text-[#777] hover:text-[#EDE8DC] rounded-full hover:bg-[#1A1A1A]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        {currentStep <= 3 && (
          <div className="flex items-center justify-between text-xs text-[#8A8275] mb-6 border-b border-[#222] pb-3">
            <div className="flex items-center gap-1.5 text-[#E5C378]">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span className="font-bold">مستشار العطور الأصيل لدار حُرّ</span>
            </div>
            <span>السؤال {currentStep} من 3</span>
          </div>
        )}

        {/* Question 1: Scent Family */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#FBF9F5]">
              ما هو الطابع العطري الذي يجذبك ويلامس ذوقك أكثر؟
            </h3>
            <p className="text-xs text-[#8A8275]">
              اختر النغمات التي تفضل أن تحيط بك وتعبر عن شخصيتك.
            </p>

            <div className="space-y-2.5 pt-2">
              {[
                {
                  id: 'oud',
                  title: 'العود المعتق والأخشاب الشرقية الثقيلة',
                  desc: 'رائحة شرقية متزنة من دهن العود والزعفران',
                },
                {
                  id: 'amber',
                  title: 'العنبر الدافئ والفانيليا والتوابل النبيلة',
                  desc: 'دفء شرقي ساحر، مريح وجذاب بلمسات القرفة والبلسم',
                },
                {
                  id: 'musk',
                  title: 'المسك الأبيض المخملي والورد الطائفي النقي',
                  desc: 'قمة النظافة الفارهة والنعومة والأناقة الهادئة',
                },
                {
                  id: 'leather',
                  title: 'الجلد الإيطالي المدخن والتبغ المعتق والباتشولي',
                  desc: 'حضور رجولي قوي، جاذبية حادة وثقة مطلقة',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectAnswer('family', opt.id)}
                  className="w-full p-4 text-right bg-[#141414] hover:bg-[#1A1916] border border-[#262626] hover:border-[#C5A059] rounded-xl transition-all duration-200 group"
                >
                  <span className="text-sm font-semibold text-[#EDE8DC] group-hover:text-[#E5C378] block">
                    {opt.title}
                  </span>
                  <span className="text-xs text-[#7A7467] block mt-1">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 2: Occasion */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#FBF9F5]">
              ما هي المناسبة الأساسية التي تبحث عن عطر لها؟
            </h3>
            <p className="text-xs text-[#8A8275]">
              يساعدنا هذا في اختيار التركيز ودرجة الفوحان الأنسب لبيئتك.
            </p>

            <div className="space-y-2.5 pt-2">
              {[
                {
                  id: 'events',
                  title: 'المناسبات الكبرى والاحتفالات الأصيلة والأعياد',
                  desc: 'تريد عطراً يلفت الأنظار فور دخولك ويترك بصمة لا تُنسى',
                },
                {
                  id: 'daily',
                  title: 'الاستخدام اليومي الفاخر وبيئة الأعمال واللقاءات الراقية',
                  desc: 'عطر متوازن يمنحك حضوراً هادئاً طوال اليوم',
                },
                {
                  id: 'evenings',
                  title: 'السهرات والأمسيات الخاصة والليالي الشتوية الحالمة',
                  desc: 'عبير حميمي، دافئ، جذاب ومغناطيسي يدوم طويلاً',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectAnswer('occasion', opt.id)}
                  className="w-full p-4 text-right bg-[#141414] hover:bg-[#1A1916] border border-[#262626] hover:border-[#C5A059] rounded-xl transition-all duration-200 group"
                >
                  <span className="text-sm font-semibold text-[#EDE8DC] group-hover:text-[#E5C378] block">
                    {opt.title}
                  </span>
                  <span className="text-xs text-[#7A7467] block mt-1">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 3: Longevity & Sillage preference */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#FBF9F5]">
              ما هو معيارك الأهم في ثبات وفوحان العطر؟
            </h3>
            <p className="text-xs text-[#8A8275]">
              كافة عطور دار حُرّ بتركيز عالي ونقي، ولكن بأطياف انتشار متعددة.
            </p>

            <div className="space-y-2.5 pt-2">
              {[
                {
                  id: 'monumental',
                  title: 'ثبات فاحم يتجاوز 36 ساعة وفوحان هائل',
                  desc: 'تريد أن تدوم الرائحة في المكان وثيابك لأيام متواصلة',
                },
                {
                  id: 'intimate',
                  title: 'فوحان ناعم ومخملي وثبات ثابت راقٍ',
                  desc: 'تفضل هالة أثيرية خاصة تشعر بها أنت ومن يقترب منك',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectAnswer('intensity', opt.id)}
                  className="w-full p-4 text-right bg-[#141414] hover:bg-[#1A1916] border border-[#262626] hover:border-[#C5A059] rounded-xl transition-all duration-200 group"
                >
                  <span className="text-sm font-semibold text-[#EDE8DC] group-hover:text-[#E5C378] block">
                    {opt.title}
                  </span>
                  <span className="text-xs text-[#7A7467] block mt-1">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Recommendation Result */}
        {currentStep === 4 && recommendedProduct && (
          <div className="space-y-6 text-center animate-in zoom-in-95 duration-300">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C5A059]/20 border border-[#C5A059]/40 rounded-full text-xs text-[#E5C378]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>العطر المتوافق تماماً مع بصمتك الأصيلة</span>
            </div>

            <div className="py-2 flex justify-center">
              <BottleVisual product={recommendedProduct} size="md" showAromaMist={true} />
            </div>

            <div>
              <h3 className="text-2xl font-serif font-bold text-[#FBF9F5]">
                {recommendedProduct.nameAr}
              </h3>
              <p className="text-xs text-[#C5A059] font-medium mt-1">
                {recommendedProduct.tagline}
              </p>
              <p className="text-xs text-[#9E9687] max-w-md mx-auto mt-2 leading-relaxed">
                {recommendedProduct.description}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <span className="text-xl font-bold text-[#EDE8DC] font-sans tabular-nums">
                {recommendedProduct.price.toLocaleString('ar-EG')} ج.م
              </span>
              <span className="text-xs text-[#8A8275]">
                (شحن مجاني + عينة مجانية للتجربة أولاً)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  addToCart(recommendedProduct, 1);
                  setIsQuizOpen(false);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0A0A0A] font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>إضافة هذا العطر لسلتك</span>
              </button>

              <button
                onClick={() => {
                  setIsQuizOpen(false);
                  setQuickViewProduct(recommendedProduct);
                }}
                className="w-full sm:w-auto px-5 py-3 bg-[#181818] hover:bg-[#222] text-[#EDE8DC] border border-[#333] text-xs font-semibold rounded-lg"
              >
                عرض كامل التفاصيل
              </button>

              <button
                onClick={resetQuiz}
                className="p-3 text-[#777] hover:text-[#EDE8DC]"
                title="إعادة الاختبار"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
