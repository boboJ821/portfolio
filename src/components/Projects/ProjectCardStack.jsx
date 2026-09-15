import { useEffect, useRef, useState } from 'react'
import './ProjectCardStack.css'

const posterFor = (item) =>
  `/red book/posters/${item.src
    .split('/')
    .pop()
    .replace(/\.mp4$/i, '.jpg')}`

function SelectedVideo({ item }) {
  const video = useRef(null)
  const [blocked, setBlocked] = useState(false)
  useEffect(() => {
    const element = video.current
    let visible = false
    let disposed = false
    const sync = () => {
      if (!visible || document.hidden) {
        element.pause()
        return
      }
      if (!element.ended)
        element.play().catch(() => {
          if (!disposed) setBlocked(true)
        })
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.5
        sync()
      },
      { threshold: [0, 0.5] },
    )
    observer.observe(element)
    document.addEventListener('visibilitychange', sync)
    return () => {
      disposed = true
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
      element.pause()
    }
  }, [])
  return (
    <>
      <video
        ref={video}
        src={item.src}
        poster={posterFor(item)}
        muted
        playsInline
        preload="metadata"
        aria-label={item.caption}
        disablePictureInPicture
      />
      {blocked && (
        <button
          type="button"
          onClick={() => {
            video.current
              .play()
              .then(() => setBlocked(false))
              .catch(() => {})
          }}
        >
          轻触播放
        </button>
      )}
    </>
  )
}

export default function ProjectCardStack({ items }) {
  const [selected, setSelected] = useState(0)
  const touch = useRef(null)
  const select = (index) => setSelected((index + items.length) % items.length)
  return (
    <section
      className="project-card-stack project-gallery"
      id="wallpaper-stack"
      aria-labelledby="stack-title"
    >
      <header>
        <span>MOTION WALLPAPER / {items.length}</span>
        <h2 id="stack-title">抽取一张，了解更多。</h2>
        <p>选一张动态壁纸，让画面动起来。</p>
        <small>左右滑动或点选编号 · 选中且进入视野后播放一次</small>
      </header>
      <div
        className="project-card-stack__stage"
        onTouchStart={(event) => {
          touch.current = event.touches[0].clientX
        }}
        onTouchEnd={(event) => {
          if (touch.current !== null) {
            const delta = event.changedTouches[0].clientX - touch.current
            if (Math.abs(delta) > 45) select(selected + (delta < 0 ? 1 : -1))
            touch.current = null
          }
        }}
      >
        {items.map((item, index) => {
          const offset =
            ((index - selected + items.length + Math.floor(items.length / 2)) % items.length) -
            Math.floor(items.length / 2)
          if (Math.abs(offset) > 7) return null
          return (
            <div
              className={`project-card-stack__card${offset === 0 ? ' is-selected' : ''}`}
              style={{ '--offset': offset, zIndex: 16 - Math.abs(offset) }}
              key={item.src}
            >
              {offset === 0 ? (
                <SelectedVideo key={item.src} item={item} />
              ) : (
                <button
                  type="button"
                  className="project-card-stack__back"
                  aria-label={`选择${item.caption}`}
                  onClick={() => select(index)}
                >
                  <img
                    src={posterFor(item)}
                    alt={item.caption}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </button>
              )}
            </div>
          )
        })}
      </div>
      <div className="project-card-stack__selection">
        <div className="project-card-stack__tabs">
          <button type="button" onClick={() => select(selected - 1)}>
            ← 上一张
          </button>
          <button type="button" onClick={() => select(selected + 1)}>
            下一张 →
          </button>
        </div>
        <p aria-live="polite">
          {String(selected + 1).padStart(2, '0')} / {items.length} · {items[selected].caption}
        </p>
        <div className="project-card-stack__tabs" aria-label="按编号挑选动态壁纸">
          {items.map((item, index) => (
            <button
              type="button"
              key={item.src}
              aria-label={item.caption}
              aria-pressed={selected === index}
              onClick={() => select(index)}
            >
              {String(index + 1).padStart(2, '0')}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
