import React, { useState, useEffect, useRef } from 'react';
import { Viewer, Entity, PointGraphics, Globe } from 'resium';
import { BoundingSphere, Cartesian3, Color, HeadingPitchRange } from 'cesium';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getFossilLocations } from '../services/fossilLocationsService';
import { isSupabaseConfigured } from '../lib/supabaseClient';

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  vi: {
    museumLabel: 'Bảo Tàng Khủng Long · Hóa Thạch',
    mapTitle: 'Bản đồ Phát hiện',
    fallbackNote: 'Local đang dùng dữ liệu fallback vì chưa có env Supabase production.',
    samples: (n) => `${n} mẫu`,
    loading: '...',
    clickHint: 'Chọn một điểm vàng',
    clickSub: 'để khám phá hóa thạch',
    onMap: (n) => `${n} mẫu vật trên bản đồ`,
    age: 'Niên đại',
    year: 'Năm phát hiện',
    country: 'Quốc gia',
    locationTitle: '📍 Địa điểm phát hiện',
    province: 'Tỉnh / Thành phố',
    gps: 'Tọa độ GPS',
    fossilTitle: '🦴 Bộ phận hóa thạch tìm được',
    infoTitle: '📖 Thông tin nổi bật',
    back: 'Trở về',
  },
  en: {
    museumLabel: 'Dinosaur Museum · Fossils',
    mapTitle: 'Discovery Map',
    fallbackNote: 'Using fallback data locally — no Supabase env configured.',
    samples: (n) => `${n} items`,
    loading: '...',
    clickHint: 'Select a golden marker',
    clickSub: 'to explore the fossil site',
    onMap: (n) => `${n} specimens on map`,
    age: 'Age',
    year: 'Discovered',
    country: 'Country',
    locationTitle: '📍 Discovery Location',
    province: 'Province / City',
    gps: 'GPS Coordinates',
    fossilTitle: '🦴 Fossil Parts Found',
    infoTitle: '📖 Highlights',
    back: 'Back',
  },
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon }) => (
  <div
    className="flex flex-col items-center justify-center p-3 rounded-xl text-center"
    style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}
  >
    {icon && <span className="text-sm mb-1">{icon}</span>}
    <div className="font-bold" style={{ color: '#fbbf24', fontSize: '11px', fontFamily: 'DM Sans, sans-serif' }}>
      {value || '—'}
    </div>
    <div className="mt-0.5 uppercase tracking-wider" style={{ color: 'rgba(245,240,232,0.35)', fontSize: '10px', fontFamily: 'DM Sans, sans-serif' }}>
      {label}
    </div>
  </div>
);

const InfoRow = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <span className="text-sm mt-0.5 opacity-50">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="uppercase tracking-widest mb-0.5" style={{ color: 'rgba(245,158,11,0.6)', fontSize: '10px', fontFamily: 'DM Sans, sans-serif' }}>{label}</p>
        <p className="text-sm leading-snug" style={{ color: 'rgba(245,240,232,0.85)', fontFamily: 'DM Sans, sans-serif' }}>{value}</p>
      </div>
    </div>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const f = (dino, field, lang) =>
  lang === 'en' ? (dino[`${field}_en`] || dino[field]) : dino[field];

