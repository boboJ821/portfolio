import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '@/data/resume'

const icons = {
  phone: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  ),
  wechat: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586"
    />
  ),
  email: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  ),
}

const Contact = () => {
  const [copiedContact, setCopiedContact] = useState('')

  useEffect(() => {
    if (!copiedContact) return undefined
    const timer = window.setTimeout(() => setCopiedContact(''), 2000)
    return () => window.clearTimeout(timer)
  }, [copiedContact])

  const copyWechat = async () => {
    try {
      await navigator.clipboard.writeText(profile.wechat)
      setCopiedContact('wechat')
    } catch (error) {
      console.error('复制微信号失败:', error)
    }
  }

  const contacts = [
    { id: 'phone', title: '电话', value: profile.phone, href: `tel:${profile.phone}` },
    { id: 'wechat', title: '微信', value: profile.wechat, onClick: copyWechat },
    { id: 'email', title: '邮箱', value: profile.email, href: `mailto:${profile.email}` },
  ]

  return (
    <section id="contact" className="flex min-h-screen items-center justify-center px-4 py-20">
      <div className="mx-auto w-full max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center text-3xl font-bold text-white md:text-4xl"
        >
          联系我
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {contacts.map((contact, index) => {
            const cardClassName =
              'group relative flex w-full cursor-pointer flex-col items-center space-y-4 rounded-lg border border-purple-500/20 bg-white/5 p-6 text-left backdrop-blur-sm transition-all duration-300 hover:border-purple-500/40 hover:bg-white/10'
            const content = (
              <>
                <svg
                  aria-hidden="true"
                  className="h-6 w-6 text-purple-300 transition-transform duration-300 group-hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {icons[contact.id]}
                </svg>
                <strong className="text-xl font-semibold text-white">{contact.title}</strong>
                <span className="break-all text-center text-gray-300">{contact.value}</span>
                <span className="text-sm text-purple-300/80">
                  {contact.onClick ? '点击复制' : '点击打开'}
                </span>
              </>
            )

            return (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {contact.href ? (
                  <a href={contact.href} className={cardClassName}>
                    {content}
                  </a>
                ) : (
                  <button type="button" onClick={contact.onClick} className={cardClassName}>
                    {content}
                  </button>
                )}

                {copiedContact === contact.id && (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 rounded bg-purple-500 px-3 py-1 text-sm text-white"
                  >
                    已复制
                  </motion.span>
                )}
              </motion.div>
            )
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-sm text-gray-400"
        >
          欢迎通过以上方式与我联系，期待与你交流。
        </motion.p>
      </div>
    </section>
  )
}

export default Contact
