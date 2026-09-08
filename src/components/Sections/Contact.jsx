import { motion } from 'framer-motion'
import { useState } from 'react'
import { profile } from '@/data/resume'

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState(null)

  const contactInfo = [
    {
      title: "电话",
      value: profile.phone,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      action: () => window.location.href = `tel:${profile.phone}`
    },
    {
      title: "微信",
      value: profile.wechat,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      action: async () => {
        try {
          await navigator.clipboard.writeText(profile.wechat);
          setActiveTooltip("wechat");
          setTimeout(() => setActiveTooltip(null), 2000);
          setTimeout(() => {
            window.location.href = `weixin://dl/search?q=${profile.wechat}`;
          }, 300);
        } catch (err) {
          console.error("复制失败:", err);
        }
      }
    },
    {
      title: "邮箱",
      value: profile.email,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      action: () => window.location.href = `mailto:${profile.email}`
    }
  ]

  const handleClick = (contact, index) => {
    if (contact.action) {
      contact.action()
    } else {
      copyToClipboard(contact.value, index)
    }
  }

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setActiveTooltip(index)
    setTimeout(() => {
      setCopied(false)
      setActiveTooltip(null)
    }, 2000)
  }

  return (
    <section id="contact" className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-4xl w-full mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-center text-white mb-12"
        >
          联系我
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactInfo.map((contact, index) => (
            <motion.div
              key={contact.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div
                onClick={() => handleClick(contact, index)}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-6 cursor-pointer
                         hover:bg-white/10 transition-all duration-300
                         border border-purple-500/20 hover:border-purple-500/40
                         flex flex-col items-center space-y-4"
              >
                <div className="text-purple-300 transition-transform duration-300 group-hover:scale-110">
                  {contact.icon}
                </div>
                <h3 className="text-xl font-semibold text-white">{contact.title}</h3>
                <p className="text-gray-300 text-center break-all">
                  {contact.value}
                </p>
                
                {/* 点击提示 */}
                <span className="text-sm text-purple-300/80">
                  点击{contact.action ? "打开" : "复制"}
                </span>
              </div>

              {/* 复制成功提示 */}
              {(activeTooltip === index || activeTooltip === "wechat") && !contact.action && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-10 left-1/2 transform -translate-x-1/2
                           bg-purple-500 text-white px-3 py-1 rounded text-sm"
                >
                  已复制!
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* 补充说明 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-400 mt-12 text-sm"
        >
          欢迎通过以上方式与我联系，期待与您的交流！
        </motion.p>
      </div>
    </section>
  )
} 
