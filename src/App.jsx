import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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

function App() {
  useVisitTracker()

  return (
    <BrowserRouter>
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
