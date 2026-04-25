import React from 'react';
import { motion } from 'framer-motion';

const FinalCTA = ({ onLoginClick }) => {

  return (
    <section
      className="section-pad relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #110e08 0%, #1a1208 100%)' }}
    >
      {/* fossil lines */}
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
            Lần cuối cùng
          </p>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Một thế giới
            <br />
            <span className="text-gradient-gold">66 triệu năm</span>
            <br />
            đang chờ bạn.
          </h2>
          {/* <p className="text-base mb-12 max-w-lg mx-auto" style={{ color: 'rgba(245,240,232,0.5)', lineHeight: '1.8' }}>
            Tài liệu tiếng Việt duy nhất về cổ sinh vật học ở mức độ chuyên sâu này.
            Miễn phí. Tải về ngay. Không có điều kiện.
          </p>                                   */}

          {/* CTA button - large */}
          <motion.button
            onClick={onLoginClick}
            id="final-cta-btn"
            className="btn-amber-primary text-base px-12 py-5"
            style={{ fontSize: '1rem' }}
            whileHover={{ scale: 1.06, boxShadow: '0 12px 40px rgba(245,158,11,0.5), 0 0 80px rgba(245,158,11,0.2)' }}
            whileTap={{ scale: 0.97 }}
            animate={{ boxShadow: ['0 4px 20px rgba(245,158,11,0.35)', '0 8px 40px rgba(245,158,11,0.55)', '0 4px 20px rgba(245,158,11,0.35)'] }}
            transition={{ boxShadow: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' } }}
          >
            🦕 Khám Phá Thế Giới Khủng Long
          </motion.button>

          {/* Reassurance */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            {['✓ Không cần thẻ tín dụng', '✓ Tải về vĩnh viễn', '✓ Bảo mật tuyệt đối'].map((item, i) => (
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
