import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="h-screen w-full flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <p className="text-sm tracking-[0.3em] uppercase mb-4 text-gray-400">Từ quá khứ đến hiện tại</p>
        <h1 className="text-5xl md:text-8xl font-serif leading-tight">
          Sự vĩ đại <br />
          <span className="italic text-green-400">bắt đầu từ đây.</span>
        </h1>
        <p className="mt-6 text-lg text-gray-300 max-w-lg mx-auto">
          Hành trình bước vào thế giới kỳ diệu của Kỷ Phấn Trắng với các sinh vật vĩ đại nhất từng bước đi trên Trái Đất.
        </p>
      </motion.div>

      <motion.div 
        className="absolute bottom-10 flex flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-xs uppercase tracking-widest text-gray-400">Cuộn để bắt đầu</span>
        <div className="w-[1px] h-12 bg-green-500"></div>
      </motion.div>
    </section>
  );
};

export default HeroSection;