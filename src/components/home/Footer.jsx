import React from 'react';

const Footer = ({ locale }) => {
  const isVi = locale === 'vi';
  const currentYear = new Date().getFullYear();

  const exhibitions = [
    isVi ? 'Kỷ Tam Điệp (252 – 201 triệu năm)' : 'Triassic Period (252–201 Mya)',
    isVi ? 'Kỷ Jura (201 – 145 triệu năm)' : 'Jurassic Period (201–145 Mya)',
    isVi ? 'Kỷ Phấn Trắng (145 – 66 triệu năm)' : 'Cretaceous Period (145–66 Mya)',
  ];

  const museum = [
    isVi ? 'Dòng thời gian địa chất' : 'Geological Timeline',
    isVi ? 'Hiện vật nổi bật' : 'Featured Specimens',
    isVi ? 'Tour ảo 360°' : '360° Virtual Tour',
    isVi ? 'Bản đồ bảo tàng' : 'Museum Map',
  ];

  const visitInfo = [
    isVi ? 'Mở cửa 24/7' : 'Online: 24/7',
    isVi ? 'Cập nhật hàng tuần' : 'Updated: Weekly',
    isVi ? 'Hoàn toàn miễn phí' : 'Completely Free',
    isVi ? 'Mọi thiết bị' : 'All Devices',
  ];

  return (
    <footer
      className="w-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #090704 0%, #070503 100%)',
        borderTop: '1px solid rgba(245,158,11,0.12)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 20% 0%, rgba(245,158,11,0.08) 0%, transparent 45%)' }} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold" style={{ background: 'linear-gradient(135deg, #f59e0b, #b45309)', boxShadow: '0 0 16px rgba(245,158,11,0.35)' }}>🏛️</div>
              <div>
                <div className="font-serif text-lg font-bold leading-none" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#fbbf24' }}>
                  Dinosaur Museum
                </div>
                <div className="text-[11px] tracking-widest mt-1" style={{ color: 'rgba(245,158,11,0.42)' }}>
                  PALEONTOLOGY MUSEUM
                </div>
              </div>
            </div>

            <p className="text-xs leading-6 italic mb-4" style={{ color: 'rgba(245,240,232,0.6)' }}>
              {isVi
                ? 'Bảo tàng ảo đầu tiên của Việt Nam về khủng long & cổ sinh vật học. Không cần kính VR.'
                : "Vietnam's first immersive virtual museum on dinosaurs & paleontology. No VR headset needed."}
            </p>

            <ul className="space-y-2 text-xs" style={{ color: 'rgba(245,240,232,0.62)' }}>
              <li>✉️ nguyenphukha18@gmail.com</li>
              <li>📞 0903 545 899</li>
              <li>🌐 {isVi ? 'Hỗ trợ 24/7' : 'Available: 24/7 Online'}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#f59e0b' }}>
              {isVi ? 'Trưng bày' : 'Exhibitions'}
            </h4>
            <ul className="space-y-2.5 text-sm" style={{ color: 'rgba(245,240,232,0.68)' }}>
              {exhibitions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#f59e0b' }}>
              {isVi ? 'Bảo tàng' : 'Museum'}
            </h4>
            <ul className="space-y-2.5 text-sm" style={{ color: 'rgba(245,240,232,0.68)' }}>
              {museum.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#f59e0b' }}>
              {isVi ? 'Giờ tham quan' : 'Visit Hours'}
            </h4>
            <ul className="space-y-2.5 text-sm" style={{ color: 'rgba(245,240,232,0.68)' }}>
              {visitInfo.map((item) => (
                <li key={item}>▪ {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="h-px mt-8 mb-4" style={{ background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.16), transparent)' }} />
        <div className="text-center text-xs" style={{ color: 'rgba(245,240,232,0.42)' }}>
          © {currentYear} Dinosaur Museum. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
