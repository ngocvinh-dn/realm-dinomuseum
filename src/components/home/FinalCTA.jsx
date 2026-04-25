import React from 'react';
import { motion } from 'framer-motion';

const FinalCTA = ({ onLoginClick }) => {

  const scrollToTicket = () => {
    document.querySelector('#dang-ky')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="section-pad relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #110e08 0%, #1a1208 100%)' }}
    >
      {/* Vertical light beams */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-px h-full opacity-10"
          style={{ background: 'linear-gradient(to bottom, transparent, #f59e0b, transparent)' }} />
        <div className="absolute top-0 right-1/4 w-px h-full opacity-10"
          style={{ background: 'linear-gradient(to bottom, transparent, #f59e0b, transparent)' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, transparent 70%)' }} />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Big headline */}
          <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: 'rgba(245,158,11,0.6)' }}>
            Một Bảo Tàng. Vô Hạn Khám Phá.
          </p>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight mb-8"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Bộ Xương Khổng Lồ
            <br />
            <span className="text-gradient-gold">Đang Chờ Bạn</span>
            <br />
            Trong Bóng Tối.
          </h2>

          {/* CTA button - large */}
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
            🏛️ Vào Bảo Tàng Ngay — Miễn Phí
          </motion.button>

          {/* Reassurance */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            {[
              '✓ Không cần VR headset',
              '✓ Không thanh toán',
              '✓ Bảo mật tuyệt đối',
              '✓ Link tour ngay lập tức',
            ].map((item, i) => (
              <span key={i} className="text-xs" style={{ color: 'rgba(245,240,232,0.4)' }}>
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
