import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const rooms = [
  {
    id: 'entrance',
    name: 'Sảnh Chính',
    emoji: '🏛️',
    desc: 'Điểm khởi đầu hành trình — bộ xương T-Rex khổng lồ, cao 4m, được chiếu sáng bằng spotlight từ trần vòm.',
    artifacts: 12,
    style: { top: '42%', left: '38%', width: '24%', height: '18%' },
    isEntrance: true,
  },
  {
    id: 'mesozoic',
    name: 'Đại Trung Sinh',
    emoji: '🌿',
    desc: 'Phòng lớn nhất — hành trình 180 triệu năm từ Triassic đến Cretaceous cuối.',
    artifacts: 150,
    style: { top: '5%', left: '5%', width: '30%', height: '35%' },
  },
  {
    id: 'theropoda',
    name: 'Theropoda Hall',
    emoji: '🦖',
    desc: 'Hành lang săn mồi — Velociraptor, Allosaurus, Spinosaurus trong ánh đèn đỏ đặc trưng.',
    artifacts: 48,
    style: { top: '5%', left: '65%', width: '30%', height: '35%' },
  },
  {
    id: 'extinction',
    name: 'Tuyệt Chủng',
    emoji: '☄️',
    desc: 'Phòng sự kiện K-Pg — mô hình tiểu hành tinh, crater và bằng chứng về "ngày tàn".',
    artifacts: 35,
    style: { top: '65%', left: '5%', width: '30%', height: '30%' },
  },
  {
    id: 'vietnam',
    name: 'Hóa Thạch VN',
    emoji: '🇻🇳',
    desc: 'Phòng đặc biệt — toàn bộ phát hiện cổ sinh vật học trên lãnh thổ Việt Nam.',
    artifacts: 23,
    style: { top: '65%', left: '65%', width: '30%', height: '30%' },
  },
];

