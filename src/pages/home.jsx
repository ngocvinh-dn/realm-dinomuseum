import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/home/HeroSection';
import GeoTimeline from '../components/home/GeoTimeline';
import SpecimenShowcase from '../components/home/VisualsSection';
import FossilExploreTeaser from '../components/home/FossilExploreTeaser';
import LeadForm from '../components/home/LeadForm';
import FinalCTA from '../components/home/FinalCTA';
import Footer from '../components/home/Footer';
import AuthModal from '../components/auth/AuthModal';
import AmbientAudio from '../components/home/AmbientAudio';
import { useAuth } from '../context/AuthContext';

const sectionIds = ['hero', 'timeline', 'specimens', 'explore-globe', 'dang-ky'];

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  // States
  const [authOpen, setAuthOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('login');
  const [authInitialMessage, setAuthInitialMessage] = useState('');
  const [locale, setLocale] = useState('vi');
  const [activeSection, setActiveSection] = useState('hero');
  const [isDarkMode, setDarkMode] = useState(true); // Thêm state này để tránh lỗi toggleTheme

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Observer để highlight Navbar
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveSection(visible.target.id);
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: [0.15, 0.3, 0.5] }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Xử lý Logic Auth từ URL (Confirmed email, v.v.)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shouldOpenLogin = params.get('auth') === 'login';
    const isConfirmed = params.get('confirmed') === '1';
    if (!shouldOpenLogin && !isConfirmed) return;

    let cancelled = false;
    const handleAuthRedirect = async () => {
      if (isConfirmed && user) await signOut();
      if (cancelled) return;
      
      setAuthInitialTab('login');
      setAuthInitialMessage(
        isConfirmed
          ? locale === 'vi'
            ? 'Email đã được xác nhận. Vui lòng đăng nhập.'
            : 'Your email has been confirmed. Please sign in.'
          : ''
      );
      setAuthOpen(true);
      
      const nextParams = new URLSearchParams(location.search);
      nextParams.delete('auth');
      nextParams.delete('confirmed');
      navigate(
        { pathname: location.pathname, search: nextParams.toString() ? `?${nextParams.toString()}` : '' },
        { replace: true }
      );
    };
    handleAuthRedirect();
    return () => { cancelled = true; };
  }, [location.pathname, location.search, locale, navigate, signOut, user]);

  // --- Functions (Đã dọn dẹp trùng lặp) ---
  const toggleLocale = () => setLocale(prev => (prev === 'vi' ? 'en' : 'vi'));
  
  const enterMuseum = () => navigate('/museum');
  
  const openLoginModal = () => {
    setAuthInitialTab('login');
    setAuthInitialMessage('');
    setAuthOpen(true);
  };
  
  const closeAuthModal = () => {
    setAuthOpen(false);
    setAuthInitialMessage('');
  };

  const toggleTheme = () => setDarkMode(prev => !prev);

  const copy = useMemo(() => ({
    vi: {
      heroOpen: 'Bảo tàng đang mở cửa',
      heroTitle: 'Bảo tàng khủng long',
      heroSubtitle: 'Kỷ nguyên tiền sử',
      heroExplore: 'Khám phá bảo tàng',
      bookTicket: 'Đặt vé miễn phí',
      galleries: 'Phòng trưng bày',
      timeline: 'Dòng thời gian',
      specimens: 'Hiện vật',
      ticket: 'Đăng ký vé',
    },
    en: {
      heroOpen: 'Museum is open',
      heroTitle: 'Dinosaur Museum',
      heroSubtitle: 'The Prehistoric Era',
      heroExplore: 'Explore the museum',
      bookTicket: 'Book a free ticket',
      galleries: 'Galleries',
      timeline: 'Timeline',
      specimens: 'Specimens',
      ticket: 'Book ticket',
    },
  }), []);

  return (
    <div className="relative w-full grain-overlay" style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)' }}>
      <AmbientAudio locale={locale} />
      
      <AuthModal
        isOpen={authOpen}
        onClose={closeAuthModal}
        onLoginSuccess={enterMuseum}
        initialTab={authInitialTab}
        initialMessage={authInitialMessage}
        locale={locale}
      />
      
      <Navbar
        locale={locale}
        copy={copy[locale]}
        onLocaleToggle={toggleLocale}
        onLoginClick={openLoginModal}
        onSectionChange={setActiveSection}
        activeSection={activeSection}
        onThemeToggle={toggleTheme} // Đã thêm prop này nếu Navbar có nút đổi theme
      />
      
      <main>
        <section id="hero"><HeroSection copy={copy[locale]} /></section>
        <section id="timeline"><GeoTimeline locale={locale} copy={copy[locale]} /></section>
        <section id="specimens"><SpecimenShowcase locale={locale} copy={copy[locale]} /></section>

        {/* Explore Globe CTA */}
        <section id="explore-globe">
           <FossilExploreTeaser locale={locale} />
        </section>

        <section id="dang-ky">
          <LeadForm locale={locale} copy={copy[locale]} onLoginClick={openLoginModal} />
        </section>
        
        <FinalCTA locale={locale} copy={copy[locale]} onLoginClick={openLoginModal} />
      </main>
      
      <Footer locale={locale} copy={copy[locale]} />
    </div>
  );
};

export default Home;