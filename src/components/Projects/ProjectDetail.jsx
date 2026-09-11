import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { portfolioProjects } from '@/data/resume'
import './ProjectDetail.css'

const Arrow = ({ direction = 'right' }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={direction === 'left' ? 'M19 12H5m6 6-6-6 6-6' : 'M5 12h14m-6-6 6 6-6 6'} />
  </svg>
)

const ProjectVisual = ({ project, index, variant = 'hero', label }) => {
  const mediaLabel = label || `${project.title}项目视觉占位图`

  return (
    <div
      className={`project-visual project-visual--${variant}${variant === 'hero' && project.video ? ' project-visual--video' : ''}`}
      aria-label={mediaLabel}
    >
      {variant === 'hero' && project.video ? (
        <video
          src={project.video}
          poster={project.poster || project.image}
          muted
          autoPlay
          loop
          controls
          preload="metadata"
          playsInline
          aria-label={`${project.title}项目演示视频`}
        />
      ) : variant === 'hero' && project.image ? (
        <img src={project.image} alt={mediaLabel} />
      ) : (
        <div className="project-visual__placeholder" aria-hidden="true">
          <span className="project-visual__index">{String(index + 1).padStart(2, '0')}</span>
          <span className="project-visual__orbit" />
          <span className="project-visual__label">Visual pending</span>
        </div>
      )}
    </div>
  )
}

const ProjectDetail = () => {
  const { projectId } = useParams()
  const projectIndex = portfolioProjects.findIndex((item) => item.id === projectId)
  const project = portfolioProjects[projectIndex]

  useEffect(() => {
    if (!project) return undefined
    const previousTitle = document.title
    document.title = `${project.title} · Huang Xi`
    return () => {
      document.title = previousTitle
    }
  }, [project])

  if (!project) return <Navigate to="/#works" replace />

  const nextProject = portfolioProjects[(projectIndex + 1) % portfolioProjects.length]
  const details = project.details

  return (
    <main
      className="project-page"
      style={{ '--project-accent': project.accent }}
      data-project={project.id}
    >
      <div className="project-page__glow" aria-hidden="true" />

      <header className="project-page__nav">
        <Link to="/" className="project-page__brand" aria-label="返回网站首页">
          HX<span>.</span>
        </Link>
        <Link to="/#works" className="project-page__back">
          <Arrow direction="left" />
          <span>返回项目</span>
        </Link>
      </header>

      <article>
        <section className="project-hero" aria-labelledby="project-title">
          <div className="project-hero__meta">
            <span>Project {String(projectIndex + 1).padStart(2, '0')}</span>
            <span>{project.category}</span>
          </div>

          <div className="project-hero__layout">
            <div className="project-hero__copy">
              <h1 id="project-title">{project.title}</h1>

              <div className="project-hero__intro">
                <p>{project.description}</p>
                <dl>
                  <div>
                    <dt>角色</dt>
                    <dd>{details.role}</dd>
                  </div>
                  <div>
                    <dt>阶段</dt>
                    <dd>{details.stage}</dd>
                  </div>
                </dl>
              </div>
              {project.gallery && (
                <a className="project-hero__explore" href="#project-chapter-1">
                  探索项目界面 ↓
                </a>
              )}
              {project.miniProgram && (
                <div className="project-mini-program">
                  <div>
                    <a
                      className="project-mini-program__button"
                      href={project.miniProgram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      打开小程序 ↗
                    </a>
                    <p>
                      微信扫码体验
                      <br />
                      手机也可保存小程序码后在微信识别
                    </p>
                  </div>
                  <a
                    href={project.miniProgram.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title}小程序码，查看原图`}
                  >
                    <img
                      src={project.miniProgram.code}
                      alt={`${project.title}微信小程序码`}
                      width="430"
                      height="430"
                    />
                  </a>
                </div>
              )}
            </div>

            <ProjectVisual project={project} index={projectIndex} />
          </div>
        </section>

        <section className="project-story" aria-labelledby="project-story-title">
          <div className="project-story__heading">
            <span>Overview</span>
            <h2 id="project-story-title">
              从问题出发，
              <br />
              让方案落地。
            </h2>
          </div>

          <div className="project-story__chapters">
            {[
              ['01', '背景', details.brief],
              ['02', '方法', details.approach],
              ['03', '价值', details.value],
            ].map(([number, title, text]) => (
              <section key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </section>
            ))}
          </div>
        </section>

        {project.gallery ? (
          <section className="project-gallery project-gallery--screens" aria-label="实机界面展示">
            {project.gallery.map((chapter, index) => (
              <section
                className="project-screens"
                id={`project-chapter-${index + 1}`}
                key={chapter.title}
              >
                <header>
                  <span>{String(index + 1).padStart(2, '0')} / PRODUCT EXPERIENCE</span>
                  <h2>{chapter.title}</h2>
                  <p>{chapter.description}</p>
                  <small>点击查看原图 · 手机端左右滑动</small>
                  <nav className="project-chapter-nav" aria-label={`第 ${index + 1} 章导航`}>
                    {project.gallery.map((item, chapterIndex) => (
                      <a
                        key={item.title}
                        href={`#project-chapter-${chapterIndex + 1}`}
                        aria-label={`跳转至：${item.title}`}
                        aria-current={chapterIndex === index ? 'location' : undefined}
                      >
                        {String(chapterIndex + 1).padStart(2, '0')}
                      </a>
                    ))}
                  </nav>
                </header>
                <div className="project-screens__images">
                  {chapter.images.map((item) => (
                    <figure key={item.src}>
                      <a
                        href={item.src}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${item.caption}，在新标签页查看原图`}
                      >
                        <img
                          src={item.src}
                          alt={item.caption}
                          width="1206"
                          height="2622"
                          loading="lazy"
                          decoding="async"
                        />
                      </a>
                      <figcaption>{item.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            ))}
          </section>
        ) : (
          <section className="project-gallery" aria-label="项目视觉展示">
            <ProjectVisual
              project={project}
              index={projectIndex}
              variant="landscape"
              label={`${project.title}界面展示占位图一`}
            />
            <div className="project-gallery__pair">
              <ProjectVisual
                project={project}
                index={projectIndex}
                variant="portrait"
                label={`${project.title}界面展示占位图二`}
              />
              <div className="project-gallery__note">
                <span>Toolkit</span>
                <div>
                  {project.technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
                <p>此区域已为后续项目截图、界面细节与演示视频预留。</p>
              </div>
            </div>
          </section>
        )}

        <footer className="project-next">
          <span>Next project</span>
          <Link to={`/projects/${nextProject.id}`}>
            <strong>{nextProject.title}</strong>
            <Arrow />
          </Link>
        </footer>
      </article>
    </main>
  )
}

export default ProjectDetail
