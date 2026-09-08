import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { education } from '@/data/resume'

const Education = () => {
  const [sectionRef, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section id="education" ref={sectionRef} className="px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl"
      >
        <header className="mb-10 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-purple-300/70">Education</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">教育背景</h2>
        </header>

        <article className="flex flex-col gap-5 rounded-2xl border border-purple-400/20 bg-white/5 p-6 backdrop-blur-md md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <h3 className="mb-2 text-2xl font-bold text-white">{education.school}</h3>
            <p className="text-purple-200">
              {education.major}
              {education.degree && (
                <>
                  <span className="mx-2 text-purple-400/60">·</span>
                  {education.degree}
                </>
              )}
            </p>
          </div>
          <time className="shrink-0 text-sm text-gray-400 md:text-base">{education.date}</time>
        </article>
      </motion.div>
    </section>
  )
}

export default Education
