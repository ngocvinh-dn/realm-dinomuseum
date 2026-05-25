import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Aperture, Globe2, Leaf, Radar, Sparkles } from 'lucide-react';
import { useParallax } from '../../hooks/useParallax';

const REVEAL_EASE = [0.22, 1, 0.36, 1];

// Keep the asset mapping explicit so the three supplied artworks cannot be swapped.
const PERIODS = {
  vi: [
    {
      id: 'triassic',
      name: 'Kỷ Tam Điệp',
      englishName: 'Triassic',
      range: 'Từ 252 đến 201 triệu năm trước',
      rangeCompact: '252–201',
      rangeUnit: 'triệu năm trước',
      duration: '51 triệu năm',
      durationNote: 'Kéo dài 51 triệu năm',
      note: 'Khủng long đầu tiên xuất hiện',
      shortRange: '252–201 triệu năm',
      description:
        'Giai đoạn mở đầu của Mesozoi, khi siêu lục địa Pangaea còn rộng lớn và những loài khủng long đầu tiên bắt đầu xuất hiện, thích nghi với khí hậu nóng và khô.',
      climate: 'Nóng và khô',
      accent: '#f0a54a',
      glow: 'rgba(240, 165, 74, 0.24)',
      marker: '01',
      primaryImage: '/images/mesozoic/triassic-image-c.png',
      fallbackImage: '/images/Coelophysis_bauri.png',
      fallbackFit: 'contain',
      artworkLabel: 'Kỷ Tam Điệp',
    },
    {
      id: 'jurassic',
      name: 'Kỷ Jura',
      englishName: 'Jurassic',
      range: 'Từ 201 đến 145 triệu năm trước',
      rangeCompact: '201–145',
      rangeUnit: 'triệu năm trước',
      duration: '56 triệu năm',
      durationNote: 'Kéo dài 56 triệu năm',
      note: 'Khủng long phát triển mạnh',
      shortRange: '201–145 triệu năm',
      description:
        'Khí hậu ấm và ẩm hơn giúp hệ thực vật phát triển dày đặc, tạo điều kiện cho các sauropod khổng lồ và nhiều nhóm khủng long khác bùng nổ về kích thước lẫn số lượng.',
      climate: 'Ấm và ẩm',
      accent: '#63e6a7',
      glow: 'rgba(99, 230, 167, 0.24)',
      marker: '02',
      primaryImage: '/images/mesozoic/jurassic-image-b.png',
      fallbackImage: '/images/Camarasaurus.png',
      fallbackFit: 'contain',
      artworkLabel: 'Kỷ Jura',
    },
    {
      id: 'cretaceous',
      name: 'Kỷ Phấn Trắng',
      englishName: 'Cretaceous',
      range: 'Từ 145 đến 66 triệu năm trước',
      rangeCompact: '145–66',
      rangeUnit: 'triệu năm trước',
      duration: '79 triệu năm',
      durationNote: 'Kéo dài 79 triệu năm',
      note: 'Đa dạng hóa mạnh trước tuyệt chủng hàng loạt',
      shortRange: '145–66 triệu năm',
      description:
        'Đây là thời kỳ hệ sinh thái trở nên rất phong phú, thực vật có hoa lan rộng và nhiều loài biểu tượng xuất hiện trước khi sự kiện tuyệt chủng K–Pg chấm dứt thời đại khủng long không phải chim.',
      climate: 'Khí hậu đa dạng',
      accent: '#f6bf56',
      glow: 'rgba(246, 191, 86, 0.22)',
      marker: '03',
      primaryImage: '/images/mesozoic/cretaceous-image-d.png',
      fallbackImage: '/images/Tyrannosaurus_rex.png',
      fallbackFit: 'contain',
      artworkLabel: 'Kỷ Phấn Trắng',
    },
  ],
  en: [
    {
      id: 'triassic',
      name: 'Triassic',
      englishName: 'Triassic',
      range: 'From 252 to 201 million years ago',
      rangeCompact: '252–201',
      rangeUnit: 'million years ago',
      duration: '51 million years',
      durationNote: 'Lasted 51 million years',
      note: 'The first dinosaurs appear',
      shortRange: '252–201 million years',
      description:
        'The opening chapter of the Mesozoic, when Pangaea still dominated Earth and the first dinosaurs emerged in hot, dry environments.',
      climate: 'Hot and dry',
      accent: '#f0a54a',
      glow: 'rgba(240, 165, 74, 0.24)',
      marker: '01',
      primaryImage: '/images/mesozoic/triassic-image-c.png',
      fallbackImage: '/images/Coelophysis_bauri.png',
      fallbackFit: 'contain',
      artworkLabel: 'Triassic Period',
    },
    {
      id: 'jurassic',
      name: 'Jurassic',
      englishName: 'Jurassic',
      range: 'From 201 to 145 million years ago',
      rangeCompact: '201–145',
      rangeUnit: 'million years ago',
      duration: '56 million years',
      durationNote: 'Lasted 56 million years',
      note: 'Dinosaurs flourish',
      shortRange: '201–145 million years',
      description:
        'Warm, humid climates supported dense vegetation and allowed giant sauropods and many other dinosaur groups to expand dramatically.',
      climate: 'Warm and humid',
      accent: '#63e6a7',
      glow: 'rgba(99, 230, 167, 0.24)',
      marker: '02',
      primaryImage: '/images/mesozoic/jurassic-image-b.png',
      fallbackImage: '/images/Camarasaurus.png',
      fallbackFit: 'contain',
      artworkLabel: 'Jurassic Period',
    },
    {
      id: 'cretaceous',
      name: 'Cretaceous',
      englishName: 'Cretaceous',
      range: 'From 145 to 66 million years ago',
      rangeCompact: '145–66',
      rangeUnit: 'million years ago',
      duration: '79 million years',
      durationNote: 'Lasted 79 million years',
      note: 'Rapid diversification before mass extinction',
      shortRange: '145–66 million years',
      description:
        'Ecosystems became highly diverse, flowering plants spread, and many iconic lineages evolved before the K–Pg extinction ended the non-avian dinosaur era.',
      climate: 'Diverse climates',
      accent: '#f6bf56',
      glow: 'rgba(246, 191, 86, 0.22)',
      marker: '03',
      primaryImage: '/images/mesozoic/cretaceous-image-d.png',
      fallbackImage: '/images/Tyrannosaurus_rex.png',
      fallbackFit: 'contain',
      artworkLabel: 'Cretaceous Period',
    },
  ],
};

