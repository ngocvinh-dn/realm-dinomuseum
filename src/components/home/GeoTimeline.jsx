import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const eons = [
  {
    id: 'triassic',
    nameVi: 'Kỷ Tam Điệp',
    nameEn: 'Triassic',
    mya: '252 – 201',
    duration: '51 triệu năm',
    color: '#e07b39',
    creature: '🦕',
    creatureVi: 'Khủng long đầu tiên',
    image: '/images/triassic_eoraptor.png',
    imageCredit: 'Eoraptor lunensis',
    desc: 'Khủng long xuất hiện lần đầu tiên trên Trái Đất. Thú nhỏ sống sót sau tuyệt chủng Permian. Pangaea bắt đầu tách vỡ thành các lục địa. Khí hậu khô, nóng — sa mạc rộng lớn bao phủ nội địa.',
    climate: 'Khô nóng — sa mạc rộng lớn',
    creatures: ['Eoraptor', 'Coelophysis', 'Plateosaurus', 'Herrerasaurus'],
    event: 'Khủng long xuất hiện',
    eventColor: 'rgba(224,123,57,0.25)',
  },
  {
    id: 'jurassic',
    nameVi: 'Kỷ Jura',
    nameEn: 'Jurassic',
    mya: '201 – 145',
    duration: '56 triệu năm',
    color: '#4ade80',
    creature: '🦖',
    creatureVi: 'Khủng long thống trị',
    image: '/images/jurassic_brachiosaurus.jpg',
    imageCredit: 'Brachiosaurus altithorax',
    desc: 'Thời đại vàng của khủng long — Stegosaurus, Brachiosaurus, Allosaurus thống trị khắp nơi. Pangaea tách ra, hình thành Đại Tây Dương. Chim đầu tiên tiến hóa từ khủng long theropod nhỏ. Khí hậu ấm, ẩm với rừng rậm rộng lớn.',
    climate: 'Ấm ẩm — rừng rậm bao phủ',
    creatures: ['Brachiosaurus', 'Stegosaurus', 'Allosaurus', 'Archaeopteryx'],
    event: 'Kỷ hoàng kim khủng long',
    eventColor: 'rgba(74,222,128,0.2)',
  },
  {
    id: 'cretaceous',
    nameVi: 'Kỷ Phấn Trắng',
    nameEn: 'Cretaceous',
    mya: '145 – 66',
    duration: '79 triệu năm',
    color: '#f59e0b',
    creature: '🦕',
    creatureVi: 'T-Rex & Triceratops',
    image: '/images/cretaceous_trex.jpg',
    imageCredit: 'Tyrannosaurus rex "Sue"',
    desc: 'T-Rex thống trị — kẻ săn mồi lớn nhất trong lịch sử. Hoa quả đầu tiên xuất hiện. Kết thúc bằng sự kiện K-Pg: tiểu hành tinh Chicxulub đường kính 10km đâm vào Yucatán, Mexico — xóa sổ 75% sự sống trên Trái Đất, bao gồm toàn bộ khủng long không bay.',
    climate: 'Ấm, không có băng cực — mực nước biển cao',
    creatures: ['T-Rex', 'Triceratops', 'Velociraptor', 'Spinosaurus'],
    event: '☄️ Tuyệt chủng K-Pg — 66 triệu năm trước',
    eventColor: 'rgba(239,68,68,0.2)',
  },
];

