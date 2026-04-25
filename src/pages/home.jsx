import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/home/HeroSection';
import GalleriesPreview from '../components/home/FeaturesList';
import GeoTimeline from '../components/home/GeoTimeline';
import SpecimenShowcase from '../components/home/VisualsSection';
import VirtualTourPreview from '../components/home/VirtualTourPreview';
import SocialProof from '../components/home/SocialProof';
import LeadForm from '../components/home/LeadForm';
import MuseumMap from '../components/home/MuseumMap';
import CallToAction from '../components/home/CallToAction';
import FinalCTA from '../components/home/FinalCTA';
import Footer from '../components/home/Footer';
import AuthModal from '../components/auth/AuthModal';

const Home = () => {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="relative w-full grain-overlay" style={{ background: '#0a0804', color: '#f5f0e8' }}>
      {/* Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Navbar */}
      <Navbar onLoginClick={() => setAuthOpen(true)} />

      {/* Page sections */}
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

        {/* 6. Social Proof */}
        <SocialProof />

        {/* 7. Đăng Ký Vé Tham Quan */}
        <LeadForm />

        {/* 8. Sơ Đồ Bảo Tàng */}
        <MuseumMap />

        {/* 9. Mid CTA */}
        <CallToAction onLoginClick={() => setAuthOpen(true)} />

        {/* 10. Final CTA */}
        <FinalCTA onLoginClick={() => setAuthOpen(true)} />
      </main>

      <Footer />
    </div>
  );
};

export default Home;