const MuseumMap = () => {
  const [activeRoom, setActiveRoom] = useState(null);

  return (
    <section
      id="museum-map"
      className="section-pad relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0804 0%, #110e08 100%)' }}
    >
      <div className="relative max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-divider mx-auto" style={{ margin: '0 auto 1.5rem' }} />
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#f59e0b' }}>
            Sơ Đồ Bảo Tàng
          </p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Khám Phá{' '}
            <span className="text-gradient-amber">Floor Plan</span>
          </h2>
          <p className="mt-3 text-sm" style={{ color: 'rgba(245,240,232,0.4)' }}>
            Click vào phòng để xem chi tiết
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Map */}
          <motion.div
            className="w-full lg:w-3/5"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="relative w-full rounded-2xl overflow-hidden"
              style={{
                paddingBottom: '75%',
                background: 'rgba(17,14,8,0.95)',
                border: '1px solid rgba(245,158,11,0.2)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 0 60px rgba(245,158,11,0.02)',
              }}
            >
              <div className="absolute inset-0 p-4">
                {/* Grid lines */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={`h${i}`} className="absolute w-full h-px" style={{ top: `${20 * i}%`, background: 'rgba(245,158,11,0.04)' }} />
                ))}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={`v${i}`} className="absolute h-full w-px" style={{ left: `${20 * i}%`, background: 'rgba(245,158,11,0.04)' }} />
                ))}

                {/* Corridor */}
                <div
                  className="absolute"
                  style={{
                    top: '42%',
                    left: '5%',
                    width: '90%',
                    height: '18%',
                    background: 'rgba(245,158,11,0.02)',
                    border: '1px dashed rgba(245,158,11,0.1)',
                    borderRadius: '4px',
                  }}
                />
                <span
                  className="absolute text-xs"
                  style={{ top: '48%', left: '50%', transform: 'translateX(-50%)', color: 'rgba(245,158,11,0.25)', fontSize: '9px', letterSpacing: '0.2em' }}
                >
                  CORRIDOR
                </span>

                {/* Rooms */}
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    id={`map-room-${room.id}`}
                    className={`museum-map-room ${activeRoom?.id === room.id ? 'active' : ''}`}
                    style={room.style}
                    onClick={() => setActiveRoom(activeRoom?.id === room.id ? null : room)}
                  >
                    <div className="p-1 w-full h-full flex flex-col items-center justify-center gap-0.5">
                      <span className="text-base">{room.emoji}</span>
                      <span
                        className="text-xs font-medium leading-tight text-center"
                        style={{
                          color: activeRoom?.id === room.id ? '#fbbf24' : 'rgba(245,240,232,0.65)',
                          fontSize: '9px',
                          fontFamily: 'Playfair Display, serif',
                        }}
                      >
                        {room.name}
                      </span>
                    </div>

                    {/* Active glow */}
                    {activeRoom?.id === room.id && (
                      <motion.div
                        className="absolute inset-0 rounded-md"
                        style={{ background: 'rgba(245,158,11,0.08)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layoutId="room-active"
                      />
                    )}
                  </button>
                ))}

                {/* Entrance arrow */}
                <div className="absolute" style={{ bottom: '2%', left: '45%', transform: 'translateX(-50%)' }}>
                  <div className="flex flex-col items-center gap-0.5">
                    <div style={{ color: 'rgba(245,158,11,0.5)', fontSize: '10px' }}>▼</div>
                    <span style={{ color: 'rgba(245,158,11,0.4)', fontSize: '8px', letterSpacing: '0.1em' }}>ENTRANCE</span>
                  </div>
                </div>

                {/* Map label */}
                <div
                  className="absolute top-2 right-2 px-2 py-1 rounded text-xs"
                  style={{ background: 'rgba(10,8,4,0.8)', color: 'rgba(245,158,11,0.5)', fontSize: '9px', letterSpacing: '0.1em' }}
                >
                  FLOOR 1
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs text-center" style={{ color: 'rgba(245,240,232,0.3)' }}>
              Sơ đồ minh họa • Không theo tỷ lệ thực
            </p>
          </motion.div>

          {/* Room detail panel */}
          <motion.div
            className="w-full lg:w-2/5"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {activeRoom ? (
                <motion.div
                  key={activeRoom.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="glass-card p-6"
                  style={{ border: '1px solid rgba(245,158,11,0.3)' }}
                >
                  <div className="text-4xl mb-3">{activeRoom.emoji}</div>
                  <h3
                    className="font-serif font-bold text-xl mb-2"
                    style={{ fontFamily: 'Playfair Display, serif', color: '#fbbf24' }}
                  >
                    {activeRoom.name}
                  </h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(245,240,232,0.65)' }}>
                    {activeRoom.desc}
                  </p>

                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className="px-3 py-2 rounded-xl text-center"
                      style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
                    >
                      <div className="text-xl font-bold font-serif" style={{ color: '#fbbf24' }}>{activeRoom.artifacts}</div>
                      <div className="text-xs" style={{ color: 'rgba(245,240,232,0.4)' }}>Hiện vật</div>
                    </div>
                    {activeRoom.isEntrance && (
                      <div
                        className="px-3 py-1.5 rounded-full text-xs font-bold"
                        style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}
                      >
                        📍 Bạn ở đây
                      </div>
                    )}
                  </div>

                  <button
                    className="btn-amber-primary text-xs py-3 px-5 w-full"
                    onClick={() => document.querySelector('#dang-ky')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    🎟️ Vào Tham Quan Phòng Này
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-8 text-center flex flex-col items-center justify-center"
                  style={{ minHeight: '280px' }}
                >
                  <span className="text-5xl mb-4 opacity-30">🗺️</span>
                  <p className="text-sm" style={{ color: 'rgba(245,240,232,0.35)', fontStyle: 'italic' }}>
                    Click vào bất kỳ phòng nào trên sơ đồ để xem thông tin chi tiết
                  </p>
                  <div className="flex flex-wrap gap-2 mt-6 justify-center">
                    {rooms.map((r) => (
                      <button
                        key={r.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all"
                        style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', color: 'rgba(245,240,232,0.55)' }}
                        onClick={() => setActiveRoom(r)}
                      >
                        {r.emoji} {r.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MuseumMap;
