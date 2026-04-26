import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Dinosaur/prehistoric-themed background music tracks (Creative Commons from Pixabay)
const TRACKS = [
  {
    url: 'https://cdn.pixabay.com/audio/2023/06/13/audio_8e6d858e25.mp3',
    label: 'Jurassic Epic',
  },
  {
    url: 'https://cdn.pixabay.com/audio/2022/10/30/audio_946f88d5c4.mp3',
    label: 'Ancient World',
  },
  {
    url: 'https://cdn.pixabay.com/audio/2023/03/09/audio_4d8e4ca3f7.mp3',
    label: 'Prehistoric Journey',
  },
];

const AmbientAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showVolume, setShowVolume] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const audioRef = useRef(null);
  const hideTimer = useRef(null);

  // Khởi tạo audio khi mount
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.loop = true;

    const onCanPlay = () => setLoaded(true);
    audio.addEventListener('canplaythrough', onCanPlay);
    return () => audio.removeEventListener('canplaythrough', onCanPlay);
  }, []);

  // Cập nhật âm lượng khi thay đổi
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Chuyển sang bài mới khi đổi track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const wasPlaying = isPlaying;
    audio.load();
    setLoaded(false);
    if (wasPlaying) {
      audio.addEventListener('canplaythrough', () => {
        audio.play().catch(() => {});
      }, { once: true });
    }
  }, [trackIndex]);

  // Bật/tắt nhạc
  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // Chuyển sang bài tiếp theo
  const nextTrack = (e) => {
    e.stopPropagation();
    setTrackIndex(prev => (prev + 1) % TRACKS.length);
  };

  const handleVolumeHover = () => {
    clearTimeout(hideTimer.current);
    setShowVolume(true);
  };

  const handleVolumeLeave = () => {
    hideTimer.current = setTimeout(() => setShowVolume(false), 1800);
  };

  // Các cột sóng âm thanh (animation khi đang phát)
  const bars = [3, 6, 4, 7, 5, 8, 3, 6, 4];

  return (
    <>
      <audio ref={audioRef} src={TRACKS[trackIndex].url} preload="none" />

      <motion.div
        className="fixed bottom-6 left-6 z-50 flex items-end gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        onMouseEnter={handleVolumeHover}
        onMouseLeave={handleVolumeLeave}
      >
        {/* Popup điều chỉnh âm lượng */}
        <AnimatePresence>
          {showVolume && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 px-3 py-2 rounded-full"
              style={{
                background: 'rgba(17,14,8,0.95)',
                border: '1px solid rgba(245,158,11,0.25)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span className="text-xs" style={{ color: 'rgba(245,158,11,0.7)' }}>🔈</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#f59e0b' }}
              />
              <span className="text-xs font-mono" style={{ color: 'rgba(245,158,11,0.7)' }}>
                {Math.round(volume * 100)}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nút chính phát/dừng nhạc */}
        <motion.button
          onClick={toggle}
          className="relative flex items-center gap-2 px-4 py-2.5 rounded-full cursor-pointer"
          style={{
            background: isPlaying
              ? 'rgba(245,158,11,0.15)'
              : 'rgba(17,14,8,0.9)',
            border: '1px solid rgba(245,158,11,0.3)',
            backdropFilter: 'blur(16px)',
            boxShadow: isPlaying
              ? '0 0 20px rgba(245,158,11,0.2), 0 4px 20px rgba(0,0,0,0.4)'
              : '0 4px 20px rgba(0,0,0,0.4)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isPlaying ? 'Stop dinosaur music' : 'Play dinosaur music'}
        >
          {/* Hiển thị sóng âm khi phát, hoặc icon nhạc khi tắt */}
          <div className="flex items-center gap-0.5 h-4">
            {isPlaying ? (
              bars.map((h, i) => (
                <motion.div
                  key={i}
                  className="w-0.5 rounded-full"
                  style={{ background: '#f59e0b' }}
                  animate={{ height: [`${h * 2}px`, `${h * 3.5}px`, `${h * 2}px`] }}
                  transition={{
                    duration: 0.6 + i * 0.07,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.05,
                  }}
                />
              ))
            ) : (
              <span style={{ color: 'rgba(245,158,11,0.7)', fontSize: '14px', lineHeight: 1 }}>
                🎵
              </span>
            )}
          </div>

          <span
            className="text-xs font-medium"
            style={{ color: isPlaying ? '#fbbf24' : 'rgba(245,158,11,0.6)', fontFamily: 'DM Sans, sans-serif' }}
          >
            {isPlaying ? TRACKS[trackIndex].label : 'Dino Music'}
          </span>

          {/* Vòng phát sáng khi đang phát */}
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ border: '1px solid rgba(245,158,11,0.4)' }}
              animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>

        {/* Nút chuyển bài (chỉ hiện khi đang phát) */}
        {isPlaying && (
          <motion.button
            onClick={nextTrack}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs cursor-pointer"
            style={{
              background: 'rgba(17,14,8,0.9)',
              border: '1px solid rgba(245,158,11,0.25)',
              backdropFilter: 'blur(12px)',
              color: 'rgba(245,158,11,0.7)',
            }}
            whileHover={{ scale: 1.1, borderColor: '#f59e0b' }}
            whileTap={{ scale: 0.9 }}
            title="Next track"
          >
            ⏭
          </motion.button>
        )}
      </motion.div>
    </>
  );
};

export default AmbientAudio;
