import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const previewPages = [
  {
    title: 'Chương 1: Nguồn gốc khủng long',
    desc: 'Từ Triassic đến Cretaceous — hành trình tiến hóa 170 triệu năm của các sinh vật thống trị Trái Đất.',
    tag: 'Tiến hóa',
  },
  {
    title: 'Chương 3: Giải mã hóa thạch',
    desc: 'Khám phá cách các nhà cổ sinh vật học xác định loài mới từ vài mảnh xương rời rạc.',
    tag: 'Phương pháp',
  },
  {
    title: 'Chương 5: Tuyệt chủng & Di sản',
    desc: 'Sự kiện K-Pg 66 triệu năm trước và những hậu duệ còn tồn tại đến ngày nay.',
    tag: 'Khoa học',
  },
];

const features = [
  '5 tập PDF chuyên sâu, tổng hơn 280 trang',
  'Hơn 120 hình ảnh paleoart độc quyền',
  'Bảng thuật ngữ cổ sinh vật học tiếng Việt',
  'Cập nhật phát hiện mới nhất năm 2026',
];

const VisualsSection = () => {
  return (
    <section
      id="visuals"
      className="section-pad relative overflow-hidden"
      style={{ background: '#110e08' }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(245,158,11,0.3) 0px, rgba(245,158,11,0.3) 1px, transparent 1px, transparent 30px)',
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Ebook mockup */}
          <motion.div
            className="relative flex justify-center"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Glow background */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.15) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />

            <div className="relative animate-float">
              {/* Shadow book */}
              <div
                className="absolute -bottom-4 left-1/2 w-3/4 h-8 rounded-full -translate-x-1/2"
                style={{ background: 'rgba(245,158,11,0.15)', filter: 'blur(20px)' }}
              />

              {/* Main ebook image */}
              <motion.div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 0 60px rgba(245,158,11,0.15)',
                  maxWidth: '380px',
                }}
                whileHover={{ rotateY: -5, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <img
                  src="/images/ebook_mockup.png"
                  alt="Bộ Ebook Khủng Long & Cổ Sinh Vật Học"
                  className="w-full h-auto block"
                  style={{ maxWidth: '380px' }}
                />

                {/* Shine overlay */}
                <div className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(245,158,11,0.03) 100%)',
                  }}
                />
              </motion.div>

              {/* Floating badge */}
              <motion.div
                className="absolute -top-4 -right-4 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#0a0804',
                  boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
                }}
                animate={{ rotate: [-3, 3, -3] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              >
                ✦ Mới nhất 2026
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <div className="section-divider" />
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#f59e0b' }}>
              Xem trước nội dung
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              Bên trong{' '}
              <span className="text-gradient-amber italic">DinoArchive</span>
            </h2>

            {/* What's included */}
            <div className="mb-8 space-y-3">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <CheckCircle size={16} color="#f59e0b" strokeWidth={2} className="flex-shrink-0" />
                  <span className="text-sm" style={{ color: 'rgba(245,240,232,0.7)' }}>{f}</span>
                </motion.div>
              ))}
            </div>

            {/* Preview cards */}
            <div className="space-y-3">
              {previewPages.map((page, i) => (
                <motion.div
                  key={i}
                  className="glass-card p-4 flex items-start gap-4 cursor-default"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ x: 6 }}
                >
                  <div className="flex-shrink-0 w-1 self-stretch rounded-full"
                    style={{ background: 'linear-gradient(to bottom, #f59e0b, #92400e)' }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm" style={{ color: '#f5f0e8' }}>{page.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>
                        {page.tag}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(245,240,232,0.5)' }}>
                      {page.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisualsSection;
