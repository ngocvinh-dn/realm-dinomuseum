import React, { useState } from 'react';
import { motion } from 'framer-motion';

const tourViews = [
  {
    id: 'main-hall',
    title: 'Sảnh Chính',
    desc: 'Không gian trung tâm với bộ xương T-Rex khổng lồ, trần vòm cao và ánh đèn spotlight ấn tượng.',
    emoji: '🏛️',
    bgColor: 'linear-gradient(135deg, rgba(17,14,8,1) 0%, rgba(26,18,8,0.9) 100%)',
    highlight: 'Không gian: 800 m²',
  },
  {
    id: 'theropoda',
    title: 'Phòng Theropoda',
    desc: 'Hành lang dành riêng cho những kẻ săn mồi: Velociraptor, Allosaurus, Spinosaurus.',
    emoji: '🦖',
    bgColor: 'linear-gradient(135deg, rgba(30,10,10,0.9) 0%, rgba(17,14,8,1) 100%)',
    highlight: '48 hiện vật',
  },
  {
    id: 'fossil-vn',
    title: 'Phòng Hóa Thạch VN',
    desc: 'Khám phá những phát hiện ngay trên đất Việt Nam — răng khủng long, dấu chân và hóa thạch thực vật.',
    emoji: '🇻🇳',
    bgColor: 'linear-gradient(135deg, rgba(10,20,10,0.9) 0%, rgba(17,14,8,1) 100%)',
    highlight: '23 hiện vật nội địa',
  },
];

const VirtualTourPreview = () => {
  const [activeView, setActiveView] = useState(null);

  const scrollToTicket = () => {
    document.querySelector('#dang-ky')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="virtual-tour"
      className="section-pad relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #110e08 0%, #0a0804 100%)' }}
    >
      {/* Ambient top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-divider mx-auto" style={{ margin: '0 auto 1.5rem' }} />
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#f59e0b' }}>
            Preview Tour Ảo
          </p>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Bắt Đầu{' '}
            <span className="text-gradient-amber">Hành Trình</span>
          </h2>
          <p
            className="mt-4 max-w-lg mx-auto text-sm leading-relaxed"
            style={{ color: 'rgba(245,240,232,0.5)', fontFamily: 'Lora, serif', fontStyle: 'italic' }}
          >
            Xem trước 3 góc nhìn trong bảo tàng. Đăng ký vé để khám phá toàn bộ.
          </p>
        </motion.div>

        {/* Tour frames */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {tourViews.map((view, i) => (
            <motion.div
              key={view.id}
              className="tour-frame cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              onMouseEnter={() => setActiveView(view.id)}
              onMouseLeave={() => setActiveView(null)}
              onClick={scrollToTicket}
            >
              {/* Visual area */}
              <div
                className="h-52 relative"
                style={{ background: view.bgColor }}
              >
                {/* Scanlines overlay for screen effect */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, transparent 1px, transparent 3px)',
                  }}
                />
                {/* Corner dots */}
                {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, j) => (
                  <div
                    key={j}
                    className={`absolute ${pos} w-2 h-2 rounded-full`}
                    style={{ background: 'rgba(245,158,11,0.5)' }}
                  />
                ))}
                {/* Corner brackets */}
                <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: 'rgba(245,158,11,0.6)' }} />
                <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: 'rgba(245,158,11,0.6)' }} />
                <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: 'rgba(245,158,11,0.6)' }} />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: 'rgba(245,158,11,0.6)' }} />

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl opacity-25">{view.emoji}</span>
                  {/* Spotlight glow */}
                  <div
                    className="absolute w-32 h-32 rounded-full"
                    style={{
                      background: 'radial-gradient(ellipse, rgba(245,158,11,0.12) 0%, transparent 70%)',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                </div>

                {/* Play overlay */}
                <div className="play-overlay">
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(245,158,11,0.9)',
                      boxShadow: '0 0 30px rgba(245,158,11,0.5)',
                    }}
                    animate={{ scale: activeView === view.id ? [1, 1.1, 1] : 1 }}
                    transition={{ repeat: activeView === view.id ? Infinity : 0, duration: 1.5 }}
                  >
                    <span className="text-2xl ml-1">▶</span>
                  </motion.div>
                </div>

                {/* HUD label */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-4 py-3"
                  style={{ background: 'linear-gradient(to top, rgba(10,8,4,0.9), transparent)' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: '#fbbf24' }}>{view.title}</span>
                    <span
                      className="px-2 py-0.5 rounded text-xs"
                      style={{ background: 'rgba(245,158,11,0.15)', color: 'rgba(245,240,232,0.7)', fontSize: '10px' }}
                    >
                      {view.highlight}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card info */}
              <div className="p-4" style={{ background: 'rgba(17,14,8,0.9)' }}>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(245,240,232,0.55)' }}>
                  {view.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {/* Info strip */}
          <div
            className="inline-flex flex-wrap items-center justify-center gap-6 px-8 py-4 rounded-2xl mb-8 mx-auto"
            style={{
              background: 'rgba(245,158,11,0.05)',
              border: '1px solid rgba(245,158,11,0.15)',
            }}
          >
            {[
              { icon: '🚫', label: 'Không cần VR headset' },
              { icon: '📱', label: 'Mọi thiết bị' },
              { icon: '🆓', label: 'Hoàn toàn miễn phí' },
              { icon: '🔒', label: 'Bảo mật thông tin' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span>{item.icon}</span>
                <span className="text-xs font-medium" style={{ color: 'rgba(245,240,232,0.65)' }}>{item.label}</span>
              </div>
            ))}
          </div>

          <motion.button
            onClick={scrollToTicket}
            id="tour-cta-btn"
            className="btn-amber-primary text-base px-10 py-5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={{ fontSize: '1rem' }}
          >
            🎟️ Bắt Đầu Tour Ảo — Đăng Ký Vé
          </motion.button>

          <p className="mt-4 text-xs" style={{ color: 'rgba(245,240,232,0.3)', fontStyle: 'italic' }}>
            Nhận link tour ngay sau khi điền form • Không thanh toán
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default VirtualTourPreview;
