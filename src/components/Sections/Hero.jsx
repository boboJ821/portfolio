import { motion } from 'framer-motion'
import { profile } from '@/data/resume'

const Hero = () => (
  <section id="home" className="flex h-screen items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="space-y-6 text-center"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mb-2 text-4xl font-bold md:text-6xl"
      >
        <span className="text-white">{profile.englishName}</span>
        <span className="ml-3 text-purple-300">{profile.name}</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <p className="mt-3 text-sm tracking-wide text-neutral/60 md:text-base">
          {profile.location} · {profile.status}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-8"
      >
        <button
          type="button"
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          className="rounded-full border border-purple-400/30 px-6 py-2 text-sm text-purple-200 backdrop-blur-sm transition-colors duration-300 hover:bg-purple-400/10 md:text-base"
        >
          了解更多
        </button>
      </motion.div>
    </motion.div>
  </section>
)

export default Hero
