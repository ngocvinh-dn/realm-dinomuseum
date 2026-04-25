import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const galleries = [
  {
    id: 'mesozoic',
    emoji: '🌿',
    title: 'Đại Trung Sinh',
    subtitle: 'Kỷ Nguyên Của Khủng Long',
    desc: 'Hành trình qua 180 triệu năm thống trị của bò sát khổng lồ — từ Triassic đến Cretaceous cuối cùng.',
    count: 150,
    period: 'Triassic – Cretaceous',
    image: '/images/gallery_mesozoic.png',
    color: 'rgba(34,197,94,0.15)',
    borderColor: 'rgba(34,197,94,0.3)',
  },
  {
    id: 'theropoda',
    emoji: '🦖',
    title: 'Theropoda Hall',
    subtitle: 'Những Kẻ Săn Mồi Vĩ Đại',
    desc: 'Tyrannosaurus Rex, Velociraptor, Spinosaurus — những sát thủ tối thượng từng bước trên hành tinh này.',
    count: 48,
    period: 'Jurassic – Cretaceous',
    image: '/images/gallery_theropoda.png',
    color: 'rgba(239,68,68,0.12)',
    borderColor: 'rgba(239,68,68,0.25)',
  },
  {
    id: 'vietnam',
    emoji: '🇻🇳',
    title: 'Hóa Thạch Việt Nam',
    subtitle: 'Khám Phá Trong Nước',
    desc: 'Những phát hiện hiếm hoi ngay trên mảnh đất hình chữ S — răng khủng long, dấu chân và hóa thạch thực vật.',
    count: 23,
    period: 'Jurassic – Paleogene',
    image: null,
    color: 'rgba(245,158,11,0.12)',
    borderColor: 'rgba(245,158,11,0.3)',
  },
  {
    id: 'extinction',
    emoji: '☄️',
    title: 'Sự Kiện Tuyệt Chủng',
    subtitle: '66 Triệu Năm Trước',
    desc: 'Sự kiện K-Pg — tiểu hành tinh, bóng tối hạt nhân và sự kết thúc của một kỷ nguyên. Những gì còn sống sót.',
    count: 35,
    period: 'Cretaceous – Paleogene',
    image: null,
    color: 'rgba(168,85,247,0.12)',
    borderColor: 'rgba(168,85,247,0.25)',
  },
  {
    id: 'embryo',
    emoji: '🥚',
    title: 'Phôi Thai & Trứng',
    subtitle: 'Sự Sống Bắt Đầu',
    desc: 'Bộ sưu tập trứng hóa thạch, phôi được bảo tồn và bằng chứng về hành vi làm tổ của khủng long.',
    count: 19,
    period: 'Jurassic – Cretaceous',
    image: null,
    color: 'rgba(245,158,11,0.08)',
    borderColor: 'rgba(245,158,11,0.2)',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const GalleriesPreview = () => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section
      id="galleries"
      className="section-pad relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0804 0%, #110e08 60%, #0a0804 100%)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 60%)' }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-divider" />
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#f59e0b' }}>
            5 Phòng Trưng Bày Chuyên Đề
          </p>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Khám Phá Từng{' '}
            <br className="hidden md:block" />
            <span className="text-gradient-amber">Phòng Trưng Bày</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: 'rgba(245,240,232,0.5)', fontFamily: 'Lora, serif', fontStyle: 'italic' }}>
            Mỗi phòng là một hành trình riêng biệt qua các kỷ nguyên địa chất — được chiếu sáng như trong bảo tàng thật.
          </p>
        </motion.div>

        {/* Gallery cards grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {galleries.map((gallery, i) => (
            <motion.div
              key={gallery.id}
              variants={cardVariants}
              className="gallery-room-card group"
              onMouseEnter={() => setHoveredId(gallery.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                border: `1px solid ${hoveredId === gallery.id ? gallery.borderColor : 'rgba(245,158,11,0.1)'}`,
              }}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Spotlight */}
              <div className="spotlight" />

              {/* Image area */}
              <div
                className="relative h-48 overflow-hidden rounded-t-2xl"
                style={{
                  background: gallery.image
                    ? `url(${gallery.image}) center/cover`
                    : `linear-gradient(135deg, ${gallery.color} 0%, rgba(10,8,4,0.8) 100%)`,
                }}
              >
                {/* Overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: gallery.image ? 'rgba(10,8,4,0.5)' : 'transparent' }}
                />
                {/* Era badge */}
                <div
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(10,8,4,0.7)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)', backdropFilter: 'blur(8px)' }}
                >
                  {gallery.period}
                </div>
                {/* Emoji watermark */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-7xl opacity-30 group-hover:opacity-50 transition-opacity duration-500">{gallery.emoji}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg leading-tight" style={{ fontFamily: 'Playfair Display, serif', color: '#f5f0e8' }}>
                      {gallery.title}
                    </h3>
                    <p className="text-xs font-medium mt-0.5" style={{ color: '#f59e0b' }}>
                      {gallery.subtitle}
                    </p>
                  </div>
                  <div
                    className="flex-shrink-0 text-center px-3 py-1.5 rounded-xl"
                    style={{ background: gallery.color, border: `1px solid ${gallery.borderColor}` }}
                  >
                    <div className="text-lg font-bold font-serif" style={{ fontFamily: 'Playfair Display, serif', color: '#fbbf24' }}>
                      {gallery.count}
                    </div>
                    <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>hiện vật</div>
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(245,240,232,0.55)' }}>
                  {gallery.desc}
                </p>

                {/* Hover bottom accent */}
                <div
                  className="h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 mb-4"
                  style={{ background: 'linear-gradient(90deg, #f59e0b, transparent)' }}
                />

                <button
                  className="btn-amber-outline text-xs py-2 px-4 w-full"
                  id={`gallery-btn-${gallery.id}`}
                  onClick={() => document.querySelector('#dang-ky')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  🚪 Vào Tham Quan
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GalleriesPreview;