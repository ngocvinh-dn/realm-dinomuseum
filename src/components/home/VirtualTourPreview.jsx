import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParallax } from '../../hooks/useParallax';
import { useDinosaurs } from '../../hooks/useDinosaurs';

const VirtualTourPreview = ({ locale = 'vi' }) => {
  const isVi = locale === 'vi';
  const [activeView, setActiveView] = useState(null);
  const sectionRef = useRef(null);
  const headingY = useParallax(sectionRef, ['30px', '-15px']);
  const { dinosaurs } = useDinosaurs();
  const tourViews = (dinosaurs || []).slice(0, 3).map((dino, index) => ({
    id: dino.id,
    title: dino.common_name_en || dino.scientific_name,
    desc: dino.description_en || dino.description_vi || '',
    bgColor: 'linear-gradient(135deg, rgba(17,14,8,1) 0%, rgba(26,18,8,0.9) 100%)',
    highlight: dino.eras?.name_en || dino.eras?.name_vi || 'Mesozoic',
    dinoImage: dino.revived_model_url || dino.fossil_model_url || dino.image_url,
    dinoLabel: dino.common_name_en || dino.scientific_name,
    fallbackEmoji: ['🦖', '🦕', '🦴'][index] || '🦕',
    objectPosition: 'center center',
  }));

  return (
    <section id="virtual-tour" ref={sectionRef} className="section-pad relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--theme-bg-alt) 0%, var(--theme-bg) 100%)' }}>
      <div className="relative max-w-7xl mx-auto">
        <motion.div className="mb-16 text-center" style={{ y: headingY }} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="section-divider mx-auto" style={{ margin: '0 auto 1.5rem' }} />
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#f59e0b', fontFamily: 'DM Sans, sans-serif' }}>
            {isVi ? 'Xem trước tour 3D' : '3D Virtual Tour Preview'}
          </p>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--theme-text)' }}>
            <span className="text-gradient-amber">{isVi ? 'Tư liệu thực tế' : 'Real Media'}</span> {isVi ? 'từ Supabase' : 'From Supabase'}
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {tourViews.map((view, i) => (
            <motion.div key={view.id} className="tour-frame cursor-pointer group" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }} onMouseEnter={() => setActiveView(view.id)} onMouseLeave={() => setActiveView(null)}>
              <div className="h-64 relative" style={{ background: view.bgColor, outline: activeView === view.id ? '1px solid rgba(245,158,11,0.35)' : 'none' }}>
                {view.dinoImage ? <img src={view.dinoImage} alt={view.dinoLabel} className="w-full h-full object-cover" style={{ filter: 'brightness(0.65) saturate(1.15)', objectPosition: view.objectPosition }} /> : <div className="absolute inset-0 flex items-center justify-center text-7xl">{view.fallbackEmoji}</div>}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(10,8,4,0.9) 100%)' }} />
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 z-20" style={{ background: 'linear-gradient(to top, rgba(10,8,4,0.9), transparent)' }}>
                  <div className="flex items-center justify-between"><span className="text-xs font-bold" style={{ color: '#fbbf24', fontFamily: 'DM Sans, sans-serif' }}>{view.title}</span><span className="px-2 py-0.5 rounded text-xs" style={{ background: 'rgba(245,158,11,0.15)', color: 'rgba(245,240,232,0.7)', fontSize: '10px', fontFamily: 'DM Sans, sans-serif' }}>{view.highlight}</span></div>
                </div>
              </div>
              <div className="p-4" style={{ background: 'var(--theme-card-bg)' }}><p className="text-xs leading-relaxed" style={{ color: 'var(--theme-text-muted)', fontFamily: 'Nunito, sans-serif' }}>{view.desc}</p></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VirtualTourPreview;
