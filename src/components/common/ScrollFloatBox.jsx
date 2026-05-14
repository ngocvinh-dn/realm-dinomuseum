import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollFloatBox.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollFloatBox = ({
  children,
  className = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'top bottom-=8%',
  scrollEnd = 'center center',
  xPercent = 0,
  yPercent = 24,
  scale = 0.92,
  rotateX = 4,
  triggerMode = 'scroll',
}) => {
  const boxRef = useRef(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;

    gsap.set(el, {
      opacity: 1,
      xPercent: 0,
      yPercent: 0,
      scale: 1,
      rotateX: 0,
    });

    let refreshFrame;

    const ctx = gsap.context(() => {
      if (triggerMode === 'mount') {
        gsap.fromTo(
          el,
          {
            willChange: 'opacity, transform',
            opacity: 0,
            xPercent,
            yPercent,
            scale,
            rotateX,
            transformOrigin: '50% 70%',
          },
          {
            duration: animationDuration,
            ease,
            opacity: 1,
            xPercent: 0,
            yPercent: 0,
            scale: 1,
            rotateX: 0,
          }
        );
        return;
      }

      gsap.fromTo(
        el,
        {
          willChange: 'opacity, transform',
          opacity: 0,
          xPercent,
          yPercent,
          scale,
          rotateX,
          transformOrigin: '50% 70%',
        },
        {
          duration: animationDuration,
          ease,
          opacity: 1,
          xPercent: 0,
          yPercent: 0,
          scale: 1,
          rotateX: 0,
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: scrollStart,
            end: scrollEnd,
            scrub: true,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              if (self.progress >= 1) {
                gsap.set(el, {
                  opacity: 1,
                  xPercent: 0,
                  yPercent: 0,
                  scale: 1,
                  rotateX: 0,
                });
              }
            },
          },
        }
      );
    }, el);

    refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshFrame);
      ctx.revert();
    };
  }, [animationDuration, ease, rotateX, scale, scrollEnd, scrollStart, triggerMode, xPercent, yPercent]);

  return (
    <div ref={boxRef} className={`scroll-float-box ${className}`}>
      {children}
    </div>
  );
};

export default ScrollFloatBox;
