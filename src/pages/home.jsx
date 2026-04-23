import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Dino from '../components/home/Dino'; // Gọi đúng file Dino.jsx
import HeroSection from '../components/home/HeroSection';
import FeaturesList from '../components/home/FeaturesList';
import CallToAction from '../components/home/CallToAction';
import Footer from '../components/home/Footer';

const Home = () => {
  return (
    <div className="relative w-full bg-black text-white selection:bg-green-500 selection:text-black">
      {/* Background 3D cố định phía sau */}
      <div className="fixed top-0 left-0 w-full h-screen z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          {/* Suspense giúp React không bị crash trong lúc chờ file .glb tải lên */}
          <Suspense fallback={null}>
            <Dino />
          </Suspense>
        </Canvas>
      </div>

      {/* Nội dung HTML cuộn đè lên trên (Z-index cao hơn) */}
      <div className="relative z-10">
        <HeroSection />
        <FeaturesList />
        <CallToAction />
        <Footer />
      </div>
    </div>
  );
};

export default Home;