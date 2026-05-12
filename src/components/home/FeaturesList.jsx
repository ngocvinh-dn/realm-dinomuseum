import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParallax } from '../../hooks/useParallax';
import { useDinosaurs } from '../../hooks/useDinosaurs';

const fallbackGalleries = {
  vi: [
    {
      id: 'triassic-hall',
      title: 'Kỷ Tam Điệp',
      subtitle: 'Khủng long sơ khai',
      desc: 'Những loài khủng long đầu tiên xuất hiện trong kỷ nguyên đầu của Mesozoi.',
      period: 'Tam Điệp',
      dinoImage: '/images/Eoraptor_lunensis.png',
      dinoLabel: 'Eoraptor lunensis',
    },
    {
      id: 'jurassic-hall',
      title: 'Kỷ Jura',
      subtitle: 'Khủng long ăn cỏ lớn',
      desc: 'Những loài sauropod khổng lồ phát triển mạnh, chiếm lĩnh các vùng đất cổ đại.',
      period: 'Jura',
      dinoImage: '/images/Plateosaurus.png',
      dinoLabel: 'Plateosaurus engelhardti',
    },
    {
      id: 'cretaceous-hall',
      title: 'Kỷ Phấn Trắng',
      subtitle: 'Khủng long kích thước lớn',
      desc: 'Giai đoạn cuối cùng của thời đại khủng long, với nhiều loài bò sát cổ đại đa dạng.',
      period: 'Phấn Trắng',
      dinoImage: '/images/Camarasaurus.png',
      dinoLabel: 'Camarasaurus',
    },
  ],
  en: [
    {
      id: 'triassic-hall',
      title: 'Triassic',
      subtitle: 'Early Dinosaurs',
      desc: 'The first dinosaurs emerged during the opening chapter of the Mesozoic.',
      period: 'Triassic',
      dinoImage: '/images/Eoraptor_lunensis.png',
      dinoLabel: 'Eoraptor lunensis',
    },
    {
      id: 'jurassic-hall',
      title: 'Jurassic',
      subtitle: 'Large Herbivores',
      desc: 'Massive sauropod lineages flourished and dominated ancient landscapes.',
      period: 'Jurassic',
      dinoImage: '/images/Plateosaurus.png',
      dinoLabel: 'Plateosaurus engelhardti',
    },
    {
      id: 'cretaceous-hall',
      title: 'Cretaceous',
      subtitle: 'Large Dinosaurs',
      desc: 'The final chapter of dinosaur history, with many diverse ancient reptiles.',
      period: 'Cretaceous',
      dinoImage: '/images/Camarasaurus.png',
      dinoLabel: 'Camarasaurus',
    },
  ],
};

