import { motion } from 'framer-motion'
import { profile } from '@/data/resume'

export default function Hero() {
  return (
    <section id="home" className="h-screen flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center space-y-6"
      >
        {/* 名字 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-2">
            <span className="text-white">{profile.englishName}</span>
            <span className="text-purple-300 ml-3">{profile.name}</span>
          </h1>
        </motion.div>

        {/* 标语 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <p className="text-lg md:text-xl text-neutral/80 font-light tracking-wide">
            AI 应用开发
            <span className="mx-2 text-purple-400">·</span>
            业务自动化
            <span className="mx-2 text-purple-400">·</span>
            Python
          </p>
          <p className="mt-3 text-sm md:text-base text-neutral/60 tracking-wide">
            {profile.location} · {profile.status}
          </p>
        </motion.div>

        {/* 可选：添加一个简短的描述或CTA按钮 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-8"
        >
          <button 
            onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-2 text-sm md:text-base text-purple-200 border border-purple-400/30 
                     rounded-full hover:bg-purple-400/10 transition-all duration-300
                     backdrop-blur-sm"
          >
            了解更多
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
} 
