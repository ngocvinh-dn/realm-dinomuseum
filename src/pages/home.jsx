import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/home/HeroSection';
import GeoTimeline from '../components/home/GeoTimeline';
import SpecimenShowcase from '../components/home/VisualsSection';
import LeadForm from '../components/home/LeadForm';
import FinalCTA from '../components/home/FinalCTA';
import Footer from '../components/home/Footer';
import AuthModal from '../components/auth/AuthModal';
import AmbientAudio from '../components/home/AmbientAudio';
import { useAuth } from '../context/AuthContext';

const sectionIds = ['hero', 'timeline', 'specimens', 'dang-ky'];

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('login');
  const [authInitialMessage, setAuthInitialMessage] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [locale, setLocale] = useState('vi');
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActiveSection(visible.target.id);
    }, { rootMargin: '-20% 0px -65% 0px', threshold: [0.15, 0.3, 0.5] });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shouldOpenLogin = params.get('auth') === 'login';
    const isConfirmed = params.get('confirmed') === '1';

    if (!shouldOpenLogin && !isConfirmed) return;

    let cancelled = false;

    const handleAuthRedirect = async () => {
      if (isConfirmed && user) {
        await signOut();
      }

      if (cancelled) return;

      setAuthInitialTab('login');
      setAuthInitialMessage(
        isConfirmed
          ? (locale === 'vi'
              ? 'Email đã được xác nhận. Vui lòng đăng nhập.'
              : 'Your email has been confirmed. Please sign in.')
          : ''
      );
      setAuthOpen(true);

      const nextParams = new URLSearchParams(location.search);
      nextParams.delete('auth');
      nextParams.delete('confirmed');

      navigate(
        {
          pathname: location.pathname,
          search: nextParams.toString() ? `?${nextParams.toString()}` : '',
        },
        { replace: true }
      );
    };

    handleAuthRedirect();

    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search, locale, navigate, signOut, user]);

  const toggleTheme = () => setDarkMode(prev => !prev);
  const toggleLocale = () => setLocale(prev => (prev === 'vi' ? 'en' : 'vi'));
  const enterMuseum = () => {
    navigate('/museum');
  };
  const openLoginModal = () => {
    setAuthInitialTab('login');
    setAuthInitialMessage('');
    setAuthOpen(true);
  };
  const closeAuthModal = () => {
    setAuthOpen(false);
    setAuthInitialMessage('');
  };

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
        darkMode={darkMode}
        onThemeToggle={toggleTheme}
        onSectionChange={setActiveSection}
        activeSection={activeSection}
      />
      <main>
        <HeroSection copy={copy[locale]} />
        <GeoTimeline locale={locale} copy={copy[locale]} />
        <SpecimenShowcase locale={locale} copy={copy[locale]} />
        <LeadForm locale={locale} copy={copy[locale]} onLoginClick={openLoginModal} />
        <FinalCTA locale={locale} copy={copy[locale]} onLoginClick={openLoginModal} />
      </main>
      <Footer locale={locale} copy={copy[locale]} />
    </div>
  );
};

export default Home;
