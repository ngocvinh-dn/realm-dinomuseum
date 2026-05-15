import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useParallax } from '../../hooks/useParallax';
import ScrollFloat from '../common/ScrollFloat';
import ScrollFloatBox from '../common/ScrollFloatBox';

// =====================================================
// DỮ LIỆU THỐNG NHẤT — cùng ID, cùng ảnh cho cả vi/en
// Chỉ text mô tả được dịch, ảnh và ID không đổi
// =====================================================
const allSpecimens = [
  {
    id: 'styracosaurus',
    name:     { vi: 'Styracosaurus',       en: 'Styracosaurus' },
    fullName: 'Styracosaurus albertensis',
    tag:      { vi: 'Styracosaurus',          en: 'Styracosaurus' },
    dinoImage: '/images/Styracosaurus%20.png',
    objectPosition: 'center center',
    imageScale: 1.08,
    period:   { vi: 'Kỷ Phấn Trắng muộn', en: 'Late Cretaceous' },
    age:      { vi: 'Khoảng 75–76 triệu năm', en: 'About 75–76 million years ago' },
    length: '5.1 m',
    weight:   { vi: '2.7 tấn', en: '2.7 tons' },
    location: 'Alberta, Canada',
    desc: {
      vi: 'Styracosaurus là khủng long sừng nổi bật với chiếc diềm cổ lớn và nhiều gai dài quanh đầu, được cho là dùng để phòng vệ và trình diễn.',
      en: 'Styracosaurus is a horned dinosaur known for its large frill and long spikes around the head, used for defense and display.',
    },
    highlight: true,
  },
  {
    id: 'coelophysis',
    name:     { vi: 'Coelophysis',  en: 'Coelophysis' },
    fullName: 'Coelophysis bauri',
    tag:      { vi: 'Coelophysis',   en: 'Coelophysis' },
    dinoImage: '/images/Coelophysis_bauri.png',
    objectPosition: 'center center',
    imageScale: 1.08,
    period:   { vi: 'Kỷ Tam Điệp muộn',          en: 'Late Triassic' },
    age:      { vi: 'Khoảng 203–196 triệu năm',   en: 'About 203–196 million years ago' },
    length: '2.6 m',
    weight:   { vi: '15–20 kg', en: '15–20 kg' },
    location: 'New Mexico, USA',
    desc: {
      vi: 'Coelophysis là khủng long theropod nhỏ, nhanh nhẹn với thân hình nhẹ, cổ dài và hàm hẹp đầy răng sắc nhọn.',
      en: 'Coelophysis is a small, agile early theropod dinosaur known for its lightweight body, long neck, and narrow jaw packed with sharp teeth.',
    },
    highlight: true,
  },
  {
    id: 'trex',
    name:     { vi: 'T-Rex', en: 'T-Rex' },
    fullName: 'Tyrannosaurus rex',
    tag:      { vi: 'Theropoda', en: 'Theropoda' },
    dinoImage: '/images/Tyrannosaurus_rex.png',
    objectPosition: 'center top',
    imageScale: 1,
    period:   { vi: 'Kỷ Phấn Trắng muộn', en: 'Late Cretaceous' },
    age:      { vi: '67 triệu năm',        en: '67 million yrs' },
    length: '12.3 m',
    weight:   { vi: '8.4 tấn', en: '8.4 tons' },
    location: 'South Dakota, USA (1990)',
    desc: {
      vi: 'Bộ xương T-Rex hoàn chỉnh nhất từng được phát hiện. "Sue" được đặt theo tên người tìm ra mẫu vật — Sue Hendrickson. Hiện trưng bày tại Field Museum, Chicago.',
      en: 'The most complete T-Rex skeleton ever found. "Sue" is named after its discoverer — Sue Hendrickson. Currently on display at the Field Museum, Chicago.',
    },
    highlight: true,
  },
  {
    id: 'triceratops',
    name:     { vi: 'Triceratops "Horridus"', en: '"Horridus" Triceratops' },
    fullName: 'Triceratops horridus',
    tag:      { vi: 'Ceratopsidae', en: 'Ceratopsidae' },
    dinoImage: '/images/Triceratops.png',
    objectPosition: 'center center',
    imageScale: 1.14,
    period:   { vi: 'Kỷ Phấn Trắng muộn', en: 'Late Cretaceous' },
    age:      { vi: '68 triệu năm',        en: '68 million yrs' },
    length: '9 m',
    weight:   { vi: '12 tấn', en: '12 tons' },
    location: 'Montana, USA',
    desc: {
      vi: 'Hộp sọ gần như hoàn chỉnh với 3 sừng đặc trưng. Triceratops là một trong các loài phổ biến nhất giai đoạn cuối Kỷ Phấn Trắng, cùng tồn tại với T-Rex.',
      en: 'Complete skull with its iconic 3 horns. Triceratops was the most common species of late Cretaceous — coexisting alongside T-Rex.',
    },
    highlight: false,
  },
];

