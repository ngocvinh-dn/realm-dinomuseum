import { useRef } from 'react';
import { useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * Hook parallax — dùng framer-motion để tạo hiệu ứng cuộn chiều sâu.
 * Phần tử sẽ di chuyển theo tỷ lệ scroll của container cha.
 *
 * @param {React.RefObject} ref - ref của phần tử container cần theo dõi
 * @param {string[]} outputRange - khoảng giá trị output (vd: ['0%', '30%'])
 * @param {string[]} offset - điểm bắt đầu và kết thúc scroll (mặc định: toàn section)
 * @returns {MotionValue} - giá trị y có thể gán vào style={{ y }}
 */
export function useParallax(ref, outputRange = ['0%', '20%'], offset = ['start end', 'end start']) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  // Làm mượt hơn bằng spring physics
  const raw = useTransform(scrollYProgress, [0, 1], outputRange);
  const smoothed = useSpring(raw, { stiffness: 80, damping: 20, restDelta: 0.001 });
  return smoothed;
}

/**
 * Hook parallax đơn giản — không dùng spring, dùng cho performance-sensitive elements.
 */
export function useParallaxSimple(ref, outputRange = ['0%', '20%'], offset = ['start end', 'end start']) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });
  return useTransform(scrollYProgress, [0, 1], outputRange);
}

/**
 * Hook theo dõi scroll toàn trang — dùng cho animation phụ thuộc vào vị trí scroll tuyệt đối.
 * @param {number[]} inputRange - khoảng [0, 1] tương ứng với đầu/cuối trang
 * @param {any[]} outputRange - giá trị tương ứng
 */
export function useScrollTransform(inputRange, outputRange) {
  const { scrollYProgress } = useScroll();
  return useTransform(scrollYProgress, inputRange, outputRange);
}
