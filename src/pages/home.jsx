import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/home/HeroSection';
import GalleriesPreview from '../components/home/FeaturesList';
import GeoTimeline from '../components/home/GeoTimeline';
import SpecimenShowcase from '../components/home/VisualsSection';
import VirtualTourPreview from '../components/home/VirtualTourPreview';
import SocialProof from '../components/home/SocialProof';
import LeadForm from '../components/home/LeadForm';
import CallToAction from '../components/home/CallToAction';
import FinalCTA from '../components/home/FinalCTA';
import Footer from '../components/home/Footer';
import AuthModal from '../components/auth/AuthModal';
import AmbientAudio from '../components/home/AmbientAudio';

const Home = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Áp dụng theme vào thẻ <html> khi người dùng toggle
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Toggle giữa chế độ sáng và tối
  const toggleTheme = () => setDarkMode(prev => !prev);

  return (
    <div
      className="relative w-full grain-overlay"
      style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)' }}
    >
      {/* Nhạc nền động của bảo tàng */}
      <AmbientAudio />

      {/* Modal đăng nhập / đăng ký */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Thanh điều hướng */}
      <Navbar
        onLoginClick={() => setAuthOpen(true)}
        darkMode={darkMode}
        onThemeToggle={toggleTheme}
      />

      {/* Các section nội dung chính */}
      <main>
        {/* 1. Cửa Vào Bảo Tàng */}
        <HeroSection />

        {/* 2. Phòng Trưng Bày */}
        <GalleriesPreview />

        {/* 3. Dòng Thời Gian Địa Chất */}
        <GeoTimeline />

        {/* 4. Hiện Vật Nổi Bật */}
        <SpecimenShowcase />

        {/* 5. Preview Tour Ảo */}
        <VirtualTourPreview />

        {/* 6. Đánh giá từ khách tham quan */}
        <SocialProof />

        {/* 7. Đăng Ký Vé Tham Quan */}
        <LeadForm onLoginClick={() => setAuthOpen(true)} />

        {/* 8. CTA giữa trang */}
        <CallToAction onLoginClick={() => setAuthOpen(true)} />

        {/* 9. CTA cuối trang */}
        <FinalCTA onLoginClick={() => setAuthOpen(true)} />
      </main>

      <Footer />
    </div>
  );
};

export default Home;