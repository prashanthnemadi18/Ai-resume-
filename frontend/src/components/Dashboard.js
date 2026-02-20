import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRocket, 
  FaFileAlt, 
  FaChartLine, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaDownload,
  FaEye,
  FaStar,
  FaClock,
  FaSignOutAlt,
  FaUser,
  FaLightbulb,
  FaBullseye,
  FaBook,
  FaSync,
  FaRobot,
  FaChartBar,
  FaPalette,
  FaSave,
  FaPencilAlt,
  FaMagic,
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axios from '../api/axios';
import SimpleBackground from './SimpleBackground';

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalResumes: 0,
    avgAtsScore: 0,
    targetRoles: 0
  });

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/resumes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResumes(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (resumeList) => {
    const total = resumeList.length;
    const avgScore = total > 0 
      ? Math.round(resumeList.reduce((sum, r) => sum + (r.atsScore || 0), 0) / total)
      : 0;
    const roles = new Set(resumeList.map(r => r.targetRole)).size;
    
    setStats({
      totalResumes: total,
      avgAtsScore: avgScore,
      targetRoles: roles
    });
  };

  const handleCreateResume = () => {
    navigate('/resume-builder');
  };

  const handleDeleteResume = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/resumes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchResumes();
      } catch (error) {
        console.error('Error deleting resume:', error);
      }
    }
  };

  const handleViewResume = (resume) => {
    // Navigate to resume builder in view mode
    navigate(`/resume-builder/${resume.id}`, { state: { viewMode: true } });
  };

  const handleDownloadResume = async (resume) => {
    try {
      const doc = new jsPDF();
      const personalInfo = resume.personalInfo || {};
      const education = resume.education || [];
      const experience = resume.experience || [];
      const skills = resume.skills || [];
      const projects = resume.projects || [];
      const certifications = resume.certifications || [];
      const achievements = resume.achievements || [];
      
      let yPos = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      
      // Helper function to check if we need a new page
      const checkPageBreak = (requiredSpace) => {
        if (yPos + requiredSpace > pageHeight - 20) {
          doc.addPage();
          yPos = 20;
          return true;
        }
        return false;
      };
      
      // Helper function to add bullet points
      const addBulletPoint = (text, indent = 0) => {
        const bulletX = margin + indent;
        const textX = bulletX + 5;
        const maxWidth = contentWidth - indent - 5;
        
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        doc.text('•', bulletX, yPos);
        
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, textX, yPos);
        yPos += lines.length * 4.5;
      };
      
      // ==================== HEADER - NAME ====================
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'bold');
      const name = personalInfo.fullName || 'YOUR NAME';
      const nameWidth = doc.getTextWidth(name);
      doc.text(name, (pageWidth - nameWidth) / 2, yPos);
      yPos += 8;
      
      // ==================== CONTACT INFO ====================
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.setFont(undefined, 'normal');
      
      let contactParts = [];
      if (personalInfo.email) contactParts.push(personalInfo.email);
      if (personalInfo.phone) contactParts.push(personalInfo.phone);
      if (personalInfo.location) contactParts.push(personalInfo.location);
      
      if (contactParts.length > 0) {
        const contactLine1 = contactParts.join(' | ');
        const contactWidth1 = doc.getTextWidth(contactLine1);
        doc.text(contactLine1, (pageWidth - contactWidth1) / 2, yPos);
        yPos += 4;
      }
      
      let linkParts = [];
      if (personalInfo.linkedin) linkParts.push(personalInfo.linkedin);
      if (personalInfo.github) linkParts.push(personalInfo.github);
      if (personalInfo.portfolio) linkParts.push(personalInfo.portfolio);
      
      if (linkParts.length > 0) {
        const contactLine2 = linkParts.join(' | ');
        const contactWidth2 = doc.getTextWidth(contactLine2);
        doc.text(contactLine2, (pageWidth - contactWidth2) / 2, yPos);
        yPos += 4;
      }
      
      yPos += 3;
      
      // Horizontal line
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 6;
      
      // ==================== PROFESSIONAL SUMMARY ====================
      if (resume.summary) {
        checkPageBreak(30);
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text('PROFESSIONAL SUMMARY', margin, yPos);
        yPos += 6;
        
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        doc.setFont(undefined, 'normal');
        
        // Split summary into sentences for bullet points
        const sentences = resume.summary.split(/[.!?]+/).filter(s => s.trim().length > 0);
        sentences.forEach(sentence => {
          if (sentence.trim()) {
            checkPageBreak(10);
            addBulletPoint(sentence.trim() + '.');
          }
        });
        yPos += 3;
      }
      
      // ==================== SKILLS ====================
      if (skills.length > 0) {
        checkPageBreak(30);
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text('SKILLS', margin, yPos);
        yPos += 6;
        
        // Group skills by category if possible, otherwise show as list
        const skillCategories = {
          'Programming Languages': [],
          'Frontend Technologies': [],
          'Backend Technologies': [],
          'Databases': [],
          'Tools & Technologies': []
        };
        
        // Try to categorize skills (simple keyword matching)
        skills.forEach(skill => {
          const skillLower = skill.toLowerCase();
          if (skillLower.match(/python|java|javascript|c\+\+|c#|ruby|php|go|rust|kotlin|swift/)) {
            skillCategories['Programming Languages'].push(skill);
          } else if (skillLower.match(/react|angular|vue|html|css|bootstrap|tailwind|jquery/)) {
            skillCategories['Frontend Technologies'].push(skill);
          } else if (skillLower.match(/node|express|spring|django|flask|laravel|rails/)) {
            skillCategories['Backend Technologies'].push(skill);
          } else if (skillLower.match(/mysql|mongodb|postgresql|redis|oracle|sql/)) {
            skillCategories['Databases'].push(skill);
          } else {
            skillCategories['Tools & Technologies'].push(skill);
          }
        });
        
        // Display categorized skills
        Object.entries(skillCategories).forEach(([category, categorySkills]) => {
          if (categorySkills.length > 0) {
            checkPageBreak(10);
            doc.setFontSize(9);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text(`${category}:`, margin + 3, yPos);
            yPos += 4.5;
            
            doc.setFont(undefined, 'normal');
            doc.setTextColor(60, 60, 60);
            const skillText = categorySkills.join(', ');
            const skillLines = doc.splitTextToSize(skillText, contentWidth - 6);
            doc.text(skillLines, margin + 6, yPos);
            yPos += skillLines.length * 4.5 + 2;
          }
        });
        yPos += 3;
      }
      
      // ==================== EDUCATION ====================
      if (education.length > 0) {
        checkPageBreak(30);
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text('EDUCATION', margin, yPos);
        yPos += 6;
        
        education.forEach((edu, index) => {
          checkPageBreak(20);
          
          // Degree and Date on same line
          doc.setFontSize(10);
          doc.setFont(undefined, 'bold');
          doc.setTextColor(0, 0, 0);
          const degree = edu.degree || 'Degree';
          doc.text(degree, margin + 3, yPos);
          
          if (edu.graduationDate) {
            doc.setFont(undefined, 'normal');
            doc.setTextColor(60, 60, 60);
            const dateText = edu.graduationDate;
            const dateWidth = doc.getTextWidth(dateText);
            doc.text(dateText, pageWidth - margin - dateWidth, yPos);
          }
          yPos += 5;
          
          // Institution
          doc.setFontSize(9);
          doc.setFont(undefined, 'italic');
          doc.setTextColor(60, 60, 60);
          doc.text(edu.institution || 'Institution', margin + 3, yPos);
          yPos += 4;
          
          // GPA if available
          if (edu.gpa) {
            doc.setFont(undefined, 'normal');
            doc.text(`GPA: ${edu.gpa}`, margin + 3, yPos);
            yPos += 4;
          }
          
          yPos += 3;
        });
        yPos += 2;
      }
      
      // ==================== WORK EXPERIENCE ====================
      if (experience.length > 0) {
        checkPageBreak(30);
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text('WORK EXPERIENCE', margin, yPos);
        yPos += 6;
        
        experience.forEach((exp) => {
          checkPageBreak(25);
          
          // Position and Date
          doc.setFontSize(10);
          doc.setFont(undefined, 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text(exp.position || 'Position', margin + 3, yPos);
          
          const dateText = `${exp.startDate || ''} - ${exp.endDate || 'Present'}`;
          doc.setFont(undefined, 'normal');
          doc.setTextColor(60, 60, 60);
          const dateWidth = doc.getTextWidth(dateText);
          doc.text(dateText, pageWidth - margin - dateWidth, yPos);
          yPos += 5;
          
          // Company
          doc.setFontSize(9);
          doc.setFont(undefined, 'italic');
          doc.text(exp.company || 'Company', margin + 3, yPos);
          yPos += 5;
          
          // Description as bullet points
          if (exp.description) {
            const descPoints = exp.description.split(/[.!?]+/).filter(s => s.trim().length > 10);
            descPoints.forEach(point => {
              if (point.trim()) {
                checkPageBreak(10);
                addBulletPoint(point.trim() + '.', 3);
              }
            });
          }
          yPos += 3;
        });
        yPos += 2;
      }
      
      // ==================== PROJECTS ====================
      if (projects.length > 0) {
        checkPageBreak(30);
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text('PROJECTS', margin, yPos);
        yPos += 6;
        
        projects.forEach((proj) => {
          checkPageBreak(25);
          
          // Project Name
          doc.setFontSize(10);
          doc.setFont(undefined, 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text(proj.name || 'Project Name', margin + 3, yPos);
          yPos += 5;
          
          // Technologies
          if (proj.technologies) {
            doc.setFontSize(9);
            doc.setFont(undefined, 'italic');
            doc.setTextColor(60, 60, 60);
            const techText = `Technologies: ${proj.technologies}`;
            const techLines = doc.splitTextToSize(techText, contentWidth - 6);
            doc.text(techLines, margin + 3, yPos);
            yPos += techLines.length * 4.5 + 1;
          }
          
          // Description as bullet points
          if (proj.description) {
            const projPoints = proj.description.split(/[.!?]+/).filter(s => s.trim().length > 10);
            projPoints.forEach(point => {
              if (point.trim()) {
                checkPageBreak(10);
                addBulletPoint(point.trim() + '.', 3);
              }
            });
          }
          
          // Project URL if available
          if (proj.url) {
            checkPageBreak(8);
            doc.setFontSize(8);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 255);
            doc.text(`Link: ${proj.url}`, margin + 6, yPos);
            yPos += 4;
          }
          
          yPos += 3;
        });
        yPos += 2;
      }
      
      // ==================== CERTIFICATIONS ====================
      if (certifications && certifications.length > 0) {
        checkPageBreak(30);
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text('CERTIFICATIONS', margin, yPos);
        yPos += 6;
        
        certifications.forEach((cert) => {
          checkPageBreak(10);
          const certText = typeof cert === 'string' ? cert : cert.name || 'Certification';
          addBulletPoint(certText, 3);
        });
        yPos += 3;
      }
      
      // ==================== ACHIEVEMENTS ====================
      if (achievements && achievements.length > 0) {
        checkPageBreak(30);
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text('ACHIEVEMENTS', margin, yPos);
        yPos += 6;
        
        achievements.forEach((achievement) => {
          checkPageBreak(10);
          const achText = typeof achievement === 'string' ? achievement : achievement.title || 'Achievement';
          addBulletPoint(achText, 3);
        });
        yPos += 3;
      }
      
      // Save the PDF
      const fileName = `${resume.name || 'resume'}.pdf`;
      doc.save(fileName);
      
      console.log('Professional PDF downloaded successfully:', fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Simple Background */}
      <SimpleBackground />

      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative bg-black/50 backdrop-blur-xl border-b border-purple-500/30 shadow-lg shadow-purple-500/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-14 h-14 bg-gradient-to-br from-purple-500 to-sky-500 rounded-xl flex items-center justify-center shadow-lg"
              >
                <FaRocket className="text-2xl text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
                  AI Resume Builder
                </h1>
                <p className="text-sm text-gray-400">Welcome back!</p>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 px-5 py-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-500/30 shadow-sm"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-10 h-10 bg-gradient-to-br from-purple-500 to-sky-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
                >
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </motion.div>
                <div>
                  <p className="text-sm font-bold text-white">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="px-5 py-3 text-red-600 hover:text-red-700 rounded-xl transition-colors flex items-center space-x-2 font-semibold"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>


      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-sky-600 rounded-3xl p-8 mb-8 relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center space-x-3">
                <span>Welcome back, {user?.name || 'User'}!</span>
                <motion.div
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  👋
                </motion.div>
              </h2>
              <p className="text-purple-100 text-lg">
                Ready to create your next amazing resume? Let's get started!
              </p>
            </div>
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="hidden md:block"
            >
              <FaRocket className="text-white text-6xl opacity-20" />
            </motion.div>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full"
          />
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: <FaFileAlt className="text-3xl" />,
              label: "Total Resumes",
              value: stats.totalResumes,
              color: "from-purple-500 to-purple-600",
              bgColor: "from-purple-50 to-purple-100"
            },
            {
              icon: <FaChartLine className="text-3xl" />,
              label: "Avg ATS Score",
              value: `${stats.avgAtsScore}%`,
              color: "from-sky-500 to-sky-600",
              bgColor: "from-sky-50 to-sky-100"
            },
            {
              icon: <FaStar className="text-3xl" />,
              label: "Target Roles",
              value: stats.targetRoles,
              color: "from-purple-500 to-sky-500",
              bgColor: "from-purple-50 to-sky-100"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 shadow-lg hover:shadow-xl hover:border-purple-400/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                  <motion.p 
                    className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}
                >
                  {stat.icon}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Tips & Features Section */}
        {resumes.length === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Quick Tips */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30"
            >
              <div className="flex items-center space-x-3 mb-4">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center"
                >
                  <FaLightbulb className="text-white text-xl" />
                </motion.div>
                <h3 className="text-xl font-bold text-white">Quick Tips</h3>
              </div>
              <div className="space-y-3">
                {[
                  { icon: FaMagic, text: "Use AI to generate professional summaries instantly", color: "from-purple-400 to-pink-500" },
                  { icon: FaBullseye, text: "Aim for 80%+ ATS score for better job matches", color: "from-green-400 to-emerald-500" },
                  { icon: FaBook, text: "Keep your resume to 1-2 pages maximum", color: "from-blue-400 to-cyan-500" },
                  { icon: FaSync, text: "Update your resume regularly with new skills", color: "from-orange-400 to-red-500" }
                ].map((tip, index) => {
                  const IconComponent = tip.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 5, scale: 1.02 }}
                      className="flex items-start space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer group"
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className={`w-8 h-8 bg-gradient-to-br ${tip.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}
                      >
                        <IconComponent className="text-white text-sm" />
                      </motion.div>
                      <p className="text-gray-300 text-sm group-hover:text-white transition-colors">{tip.text}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Features Highlight */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30"
            >
              <div className="flex items-center space-x-3 mb-4">
                <motion.div 
                  animate={{ 
                    y: [0, -5, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 h-10 bg-gradient-to-br from-sky-500 to-purple-500 rounded-xl flex items-center justify-center"
                >
                  <FaRocket className="text-white text-xl" />
                </motion.div>
                <h3 className="text-xl font-bold text-white">Features</h3>
              </div>
              <div className="space-y-3">
                {[
                  { icon: FaRobot, title: "AI-Powered", desc: "Generate content with Gemini AI", color: "from-purple-400 to-indigo-500" },
                  { icon: FaChartBar, title: "ATS Optimization", desc: "Real-time score tracking", color: "from-green-400 to-teal-500" },
                  { icon: FaPalette, title: "Multiple Templates", desc: "Professional designs", color: "from-pink-400 to-rose-500" },
                  { icon: FaSave, title: "Auto-Save", desc: "Never lose your progress", color: "from-blue-400 to-sky-500" }
                ].map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: -5, scale: 1.02 }}
                      className="flex items-start space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}
                      >
                        <IconComponent className="text-white text-lg" />
                      </motion.div>
                      <div>
                        <h4 className="text-white font-semibold text-sm group-hover:text-purple-300 transition-colors">{feature.title}</h4>
                        <p className="text-gray-400 text-xs">{feature.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}

        {/* How to Get Started Section */}
        {resumes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-500/10 to-sky-500/10 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 mb-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              How to Create Your Perfect Resume
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: "1", icon: FaPencilAlt, title: "Fill Details", desc: "Add your personal information and experience", color: "from-purple-500 to-indigo-600" },
                { step: "2", icon: FaRobot, title: "Use AI", desc: "Generate professional summaries with AI", color: "from-blue-500 to-cyan-600" },
                { step: "3", icon: FaBullseye, title: "Optimize", desc: "Check and improve your ATS score", color: "from-green-500 to-emerald-600" },
                { step: "4", icon: FaDownload, title: "Download", desc: "Export as PDF and start applying", color: "from-pink-500 to-rose-600" }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className="text-center group cursor-pointer"
                  >
                    <div className="relative mb-4">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl`}
                      >
                        <IconComponent className="text-white text-3xl" />
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                        className="absolute -top-2 -right-2 w-10 h-10 bg-white text-purple-600 rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-4 border-purple-900"
                      >
                        {item.step}
                      </motion.div>
                    </div>
                    <h4 className="text-white font-bold mb-2 group-hover:text-purple-300 transition-colors">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                    <motion.div
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      className="h-1 bg-gradient-to-r from-purple-500 to-sky-500 rounded-full mx-auto mt-3"
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Resumes Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-purple-500/30 p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Your Resumes</h2>
              <p className="text-gray-400">Manage and create your professional resumes</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateResume}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-sky-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold flex items-center space-x-2"
            >
              <FaPlus />
              <span>Create New Resume</span>
            </motion.button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full"
              />
            </div>
          ) : resumes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-sky-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <FaFileAlt className="text-5xl text-purple-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">No resumes yet</h3>
              <p className="text-gray-400 mb-6">Create your first resume to get started!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateResume}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-sky-600 text-white rounded-xl shadow-lg font-semibold"
              >
                Create Your First Resume
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {resumes.map((resume, index) => (
                  <motion.div
                    key={resume.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 shadow-lg hover:shadow-2xl hover:border-purple-400/50 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-sky-400 transition-all">
                          {resume.targetRole || 'Untitled Resume'}
                        </h3>
                        <p className="text-sm text-gray-400 flex items-center space-x-2">
                          <FaClock className="text-purple-400" />
                          <span>{new Date(resume.updatedAt).toLocaleDateString()}</span>
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          resume.atsScore >= 80 ? 'bg-green-100 text-green-700' :
                          resume.atsScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {resume.atsScore || 0}%
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {resume.experienceLevel} • {resume.template || 'Modern'} Template
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/resume-builder/${resume.id}`)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-sky-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                      >
                        <FaEdit />
                        <span>Edit</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleViewResume(resume)}
                        className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all"
                        title="View Resume"
                      >
                        <FaEye />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDownloadResume(resume)}
                        className="px-4 py-2 bg-sky-500/20 text-sky-400 rounded-lg hover:bg-sky-500/30 transition-all"
                        title="Download Resume"
                      >
                        <FaDownload />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteResume(resume.id)}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                      >
                        <FaTrash />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Additional Info Section - Only show when user has resumes */}
        {resumes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Pro Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30"
            >
              <div className="flex items-center space-x-2 mb-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center"
                >
                  <FaLightbulb className="text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-white">Pro Tip</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Tailor your resume for each job application by adjusting keywords to match the job description. This improves your ATS score!
              </p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30"
            >
              <div className="flex items-center space-x-2 mb-4">
                <motion.div
                  animate={{ 
                    y: [0, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center"
                >
                  <FaChartLine className="text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-white">Your Progress</h3>
              </div>
              <p className="text-gray-300 text-sm">
                You've created {stats.totalResumes} resume{stats.totalResumes !== 1 ? 's' : ''} with an average ATS score of {stats.avgAtsScore}%. Keep improving!
              </p>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30"
            >
              <div className="flex items-center space-x-2 mb-4">
                <motion.div
                  animate={{ 
                    rotate: [0, 360]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center"
                >
                  <FaBullseye className="text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-white">Next Steps</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Review your resumes regularly and update them with new skills and experiences to stay competitive.
              </p>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
