import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const navigationItems = [
  { id: 'home', label: '首页' },
  { id: 'about', label: '关于' },
  { id: 'experience', label: '经历' },
  { id: 'education', label: '教育' },
  { id: 'works', label: '作品' },
  { id: 'skills', label: '技能' },
  { id: 'contact', label: '联系' },
]

const NavLink = ({ item, isActive, mobile = false, onNavigate }) => {
  const className = mobile
    ? `block rounded-md px-3 py-2 text-base font-medium transition-colors ${
        isActive ? 'bg-purple-500/20 text-purple-400' : 'text-white hover:bg-purple-500/20'
      }`
    : `group relative px-3 py-2 text-sm font-medium transition-colors ${
        isActive ? 'text-purple-400' : 'text-white hover:text-purple-400'
      }`

  if (mobile) {
    return (
      <motion.a
        href={`#${item.id}`}
        onClick={onNavigate}
        className={className}
        whileHover={{ x: 10 }}
        transition={{ duration: 0.2 }}
      >
        {item.label}
      </motion.a>
    )
  }

  return (
    <a href={`#${item.id}`} className={className} aria-current={isActive ? 'page' : undefined}>
      {item.label}
      <motion.span
        className="absolute bottom-0 left-0 h-0.5 bg-purple-400"
        initial={false}
        animate={{ width: isActive ? '100%' : '0%' }}
        transition={{ duration: 0.3 }}
      />
    </a>
  )
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const scrollFrameRef = useRef()

  useEffect(() => {
    const updateNavigation = () => {
      scrollFrameRef.current = undefined
      setIsScrolled(window.scrollY > 50)

      for (const { id } of navigationItems) {
        const section = document.getElementById(id)
        if (!section) continue

        const bounds = section.getBoundingClientRect()
        if (bounds.top <= 100 && bounds.bottom >= 100) {
          setActiveSection(id)
          break
        }
      }
    }

    const handleScroll = () => {
      if (scrollFrameRef.current === undefined) {
        scrollFrameRef.current = requestAnimationFrame(updateNavigation)
      }
    }

    updateNavigation()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollFrameRef.current !== undefined) cancelAnimationFrame(scrollFrameRef.current)
    }
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      aria-label="主导航"
      className={`fixed z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-black/80 py-2 backdrop-blur-md' : 'bg-transparent py-4'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <div className="hidden items-center space-x-12 md:flex">
            {navigationItems.map((item) => (
              <NavLink key={item.id} item={item} isActive={activeSection === item.id} />
            ))}
          </div>

          <div className="md:hidden">
            <button
              type="button"
              aria-label={isMenuOpen ? '关闭导航菜单' : '打开导航菜单'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="rounded-md p-2 text-white transition-colors hover:bg-purple-500/20"
            >
              <motion.svg
                aria-hidden="true"
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMenuOpen ? 'M6 18 18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </motion.svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 md:hidden"
            >
              <div className="space-y-1 rounded-lg bg-black/90 px-2 pb-3 pt-2 backdrop-blur-md">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.id}
                    item={item}
                    isActive={activeSection === item.id}
                    mobile
                    onNavigate={() => setIsMenuOpen(false)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar
