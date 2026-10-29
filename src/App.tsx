import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { CatalogSection } from './components/home/CatalogSection';
import { BrandStorySection } from './components/brand/BrandStorySection';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderTrackingPage } from './components/tracking/OrderTrackingPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ScentQuizModal } from './components/home/ScentQuizModal';
import { FaqPolicyModal } from './components/info/FaqPolicyModal';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { ToastContainer } from './components/common/ToastContainer';
import { Order } from './types';

type AppView = 'store' | 'checkout' | 'tracking' | 'admin' | 'brand_story';

function MainApp() {
  const [currentView, setCurrentView] = useState<AppView>(() =>
    window.location.pathname.replace(/\/$/, '') === '/admin' ? 'admin' : 'store',
  );
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [faqTab, setFaqTab] = useState<'faq' | 'shipping' | 'returns'>('faq');
  const [isLightMode, setIsLightMode] = useState(() =>
    window.localStorage.getItem('hurr-theme') !== 'dark',
  );

  const { quickViewProduct, setQuickViewProduct } = useStore();

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  useEffect(() => {
    window.localStorage.setItem('hurr-theme', isLightMode ? 'light' : 'dark');
  }, [isLightMode]);

  useEffect(() => {
    const syncRoute = () => {
      const path = window.location.pathname.replace(/\/$/, '');
      setCurrentView(path === '/admin' ? 'admin' : 'store');
    };
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, []);

  const openAdmin = (event?: React.MouseEvent<HTMLAnchorElement>) => {
    event?.preventDefault();
    if (window.location.pathname.replace(/\/$/, '') !== '/admin') {
      window.history.pushState({}, '', '/admin');
    }
    setCurrentView('admin');
  };


  const handleOrderCompleted = (order: Order) => {
    setActiveTrackingOrder(order);
    setCurrentView('tracking');
  };

  const handleOpenFaqWithTab = (tab: 'faq' | 'shipping' | 'returns') => {
    setFaqTab(tab);
    setIsFaqOpen(true);
  };

  return (
    <div className={`hurr-app min-h-screen flex flex-col selection:bg-[#C5A059] selection:text-[#0A0A0A] ${currentView === 'admin' ? 'admin-shell bg-[#080808] text-[#EDE8DC]' : isLightMode ? 'light-mode justify-between' : 'bg-[#080808] text-[#EDE8DC] justify-between'}`}>
      {/* The admin is a standalone workspace: no storefront/customer navigation. */}
      {currentView !== 'admin' && (
        <Header
          onOpenTracking={() => setCurrentView('tracking')}
          onOpenHome={() => {
            setCurrentView('store');
            window.history.pushState({}, '', '/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAdmin={openAdmin}
          onOpenBrandStory={() => setCurrentView('brand_story')}
          onOpenFaq={() => handleOpenFaqWithTab('faq')}
          isLightMode={isLightMode}
          onToggleTheme={() => setIsLightMode((value) => !value)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'store' && (
          <>
            <HeroSection />
            <CatalogSection />
            <BrandStorySection />
          </>
        )}

        {currentView === 'brand_story' && (
          <div className="py-8">
            <BrandStorySection />
          </div>
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onBackToStore={() => setCurrentView('store')}
            onOrderCompleted={handleOrderCompleted}
          />
        )}

        {currentView === 'tracking' && (
          <OrderTrackingPage
            initialOrder={activeTrackingOrder}
            onBackToStore={() => {
              setActiveTrackingOrder(null);
              setCurrentView('store');
            }}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {currentView !== 'admin' && <Footer
        onOpenBrandStory={() => setCurrentView('brand_story')}
        onOpenFaq={() => handleOpenFaqWithTab('faq')}
        onOpenTracking={() => setCurrentView('tracking')}
      />}

      {/* Storefront overlays must never appear inside the admin workspace. */}
      {currentView !== 'admin' && quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onInstantCheckout={() => {
            setQuickViewProduct(null);
            setCurrentView('checkout');
          }}
        />
      )}

      {/* 2. Slide-over Shopping Cart Drawer */}
      {currentView !== 'admin' && <CartDrawer onProceedToCheckout={() => setCurrentView('checkout')} />}
      {currentView !== 'admin' && <ScentQuizModal />}
      {currentView !== 'admin' && <FaqPolicyModal isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} defaultTab={faqTab} />}
      {currentView !== 'admin' && <FloatingWhatsApp />}
      <ToastContainer />
    </div>
  );
}

class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) { console.error('[HUR runtime] Application render failed:', error); }
  render() {
    if (this.state.hasError) return (
      <main dir="rtl" className="min-h-screen flex items-center justify-center bg-[#f7f4ec] text-[#28251f] p-6">
        <section className="max-w-lg w-full text-center rounded-2xl border border-[#d6b66a] bg-white p-8 shadow-xl">
          <h1 className="text-2xl font-bold mb-3">تعذر تحميل الصفحة</h1>
          <p className="text-sm leading-7 mb-5">حدث خطأ أثناء تشغيل الموقع. حدّث الصفحة، وإذا استمرت المشكلة تواصل مع إدارة الموقع.</p>
          <button className="rounded-lg bg-[#c5a059] px-5 py-3 font-bold" onClick={() => window.location.reload()}>إعادة تحميل الصفحة</button>
        </section>
      </main>
    );
    return this.props.children;
  }
}

export default function App() {
  return <AppErrorBoundary><StoreProvider><MainApp /></StoreProvider></AppErrorBoundary>;
}
