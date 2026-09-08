import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { resumeProjects } from '@/data/resume'

const Works = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 })

  return (
    <section id="works" className="min-h-screen py-20 px-4" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        className="text-center mb-12"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-purple-300/70 mb-3">
          Selected projects
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">项目经历</h2>
      </motion.div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {resumeProjects.map((project, index) => (
          <motion.article
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            whileHover={{ y: -6 }}
            className="relative overflow-hidden rounded-2xl border border-purple-400/20
                       bg-gradient-to-br from-white/10 to-purple-950/20 p-6 md:p-8
                       backdrop-blur-md shadow-xl shadow-black/10"
          >
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple-500/10 blur-2xl" />
            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-sm">
                <span className="text-purple-300">{project.role}</span>
                <span className="text-gray-400">{project.date}</span>
              </div>
              <h3 className="text-2xl font-bold text-white leading-snug mb-4">
                {project.title}
              </h3>
              <p className="text-gray-300 leading-relaxed mb-5">{project.description}</p>

              <ul className="space-y-3 text-sm md:text-base text-gray-300 mb-6">
                {project.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                {project.technologies.map((technology) => (
                  <span
                    key={technology}
                    className="rounded-full border border-purple-400/20 bg-purple-900/30
                               px-3 py-1 text-xs md:text-sm text-purple-100"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export default Works
