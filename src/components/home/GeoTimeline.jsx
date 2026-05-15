import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useParallax } from '../../hooks/useParallax';
import { useDinosaurs } from '../../hooks/useDinosaurs';
import {
  getDinosaurImagePosition,
  getDinosaurImagePresentation,
} from '../../utils/dinosaurImage';
import ScrollFloat from '../common/ScrollFloat';
import ScrollFloatBox from '../common/ScrollFloatBox';

const FEATURED_DINOSAUR_SLUGS = {
  jurassic: ['camarasaurus'],
};

function prioritizeDinosaurs(periodDinosaurs, eraId) {
  const preferredSlugs = FEATURED_DINOSAUR_SLUGS[eraId] || [];
  if (!preferredSlugs.length) return periodDinosaurs;

  const prioritized = preferredSlugs
    .map((slug) => periodDinosaurs.find((dino) => dino.slug === slug))
    .filter(Boolean);

  const remaining = periodDinosaurs.filter(
    (dino) => !preferredSlugs.includes(dino.slug)
  );

  return [...prioritized, ...remaining];
}

const ERA_COLORS = ['#e07b39', '#4ade80', '#f59e0b'];
const ERA_DOTS = ['#fb923c', '#4ade80', '#f59e0b'];
const ERA_ICONS = ['🦕', '🦖', '🦕'];
const PERIOD_ORDER = ['triassic', 'jurassic', 'cretaceous'];

// Mapping tên loài → ảnh local
// Key: tên viết thường (có thể là tên khoa học, tên thường, tên Việt)
const DINO_IMAGES = {
  // Tiếng Anh / tên khoa học
  coelophysis:           '/images/Coelophysis_bauri.png',
  'coelophysis bauri':   '/images/Coelophysis_bauri.png',
  plateosaurus:          '/images/Plateosaurus.png',
  'plateosaurus engelhardti': '/images/Plateosaurus.png',
  eoraptor:              '/images/Eoraptor_lunensis.png',
  'eoraptor lunensis':   '/images/Eoraptor_lunensis.png',
  camarasaurus:          '/images/Camarasaurus.png',
  tyrannosaurus:         '/images/Tyrannosaurus_rex.png',
  'tyrannosaurus rex':   '/images/Tyrannosaurus_rex.png',
  't-rex':               '/images/Tyrannosaurus_rex.png',
  triceratops:           '/images/Triceratops.png',
  'triceratops horridus': '/images/Triceratops.png',
  styracosaurus:         '/images/Styracosaurus .png',
  'styracosaurus albertensis': '/images/Styracosaurus .png',
  velociraptor:          '/images/dino_velociraptor.png',
  // Tên tiếng Việt thường gặp (từ Supabase common_name_vi)
  'khủng long bao chúa': '/images/Tyrannosaurus_rex.png',
  'bạo long':            '/images/Tyrannosaurus_rex.png',
  'ba sừng':             '/images/Triceratops.png',
  'khủng long ba sừng':  '/images/Triceratops.png',
  'khủng long cổ dài':   '/images/Camarasaurus.png',
};

/** Lấy ảnh từ tên loài (normalize về lowercase, bỏ dấu tiếng Việt nếu cần) */
const getDinoImg = (name = '') => {
  const key = name.trim().toLowerCase();
  // Tìm khớp chính xác trước
  if (DINO_IMAGES[key]) return DINO_IMAGES[key];
  // Tìm khớp từ đầu (partial match cho tên khoa học)
  const partialKey = Object.keys(DINO_IMAGES).find((k) => key.startsWith(k) || k.startsWith(key));
  return partialKey ? DINO_IMAGES[partialKey] : null;
};

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
    creatures: ['Coelophysis', 'Plateosaurus', 'Eoraptor'],
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
    event: isVi ? 'Sauropod khổng lồ phát triển mạnh' : 'Giant sauropods flourish',
    desc: isVi
      ? 'Kỷ Jura là giai đoạn giữa của Mesozoi, khi khí hậu ấm ẩm tạo điều kiện cho rừng cây lan rộng, sauropod khổng lồ phát triển mạnh và những loài chim đầu tiên xuất hiện.'
      : 'The Jurassic was the middle Mesozoic period, when warm humid climates supported broad forests, giant sauropods flourished, and the first birds appeared.',
    color: ERA_COLORS[1],
    dot: ERA_DOTS[1],
    icon: ERA_ICONS[1],
    creatures: ['Camarasaurus'],
    image: '/images/Camarasaurus.png',
    objectPosition: 'center center',
    imageCredit: 'Camarasaurus',
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
    creatures: ['Tyrannosaurus', 'Triceratops', 'Styracosaurus'],
    image: '/images/Tyrannosaurus_rex.png',
    objectPosition: 'center 15%',
    imageCredit: 'Tyrannosaurus rex',
    tag: isVi ? 'Kỷ 79 triệu năm' : '79 Myr era',
  },
];

