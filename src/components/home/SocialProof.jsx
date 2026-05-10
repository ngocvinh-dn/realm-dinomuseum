import React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Star, Award, Shield, Globe } from 'lucide-react';
import { useParallax } from '../../hooks/useParallax';

// Visitor testimonial data
const testimonials = [
  {
    name: 'Kevin T.',
    role: 'Software Engineer, 31',
    avatar: '🦖',
    rating: 5,
    text: 'An incredible virtual museum experience! For the first time I could "walk through" a dinosaur exhibition without leaving the country. The information is incredibly accurate and detailed.',
  },
  {
    name: 'Sarah M.',
    role: 'Biology Teacher, 28',
    avatar: '🦕',
    rating: 5,
    text: 'I use the museum’s content to enrich my lessons. The geological timeline and taxonomy section are incredibly detailed — useful for both students and teachers alike.',
  },
  {
    name: 'Dr. James H.',
    role: 'Paleontology Student, 24',
    avatar: '🔬',
    rating: 5,
    text: 'As a specialist in the field, I’m impressed by the scientific accuracy. The Theropoda Hall is outstanding — each species’ data is updated with the latest research findings.',
  },
];

// Credibility badges displayed below testimonials
const badges = [
  { icon: Award, label: 'Scientifically verified content' },
  { icon: Shield, label: "Vietnam's first virtual museum" },
  { icon: Globe, label: 'Continuously updated 2026' },
];

// Beautiful number counter component with scroll-triggered animation
function AnimatedCounter({ target, suffix = '', decimals = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  // Theo dõi khi component vào viewport để bắt đầu đếm
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Chạy animation đếm số khi vào viewport
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
      {decimals > 0 ? count.toFixed(decimals) : count.toLocaleString('en-US')}{suffix}
    </span>
  );
}

const SocialProof = () => {
  // Ref cho section — dùng để tính parallax scroll
  const sectionRef = useRef(null);
  const headingY = useParallax(sectionRef, ['25px', '-15px']);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="section-pad relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--theme-bg) 0%, var(--theme-bg-alt) 100%)' }}
    >
      {/* Ánh sáng ambient mờ góc trái */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(245,158,11,0.04) 0%, transparent 60%)' }} />

      <div className="relative max-w-7xl mx-auto">
        {/* Hàng số liệu thống kê với animation đếm */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-20 p-8 rounded-2xl"
          style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.1)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {[
            { target: 12000, suffix: '+', label: 'Virtual Visits', decimals: 0 },
            { target: 4.9, suffix: '/5', label: 'Average Rating', decimals: 1 },
            { target: 275, suffix: '+', label: 'Digital Specimens', decimals: 0 },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div
                className="font-serif text-4xl md:text-5xl font-bold mb-2"
                style={{ fontFamily: 'Playfair Display, serif', color: '#fbbf24' }}
              >
                <AnimatedCounter target={item.target} suffix={item.suffix} decimals={item.decimals} />
              </div>
              <div className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>{item.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tiêu đề phần đánh giá — có parallax nhẹ */}
        <motion.div
          className="mb-12"
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="section-divider" />
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#f59e0b' }}>
            What Visitors Say
          </p>
          <h2 className="font-serif text-3xl md:text-5xl" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--theme-text)' }}>
            Loved By{' '}
            <span className="text-gradient-amber">Our Community</span>
          </h2>
        </motion.div>

        {/* Lưới các card đánh giá */}
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
              {/* Sao đánh giá */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>

              {/* Nội dung đánh giá */}
              <blockquote
                className="text-sm leading-relaxed flex-1 italic"
                style={{ color: 'var(--theme-text-muted)', fontFamily: 'Lora, serif' }}
              >
                "{t.text}"
              </blockquote>

              {/* Thông tin tác giả */}
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
                  <div className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>{t.name}</div>
                  <div className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Các huy hiệu uy tín phía dưới */}
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
                  color: 'var(--theme-text-muted)',
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
