import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Scene from '../Background/Scene';
import ProjectNav from './ProjectNav';
import { projects } from '@/data/projects';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageSizes, setImageSizes] = useState({});

  useEffect(() => {
    const project = projects.find(p => p.id === parseInt(id));
    if (!project) {
      navigate('/'); // 如果找不到项目，返回首页
      return;
    }
    setSelectedProject(project);
  }, [id, navigate]);

  useEffect(() => {
    if (selectedProject) {
      // 预加载图片并获取尺寸
      selectedProject.images.forEach((src, index) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          setImageSizes(prev => ({
            ...prev,
            [index]: {
              width: img.width,
              height: img.height,
              aspect: img.width / img.height
            }
          }));
        };
      });
    }
  }, [selectedProject]);

  // 根据图片尺寸决定布局类
  const getGridClass = (aspect, index) => {
    if (!aspect) return "col-span-1";
    
    if (aspect > 1.5) return "col-span-2"; // 宽图
    if (aspect < 0.7) return "row-span-2"; // 高图
    return "col-span-1"; // 正常比例
  };

  if (!selectedProject) return null;

  return (
    <div className="min-h-screen relative">
      <Scene />
      <div className="absolute inset-0 z-10">
        <ProjectNav 
          projects={projects} 
          currentId={parseInt(id)}
          onSelect={(projectId) => navigate(`/works/${projectId}`)}
        />
        
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-black/50 backdrop-blur-md rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold text-white">
                {selectedProject.title}
              </h1>
              <button
                onClick={() => window.history.back()}
                className="text-white hover:text-purple-400 transition-colors"
              >
                返回
              </button>
            </div>

            {/* 自适应图片网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[200px] gap-4 mb-8">
              {selectedProject.images.map((image, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={`relative cursor-pointer overflow-hidden rounded-lg ${getGridClass(imageSizes[index]?.aspect, index)}`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt={`${selectedProject.title} - ${index + 1}`}
                    className={`w-full h-full object-cover transition-transform duration-300 hover:scale-110 ${
                      imageSizes[index]?.width < 600 ? 'object-contain bg-black/30' : 'object-cover'
                    }`}
                    style={{
                      viewTransitionName: index === 0 ? 'selected-work-media' : undefined,
                      maxWidth: imageSizes[index]?.width < 600 ? imageSizes[index]?.width : '100%',
                      margin: imageSizes[index]?.width < 600 ? 'auto' : undefined
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* 项目描述 */}
            <div className="text-white space-y-4">
              <p className="text-lg leading-relaxed">
                {selectedProject.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedProject.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-500/30 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <a
                href={selectedProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 px-6 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
              >
                访问项目
              </a>
            </div>
          </motion.div>
        </div>

        {/* 改进的图片预览模态框 */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <img
                src={selectedImage}
                alt="Preview"
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                style={{
                  maxWidth: imageSizes[selectedImage]?.width < 600 
                    ? imageSizes[selectedImage]?.width 
                    : '100%'
                }}
              />
              <button
                className="absolute top-4 right-4 text-white hover:text-purple-400"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail; 
