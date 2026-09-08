import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { experiences } from '@/data/resume'

function CurvedPath() {
  return (
    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 hidden md:block">
      <svg className="h-full w-40" viewBox="0 0 100 800" preserveAspectRatio="none">
        <motion.path
          d="M50,0 C60,200 40,400 50,600 C60,800 40,1000 50,1200"
          fill="none"
          stroke="url(#gradientPath)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
        <defs>
          <linearGradient id="gradientPath" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9333EA" stopOpacity="0" />
            <stop offset="50%" stopColor="#9333EA" stopOpacity="1" />
            <stop offset="100%" stopColor="#9333EA" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

function TimelinePoint({ index, inView }) {
  return (
    <motion.div
      className={`absolute w-4 h-4 -translate-y-1/2 hidden md:block ${
        index % 2 === 0 ? 'right-[-2rem]' : 'left-[-2rem]'
      }`}
      initial={{ scale: 0, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-purple-600 rounded-full" />
      <div className="absolute inset-0 bg-purple-400 rounded-full animate-ping opacity-30" />
      <motion.div
        className="absolute inset-0 bg-purple-300 rounded-full"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.div>
  )
}

function ExperienceCard({ experience, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.12 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`relative flex w-full ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}
    >
      <article className="relative w-full mx-4 rounded-xl border border-purple-400/10 bg-white/10 p-6
                          shadow-xl backdrop-blur-sm transition-colors hover:bg-white/15
                          md:mx-0 md:w-[calc(50%-2rem)]">
        <TimelinePoint index={index} inView={inView} />

        <div className="flex flex-wrap items-center justify-between gap-2 text-purple-300 text-sm mb-2">
          <span>{experience.date}</span>
          <span>{experience.location}</span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{experience.company}</h3>
        <h4 className="text-lg md:text-xl text-purple-300 mb-1">{experience.title}</h4>
        <p className="text-sm text-gray-400 mb-5">{experience.meta}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {experience.skills.map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 bg-purple-900/50 rounded-full text-purple-200 text-xs md:text-sm"
            >
              {skill}
            </span>
          ))}
        </div>

        <ul className="space-y-3 text-gray-300 text-sm md:text-base">
          {experience.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-3 leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </article>
    </motion.div>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="relative min-h-screen py-20 px-0 md:px-4">
      <CurvedPath />

      <div className="text-center mb-12 md:mb-16 px-4">
        <p className="text-sm uppercase tracking-[0.3em] text-purple-300/70 mb-3">
          Experience
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">工作经历</h2>
      </div>

      <div className="relative max-w-6xl mx-auto space-y-12 md:space-y-24">
        {experiences.map((experience, index) => (
          <ExperienceCard key={experience.company} experience={experience} index={index} />
        ))}
      </div>
    </section>
  )
}
