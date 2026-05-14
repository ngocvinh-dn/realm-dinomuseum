import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useParallax } from '../../hooks/useParallax';
import { useDinosaurs } from '../../hooks/useDinosaurs';
import {
  getDinosaurImagePosition,
  getDinosaurImagePresentation,
} from '../../utils/dinosaurImage';

const ERA_COLORS = ['#e07b39', '#4ade80', '#f59e0b'];
const ERA_DOTS = ['#fb923c', '#4ade80', '#f59e0b'];
const ERA_ICONS = ['🦕', '🦖', '🦕'];
const ERA_RANGES = ['252 – 201', '201 – 145', '145 – 66'];

const fallbackEons = (isVi) => [
  {
    id: 'triassic',
    nameVi: 'Kỷ Tam Điệp',
    nameEn: 'Triassic',
    mya: '252 – 201',
    duration: isVi ? '51 triệu năm' : '51 million years',
    climate: isVi ? 'Nóng và khô' : 'Hot and dry',
    event: isVi ? 'Khủng long đầu tiên xuất hiện' : 'First dinosaurs emerge',
    desc: isVi
      ? 'Những loài khủng long đầu tiên xuất hiện và bắt đầu đa dạng hóa trên siêu lục địa Pangaea.'
      : 'The first dinosaurs appeared and started to diversify across Pangaea.',
    color: ERA_COLORS[0],
    dot: ERA_DOTS[0],
    icon: ERA_ICONS[0],
    creatures: ['Coelophysis', 'Plateosaurus'],
    image: '/images/Coelophysis_bauri.png',
    objectPosition: '18% center',
    imageCredit: 'Coelophysis bauri',
    tag: isVi ? 'Kỷ 51 triệu năm' : '51 Myr era',
  },
  {
    id: 'jurassic',
    nameVi: 'Kỷ Jura',
    nameEn: 'Jurassic',
    mya: '201 – 145',
    duration: isVi ? '56 triệu năm' : '56 million years',
    climate: isVi ? 'Ấm và ẩm' : 'Warm and humid',
    event: isVi ? 'Thời kỳ thống trị của sauropod' : 'Sauropod dominance',
    desc: isVi
      ? 'Các loài sauropod khổng lồ thống trị những vùng đất rộng lớn với thảm thực vật phong phú.'
      : 'Large sauropods dominated vast landscapes with rich vegetation.',
    color: ERA_COLORS[1],
    dot: ERA_DOTS[1],
    icon: ERA_ICONS[1],
    creatures: ['Plateosaurus', 'Camarasaurus'],
    image: '/images/Plateosaurus.png',
    objectPosition: 'left center',
    imageCredit: 'Plateosaurus engelhardti',
    tag: isVi ? 'Kỷ 56 triệu năm' : '56 Myr era',
  },
  {
    id: 'cretaceous',
    nameVi: 'Kỷ Phấn Trắng',
    nameEn: 'Cretaceous',
    mya: '145 – 66',
    duration: isVi ? '79 triệu năm' : '79 million years',
    climate: isVi ? 'Khí hậu đa dạng' : 'Diverse climates',
    event: isVi ? 'Sự kiện tuyệt chủng K-Pg' : 'K-Pg extinction event',
    desc: isVi
      ? 'Thực vật có hoa lan rộng và nhiều loài khủng long biểu tượng tiến hóa trước khi tuyệt chủng hàng loạt.'
      : 'Flowering plants spread and many iconic dinosaurs evolved before extinction.',
    color: ERA_COLORS[2],
    dot: ERA_DOTS[2],
    icon: ERA_ICONS[2],
    creatures: ['Tyrannosaurus', 'Triceratops'],
    image: '/images/Tyrannosaurus_rex.png',
    objectPosition: 'center 15%',
    imageCredit: 'Tyrannosaurus rex',
    tag: isVi ? 'Kỷ 79 triệu năm' : '79 Myr era',
  },
];

