import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/home/HeroSection';
import BenefitsSection from '../components/home/FeaturesList';
import VisualsSection from '../components/home/VisualsSection';
import SocialProof from '../components/home/SocialProof';
import LeadForm from '../components/home/LeadForm';
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
        <HeroSection />
        <BenefitsSection />
        <VisualsSection />
        <SocialProof />
        <LeadForm />
        <CallToAction onLoginClick={() => setAuthOpen(true)} />
        <FinalCTA onLoginClick={() => setAuthOpen(true)} />
      </main>

      <Footer />
    </div>
  );
};

export default Home;