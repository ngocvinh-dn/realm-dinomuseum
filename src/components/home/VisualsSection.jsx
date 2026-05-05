import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useParallax } from '../../hooks/useParallax';
const specimenCards = [
  {
    id: 'uploaded-fossil-styracosaurus',
    dinoImage: '/images/Styracosaurus%20.png',
    objectPosition: 'center center',
    imageScale: 1.08,
    highlight: true,
    vi: {
      name: 'Styracosaurus',
      fullName: 'Styracosaurus albertensis',
      tag: 'Mới upload',
      period: 'Kỷ Phấn Trắng muộn',
      age: 'Khoảng 75–76 triệu năm',
      length: '5.1 m',
      weight: '2.7 tấn',
      location: 'Alberta, Canada',
      desc: 'Styracosaurus là khủng long sừng nổi bật với chiếc diềm cổ lớn và nhiều gai dài quanh đầu, được cho là dùng để phòng vệ và trình diễn.',
    },
    en: {
      name: 'Styracosaurus',
      fullName: 'Styracosaurus albertensis',
      tag: 'New upload',
      period: 'Late Cretaceous',
      age: 'About 75–76 million years ago',
      length: '5.1 m',
      weight: '2.7 tons',
      location: 'Alberta, Canada',
      desc: 'Styracosaurus is a horned dinosaur known for its large frill and long spikes around the head, used for defense and display.',
    },
  },
  {
    id: 'uploaded-fossil-coelophysis',
    dinoImage: '/images/Coelophysis_bauri.png',
    objectPosition: 'center center',
    imageScale: 1.08,
    highlight: true,
    vi: {
      name: 'Mẫu vật tải lên #2',
      fullName: 'Uploaded specimen #2',
      tag: 'Mới upload',
      period: 'Kỷ Tam Điệp muộn',
      age: 'Khoảng 203–196 triệu năm',
      length: '2.6 m',
      weight: '15–20 kg',
      location: 'New Mexico, USA',
      desc: 'Mẫu hiện vật mới được tải lên thư mục public/images và được hiển thị trực tiếp ở đầu danh sách.',
    },
    en: {
      name: 'Coelophysis',
      fullName: 'Coelophysis bauri',
      tag: 'New upload',
      period: 'Late Triassic',
      age: 'About 203–196 million years ago',
      length: '2.6 m',
      weight: '15–20 kg',
      location: 'New Mexico, USA',
      desc: 'Coelophysis is a small, agile early theropod dinosaur known for its lightweight body, long neck, and narrow jaw packed with sharp teeth.',
    },
  },
  {
    id: 'trex',
    dinoImage: '/images/dino_trex.png',
    objectPosition: 'center top',
    imageScale: 1,
    highlight: true,
    vi: {
      name: 'T-Rex',
      fullName: 'Tyrannosaurus rex',
      tag: 'Theropoda',
      period: 'Kỷ Phấn Trắng muộn',
      age: '67 triệu năm',
      length: '12.3 m',
      weight: '8.4 tấn',
      location: 'South Dakota, USA (1990)',
      desc: 'Bộ xương T-Rex hoàn chỉnh nhất từng được phát hiện. “Sue” được đặt theo tên người tìm ra mẫu vật — Sue Hendrickson. Hiện trưng bày tại Field Museum, Chicago.',
    },
    en: {
      name: 'T-Rex',
      fullName: 'Tyrannosaurus rex',
      tag: 'Theropoda',
      period: 'Late Cretaceous',
      age: '67 million yrs',
      length: '12.3 m',
      weight: '8.4 tons',
      location: 'South Dakota, USA (1990)',
      desc: 'The most complete T-Rex skeleton ever found. “Sue” is named after its discoverer — Sue Hendrickson. Currently on display at the Field Museum, Chicago.',
    },
  },
  {
    id: 'triceratops',
    dinoImage: '/images/dino_triceratops.png',
    objectPosition: 'center center',
    imageScale: 1.14,
    highlight: false,
    vi: {
      name: 'Triceratops "Horridus"',
      fullName: 'Triceratops horridus',
      tag: 'Ceratopsidae',
      period: 'Kỷ Phấn Trắng muộn',
      age: '68 triệu năm',
      length: '9 m',
      weight: '12 tấn',
      location: 'Montana, USA',
      desc: 'Hộp sọ gần như hoàn chỉnh với 3 sừng đặc trưng. Triceratops là một trong các loài phổ biến nhất giai đoạn cuối Kỷ Phấn Trắng, cùng tồn tại với T-Rex.',
    },
    en: {
      name: '"Horridus" Triceratops',
      fullName: 'Triceratops horridus',
      tag: 'Ceratopsidae',
      period: 'Late Cretaceous',
      age: '68 million yrs',
      length: '9 m',
      weight: '12 tons',
      location: 'Montana, USA',
      desc: 'Complete skull with its iconic 3 horns. Triceratops was the most common species of late Cretaceous — coexisting alongside T-Rex.',
    },
  },
];

const fallbackSpecimens = {
  vi: [
    {
      id: 'trex',
      name: 'T-Rex',
      fullName: 'Tyrannosaurus rex',
      tag: 'Theropoda',
      dinoImage: '/images/dino_trex.png',
      objectPosition: 'center top',
      period: 'Kỷ Phấn Trắng muộn',
      age: '67 triệu năm',
      length: '12.3 m',
      weight: '8.4 tấn',
      location: 'South Dakota, USA (1990)',
      desc: 'Bộ xương T-Rex hoàn chỉnh nhất từng được phát hiện. “Sue” được đặt theo tên người tìm ra mẫu vật — Sue Hendrickson. Hiện trưng bày tại Field Museum, Chicago.',
      highlight: true,
    },
    {
      id: 'triceratops',
      name: 'Triceratops "Horridus"',
      fullName: 'Triceratops horridus',
      tag: 'Ceratopsidae',
      dinoImage: '/images/dino_triceratops.png',
      objectPosition: 'center center',
      imageScale: 1.14,
      period: 'Kỷ Phấn Trắng muộn',
      age: '68 triệu năm',
      length: '9 m',
      weight: '12 tấn',
      location: 'Montana, USA',
      desc: 'Hộp sọ gần như hoàn chỉnh với 3 sừng đặc trưng. Triceratops là một trong các loài phổ biến nhất giai đoạn cuối Kỷ Phấn Trắng, cùng tồn tại với T-Rex.',
      highlight: false,
    },
    {
      id: 'amber',
      name: 'Hổ Phách Myanmar',
      fullName: 'Burmite Amber Inclusion',
      tag: 'Hổ phách Mesozoi',
      dinoImage: '/images/amber_fossil.png',
      objectPosition: 'center center',
      period: 'Giữa Kỷ Phấn Trắng',
      age: '99 triệu năm',
      length: '3.2 cm',
      weight: '8.7 g',
      location: 'Myanmar (Burma)',
      desc: 'Nhựa cây hóa thạch lưu giữ sinh vật gần như nguyên vẹn từ 99 triệu năm trước: côn trùng, lông khủng long và cả nòng nọc.',
      highlight: false,
    },
    {
      id: 'vn-tooth',
      name: 'Răng Theropod Việt Nam',
      fullName: 'Indosuchus sp. (cf.)',
      tag: 'Phát hiện Việt Nam',
      dinoImage: '/images/dino_velociraptor.png',
      objectPosition: 'center center',
      period: 'Jura – Phấn Trắng',
      age: '80–130 triệu năm',
      length: '4.7 cm',
      weight: null,
      location: 'Đồng Nai & Bình Thuận, VN',
      desc: 'Một trong những bằng chứng hiếm hoi về sự tồn tại của khủng long trên lãnh thổ Việt Nam — thuộc nhóm theropod cỡ trung.',
      highlight: false,
    },
  ],
  en: [
    {
      id: 'trex',
      name: 'T-Rex',
      fullName: 'Tyrannosaurus rex',
      tag: 'Theropoda',
      dinoImage: '/images/dino_trex.png',
      objectPosition: 'center top',
      period: 'Late Cretaceous',
      age: '67 million yrs',
      length: '12.3 m',
      weight: '8.4 tons',
      location: 'South Dakota, USA (1990)',
      desc: 'The most complete T-Rex skeleton ever found. “Sue” is named after its discoverer — Sue Hendrickson. Currently on display at the Field Museum, Chicago.',
      highlight: true,
    },
    {
      id: 'triceratops',
      name: '"Horridus" Triceratops',
      fullName: 'Triceratops horridus',
      tag: 'Ceratopsidae',
      dinoImage: '/images/dino_triceratops.png',
      objectPosition: 'center center',
      period: 'Late Cretaceous',
      age: '68 million yrs',
      length: '9 m',
      weight: '12 tons',
      location: 'Montana, USA',
      desc: 'Complete skull with its iconic 3 horns. Triceratops was the most common species of late Cretaceous — coexisting alongside T-Rex.',
      highlight: false,
    },
    {
      id: 'amber',
      name: 'Myanmar Amber',
      fullName: 'Burmite Amber Inclusion',
      tag: 'Mesozoic Amber',
      dinoImage: '/images/amber_fossil.png',
      objectPosition: 'center center',
      period: 'Mid-Cretaceous',
      age: '99 million yrs',
      length: '3.2 cm',
      weight: '8.7 g',
      location: 'Myanmar (Burma)',
      desc: 'Fossilized tree resin containing perfectly preserved organisms from 99 million years ago — insects, dinosaur feathers, and even tadpoles.',
      highlight: false,
    },
    {
      id: 'vn-tooth',
      name: 'Vietnamese Theropod Tooth',
      fullName: 'Indosuchus sp. (cf.)',
      tag: 'VN Discovery',
      dinoImage: '/images/dino_velociraptor.png',
      objectPosition: 'center center',
      period: 'Jurassic – Cretaceous',
      age: '80–130 million yrs',
      length: '4.7 cm',
      weight: null,
      location: 'Dong Nai & Binh Thuan, VN',
      desc: 'One of the rare pieces of evidence for dinosaur existence in Vietnamese territory — a medium-sized theropod dinosaur.',
      highlight: false,
    },
  ],
};

// Component hiển thị ảnh hiện vật trong card — hỗ trợ cả ảnh và emoji thay thế
const SketchfabSpecimen = ({ dinoImage, emoji, objectPosition, imageScale = 1 }) => {
  // Nếu không có ảnh, hiển thị emoji thay thế
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

const SpecimenShowcase = ({ locale = 'vi' }) => {
  const [activeId, setActiveId] = useState(null);
  const [, setLoadedIds] = useState({});
  const isVi = locale === 'vi';
  const displaySpecimens = useMemo(() => {
    const localeKey = isVi ? 'vi' : 'en';
    const localizedCards = specimenCards.map((specimen) => ({
      id: specimen.id,
      dinoImage: specimen.dinoImage,
      objectPosition: specimen.objectPosition,
      imageScale: specimen.imageScale,
      highlight: specimen.highlight,
      ...specimen[localeKey],
    }));

    const fallbackCards = (isVi ? fallbackSpecimens.vi : fallbackSpecimens.en).map((specimen) => ({
      ...specimen,
      id: specimen.id,
    }));

    const orderedIds = ['uploaded-fossil-styracosaurus', 'uploaded-fossil-coelophysis', 'trex', 'triceratops'];
    const byId = new Map([...localizedCards, ...fallbackCards].map((item) => [item.id, item]));

    return orderedIds.map((id) => byId.get(id)).filter(Boolean);
  }, [isVi]);
  // Ref cho section — dùng để tính parallax scroll
  const sectionRef = useRef(null);
  // Parallax nhẹ cho heading
  const headingY = useParallax(sectionRef, ['30px', '-20px']);

  // Theo dõi card hiện vật nào đang active
  const handleMouseEnter = (id) => {
    setActiveId(id);
    setLoadedIds(prev => ({ ...prev, [id]: true }));
  };

  return (
    <section
      id="specimens"
      ref={sectionRef}
      className="section-pad relative overflow-hidden"
      style={{ background: 'var(--theme-bg-alt)' }}
    >
      {/* Hoa văn chéo mờ làm texture nền */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(245,158,11,0.5) 0px, rgba(245,158,11,0.5) 1px, transparent 1px, transparent 40px)',
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Tiêu đề section Hiện Vật Nổi Bật — có parallax nhẹ */}
        <motion.div
          className="mb-16"
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="section-divider" />
          <p className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: '#f59e0b', fontFamily: 'DM Sans, sans-serif' }}>
            {isVi ? 'Hiện vật nổi bật' : 'Featured Specimens'}
          </p>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--theme-text)' }}>
            {isVi ? 'Những ngôi sao ' : 'The Stars '}
            <span className="text-gradient-amber">{isVi ? 'của bộ sưu tập' : 'of Our Collection'}</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed"
            style={{ color: 'var(--theme-text-muted)', fontFamily: 'Nunito, sans-serif', fontStyle: 'italic' }}>
            {isVi
              ? 'Hai ảnh bạn vừa upload đang được hiển thị ở đầu danh sách, còn các mẫu cũ vẫn được giữ lại phía sau.'
              : 'Your two uploaded images are now shown first, while the previous sample cards are still kept afterward.'}
          </p>
        </motion.div>

        {/* Lưới các card hiện vật (2 cột) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displaySpecimens.map((s, i) => {
            const isActive = activeId === s.id;
            return (
              <motion.div
                key={s.id}
                className="specimen-card group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                onMouseEnter={() => handleMouseEnter(s.id)}
                onMouseLeave={() => setActiveId(null)}
                style={{
                  border: s.highlight ? '1px solid rgba(245,158,11,0.35)' : undefined,
                  boxShadow: s.highlight ? '0 0 40px rgba(245,158,11,0.08)' : undefined,
                }}
              >
                {/* Vùng ảnh hiện vật */}
                <div
                  className="specimen-image-shell relative overflow-hidden flex items-center justify-center"
                  style={{
                    background: s.tag === 'Mới upload' || s.tag === 'New upload'
                      ? 'linear-gradient(135deg, rgba(10,8,4,0.92) 0%, rgba(30,23,16,0.85) 100%)'
                      : 'linear-gradient(135deg, rgba(17,14,8,0.9) 0%, rgba(30,23,16,0.7) 100%)',
                  }}
                >
                  {/* Gradient tối overlay */}
                  <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(10,8,4,0.95))' }}
                  />
                  {/* Hiệu ứng spotlight khi hover */}
                  <motion.div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(245,158,11,0.2) 0%, transparent 70%)' }}
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* Ảnh hiện vật hoặc emoji thay thế */}
                  <SketchfabSpecimen
                    dinoImage={s.dinoImage}
                    emoji={s.emoji}
                    objectPosition={s.objectPosition}
                    imageScale={s.imageScale}
                  />

                  {/* Nhãn phân loại và đánh dấu tiêu biểu */}
                  <div className="absolute top-4 left-4 flex gap-2 z-20">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ background: 'rgba(10,8,4,0.8)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)', backdropFilter: 'blur(8px)', fontFamily: 'DM Sans, sans-serif' }}>
                      {s.tag}
                    </span>
                    {s.highlight && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
                        ✦ {isVi ? 'Nổi bật' : 'Featured'}
                      </span>
                    )}
                  </div>

                  {/* Nhãn kỷ địa chất góc trên phải */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-2.5 py-1 rounded-full text-xs"
                      style={{ background: 'rgba(10,8,4,0.8)', color: 'rgba(245,240,232,0.7)', backdropFilter: 'blur(8px)', fontFamily: 'DM Sans, sans-serif' }}>
                      {s.period}
                    </span>
                  </div>

                  {/* Tên hiện vật phía dưới ảnh */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-serif font-bold text-xl"
                        style={{ fontFamily: 'Cormorant Garamond, serif', color: '#f5f0e8' }}>
                        {s.name}
                      </h3>
                    </div>
                    <p className="text-xs italic" style={{ color: 'rgba(245,240,232,0.5)', fontFamily: 'Nunito, sans-serif' }}>
                      {s.fullName}
                    </p>
                  </div>
                </div>

                {/* Bảng thông số khoa học */}
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: isVi ? 'Niên đại' : 'Age', value: s.age },
                      { label: isVi ? 'Kích thước' : 'Length', value: s.length },
                      { label: isVi ? 'Địa điểm' : 'Location', value: s.location ? s.location.split(',')[0] : '' },
                    ].map((stat, j) => (
                      <div key={j} className="text-center p-2 rounded-lg"
                        style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.1)' }}>
                        <div className="text-xs font-bold" style={{ color: '#fbbf24', fontSize: '11px', fontFamily: 'DM Sans, sans-serif' }}>
                          {stat.value}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--theme-text-dim)', fontSize: '10px', fontFamily: 'DM Sans, sans-serif' }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Panel chi tiết xuất hiện khi hover */}
                  <div className="detail-panel">
                    <p className="text-xs leading-relaxed mb-3"
                      style={{ color: 'var(--theme-text-muted)', fontStyle: 'italic', fontFamily: 'Nunito, sans-serif' }}>
                      {s.desc}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(245,158,11,0.7)' }}>
                      <span>📍</span>
                      <span style={{ fontFamily: 'DM Sans, sans-serif' }}>{s.location}</span>
                    </div>
                  </div>

                  {/* Đường kẻ gradient xuất hiện khi hover */}
                  <div className="mt-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(90deg, #f59e0b, transparent)' }} />
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
