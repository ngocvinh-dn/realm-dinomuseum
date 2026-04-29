import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/home/HeroSection';
import GalleriesPreview from '../components/home/FeaturesList';
import GeoTimeline from '../components/home/GeoTimeline';
import SpecimenShowcase from '../components/home/VisualsSection';
import VirtualTourPreview from '../components/home/VirtualTourPreview';
import LeadForm from '../components/home/LeadForm';
import FinalCTA from '../components/home/FinalCTA';
import Footer from '../components/home/Footer';
import AuthModal from '../components/auth/AuthModal';
import AmbientAudio from '../components/home/AmbientAudio';

const sectionIds = ['hero', 'galleries', 'timeline', 'specimens', 'virtual-tour', 'dang-ky'];

const Home = () => {
  const [authOpen, setAuthOpen] = useState(false);
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

  const toggleTheme = () => setDarkMode(prev => !prev);
  const toggleLocale = () => setLocale(prev => (prev === 'vi' ? 'en' : 'vi'));

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
      virtualTour: 'Tour ảo',
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
      virtualTour: 'Virtual Tour',
      ticket: 'Book ticket',
    },
  }), []);

  return (
    <div className="relative w-full grain-overlay" style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)' }}>
      <AmbientAudio locale={locale} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} locale={locale} />
      <Navbar
        locale={locale}
        copy={copy[locale]}
        onLocaleToggle={toggleLocale}
        onLoginClick={() => setAuthOpen(true)}
        darkMode={darkMode}
        onThemeToggle={toggleTheme}
        onSectionChange={setActiveSection}
        activeSection={activeSection}
      />
      <main>
        <HeroSection copy={copy[locale]} />
        <GalleriesPreview copy={copy[locale]} />
        <GeoTimeline locale={locale} copy={copy[locale]} />
        <SpecimenShowcase locale={locale} copy={copy[locale]} />
        <VirtualTourPreview locale={locale} copy={copy[locale]} />
        <LeadForm locale={locale} copy={copy[locale]} onLoginClick={() => setAuthOpen(true)} />
        <FinalCTA locale={locale} copy={copy[locale]} onLoginClick={() => setAuthOpen(true)} />
      </main>
      <Footer locale={locale} copy={copy[locale]} />
    </div>
  );
};

export default Home;