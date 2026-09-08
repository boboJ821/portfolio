import * as React from 'react';
import './CoverflowCarousel.css';

export interface CoverflowSlide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  rotate?: number;
  depth?: number;
  perspective?: number;
  falloff?: number;
  fade?: number;
  cardWidth?: string;
  gap?: number;
  loop?: boolean;
  showCaption?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  autoPlaySpeed?: number;
  label?: string;
  className?: string;
}

const useIsoLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

const joinClasses = (...classes: Array<string | false | undefined>) =>
  classes.filter(Boolean).join(' ');

const Chevron = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="coverflow__chevron"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={direction === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
  </svg>
);

export function CoverflowCarousel({
  slides,
  rotate = 44,
  depth = 0.6,
  perspective = 3.2,
  falloff = 0.56,
  fade = 0.12,
  cardWidth = 'clamp(17rem, 38vw, 34rem)',
  gap = 0.08,
  loop = false,
  showCaption = true,
  showPagination = true,
  showNavigation = true,
  autoPlay = true,
  autoPlayDelay = 2800,
  autoPlaySpeed = 0.07,
  label = 'Selected projects',
  className,
}: CoverflowCarouselProps) {
  const count = slides.length;
  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const posRef = React.useRef(0);
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const autoRafRef = React.useRef<number | null>(null);
  const wheelTotalRef = React.useRef(0);
  const wheelTimerRef = React.useRef<number | null>(null);
  const selectedRef = React.useRef(0);
  const lastInteractionRef = React.useRef(0);
  const isVisibleRef = React.useRef(false);
  const dragRef = React.useRef<{
    id: number;
    x: number;
    pos: number;
    velocity: number;
    time: number;
  } | null>(null);
  const [selected, setSelected] = React.useState(0);

  const markInteraction = React.useCallback(() => {
    lastInteractionRef.current = performance.now();
  }, []);

  const triggerHaptic = React.useCallback(() => {
    if (
      typeof window === 'undefined' ||
      !window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('vibrate' in navigator)
    ) {
      return;
    }

    navigator.vibrate(10);
  }, []);

  const selectIndex = React.useCallback(
    (next: number, withHaptic = false) => {
      if (next === selectedRef.current) return;
      selectedRef.current = next;
      setSelected(next);
      if (withHaptic) triggerHaptic();
    },
    [triggerHaptic],
  );

  const indexAt = React.useCallback(
    (position: number) => {
      if (!count) return 0;
      return ((Math.round(position) % count) + count) % count;
    },
    [count],
  );

  const clamp = React.useCallback(
    (position: number) =>
      loop || !count ? position : Math.max(0, Math.min(count - 1, position)),
    [count, loop],
  );

  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width || !count) return;

    const pitch = width * (1 + gap);
    const position = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      let offset = index - position;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 80) * Math.sign(offset);
      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      const side = Math.max(-1, Math.min(1, offset));
      const lightX = 50 - side * 34;
      const shadowX = -side * 1.15;
      const shadowBlur = 3.2 + Math.min(distance, 2) * 0.7;
      const shadowOpacity = 0.3 + Math.max(0, 1 - distance) * 0.16;
      const lightOpacity = 0.1 + Math.min(distance, 1) * 0.13;

      card.style.transform =
        `translate3d(calc(-50% + ${offset * pitch}px), 0, ${-depth * width * ramp}px) ` +
        `rotateY(${-tilt}deg)`;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
      card.style.setProperty('--coverflow-light-x', `${lightX}%`);
      card.style.setProperty('--coverflow-light-opacity', String(lightOpacity));
      card.style.setProperty('--coverflow-shadow-x', `${shadowX}rem`);
      card.style.setProperty('--coverflow-shadow-blur', `${shadowBlur}rem`);
      card.style.setProperty('--coverflow-shadow-opacity', String(shadowOpacity));
      card.setAttribute('aria-hidden', distance > 0.55 ? 'true' : 'false');
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (destination: number, withHaptic = true) => {
      if (!count) return;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

      const target = clamp(destination);
      targetRef.current = target;
      selectIndex(indexAt(target), withHaptic);

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }

        posRef.current += remaining * 0.14;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };

      rafRef.current = requestAnimationFrame(step);
    },
    [clamp, count, indexAt, paint, selectIndex],
  );

  const nudge = React.useCallback(
    (direction: number) => {
      markInteraction();
      settle(Math.round(targetRef.current) + direction);
    },
    [markInteraction, settle],
  );

  const goTo = React.useCallback(
    (index: number) => {
      markInteraction();
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index;
      settle(target);
    },
    [count, loop, markInteraction, settle],
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    markInteraction();
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      velocity: 0,
      time: performance.now(),
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const pitch = widthRef.current * (1 + gap);
    if (!drag || drag.id !== event.pointerId || !pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    drag.velocity =
      ((posRef.current - previous) / Math.max(now - drag.time, 1)) * 1000;
    drag.time = now;
    targetRef.current = posRef.current;
    selectIndex(indexAt(posRef.current));
    paint();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    const carried = Math.max(-2, Math.min(2, drag.velocity * 0.18));
    settle(Math.round(posRef.current + carried), false);
    triggerHaptic();
  };

  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame || !count) return;

    const measure = () => {
      const firstCard = cardRefs.current[0];
      if (!firstCard) return;
      widthRef.current = firstCard.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [count, paint]);

  React.useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !count || !autoPlay || !loop) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    lastInteractionRef.current = performance.now();

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting && entry.intersectionRatio > 0.2;
      },
      { threshold: [0, 0.2, 0.55] },
    );
    observer.observe(frame);

    let previousTime = performance.now();
    const tick = (time: number) => {
      const deltaSeconds = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      const canCruise =
        isVisibleRef.current &&
        document.visibilityState === 'visible' &&
        !reducedMotion.matches &&
        dragRef.current === null &&
        rafRef.current === null &&
        time - lastInteractionRef.current >= autoPlayDelay;

      if (canCruise) {
        posRef.current += autoPlaySpeed * deltaSeconds;
        targetRef.current = posRef.current;
        selectIndex(indexAt(posRef.current));
        paint();

        if (Math.abs(posRef.current) > count * 1000) {
          posRef.current %= count;
          targetRef.current = posRef.current;
        }
      }

      autoRafRef.current = requestAnimationFrame(tick);
    };

    autoRafRef.current = requestAnimationFrame(tick);
    return () => {
      observer.disconnect();
      if (autoRafRef.current !== null) cancelAnimationFrame(autoRafRef.current);
      autoRafRef.current = null;
    };
  }, [autoPlay, autoPlayDelay, autoPlaySpeed, count, indexAt, loop, paint, selectIndex]);

  React.useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !count) return;

    const handleWheel = (event: WheelEvent) => {
      const direction = Math.sign(event.deltaY || event.deltaX);
      if (!direction) return;

      const atStart = Math.round(targetRef.current) <= 0;
      const atEnd = Math.round(targetRef.current) >= count - 1;
      const canMove = loop || (direction > 0 ? !atEnd : !atStart);
      if (!canMove) return;

      const isHorizontalGesture = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      if (!loop || isHorizontalGesture) event.preventDefault();
      markInteraction();
      wheelTotalRef.current += Math.abs(event.deltaY || event.deltaX);
      if (wheelTotalRef.current < 36) return;

      wheelTotalRef.current = 0;
      nudge(direction);

      if (wheelTimerRef.current !== null) window.clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = window.setTimeout(() => {
        wheelTotalRef.current = 0;
      }, 160);
    };

    frame.addEventListener('wheel', handleWheel, { passive: false });
    return () => frame.removeEventListener('wheel', handleWheel);
  }, [count, loop, markInteraction, nudge]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (autoRafRef.current !== null) cancelAnimationFrame(autoRafRef.current);
      if (wheelTimerRef.current !== null) window.clearTimeout(wheelTimerRef.current);
    },
    [],
  );

  if (!count) return null;
  const active = slides[selected];

  return (
    <div
      className={joinClasses('coverflow', className)}
      style={{ '--coverflow-card': cardWidth } as React.CSSProperties}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="coverflow__stage">
        <div
          ref={frameRef}
          className="coverflow__frame"
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === 'ArrowRight') {
              event.preventDefault();
              nudge(1);
            }
          }}
          style={{ perspective: `calc(var(--coverflow-card) * ${perspective})` }}
        >
          <div className="coverflow__track">
            {slides.map((slide, index) => (
              <div
                key={slide.src}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                className="coverflow__card"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} / ${count}: ${slide.alt}`}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  draggable={false}
                  loading={index < 3 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        </div>

        {showNavigation && (
          <div className="coverflow__navigation" aria-label="作品切换">
            <button
              type="button"
              className="coverflow__arrow"
              aria-label="上一个作品"
              disabled={!loop && selected === 0}
              onClick={() => nudge(-1)}
            >
              <Chevron direction="left" />
            </button>
            <button
              type="button"
              className="coverflow__arrow"
              aria-label="下一个作品"
              disabled={!loop && selected === count - 1}
              onClick={() => nudge(1)}
            >
              <Chevron direction="right" />
            </button>
          </div>
        )}
      </div>

      <div className="coverflow__details" aria-live="polite">
        {showCaption && active?.title && (
          <div key={selected} className="coverflow__caption">
            <span className="coverflow__counter">
              {String(selected + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </span>
            <h3>{active.title}</h3>
            {active.subtitle && <p>{active.subtitle}</p>}
          </div>
        )}

        {showPagination && (
          <div className="coverflow__pagination" aria-label="选择作品">
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`前往第 ${index + 1} 个作品`}
                aria-current={index === selected ? 'true' : undefined}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
