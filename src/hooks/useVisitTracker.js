import { useEffect, useRef } from 'react';

// 统一 API 基地址：生产用相对路径 /api（Vercel 函数），
// 开发可用 Vite 代理（见 vite.config.js），或用 VITE_API_URL 覆盖。
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const useVisitTracker = () => {
  const visitId = useRef(null);

  useEffect(() => {
    const recordVisit = async () => {
      try {
        const response = await fetch(`${API_BASE}/visits`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            path: window.location.pathname,
          }),
        });
        const data = await response.json();
        visitId.current = data.id;
      } catch (error) {
        console.error('Error recording visit:', error);
      }
    };

    const updateDuration = async () => {
      if (visitId.current) {
        try {
          await fetch(`${API_BASE}/visits/${visitId.current}`, {
            method: 'PUT',
          });
        } catch (error) {
          console.error('Error updating duration:', error);
        }
      }
    };

    recordVisit();

    // 每分钟更新一次访问时长
    const intervalId = setInterval(updateDuration, 60000);

    // 页面关闭或切换时更新最终时长
    const handleBeforeUnload = () => {
      updateDuration();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      updateDuration();
    };
  }, []);
}; 