const DinoPanel = ({ dino, total, t, lang }) => {
  if (!dino) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-25 px-6">
        <span className="text-6xl grayscale select-none">🦖</span>
        <p className="uppercase tracking-[0.2em] text-xs" style={{ color: 'rgba(245,240,232,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
          {t.clickHint}
        </p>
        <p className="text-xs" style={{ color: 'rgba(245,240,232,0.25)', fontFamily: 'DM Sans, sans-serif' }}>
          {t.clickSub}
        </p>
        {total > 0 && (
          <div className="mt-4 px-3 py-1.5 rounded-full" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <span style={{ color: '#fbbf24', fontSize: '12px', fontFamily: 'DM Sans, sans-serif' }}>{t.onMap(total)}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      key={dino.id}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-y-auto h-full"
      style={{ paddingBottom: '1.5rem' }}
    >
      {/* ── Ảnh ── */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: '200px' }}>
        {dino.image_url ? (
          <img
            src={dino.image_url}
            alt={dino.name}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.72) saturate(1.1)' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(30,23,16,0.9)' }}>
            <span className="text-5xl opacity-20">🦕</span>
          </div>
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 20%, rgba(10,8,4,1) 100%)' }} />

        {(dino.period_en || dino.period) && (
          <div className="absolute top-3 left-3">
            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(245,158,11,0.18)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.4)', backdropFilter: 'blur(8px)', fontFamily: 'DM Sans, sans-serif' }}
            >
              {lang === 'en' ? (dino.period_en || dino.period) : (dino.period || dino.period_en)}
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
          <h3 className="text-2xl font-bold leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#f5f0e8' }}>
            {lang === 'en' ? (dino.name_en || dino.name) : dino.name}
          </h3>
          {dino.scientific_name && (
            <p className="text-xs italic mt-0.5" style={{ color: 'rgba(245,240,232,0.4)', fontFamily: 'Nunito, sans-serif' }}>
              {dino.scientific_name}
            </p>
          )}
        </div>
      </div>

      {/* ── Nội dung ── */}
      <div className="px-4 pt-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <StatCard icon="⏳" label={t.age}     value={f(dino, 'age', lang)} />
          <StatCard icon="🗓️" label={t.year}    value={dino.discovery_year} />
          <StatCard icon="🌍" label={t.country} value={f(dino, 'country', lang)} />
        </div>

        <div className="h-px" style={{ background: 'linear-gradient(90deg, rgba(245,158,11,0.35), transparent)' }} />

        <div className="space-y-2">
          <p className="uppercase tracking-[0.25em] font-bold" style={{ color: 'rgba(245,158,11,0.6)', fontSize: '10px', fontFamily: 'DM Sans, sans-serif' }}>
            {t.locationTitle}
          </p>
          <div className="p-3 rounded-xl space-y-2.5" style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.1)' }}>
            <InfoRow icon="🏙️" label={t.province} value={dino.location_province} />
            <InfoRow icon="🌐" label={t.country}  value={f(dino, 'country', lang)} />
            <InfoRow
              icon="🧭"
              label={t.gps}
              value={
                dino.latitude && dino.longitude
                  ? `${parseFloat(dino.latitude).toFixed(3)}°, ${parseFloat(dino.longitude).toFixed(3)}°`
                  : null
              }
            />
          </div>
        </div>

        {f(dino, 'fossil_parts', lang) && (
          <div className="space-y-2">
            <p className="uppercase tracking-[0.25em] font-bold" style={{ color: 'rgba(245,158,11,0.6)', fontSize: '10px', fontFamily: 'DM Sans, sans-serif' }}>
              {t.fossilTitle}
            </p>
            <div className="px-3 py-2.5 rounded-r-xl border-l-4" style={{ background: 'rgba(245,158,11,0.04)', borderLeftColor: 'rgba(245,158,11,0.45)' }}>
              <p className="text-sm italic leading-relaxed" style={{ color: 'rgba(245,240,232,0.7)', fontFamily: 'Nunito, sans-serif' }}>
                {f(dino, 'fossil_parts', lang)}
              </p>
            </div>
          </div>
        )}

        {(f(dino, 'fun_fact', lang) || f(dino, 'description', lang)) && (
          <div className="space-y-1.5">
            <p className="uppercase tracking-[0.25em] font-bold" style={{ color: 'rgba(245,158,11,0.6)', fontSize: '10px', fontFamily: 'DM Sans, sans-serif' }}>
              {t.infoTitle}
            </p>
            <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(245,240,232,0.5)', fontFamily: 'Nunito, sans-serif' }}>
              {f(dino, 'fun_fact', lang) || f(dino, 'description', lang)}
            </p>
          </div>
        )}

        <div className="h-px" style={{ background: 'linear-gradient(90deg, rgba(245,158,11,0.2), transparent)' }} />

        <div className="flex items-center gap-2 pb-2" style={{ color: 'rgba(245,240,232,0.2)', fontSize: '11px', fontFamily: 'DM Sans, sans-serif' }}>
          <span>📍</span>
          <span>{[dino.location_province, dino.country].filter(Boolean).join(', ')}</span>
        </div>
      </div>
    </motion.div>
  );
};

