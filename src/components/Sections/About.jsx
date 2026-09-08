import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { profile, summary } from '@/data/resume'

const capabilities = ['AI 应用开发', '业务自动化', 'Python', '微信小程序', '电商运营', '数据提效']
const statistics = [
  { value: '5+', label: '年复合经验' },
  { value: '10W+', label: '内容互动' },
  { value: '2', label: '独立小程序' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
}
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

const About = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="about" className="flex min-h-screen items-center justify-center bg-primary/30">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <motion.div
          ref={sectionRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mx-auto max-w-4xl"
        >
          <motion.h2
            variants={itemVariants}
            className="mb-6 text-center text-3xl font-bold md:mb-8 md:text-4xl"
          >
            关于我
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="rounded-lg bg-primary/40 p-5 backdrop-blur-md md:p-8"
          >
            <div className="space-y-4 text-base leading-relaxed md:space-y-6 md:text-lg md:leading-loose md:tracking-wide">
              {profile.targetRole && (
                <p className="font-medium text-purple-200">{profile.targetRole}</p>
              )}
              {summary.map((item) => (
                <p key={item.title}>
                  <span className="font-semibold text-purple-300">{item.title}：</span>
                  {item.text}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-6 flex flex-wrap justify-center gap-2 md:mt-8 md:gap-4"
          >
            {capabilities.map((capability) => (
              <motion.div
                key={capability}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-default rounded-full border border-accent/30 bg-accent/20 px-3 py-1.5 text-sm backdrop-blur-sm transition-colors hover:border-accent/50 md:px-4 md:py-2 md:text-base"
              >
                {capability}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-8 grid grid-cols-3 gap-2 md:mt-12 md:gap-6"
          >
            {statistics.map((statistic) => (
              <div
                key={statistic.label}
                className="rounded-lg bg-primary/40 p-3 text-center backdrop-blur-md md:p-6"
              >
                <strong className="mb-1 block text-2xl font-bold text-accent md:mb-2 md:text-3xl">
                  {statistic.value}
                </strong>
                <span className="text-sm text-neutral/80 md:text-base">{statistic.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
