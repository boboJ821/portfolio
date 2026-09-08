export const useSmoothScroll = () => {
  const scrollToSection = (elementId) => {
    const element = document.querySelector(elementId)
    if (!element) return

    const offset = 20 // 进一步减小偏移量，让内容显示在更上方
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }

  return { scrollToSection }
} 