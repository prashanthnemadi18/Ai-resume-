import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaRocket, 
  FaBrain, 
  FaChartLine, 
  FaGithub, 
  FaFileAlt, 
  FaMagic,
  FaCheckCircle,
  FaStar,
  FaUsers,
  FaArrowRight,
  FaDownload,
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaCode
} from 'react-icons/fa';
import SimpleBackground from './SimpleBackground';

function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaBrain className="text-4xl" />,
      title: "AI-Powered Content",
      description: "Generate professional summaries with Gemini AI",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: "ATS Optimization",
      description: "Get real-time ATS scores and suggestions",
      color: "from-sky-400 to-sky-600"
    },
    {
      icon: <FaGithub className="text-4xl" />,
      title: "GitHub Integration",
      description: "Import projects from GitHub automatically",
      color: "from-purple-400 to-sky-500"
    },
    {
      icon: <FaFileAlt className="text-4xl" />,
      title: "Multiple Templates",
      description: "Professional, modern designs",
      color: "from-sky-400 to-purple-500"
    },
    {
      icon: <FaMagic className="text-4xl" />,
      title: "Smart Formatting",
      description: "Automatic formatting for readability",
      color: "from-purple-500 to-sky-400"
    },
    {
      icon: <FaRocket className="text-4xl" />,
      title: "One-Click Export",
      description: "Download as PDF instantly",
      color: "from-sky-500 to-purple-600"
    }
  ];

  const stats = [
    { number: "10K+", label: "Resumes Created", icon: <FaFileAlt /> },
    { number: "95%", label: "ATS Pass Rate", icon: <FaCheckCircle /> },
    { number: "4.9/5", label: "User Rating", icon: <FaStar /> },
    { number: "24/7", label: "AI Support", icon: <FaBrain /> }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Sign Up",
      description: "Create your free account",
      icon: <FaUsers className="text-3xl" />,
      color: "from-purple-400 to-purple-600"
    },
    {
      step: "2",
      title: "Fill Details",
      description: "Add your information",
      icon: <FaEdit className="text-3xl" />,
      color: "from-sky-400 to-sky-600"
    },
    {
      step: "3",
      title: "AI Generation",
      description: "Let AI create content",
      icon: <FaBrain className="text-3xl" />,
      color: "from-purple-500 to-sky-500"
    },
    {
      step: "4",
      title: "Download",
      description: "Export and apply",
      icon: <FaDownload className="text-3xl" />,
      color: "from-sky-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Simple Background Component */}
      <SimpleBackground />

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed w-full z-50 bg-black/50 backdrop-blur-xl border-b border-purple-500/30 shadow-lg shadow-purple-500/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-gradient-to-br from-purple-500 to-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50"
              >
                <FaRocket className="text-2xl text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
                AI Resume Builder
              </span>
            </motion.div>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-6 py-3 text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-sky-600 text-white rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-xl transition-all font-semibold"
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>


      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-block mb-6"
              >
                <span className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-sky-500/20 border border-purple-500/50 text-purple-300 rounded-full text-sm font-semibold backdrop-blur-sm shadow-lg shadow-purple-500/20 flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <FaMagic className="text-purple-300" />
                  </motion.div>
                  <span>Powered by Gemini AI</span>
                </span>
              </motion.div>
              
              <motion.h1 
                className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-white">Build Your</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
                  Dream Resume
                </span>
                <br />
                <span className="text-white">in Minutes</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-300 mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Create ATS-optimized resumes with AI-powered content generation. 
                Stand out from the crowd and land your dream job faster.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/signup')}
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-sky-600 text-white rounded-xl shadow-xl shadow-purple-500/50 transition-all text-lg font-semibold flex items-center justify-center gap-2"
                >
                  Start Building Free
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-purple-500/50 text-white rounded-xl hover:border-purple-400 hover:bg-white/20 transition-all text-lg font-semibold"
                >
                  Sign In
                </motion.button>
              </motion.div>

              <motion.div 
                className="mt-10 flex items-center space-x-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.9 + i * 0.1 }}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-sky-400 border-4 border-white shadow-lg"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex text-yellow-400 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + i * 0.1 }}
                      >
                        <FaStar />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">Trusted by 10,000+ users</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Resume Preview */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                }}
                transition={{ duration: 6, repeat: Infinity }}
                className="relative z-10"
              >
                <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/30 p-8 border border-purple-500/30">
                  <div className="space-y-4 text-left">
                    <div className="text-center border-b-2 border-purple-500/50 pb-4">
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">PRASHANTH NEMADI</h3>
                      <p className="text-lg text-purple-400 mt-2 font-semibold">Fullstack Developer</p>
                      <div className="flex justify-center items-center gap-4 text-sm text-gray-300 mt-3">
                        <span className="flex items-center space-x-2 bg-white/5 px-3 py-1 rounded-lg">
                          <FaEnvelope className="text-purple-400" />
                          <span>prashanth@email.com</span>
                        </span>
                        <span className="flex items-center space-x-2 bg-white/5 px-3 py-1 rounded-lg">
                          <FaPhone className="text-purple-400" />
                          <span>+91-XXXXXXXXXX</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-4 border border-purple-500/20">
                      <h4 className="text-base font-bold text-purple-400 mb-3 flex items-center space-x-2">
                        <FaBriefcase className="text-purple-400" />
                        <span>PROFESSIONAL SUMMARY</span>
                      </h4>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        Junior Full Stack Web Developer with strong hands-on experience in building responsive applications using modern technologies. Passionate about creating efficient, scalable solutions...
                      </p>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-4 border border-purple-500/20">
                      <h4 className="text-base font-bold text-purple-400 mb-3 flex items-center space-x-2">
                        <FaCode className="text-purple-400" />
                        <span>TECHNICAL SKILLS</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {['Python', 'Java', 'React', 'Node.js', 'Spring Boot', 'PostgreSQL'].map((skill, i) => (
                          <motion.span
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.1, y: -2 }}
                            className="px-3 py-1.5 bg-gradient-to-r from-purple-500/30 to-sky-500/30 text-purple-300 rounded-lg text-xs font-semibold border border-purple-400/50 shadow-lg"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Floating Badges */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl z-20"
              >
                <div className="flex items-center space-x-2">
                  <FaCheckCircle />
                  <span className="font-bold">ATS: 95%</span>
                </div>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 bg-gradient-to-r from-purple-500 to-sky-500 text-white px-6 py-3 rounded-2xl shadow-xl z-20"
              >
                <div className="flex items-center space-x-2">
                  <FaBrain />
                  <span className="font-bold">AI Powered</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

                        

      {/* Stats Section */}
      <section className="relative py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.1, y: -10 }}
                className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all shadow-lg shadow-purple-500/10 hover:shadow-xl hover:shadow-purple-500/20"
              >
                <div className="text-4xl mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-400">
                  {stat.icon}
                </div>
                <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need to create the perfect resume
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -15, scale: 1.05 }}
                className="group bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-purple-500/30 hover:border-purple-400/50 transition-all shadow-lg shadow-purple-500/10 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div className={`text-transparent bg-clip-text bg-gradient-to-r ${feature.color} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-sky-400 transition-all">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Four simple steps to your perfect resume
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-24 h-24 bg-gradient-to-br ${item.color} rounded-3xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-purple-500/30`}
                >
                  {item.icon}
                </motion.div>
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30`}>
                  <span className="text-3xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 bg-gradient-to-r from-purple-600 to-sky-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Start Building Your Future Today
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Create your professional resume in minutes with AI assistance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.1, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className="px-12 py-4 bg-white text-purple-600 rounded-xl shadow-2xl font-bold text-lg hover:bg-gray-100 transition-all"
              >
                Create Free Account
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-12 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
              >
                Sign In
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black border-t border-purple-500/30 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FaRocket className="text-3xl text-purple-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
              AI Resume Builder
            </span>
          </div>
          <p className="text-gray-400">
            © 2026 AI Resume Builder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
