import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { id: 'hero', label: { vi: 'Trang chủ', en: 'Home' }, href: '#hero' },
  { id: 'timeline', label: { vi: 'Dòng thời gian', en: 'Timeline' }, href: '#timeline' },
  { id: 'specimens', label: { vi: 'Hiện vật', en: 'Specimens' }, href: '#specimens' },
  { id: 'explore-globe', label: { vi: 'Khám phá hóa thạch globe', en: 'Explore' }, href: '#explore-globe', isExplore: true },
  { id: 'dang-ky', label: { vi: 'Đăng ký vé', en: 'Tickets' }, href: '#dang-ky' },
];

const scrollToSection = (href, offset = -80) => {
  const target = document.querySelector(href);
  if (!target) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(target, {
      offset,
      duration: 2.2,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const Navbar = ({ onLoginClick, onLocaleToggle, locale, onSectionChange, activeSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  // pillStyle lưu vị trí/kích thước chính xác của pill sau khi DOM đã render
  const [pillStyle, setPillStyle] = useState(null);
  const { user, signOut } = useAuth();
  const tabRefs = useRef({});
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const current = navLinks.find((link) => {
        const section = document.querySelector(link.href);
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top <= 150 && rect.bottom >= 150;
      });
      if (current) onSectionChange?.(current.id);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onSectionChange]);

  const handleNavClick = (href, id) => {
    setMobileOpen(false);
    onSectionChange?.(id);
    scrollToSection(href);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    scrollToSection('#hero', 0);
  };

  // ─── Spring values cho pill animation ─────────────────────────────────────
  // useSpring giúp left/width chuyển động nội suy mượt mà không giật cục
  const springConfig = { stiffness: 260, damping: 24, mass: 0.6 };
  const pillLeft   = useSpring(0, springConfig);
  const pillWidth  = useSpring(0, springConfig);
  const pillHeight = useSpring(0, springConfig);

  // Re-measure và cập nhật spring target mỗi khi locale / section / hover đổi
  useEffect(() => {
    const targetId = hoveredTab || activeSection;
    if (!targetId) return;
    requestAnimationFrame(() => {
      const el = tabRefs.current[targetId];
      const container = containerRef.current;
      if (el && container) {
        // Dùng getBoundingClientRect để tính tỏa độ chính xác so với container
        // Tránh mọi sai số từ padding / border / scroll
        const btnRect = el.getBoundingClientRect();
        const ctnRect = container.getBoundingClientRect();
        pillLeft.set(btnRect.left - ctnRect.left);
        pillWidth.set(btnRect.width);
        pillHeight.set(btnRect.height);
        setPillStyle(prev => ({ ...prev, top: btnRect.top - ctnRect.top, visible: true }));
      }
    });
  }, [locale, activeSection, hoveredTab]);

  const handleNavMouseEnter = (id) => {
    setHoveredTab(id);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          background: scrolled ? 'var(--theme-nav-surface)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(140%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(140%)' : 'none',
          borderBottom: scrolled ? '1px solid var(--theme-nav-border)' : '1px solid transparent',
          boxShadow: scrolled ? 'var(--theme-nav-shadow)' : 'none',
          transition: 'all 0.4s ease',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.a href="#hero" className="flex items-center gap-3 no-underline" whileHover={{ scale: 1.03 }} onClick={handleLogoClick}>
            <img src="/icons/f0062fd6-67c6-4e79-8512-6c9f2af5296c.png" alt="Dino Museum Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.4))' }} />
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold leading-none" style={{ fontFamily: 'var(--font-heading)', color: 'var(--theme-accent-bright)' }}>Dino Museum</span>
              <span className="text-xs leading-none tracking-widest" style={{ color: 'rgba(245,158,11,0.5)', fontFamily: 'var(--font-body)' }}>PALEONTOLOGY MUSEUM</span>
            </div>
          </motion.a>

          <div
            ref={containerRef}
            className="hidden md:flex items-center relative"
            style={{
              background: 'rgba(245,158,11,0.06)',
              borderRadius: '999px',
              padding: '4px',
              border: '1px solid rgba(245,158,11,0.1)',
            }}
            onMouseLeave={() => setHoveredTab(null)}
          >
            {/* Pill mượt dùng motion.div với spring left/width */}
            {pillStyle?.visible && (
              <motion.div
                className="absolute rounded-full pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.22), rgba(217,119,6,0.12))',
                  border: '1px solid rgba(245,158,11,0.28)',
                  top: pillStyle.top,
                  left: pillLeft,
                  width: pillWidth,
                  height: pillHeight,
                }}
              />
            )}

            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              const isHovered = hoveredTab === link.id;
              return (
                <motion.button
                  key={link.id}
                  ref={(el) => { if (el) tabRefs.current[link.id] = el; }}
                  onClick={() => handleNavClick(link.href, link.id)}
                  onMouseEnter={() => handleNavMouseEnter(link.id)}
                  className="relative z-10 px-3 py-1.5 font-semibold rounded-full cursor-pointer"
                  animate={{
                    color: isActive ? '#f59e0b' : isHovered ? 'var(--theme-accent)' : 'rgba(245,240,232,0.5)',
                  }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  style={{
                    fontFamily: 'var(--font-body)',
                    background: 'transparent',
                    border: 'none',
                    whiteSpace: 'nowrap',
                    fontSize: '11px',
                    letterSpacing: '0.02em',
                  }}
                >
                  {link.label[locale]}
                </motion.button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <motion.button onClick={onLocaleToggle} className="px-3 py-2 rounded-full text-xs font-semibold" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: 'var(--theme-accent)' }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {locale === 'vi' ? 'VI' : 'EN'}
            </motion.button>
            {user ? (
              <button onClick={signOut} className="btn-amber-outline text-xs py-2 px-4" style={{ fontFamily: 'var(--font-body)' }}>
                {locale === 'vi' ? 'Đăng xuất' : 'Sign Out'}
              </button>
            ) : (
              <motion.button onClick={onLoginClick} className="btn-amber-outline text-xs py-2 px-4" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ fontFamily: 'var(--font-body)' }}>
                {locale === 'vi' ? 'Đăng nhập' : 'Sign In'}
              </motion.button>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <motion.button onClick={onLocaleToggle} className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }} whileTap={{ scale: 0.93 }}>{locale === 'vi' ? 'VI' : 'EN'}</motion.button>
            <button className="flex flex-col gap-1.5 p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              {[0, 1, 2].map((i) => <motion.span key={i} className="block h-0.5 w-6 rounded-full" style={{ background: '#f59e0b' }} animate={{ rotate: mobileOpen ? (i === 0 ? 45 : i === 2 ? -45 : 0) : 0, y: mobileOpen ? (i === 0 ? 8 : i === 2 ? -8 : 0) : 0, opacity: mobileOpen && i === 1 ? 0 : 1 }} transition={{ duration: 0.25 }} />)}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-30 md:hidden pt-20" style={{ background: 'var(--theme-nav-surface)', backdropFilter: 'blur(24px) saturate(140%)', WebkitBackdropFilter: 'blur(24px) saturate(140%)' }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <div className="flex flex-col items-center gap-5 pt-10 px-6">
              {navLinks.map((link, i) => (
                <motion.button key={link.id} onClick={() => handleNavClick(link.href, link.id)} className="text-xl font-serif font-semibold no-underline" style={{ fontFamily: 'var(--font-heading)', color: 'var(--theme-text)' }} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ color: '#f59e0b', x: 8 }}>
                  {link.label[locale]}
                </motion.button>
              ))}
              <motion.div className="flex flex-col gap-3 w-full max-w-xs mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                {user
                  ? <button onClick={() => { signOut(); setMobileOpen(false); }} className="btn-amber-outline text-center" style={{ fontFamily: 'var(--font-body)' }}>{locale === 'vi' ? 'Đăng xuất' : 'Sign Out'}</button>
                  : <button onClick={() => { onLoginClick(); setMobileOpen(false); }} className="btn-amber-outline text-center" style={{ fontFamily: 'var(--font-body)' }}>{locale === 'vi' ? 'Đăng nhập' : 'Sign In'}</button>
                }
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
