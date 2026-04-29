import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParallax } from '../../hooks/useParallax';
import { useDinosaurs } from '../../hooks/useDinosaurs';

const GeoTimeline = ({ locale = 'vi' }) => {
  const isVi = locale === 'vi';
  const [active, setActive] = useState(null);
  const sectionRef = useRef(null);
  const headingY = useParallax(sectionRef, ['30px', '-18px']);
  const { dinosaurs } = useDinosaurs();
  const eons = (dinosaurs || []).slice(0, 3).map((dino, index) => ({
    id: dino.id,
    nameVi: dino.eras?.name_vi || dino.common_name_vi || dino.scientific_name,
    nameEn: dino.eras?.name_en || dino.common_name_en || dino.scientific_name,
    mya: dino.eras?.mya || dino.eras?.period_range || ['252 – 201', '201 – 145', '145 – 66'][index] || 'Mesozoic',
    duration: dino.eras?.duration_label || 'Mesozoic Era',
    color: ['#e07b39', '#4ade80', '#f59e0b'][index] || '#f59e0b',
    creature: ['🦕', '🦖', '🦕'][index] || '🦕',
    image: dino.image_url,
    imageCredit: dino.common_name_en || dino.scientific_name,
    desc: dino.description_en || dino.description_vi || '',
    climate: dino.habitat_en || dino.habitat_vi || 'Mesozoic environment',
    creatures: [dino.common_name_en || dino.scientific_name],
    event: dino.eras?.name_en ? `${dino.eras.name_en}` : 'Mesozoic era',
    eventColor: 'rgba(245,158,11,0.2)',
  }));

  const fallbackEons = [
    { id: 'triassic', nameVi: 'Kỷ Tam Điệp', nameEn: 'Triassic', mya: '252 – 201', duration: '51 million years', color: '#e07b39', creature: '🦕', image: null, imageCredit: 'Triassic life', desc: 'The first dinosaurs appeared and started to diversify across Pangaea.', climate: 'Hot and dry', creatures: ['Coelophysis', 'Plateosaurus'], event: 'First dinosaurs emerge', eventColor: 'rgba(224,123,57,0.2)' },
    { id: 'jurassic', nameVi: 'Kỷ Jura', nameEn: 'Jurassic', mya: '201 – 145', duration: '56 million years', color: '#4ade80', creature: '🦖', image: null, imageCredit: 'Jurassic life', desc: 'Large sauropods dominated vast landscapes with rich vegetation.', climate: 'Warm and humid', creatures: ['Brachiosaurus', 'Allosaurus'], event: 'Sauropod dominance', eventColor: 'rgba(74,222,128,0.2)' },
    { id: 'cretaceous', nameVi: 'Kỷ Phấn Trắng', nameEn: 'Cretaceous', mya: '145 – 66', duration: '79 million years', color: '#f59e0b', creature: '🦕', image: null, imageCredit: 'Cretaceous life', desc: 'Flowering plants spread and many iconic dinosaurs evolved before extinction.', climate: 'Diverse climates', creatures: ['Tyrannosaurus', 'Triceratops'], event: 'K-Pg extinction event', eventColor: 'rgba(245,158,11,0.2)' },
  ];

  const displayEons = eons.length ? eons : fallbackEons;

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="section-pad relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--theme-bg) 0%, var(--theme-bg-alt) 100%)' }}
    >
      {/* Các đường ngang mờ làm texture nền */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-full h-px pointer-events-none"
          style={{ top: `${20 + i * 15}%`, background: 'rgba(245,158,11,0.03)' }}
        />
      ))}

      <div className="relative max-w-7xl mx-auto">
        {/* Tiêu đề section Dòng Thời Gian Địa Chất — có parallax nhẹ */}
        <motion.div
          className="mb-16"
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="section-divider" />
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#f59e0b' }}>
            Geological Timeline
          </p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--theme-text)' }}>
            Mesozoic Era —{' '}
            <span className="text-gradient-amber">The Age of Dinosaurs</span>
          </h2>
          <p className="mt-4 text-sm" style={{ color: 'var(--theme-text-muted)', fontFamily: 'Lora, serif', fontStyle: 'italic' }}>
            252 – 66 million years ago • Click each period to explore in detail
          </p>
        </motion.div>

        {/* Timeline — 3 card theo chiều ngang */}
        <div className="relative">
          {/* Đường kết nối ngang giữa các card (chỉ hiện trên desktop) */}
          <div
            className="absolute top-16 left-0 right-0 h-0.5 hidden md:block"
            style={{ background: 'linear-gradient(90deg, rgba(245,158,11,0.15), rgba(245,158,11,0.4), rgba(245,158,11,0.15))' }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayEons.map((eon, i) => {
              const isActive = active?.id === eon.id;
              return (
                <motion.div
                  key={eon.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6, ease: 'easeOut' }}
                >
                  {/* Chấm tròn trên đường timeline (chỉ hiện trên desktop) */}
                  <div className="hidden md:flex justify-center mb-6 relative">
                    <motion.div
                      className="w-5 h-5 rounded-full border-2 cursor-pointer z-10"
                      style={{
                        background: isActive ? eon.color : 'var(--theme-bg)',
                        borderColor: eon.color,
                        boxShadow: isActive ? `0 0 20px ${eon.color}60` : 'none',
                      }}
                      animate={isActive ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                      transition={{ repeat: isActive ? Infinity : 0, duration: 2 }}
                      onClick={() => setActive(isActive ? null : eon)}
                    />
                    {/* Nhãn năm phía trên chấm */}
                    <div
                      className="absolute -top-7 text-xs font-mono text-center whitespace-nowrap"
                      style={{ color: 'rgba(245,158,11,0.5)', fontSize: '10px' }}
                    >
                      {eon.mya} Ma
                    </div>
                  </div>

                  {/* Card thông tin từng kỷ địa chất */}
                  <motion.div
                    className="relative rounded-2xl overflow-hidden cursor-pointer"
                    style={{
                      background: isActive ? eon.eventColor : 'var(--theme-card-bg)',
                      border: `1px solid ${isActive ? eon.color : 'rgba(245,158,11,0.12)'}`,
                      boxShadow: isActive ? `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${eon.color}20` : 'none',
                    }}
                    whileHover={{ y: -4, borderColor: eon.color }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setActive(isActive ? null : eon)}
                  >
                    {/* Thanh màu đặc trưng phía trên card */}
                    <div className="h-1" style={{ background: eon.color }} />

                    {/* Ảnh đặc trưng của từng kỷ (hiển thị khi active) */}
                    <AnimatePresence>
                      {isActive && eon.image && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: '180px' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4 }}
                          className="overflow-hidden relative"
                        >
                          <img
                            src={eon.image}
                            alt={eon.imageCredit}
                            className="w-full h-full object-cover"
                            style={{
                              objectPosition: 'center center',
                              filter: 'brightness(0.8) saturate(1.1)',
                            }}
                          />
                          {/* Gradient tối từ dưới lên để text dễ đọc */}
                          <div
                            className="absolute inset-0"
                            style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(10,8,4,0.8) 100%)' }}
                          />
                          {/* Nhãn tên loài phía dưới ảnh */}
                          <div className="absolute bottom-2 right-3">
                            <span className="text-xs italic" style={{ color: 'rgba(245,240,232,0.6)', fontFamily: 'Nunito, sans-serif' }}>
                              {eon.imageCredit}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="p-6">
                      {/* Icon + tên kỷ */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-4xl mb-2">{eon.creature}</div>
                          <h3
                            className="font-serif font-bold text-xl leading-tight"
                            style={{ fontFamily: 'Playfair Display, serif', color: isActive ? eon.color : 'var(--theme-text)' }}
                          >
                            {isVi ? eon.nameVi : eon.nameEn}
                          </h3>
                          <p className="text-xs mt-0.5 italic" style={{ color: 'var(--theme-text-muted)' }}>
                            {isVi ? eon.nameEn : eon.nameVi}
                          </p>
                        </div>
                        {/* Huy hiệu khoảng thời gian */}
                        <div
                          className="flex-shrink-0 text-right px-3 py-2 rounded-xl"
                          style={{ background: `${eon.color}18`, border: `1px solid ${eon.color}40` }}
                        >
                          <div className="text-xs font-bold" style={{ color: eon.color }}>{eon.mya}</div>
                          <div className="text-xs" style={{ color: 'var(--theme-text-dim)', fontSize: '10px' }}>Mya</div>
                        </div>
                      </div>

                      {/* Nhãn thời gian và khí hậu */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs"
                          style={{ background: `${eon.color}15`, color: eon.color, border: `1px solid ${eon.color}30` }}
                        >
                          ⏳ {eon.duration}
                        </span>
                        <span
                          className="px-2.5 py-1 rounded-full text-xs"
                          style={{ background: 'rgba(245,158,11,0.06)', color: 'var(--theme-text-muted)', border: '1px solid rgba(245,158,11,0.1)' }}
                        >
                          🌍 {eon.climate}
                        </span>
                      </div>

                      {/* Sự kiện nổi bật của kỷ */}
                      <div
                        className="px-3 py-1.5 rounded-lg text-xs font-medium mb-4"
                        style={{ background: eon.eventColor, color: 'var(--theme-text)', border: `1px solid ${eon.color}25` }}
                      >
                        ✦ {eon.event}
                      </div>

                      {/* Mô tả chi tiết — chỉ hiện khi card được click (active) */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35 }}
                            className="overflow-hidden"
                          >
                            <p
                              className="text-sm leading-relaxed mb-4"
                              style={{ color: 'var(--theme-text-muted)', fontFamily: 'Lora, serif' }}
                            >
                              {eon.desc}
                            </p>
                            {/* Key Species list */}
                            <div>
                              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(245,158,11,0.6)' }}>
                                Key Species:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {eon.creatures.map((c, j) => (
                                  <span
                                    key={j}
                                    className="px-2.5 py-1 rounded-full text-xs"
                                    style={{ background: 'rgba(245,158,11,0.08)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}
                                  >
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Gợi ý click để mở/thu gọn */}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs" style={{ color: 'var(--theme-text-dim)' }}>
                          {isActive ? 'Click to collapse' : 'Click to explore'}
                        </span>
                        <motion.span
                          animate={{ rotate: isActive ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ color: 'rgba(245,158,11,0.5)', fontSize: '12px' }}
                        >
                          ▼
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Thanh tỷ lệ thời gian ở cuối section */}
        <motion.div
          className="mt-12 flex items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-xs whitespace-nowrap" style={{ color: 'var(--theme-text-dim)' }}>252 Ma</span>
          <div className="flex-1 relative h-2 rounded-full overflow-hidden">
            <div className="absolute inset-0 flex">
              {/* Phân đoạn tỷ lệ theo thời gian của 3 kỷ */}
              <div className="flex-none" style={{ width: '27%', background: displayEons[0].color, opacity: 0.5 }} />
              <div className="flex-none" style={{ width: '30%', background: displayEons[1].color, opacity: 0.5 }} />
              <div className="flex-none" style={{ width: '43%', background: displayEons[2].color, opacity: 0.5 }} />
            </div>
          </div>
          <span className="text-xs whitespace-nowrap" style={{ color: 'var(--theme-text-dim)' }}>66 Ma</span>
        </motion.div>
        {/* Nhãn tên các kỷ bên dưới thanh tỷ lệ */}
        <div className="flex mt-1 gap-0" style={{ paddingLeft: '36px', paddingRight: '36px' }}>
          {displayEons.map((e, i) => (
            <div
              key={i}
              className="text-center"
              style={{ width: i === 0 ? '27%' : i === 1 ? '30%' : '43%', fontSize: '9px', color: e.color, opacity: 0.7 }}
            >
              {e.nameEn}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GeoTimeline;
