import React from 'react';
import { motion } from 'framer-motion';

// Footer navigation links
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { href: '#', label: 'Privacy Policy' },
    { href: '#', label: 'Terms of Use' },
    { href: 'mailto:contact@baotangkhunglong.vn', label: 'Contact Us' },
  ];

  // Footer navigation column data
  const sections = [
    {
      title: 'Exhibitions',
      items: ['Mesozoic Era', 'Theropoda Hall', 'Vietnamese Fossils', 'Mass Extinction', 'Eggs & Embryos'],
    },
    {
      title: 'Museum',
      items: ['Geological Timeline', 'Featured Specimens', '360° Virtual Tour', 'Museum Map'],
    },
    {
      title: 'Visit Hours',
      items: ['🌐 Online: 24/7', '📅 Updated: Weekly', '🆓 Completely Free', '📱 All Devices'],
    },
  ];

  return (
    <footer
      className="w-full relative overflow-hidden"
      style={{
        background: 'var(--theme-bg)',
        borderTop: '1px solid rgba(245,158,11,0.1)',
      }}
    >
      {/* Phần trên của footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Cột thương hiệu bên trái */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #92400e)', boxShadow: '0 0 20px rgba(245,158,11,0.25)' }}
              >
                🏛️
              </div>
              <div>
                <div className="font-serif font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#fbbf24' }}>
                  Dinosaur Museum
                </div>
                <div className="text-xs" style={{ color: 'rgba(245,158,11,0.4)', letterSpacing: '0.1em' }}>
                  PALEONTOLOGY MUSEUM
                </div>
              </div>
            </div>

            <p className="text-xs leading-relaxed mb-5" style={{ color: 'var(--theme-text-muted)', fontStyle: 'italic', fontFamily: 'Lora, serif' }}>
              Vietnam's first immersive virtual museum on dinosaurs & paleontology. No VR headset needed.
            </p>

            {/* Contact information */}
            <div className="space-y-1.5">
              <p className="text-xs" style={{ color: 'var(--theme-text-dim)' }}>
                📧 nguyenphukha18@gmail.com
              </p>
              <p className="text-xs" style={{ color: 'var(--theme-text-dim)' }}>
                📞 0903 545 899
              </p>
              <p className="text-xs" style={{ color: 'var(--theme-text-dim)' }}>
                🌐 Available: 24/7 Online
              </p>
            </div>
          </div>

          {/* Navigation columns */}
          {sections.map((section, i) => (
            <div key={i}>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#f59e0b' }}>
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.items.map((item, j) => (
                  <li key={j}>
                    <motion.a
                      href="#"
                      className="text-xs no-underline transition-colors block"
                      style={{ color: 'var(--theme-text-muted)' }}
                      whileHover={{ color: 'var(--theme-text)', x: 4 }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider line */}
        <div className="h-px mb-6" style={{ background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.15), transparent)' }} />

        {/* Bottom row: copyright and links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: 'var(--theme-text-dim)' }}>
            © {currentYear} Dinosaur Museum. All rights reserved.
          </p>

          <div className="flex gap-5">
            {links.map((link, i) => (
              <motion.a
                key={i}
                href={link.href}
                className="text-xs no-underline transition-colors"
                style={{ color: 'var(--theme-text-muted)' }}
                whileHover={{ color: '#f59e0b' }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          {/* Decorative quote (desktop only) */}
          <p className="text-xs italic hidden lg:block" style={{ color: 'var(--theme-text-dim)', fontFamily: 'Lora, serif' }}>
            "66 million years of mystery — now at your fingertips."
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;