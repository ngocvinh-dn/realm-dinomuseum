import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Dot nhấp nháy trang trí — giả lập marker hóa thạch
const PulseDot = ({ style, delay = 0 }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: 7,
      height: 7,
      background: "#f59e0b",
      boxShadow: "0 0 10px 3px rgba(245,158,11,0.55)",
      ...style,
    }}
    animate={{ opacity: [0.3, 1, 0.3], scale: [0.7, 1.5, 0.7] }}
    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay }}
  />
);

const revealEase = [0.22, 1, 0.36, 1];
const headingLineVariants = {
  hidden: { opacity: 0, y: 34 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.8, ease: revealEase },
  }),
};

const FossilExploreTeaser = ({ locale = "vi" }) => {
  const isVi = locale === "vi";
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  // Scroll-driven parallax — giống HeroSection
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const contentY = useTransform(scrollYProgress, [0.05, 0.5], ["40px", "0px"]);
  const opacity = useTransform(
    scrollYProgress,
    [0.05, 0.25, 0.85, 1],
    [0, 1, 1, 0.4],
  );

  return (
    <section
      id="explore-globe"
      ref={sectionRef}
      className="relative overflow-hidden text-center"
      style={{ background: "var(--theme-bg)", padding: "110px 0 120px" }}
    >
      {/* ── NỀN — lưới kinh/vĩ tuyến mờ + dots ───────────────── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY }}
      >
        {/* Gradient chính giữa */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(245,158,11,0.1) 0%, transparent 70%)",
          }}
        />

        {/* Lưới kinh tuyến */}
        {[12, 25, 38, 50, 62, 75, 88].map((left, i) => (
          <div
            key={i}
            className="absolute h-full w-px"
            style={{ left: `${left}%`, background: "rgba(245,158,11,0.035)" }}
          />
        ))}
        {/* Lưới vĩ tuyến */}
        {[18, 35, 50, 65, 82].map((top, i) => (
          <div
            key={i}
            className="absolute w-full h-px"
            style={{ top: `${top}%`, background: "rgba(245,158,11,0.035)" }}
          />
        ))}

        {/* Marker dots */}
        <PulseDot style={{ top: "20%", left: "14%" }} delay={0} />
        <PulseDot style={{ top: "58%", left: "28%" }} delay={0.7} />
        <PulseDot style={{ top: "32%", left: "55%" }} delay={0.4} />
        <PulseDot style={{ top: "70%", left: "68%" }} delay={1.1} />
        <PulseDot style={{ top: "24%", left: "82%" }} delay={0.2} />
        <PulseDot style={{ top: "75%", left: "44%" }} delay={0.9} />
        <PulseDot style={{ top: "45%", left: "92%" }} delay={0.5} />

        {/* Lines kết nối mờ */}
        {[
          { top: "21%", left: "14%", width: "14%", rotate: "15deg" },
          { top: "33%", left: "28%", width: "27%", rotate: "-6deg" },
          { top: "59%", left: "55%", width: "13%", rotate: "20deg" },
        ].map((l, i) => (
          <div
            key={i}
            className="absolute h-px opacity-15"
            style={{
              top: l.top,
              left: l.left,
              width: l.width,
              transform: `rotate(${l.rotate})`,
              transformOrigin: "left center",
              background:
                "linear-gradient(90deg, transparent, rgba(245,158,11,0.7), transparent)",
            }}
          />
        ))}
      </motion.div>

      {/* Fade top/bottom */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-20"
        style={{
          background:
            "linear-gradient(to bottom, var(--theme-bg-alt), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-20"
        style={{
          background: "linear-gradient(to top, var(--theme-bg), transparent)",
        }}
      />

      {/* ── NỘI DUNG ───────────────────────────────────────────── */}
      <motion.div
        className="relative max-w-4xl mx-auto px-6"
        style={{ y: contentY, opacity }}
      >
        {/* Khẩu hiệu nhỏ phía trên — y chang FinalCTA */}
        <motion.p
          className="text-xs font-semibold tracking-widest uppercase mb-6"
          style={{
            color: "rgba(245,158,11,0.6)",
            fontFamily: "DM Sans, sans-serif",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.9 }}
          transition={{ duration: 0.55, ease: revealEase }}
        >
          {isVi
            ? "Hóa thạch thực tế · Toàn cầu · Tương tác 3D"
            : "Real Fossils · Worldwide · 3D Interactive"}
        </motion.p>

        {/* Tiêu đề lớn — cùng kiểu FinalCTA */}
        <motion.h2
          className="font-serif leading-tight mb-8"
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
            color: "var(--theme-text)",
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.45 }}
        >
          <motion.span
            className="block"
            custom={0.08}
            variants={headingLineVariants}
          >
            {isVi ? "Dấu vết tiền sử" : "Prehistoric Traces"}
          </motion.span>
          <motion.span
            className="block text-gradient-amber italic"
            custom={0.18}
            variants={headingLineVariants}
          >
            {isVi ? "Trên toàn thế giới" : "Across the Globe"}
          </motion.span>
          <motion.span
            className="block"
            custom={0.28}
            variants={headingLineVariants}
            style={{ fontSize: "0.55em", opacity: 0.5, fontStyle: "normal" }}
          >
            {isVi ? "đang chờ bạn khám phá." : "are waiting to be explored."}
          </motion.span>
        </motion.h2>

        {/* NÚT CTA chính — y chang btn-amber-primary của FinalCTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, delay: 0.32, ease: revealEase }}
        >
          <motion.button
            onClick={() => navigate("/explore")}
            className="btn-amber-primary inline-flex items-center gap-3 px-10 py-5 text-base"
            whileHover={{
              scale: 1.05,
              boxShadow:
                "0 12px 40px rgba(245,158,11,0.5), 0 0 80px rgba(245,158,11,0.18)",
            }}
            whileTap={{ scale: 0.97 }}
            animate={{
              boxShadow: [
                "0 4px 20px rgba(245,158,11,0.35)",
                "0 8px 40px rgba(245,158,11,0.55)",
                "0 4px 20px rgba(245,158,11,0.35)",
              ],
            }}
            transition={{
              boxShadow: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
            }}
          >
            <span>🌍</span>
            <span>{isVi ? "Khám phá bản đồ hóa thạch" : "Explore Map"}</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Hint nhỏ dưới nút */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-6 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.46, duration: 0.45, ease: revealEase }}
        >
          {(isVi
            ? [
                "✓ Toàn màn hình",
                "✓ Tương tác 3D",
                "✓ 30+ hóa thạch thực tế",
                "✓ Miễn phí",
              ]
            : [
                "✓ Fullscreen",
                "✓ 3D Interactive",
                "✓ 30+ real fossils",
                "✓ Free",
              ]
          ).map((item, i) => (
            <motion.span
              key={i}
              className="text-xs"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.9 }}
              transition={{
                delay: 0.52 + i * 0.06,
                duration: 0.4,
                ease: revealEase,
              }}
              style={{
                color: "var(--theme-text-dim)",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              {item}
            </motion.span>
          ))}
        </motion.div>

        {/* Đường kẻ trang trí — y chang FinalCTA */}
        <div className="mt-16 flex items-center gap-6">
          <div
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(245,158,11,0.2))",
            }}
          />
          <span
            className="text-xs tracking-widest uppercase"
            style={{
              color: "rgba(245,158,11,0.4)",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            ✦ Fossil Globe ✦
          </span>
          <div
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(to left, transparent, rgba(245,158,11,0.2))",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default FossilExploreTeaser;
