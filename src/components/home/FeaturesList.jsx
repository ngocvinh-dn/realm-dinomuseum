import React from 'react';
import { motion } from 'framer-motion';

const FeaturesList = () => {
  const features = [
    { title: "Sức mạnh nguyên thủy", desc: "Sở hữu lực cắn lên tới 35,000 Newtons, phá vỡ mọi chướng ngại vật." },
    { title: "Sinh thái đa dạng", desc: "Hơn 700 loài khủng long đã được xác định từ các mẫu hóa thạch trên toàn cầu." },
    { title: "Độ chân thực 100%", desc: "Mô hình 3D được phục dựng dựa trên dữ liệu cổ sinh vật học mới nhất." }
  ];

  return (
    <section className="min-h-screen w-full flex flex-col justify-center px-8 md:px-24 py-20">
      <div className="max-w-4xl">
        <motion.h2 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-4xl md:text-6xl font-serif mb-16"
        >
          Trải nghiệm <br />
          <span className="text-green-400 italic">vượt thời gian.</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="border-t border-gray-700 pt-6"
            >
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesList;