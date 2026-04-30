import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParallax } from '../../hooks/useParallax';
import { useDinosaurs } from '../../hooks/useDinosaurs';
import { useSiteAssets } from '../../hooks/useSiteAssets';

const fallbackSpecimens = {
  vi: [
    {
      id: 'amber',
      name: 'Hổ phách Myanmar',
      fullName: 'Mẫu bao thể hổ phách Burmite',
      tag: 'Hổ phách tiền sử',
      dinoImage: '/images/amber_fossil.png',
      objectPosition: 'center center',
      period: 'Giữa kỷ Phấn Trắng',
      age: '99 triệu năm',
      length: '3.2 cm',
      weight: '8.7 g',
      location: 'Myanmar (Miến Điện)',
      desc: 'Nhựa cây hóa thạch chứa các sinh vật được bảo tồn gần như nguyên vẹn từ 99 triệu năm trước — côn trùng, lông khủng long và cả nòng nọc.',
      highlight: false,
    },
    {
      id: 'vn-tooth',
      name: 'Răng khủng long ăn thịt Việt Nam',
      fullName: 'Indosuchus sp. (cf.)',
      tag: 'Phát hiện tại VN',
      dinoImage: '/images/dino_velociraptor.png',
      objectPosition: 'center center',
      period: 'Kỷ Jura – Phấn Trắng',
      age: '80–130 triệu năm',
      length: '4.7 cm',
      weight: null,
      location: 'Đồng Nai & Bình Thuận, Việt Nam',
      desc: 'Một trong những bằng chứng hiếm hoi cho sự hiện diện của khủng long trên lãnh thổ Việt Nam — một loài khủng long ăn thịt cỡ trung bình.',
      highlight: false,
    },
  ],
  en: [
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
const SketchfabSpecimen = ({ dinoImage, localFallback, emoji, objectPosition }) => {
  const [imgSrc, setImgSrc] = React.useState(dinoImage);

  // Nếu không có ảnh, hiển thị emoji thay thế
  if (!imgSrc) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-8xl opacity-20 transition-opacity duration-500">{emoji || '🦕'}</span>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={imgSrc}
        alt="Dinosaur specimen"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        style={{
          filter: 'brightness(0.7) saturate(1.1)',
          objectPosition: objectPosition || 'center center',
        }}
        onError={() => {
          // Fallback: nếu Supabase URL bị lỗi → dùng local image
          if (localFallback && imgSrc !== localFallback) {
            setImgSrc(localFallback);
          } else {
            setImgSrc(null); // Hiển emoji nếu cả hai đều lỗi
          }
        }}
      />
      {/* Gradient tối từ dưới lên để text hiển thị rõ ràng */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(10,8,4,0.9) 100%)' }}
      />
    </div>
  );
};

const SpecimenShowcase = ({ locale = 'vi' }) => {
  const isVi = locale === 'vi';
  const [activeId, setActiveId] = useState(null);
  const [loadedIds, setLoadedIds] = useState({});
  const sectionRef = useRef(null);
  const headingY = useParallax(sectionRef, ['30px', '-20px']);
  const { dinosaurs } = useDinosaurs();
  const { assets } = useSiteAssets();

  const siteImages = assets.filter((a) => a.asset_type === 'image' && a.public_url);
  const amberAsset = siteImages.find((a) => /amber/i.test(a.asset_key || a.slug || a.name || ''))?.public_url || null;
  const vnAsset = siteImages.find((a) => /(vn|vietnam)/i.test(a.asset_key || a.slug || a.name || ''))?.public_url || null;

  const pickDino = (...predicates) => (dinosaurs || []).find((dino) => predicates.some((fn) => fn(dino)));

  // Base URL của Supabase Storage bucket dino-assets
  const STORAGE_BASE = 'https://meixvtjixkxlccxscpky.supabase.co/storage/v1/object/public/dino-assets';

  const specimenSource = useMemo(() => {
    const tRex = pickDino(
      (d) => /tyrannosaurus/i.test(d.scientific_name || ''),
      (d) => /t-rex|t rex/i.test(`${d.common_name_en || ''} ${d.common_name_vi || ''}`),
    );
    const triceratops = pickDino(
      (d) => /triceratops/i.test(d.scientific_name || ''),
      (d) => /triceratops/i.test(`${d.common_name_en || ''} ${d.common_name_vi || ''}`),
    );
    const velociraptor = pickDino(
      (d) => /velociraptor/i.test(d.scientific_name || ''),
      (d) => /velociraptor/i.test(`${d.common_name_en || ''} ${d.common_name_vi || ''}`),
    );
    const ankylosaurus = pickDino(
      (d) => /ankylosaurus/i.test(d.scientific_name || ''),
      (d) => /ankylosaurus/i.test(`${d.common_name_en || ''} ${d.common_name_vi || ''}`),
    );

    // Ảnh: ưu tiên image_url từ DB → thumbnails Supabase → local fallback
    const tRexImg   = tRex?.image_url        || `${STORAGE_BASE}/thumbnails/Cretaceous/tyrannosaurus_rex.png`  || '/images/dino_trex.png';
    const triImg    = triceratops?.image_url  || `${STORAGE_BASE}/thumbnails/Cretaceous/triceratops.png`         || '/images/dino_triceratops.png';
    const velImg    = velociraptor?.image_url || `${STORAGE_BASE}/thumbnails/Cretaceous/velociraptor.png`        || '/images/dino_velociraptor.png';
    const ankImg    = ankylosaurus?.image_url || `${STORAGE_BASE}/thumbnails/Cretaceous/ankylosaurus.png`        || '/images/dino_brachiosaurus.png';

    return [
      {
        id: 'trex',
        name: 'T-Rex',
        fullName: 'Tyrannosaurus rex',
        tag: isVi ? 'Khủng long ăn thịt' : 'Theropod',
        dinoImage: tRexImg,
        localFallback: '/images/dino_trex.png',
        emoji: '🦖',
        objectPosition: 'center top',
        period: isVi ? (tRex?.eras?.name_vi || 'Kỷ Phấn Trắng muộn') : (tRex?.eras?.name_en || 'Late Cretaceous'),
        age: isVi ? '67 triệu năm' : '67 million yrs',
        length: tRex?.length_m ? `${tRex.length_m} m` : '12.3 m',
        weight: tRex?.weight_kg ? `${tRex.weight_kg} kg` : (isVi ? '8.4 tấn' : '8.4 tons'),
        location: isVi ? (tRex?.discovery_location || 'South Dakota, Hoa Kỳ') : (tRex?.discovery_location || 'South Dakota, USA'),
        desc: isVi
          ? (tRex?.description_vi || tRex?.description_en || 'Bộ xương T-Rex hoàn chỉnh và nổi tiếng nhất. Kẻ săn mồi đỉnh cao của kỷ Phấn Trắng.')
          : (tRex?.description_en || tRex?.description_vi || 'The most complete T-Rex skeleton ever found. Apex predator of the Cretaceous.'),
        highlight: true,
      },
      {
        id: 'triceratops',
        name: 'Triceratops',
        fullName: 'Triceratops horridus',
        tag: isVi ? 'Khủng long ăn cỏ' : 'Ceratopsid',
        dinoImage: triImg,
        localFallback: '/images/dino_triceratops.png',
        emoji: '🦕',
        objectPosition: 'center center',
        period: isVi ? (triceratops?.eras?.name_vi || 'Kỷ Phấn Trắng muộn') : (triceratops?.eras?.name_en || 'Late Cretaceous'),
        age: isVi ? '68 triệu năm' : '68 million yrs',
        length: triceratops?.length_m ? `${triceratops.length_m} m` : '9 m',
        weight: triceratops?.weight_kg ? `${triceratops.weight_kg} kg` : (isVi ? '12 tấn' : '12 tons'),
        location: isVi ? (triceratops?.discovery_location || 'Montana, Hoa Kỳ') : (triceratops?.discovery_location || 'Montana, USA'),
        desc: isVi
          ? (triceratops?.description_vi || triceratops?.description_en || 'Hộp sọ hoàn chỉnh với 3 chiếc sừng đặc trưng, kẻ thù của T-Rex.')
          : (triceratops?.description_en || triceratops?.description_vi || 'Complete skull with its iconic 3 horns — the nemesis of T-Rex.'),
        highlight: false,
      },
      {
        id: 'velociraptor',
        name: 'Velociraptor',
        fullName: 'Velociraptor mongoliensis',
        tag: isVi ? 'Khủng long ăn thịt' : 'Dromaeosaurid',
        dinoImage: velImg,
        localFallback: '/images/dino_velociraptor.png',
        emoji: '🦖',
        objectPosition: 'center center',
        period: isVi ? (velociraptor?.eras?.name_vi || 'Kỷ Phấn Trắng muộn') : (velociraptor?.eras?.name_en || 'Late Cretaceous'),
        age: isVi ? '75–71 triệu năm' : '75–71 million yrs',
        length: velociraptor?.length_m ? `${velociraptor.length_m} m` : '1.8 m',
        weight: velociraptor?.weight_kg ? `${velociraptor.weight_kg} kg` : (isVi ? '15 kg' : '15 kg'),
        location: isVi ? (velociraptor?.discovery_location || 'Sa mạc Gobi, Mông Cổ') : (velociraptor?.discovery_location || 'Gobi Desert, Mongolia'),
        desc: isVi
          ? (velociraptor?.description_vi || velociraptor?.description_en || 'Kẻ săn mồi lanh lợi với móng vuốt cong sắc bén, di chuyển theo bầy đàn.')
          : (velociraptor?.description_en || velociraptor?.description_vi || 'Agile pack hunter with sickle-shaped claws — smarter than its size suggests.'),
        highlight: false,
      },
      {
        id: 'ankylosaurus',
        name: 'Ankylosaurus',
        fullName: 'Ankylosaurus magniventris',
        tag: isVi ? 'Khủng long bọc giáp' : 'Ankylosaur',
        dinoImage: ankImg,
        localFallback: '/images/dino_brachiosaurus.png',
        emoji: '🦕',
        objectPosition: 'center center',
        period: isVi ? (ankylosaurus?.eras?.name_vi || 'Kỷ Phấn Trắng muộn') : (ankylosaurus?.eras?.name_en || 'Late Cretaceous'),
        age: isVi ? '68–66 triệu năm' : '68–66 million yrs',
        length: ankylosaurus?.length_m ? `${ankylosaurus.length_m} m` : '10 m',
        weight: ankylosaurus?.weight_kg ? `${ankylosaurus.weight_kg} kg` : (isVi ? '6 tấn' : '6 tons'),
        location: isVi ? (ankylosaurus?.discovery_location || 'Montana & Wyoming, Hoa Kỳ') : (ankylosaurus?.discovery_location || 'Montana & Wyoming, USA'),
        desc: isVi
          ? (ankylosaurus?.description_vi || ankylosaurus?.description_en || 'Khủng long bọc giáp với cái đuôi như búa chiến, một trong những loài phòng thủ tốt nhất.')
          : (ankylosaurus?.description_en || ankylosaurus?.description_vi || 'Living fortress with a bone-club tail — one of nature\'s greatest defensive weapons.'),
        highlight: false,
      },
    ];
  }, [dinosaurs, isVi, pickDino, STORAGE_BASE]);

  const handleMouseEnter = (id) => {
    setActiveId(id);
    setLoadedIds((prev) => ({ ...prev, [id]: true }));
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
            {isVi ? 'Những điểm nhấn' : 'The Stars'}{' '}
            <span className="text-gradient-amber">{isVi ? 'của bộ sưu tập' : 'of Our Collection'}</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed"
            style={{ color: 'var(--theme-text-muted)', fontFamily: 'Nunito, sans-serif', fontStyle: 'italic' }}>
            {isVi
              ? 'Di chuột vào từng hiện vật để xem dữ liệu khoa học chi tiết. Mỗi mẫu vật đều mang một câu chuyện hàng triệu năm tuổi.'
              : 'Hover over each specimen to view detailed scientific data. Every artifact tells a story millions of years in the making.'}
          </p>
        </motion.div>

        {/* Lưới các card hiện vật (2 cột) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specimenSource.map((s, i) => {
            const isActive = activeId === s.id;
            const isLoaded = loadedIds[s.id];
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
                  className="relative h-64 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(17,14,8,0.9) 0%, rgba(30,23,16,0.7) 100%)',
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
                    localFallback={s.localFallback}
                    emoji={s.emoji}
                    objectPosition={s.objectPosition}
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
                        ✦ Featured
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
                      { label: isVi ? 'Tuổi' : 'Age', value: s.age },
                      { label: isVi ? 'Chiều dài' : 'Length', value: s.length },
                      { label: isVi ? 'Địa điểm' : 'Location', value: s.location.split(',')[0] },
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