const SUPPORTING_INFO = {
  vi: [
    {
      title: 'THAY ĐỔI TOÀN CẦU',
      text: 'Siêu lục địa Pangaea phân tách thành các lục địa hiện đại.',
      icon: Globe2,
    },
    {
      title: 'SỰ THỐNG TRỊ CỦA KHỦNG LONG',
      text: 'Khủng long và các loài bò sát cổ đại chiếm ưu thế trên cạn, trên biển và trong không trung.',
      icon: Radar,
    },
    {
      title: 'ĐA DẠNG SINH HỌC',
      text: 'Hệ sinh thái phong phú, xuất hiện nhiều loài mới và thực vật có hoa.',
      icon: Leaf,
    },
  ],
  en: [
    {
      title: 'GLOBAL CHANGE',
      text: 'The supercontinent Pangaea split into the modern continents.',
      icon: Globe2,
    },
    {
      title: 'DINOSAUR DOMINANCE',
      text: 'Dinosaurs and other ancient reptiles dominated land, sea, and sky.',
      icon: Radar,
    },
    {
      title: 'BIODIVERSITY',
      text: 'Rich ecosystems formed, with many new species and flowering plants appearing.',
      icon: Leaf,
    },
  ],
};

const COPY = {
  vi: {
    eyebrow: 'GEOLOGICAL TIMELINE',
    title: 'Kỷ Mesozoic',
    accentTitle: 'Thời đại của khủng long',
    subtitle: '252–66 triệu năm trước',
    overviewLabel: 'TỔNG QUAN KỶ MESOZOIC',
    overviewText:
      'Mesozoic kéo dài hơn 186 triệu năm, là thời đại khủng long thống trị Trái Đất và cũng là giai đoạn có nhiều biến đổi lớn về khí hậu, đại dương và lục địa.',
    railLabel: 'Ba giai đoạn chính theo trục thời gian',
    railHint: 'Từ cổ nhất đến trẻ nhất',
    railRange: '252–66 triệu năm trước',
    detailLabel: 'CHI TIẾT KỶ ĐANG XEM',
    detailHint: 'Bấm vào một thẻ để đổi nội dung chi tiết',
    eraLabel: 'Giai đoạn',
    climateLabel: 'Điều kiện',
    timeLabel: 'Thời gian',
    durationLabel: 'Niên đại',
  },
  en: {
    eyebrow: 'GEOLOGICAL TIMELINE',
    title: 'Mesozoic Era',
    accentTitle: 'The Age of Dinosaurs',
    subtitle: '252–66 million years ago',
    overviewLabel: 'MESOZOIC OVERVIEW',
    overviewText:
      'The Mesozoic lasted more than 186 million years, when dinosaurs dominated Earth amid major shifts in climate, oceans, and continental structure.',
    railLabel: 'Three major periods across the timeline',
    railHint: 'From oldest to youngest',
    railRange: '252–66 million years ago',
    detailLabel: 'SELECTED PERIOD',
    detailHint: 'Click a card to switch the detailed panel',
    eraLabel: 'Period',
    climateLabel: 'Conditions',
    timeLabel: 'Time Range',
    durationLabel: 'Duration',
  },
};

