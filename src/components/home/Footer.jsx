import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#0a0a0a] py-8 border-t border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center px-8 md:px-24">
      <p>© 2026 3D Dino Museum.</p>
      <div className="flex gap-6 mt-4 md:mt-0">
        <a href="#" className="hover:text-green-400 transition">Bảo mật</a>
        <a href="#" className="hover:text-green-400 transition">Điều khoản</a>
        <a href="#" className="hover:text-green-400 transition">Liên hệ</a>
      </div>
    </footer>
  );
};

export default Footer;