import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { label: 'Lợi ích', href: '#benefits' },
  { label: 'Xem trước', href: '#visuals' },
  { label: 'Đánh giá', href: '#testimonials' },
  { label: 'Tải ebook', href: '#download' },
];

const menuItemVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.3, ease: 'easeOut' }
  }),
  exit: (i) => ({
    opacity: 0,
    y: -8,
    transition: { delay: i * 0.03, duration: 0.2 }
  }),
};

const Navbar = ({ onLoginClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          background: scrolled
            ? 'rgba(10, 8, 4, 0.92)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(245, 158, 11, 0.12)' : 'none',
          transition: 'all 0.4s ease',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center gap-2.5 no-underline"
            whileHover={{ scale: 1.03 }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #92400e)' }}>
              🦴
            </div>
            <span className="font-serif text-xl font-bold"
              style={{ fontFamily: 'Playfair Display, serif', color: '#fbbf24' }}>
              DinoArchive
            </span>
          </motion.a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="text-sm font-medium no-underline transition-colors cursor-pointer"
                style={{ color: 'rgba(245,240,232,0.7)' }}
                whileHover={{ color: '#f59e0b' }}
                custom={i}
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium" style={{ color: 'rgba(245,158,11,0.8)' }}>
                  👤 {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
                <button
                  onClick={signOut}
                  className="btn-amber-outline text-xs py-2 px-4"
                  id="nav-signout-btn"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <motion.button
                onClick={onLoginClick}
                className="btn-amber-outline"
                id="nav-login-btn"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Đăng nhập
              </motion.button>
            )}
            <motion.a
              href="#download"
              onClick={(e) => { e.preventDefault(); handleNavClick('#download'); }}
              className="btn-amber-primary text-xs py-2.5 px-5"
              id="nav-cta-btn"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Tải Ebook
            </motion.a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
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
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-30 md:hidden pt-20"
            style={{
              background: 'rgba(10, 8, 4, 0.97)',
              backdropFilter: 'blur(20px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center gap-6 pt-10 px-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className="text-2xl font-serif font-semibold no-underline"
                  style={{ fontFamily: 'Playfair Display, serif', color: 'rgba(245,240,232,0.9)' }}
                  custom={i}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{ color: '#f59e0b', x: 8 }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                className="flex flex-col gap-3 w-full max-w-xs mt-4"
                custom={navLinks.length}
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
              >
                {user ? (
                  <button onClick={() => { signOut(); setMobileOpen(false); }}
                    className="btn-amber-outline text-center">
                    Đăng xuất
                  </button>
                ) : (
                  <button onClick={() => { onLoginClick(); setMobileOpen(false); }}
                    className="btn-amber-outline text-center" id="mobile-login-btn">
                    Đăng nhập
                  </button>
                )}
                <a href="#download" onClick={(e) => { e.preventDefault(); handleNavClick('#download'); }}
                  className="btn-amber-primary text-center">
                  Tải Ebook Miễn Phí
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
