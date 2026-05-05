import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue } from "motion/react";
import "./DinosaurFactsCarousel.css";

const VELOCITY_THRESHOLD = 500;
const DRAG_DISTANCE = 40;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

function translate(vi, en, language) {
  if (language === "en") return en || vi || "Unknown";
  return vi || en || "Chưa rõ";
}

function formatFactType(type, language) {
  const map = {
    overview: { vi: "Tổng quan", en: "Overview" },
    diet: { vi: "Chế độ ăn", en: "Diet" },
    habitat: { vi: "Môi trường sống", en: "Habitat" },
    fun_fact: { vi: "Sự thật thú vị", en: "Fun fact" },
    size: { vi: "Kích thước", en: "Size" },
    teeth: { vi: "Răng", en: "Teeth" },
    speed: { vi: "Tốc độ", en: "Speed" },
  };

  return map[type]?.[language] || type || "Fact";
}

function updateEdgeGlow(event) {
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const dx = x - centerX;
  const dy = y - centerY;

  const kx = dx === 0 ? Infinity : centerX / Math.abs(dx);
  const ky = dy === 0 ? Infinity : centerY / Math.abs(dy);

  const edgeProximity = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  const edgeOpacity = Math.max(0, Math.min(1, (edgeProximity - 0.32) / 0.68));

  let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  if (angle < 0) angle += 360;

  element.style.setProperty("--edge-opacity", edgeOpacity.toFixed(3));
  element.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
  element.style.setProperty("--glow-x", `${((x / rect.width) * 100).toFixed(2)}%`);
  element.style.setProperty("--glow-y", `${((y / rect.height) * 100).toFixed(2)}%`);
}

function resetEdgeGlow(event) {
  const element = event.currentTarget;

  element.style.setProperty("--edge-opacity", "0");
  element.style.setProperty("--glow-x", "50%");
  element.style.setProperty("--glow-y", "50%");
}

export default function DinosaurFactsCarousel({ facts = [], language = "vi" }) {
  const x = useMotionValue(0);
  const viewportRef = useRef(null);

  const [viewportWidth, setViewportWidth] = useState(0);
  const [position, setPosition] = useState(0);

  const items = useMemo(() => {
    const sortedFacts = [...facts].sort(
      (a, b) => (a.order_index || 0) - (b.order_index || 0)
    );

    if (sortedFacts.length === 0) {
      return [
        {
          id: "empty",
          title: "Fact",
          description:
            language === "en"
              ? "No facts available for this dinosaur yet."
              : "Chưa có facts cho loài này.",
        },
      ];
    }

    return sortedFacts.map((fact, index) => ({
      id: fact.id || index,
      title: formatFactType(fact.fact_type, language),
      description: translate(fact.content_vi, fact.content_en, language),
    }));
  }, [facts, language]);

  const maxPosition = items.length - 1;

  useEffect(() => {
    if (!viewportRef.current) return undefined;

    const updateWidth = () => {
      setViewportWidth(viewportRef.current.offsetWidth);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(viewportRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    setPosition(0);
    x.set(0);
  }, [items.length, x]);

  function goTo(index) {
    setPosition(Math.max(0, Math.min(index, maxPosition)));
  }

  function handleDragEnd(_, info) {
    const { offset, velocity } = info;

    if (offset.x < -DRAG_DISTANCE || velocity.x < -VELOCITY_THRESHOLD) {
      goTo(position + 1);
      return;
    }

    if (offset.x > DRAG_DISTANCE || velocity.x > VELOCITY_THRESHOLD) {
      goTo(position - 1);
    }
  }

  return (
    <div
      className="facts-carousel"
      onPointerMove={updateEdgeGlow}
      onPointerLeave={resetEdgeGlow}
    >
      <div ref={viewportRef} className="facts-carousel__viewport">
        {viewportWidth > 0 && (
          <motion.div
            className="facts-carousel__track"
            drag="x"
            dragElastic={0.06}
            dragConstraints={{
              left: -viewportWidth * maxPosition,
              right: 0,
            }}
            style={{
              x,
              width: viewportWidth * items.length,
            }}
            animate={{ x: -position * viewportWidth }}
            transition={SPRING_OPTIONS}
            onDragEnd={handleDragEnd}
          >
            {items.map((item, index) => (
              <div
                className="facts-carousel__slide"
                key={`${item.id}-${index}`}
                style={{ width: viewportWidth }}
              >
                <article
                  className="facts-carousel__item"
                  onPointerMove={updateEdgeGlow}
                  onPointerLeave={resetEdgeGlow}
                >
                  <span className="facts-carousel__type">{item.title}</span>
                  <p className="facts-carousel__content">{item.description}</p>
                </article>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="facts-carousel__indicators">
        {items.map((_, index) => (
          <motion.button
            key={index}
            type="button"
            className={
              index === position
                ? "facts-carousel__indicator facts-carousel__indicator--active"
                : "facts-carousel__indicator"
            }
            onClick={() => goTo(index)}
            animate={{ scale: index === position ? 1.2 : 1 }}
            transition={{ duration: 0.15 }}
            aria-label={`Fact ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}