const GeoTimeline = ({ locale = 'vi' }) => {
  const isVi = locale === 'vi';
  const [activeId, setActiveId] = useState(null);
  const sectionRef = useRef(null);
  const headingY = useParallax(sectionRef, ['24px', '-16px']);
  const { dinosaurs } = useDinosaurs();

  const eons = useMemo(() => {
    const baseEons = fallbackEons(isVi);
    const dinosaursByPeriod = (dinosaurs || []).reduce((groups, dino) => {
      const periodSlug = dino.eras?.slug;
      if (!PERIOD_ORDER.includes(periodSlug)) return groups;
      groups[periodSlug] = [...(groups[periodSlug] || []), dino];
      return groups;
    }, {});

    return baseEons.map((era, index) => {
      const periodDinosaurs = prioritizeDinosaurs(
        dinosaursByPeriod[era.id] || [],
        era.id
      );
      const featuredDino = periodDinosaurs[0];
      const creatures = periodDinosaurs
        .map((dino) => (isVi ? (dino.common_name_vi || dino.scientific_name) : (dino.common_name_en || dino.scientific_name)))
        .filter(Boolean)
        .slice(0, 3);

      if (!featuredDino) return era;

      return {
        ...era,
        creatures: creatures.length ? creatures : era.creatures,
        image: featuredDino.image_url || era.image,
        objectPosition: getDinosaurImagePosition(featuredDino, era.objectPosition || (index === 0 ? '18% center' : 'center center')),
        imagePresentation: getDinosaurImagePresentation(featuredDino),
        imageCredit: featuredDino.common_name_en || featuredDino.scientific_name || era.imageCredit,
      };
    });
  }, [dinosaurs, isVi]);

  const active = activeId ? eons.find((e) => e.id === activeId) : null;
  const activeIndex = active ? eons.findIndex((e) => e.id === active.id) : -1;

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
          <div className="space-y-1">
            <ScrollFloat
              containerClassName="text-left"
              textClassName="text-[var(--theme-text)]"
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="top bottom-=5%"
              scrollEnd="center center"
              stagger={0.02}
            >
              {isVi ? 'Kỷ Mesozoi' : 'Mesozoic Era'}
            </ScrollFloat>
            <ScrollFloat
              containerClassName="text-left"
              textClassName="text-gradient-amber"
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="top bottom-=5%"
              scrollEnd="center center"
              stagger={0.018}
            >
              {isVi ? 'Thời đại của khủng long' : 'The Age of Dinosaurs'}
            </ScrollFloat>
          </div>
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
              const entryX = i % 2 === 0 ? -90 : 90;
              return (
                <motion.button
                  key={eon.id}
                  type="button"
                  onClick={() => setActiveId((currentId) => (currentId === eon.id ? null : eon.id))}
                  initial={{ opacity: 0, x: entryX, y: 42, scale: 0.92, rotateX: 5 }}
                  whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0 }}
                  viewport={{ once: false, amount: 0.25 }}
                  transition={{ delay: i * 0.14, duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4 }}
                  className="text-left rounded-2xl overflow-hidden"
                  style={{
                    background: 'var(--theme-card-bg)',
                    border: `1px solid ${isActive ? eon.color : 'var(--theme-border)'}`,
                    boxShadow: isActive
                      ? `0 0 0 1px ${eon.color}44, 0 0 38px ${eon.color}22, 0 18px 48px rgba(0,0,0,0.25)`
                      : '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'background 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                    transformOrigin: '50% 70%',
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

          {active && (
          <ScrollFloatBox
            key={`timeline-float-${active?.id}`}
            className="mt-2"
            triggerMode="mount"
            animationDuration={1.25}
            ease="back.out(1.15)"
            xPercent={activeIndex % 2 === 0 ? -10 : 10}
            yPercent={22}
            scale={0.93}
            rotateX={4}
          >
          <motion.div
            key={active?.id}
            className="rounded-3xl overflow-hidden"
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

              </div>
            </div>
          </motion.div>
          </ScrollFloatBox>
          )}
        </div>
      </div>
    </section>
  );
};

export default GeoTimeline;
