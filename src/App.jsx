import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Scene from './components/Background/Scene'
import Navbar from './components/UI/Navbar'
import Hero from './components/Sections/Hero'
import About from './components/Sections/About'
import Experience from './components/Experience/Experience'
import Skills from './components/Sections/Skills'
import Contact from './components/Sections/Contact'
import Works from './components/Sections/Works'
import Education from './components/Sections/Education'
import { useVisitTracker } from './hooks/useVisitTracker'

const Dashboard = lazy(() => import('./components/Admin/Dashboard'))
const ProjectDetail = lazy(() => import('./components/Projects/ProjectDetail'))

const RouteScrollManager = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView())
      return
    }
    window.scrollTo({ top: 0, left: 0 })
  }, [pathname, hash])

  return null
}

function App() {
  useVisitTracker()

  return (
    <BrowserRouter>
      <RouteScrollManager />
      <Routes>
        <Route
          path="/"
          element={
            <main className="relative min-h-screen w-full">
              <Scene />
              <div className="relative z-10">
                <Navbar />
                <Hero />
                <About />
                <Experience />
                <Education />
                <Works />
                <Skills />
                <Contact />
              </div>
            </main>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <Suspense fallback={<div className="min-h-screen bg-[#09070d]" />}>
              <ProjectDetail />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<div className="min-h-screen bg-[#030108]" />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
