import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const specimens = [
  {
    id: 'trex',
    emoji: '🦖',
    name: '"Sue" T-Rex',
    fullName: 'Tyrannosaurus rex',
    tag: 'Theropoda',
    image: '/images/specimen_trex.png',
    period: 'Cretaceous cuối',
    age: '67 triệu năm',
    length: '12.3 m',
    weight: '8.4 tấn',
    location: 'South Dakota, Mỹ (1990)',
    desc: 'Bộ xương T-Rex hoàn chỉnh nhất từng tìm thấy. "Sue" là tên của người phát hiện — Sue Hendrickson. Hiện trưng bày tại Field Museum, Chicago.',
    highlight: true,
  },
  {
    id: 'triceratops',
    emoji: '🦏',
    name: '"Horridus" Triceratops',
    fullName: 'Triceratops horridus',
    tag: 'Ceratopsidae',
    image: null,
    period: 'Cretaceous cuối',
    age: '68 triệu năm',
    length: '9 m',
    weight: '12 tấn',
    location: 'Montana, Mỹ',
    desc: 'Hộp sọ hoàn chỉnh với 3 sừng đặc trưng. Triceratops là loài phổ biến nhất cuối Cretaceous — cùng thời điểm với T-Rex.',
    highlight: false,
  },
  {
    id: 'amber',
    emoji: '🌿',
    name: 'Hổ Phách Myanmar',
    fullName: 'Burmite Amber Inclusion',
    tag: 'Mesozoic Amber',
    image: '/images/specimen_amber.png',
    period: 'Cretaceous giữa',
    age: '99 triệu năm',
    length: '3.2 cm',
    weight: '8.7 g',
    location: 'Myanmar (Miến Điện)',
    desc: 'Nhựa cây hóa thạch chứa sinh vật nguyên vẹn từ 99 triệu năm trước — côn trùng, lông khủng long, và thậm chí cả nòng nọc.',
    highlight: false,
  },
  {
    id: 'vn-tooth',
    emoji: '🦷',
    name: 'Răng Theropod Việt Nam',
    fullName: 'Indosuchus sp. (cf.)',
    tag: 'Phát Hiện VN',
    image: null,
    period: 'Jurassic – Cretaceous',
    age: '80–130 triệu năm',
    length: '4.7 cm',
    weight: null,
    location: 'Đồng Nai & Bình Thuận, VN',
    desc: 'Một trong những bằng chứng hiếm hoi về sự tồn tại của khủng long trên lãnh thổ Việt Nam — khủng long theropod kích thước trung bình.',
    highlight: false,
  },
];

const SpecimenShowcase = () => {
  const [activeId, setActiveId] = useState(null);

  return (
    <section
      id="specimens"
      className="section-pad relative overflow-hidden"
      style={{ background: '#110e08' }}
    >
      {/* Background diagonal pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(245,158,11,0.5) 0px, rgba(245,158,11,0.5) 1px, transparent 1px, transparent 40px)',
        }}
      />

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
            Hiện Vật Nổi Bật
          </p>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Những Ngôi Sao{' '}
            <span className="text-gradient-amber">Của Bảo Tàng</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: 'rgba(245,240,232,0.5)', fontFamily: 'Lora, serif', fontStyle: 'italic' }}>
            Hover để xem thông số khoa học chi tiết. Mỗi hiện vật là một câu chuyện hàng triệu năm.
          </p>
        </motion.div>

        {/* Specimen grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specimens.map((s, i) => {
            const isActive = activeId === s.id;
            return (
              <motion.div
                key={s.id}
                className="specimen-card group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                onMouseEnter={() => setActiveId(s.id)}
                onMouseLeave={() => setActiveId(null)}
                style={{
                  border: s.highlight ? '1px solid rgba(245,158,11,0.35)' : undefined,
                  boxShadow: s.highlight ? '0 0 40px rgba(245,158,11,0.08)' : undefined,
                }}
              >
                {/* Image / Visual area */}
                <div
                  className="relative h-56 overflow-hidden"
                  style={{
                    background: s.image
                      ? `url(${s.image}) center/cover`
                      : 'linear-gradient(135deg, rgba(17,14,8,0.9) 0%, rgba(30,23,16,0.7) 100%)',
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(10,8,4,0.95))' }}
                  />
                  {/* Spotlight hover effect */}
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(245,158,11,0.2) 0%, transparent 70%)' }}
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* Emoji center */}
                  {!s.image && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-8xl opacity-20 group-hover:opacity-35 transition-opacity duration-500">{s.emoji}</span>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ background: 'rgba(10,8,4,0.8)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)', backdropFilter: 'blur(8px)' }}
                    >
                      {s.tag}
                    </span>
                    {s.highlight && (
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.5)' }}
                      >
                        ✦ Tiêu Biểu
                      </span>
                    )}
                  </div>

                  {/* Period badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs"
                      style={{ background: 'rgba(10,8,4,0.8)', color: 'rgba(245,240,232,0.7)', backdropFilter: 'blur(8px)' }}
                    >
                      {s.period}
                    </span>
                  </div>

                  {/* Name overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xl">{s.emoji}</span>
                      <h3 className="font-serif font-bold text-xl" style={{ fontFamily: 'Playfair Display, serif', color: '#f5f0e8' }}>
                        {s.name}
                      </h3>
                    </div>
                    <p className="text-xs italic" style={{ color: 'rgba(245,240,232,0.5)' }}>{s.fullName}</p>
                  </div>
                </div>

                {/* Detail panel — always visible but expand on hover */}
                <div className="p-5">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: 'Tuổi', value: s.age },
                      { label: 'Chiều dài', value: s.length },
                      { label: 'Địa điểm', value: s.location.split(',')[0] },
                    ].map((stat, j) => (
                      <div
                        key={j}
                        className="text-center p-2 rounded-lg"
                        style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.1)' }}
                      >
                        <div className="text-xs font-bold" style={{ color: '#fbbf24', fontSize: '11px' }}>{stat.value}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'rgba(245,240,232,0.4)', fontSize: '10px' }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Expandable description */}
                  <div className="detail-panel">
                    <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(245,240,232,0.6)', fontStyle: 'italic', fontFamily: 'Lora, serif' }}>
                      {s.desc}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(245,158,11,0.7)' }}>
                      <span>📍</span>
                      <span>{s.location}</span>
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div
                    className="mt-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(90deg, #f59e0b, transparent)' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SpecimenShowcase;