function TimelineArtwork({ period, isActive }) {
  const [src, setSrc] = useState(period.primaryImage);
  const [isFallback, setIsFallback] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/8 bg-black/40">
      <div
        className="absolute inset-0 z-10"
        style={{
          background: `linear-gradient(180deg, rgba(5, 7, 9, 0.03) 0%, rgba(5, 7, 9, 0.08) 35%, rgba(5, 7, 9, 0.42) 100%)`,
        }}
      />
      <img
        src={src}
        alt={period.name}
        onError={() => {
          if (!isFallback) {
            setSrc(period.fallbackImage);
            setIsFallback(true);
          }
        }}
        className="h-[240px] w-full transition-transform duration-700 md:h-[260px]"
        style={{
          objectFit: isFallback ? period.fallbackFit || 'contain' : 'cover',
          objectPosition: 'center center',
          transform: isActive ? 'scale(1.04)' : 'scale(1)',
          filter: isFallback
            ? 'brightness(0.96) saturate(1.06)'
            : 'brightness(0.98) saturate(1.08)',
          background:
            'radial-gradient(circle at 50% 20%, rgba(245, 195, 92, 0.12) 0%, rgba(0, 0, 0, 0) 58%), #090807',
        }}
      />
      <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
        <span
          className="rounded-full border px-3 py-1 text-[10px] font-semibold tracking-[0.18em]"
          style={{
            color: period.accent,
            borderColor: `${period.accent}55`,
            background: 'rgba(10, 8, 4, 0.7)',
            boxShadow: `0 0 18px ${period.glow}`,
          }}
        >
          {period.artworkLabel}
        </span>
      </div>
    </div>
  );
}

