import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import Dashboard from './components/Admin/Dashboard'

function App() {
  useVisitTracker();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <main className="w-full min-h-screen relative">
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
        } />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App 
