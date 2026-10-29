import React, { useState } from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, Heart, Search, ShieldCheck, Sparkles, X, Sun, Moon } from 'lucide-react';
import { ProductCategory } from '../../types';

interface HeaderProps {
  onOpenTracking: () => void;
  onOpenHome: () => void;
  onOpenAdmin: () => void;
  onOpenBrandStory: () => void;
  onOpenFaq: () => void;
  isLightMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTracking,
  onOpenHome,
  onOpenAdmin,
  onOpenBrandStory,
  onOpenFaq,
  isLightMode,
  onToggleTheme,
}) => {
  const {
    cartCount,
    setIsCartOpen,
    wishlist,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    setIsQuizOpen,
    isAdminLoggedIn,
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks: { label: string; category: ProductCategory | 'all' | 'custom'; action?: () => void }[] = [
    { label: 'الرئيسية', category: 'all', action: onOpenHome },
    { label: 'عطور للجنسين', category: 'unisex' },
    { label: 'عطور رجالية', category: 'men' },
    { label: 'عطور نسائية', category: 'women' },
    { label: 'المجموعة المختارة', category: 'private_collection' },
    { label: 'عروض حصرية', category: 'offers' },
    { label: 'قصة حُرّ', category: 'custom', action: onOpenBrandStory },
    { label: 'تتبع الطلب', category: 'custom', action: onOpenTracking },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#C5A059]/20 transition-all">

      {/* 2. Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4-5 Nav Links) — Zone 3 (Action cluster) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-6 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveCategory('all');
              onOpenHome();
            }}
            className="flex items-center"
          >
            <BrandLogo size="md" />
          </a>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-[#C8C2B3]">
          {navLinks.map((item) => {
            const isActive = item.category === activeCategory;
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.action) {
                    if (item.category === 'all') setActiveCategory('all');
                    item.action();
                  } else if (item.category !== 'custom') {
                    setActiveCategory(item.category);
                    onOpenHome();
                    window.setTimeout(() => {
                      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 80);
                  }
                }}
                className={`relative py-1 transition-colors whitespace-nowrap shrink-0 hover:text-[#E5C378] ${
                  isActive ? 'text-[#E5C378] font-semibold' : ''
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-[#C5A059] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Functional Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            className="theme-nav-toggle inline-flex items-center justify-center gap-2 rounded-full border border-[#C5A059]/40 px-2.5 py-2 text-[#C5A059] transition-colors hover:bg-[#C5A059]/10 sm:px-3"
            aria-label={isLightMode ? 'تفعيل الوضع الداكن' : 'تفعيل الوضع الفاتح'}
            title={isLightMode ? 'الوضع الداكن' : 'الوضع الفاتح'}
          >
            {isLightMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span className="hidden sm:inline text-xs font-medium">{isLightMode ? 'الوضع الداكن' : 'الوضع الفاتح'}</span>
          </button>
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-[#C8C2B3] hover:text-[#C5A059] transition-colors rounded-full hover:bg-[#181818]"
            title="بحث في العطور"
            aria-label="بحث في العطور"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Scent Quiz Assistant Trigger */}
          <button
            onClick={() => setIsQuizOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#E5C378] bg-[#1A1813] hover:bg-[#25221B] border border-[#C5A059]/30 rounded-md transition-all whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>مستشار العطور</span>
          </button>

          {/* Wishlist count */}
          <button
            onClick={() => {
              const catalogEl = document.getElementById('catalog-section');
              if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
            }}
            className="relative p-2 text-[#C8C2B3] hover:text-[#C5A059] transition-colors rounded-full hover:bg-[#181818]"
            title="قائمة الرغبات"
            aria-label="قائمة الرغبات"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute 1 -top-0.5 -right-0.5 bg-[#C5A059] text-[#0A0A0A] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#E5C378] text-[#0A0A0A] font-semibold text-xs sm:text-sm rounded-lg transition-all shadow-[0_2px_12px_rgba(197,160,89,0.25)] whitespace-nowrap shrink-0 active:scale-95"
            aria-label="سلة الشراء"
          >
            <ShoppingBag className="w-4 h-4 text-[#0A0A0A]" />
            <span className="hidden sm:inline">السلة</span>
            <span className="w-5 h-5 rounded-full bg-[#0A0A0A] text-[#E5C378] text-[11px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          {/* Admin Dashboard Portal Link */}
          <a
            href="/admin"
            onClick={onOpenAdmin}
            className={`p-2 rounded-full transition-colors ${
              isAdminLoggedIn
                ? 'text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/40'
                : 'text-[#6A6458] hover:text-[#C5A059]'
            }`}
            title="لوحة الإدارة والمخزون"
            aria-label="لوحة تحكم المتجر"
          >
            <ShieldCheck className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Collapsible Search Bar Layer */}
      {isSearchOpen && (
        <div className="bg-[#121212] border-b border-[#C5A059]/20 px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <Search className="w-5 h-5 text-[#C5A059] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم العطر، المكونات، مثل: عود معتق، عنبر، مسك، فانيليا، جلد..."
              className="w-full bg-transparent border-0 text-[#EDE8DC] placeholder-[#767064] text-sm focus:outline-none focus:ring-0"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#767064] hover:text-[#EDE8DC]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => {
                setIsSearchOpen(false);
                const catalog = document.getElementById('catalog-section');
                if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs bg-[#C5A059] text-[#0A0A0A] font-semibold px-3 py-1.5 rounded"
            >
              عرض النتائج
            </button>
          </div>
        </div>
      )}

      {/* Mobile Category Quick Navigation Strip */}
      <div className="mobile-category-strip xl:hidden w-full min-w-0 overflow-x-auto no-scrollbar border-t border-[#1F1E1B] bg-[#0E0E0E] px-4 py-2 flex items-center gap-2">
        {navLinks.map((item) => {
          const isActive = item.category === activeCategory;
          return (
            <button
              key={`m-${item.label}`}
              aria-pressed={isActive}
              onClick={() => {
                if (item.action) {
                  if (item.category === 'all') setActiveCategory('all');
                  item.action();
                } else if (item.category !== 'custom') {
                  setActiveCategory(item.category);
                  onOpenHome();
                  window.setTimeout(() => {
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 80);
                }
              }}
              className={`px-3 py-1 text-xs rounded-full whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-[#C5A059] text-[#0A0A0A] font-semibold'
                  : 'text-[#A69F90] hover:text-[#EDE8DC] bg-[#161616]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
