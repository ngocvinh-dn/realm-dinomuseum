import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteAssets } from '../../hooks/useSiteAssets';

const FALLBACK_TRACKS = [
  { url: 'https://cdn.pixabay.com/audio/2023/06/13/audio_8e6d858e25.mp3', label: 'Jurassic Epic' },
  { url: 'https://cdn.pixabay.com/audio/2022/10/30/audio_946f88d5c4.mp3', label: 'Ancient World' },
  { url: 'https://cdn.pixabay.com/audio/2023/03/09/audio_4d8e4ca3f7.mp3', label: 'Prehistoric Journey' },
];

const AmbientAudio = () => {
  const { assets } = useSiteAssets();
  const tracks = assets.filter((a) => a.asset_type === 'audio').map((a) => ({ url: a.public_url, label: a.title || a.name || 'Ambient Track' }));
  const playlist = tracks.length ? tracks : FALLBACK_TRACKS;
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showVolume, setShowVolume] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const audioRef = useRef(null);
  const hideTimer = useRef(null);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);
  useEffect(() => { if (audioRef.current) { audioRef.current.load(); if (isPlaying) audioRef.current.play().catch(() => {}); } }, [trackIndex]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); } else { audio.play().then(() => setIsPlaying(true)).catch(() => {}); }
  };

  const nextTrack = (e) => { e.stopPropagation(); setTrackIndex((prev) => (prev + 1) % playlist.length); };
  const handleVolumeHover = () => { clearTimeout(hideTimer.current); setShowVolume(true); };
  const handleVolumeLeave = () => { hideTimer.current = setTimeout(() => setShowVolume(false), 1800); };
  const bars = [3, 6, 4, 7, 5, 8, 3, 6, 4];

  return (
    <>
      <audio ref={audioRef} src={playlist[trackIndex]?.url} preload="none" loop />
      <motion.div className="fixed bottom-6 left-6 z-50 flex items-end gap-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 0.6 }} onMouseEnter={handleVolumeHover} onMouseLeave={handleVolumeLeave}>
        <AnimatePresence>{showVolume && (<motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex items-center gap-2 px-3 py-2 rounded-full" style={{ background: 'rgba(17,14,8,0.95)', border: '1px solid rgba(245,158,11,0.25)', backdropFilter: 'blur(12px)' }}>
          <span className="text-xs" style={{ color: 'rgba(245,158,11,0.7)' }}>🔈</span>
          <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-20 h-1 rounded-full appearance-none cursor-pointer" style={{ accentColor: '#f59e0b' }} />
          <span className="text-xs font-mono" style={{ color: 'rgba(245,158,11,0.7)' }}>{Math.round(volume * 100)}%</span>
        </motion.div>)}</AnimatePresence>
        <motion.button onClick={toggle} className="relative flex items-center gap-2 px-4 py-2.5 rounded-full cursor-pointer" style={{ background: isPlaying ? 'rgba(245,158,11,0.15)' : 'rgba(17,14,8,0.9)', border: '1px solid rgba(245,158,11,0.3)', backdropFilter: 'blur(16px)' }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} title={isPlaying ? 'Stop dinosaur music' : 'Play dinosaur music'}>
          <div className="flex items-center gap-0.5 h-4">{isPlaying ? bars.map((h, i) => (<motion.div key={i} className="w-0.5 rounded-full" style={{ background: '#f59e0b' }} animate={{ height: [`${h * 2}px`, `${h * 3.5}px`, `${h * 2}px`] }} transition={{ duration: 0.6 + i * 0.07, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }} />)) : <span style={{ color: 'rgba(245,158,11,0.7)', fontSize: '14px', lineHeight: 1 }}>🎵</span>}</div>
          <span className="text-xs font-medium" style={{ color: isPlaying ? '#fbbf24' : 'rgba(245,158,11,0.6)', fontFamily: 'DM Sans, sans-serif' }}>{isPlaying ? playlist[trackIndex]?.label : 'Dino Music'}</span>
        </motion.button>
        {isPlaying && <motion.button onClick={nextTrack} className="w-8 h-8 rounded-full flex items-center justify-center text-xs cursor-pointer" style={{ background: 'rgba(17,14,8,0.9)', border: '1px solid rgba(245,158,11,0.25)', backdropFilter: 'blur(12px)', color: 'rgba(245,158,11,0.7)' }} whileHover={{ scale: 1.1, borderColor: '#f59e0b' }} whileTap={{ scale: 0.9 }}>⏭</motion.button>}
      </motion.div>
    </>
  );
};

export default AmbientAudio;
