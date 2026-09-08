import { useEffect } from 'react'
import { API_BASE_URL } from '@/config/api'

let visitRequest

const createVisit = async () => {
  const response = await fetch(`${API_BASE_URL}/visits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      path: window.location.pathname,
    }),
  })

  if (!response.ok) throw new Error(`Visit API returned ${response.status}`)
  return response.json()
}

const getVisit = () => {
  visitRequest ??= createVisit().catch((error) => {
    visitRequest = undefined
    throw error
  })
  return visitRequest
}

const updateVisitDuration = async () => {
  try {
    const visit = await getVisit()
    if (!visit?.id) return

    await fetch(`${API_BASE_URL}/visits?id=${encodeURIComponent(visit.id)}`, {
      method: 'PUT',
      keepalive: true,
    })
  } catch (error) {
    console.error('更新访问时长失败:', error)
  }
}

export const useVisitTracker = () => {
  useEffect(() => {
    getVisit().catch((error) => console.error('记录访问失败:', error))

    const intervalId = window.setInterval(updateVisitDuration, 60_000)
    const handlePageHide = () => updateVisitDuration()
    window.addEventListener('pagehide', handlePageHide)

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('pagehide', handlePageHide)
    }
  }, [])
}
