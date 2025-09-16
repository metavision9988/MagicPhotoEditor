'use client';

import { useState, useCallback } from 'react';
import { Upload, Wand2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload logic here
      console.log('File dropped:', e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Handle file upload logic here
      console.log('File selected:', e.target.files[0]);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="relative z-20 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Wand2 className="h-8 w-8 text-primary-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Magic Photo Editor
            </h1>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <button className="btn-ghost">About</button>
            <button className="btn-outline">Sign In</button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              AI-Powered Photo Editing
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Remove objects, replace backgrounds, and enhance your photos with cutting-edge AI technology. 
              Professional results in seconds, not hours.
            </p>
          </motion.div>

          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div
              className={`drop-zone max-w-2xl mx-auto p-12 text-center cursor-pointer transition-all duration-300 ${
                dragActive ? 'active' : ''
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileInput}
              />
              
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-full bg-primary-500/10 border border-primary-400/20">
                  <Upload className="h-12 w-12 text-primary-400" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Drop your image here
                  </h3>
                  <p className="text-gray-400">
                    or click to browse • Supports JPEG, PNG, WebP • Max 50MB
                  </p>
                </div>
                
                <button className="btn-primary mt-4">
                  Select Image
                </button>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="glass-card text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary-500/10 border border-primary-400/20">
                  <Sparkles className="h-8 w-8 text-primary-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Object Removal
              </h3>
              <p className="text-gray-400 text-sm">
                Intelligently detect and remove unwanted objects with AI-powered precision
              </p>
            </div>

            <div className="glass-card text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-secondary-500/10 border border-secondary-400/20">
                  <ImageIcon className="h-8 w-8 text-secondary-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Background Replace
              </h3>
              <p className="text-gray-400 text-sm">
                Seamlessly replace backgrounds while preserving natural lighting and shadows
              </p>
            </div>

            <div className="glass-card text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-accent-500/10 border border-accent-400/20">
                  <Wand2 className="h-8 w-8 text-accent-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Smart Enhancement
              </h3>
              <p className="text-gray-400 text-sm">
                Automatically enhance colors, contrast, and sharpness for professional results
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 p-6 text-center text-gray-400 text-sm">
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-6">
          <p>© 2024 Magic Photo Editor. Powered by MediaPipe AI.</p>
        </div>
      </footer>
    </div>
  );
}