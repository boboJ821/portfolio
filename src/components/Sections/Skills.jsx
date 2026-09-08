import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { skillCategories } from '@/data/resume'

function SkillCategory({ category, index, inView }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      whileHover={{ y: -4 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-400/10
                 hover:bg-white/10 hover:border-purple-400/30 hover:shadow-lg
                 hover:shadow-purple-500/10 transition-colors"
    >
      <h3 className="text-xl font-bold text-purple-300 mb-3">{category.title}</h3>
      <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-5">
        {category.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1.5 rounded-full bg-purple-900/40 border border-purple-400/20
                       text-sm text-purple-100"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.article>
  )
}

export default function Skills() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="skills" className="min-h-screen py-20 px-4" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-purple-300/70 mb-3">
          Capabilities
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">专业技能</h2>
      </motion.div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
        {skillCategories.map((category, index) => (
          <SkillCategory
            key={category.title}
            category={category}
            index={index}
            inView={inView}
          />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="max-w-3xl mx-auto mt-10 text-center text-gray-300 leading-relaxed"
      >
        擅长从业务场景中识别高频、重复、可标准化的流程，
        并通过数据分析、AI 与自动化工具提升执行效率和业务表现。
      </motion.p>
    </section>
  )
}
