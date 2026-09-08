import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // 检测当前活动section
      const sections = ['home', 'about', 'experience', 'education', 'works', 'skills', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            <NavLink href="#home" text="首页" isActive={activeSection === 'home'} />
            <NavLink href="#about" text="关于" isActive={activeSection === 'about'} />
            <NavLink href="#experience" text="经历" isActive={activeSection === 'experience'} />
            <NavLink href="#education" text="教育" isActive={activeSection === 'education'} />
            <NavLink href="#works" text="作品" isActive={activeSection === 'works'} />
            <NavLink href="#skills" text="技能" isActive={activeSection === 'skills'} />
            <NavLink href="#contact" text="联系" isActive={activeSection === 'contact'} />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 rounded-md hover:bg-purple-500/20 transition-colors"
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-black/90 rounded-lg backdrop-blur-md">
                <MobileNavLink href="#home" text="首页" setIsMenuOpen={setIsMenuOpen} isActive={activeSection === 'home'} />
                <MobileNavLink href="#about" text="关于" setIsMenuOpen={setIsMenuOpen} isActive={activeSection === 'about'} />
                <MobileNavLink href="#experience" text="经历" setIsMenuOpen={setIsMenuOpen} isActive={activeSection === 'experience'} />
                <MobileNavLink href="#education" text="教育" setIsMenuOpen={setIsMenuOpen} isActive={activeSection === 'education'} />
                <MobileNavLink href="#works" text="作品" setIsMenuOpen={setIsMenuOpen} isActive={activeSection === 'works'} />
                <MobileNavLink href="#skills" text="技能" setIsMenuOpen={setIsMenuOpen} isActive={activeSection === 'skills'} />
                <MobileNavLink href="#contact" text="联系" setIsMenuOpen={setIsMenuOpen} isActive={activeSection === 'contact'} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

// NavLink 组件 - 桌面端导航链接
const NavLink = ({ href, text, isActive }) => {
  return (
    <a
      href={href}
      className={`text-white px-3 py-2 text-sm font-medium relative group transition-colors ${
        isActive ? 'text-purple-400' : 'hover:text-purple-400'
      }`}
    >
      {text}
      <motion.span 
        className="absolute bottom-0 left-0 h-0.5 bg-purple-400"
        initial={false}
        animate={{ width: isActive ? '100%' : '0%' }}
        transition={{ duration: 0.3 }}
      />
    </a>
  );
};

// MobileNavLink 组件 - 移动端导航链接
const MobileNavLink = ({ href, text, setIsMenuOpen, isActive }) => {
  return (
    <motion.a
      href={href}
      onClick={() => setIsMenuOpen(false)}
      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
        isActive ? 'text-purple-400 bg-purple-500/20' : 'text-white hover:bg-purple-500/20'
      }`}
      whileHover={{ x: 10 }}
      transition={{ duration: 0.2 }}
    >
      {text}
    </motion.a>
  );
};

export default Navbar;
