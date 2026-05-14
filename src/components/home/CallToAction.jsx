import React from 'react';
import { motion } from 'framer-motion';

// Component CTA giữa trang — kêu gọi người dùng đặt vé tham quan
const CallToAction = ({ onLoginClick }) => {

  // Smooth scroll to ticket booking form (Lenis-aware)
  const scrollToTicket = () => {
    const t = document.querySelector('#dang-ky');
    if (t) window.__lenis ? window.__lenis.scrollTo(t, { offset: -80, duration: 1.4 }) : t.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="section-pad relative overflow-hidden text-center"
      style={{ background: 'var(--theme-bg)' }}
    >
      {/* Ánh sáng ambient mờ chính giữa */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(245,158,11,0.05) 0%, transparent 65%)' }} />

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-5xl mb-6">🏛️</div>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-5"
            style={{ fontFamily: 'var(--font-heading)' }}>
            The Museum Doors
            <br />
            <span className="text-gradient-amber italic">Are Open For You.</span>
          </h2>
          <p className="text-base mb-10 max-w-xl mx-auto" style={{ color: 'var(--theme-text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
            Over 12,000 visitors have already stepped into this virtual dinosaur world.
            Now it’s your turn to explore 66 million years of history.
          </p>

          <motion.button
            onClick={scrollToTicket}
            id="mid-cta-btn"
            className="btn-amber-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            🎟️ Book a Free Ticket
          </motion.button>

          {/* Đường kẻ trang trí với tên bảo tàng ở giữa */}
          <div className="mt-16 flex items-center gap-6">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.2))' }} />
          <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(245,158,11,0.4)' }}>✦ Dinosaur Museum ✦</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(245,158,11,0.2))' }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;