// Hiển thị ảnh hiện vật trong card — hỗ trợ cả ảnh và emoji thay thế
const SketchfabSpecimen = ({ dinoImage, emoji, objectPosition, imageScale = 1 }) => {
  if (!dinoImage) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-8xl opacity-20 transition-opacity duration-500">{emoji || '🦕'}</span>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
      <img
        src={dinoImage}
        alt="Dinosaur specimen"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        style={{
          filter: 'brightness(0.78) saturate(1.08)',
          objectPosition: objectPosition || 'center center',
          transform: `scale(${imageScale * 1.08}) translateZ(0)`,
        }}
      />
      {/* Gradient tối từ dưới lên để text hiển thị rõ ràng */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, transparent 24%, rgba(10,8,4,0.88) 100%)' }}
      />
    </div>
  );
};

const cardViewport = { once: true, amount: 0.28 };

const cardImageVariants = {
  hidden: { opacity: 0, scale: 1.08, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardChipVariants = {
  hidden: { opacity: 0, y: -18, scale: 0.92 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const cardTitleVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  }),
};

const cardStatVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const SpecimenShowcase = ({ locale = 'vi' }) => {
  const [activeId, setActiveId] = useState(null);
  const isVi = locale === 'vi';

  // Luôn hiển thị 4 mẫu đầu — cùng ID và ảnh bất kể ngôn ngữ → không nhảy ảnh khi đổi locale
  const displaySpecimens = useMemo(() => allSpecimens.slice(0, 4), []);

  const sectionRef = useRef(null);
  const headingY = useParallax(sectionRef, ['30px', '-20px']);

  const handleMouseEnter = (id) => setActiveId(id);

  return (
    <section
      id="specimens"
      ref={sectionRef}
      className="section-pad relative overflow-hidden"
      style={{ background: 'var(--theme-bg-alt)' }}
    >
      {/* Background grid + dots kiểu fossil globe nhưng tinh gọn hơn */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 62% 42%, rgba(245,158,11,0.08) 0%, transparent 62%)' }}
        />
        {[6, 32, 58, 84].map((left, i) => (
          <div
            key={`specimen-v-${i}`}
            className="absolute top-0 bottom-0 w-px"
            style={{ left: `${left}%`, background: 'rgba(245,158,11,0.04)' }}
          />
        ))}
        {[14, 38, 62, 86].map((top, i) => (
          <div
            key={`specimen-h-${i}`}
            className="absolute left-0 right-0 h-px"
            style={{ top: `${top}%`, background: 'rgba(245,158,11,0.04)' }}
          />
        ))}
        <div
          className="absolute rounded-full"
          style={{
            top: '13%',
            left: '13%',
            width: 11,
            height: 11,
            background: '#f59e0b',
            boxShadow: '0 0 18px rgba(245,158,11,0.65)',
            opacity: 0.88,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: '69%',
            right: '16%',
            width: 9,
            height: 9,
            background: '#f59e0b',
            boxShadow: '0 0 16px rgba(245,158,11,0.58)',
            opacity: 0.82,
          }}
        />
        <div
          className="absolute h-px"
          style={{
            top: '14.4%',
            left: '13.8%',
            width: '29%',
            transform: 'rotate(16deg)',
            transformOrigin: 'left center',
            background: 'linear-gradient(90deg, rgba(245,158,11,0.12), rgba(245,158,11,0.03) 58%, transparent)',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Tiêu đề section — có parallax nhẹ */}
        <motion.div
          className="mb-16"
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="section-divider origin-left"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.9 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.p
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: '#f59e0b', fontFamily: 'var(--font-body)' }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.9 }}
            transition={{ delay: 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {isVi ? 'Hiện vật nổi bật' : 'Featured Specimens'}
          </motion.p>
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
              {isVi ? 'Những ngôi sao' : 'The Stars'}
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
              {isVi ? 'của bộ sưu tập' : 'of Our Collection'}
            </ScrollFloat>
          </div>
          <motion.p
            className="mt-4 max-w-xl text-sm leading-relaxed"
            style={{ color: 'var(--theme-text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ delay: 0.18, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            {isVi
              ? 'Những mẫu vật tiêu biểu nhất từ bộ sưu tập của bảo tàng — từ loài mới tải lên đến các huyền thoại cổ đại.'
              : 'The most iconic specimens from our museum collection — from newly uploaded finds to ancient legends.'}
          </motion.p>
        </motion.div>

        {/* Lưới các card hiện vật (2 cột) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displaySpecimens.map((s, i) => {
            const isActive = activeId === s.id;
            const name = s.name[locale];
            const period = s.period[locale];
            const age = s.age[locale];
            const tag = s.tag[locale];
            const desc = s.desc[locale];

            return (
              <ScrollFloatBox
                key={s.id}
                className="h-full"
                scrollStart="top bottom-=10%"
                scrollEnd="center center+=8%"
                xPercent={i % 2 === 0 ? -18 : 18}
                yPercent={30}
                scale={0.92}
                rotateX={6}
              >
              <motion.div
                className="specimen-card group"
                onMouseEnter={() => handleMouseEnter(s.id)}
                onMouseLeave={() => setActiveId(null)}
                style={{
                  border: s.highlight ? '1px solid rgba(245,158,11,0.35)' : undefined,
                  boxShadow: s.highlight ? '0 0 40px rgba(245,158,11,0.08)' : undefined,
                }}
              >
                {/* Vùng ảnh hiện vật */}
                <motion.div
                  className="specimen-image-shell relative overflow-hidden flex items-center justify-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={cardViewport}
                  variants={cardImageVariants}
                  style={{
                    background: 'linear-gradient(135deg, rgba(10,8,4,0.92) 0%, rgba(30,23,16,0.85) 100%)',
                  }}
                >
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(10,8,4,0.95))' }}
                  />
                  {/* Spotlight khi hover */}
                  <motion.div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(245,158,11,0.2) 0%, transparent 70%)' }}
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* Ảnh hiện vật */}
                  <SketchfabSpecimen
                    dinoImage={s.dinoImage}
                    emoji={s.emoji}
                    objectPosition={s.objectPosition}
                    imageScale={s.imageScale}
                  />

                  {/* Nhãn phân loại và nổi bật */}
                  <div className="absolute top-4 left-4 flex gap-2 z-20">
                    <motion.span
                      className="px-2.5 py-1 rounded-full text-xs font-medium"
                      custom={0.08 + i * 0.05}
                      initial="hidden"
                      whileInView="visible"
                      viewport={cardViewport}
                      variants={cardChipVariants}
                      style={{ background: 'rgba(10,8,4,0.8)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)', backdropFilter: 'blur(8px)', fontFamily: 'var(--font-body)' }}>
                      {tag}
                    </motion.span>
                    {s.highlight && (
                      <motion.span
                        className="px-2.5 py-1 rounded-full text-xs font-bold"
                        custom={0.14 + i * 0.05}
                        initial="hidden"
                        whileInView="visible"
                        viewport={cardViewport}
                        variants={cardChipVariants}
                        style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.5)', fontFamily: 'var(--font-body)' }}>
                        ✦ {isVi ? 'Nổi bật' : 'Featured'}
                      </motion.span>
                    )}
                  </div>

                  {/* Nhãn kỷ địa chất góc trên phải */}
                  <div className="absolute top-4 right-4 z-20">
                    <motion.span
                      className="px-2.5 py-1 rounded-full text-xs"
                      custom={0.18 + i * 0.05}
                      initial="hidden"
                      whileInView="visible"
                      viewport={cardViewport}
                      variants={cardChipVariants}
                      style={{ background: 'rgba(10,8,4,0.8)', color: 'rgba(245,240,232,0.7)', backdropFilter: 'blur(8px)', fontFamily: 'var(--font-body)' }}>
                      {period}
                    </motion.span>
                  </div>

                  {/* Tên hiện vật phía dưới ảnh */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-4 z-20"
                    custom={0.22 + i * 0.05}
                    initial="hidden"
                    whileInView="visible"
                    viewport={cardViewport}
                    variants={cardTitleVariants}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-serif font-bold text-xl"
                        style={{ fontFamily: 'var(--font-heading)', color: '#f5f0e8' }}>
                        {name}
                      </h3>
                    </div>
                    <p className="text-xs italic" style={{ color: 'rgba(245,240,232,0.5)', fontFamily: 'var(--font-body)' }}>
                      {s.fullName}
                    </p>
                  </motion.div>
                </motion.div>

                {/* Bảng thông số khoa học */}
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: isVi ? 'Niên đại' : 'Age',      value: age },
                      { label: isVi ? 'Kích thước' : 'Length', value: s.length },
                      { label: isVi ? 'Địa điểm' : 'Location', value: s.location.split(',')[0] },
                    ].map((stat, j) => (
                      <motion.div
                        key={j}
                        className="text-center p-2 rounded-lg"
                        custom={0.28 + i * 0.05 + j * 0.08}
                        initial="hidden"
                        whileInView="visible"
                        viewport={cardViewport}
                        variants={cardStatVariants}
                        style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.1)' }}>
                        <div className="text-xs font-bold" style={{ color: '#fbbf24', fontSize: '11px', fontFamily: 'var(--font-body)' }}>
                          {stat.value}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--theme-text-dim)', fontSize: '10px', fontFamily: 'var(--font-body)' }}>
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Panel chi tiết xuất hiện khi hover */}
                  <div className="detail-panel">
                    <p className="text-xs leading-relaxed mb-3"
                      style={{ color: 'var(--theme-text-muted)', fontStyle: 'italic', fontFamily: 'var(--font-body)' }}>
                      {desc}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(245,158,11,0.7)' }}>
                      <span>📍</span>
                      <span style={{ fontFamily: 'var(--font-body)' }}>{s.location}</span>
                    </div>
                  </div>

                  {/* Đường kẻ gradient xuất hiện khi hover */}
                  <div className="mt-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(90deg, #f59e0b, transparent)' }} />
                </div>
              </motion.div>
              </ScrollFloatBox>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SpecimenShowcase;