const GeoTimeline = () => {
  const [active, setActive] = useState(null);

  return (
    <section
      id="timeline"
      className="section-pad relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0804 0%, #0d0b06 100%)' }}
    >
      {/* Subtle background lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-full h-px pointer-events-none"
          style={{ top: `${20 + i * 15}%`, background: 'rgba(245,158,11,0.03)' }}
        />
      ))}

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-divider" />
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#f59e0b' }}>
            Dòng Thời Gian Địa Chất
          </p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Đại Trung Sinh —{' '}
            <span className="text-gradient-amber">Kỷ Nguyên Khủng Long</span>
          </h2>
          <p className="mt-4 text-sm" style={{ color: 'rgba(245,240,232,0.45)', fontFamily: 'Lora, serif', fontStyle: 'italic' }}>
            252 – 66 triệu năm trước • Click vào từng kỷ để khám phá chi tiết
          </p>
        </motion.div>

        {/* Timeline — 3 cards horizontal */}
        <div className="relative">
          {/* Connecting line */}
          <div
            className="absolute top-16 left-0 right-0 h-0.5 hidden md:block"
            style={{ background: 'linear-gradient(90deg, rgba(245,158,11,0.15), rgba(245,158,11,0.4), rgba(245,158,11,0.15))' }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eons.map((eon, i) => {
              const isActive = active?.id === eon.id;
              return (
                <motion.div
                  key={eon.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6, ease: 'easeOut' }}
                >
                  {/* Period dot on timeline */}
                  <div className="hidden md:flex justify-center mb-6 relative">
                    <motion.div
                      className="w-5 h-5 rounded-full border-2 cursor-pointer z-10"
                      style={{
                        background: isActive ? eon.color : 'rgba(17,14,8,0.9)',
                        borderColor: eon.color,
                        boxShadow: isActive ? `0 0 20px ${eon.color}60` : 'none',
                      }}
                      animate={isActive ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                      transition={{ repeat: isActive ? Infinity : 0, duration: 2 }}
                      onClick={() => setActive(isActive ? null : eon)}
                    />
                    {/* Year label */}
                    <div
                      className="absolute -top-7 text-xs font-mono text-center whitespace-nowrap"
                      style={{ color: 'rgba(245,158,11,0.5)', fontSize: '10px' }}
                    >
                      {eon.mya} Ma
                    </div>
                  </div>

                  {/* Card */}
                  <motion.div
                    className="relative rounded-2xl overflow-hidden cursor-pointer"
                    style={{
                      background: isActive ? eon.eventColor : 'rgba(17,14,8,0.85)',
                      border: `1px solid ${isActive ? eon.color : 'rgba(245,158,11,0.12)'}`,
                      boxShadow: isActive ? `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${eon.color}20` : 'none',
                    }}
                    whileHover={{ y: -4, borderColor: eon.color }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setActive(isActive ? null : eon)}
                  >
                    {/* Top color bar */}
                    <div className="h-1" style={{ background: eon.color }} />

                    <div className="p-6">
                      {/* Icon + name */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-4xl mb-2">{eon.creature}</div>
                          <h3
                            className="font-serif font-bold text-xl leading-tight"
                            style={{ fontFamily: 'Playfair Display, serif', color: isActive ? eon.color : '#f5f0e8' }}
                          >
                            {eon.nameVi}
                          </h3>
                          <p className="text-xs mt-0.5 italic" style={{ color: 'rgba(245,240,232,0.45)' }}>
                            {eon.nameEn}
                          </p>
                        </div>
                        <div
                          className="flex-shrink-0 text-right px-3 py-2 rounded-xl"
                          style={{ background: `${eon.color}18`, border: `1px solid ${eon.color}40` }}
                        >
                          <div className="text-xs font-bold" style={{ color: eon.color }}>{eon.mya}</div>
                          <div className="text-xs" style={{ color: 'rgba(245,240,232,0.4)', fontSize: '10px' }}>Triệu năm</div>
                        </div>
                      </div>

                      {/* Duration + climate */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs"
                          style={{ background: `${eon.color}15`, color: eon.color, border: `1px solid ${eon.color}30` }}
                        >
                          ⏳ {eon.duration}
                        </span>
                        <span
                          className="px-2.5 py-1 rounded-full text-xs"
                          style={{ background: 'rgba(245,158,11,0.06)', color: 'rgba(245,240,232,0.6)', border: '1px solid rgba(245,158,11,0.1)' }}
                        >
                          🌍 {eon.climate}
                        </span>
                      </div>

                      {/* Event badge */}
                      <div
                        className="px-3 py-1.5 rounded-lg text-xs font-medium mb-4"
                        style={{ background: eon.eventColor, color: 'rgba(245,240,232,0.8)', border: `1px solid ${eon.color}25` }}
                      >
                        ✦ {eon.event}
                      </div>

                      {/* Description — show when active */}
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
                              style={{ color: 'rgba(245,240,232,0.7)', fontFamily: 'Lora, serif' }}
                            >
                              {eon.desc}
                            </p>
                            {/* Creatures list */}
                            <div>
                              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(245,158,11,0.6)' }}>
                                Loài đặc trưng:
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

                      {/* Toggle hint */}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs" style={{ color: 'rgba(245,240,232,0.3)' }}>
                          {isActive ? 'Click để thu gọn' : 'Click để xem chi tiết'}
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

        {/* Scale bar */}
        <motion.div
          className="mt-12 flex items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-xs whitespace-nowrap" style={{ color: 'rgba(245,240,232,0.3)' }}>252 Ma</span>
          <div className="flex-1 relative h-2 rounded-full overflow-hidden">
            <div className="absolute inset-0 flex">
              <div className="flex-none" style={{ width: '27%', background: eons[0].color, opacity: 0.5 }} />
              <div className="flex-none" style={{ width: '30%', background: eons[1].color, opacity: 0.5 }} />
              <div className="flex-none" style={{ width: '43%', background: eons[2].color, opacity: 0.5 }} />
            </div>
          </div>
          <span className="text-xs whitespace-nowrap" style={{ color: 'rgba(245,240,232,0.3)' }}>66 Ma</span>
        </motion.div>
        <div className="flex mt-1 gap-0" style={{ paddingLeft: '36px', paddingRight: '36px' }}>
          {eons.map((e, i) => (
            <div
              key={i}
              className="text-center"
              style={{ width: i === 0 ? '27%' : i === 1 ? '30%' : '43%', fontSize: '9px', color: e.color, opacity: 0.7 }}
            >
              {e.nameVi}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GeoTimeline;