const GeoTimeline = ({ locale = 'vi' }) => {
  const isVi = locale === 'vi';
  const [activeId, setActiveId] = useState('triassic');
  const sectionRef = useRef(null);
  const headingY = useParallax(sectionRef, ['24px', '-16px']);
  const { dinosaurs } = useDinosaurs();

  const eons = useMemo(() => {
    const dinoEons = (dinosaurs || []).slice(0, 3).map((dino, index) => ({
      id: dino.id || `era-${index}`,
      nameVi: dino.eras?.name_vi || dino.common_name_vi || dino.scientific_name,
      nameEn: dino.eras?.name_en || dino.common_name_en || dino.scientific_name,
      mya: dino.eras?.mya || ERA_RANGES[index],
      duration: dino.eras?.duration_label || (isVi ? 'Mesozoic Era' : 'Mesozoic Era'),
      climate: isVi ? (dino.habitat_vi || dino.habitat_en || 'Môi trường kỷ Mesozoi') : (dino.habitat_en || dino.habitat_vi || 'Mesozoic environment'),
      event: isVi ? (dino.eras?.name_vi || 'Kỷ Mesozoi') : (dino.eras?.name_en || 'Mesozoic era'),
      desc: isVi ? (dino.description_vi || dino.description_en || '') : (dino.description_en || dino.description_vi || ''),
      color: ERA_COLORS[index] || ERA_COLORS[2],
      dot: ERA_DOTS[index] || ERA_DOTS[2],
      icon: ERA_ICONS[index] || ERA_ICONS[2],
      creatures: [isVi ? (dino.common_name_vi || dino.scientific_name) : (dino.common_name_en || dino.scientific_name)],
      image: dino.image_url,
      objectPosition: getDinosaurImagePosition(dino, index === 0 ? '18% center' : 'center center'),
      imagePresentation: getDinosaurImagePresentation(dino),
      imageCredit: dino.common_name_en || dino.scientific_name,
      tag: dino.eras?.duration_label || (isVi ? 'Kỷ' : 'Era'),
    }));
    return dinoEons.length ? dinoEons : fallbackEons(isVi);
  }, [dinosaurs, isVi]);

  const active = eons.find((e) => e.id === activeId) || eons[0];
  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="section-pad relative overflow-hidden"
      style={{ background: 'var(--theme-bg)' }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-60" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 65%)' }} />
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-full h-px pointer-events-none"
          style={{ top: `${18 + i * 16}%`, background: 'rgba(245,158,11,0.03)' }}
        />
      ))}

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          className="mb-12 md:mb-16"
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-semibold tracking-[0.28em] uppercase mb-4" style={{ color: '#f59e0b', fontFamily: 'var(--font-body)' }}>
            {isVi ? 'DÒNG THỜI GIAN ĐỊA CHẤT' : 'GEOLOGICAL TIMELINE'}
          </p>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--theme-text)' }}>
            {isVi ? 'Kỷ Mesozoi — ' : 'Mesozoic Era — '}
            <span className="text-gradient-amber">{isVi ? 'Thời đại của khủng long' : 'The Age of Dinosaurs'}</span>
          </h2>
          <p className="mt-4 text-sm md:text-base italic" style={{ color: 'var(--theme-text-muted)', fontFamily: 'var(--font-body)' }}>
            {isVi
              ? '252 – 66 triệu năm trước • Nhấn vào từng kỷ để khám phá chi tiết'
              : '252 – 66 million years ago • Click each period to explore in detail'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {eons.map((eon, i) => {
              const isActive = active?.id === eon.id;
              return (
                <motion.button
                  key={eon.id}
                  type="button"
                  onClick={() => setActiveId(eon.id)}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.55, ease: 'easeOut' }}
                  whileHover={{ y: -4 }}
                  className="text-left rounded-2xl overflow-hidden"
                  style={{
                    background: 'var(--theme-card-bg)',
                    border: `1px solid ${isActive ? eon.color : 'var(--theme-border)'}`,
                    boxShadow: isActive
                      ? `0 0 0 1px ${eon.color}44, 0 0 38px ${eon.color}22, 0 18px 48px rgba(0,0,0,0.25)`
                      : '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'background 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                >
                  <div className="p-5 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl" style={{ color: eon.dot }}>{eon.icon}</div>
                      <div className="px-3 py-2 rounded-xl text-right" style={{ background: `${eon.color}18`, border: `1px solid ${eon.color}40` }}>
                        <div className="text-xs font-bold" style={{ color: eon.color }}>{eon.mya}</div>
                        <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--theme-text-dim)' }}>Mya</div>
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl md:text-[1.75rem] leading-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--theme-text)' }}>
                      {isVi ? eon.nameVi : eon.nameEn}
                    </h3>
                    <p className="mt-1 text-xs italic" style={{ color: 'var(--theme-text-muted)', fontFamily: 'var(--font-body)' }}>
                      {isVi ? 'Bấm để xem chi tiết theo từng kỷ' : 'Tap to view details for this period'}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4 mb-4">
                      <span className="px-2.5 py-1 rounded-full text-xs" style={{ background: `${eon.color}18`, color: eon.color, border: `1px solid ${eon.color}33` }}>
                        ⏳ {eon.duration}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs" style={{ background: 'rgba(245,158,11,0.06)', color: 'var(--theme-text-muted)', border: '1px solid rgba(245,158,11,0.1)' }}>
                        🌍 {eon.climate}
                      </span>
                    </div>

                    <div className="px-3 py-2 rounded-xl text-sm font-medium mb-4" style={{ background: `${eon.color}16`, color: 'var(--theme-text)', border: `1px solid ${eon.color}24` }}>
                      ✦ {eon.event}
                    </div>

                    <div className="text-xs" style={{ color: 'var(--theme-text-dim)' }}>
                      {isActive ? (isVi ? 'Nhấn để thu gọn' : 'Click to collapse') : (isVi ? 'Nhấn để khám phá' : 'Click to explore')}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-0 md:px-9 -mt-2">
            {eons.map((eon, i) => (
              <div key={eon.id} className="text-center text-[10px] md:text-xs uppercase tracking-wider" style={{ color: eon.color, opacity: 0.78, width: '100%' }}>
                {isVi ? eon.nameVi : eon.nameEn}
              </div>
            ))}
          </div>

          <motion.div
            key={active?.id}
            className="mt-2 rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              background: 'var(--theme-card-bg)',
              border: `1px solid ${active?.color || '#f59e0b'}22`,
              boxShadow: `0 0 36px ${active?.color || '#f59e0b'}16`,
              transition: 'background 0.4s ease',
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-[260px] md:min-h-[320px]">
                {active?.image ? (
                  <img
                    src={active.image}
                    alt={active.imageCredit}
                    className="w-full h-full"
                    style={{
                      minHeight: '260px',
                      objectFit: active?.imagePresentation?.objectFit || 'cover',
                      objectPosition: active?.objectPosition || 'center center',
                      transform: `scale(${active?.imagePresentation?.scale || 1})`,
                      filter: 'brightness(0.82) saturate(1.08)',
                    }}
                  />
                ) : (
                  <div className="w-full h-full min-h-[260px] flex items-center justify-center" style={{ color: 'var(--theme-text-dim)' }}>🦕</div>
                )}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 35%, rgba(10,8,4,0.92) 100%)' }} />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs" style={{ background: 'rgba(10,8,4,0.75)', color: active?.color || '#fbbf24', border: `1px solid ${active?.color || '#f59e0b'}33` }}>
                  {active?.mya} Mya
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                  <span className="text-sm italic" style={{ color: 'rgba(245,240,232,0.72)' }}>{active?.imageCredit}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(10,8,4,0.75)', color: active?.color || '#fbbf24', border: `1px solid ${active?.color || '#f59e0b'}33` }}>
                    {isVi ? 'Card đang chọn' : 'Selected card'}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: active?.dot || '#f59e0b', fontFamily: 'var(--font-body)' }}>
                      {isVi ? 'Thông tin đang chọn' : 'Selected details'}
                    </p>
                    <h3 className="font-serif text-3xl md:text-4xl leading-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--theme-text)' }}>
                      {isVi ? active?.nameVi : active?.nameEn}
                    </h3>
                    <p className="mt-1 text-sm" style={{ color: 'var(--theme-text-muted)' }}>
                      {isVi ? 'Bấm vào card khác để đổi thông tin' : 'Click another card to change details'}
                    </p>
                  </div>
                  <div className="px-3 py-2 rounded-xl text-right shrink-0" style={{ background: `${active?.color || '#f59e0b'}16`, border: `1px solid ${active?.color || '#f59e0b'}33` }}>
                    <div className="text-xs font-bold" style={{ color: active?.dot || '#fbbf24' }}>{active?.tag || 'Era'}</div>
                    <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--theme-text-dim)' }}>Mya</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.1)' }}>
                    <div className="text-xs font-bold" style={{ color: active?.dot || '#fbbf24' }}>{active?.duration}</div>
                    <div className="text-[11px] mt-1" style={{ color: 'var(--theme-text-dim)' }}>{isVi ? 'Niên đại' : 'Duration'}</div>
                  </div>
                  <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.1)' }}>
                    <div className="text-xs font-bold" style={{ color: active?.dot || '#fbbf24' }}>{active?.climate}</div>
                    <div className="text-[11px] mt-1" style={{ color: 'var(--theme-text-dim)' }}>{isVi ? 'Khí hậu' : 'Climate'}</div>
                  </div>
                  <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.1)' }}>
                    <div className="text-xs font-bold" style={{ color: active?.dot || '#fbbf24' }}>{isVi ? active?.nameVi : active?.nameEn}</div>
                    <div className="text-[11px] mt-1" style={{ color: 'var(--theme-text-dim)' }}>{isVi ? 'Kỷ' : 'Period'}</div>
                  </div>
                </div>

                <div className="px-3 py-2 rounded-xl text-sm font-medium mb-5" style={{ background: `${active?.color || '#f59e0b'}16`, color: 'var(--theme-text)', border: `1px solid ${active?.color || '#f59e0b'}24` }}>
                  ✦ {active?.event}
                </div>

                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--theme-text-muted)', fontFamily: 'var(--font-body)' }}>
                  {active?.desc}
                </p>

                <div>
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: active?.dot || '#f59e0b' }}>
                    {isVi ? 'Loài tiêu biểu:' : 'Key Species:'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {active?.creatures?.map((c, idx) => (
                      <span
                        key={`${c}-${idx}`}
                        className="px-2.5 py-1 rounded-full text-xs"
                        style={{ background: 'rgba(245,158,11,0.08)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GeoTimeline;
