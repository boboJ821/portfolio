import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { skillCategories } from '@/data/resume'

const SkillCategory = ({ category, index, inView }) => (
  <motion.article
    initial={{ opacity: 0, y: 24 }}
    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
    transition={{ duration: 0.5, delay: index * 0.12 }}
    whileHover={{ y: -4 }}
    className="rounded-xl border border-purple-400/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-purple-400/30 hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/10"
  >
    <h3 className="mb-3 text-xl font-bold text-purple-300">{category.title}</h3>
    <p className="mb-5 text-sm leading-relaxed text-gray-400 md:text-base">
      {category.description}
    </p>
    <div className="flex flex-wrap gap-2">
      {category.skills.map((skill) => (
        <span
          key={skill}
          className="rounded-full border border-purple-400/20 bg-purple-900/40 px-3 py-1.5 text-sm text-purple-100"
        >
          {skill}
        </span>
      ))}
    </div>
  </motion.article>
)

const Skills = () => {
  const [sectionRef, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="skills" ref={sectionRef} className="min-h-screen px-4 py-20">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.8 }}
        className="mb-12 text-center"
      >
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-purple-300/70">Capabilities</p>
        <h2 className="text-3xl font-bold text-white md:text-4xl">专业技能</h2>
      </motion.header>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
        {skillCategories.map((category, index) => (
          <SkillCategory key={category.title} category={category} index={index} inView={inView} />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mx-auto mt-10 max-w-3xl text-center leading-relaxed text-gray-300"
      >
        擅长从业务场景中识别高频、重复、可标准化的流程，并通过数据分析、AI
        与自动化工具提升执行效率和业务表现。
      </motion.p>
    </section>
  )
}

export default Skills
