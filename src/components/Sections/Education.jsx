import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { education } from '@/data/resume'

export default function Education() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section id="education" className="py-20 px-4" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-purple-300/70 mb-3">
            Education
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">教育背景</h2>
        </div>

        <article className="flex flex-col gap-5 rounded-2xl border border-purple-400/20
                            bg-white/5 p-6 md:flex-row md:items-center md:justify-between md:p-8
                            backdrop-blur-md">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{education.school}</h3>
            <p className="text-purple-200">
              {education.major} <span className="text-purple-400/60 mx-2">·</span> {education.degree}
            </p>
          </div>
          <p className="text-sm md:text-base text-gray-400 shrink-0">{education.date}</p>
        </article>
      </motion.div>
    </section>
  )
}
