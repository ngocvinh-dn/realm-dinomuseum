import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { href: '#', label: 'Chính sách bảo mật' },
    { href: '#', label: 'Điều khoản sử dụng' },
    { href: 'mailto:contact@dinoarchive.vn', label: 'Liên hệ' },
  ];

  return (
    <footer
      className="w-full py-10 relative overflow-hidden"
      style={{
        background: '#0a0804',
        borderTop: '1px solid rgba(245,158,11,0.1)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo area */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #92400e)' }}>
              🦴
            </div>
            <span className="font-serif font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#fbbf24' }}>
              DinoArchive
            </span>
          </div>

          {/* Contact info */}
          <div className="text-center">
            <p className="text-xs" style={{ color: 'rgba(245,240,232,0.35)' }}>
              📧 nguyenphukha18@gmail.com <br></br>
              📞 0903 545 899
            </p>
            <p className="text-xs mt-1" style={{ color: 'rgba(245,240,232,0.2)' }}>
              © {currentYear} DinoArchive. Bản quyền thuộc về DinoArchive.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-5">
            {links.map((link, i) => (
              <motion.a
                key={i}
                href={link.href}
                className="text-xs no-underline transition-colors"
                style={{ color: 'rgba(245,240,232,0.4)' }}
                whileHover={{ color: '#f59e0b' }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="mt-8 text-center">
          {/* <p className="text-xs italic" style={{ color: 'rgba(245,240,232,0.15)', fontFamily: 'Lora, serif' }}>
            "Những sinh vật vĩ đại nhất từng bước đi trên Trái Đất — nay được ghi lại bằng tiếng Việt."
          </p> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;