import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { href: '#', label: 'Chính sách bảo mật' },
    { href: '#', label: 'Điều khoản sử dụng' },
    { href: 'mailto:contact@baotangkhunglong.vn', label: 'Liên hệ' },
  ];

  const sections = [
    {
      title: 'Phòng Trưng Bày',
      items: ['Đại Trung Sinh', 'Theropoda Hall', 'Hóa Thạch Việt Nam', 'Sự Kiện Tuyệt Chủng', 'Phôi Thai & Trứng'],
    },
    {
      title: 'Bảo Tàng',
      items: ['Dòng Thời Gian Địa Chất', 'Hiện Vật Nổi Bật', 'Tour Ảo 360°', 'Sơ Đồ Bảo Tàng'],
    },
    {
      title: 'Giờ Tham Quan',
      items: ['🌐 Online: 24/7', '📅 Cập nhật: Hàng tuần', '🆓 Miễn phí hoàn toàn', '📱 Mọi thiết bị'],
    },
  ];

  return (
    <footer
      className="w-full relative overflow-hidden"
      style={{
        background: '#0a0804',
        borderTop: '1px solid rgba(245,158,11,0.1)',
      }}
    >
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
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
                  Bảo Tàng Khủng Long
                </div>
                <div className="text-xs" style={{ color: 'rgba(245,158,11,0.4)', letterSpacing: '0.1em' }}>
                  PALEONTOLOGY MUSEUM
                </div>
              </div>
            </div>

            <p className="text-xs leading-relaxed mb-5" style={{ color: 'rgba(245,240,232,0.4)', fontStyle: 'italic', fontFamily: 'Lora, serif' }}>
              Bảo tàng ảo immersive đầu tiên tại Việt Nam về khủng long & cổ sinh vật học. Không cần VR headset.
            </p>

            {/* Contact */}
            <div className="space-y-1.5">
              <p className="text-xs" style={{ color: 'rgba(245,240,232,0.35)' }}>
                📧 nguyenphukha18@gmail.com
              </p>
              <p className="text-xs" style={{ color: 'rgba(245,240,232,0.35)' }}>
                📞 0903 545 899
              </p>
              <p className="text-xs" style={{ color: 'rgba(245,240,232,0.35)' }}>
                🌐 Hoạt động: 24/7 Online
              </p>
            </div>
          </div>

          {/* Nav sections */}
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
                      style={{ color: 'rgba(245,240,232,0.4)' }}
                      whileHover={{ color: 'rgba(245,240,232,0.8)', x: 4 }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px mb-6" style={{ background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.15), transparent)' }} />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: 'rgba(245,240,232,0.2)' }}>
            © {currentYear} Bảo Tàng Khủng Long. Bản quyền thuộc về dự án.
          </p>

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

          {/* Quote */}
          <p className="text-xs italic hidden lg:block" style={{ color: 'rgba(245,240,232,0.15)', fontFamily: 'Lora, serif' }}>
            "Những bí ẩn 66 triệu năm — nay trong tầm tay."
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;