import * as React from 'react'
import './ProjectCarousel.css'

export interface ProjectSlide {
  id: string
  src?: string
  videoSrc?: string
  poster?: string
  accent?: string
  alt: string
  title?: string
  eyebrow?: string
  subtitle?: string
  tags?: string[]
}

export interface ProjectCarouselProps {
  slides: ProjectSlide[]
  onSlideOpen?: (slide: ProjectSlide) => void
  rotate?: number
  depth?: number
  perspective?: number
  falloff?: number
  fade?: number
  cardWidth?: string
  gap?: number
  loop?: boolean
  showCaption?: boolean
  showPagination?: boolean
  showNavigation?: boolean
  autoPlay?: boolean
  autoPlayDelay?: number
  label?: string
  className?: string
}

const MOTION_DURATION = 760
const STAGING_RANGE = 3

const joinClasses = (...classes: Array<string | false | undefined>) =>
  classes.filter(Boolean).join(' ')

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
)

export function ProjectCarousel({
  slides,
  onSlideOpen,
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
  label = 'Selected projects',
  className,
}: ProjectCarouselProps) {
  const count = slides.length
  const frameRef = React.useRef<HTMLDivElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const videoRefs = React.useRef(new Map<string, HTMLVideoElement>())
  const selectedRef = React.useRef(0)
  const movingRef = React.useRef(false)
  const isVisibleRef = React.useRef(false)
  const lastInteractionRef = React.useRef(0)
  const finishTimerRef = React.useRef<number | null>(null)
  const dragRafRef = React.useRef<number | null>(null)
  const didDragRef = React.useRef(false)
  const dragRef = React.useRef<{
    id: number
    openId: string | null
    startX: number
    lastX: number
    lastTime: number
    velocity: number
    offset: number
    width: number
  } | null>(null)
  const [selected, setSelected] = React.useState(0)
  const [motionDirection, setMotionDirection] = React.useState(0)
  const [settling, setSettling] = React.useState(false)

  const normalizeIndex = React.useCallback(
    (index: number) => {
      if (!count) return 0
      return ((index % count) + count) % count
    },
    [count],
  )

  const markInteraction = React.useCallback(() => {
    lastInteractionRef.current = performance.now()
  }, [])

  const triggerHaptic = React.useCallback(() => {
    if (
      typeof window === 'undefined' ||
      !window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('vibrate' in navigator)
    ) {
      return
    }

    navigator.vibrate(10)
  }, [])

  const move = React.useCallback(
    (direction: number, isUserInteraction = true) => {
      if (!count || movingRef.current || dragRef.current) return

      const current = selectedRef.current
      const nextDirection = loop
        ? Math.round(direction)
        : Math.max(-current, Math.min(count - 1 - current, Math.round(direction)))

      if (isUserInteraction) markInteraction()
      movingRef.current = true
      setSettling(true)
      setMotionDirection(nextDirection)
      if (isUserInteraction && nextDirection) triggerHaptic()

      finishTimerRef.current = window.setTimeout(
        () => {
          const next = loop
            ? normalizeIndex(selectedRef.current + nextDirection)
            : Math.max(0, Math.min(count - 1, selectedRef.current + nextDirection))

          selectedRef.current = next
          setSelected(next)
          setMotionDirection(0)
          setSettling(false)
          movingRef.current = false
          finishTimerRef.current = null
        },
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : MOTION_DURATION,
      )
    },
    [count, loop, markInteraction, normalizeIndex, triggerHaptic],
  )

  const goTo = React.useCallback(
    (index: number) => {
      if (index === selectedRef.current || movingRef.current || dragRef.current) return
      markInteraction()

      const forward = normalizeIndex(index - selectedRef.current)
      const backward = normalizeIndex(selectedRef.current - index)
      move(loop ? (forward <= backward ? forward : -backward) : index - selectedRef.current)
    },
    [markInteraction, move, normalizeIndex],
  )

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (movingRef.current || dragRef.current || !event.isPrimary || event.button !== 0) return
    markInteraction()
    didDragRef.current = false
    event.currentTarget.setPointerCapture(event.pointerId)

    dragRef.current = {
      id: event.pointerId,
      openId:
        (event.target as HTMLElement).closest<HTMLElement>('.coverflow__card--openable')?.dataset
          .slideId || null,
      startX: event.clientX,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
      offset: 0,
      width:
        (trackRef.current?.querySelector<HTMLElement>('.coverflow__card')?.offsetWidth || 1) *
        (1 + gap),
    }
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.id !== event.pointerId) return

    const now = performance.now()
    const elapsed = Math.max(now - drag.lastTime, 1)
    drag.velocity = (event.clientX - drag.lastX) / elapsed
    drag.lastX = event.clientX
    drag.lastTime = now
    drag.offset = Math.max(
      -drag.width * 0.85,
      Math.min(drag.width * 0.85, event.clientX - drag.startX),
    )
    if (Math.abs(drag.offset) > 6) didDragRef.current = true

    if (dragRafRef.current !== null) return
    dragRafRef.current = requestAnimationFrame(() => {
      const currentDrag = dragRef.current
      if (currentDrag && didDragRef.current) {
        let progress = -currentDrag.offset / currentDrag.width
        if (
          !loop &&
          (selectedRef.current + progress < 0 || selectedRef.current + progress > count - 1)
        )
          progress *= 0.2
        setMotionDirection(progress)
      }
      dragRafRef.current = null
    })
  }

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.id !== event.pointerId) return

    dragRef.current = null
    if (dragRafRef.current !== null) {
      cancelAnimationFrame(dragRafRef.current)
      dragRafRef.current = null
    }

    const cancelled = event.type === 'pointercancel' || event.type === 'lostpointercapture'
    const velocity = performance.now() - drag.lastTime < 100 ? drag.velocity : 0
    const shouldMove =
      !cancelled &&
      didDragRef.current &&
      (Math.abs(drag.offset) > Math.min(drag.width * 0.18, 100) || Math.abs(velocity) > 0.5)
    const direction = drag.offset < 0 ? 1 : -1
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)

    if (shouldMove) {
      move(direction)
    } else if (!cancelled && drag.openId && onSlideOpen && !didDragRef.current) {
      const slide = slides.find((item) => item.id === drag.openId)
      if (slide) onSlideOpen(slide)
    } else if (didDragRef.current) {
      move(0)
    }
  }

  React.useEffect(() => {
    const frame = frameRef.current
    if (!frame || !count) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    lastInteractionRef.current = performance.now()
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting && entry.intersectionRatio > 0.2
      },
      { threshold: [0, 0.2, 0.55] },
    )
    observer.observe(frame)

    if (!autoPlay || !loop) return () => observer.disconnect()

    const timer = window.setInterval(() => {
      const canAdvance =
        isVisibleRef.current &&
        document.visibilityState === 'visible' &&
        !reducedMotion.matches &&
        performance.now() - lastInteractionRef.current >= autoPlayDelay

      if (canAdvance) move(1, false)
    }, autoPlayDelay)

    return () => {
      observer.disconnect()
      window.clearInterval(timer)
    }
  }, [autoPlay, autoPlayDelay, count, loop, move])

  React.useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const visibleVideos = new Set<HTMLVideoElement>()
    const syncVideos = () => {
      videoRefs.current.forEach((video) => {
        if (visibleVideos.has(video) && document.visibilityState === 'visible') {
          video.play().catch(() => undefined)
        } else {
          video.pause()
        }
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement
          if (entry.isIntersecting && entry.intersectionRatio > 0.01) visibleVideos.add(video)
          else visibleVideos.delete(video)
        })
        syncVideos()
      },
      { threshold: [0, 0.01] },
    )
    const handleVisibility = () => syncVideos()

    videoRefs.current.forEach((video) => observer.observe(video))
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [selected, slides])

  React.useEffect(
    () => () => {
      if (finishTimerRef.current !== null) window.clearTimeout(finishTimerRef.current)
      if (dragRafRef.current !== null) cancelAnimationFrame(dragRafRef.current)
    },
    [],
  )

  if (!count) return null

  const active = slides[selected]
  const renderedSlides: Array<{ slide: ProjectSlide; slot: number; position: number }> = []
  const usedIds = new Set<string>()
  const renderRange = Math.min(STAGING_RANGE, Math.floor((count - 1) / 2))

  for (let slot = -renderRange; slot <= renderRange; slot += 1) {
    const slide = slides[normalizeIndex(selected + slot)]
    if (!slide || usedIds.has(slide.id)) continue
    usedIds.add(slide.id)
    renderedSlides.push({ slide, slot, position: slot - motionDirection })
  }

  return (
    <div
      className={joinClasses(
        'coverflow',
        (motionDirection !== 0 || settling) && 'coverflow--moving',
        settling && 'coverflow--settling',
        className,
      )}
      style={
        {
          '--coverflow-card': cardWidth,
          '--coverflow-duration': `${MOTION_DURATION}ms`,
        } as React.CSSProperties
      }
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
          onLostPointerCapture={endDrag}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') {
              event.preventDefault()
              move(-1)
            } else if (event.key === 'ArrowRight') {
              event.preventDefault()
              move(1)
            }
          }}
          style={{ perspective: `calc(var(--coverflow-card) * ${perspective})` }}
        >
          <div ref={trackRef} className="coverflow__track">
            {renderedSlides.map(({ slide, position }) => {
              const distance = Math.abs(position)
              const ramp = Math.pow(distance, falloff)
              const tilt = Math.min(rotate * ramp, 80) * Math.sign(position)
              const x = position * (1 + gap) * 100
              const z = -depth * ramp
              const opacity = distance >= STAGING_RANGE ? 0 : Math.max(0, 1 - fade * distance)

              return (
                <div
                  key={slide.id}
                  className={joinClasses(
                    'coverflow__card',
                    position === 0 && onSlideOpen && 'coverflow__card--openable',
                  )}
                  style={
                    {
                      '--coverflow-accent': slide.accent,
                      transform:
                        `translate3d(calc(-50% + ${x}%), 0, calc(var(--coverflow-card) * ${z})) ` +
                        `rotateY(${-tilt}deg)`,
                      opacity,
                      zIndex: 100 - Math.round(distance),
                    } as React.CSSProperties
                  }
                  role={position === 0 && onSlideOpen ? 'link' : 'group'}
                  data-slide-id={slide.id}
                  aria-roledescription="slide"
                  aria-label={slide.alt}
                  aria-hidden={position !== 0}
                  tabIndex={position === 0 && onSlideOpen ? 0 : -1}
                  onKeyDown={(event) => {
                    if (
                      position === 0 &&
                      !movingRef.current &&
                      !dragRef.current &&
                      onSlideOpen &&
                      (event.key === 'Enter' || event.key === ' ')
                    ) {
                      event.preventDefault()
                      onSlideOpen(slide)
                    }
                  }}
                >
                  {slide.videoSrc ? (
                    <video
                      ref={(node) => {
                        if (node) videoRefs.current.set(slide.id, node)
                        else videoRefs.current.delete(slide.id)
                      }}
                      src={slide.videoSrc}
                      poster={slide.poster || slide.src}
                      muted
                      loop
                      playsInline
                      preload={position === 0 ? 'metadata' : 'none'}
                      aria-hidden="true"
                    />
                  ) : slide.src ? (
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      draggable={false}
                      loading={Math.abs(position) <= 1 ? 'eager' : 'lazy'}
                    />
                  ) : (
                    <div className="coverflow__placeholder" aria-hidden="true">
                      <span>{String(slides.indexOf(slide) + 1).padStart(2, '0')}</span>
                    </div>
                  )}

                  <div className="coverflow__card-copy" aria-hidden="true">
                    {slide.eyebrow && <span>{slide.eyebrow}</span>}
                    {slide.title && <strong>{slide.title}</strong>}
                    {slide.tags && (
                      <div>
                        {slide.tags.slice(0, 3).map((tag) => (
                          <small key={tag}>{tag}</small>
                        ))}
                      </div>
                    )}
                  </div>
                  {position === 0 && onSlideOpen && (
                    <span className="coverflow__open" aria-hidden="true">
                      查看项目 <span>↗</span>
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {showNavigation && (
          <div className="coverflow__navigation" aria-label="作品切换">
            <button
              type="button"
              className="coverflow__arrow"
              aria-label="上一个作品"
              disabled={!loop && selected === 0}
              onClick={() => move(-1)}
            >
              <Chevron direction="left" />
            </button>
            <button
              type="button"
              className="coverflow__arrow"
              aria-label="下一个作品"
              disabled={!loop && selected === count - 1}
              onClick={() => move(1)}
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
                key={slide.id}
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
  )
}
