import React from 'react';
import { motion } from 'framer-motion';

// Component CTA cuối trang — thông điệp mạnh mẽ thúc đẩy đăng ký
const FinalCTA = ({ onLoginClick }) => {

  // Smooth scroll to ticket form (Lenis-aware)
  const scrollToTicket = () => {
    const t = document.querySelector('#dang-ky');
    if (t) window.__lenis ? window.__lenis.scrollTo(t, { offset: -80, duration: 1.4 }) : t.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="section-pad relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--theme-bg-alt) 0%, var(--theme-bg) 100%)' }}
    >
      {/* Các chum sáng dọc hai bên và ánh sáng ambient giữa */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-px h-full opacity-10"
          style={{ background: 'linear-gradient(to bottom, transparent, #f59e0b, transparent)' }} />
        <div className="absolute top-0 right-1/4 w-px h-full opacity-10"
          style={{ background: 'linear-gradient(to bottom, transparent, #f59e0b, transparent)' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, transparent 70%)' }} />
      </div>

      {/* Nội dung chính */}
      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Khẩu hiệu phía trên tiêu đề */}
          <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: 'rgba(245,158,11,0.6)' }}>
            One Museum. Infinite Discovery.
          </p>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight mb-8"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            The Giant Skeleton
            <br />
            <span className="text-gradient-gold">Is Waiting For You</span>
            <br />
            In The Dark.
          </h2>

          {/* Nút CTA lớn — đặt vé vào bảo tàng */}
          <motion.button
            onClick={scrollToTicket}
            id="final-cta-btn"
            className="btn-amber-primary text-base px-12 py-5"
            style={{ fontSize: '1rem' }}
            whileHover={{ scale: 1.06, boxShadow: '0 12px 40px rgba(245,158,11,0.5), 0 0 80px rgba(245,158,11,0.2)' }}
            whileTap={{ scale: 0.97 }}
            animate={{ boxShadow: ['0 4px 20px rgba(245,158,11,0.35)', '0 8px 40px rgba(245,158,11,0.55)', '0 4px 20px rgba(245,158,11,0.35)'] }}
            transition={{ boxShadow: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' } }}
          >
            🏗️ Enter the Museum — It's Free
          </motion.button>

          {/* Các điểm đảm bảo phía dưới nút */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            {[
              '✓ No VR headset required',
              '✓ No payment needed',
              '✓ Completely secure',
              '✓ Instant tour link',
            ].map((item, i) => (
              <span key={i} className="text-xs" style={{ color: 'var(--theme-text-dim)' }}>
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
