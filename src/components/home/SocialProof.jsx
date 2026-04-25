import React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Star, Award, Shield, Globe } from 'lucide-react';

const testimonials = [
  {
    name: 'Trần Minh Khoa',
    role: 'Kỹ sư phần mềm, 31 tuổi',
    avatar: '🦖',
    rating: 5,
    text: 'Trải nghiệm bảo tàng ảo tuyệt vời! Lần đầu tiên tôi được "bước vào" không gian trưng bày khủng long mà không cần đến nước ngoài. Thông tin cực kỳ chính xác và phong phú.',
  },
  {
    name: 'Nguyễn Thị Lan Anh',
    role: 'Giáo viên sinh học, 28 tuổi',
    avatar: '🦕',
    rating: 5,
    text: 'Tôi đã dùng nội dung trong bảo tàng để bổ sung bài giảng. Dòng thời gian địa chất và phần phân loại học cực kỳ chi tiết, hữu ích cho cả học sinh lẫn giáo viên.',
  },
  {
    name: 'Phạm Hoàng Đức',
    role: 'Sinh viên cổ sinh vật học, 24 tuổi',
    avatar: '🔬',
    rating: 5,
    text: 'Là sinh viên chuyên ngành, tôi rất ấn tượng với độ chính xác khoa học. Phòng Theropoda đặc biệt xuất sắc — thông số từng loài đều được cập nhật theo nghiên cứu mới nhất.',
  },
];

const badges = [
  { icon: Award, label: 'Kiến thức được kiểm chứng khoa học' },
  { icon: Shield, label: 'Bảo tàng ảo VN đầu tiên' },
  { icon: Globe, label: 'Cập nhật liên tục 2026' },
];

function AnimatedCounter({ target, suffix = '', decimals = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(parseFloat((increment * step).toFixed(decimals)), target);
      setCount(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target, decimals]);

  return (
    <span ref={ref}>
      {decimals > 0 ? count.toFixed(decimals) : count.toLocaleString('vi-VN')}{suffix}
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
            { target: 12000, suffix: '+', label: 'Lượt tham quan ảo', decimals: 0 },
            { target: 4.9, suffix: '/5', label: 'Đánh giá trung bình', decimals: 1 },
            { target: 275, suffix: '+', label: 'Hiện vật số hóa', decimals: 0 },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div
                className="font-serif text-4xl md:text-5xl font-bold mb-2"
                style={{ fontFamily: 'Playfair Display, serif', color: '#fbbf24' }}
              >
                <AnimatedCounter target={item.target} suffix={item.suffix} decimals={item.decimals} />
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
            Khách Tham Quan Nói Gì
          </p>
          <h2 className="font-serif text-3xl md:text-5xl" style={{ fontFamily: 'Playfair Display, serif' }}>
            Được Yêu Thích Bởi{' '}
            <span className="text-gradient-amber">Cộng Đồng</span>
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
              <blockquote
                className="text-sm leading-relaxed flex-1 italic"
                style={{ color: 'rgba(245,240,232,0.7)', fontFamily: 'Lora, serif' }}
              >
                "{t.text}"
              </blockquote>

              {/* Author */}
              <div
                className="flex items-center gap-3 pt-3"
                style={{ borderTop: '1px solid rgba(245,158,11,0.12)' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
                >
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
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm"
                style={{
                  background: 'rgba(245,158,11,0.07)',
                  border: '1px solid rgba(245,158,11,0.18)',
                  color: 'rgba(245,240,232,0.7)',
                }}
              >
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
