import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * SmoothScroll component — wraps the entire app with Lenis smooth scrolling.
 * Lenis provides butter-smooth inertia scrolling with customizable easing.
 * Integrates with Framer Motion's requestAnimationFrame loop for perfect sync.
 */
const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll instance
    const lenis = new Lenis({
      duration: 1.4,           // Scroll animation duration in seconds
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo easing — fast start, gradual stop
      smoothWheel: true,       // Enable smooth wheel scrolling
      wheelMultiplier: 0.9,    // Wheel sensitivity (< 1 = slower, > 1 = faster)
      touchMultiplier: 1.5,    // Touch scroll sensitivity
      infinite: false,         // No infinite scroll
    });

    lenisRef.current = lenis;

    // Expose lenis to window for navbar anchor clicks
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    // Animation loop — runs every frame to update Lenis scroll position
    let animFrameId;
    function raf(time) {
      lenis.raf(time);
      animFrameId = requestAnimationFrame(raf);
    }
    animFrameId = requestAnimationFrame(raf);

    // Intercept anchor link clicks for smooth scroll to sections
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"], button[data-scroll-to]');
      if (!anchor) return;

      const href = anchor.getAttribute('href') || anchor.getAttribute('data-scroll-to');
      if (!href || !href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(target, {
        offset: -80,       // Offset for fixed navbar height
        duration: 2.2,     // Slower scroll so section titles and ScrollFloat animations have time to read.
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
    };

    document.addEventListener('click', handleAnchorClick, { passive: false });

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animFrameId);
      document.removeEventListener('click', handleAnchorClick);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return children;
};

export default SmoothScroll;
