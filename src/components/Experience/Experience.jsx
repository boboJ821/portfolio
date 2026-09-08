import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { experiences } from '@/data/resume'

const CurvedPath = () => (
  <div className="absolute bottom-0 left-1/2 top-0 hidden -translate-x-1/2 md:block">
    <svg
      aria-hidden="true"
      className="h-full w-40"
      viewBox="0 0 100 800"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M50,0 C60,200 40,400 50,600 C60,800 40,1000 50,1200"
        fill="none"
        stroke="url(#experience-gradient)"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      <defs>
        <linearGradient id="experience-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9333ea" stopOpacity="0" />
          <stop offset="50%" stopColor="#9333ea" stopOpacity="1" />
          <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
)

const TimelinePoint = ({ index, inView }) => (
  <motion.div
    aria-hidden="true"
    className={`absolute hidden h-4 w-4 -translate-y-1/2 md:block ${
      index % 2 === 0 ? 'right-[-2rem]' : 'left-[-2rem]'
    }`}
    initial={{ scale: 0, opacity: 0 }}
    animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
    transition={{ delay: 0.2, duration: 0.5 }}
  >
    <span className="absolute inset-0 rounded-full bg-purple-600" />
    <span className="absolute inset-0 animate-ping rounded-full bg-purple-400 opacity-30" />
    <motion.span
      className="absolute inset-0 rounded-full bg-purple-300"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  </motion.div>
)

const ExperienceCard = ({ experience, index }) => {
  const [cardRef, inView] = useInView({ triggerOnce: true, threshold: 0.12 })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`relative flex w-full ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}
    >
      <article className="relative mx-4 w-full rounded-xl border border-purple-400/10 bg-white/10 p-6 shadow-xl backdrop-blur-sm transition-colors hover:bg-white/15 md:mx-0 md:w-[calc(50%-2rem)]">
        <TimelinePoint index={index} inView={inView} />

        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm text-purple-300">
          <time>{experience.date}</time>
          <span>{experience.location}</span>
        </div>
        <h3 className="mb-1 text-xl font-bold text-white md:text-2xl">{experience.company}</h3>
        <h4 className="mb-1 text-lg text-purple-300 md:text-xl">{experience.title}</h4>
        <p className="mb-5 text-sm text-gray-400">{experience.meta}</p>

        <div className="mb-5 flex flex-wrap gap-2">
          {experience.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-purple-900/50 px-2.5 py-1 text-xs text-purple-200 md:text-sm"
            >
              {skill}
            </span>
          ))}
        </div>

        <ul className="space-y-3 text-sm text-gray-300 md:text-base">
          {experience.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-3 leading-relaxed">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400"
              />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </article>
    </motion.div>
  )
}

const Experience = () => (
  <section id="experience" className="relative min-h-screen px-0 py-20 md:px-4">
    <CurvedPath />

    <header className="mb-12 px-4 text-center md:mb-16">
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-purple-300/70">Experience</p>
      <h2 className="text-3xl font-bold text-white md:text-4xl">工作经历</h2>
    </header>

    <div className="relative mx-auto max-w-6xl space-y-12 md:space-y-24">
      {experiences.map((experience, index) => (
        <ExperienceCard key={experience.company} experience={experience} index={index} />
      ))}
    </div>
  </section>
)

export default Experience