// ─── GLOBE PAGE ───────────────────────────────────────────────────────────────
const GlobePage = () => {
  const [dinos, setDinos] = useState([]);
  const [selectedDino, setSelectedDino] = useState(null);
  const [dataSource, setDataSource] = useState('loading');
  const [lang, setLang] = useState('en');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const viewerRef = useRef(null);
  const hasCenteredOverviewRef = useRef(false);
  const langRef = useRef(lang);
  const navigate = useNavigate();

  // ── Sync langRef khi đổi ──
  useEffect(() => { langRef.current = lang; }, [lang]);

  const t = T[lang];

  const focusOverview = () => {
    const viewer = viewerRef.current?.cesiumElement;
    if (!viewer) return;
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(106.6, 16.0, 18000000),
      orientation: { heading: 0, pitch: -Math.PI / 2, roll: 0 },
      duration: 2.5,
    });
  };

  useEffect(() => {
    const fetchFossils = async () => {
      const result = await getFossilLocations();
      setDinos(result.data || []);
      setDataSource(result.source || 'unknown');
    };
    fetchFossils();
  }, []);

  useEffect(() => {
    if (!dinos.length || hasCenteredOverviewRef.current) return;
    const frameId = window.requestAnimationFrame(() => {
      focusOverview();
      hasCenteredOverviewRef.current = true;
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [dinos]);

  const handleSelect = (dino) => {
    setSelectedDino(dino);
    const viewer = viewerRef.current?.cesiumElement;
    if (!viewer) return;
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(
        Number(dino.longitude),
        Number(dino.latitude),
        8000   // 8 km — thấy rõ nhà cửa, đường xá
      ),
      orientation: {
        heading: 0,
        pitch: -Math.PI / 2,  // nhìn thẳng xuống — điểm vàng luôn hiện
        roll: 0,
      },
      duration: 2.8,
    });
  };

  const isFallbackSource = dataSource.startsWith('fallback');

  return (
    <div className="relative w-full h-screen bg-black flex overflow-hidden">

      {/* ── BẢN ĐỒ ─────────────────────────────────────────────── */}
      <div className="flex-1 relative">
        <Viewer
          full
          ref={viewerRef}
          timeline={false}
          animation={false}
          geocoder={true}
          baseLayerPicker={true}
          navigationHelpButton={true}
          homeButton={true}
          sceneModePicker={true}
          infoBox={false}
          selectionIndicator={false}
        >
          <Globe enableLighting={true} />

          {dinos.map((dino) => (
            <Entity
              key={dino.id}
              name={dino.name}
              position={Cartesian3.fromDegrees(Number(dino.longitude), Number(dino.latitude))}
              onClick={() => handleSelect(dino)}
            >
              <PointGraphics
                pixelSize={selectedDino?.id === dino.id ? 22 : 14}
                color={selectedDino?.id === dino.id ? Color.fromCssColorString('#f59e0b') : Color.fromCssColorString('#fbbf24')}
                outlineColor={Color.WHITE}
                outlineWidth={selectedDino?.id === dino.id ? 4 : 2}
              />
            </Entity>
          ))}
        </Viewer>
      </div>

      {/* ── SIDEBAR ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ x: 370, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 370, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0 flex flex-col z-10 overflow-hidden"
            style={{
              width: '370px',
              background: 'rgba(10,8,4,0.97)',
              borderLeft: '1px solid rgba(245,158,11,0.15)',
              backdropFilter: 'blur(12px)',
              boxShadow: '-8px 0 40px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div className="px-5 py-4 flex-shrink-0 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(245,158,11,0.1)' }}>
              <div>
                <p className="uppercase tracking-[0.28em] font-bold" style={{ color: 'rgba(245,158,11,0.5)', fontSize: '9px', fontFamily: 'DM Sans, sans-serif' }}>
                  {t.museumLabel}
                </p>
                <h2 className="text-base font-bold mt-0.5" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#f5f0e8' }}>
                  {t.mapTitle}
                </h2>
                {isFallbackSource && (
                  <p className="mt-1" style={{ color: 'rgba(245,240,232,0.42)', fontSize: '11px', fontFamily: 'DM Sans, sans-serif' }}>
                    {t.fallbackNote}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!isSupabaseConfigured && (
                  <div className="px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,240,232,0.08)', border: '1px solid rgba(245,240,232,0.12)' }}>
                    <span style={{ color: 'rgba(245,240,232,0.72)', fontSize: '10px', fontFamily: 'DM Sans, sans-serif' }}>No env</span>
                  </div>
                )}
                <div className="px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', whiteSpace: 'nowrap' }}>
                  <span style={{ color: '#fbbf24', fontSize: '11px', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}>
                    {dinos.length > 0 ? t.samples(dinos.length) : t.loading}
                  </span>
                </div>

                {/* ── Nút chuyển ngôn ngữ VI/EN ── */}
                <button
                  onClick={() => setLang(l => l === 'vi' ? 'en' : 'vi')}
                  title="Switch language / Chuyển ngôn ngữ"
                  style={{
                    padding: '4px 12px',
                    height: '28px',
                    background: 'rgba(245,158,11,0.12)',
                    border: '1px solid rgba(245,158,11,0.45)',
                    borderRadius: '9999px',
                    color: '#fbbf24',
                    fontSize: '13px',
                    fontWeight: '800',
                    fontFamily: 'DM Sans, sans-serif',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    transition: 'background 0.15s, border-color 0.15s',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    display: 'flex', alignItems: 'center',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.28)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.85)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.12)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.45)'; }}
                >
                  {lang.toUpperCase()}
                </button>

                {/* ── Nút đóng sidebar — tròn vàng như dino-popup__close ── */}
                <button
                  onClick={() => setSidebarOpen(false)}
                  title="Close panel"
                  style={{
                    width: '28px', height: '28px',
                    background: 'rgba(245,158,11,0.12)',
                    border: '1px solid rgba(245,158,11,0.35)',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'background 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.85)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.12)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.35)'; }}
                />
              </div>
            </div>

            {/* Panel nội dung */}
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                <DinoPanel key={`${selectedDino?.id ?? 'empty'}-${lang}`} dino={selectedDino} total={dinos.length} t={t} lang={lang} />
              </AnimatePresence>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── NÚT MỞ LẠI SIDEBAR (khi đã đóng) ──────────────────────── */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            key="reopen-btn"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSidebarOpen(true)}
            className="absolute right-0 z-20 flex items-center gap-2 px-3 py-2.5 rounded-l-xl"
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(10,8,4,0.88)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRight: 'none',
              color: '#fbbf24',
              backdropFilter: 'blur(10px)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.08em',
              writingMode: 'vertical-rl',
              cursor: 'pointer',
            }}
          >
            ◀ {t.mapTitle}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── NÚT QUAY LẠI ─────────────────────────────────────────── */}
      <motion.button
        onClick={() => navigate('/')}
        className="absolute top-5 left-5 z-20 flex items-center gap-2 px-5 py-2.5 rounded-full"
        style={{
          background: 'rgba(10,8,4,0.7)',
          border: '1px solid rgba(245,158,11,0.25)',
          color: 'rgba(245,240,232,0.75)',
          backdropFilter: 'blur(10px)',
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '15px',
          fontWeight: '600',
          letterSpacing: '0.05em',
        }}
        whileHover={{ background: 'rgba(245,158,11,0.15)', borderColor: 'rgba(245,158,11,0.6)', color: '#fbbf24' }}
        whileTap={{ scale: 0.96 }}
      >
        <motion.span
          animate={{ x: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          ←
        </motion.span>
        <span>{t.back}</span>
      </motion.button>
    </div>
  );
};

export default GlobePage;