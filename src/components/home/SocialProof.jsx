import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Award, Shield, BookMarked } from 'lucide-react';

const testimonials = [
  {
    name: 'Trần Minh Khoa',
    role: 'Kỹ sư phần mềm, 31 tuổi',
    avatar: '🦖',
    rating: 5,
    text: 'Đây là tài liệu tiếng Việt đầu tiên về khủng long mà tôi thực sự hài lòng. Thông tin chính xác, nguồn rõ ràng, hình ảnh minh họa cực đẹp. Không thể tin là miễn phí!',
  },
  {
    name: 'Nguyễn Thị Lan Anh',
    role: 'Giáo viên sinh học, 28 tuổi',
    avatar: '🦕',
    rating: 5,
    text: 'Tôi đã tìm kiếm tài liệu như thế này suốt 3 năm. Phần về địa tầng và phân loại học cực kỳ chi tiết, giúp tôi bổ sung rất nhiều vào bài giảng của mình.',
  },
  {
    name: 'Phạm Hoàng Đức',
    role: 'Sinh viên cổ sinh vật học, 24 tuổi',
    avatar: '🔬',
    rating: 5,
    text: 'Là sinh viên chuyên ngành, tôi rất ngạc nhiên với độ chính xác của bộ tài liệu này. Thậm chí còn cập nhật cả các nghiên cứu mới nhất năm 2025-2026!',
  },
];

const badges = [
  { icon: Award, label: 'Dựa trên tài liệu học thuật' },
  { icon: Shield, label: 'Thông tin được kiểm chứng' },
  { icon: BookMarked, label: 'Cập nhật thường xuyên' },
];

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), target);
      setCount(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString('vi-VN')}{suffix}
    </span>
  );
}

const SocialProof = () => {
  return (
    <section
      id="testimonials"
      className="section-pad relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0804 0%, #0d0b06 100%)' }}
    >
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(245,158,11,0.04) 0%, transparent 60%)' }} />

      <div className="relative max-w-7xl mx-auto">
        {/* Counter row */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-20 p-8 rounded-2xl"
          style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.1)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {[
            { target: 12847, suffix: '+', label: 'Người đã tải ebook' },
            { target: 4.9, suffix: '/5', label: 'Đánh giá trung bình' },
            { target: 280, suffix: ' trang', label: 'Nội dung chuyên sâu' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="font-serif text-4xl md:text-5xl font-bold mb-2"
                style={{ fontFamily: 'Playfair Display, serif', color: '#fbbf24' }}>
                {i === 1
                  ? <>{item.target.toFixed(1)}{item.suffix}</>
                  : <AnimatedCounter target={item.target} suffix={item.suffix} />
                }
              </div>
              <div className="text-sm" style={{ color: 'rgba(245,240,232,0.5)' }}>{item.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="section-divider" />
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#f59e0b' }}>
            Đánh giá từ độc giả
          </p>
          <h2 className="font-serif text-3xl md:text-5xl"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Được yêu thích bởi{' '}
            <span className="text-gradient-amber">cộng đồng</span>
          </h2>
        </motion.div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="glass-card p-6 flex flex-col gap-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -4 }}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-sm leading-relaxed flex-1 italic"
                style={{ color: 'rgba(245,240,232,0.7)', fontFamily: 'Lora, serif' }}>
                "{t.text}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3"
                style={{ borderTop: '1px solid rgba(245,158,11,0.12)' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: '#f5f0e8' }}>{t.name}</div>
                  <div className="text-xs" style={{ color: 'rgba(245,240,232,0.45)' }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {badges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div key={i}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm"
                style={{
                  background: 'rgba(245,158,11,0.07)',
                  border: '1px solid rgba(245,158,11,0.18)',
                  color: 'rgba(245,240,232,0.7)',
                }}>
                <Icon size={14} color="#f59e0b" strokeWidth={2} />
                {badge.label}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;