function PeriodIcon({ accent }) {
  return (
    <div
      className="flex h-14 w-14 items-center justify-center rounded-[18px] border"
      style={{
        color: accent,
        borderColor: `${accent}42`,
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(7, 8, 10, 0.72) 100%)',
        boxShadow: `0 0 24px ${accent}18, inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      <Aperture size={22} strokeWidth={1.6} />
    </div>
  );
}

const GeoTimeline = ({ locale = 'vi' }) => {
  const currentLocale = locale === 'en' ? 'en' : 'vi';
  const content = COPY[currentLocale];
  const periods = PERIODS[currentLocale];
  const supportingInfo = SUPPORTING_INFO[currentLocale];
  const [activeId, setActiveId] = useState(null);
  const sectionRef = React.useRef(null);
  const headingY = useParallax(sectionRef, ['28px', '-18px']);

  const activePeriod = useMemo(
    () => periods.find((period) => period.id === activeId) || null,
    [activeId, periods]
  );

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="section-pad relative overflow-hidden"
      style={{ background: 'var(--theme-bg)' }}
    >
      <div className="meso-hud-grid absolute inset-0 opacity-80" />
      <div
        className="absolute inset-x-0 top-0 h-[32rem] opacity-70"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(247, 188, 75, 0.18) 0%, rgba(247, 188, 75, 0.05) 24%, transparent 72%)',
        }}
      />
      <div
        className="absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full opacity-35 blur-3xl"
        style={{ background: 'rgba(245, 177, 65, 0.16)' }}
      />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8">
        <motion.div
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: REVEAL_EASE }}
          className="max-w-4xl"
        >
          <p
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.38em]"
            style={{ color: '#f0b54e' }}
          >
            {content.eyebrow}
          </p>
          <h2
            className="font-serif text-[clamp(2.6rem,6vw,5.4rem)] leading-[0.96]"
            style={{ color: '#f7c153' }}
          >
            <span className="block">{content.title}</span>
            <span className="text-gradient-amber block">{content.accentTitle}</span>
          </h2>
          <p
            className="mt-5 text-base italic md:text-lg"
            style={{ color: 'var(--theme-text-muted)' }}
          >
            {content.subtitle}
          </p>
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: REVEAL_EASE }}
            className="meso-lux-card p-6 md:p-7"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.3em]"
                  style={{ color: '#f3c66a' }}
                >
                  {content.overviewLabel}
                </p>
                <h3 className="mt-3 text-2xl font-serif" style={{ color: 'var(--theme-text)' }}>
                  {currentLocale === 'vi' ? 'Mesozoic' : 'Mesozoic'}
                </h3>
              </div>
              <Sparkles size={18} color="#f4c160" />
            </div>
            <p className="max-w-3xl text-sm leading-7 md:text-base" style={{ color: 'var(--theme-text-muted)' }}>
              {content.overviewText}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.08, duration: 0.8, ease: REVEAL_EASE }}
            className="meso-lux-card p-6 md:p-7"
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.3em]"
                  style={{ color: '#f3c66a' }}
                >
                  {content.railLabel}
                </p>
                <h3 className="mt-3 font-serif text-[clamp(1.7rem,2.8vw,2.35rem)] leading-none" style={{ color: '#f7c153' }}>
                  {content.railRange}
                </h3>
              </div>
              <p className="text-xs uppercase tracking-[0.24em]" style={{ color: 'var(--theme-text-dim)' }}>
                {content.railHint}
              </p>
            </div>

            <div className="relative mt-8 flex items-stretch justify-between gap-4">
              {periods.map((period) => (
                <button
                  key={period.id}
                  type="button"
                  onClick={() =>
                    setActiveId((currentId) => (currentId === period.id ? null : period.id))
                  }
                  className="relative z-10 flex flex-1 flex-col items-center gap-3 rounded-2xl border px-3 py-4 text-center transition-transform duration-300 hover:-translate-y-1"
                  style={{
                    background:
                      activePeriod?.id === period.id
                        ? 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(12, 10, 8, 0.92) 100%)'
                        : 'rgba(8, 8, 8, 0.62)',
                    borderColor:
                      activePeriod?.id === period.id ? `${period.accent}48` : 'rgba(255,255,255,0.08)',
                    boxShadow:
                      activePeriod?.id === period.id ? `0 0 26px ${period.glow}` : 'none',
                  }}
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      background: period.accent,
                      boxShadow: `0 0 18px ${period.glow}`,
                    }}
                  />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: period.accent }}>
                    {period.englishName}
                  </span>
                  <span
                    className="min-h-[58px] rounded-2xl border px-3 py-2 flex flex-col items-center justify-center text-center"
                    style={{
                      color: activePeriod?.id === period.id ? 'var(--theme-text)' : 'rgba(245,240,232,0.8)',
                      background: 'rgba(255,255,255,0.05)',
                      borderColor: activePeriod?.id === period.id ? `${period.accent}40` : 'rgba(255,255,255,0.08)',
                      boxShadow: activePeriod?.id === period.id ? `0 0 18px ${period.glow}` : 'none',
                    }}
                  >
                    <span className="text-[13px] font-semibold leading-none">{period.rangeCompact}</span>
                    <span className="mt-1 text-[11px] leading-none" style={{ color: 'var(--theme-text-dim)' }}>
                      {period.rangeUnit}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {supportingInfo.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.08, duration: 0.75, ease: REVEAL_EASE }}
                className="meso-lux-card p-5"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-[#f0b65a33] bg-[#f0b65a12]">
                  <Icon size={18} color="#f0b65a" />
                </div>
                <h3
                  className="text-sm font-semibold uppercase tracking-[0.24em]"
                  style={{ color: '#f0c166' }}
                >
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7" style={{ color: 'var(--theme-text-muted)' }}>
                  {item.text}
                </p>
              </motion.article>
            );
          })}
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {periods.map((period, index) => {
            const isActive = activePeriod?.id === period.id;
            return (
              <motion.button
                key={period.id}
                type="button"
                onClick={() =>
                  setActiveId((currentId) => (currentId === period.id ? null : period.id))
                }
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.24 }}
                transition={{ delay: index * 0.12, duration: 0.88, ease: REVEAL_EASE }}
                whileHover={{ y: -6 }}
                className="meso-period-card text-left"
                style={{
                  borderColor: isActive ? `${period.accent}55` : 'rgba(255,255,255,0.08)',
                  boxShadow: isActive
                    ? `0 0 0 1px ${period.accent}22, 0 0 42px ${period.glow}, 0 18px 60px rgba(0,0,0,0.34)`
                    : '0 18px 52px rgba(0,0,0,0.2)',
                }}
              >
                <div className="p-5 md:p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <PeriodIcon accent={period.accent} />
                    <div
                      className="rounded-2xl border px-3 py-3 text-right min-w-[136px]"
                      style={{
                        borderColor: `${period.accent}3f`,
                        background: `${period.accent}14`,
                      }}
                    >
                      <div className="text-[10px] uppercase tracking-[0.22em]" style={{ color: period.accent }}>
                        {content.timeLabel}
                      </div>
                      <div className="mt-2 text-[15px] font-semibold leading-none" style={{ color: 'var(--theme-text)' }}>
                        {period.rangeCompact}
                      </div>
                      <div className="mt-1 text-[11px] leading-tight" style={{ color: 'var(--theme-text-dim)' }}>
                        {period.rangeUnit}
                      </div>
                    </div>
                  </div>

                  <TimelineArtwork period={period} isActive={isActive} />

                  <div className="mt-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em]"
                        style={{
                          borderColor: `${period.accent}40`,
                          color: period.accent,
                          background: `${period.accent}12`,
                        }}
                      >
                        {period.englishName}
                      </span>
                      <span
                        className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em]"
                        style={{ color: 'var(--theme-text-dim)' }}
                      >
                        {period.durationNote}
                      </span>
                    </div>

                    <h3
                      className="mt-4 font-serif text-[1.9rem] leading-none"
                      style={{ color: 'var(--theme-text)' }}
                    >
                      {period.name}
                    </h3>
                    <p className="mt-3 text-sm leading-7" style={{ color: 'var(--theme-text-muted)' }}>
                      {period.description}
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div
                        className="rounded-2xl border px-4 py-3"
                        style={{
                          borderColor: `${period.accent}24`,
                          background: `${period.accent}0f`,
                        }}
                      >
                        <div className="text-[10px] uppercase tracking-[0.24em]" style={{ color: 'var(--theme-text-dim)' }}>
                          {content.eraLabel}
                        </div>
                        <div className="mt-2 text-sm font-semibold" style={{ color: period.accent }}>
                          {period.note}
                        </div>
                      </div>
                      <div
                        className="rounded-2xl border border-white/8 px-4 py-3"
                        style={{ background: 'rgba(255,255,255,0.03)' }}
                      >
                        <div className="text-[10px] uppercase tracking-[0.24em]" style={{ color: 'var(--theme-text-dim)' }}>
                          {content.climateLabel}
                        </div>
                        <div className="mt-2 text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
                          {period.climate}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {activePeriod && (
          <motion.div
            key={activePeriod.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: REVEAL_EASE }}
            className="meso-lux-card overflow-hidden"
            style={{
              boxShadow: `0 0 46px ${activePeriod.glow}, 0 22px 70px rgba(0,0,0,0.34)`,
              borderColor: `${activePeriod.accent}38`,
            }}
          >
            <div className="grid gap-0 xl:grid-cols-[0.94fr_1.06fr]">
              <div className="p-4 md:p-5">
                <TimelineArtwork period={activePeriod} isActive />
              </div>
              <div className="flex flex-col justify-between p-6 md:p-8">
                <div>
                  <p
                    className="text-[11px] font-semibold uppercase tracking-[0.32em]"
                    style={{ color: activePeriod.accent }}
                  >
                    {content.detailLabel}
                  </p>
                  <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-4xl leading-none" style={{ color: 'var(--theme-text)' }}>
                        {activePeriod.name}
                      </h3>
                      <p className="mt-3 text-sm leading-7" style={{ color: 'var(--theme-text-muted)' }}>
                        {activePeriod.range}
                      </p>
                    </div>
                    <div
                      className="rounded-2xl border px-4 py-3 text-right"
                      style={{
                        background: `${activePeriod.accent}12`,
                        borderColor: `${activePeriod.accent}35`,
                      }}
                    >
                      <div className="text-[10px] uppercase tracking-[0.28em]" style={{ color: 'var(--theme-text-dim)' }}>
                        {content.timeLabel}
                      </div>
                      <div className="mt-2 text-sm font-semibold" style={{ color: activePeriod.accent }}>
                        {activePeriod.range}
                      </div>
                    </div>
                  </div>
                  <p className="mt-5 max-w-2xl text-sm leading-7 md:text-base" style={{ color: 'var(--theme-text-muted)' }}>
                    {activePeriod.description}
                  </p>
                </div>

                <div className="mt-8 grid gap-3 md:grid-cols-3">
                  <div
                    className="rounded-2xl border px-4 py-4"
                    style={{
                      borderColor: `${activePeriod.accent}28`,
                      background: `${activePeriod.accent}10`,
                    }}
                  >
                    <div className="text-[10px] uppercase tracking-[0.24em]" style={{ color: 'var(--theme-text-dim)' }}>
                      {content.durationLabel}
                    </div>
                    <div className="mt-2 text-sm font-semibold" style={{ color: activePeriod.accent }}>
                      {activePeriod.durationNote}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-4">
                    <div className="text-[10px] uppercase tracking-[0.24em]" style={{ color: 'var(--theme-text-dim)' }}>
                      {content.climateLabel}
                    </div>
                    <div className="mt-2 text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
                      {activePeriod.climate}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-4">
                    <div className="text-[10px] uppercase tracking-[0.24em]" style={{ color: 'var(--theme-text-dim)' }}>
                      {currentLocale === 'vi' ? 'Gợi ý' : 'Hint'}
                    </div>
                    <div className="mt-2 text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
                      {content.detailHint}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default GeoTimeline;
