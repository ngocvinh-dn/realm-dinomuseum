import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

// Navigation links — label is displayed text, href is the section anchor
const navLinks = [
  { label: 'Galleries', href: '#galleries' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Specimens', href: '#specimens' },
  { label: 'Virtual Tour', href: '#virtual-tour' },
  { label: 'Book Ticket', href: '#dang-ky' },
];

// Helper: smooth scroll using Lenis if available, fallback to scrollIntoView
const scrollToSection = (href, offset = -80) => {
  const target = document.querySelector(href);
  if (!target) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(target, {
      offset,
      duration: 1.4,
      easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    });
  } else {
    target.scrollIntoView({ behavior: 'smooth' });
  }
};

const Navbar = ({ onLoginClick, darkMode, onThemeToggle }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const { user, signOut } = useAuth();
  const tabRefs = useRef({});

  // Show navbar background when scrolled past 40px
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle nav link click — close mobile menu and smooth scroll to section
  const handleNavClick = (href, label) => {
    setMobileOpen(false);
    setActiveTab(label);
    scrollToSection(href);
  };

  // Scroll back to top (logo click)
  const handleLogoClick = (e) => {
    e.preventDefault();
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Compute sliding pill position for active/hovered tab
  const currentTab = hoveredTab || activeTab;
  const currentRef = currentTab ? tabRefs.current[currentTab] : null;

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          background: scrolled ? 'var(--theme-nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--theme-border)' : 'none',
          transition: 'all 0.4s ease',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo — click to scroll back to top */}
          <motion.a
            href="#"
            className="flex items-center gap-3 no-underline"
            whileHover={{ scale: 1.03 }}
            onClick={handleLogoClick}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #92400e)', boxShadow: '0 0 16px rgba(245,158,11,0.35)' }}
            >
              🏛️
            </div>
            <div className="flex flex-col">
              <span
                className="font-serif text-lg font-bold leading-none"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--theme-accent-bright)', letterSpacing: '0.01em' }}
              >
                Dino Museum
              </span>
              <span className="text-xs leading-none tracking-widest" style={{ color: 'rgba(245,158,11,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
                PALEONTOLOGY MUSEUM
              </span>
            </div>
          </motion.a>

          {/* Desktop — Sliding tab navigation */}
          <div
            className="hidden md:flex items-center relative"
            style={{
              background: 'rgba(245,158,11,0.06)',
              borderRadius: '999px',
              padding: '4px',
              border: '1px solid rgba(245,158,11,0.1)',
            }}
            onMouseLeave={() => setHoveredTab(null)}
          >
            {/* Animated sliding pill highlight */}
            <AnimatePresence>
              {currentRef && (
                <motion.div
                  layoutId="navbar-pill"
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(217,119,6,0.15))',
                    border: '1px solid rgba(245,158,11,0.3)',
                    top: 4,
                    height: currentRef.offsetHeight,
                    left: currentRef.offsetLeft + 4,
                    width: currentRef.offsetWidth,
                  }}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </AnimatePresence>

            {navLinks.map((link) => (
              <button
                key={link.href}
                ref={(el) => { if (el) tabRefs.current[link.label] = el; }}
                onClick={() => handleNavClick(link.href, link.label)}
                onMouseEnter={() => setHoveredTab(link.label)}
                className="relative z-10 px-4 py-2 text-xs font-semibold rounded-full transition-colors duration-200 cursor-pointer tracking-wide"
                style={{
                  color: activeTab === link.label
                    ? '#f59e0b'
                    : hoveredTab === link.label
                    ? 'var(--theme-accent)'
                    : 'var(--theme-text-muted)',
                  fontFamily: 'DM Sans, sans-serif',
                  background: 'transparent',
                  border: 'none',
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side — theme toggle + auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            {/* Dark/Light mode toggle button */}
            <motion.button
              onClick={onThemeToggle}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.2)',
                color: 'var(--theme-accent)',
                fontSize: '16px',
              }}
              whileHover={{ scale: 1.1, background: 'rgba(245,158,11,0.15)' }}
              whileTap={{ scale: 0.93 }}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              id="theme-toggle-btn"
            >
              <motion.span
                key={darkMode ? 'moon' : 'sun'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {darkMode ? '☀️' : '🌙'}
              </motion.span>
            </motion.button>

            {/* Login / Logout area */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold" style={{ color: 'rgba(245,158,11,0.8)', fontFamily: 'DM Sans, sans-serif' }}>
                  👤 {user.user_metadata?.full_name?.split(' ').pop() || user.email?.split('@')[0]}
                </span>
                <button
                  onClick={signOut}
                  className="btn-amber-outline text-xs py-2 px-4"
                  id="nav-signout-btn"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <motion.button
                onClick={onLoginClick}
                className="btn-amber-outline text-xs py-2 px-4"
                id="nav-login-btn"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Sign In
              </motion.button>
            )}

            <motion.a
              href="#dang-ky"
              onClick={(e) => { e.preventDefault(); handleNavClick('#dang-ky', 'Book Ticket'); }}
              className="btn-amber-primary text-xs py-2.5 px-5"
              id="nav-cta-btn"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              🎟️ Book a Ticket
            </motion.a>
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center gap-2">
            <motion.button
              onClick={onThemeToggle}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
              whileTap={{ scale: 0.93 }}
              id="theme-toggle-mobile"
            >
              {darkMode ? '☀️' : '🌙'}
            </motion.button>
            <button
              className="flex flex-col gap-1.5 p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              id="nav-mobile-menu-btn"
              aria-label="Toggle menu"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="block h-0.5 w-6 rounded-full"
                  style={{ background: '#f59e0b' }}
                  animate={{
                    rotate: mobileOpen ? (i === 0 ? 45 : i === 2 ? -45 : 0) : 0,
                    y: mobileOpen ? (i === 0 ? 8 : i === 2 ? -8 : 0) : 0,
                    opacity: mobileOpen && i === 1 ? 0 : 1,
                  }}
                  transition={{ duration: 0.25 }}
                />
              ))}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-30 md:hidden pt-20"
            style={{ background: 'var(--theme-nav-bg)', backdropFilter: 'blur(24px)' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center gap-5 pt-10 px-6">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  onClick={() => handleNavClick(link.href, link.label)}
                  className="text-xl font-serif font-semibold no-underline"
                  style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--theme-text)' }}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ color: '#f59e0b', x: 8 }}
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.div
                className="flex flex-col gap-3 w-full max-w-xs mt-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
              >
                {user ? (
                  <button onClick={() => { signOut(); setMobileOpen(false); }}
                    className="btn-amber-outline text-center" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    Sign Out
                  </button>
                ) : (
                  <button onClick={() => { onLoginClick(); setMobileOpen(false); }}
                    className="btn-amber-outline text-center" id="mobile-login-btn"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    Sign In
                  </button>
                )}
                <button onClick={() => handleNavClick('#dang-ky', 'Book Ticket')}
                  className="btn-amber-primary text-center" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  🎟️ Book a Ticket
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
