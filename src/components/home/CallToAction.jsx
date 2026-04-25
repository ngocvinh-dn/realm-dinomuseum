import React from 'react';
import { motion } from 'framer-motion';

const CallToAction = ({ onLoginClick }) => {

  const scrollToTicket = () => {
    document.querySelector('#dang-ky')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="section-pad relative overflow-hidden text-center"
      style={{ background: '#0a0804' }}
    >
      {/* Ambient */}
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
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Cánh Cửa Bảo Tàng
            <br />
            <span className="text-gradient-amber italic">Đang Mở Chờ Bạn.</span>
          </h2>
          <p className="text-base mb-10 max-w-xl mx-auto" style={{ color: 'rgba(245,240,232,0.55)', fontFamily: 'Lora, serif', fontStyle: 'italic' }}>
            Hơn 12,000 khách tham quan đã bước vào thế giới khủng long ảo này.
            Đến lượt bạn khám phá 66 triệu năm lịch sử.
          </p>

          <motion.button
            onClick={scrollToTicket}
            id="mid-cta-btn"
            className="btn-amber-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            🎟️ Đặt Vé Tham Quan Miễn Phí
          </motion.button>

          {/* Divider */}
          <div className="mt-16 flex items-center gap-6">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.2))' }} />
            <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(245,158,11,0.4)' }}>✦ Bảo Tàng Khủng Long ✦</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(245,158,11,0.2))' }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;