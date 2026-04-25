import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FlaskConical, Download, Image } from 'lucide-react';

const benefits = [
  {
    icon: BookOpen,
    title: 'Tài liệu tiếng Việt duy nhất',
    desc: 'Không còn rào cản ngôn ngữ. Toàn bộ nội dung được biên soạn công phu bằng tiếng Việt, dễ hiểu cho mọi độ tuổi.',
  },
  {
    icon: FlaskConical,
    title: 'Nguồn học thuật uy tín',
    desc: 'Dựa trên các công bố khoa học từ Nature, Science, Journal of Vertebrate Paleontology. Thông tin chính xác, cập nhật 2026.',
  },
  {
    icon: Download,
    title: 'Tải về & đọc offline mãi mãi',
    desc: 'File PDF chất lượng cao, đọc trên bất kỳ thiết bị nào. Không subscription, không hết hạn — của bạn vĩnh viễn.',
  },
  {
    icon: Image,
    title: 'Hình ảnh minh họa khoa học',
    desc: 'Mỗi loài được minh họa bằng paleoart hiện đại, bản đồ phân bố địa chất, và biểu đồ so sánh kích thước.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const BenefitsSection = () => {
  return (
    <section
      id="benefits"
      className="section-pad relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0804 0%, #110e08 50%, #0a0804 100%)' }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.06) 0%, transparent 60%)' }} />

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-divider" />
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#f59e0b' }}>
            Tại sao chọn DinoArchive?
          </p>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Tài liệu xứng tầm với{' '}
            <br className="hidden md:block" />
            <span className="text-gradient-amber">sự đam mê</span> của bạn.
          </h2>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {benefits.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                variants={cardVariants}
                className="glass-card p-8 group transition-all duration-300"
                whileHover={{ y: -4, scale: 1.01 }}
              >
                <div className="flex items-start gap-5">
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)' }}
                  >
                    <Icon size={22} color="#f59e0b" strokeWidth={1.5} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2" style={{ color: '#f5f0e8' }}>
                      {item.title}
                    </h3>
                    <p className="leading-relaxed text-sm" style={{ color: 'rgba(245,240,232,0.55)' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div
                  className="mt-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(90deg, #f59e0b, transparent)' }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;