import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { profile, summary } from '@/data/resume'

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  // 处理滚动定位
  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById('about')
      if (!aboutSection) return

      const rect = aboutSection.getBoundingClientRect()
      const viewHeight = window.innerHeight
      const elementHeight = aboutSection.offsetHeight

      // 如果元素高度小于视口高度，调整padding使其垂直居中，并向上偏移
      if (elementHeight < viewHeight) {
        const padding = (viewHeight - elementHeight) / 2
        aboutSection.style.paddingTop = `${Math.max(padding - 100, 0)}px` // 增加顶部偏移，使内容更靠上
        aboutSection.style.paddingBottom = `${padding + 50}px` // 增加底部padding来保持整体平衡
      }
    }

    handleScroll() // 初始化
    window.addEventListener('resize', handleScroll)
    return () => window.removeEventListener('resize', handleScroll)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  const skills = [
    "AI 应用开发", "业务自动化", "Python", "微信小程序", "电商运营", "数据提效"
  ]

  return (
    <section 
      id="about" 
      className="min-h-screen flex items-center justify-center bg-primary/30"
    >
      <div className="container mx-auto px-4 py-12 md:py-20">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          {/* 标题 */}
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8"
          >
            关于我
          </motion.h2>

          {/* 个人介绍 */}
          <motion.div 
            variants={itemVariants}
            className="bg-primary/40 backdrop-blur-md rounded-lg p-5 md:p-8"
          >
            <div className="space-y-4 md:space-y-6 text-base md:text-lg leading-relaxed md:leading-loose md:tracking-wide">
              <p className="text-purple-200 font-medium">{profile.targetRole}</p>
              {summary.map((item) => (
                <p key={item.title}>
                  <span className="text-purple-300 font-semibold">{item.title}：</span>
                  {item.text}
                </p>
              ))}
            </div>
          </motion.div>

          {/* 技能标签 */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap gap-2 md:gap-4 justify-center mt-6 md:mt-8"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-accent/20 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full
                          border border-accent/30 hover:border-accent/50
                          transition-colors cursor-default text-sm md:text-base"
              >
                {skill}
              </motion.div>
            ))}
          </motion.div>

          {/* 统计数据 */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-3 gap-2 md:gap-6 mt-8 md:mt-12"
          >
            <div className="text-center p-3 md:p-6 bg-primary/40 backdrop-blur-md rounded-lg">
              <h3 className="text-2xl md:text-3xl font-bold text-accent mb-1 md:mb-2">3+</h3>
              <p className="text-neutral/80 text-sm md:text-base">年复合经验</p>
            </div>
            <div className="text-center p-3 md:p-6 bg-primary/40 backdrop-blur-md rounded-lg">
              <h3 className="text-2xl md:text-3xl font-bold text-accent mb-1 md:mb-2">10W+</h3>
              <p className="text-neutral/80 text-sm md:text-base">内容互动</p>
            </div>
            <div className="text-center p-3 md:p-6 bg-primary/40 backdrop-blur-md rounded-lg">
              <h3 className="text-2xl md:text-3xl font-bold text-accent mb-1 md:mb-2">2</h3>
              <p className="text-neutral/80 text-sm md:text-base">独立小程序</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 
