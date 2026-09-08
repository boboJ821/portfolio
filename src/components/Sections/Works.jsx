import { ProjectCarousel } from '@/components/Projects/ProjectCarousel'
import { portfolioProjects } from '@/data/resume'
import './Works.css'

const slides = portfolioProjects.map((project) => ({
  id: project.id,
  src: project.image || undefined,
  videoSrc: project.video || undefined,
  poster: project.poster || undefined,
  accent: project.accent,
  alt: `${project.title}项目演示`,
  title: project.title,
  eyebrow: project.category,
  subtitle: project.description,
  tags: project.technologies,
}))

const Works = () => {
  const hasVideo = slides.some((slide) => Boolean(slide.videoSrc))

  return (
    <section id="works" className="works-gallery-section" aria-labelledby="works-title">
      <header className="works-gallery-section__header">
        <div className="works-gallery-section__heading">
          <span>Selected projects</span>
          <h2 id="works-title">项目经历</h2>
        </div>
        <span>{String(slides.length).padStart(2, '0')} projects · Scroll or drag</span>
      </header>

      <ProjectCarousel
        slides={slides}
        rotate={38}
        depth={0.62}
        perspective={3.5}
        falloff={0.58}
        fade={0.12}
        cardWidth="clamp(20rem, 42vw, 42rem)"
        gap={0.07}
        loop
        autoPlay={!hasVideo}
        autoPlayDelay={3200}
        label="项目经历无限循环卡片"
      />
    </section>
  )
}

export default Works