const GalleriesPreview = ({ locale = 'vi' }) => {
  const [activeId, setActiveId] = useState(null);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const headingY = useParallax(sectionRef, ['30px', '-20px']);
  const { dinosaurs, loading } = useDinosaurs();

  const isVi = locale === 'vi';
  const galleries = (dinosaurs || []).slice(0, 3).map((dino, index) => {
    const palettes = [
      { border: 'rgba(251,191,36,0.55)', glow: 'rgba(251,191,36,0.18)', dot: '#f59e0b' },
      { border: 'rgba(74,222,128,0.55)', glow: 'rgba(74,222,128,0.18)', dot: '#22c55e' },
      { border: 'rgba(96,165,250,0.55)', glow: 'rgba(96,165,250,0.18)', dot: '#3b82f6' },
    ];
    const p = palettes[index] || palettes[0];
    return {
      id: dino.id,
      title: isVi ? (dino.common_name_vi || dino.scientific_name) : (dino.common_name_en || dino.scientific_name),
      subtitle: isVi ? (dino.common_name_en || dino.scientific_name) : (dino.common_name_vi || dino.scientific_name),
      desc: isVi ? (dino.description_vi || dino.description_en || '') : (dino.description_en || dino.description_vi || ''),
      period: isVi ? (dino.eras?.name_vi || 'Kỷ Mesozoi') : (dino.eras?.name_en || 'Mesozoic'),
      dinoImage: dino.image_url,
      dinoLabel: isVi ? (dino.common_name_vi || dino.scientific_name) : (dino.common_name_en || dino.scientific_name),
      objectPosition: 'center center',
      ...p,
    };
  });

  const displayGalleries = galleries.length ? galleries : (isVi ? fallbackGalleries.vi : fallbackGalleries.en);
  const activeGallery = displayGalleries.find((g) => g.id === activeId) || displayGalleries[0];

  return (
    <section id="galleries" ref={sectionRef} className="section-pad relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--theme-bg) 0%, var(--theme-bg-alt) 60%, var(--theme-bg) 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 60%)' }} />
      <div className="relative max-w-7xl mx-auto">
        <motion.div ref={headingRef} className="mb-10 md:mb-16" style={{ y: headingY }} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="section-divider" />
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#f59e0b', fontFamily: 'DM Sans, sans-serif' }}>
            {isVi ? 'Phòng trưng bày' : 'Dinosaur Halls'}
          </p>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--theme-text)' }}>
            {loading ? (isVi ? 'Đang tải hiện vật...' : 'Loading exhibits...') : (isVi ? '3 card đầu tiên theo dòng thời gian' : 'First 3 cards in the timeline')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-8 items-start">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {displayGalleries.map((gallery) => {
              const isActive = activeGallery?.id === gallery.id;
              return (
                <motion.button
                  key={gallery.id}
                  type="button"
                  onClick={() => setActiveId(gallery.id)}
                  className="gallery-room-card group text-left"
                  style={{
                    borderColor: isActive ? gallery.border : 'rgba(245,158,11,0.12)',
                    boxShadow: isActive ? `0 0 0 1px ${gallery.border}, 0 0 34px ${gallery.glow}` : 'none',
                    outline: 'none',
                    padding: 0,
                  }}
                  whileHover={{ y: -6 }}
                >
                  <div className="relative pt-5 px-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-4 h-4 rounded-full border-2" style={{ background: isActive ? gallery.dot : 'var(--theme-bg)', borderColor: gallery.dot, boxShadow: isActive ? `0 0 16px ${gallery.dot}88` : 'none' }} />
                      <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: gallery.dot }}>{gallery.period}</span>
                    </div>
                    <div className="relative h-48 overflow-hidden rounded-2xl" style={{ border: `1px solid ${gallery.border}` }}>
                      {gallery.dinoImage ? <img src={gallery.dinoImage} alt={gallery.dinoLabel} className="w-full h-full object-cover" style={{ objectPosition: gallery.objectPosition || 'center center', filter: 'brightness(0.78) saturate(1.08)' }} /> : <div className="w-full h-full flex items-center justify-center">🦕</div>}
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 35%, rgba(10,8,4,0.9) 100%)' }} />
                    </div>
                  </div>
                  <div className="p-5 pt-4">
                    <h3 className="font-serif font-bold text-lg leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--theme-text)' }}>{gallery.title}</h3>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: gallery.dot, fontFamily: 'DM Sans, sans-serif' }}>{gallery.subtitle}</p>
                    <p className="text-sm leading-relaxed mt-3 mb-5" style={{ color: 'var(--theme-text-muted)', fontFamily: 'Nunito, sans-serif' }}>{gallery.desc}</p>
                    <span className="btn-amber-outline text-xs py-2 px-4 w-full inline-flex justify-center" style={{ fontFamily: 'DM Sans, sans-serif', borderColor: isActive ? gallery.dot : undefined, boxShadow: isActive ? `0 0 20px ${gallery.glow}` : 'none' }}>{isVi ? 'Card đang chọn' : 'Selected card'}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <motion.div className="glass-card p-6 md:p-8 sticky top-24" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} style={{ borderColor: activeGallery?.border, boxShadow: `0 0 36px ${activeGallery?.glow || 'rgba(245,158,11,0.14)'}` }}>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: activeGallery?.dot || '#f59e0b', fontFamily: 'DM Sans, sans-serif' }}>{isVi ? 'Thông tin đang chọn' : 'Selected details'}</p>
                <h3 className="font-serif text-3xl md:text-4xl" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--theme-text)' }}>{activeGallery?.title}</h3>
                <p className="mt-1 text-sm" style={{ color: 'var(--theme-text-muted)' }}>{activeGallery?.subtitle}</p>
              </div>
              <div className="px-3 py-2 rounded-xl text-right" style={{ background: 'rgba(245,158,11,0.08)', border: `1px solid ${activeGallery?.border || 'rgba(245,158,11,0.18)'}` }}>
                <div className="text-xs uppercase tracking-wider" style={{ color: activeGallery?.dot || '#fbbf24' }}>{activeGallery?.period}</div>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden mb-5" style={{ minHeight: '220px', border: `1px solid ${activeGallery?.border || 'rgba(245,158,11,0.15)'}` }}>
              {activeGallery?.dinoImage ? <img src={activeGallery.dinoImage} alt={activeGallery.dinoLabel} className="w-full h-full object-cover" style={{ minHeight: '220px', objectPosition: 'center center', filter: 'brightness(0.82) saturate(1.08)' }} /> : <div className="w-full h-[220px] flex items-center justify-center">🦕</div>}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 35%, rgba(10,8,4,0.9) 100%)' }} />
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
                <span className="text-sm italic" style={{ color: 'rgba(245,240,232,0.75)' }}>{activeGallery?.dinoLabel}</span>
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(10,8,4,0.7)', color: activeGallery?.dot || '#fbbf24', border: `1px solid ${activeGallery?.border || 'rgba(245,158,11,0.2)'}` }}>{isVi ? 'Card được chọn' : 'Selected'}</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--theme-text-muted)', fontFamily: 'Nunito, sans-serif' }}>{activeGallery?.desc}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GalleriesPreview;
