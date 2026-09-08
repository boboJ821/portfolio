const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

export const formatDuration = (value) => {
  const totalSeconds = Math.max(0, Number(value) || 0)
  if (totalSeconds === 0) return '0 秒'

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)
  const parts = []

  if (hours > 0) parts.push(`${hours} 小时`)
  if (minutes > 0) parts.push(`${minutes} 分钟`)
  if (seconds > 0) parts.push(`${seconds} 秒`)
  return parts.join(' ')
}
