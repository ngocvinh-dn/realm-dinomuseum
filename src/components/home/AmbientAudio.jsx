import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteAssets } from '../../hooks/useSiteAssets';

const LOCAL_TRACKS = [
  { url: '/audio/dino-audio.wav', label: 'Dino Music' },
];

const FALLBACK_TRACKS = [
  { url: 'https://cdn.pixabay.com/audio/2024/05/15/audio_6a3c8f2f2b.mp3', label: 'Symphonic Discovery' },
  { url: 'https://cdn.pixabay.com/audio/2024/03/07/audio_b8d7f7d2e4.mp3', label: 'War Drums of the Ancients' },
  { url: 'https://cdn.pixabay.com/audio/2024/01/18/audio_9fdc6c9d0d.mp3', label: 'Dawn of the Titans' },
];

const AUDIO_UNLOCK_KEY = 'dino-audio-unlocked';

const AmbientAudio = () => {
  const { assets } = useSiteAssets();
  const tracks = assets
    .filter((a) => a.asset_type === 'audio')
    .map((a) => ({ url: a.public_url, label: a.title || a.name || 'Ambient Track' }));
  const playlist = [...LOCAL_TRACKS, ...(tracks.length ? tracks : FALLBACK_TRACKS)];
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolume, setShowVolume] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const audioRef = useRef(null);
  const hideTimer = useRef(null);

  const playAudio = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;

    try {
      await audio.play();
      localStorage.setItem(AUDIO_UNLOCK_KEY, '1');
      setIsPlaying(true);
      return true;
    } catch {
      setIsPlaying(false);
      return false;
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.min(1, Math.max(0, volume));
    }
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.load();
    if (isPlaying) {
      playAudio();
    }
  }, [trackIndex, isPlaying, playAudio]);

  useEffect(() => {
    if (!isReady) return undefined;

    let cancelled = false;

    const tryAutoplay = async () => {
      if (cancelled) return;
      await playAudio();
    };

    if (localStorage.getItem(AUDIO_UNLOCK_KEY) === '1') {
      tryAutoplay();
    } else {
      tryAutoplay();
    }

    const unlockAndPlay = async () => {
      if (cancelled) return;
      const started = await playAudio();
      if (!started) return;

      window.removeEventListener('pointerdown', unlockAndPlay);
      window.removeEventListener('keydown', unlockAndPlay);
      window.removeEventListener('touchstart', unlockAndPlay);
    };

    window.addEventListener('pointerdown', unlockAndPlay, { passive: true });
    window.addEventListener('keydown', unlockAndPlay);
    window.addEventListener('touchstart', unlockAndPlay, { passive: true });

    return () => {
      cancelled = true;
      window.removeEventListener('pointerdown', unlockAndPlay);
      window.removeEventListener('keydown', unlockAndPlay);
      window.removeEventListener('touchstart', unlockAndPlay);
    };
  }, [isReady, trackIndex, playAudio]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      playAudio();
    }
  };

  const nextTrack = (e) => { e.stopPropagation(); setTrackIndex((prev) => (prev + 1) % playlist.length); };
  const handleVolumeHover = () => { clearTimeout(hideTimer.current); setShowVolume(true); };
  const handleVolumeLeave = () => { hideTimer.current = setTimeout(() => setShowVolume(false), 1800); };
  const bars = [3, 6, 4, 7, 5, 8, 3, 6, 4];

  return (
    <>
      <audio
        ref={audioRef}
        src={playlist[trackIndex]?.url}
        autoPlay
        preload="auto"
        loop
        onCanPlayThrough={() => setIsReady(true)}
      />
      <motion.div
        className="fixed bottom-6 left-6 z-50 flex items-end gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        onMouseEnter={handleVolumeHover}
        onMouseLeave={handleVolumeLeave}
      >
        <AnimatePresence>
          {showVolume && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2 px-3 py-2 rounded-full"
              style={{ background: 'rgba(17,14,8,0.95)', border: '1px solid rgba(245,158,11,0.25)', backdropFilter: 'blur(12px)' }}
            >
              <span className="text-xs" style={{ color: 'rgba(245,158,11,0.7)' }}>🔈</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-28 h-1 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#f59e0b' }}
              />
              <span className="text-xs font-mono" style={{ color: 'rgba(245,158,11,0.7)' }}>{Math.round(volume * 100)}%</span>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          onClick={toggle}
          className="relative flex items-center gap-2 px-4 py-2.5 rounded-full cursor-pointer"
          style={{ background: isPlaying ? 'rgba(245,158,11,0.15)' : 'rgba(17,14,8,0.9)', border: '1px solid rgba(245,158,11,0.3)', backdropFilter: 'blur(16px)' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isPlaying ? 'Pause dinosaur music' : 'Play dinosaur music'}
        >
          <div className="flex items-center gap-0.5 h-4">
            {isPlaying ? bars.map((h, i) => (<motion.div key={i} className="w-0.5 rounded-full" style={{ background: '#f59e0b' }} animate={{ height: [`${h * 2}px`, `${h * 3.5}px`, `${h * 2}px`] }} transition={{ duration: 0.6 + i * 0.07, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }} />)) : <span style={{ color: 'rgba(245,158,11,0.7)', fontSize: '14px', lineHeight: 1 }}>🎵</span>}
          </div>
          <span className="text-xs font-medium" style={{ color: isPlaying ? '#fbbf24' : 'rgba(245,158,11,0.6)', fontFamily: 'var(--font-body)' }}>
            {isPlaying ? playlist[trackIndex]?.label : 'Dino Music'}
          </span>
        </motion.button>
        <motion.button
          onClick={nextTrack}
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs cursor-pointer"
          style={{ background: 'rgba(17,14,8,0.9)', border: '1px solid rgba(245,158,11,0.25)', backdropFilter: 'blur(12px)', color: 'rgba(245,158,11,0.7)', opacity: isPlaying ? 1 : 0.6 }}
          whileHover={{ scale: 1.1, borderColor: '#f59e0b' }}
          whileTap={{ scale: 0.9 }}
          disabled={!playlist.length}
          title="Next track"
        >
          ⏭
        </motion.button>
      </motion.div>
    </>
  );
};

export default AmbientAudio;
