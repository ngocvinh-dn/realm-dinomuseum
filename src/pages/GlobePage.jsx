import React, { useState, useEffect, useRef } from 'react';
import { Viewer, Entity, PointGraphics, Globe } from 'resium';
import { Cartesian3, Color } from 'cesium';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/supabaseclinet/supabase-clinet';
import { motion, AnimatePresence } from 'framer-motion';

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
const DinoPanel = ({ dino, total }) => {
  if (!dino) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-25 px-6">
        <span className="text-6xl grayscale select-none">🦖</span>
        <p className="uppercase tracking-[0.2em] text-xs" style={{ color: 'rgba(245,240,232,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
          Chọn một điểm vàng
        </p>
        <p className="text-xs" style={{ color: 'rgba(245,240,232,0.25)', fontFamily: 'DM Sans, sans-serif' }}>
          để khám phá hóa thạch
        </p>
        {total > 0 && (
          <div className="mt-4 px-3 py-1.5 rounded-full" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <span style={{ color: '#fbbf24', fontSize: '12px', fontFamily: 'DM Sans, sans-serif' }}>{total} mẫu vật trên bản đồ</span>
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
      {/* Ảnh */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: '200px' }}>
        {dino.image_url ? (
          <img src={dino.image_url} alt={dino.name} className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.72) saturate(1.1)' }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(30,23,16,0.9)' }}>
            <span className="text-5xl opacity-20">🦕</span>
          </div>
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 20%, rgba(10,8,4,1) 100%)' }} />

        {/* Badge kỷ */}
        {dino.period && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(245,158,11,0.18)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.4)', backdropFilter: 'blur(8px)', fontFamily: 'DM Sans, sans-serif' }}>
              {dino.period}
            </span>
          </div>
        )}

        {/* Tên */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
          <h3 className="text-2xl font-bold leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#f5f0e8' }}>
            {dino.name}
          </h3>
          {dino.scientific_name && (
            <p className="text-xs italic mt-0.5"
              style={{ color: 'rgba(245,240,232,0.4)', fontFamily: 'Nunito, sans-serif' }}>
              {dino.scientific_name}
            </p>
          )}
        </div>
      </div>

      {/* Nội dung */}
      <div className="px-4 pt-4 space-y-4">
        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard icon="⏳" label="Niên đại" value={dino.age} />
          <StatCard icon="🗓️" label="Năm phát hiện" value={dino.discovery_year} />
          <StatCard icon="🌍" label="Quốc gia" value={dino.country} />
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: 'linear-gradient(90deg, rgba(245,158,11,0.35), transparent)' }} />

        {/* Địa điểm */}
        <div className="space-y-2">
          <p className="uppercase tracking-[0.25em] font-bold"
            style={{ color: 'rgba(245,158,11,0.6)', fontSize: '10px', fontFamily: 'DM Sans, sans-serif' }}>
            📍 Địa điểm phát hiện
          </p>
          <div className="p-3 rounded-xl space-y-2.5"
            style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.1)' }}>
            <InfoRow icon="🏙️" label="Tỉnh / Thành phố" value={dino.location_province} />
            <InfoRow icon="🌐" label="Quốc gia" value={dino.country} />
            <InfoRow icon="🧭" label="Tọa độ GPS"
              value={dino.latitude && dino.longitude
                ? `${parseFloat(dino.latitude).toFixed(3)}°, ${parseFloat(dino.longitude).toFixed(3)}°`
                : null}
            />
          </div>
        </div>

        {/* Hóa thạch */}
        {dino.fossil_parts && (
          <div className="space-y-2">
            <p className="uppercase tracking-[0.25em] font-bold"
              style={{ color: 'rgba(245,158,11,0.6)', fontSize: '10px', fontFamily: 'DM Sans, sans-serif' }}>
              🦴 Bộ phận hóa thạch tìm được
            </p>
            <div className="px-3 py-2.5 rounded-r-xl border-l-4"
              style={{ background: 'rgba(245,158,11,0.04)', borderLeftColor: 'rgba(245,158,11,0.45)' }}>
              <p className="text-sm italic leading-relaxed"
                style={{ color: 'rgba(245,240,232,0.7)', fontFamily: 'Nunito, sans-serif' }}>
                {dino.fossil_parts}
              </p>
            </div>
          </div>
        )}

        {/* Mô tả */}
        {(dino.description || dino.fun_fact) && (
          <div className="space-y-1.5">
            <p className="uppercase tracking-[0.25em] font-bold"
              style={{ color: 'rgba(245,158,11,0.6)', fontSize: '10px', fontFamily: 'DM Sans, sans-serif' }}>
              📖 Thông tin nổi bật
            </p>
            <p className="text-sm leading-relaxed italic"
              style={{ color: 'rgba(245,240,232,0.5)', fontFamily: 'Nunito, sans-serif' }}>
              {dino.description || dino.fun_fact}
            </p>
          </div>
        )}

        <div className="h-px" style={{ background: 'linear-gradient(90deg, rgba(245,158,11,0.2), transparent)' }} />

        <div className="flex items-center gap-2 pb-2"
          style={{ color: 'rgba(245,240,232,0.2)', fontSize: '11px', fontFamily: 'DM Sans, sans-serif' }}>
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
  const viewerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFossils = async () => {
      const { data, error } = await supabase.from('fossil_locations').select('*');
      if (error) {
        console.error('Lỗi kết nối:', error.message);
      } else {
        setDinos(data || []);
      }
    };
    fetchFossils();
  }, []);

  const handleSelect = (dino) => {
    setSelectedDino(dino);
    if (viewerRef.current?.cesiumElement) {
      viewerRef.current.cesiumElement.camera.flyTo({
        destination: Cartesian3.fromDegrees(
          Number(dino.longitude),
          Number(dino.latitude),
          2000          // zoom cực sát mặt đất
        ),
        orientation: {
          heading: 0,   // hướng Bắc
          pitch: -0.8,  // nhìn xuống 45° — hiệu ứng 3D đẹp
          roll: 0,
        },
        duration: 2,    // bay 2 giây
      });
    }
  };

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
                color={selectedDino?.id === dino.id
                  ? Color.fromCssColorString('#f59e0b')
                  : Color.fromCssColorString('#fbbf24')}
                outlineColor={Color.WHITE}
                outlineWidth={selectedDino?.id === dino.id ? 4 : 2}
              />
            </Entity>
          ))}
        </Viewer>
      </div>

      {/* ── SIDEBAR ─────────────────────────────────────────────── */}
      <aside
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
        <div className="px-5 py-4 flex-shrink-0 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(245,158,11,0.1)' }}>
          <div>
            <p className="uppercase tracking-[0.28em] font-bold"
              style={{ color: 'rgba(245,158,11,0.5)', fontSize: '9px', fontFamily: 'DM Sans, sans-serif' }}>
              Bảo Tàng Khủng Long · Hóa Thạch
            </p>
            <h2 className="text-base font-bold mt-0.5"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: '#f5f0e8' }}>
              Bản đồ Phát hiện
            </h2>
          </div>
          <div className="px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <span style={{ color: '#fbbf24', fontSize: '11px', fontFamily: 'DM Sans, sans-serif' }}>
              {dinos.length > 0 ? `${dinos.length} mẫu` : '...'}
            </span>
          </div>
        </div>

        {/* Nội dung */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <DinoPanel key={selectedDino?.id ?? 'empty'} dino={selectedDino} total={dinos.length} />
          </AnimatePresence>
        </div>
      </aside>

      {/* ── NÚT QUAY LẠI — đúng font style như ảnh ─────────────── */}
      <motion.button
        onClick={() => navigate('/')}
        className="absolute top-5 left-5 z-20 flex items-center gap-2 px-5 py-2.5 rounded-full"
        style={{
          background: 'rgba(10,8,4,0.7)',
          border: '1px solid rgba(245,158,11,0.25)',
          color: 'rgba(245,240,232,0.75)',
          backdropFilter: 'blur(10px)',
          fontFamily: 'Cormorant Garamond, serif',   /* ← font chữ đúng kiểu */
          fontSize: '15px',
          fontWeight: '700',
          fontWeight: '600',
          letterSpacing: '0.05em',
        }}
        whileHover={{
          background: 'rgba(245,158,11,0.15)',
          borderColor: 'rgba(245,158,11,0.6)',
          color: '#fbbf24',
        }}
        whileTap={{ scale: 0.96 }}
      >
        <motion.span
          animate={{ x: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          ←
        </motion.span>
        <span>Trở về</span>
      </motion.button>
    </div>
  );
};

export default GlobePage;