import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function AnimatedBackground({ variant = 'default' }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate more particles
  const particles = Array.from({ length: 50 }, (_, i) => i);
  const floatingShapes = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dark Base Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
      
      {/* Animated Gradient Overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.4) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 60% 70%, rgba(124, 58, 237, 0.4) 0%, transparent 50%), radial-gradient(circle at 30% 30%, rgba(236, 72, 153, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.4) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.4) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.4) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Mesh Gradient Overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(124, 58, 237, 0.3), transparent 50%)`,
        }}
      />

      {/* Large Glowing Orbs */}
      <motion.div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.6), rgba(167, 139, 250, 0.3), transparent)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, 150, 0],
          y: [0, 200, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute top-1/4 -right-40 w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.6), rgba(244, 114, 182, 0.3), transparent)',
          filter: 'blur(90px)',
        }}
        animate={{
          x: [0, -150, 0],
          y: [0, 150, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-0 left-1/3 w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5), rgba(96, 165, 250, 0.3), transparent)',
          filter: 'blur(100px)',
        }}
        animate={{
          x: [0, 200, 0],
          y: [0, -150, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4), rgba(192, 132, 252, 0.2), transparent)',
          filter: 'blur(70px)',
        }}
        animate={{
          x: [-100, 100, -100],
          y: [-100, 100, -100],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating Geometric Shapes with Glow */}
      {floatingShapes.map((i) => (
        <motion.div
          key={`shape-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${60 + Math.random() * 120}px`,
            height: `${60 + Math.random() * 120}px`,
          }}
          animate={{
            x: [0, Math.random() * 300 - 150, 0],
            y: [0, Math.random() * 300 - 150, 0],
            rotate: [0, 360],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 20 + Math.random() * 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        >
          {i % 3 === 0 ? (
            <div className="w-full h-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-3xl backdrop-blur-sm shadow-2xl shadow-purple-500/50" 
                 style={{ transform: 'rotate(45deg)' }} />
          ) : i % 3 === 1 ? (
            <div className="w-full h-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full backdrop-blur-sm shadow-2xl shadow-blue-500/50" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 backdrop-blur-sm shadow-2xl shadow-indigo-500/50"
                 style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
          )}
        </motion.div>
      ))}

      {/* Glowing Particles */}
      {particles.map((i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${3 + Math.random() * 6}px`,
            height: `${3 + Math.random() * 6}px`,
            background: i % 4 === 0 
              ? '#7C3AED' 
              : i % 4 === 1
              ? '#EC4899'
              : i % 4 === 2
              ? '#3B82F6'
              : '#A855F7',
            boxShadow: i % 4 === 0 
              ? '0 0 20px #7C3AED, 0 0 40px #7C3AED' 
              : i % 4 === 1
              ? '0 0 20px #EC4899, 0 0 40px #EC4899'
              : i % 4 === 2
              ? '0 0 20px #3B82F6, 0 0 40px #3B82F6'
              : '0 0 20px #A855F7, 0 0 40px #A855F7',
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Animated Grid Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <motion.path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="0.5"
              animate={{
                strokeDashoffset: [0, 100],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </pattern>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Glowing Lines */}
      <motion.div
        className="absolute top-0 left-0 w-full h-0.5"
        style={{
          background: 'linear-gradient(90deg, transparent, #7C3AED, #EC4899, #3B82F6, transparent)',
          boxShadow: '0 0 20px #7C3AED',
        }}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <motion.div
        className="absolute bottom-0 left-0 w-full h-0.5"
        style={{
          background: 'linear-gradient(90deg, transparent, #3B82F6, #EC4899, #7C3AED, transparent)',
          boxShadow: '0 0 20px #3B82F6',
        }}
        animate={{
          x: ['100%', '-100%'],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <motion.div
        className="absolute left-0 top-0 w-0.5 h-full"
        style={{
          background: 'linear-gradient(180deg, transparent, #EC4899, #A855F7, transparent)',
          boxShadow: '0 0 20px #EC4899',
        }}
        animate={{
          y: ['-100%', '100%'],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <motion.div
        className="absolute right-0 top-0 w-0.5 h-full"
        style={{
          background: 'linear-gradient(180deg, transparent, #A855F7, #EC4899, transparent)',
          boxShadow: '0 0 20px #A855F7',
        }}
        animate={{
          y: ['100%', '-100%'],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Radial Pulse Effect */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          border: '2px solid rgba(124, 58, 237, 0.3)',
        }}
        animate={{
          scale: [1, 3, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />
    </div>
  );
}

export default AnimatedBackground;
