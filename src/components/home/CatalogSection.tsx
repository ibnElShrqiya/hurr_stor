import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import { ProductCategory } from '../../types';
import { Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';

export const CatalogSection: React.FC = () => {
  const {
    products,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    selectedFamily,
    setSelectedFamily,
    sortBy,
    setSortBy,
  } = useStore();

  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'كافة المجموعات الأصيلة' },
    { id: 'unisex', label: 'عطور للجنسين' },
    { id: 'men', label: 'عطور رجالية' },
    { id: 'women', label: 'عطور نسائية' },
    { id: 'private_collection', label: 'مجموعة النيش الخاص' },
    { id: 'offers', label: 'العروض الحصرية وباقات الطيب' },
  ];

  const families = [
    { id: 'all', label: 'كافة النوتات' },
    { id: 'oud', label: 'دهن العود المعتق' },
    { id: 'amber', label: 'العنبر والتوابل' },
    { id: 'musk', label: 'المسك والورد الطائفي' },
    { id: 'leather', label: 'الجلود والتبغ' },
    { id: 'oriental_floral', label: 'غورماند وزهور شرقية' },
  ];

  // Filter & Sort Logic
  const visibleProducts = products.filter((product) => product.status !== 'draft');
  const filteredProducts = visibleProducts.filter((product) => {
    // Category match
    const matchCategory =
      activeCategory === 'all' || product.category === activeCategory;

    // Scent Family match
    const matchFamily =
      selectedFamily === 'all' || product.scentFamily === selectedFamily;

    // Search query match
    const query = searchQuery.trim().toLowerCase();
    const matchQuery =
      !query ||
      product.nameAr.toLowerCase().includes(query) ||
      product.tagline.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.notes.top.some((n) => n.toLowerCase().includes(query)) ||
      product.notes.heart.some((n) => n.toLowerCase().includes(query)) ||
      product.notes.base.some((n) => n.toLowerCase().includes(query));

    return matchCategory && matchFamily && matchQuery;
  });

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    // 'featured' default
    return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
  });

  return (
    <section id="catalog-section" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 text-right space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#222] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#C5A059] mb-1">
            <Sparkles className="w-4 h-4" />
            <span>خزانة العطور الأصيلة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FBF9F5]">
            توليفات دار حُــــرّ الاستثنائية
          </h2>
        </div>

        {/* Product Count & Sort */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#8A8275]">
            عرض {sortedProducts.length} من {visibleProducts.length} عطور
          </span>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="p-2 bg-[#141414] border border-[#333] focus:border-[#C5A059] rounded-lg text-xs text-[#EDE8DC] focus:outline-none"
          >
            <option value="featured">الأكثر طلباً وتميزاً</option>
            <option value="price_asc">السعر: من الأقل للأعلى</option>
            <option value="price_desc">السعر: من الأعلى للأقل</option>
            <option value="rating">الأعلى تقييماً (★)</option>
          </select>
        </div>
      </div>

      {/* Category Tabs (Functional Segmented Control) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0A0A0A] shadow-md'
                  : 'bg-[#121212] text-[#A69F90] hover:text-[#EDE8DC] hover:bg-[#181818] border border-[#222]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Scent Family Sub-filters */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs text-[#8A8275] pt-1">
        <span className="text-[#A69F90] shrink-0 font-medium">العائلة الشمية:</span>
        {families.map((fam) => {
          const isSelected = selectedFamily === fam.id;
          return (
            <button
              key={fam.id}
              onClick={() => setSelectedFamily(fam.id)}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-[#222] text-[#E5C378] border border-[#C5A059]/50 font-bold'
                  : 'hover:text-[#EDE8DC]'
              }`}
            >
              {fam.label}
            </button>
          );
        })}

        {/* Reset button if filtered */}
        {(activeCategory !== 'all' || selectedFamily !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setActiveCategory('all');
              setSelectedFamily('all');
              setSearchQuery('');
            }}
            className="text-[11px] text-[#C5A059] hover:underline flex items-center gap-1 mr-auto shrink-0"
          >
            <RefreshCw className="w-3 h-3" />
            <span>إعادة ضبط التصفية</span>
          </button>
        )}
      </div>

      {/* Active Search Notification */}
      {searchQuery && (
        <div className="p-3 bg-[#16140F] border border-[#C5A059]/30 rounded-lg text-xs text-[#E5C378] flex items-center justify-between">
          <span>نتائج البحث عن: «{searchQuery}»</span>
          <button onClick={() => setSearchQuery('')} className="text-[#888] hover:text-white">
            مسح البحث
          </button>
        </div>
      )}

      {/* Products 3-Column Grid */}
      {sortedProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-[#111111] border border-[#222] rounded-2xl p-8">
          <p className="text-base font-serif font-bold text-[#EDE8DC]">
            {visibleProducts.length === 0 ? 'تُجهّز مجموعة حُرّ للإطلاق' : 'لم نجد عطراً يطابق بحثك الحالي'}
          </p>
          <p className="text-xs text-[#8A8275] max-w-sm mx-auto leading-6">
            {visibleProducts.length === 0
              ? 'ستظهر هنا المنتجات المعتمدة وأسعارها فور إضافتها من لوحة الإدارة. لا نعرض منتجات أو أسعارًا تجريبية.'
              : 'جرّب تعديل كلمات البحث أو إعادة ضبط عوامل التصفية.'}
          </p>
          {visibleProducts.length > 0 && <button
            onClick={() => { setActiveCategory('all'); setSelectedFamily('all'); setSearchQuery(''); }}
            className="px-5 py-2.5 bg-[#C5A059] text-[#0A0A0A] font-bold text-xs rounded-lg"
          >إعادة ضبط التصفية</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
