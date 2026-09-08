import { motion } from 'framer-motion';

const ProjectNav = ({ projects, currentId, onSelect }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-20 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => window.history.back()}
            className="text-white hover:text-purple-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          <div className="flex items-center space-x-6 overflow-x-auto py-2">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => onSelect(project.id)}
                className={`text-sm font-medium relative ${
                  project.id === currentId ? 'text-purple-400' : 'text-white hover:text-purple-400'
                }`}
              >
                {project.title}
                {project.id === currentId && (
                  <motion.div
                    layoutId="activeProject"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-400"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ProjectNav; 