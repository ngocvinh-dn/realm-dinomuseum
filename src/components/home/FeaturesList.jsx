import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParallax } from '../../hooks/useParallax';
import { useDinosaurs } from '../../hooks/useDinosaurs';

const fallbackGalleries = {
  vi: [
    {
      id: 'fossil-hall',
      title: 'Fossil Hall',
      subtitle: 'Hóa thạch tiêu biểu',
      desc: 'Khám phá những mẫu hóa thạch nổi bật trong bộ sưu tập số của bảo tàng.',
      period: 'Mesozoic',
      dinoImage: '/images/dino_trex.png',
      dinoLabel: 'Museum exhibit',
    },
    {
      id: 'amber-hall',
      title: 'Amber Gallery',
      subtitle: 'Nhựa cây hóa thạch',
      desc: 'Những bao thể nguyên vẹn được lưu giữ trong hổ phách qua hàng triệu năm.',
      period: 'Cretaceous',
      dinoImage: '/images/amber_fossil.png',
      dinoLabel: 'Amber fossil',
    },
    {
      id: 'vn-discovery',
      title: 'Vietnam Discovery',
      subtitle: 'Phát hiện tại Việt Nam',
      desc: 'Những dấu tích hiếm hoi về khủng long được phát hiện trên lãnh thổ Việt Nam.',
      period: 'Local Discovery',
      dinoImage: '/images/dino_velociraptor.png',
      dinoLabel: 'Vietnam dinosaur discovery',
    },
  ],
  en: [
    {
      id: 'fossil-hall',
      title: 'Fossil Hall',
      subtitle: 'Featured Fossils',
      desc: 'Discover standout fossil specimens from the museum’s digital collection.',
      period: 'Mesozoic',
      dinoImage: '/images/dino_trex.png',
      dinoLabel: 'Museum exhibit',
    },
    {
      id: 'amber-hall',
      title: 'Amber Gallery',
      subtitle: 'Fossilized Resin',
      desc: 'Pristine inclusions preserved in amber for millions of years.',
      period: 'Cretaceous',
      dinoImage: '/images/amber_fossil.png',
      dinoLabel: 'Amber fossil',
    },
    {
      id: 'vn-discovery',
      title: 'Vietnam Discovery',
      subtitle: 'Found in Vietnam',
      desc: 'Rare traces of dinosaurs discovered on Vietnamese territory.',
      period: 'Local Discovery',
      dinoImage: '/images/dino_velociraptor.png',
      dinoLabel: 'Vietnam dinosaur discovery',
    },
  ],
};

const GalleriesPreview = ({ locale = 'vi' }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const headingY = useParallax(sectionRef, ['30px', '-20px']);
  const { dinosaurs, loading } = useDinosaurs();

  const galleries = (dinosaurs || []).slice(0, 5).map((dino) => ({
    id: dino.id,
    title: locale === 'vi'
      ? (dino.common_name_vi || dino.eras?.name_vi || dino.common_name_en || dino.scientific_name)
      : (dino.common_name_en || dino.eras?.name_en || dino.common_name_vi || dino.scientific_name),
    subtitle: locale === 'vi'
      ? (dino.eras?.name_vi || dino.description_vi || dino.eras?.name_en || '')
      : (dino.eras?.name_en || dino.description_en || dino.eras?.name_vi || ''),
    desc: locale === 'vi'
      ? (dino.description_vi || dino.description_en || '')
      : (dino.description_en || dino.description_vi || ''),
    period: locale === 'vi'
      ? (dino.eras?.name_vi || 'Kỷ địa chất')
      : (dino.eras?.name_en || 'Geological period'),
    dinoImage: dino.image_url,
    dinoLabel: locale === 'vi' ? (dino.common_name_vi || dino.scientific_name) : (dino.common_name_en || dino.scientific_name),
    objectPosition: 'center center',
    color: 'rgba(245,158,11,0.12)',
    borderColor: 'rgba(245,158,11,0.3)',
    accentColor: '#f59e0b',
  }));

  const displayGalleries = galleries.length ? galleries : fallbackGalleries[locale] || fallbackGalleries.vi;

  return (
    <section id="galleries" ref={sectionRef} className="section-pad relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--theme-bg) 0%, var(--theme-bg-alt) 60%, var(--theme-bg) 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 60%)' }} />
      <div className="relative max-w-7xl mx-auto">
        <motion.div ref={headingRef} className="mb-16" style={{ y: headingY }} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="section-divider" />
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#f59e0b', fontFamily: 'DM Sans, sans-serif' }}>
            {locale === 'vi' ? 'Khu trưng bày từ Supabase' : 'Museum Halls From Supabase'}
          </p>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--theme-text)' }}>
            {loading
              ? (locale === 'vi' ? 'Đang tải hiện vật thật...' : 'Loading real exhibits...')
              : (locale === 'vi' ? 'Khám phá hiện vật bảo tàng' : 'Explore Real Museum Exhibits')}
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayGalleries.map((gallery) => (
            <motion.div key={gallery.id} className="gallery-room-card group" onMouseEnter={() => setHoveredId(gallery.id)} onMouseLeave={() => setHoveredId(null)} style={{ border: `1px solid ${hoveredId === gallery.id ? gallery.borderColor || 'rgba(245,158,11,0.3)' : 'rgba(245,158,11,0.1)'}` }} whileHover={{ y: -6 }}>
              <div className="relative h-52 overflow-hidden rounded-t-2xl">
                <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(10,8,4,0.7)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)', backdropFilter: 'blur(8px)', fontFamily: 'DM Sans, sans-serif' }}>{gallery.period}</div>
                {gallery.dinoImage ? <img src={gallery.dinoImage} alt={gallery.dinoLabel} className="w-full h-full object-cover" style={{ objectPosition: gallery.objectPosition || 'center center', filter: 'brightness(0.75) saturate(1.1)' }} /> : <div className="w-full h-full flex items-center justify-center">🦕</div>}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(10,8,4,0.85) 100%)' }} />
              </div>
              <div className="p-6">
                <h3 className="font-serif font-bold text-lg leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--theme-text)' }}>{gallery.title}</h3>
                <p className="text-xs font-semibold mt-0.5" style={{ color: '#f59e0b', fontFamily: 'DM Sans, sans-serif' }}>{gallery.subtitle}</p>
                <p className="text-sm leading-relaxed mt-3 mb-5" style={{ color: 'var(--theme-text-muted)', fontFamily: 'Nunito, sans-serif' }}>{gallery.desc}</p>
                <button className="btn-amber-outline text-xs py-2 px-4 w-full" style={{ fontFamily: 'DM Sans, sans-serif' }} onClick={() => document.querySelector('#dang-ky')?.scrollIntoView({ behavior: 'smooth' })}>
                  {locale === 'vi' ? 'Đặt vé' : 'Book visit'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleriesPreview;
