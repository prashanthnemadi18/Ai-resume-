import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiSave, 
  FiArrowLeft, 
  FiZap,
  FiUser,
  FiBriefcase,
  FiTarget
} from 'react-icons/fi';
import axios from '../api/axios';
import { 
  SkillsSection, 
  EducationSection, 
  ExperienceSection, 
  ProjectsSection, 
  CertificationsSection, 
  AchievementsSection 
} from './ResumeSections';
import SimpleBackground from './SimpleBackground';

function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchResume();
    } else {
      // Initialize new resume
      setResume({
        name: 'My Resume',
        personalInfo: { name: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '' },
        summary: '',
        skills: { programmingLanguages: [], frameworks: [], databases: [], tools: [], softSkills: [] },
        education: [],
        experience: [],
        projects: [],
        certifications: [],
        achievements: [],
        targetRole: '',
        experienceLevel: 'Entry-Level',
        template: 'Modern',
        atsOptimized: true,
        atsScore: 0
      });
      setLoading(false);
    }
  }, [id]);

  const fetchResume = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/resume/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Map backend 'summary' to frontend 'professionalSummary' for compatibility
      const resumeData = {
        ...response.data,
        professionalSummary: response.data.summary || ''
      };
      setResume(resumeData);
      setError('');
    } catch (err) {
      console.error('Error loading resume:', err);
      setError('Failed to load resume');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      
      // Prepare data for backend - map professionalSummary to summary
      const saveData = {
        ...resume,
        summary: resume.professionalSummary || resume.summary || '',
        name: resume.name || `${resume.personalInfo?.name || 'My'} Resume`
      };
      
      // Remove professionalSummary as backend uses 'summary'
      delete saveData.professionalSummary;
      
      if (id) {
        await axios.put(`/resume/${id}`, saveData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Resume updated successfully!');
      } else {
        const response = await axios.post('/resume', saveData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Resume created successfully!');
        navigate(`/resume-builder/${response.data.id}`);
      }
    } catch (err) {
      console.error('Error saving resume:', err);
      console.error('Error details:', err.response?.data);
      setError('Failed to save resume');
      alert('Failed to save resume: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateResume = async () => {
    try {
      // First save the resume
      await handleSave();
      
      // Then show success message
      alert('Resume saved successfully! You can view it in the dashboard.');
      
      // Navigate back to dashboard to see the resume
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Error in handleGenerateResume:', error);
      // Error already handled in handleSave
    }
  };

  const handleGenerateSummary = async () => {
    // Validate that we have some data to generate from
    if (!resume.targetRole || resume.targetRole.trim() === '') {
      alert('Please set a Target Role in the ATS Score section first!');
      return;
    }

    setAiLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Prepare data - ensure we have valid objects even if empty
      const requestData = {
        promptType: 'summary',
        data: {
          skills: resume.skills || { 
            programmingLanguages: [], 
            frameworks: [], 
            databases: [], 
            tools: [], 
            softSkills: [] 
          },
          experience: resume.experience || [],
          education: resume.education || [],
          projects: resume.projects || []
        },
        targetRole: resume.targetRole || 'Software Developer',
        experienceLevel: resume.experienceLevel || 'Entry-Level'
      };

      console.log('Sending AI request:', requestData);

      const response = await axios.post('/ai/generate', requestData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.content) {
        setResume({ ...resume, professionalSummary: response.data.content });
        alert('Professional summary generated successfully!');
      } else if (response.data.error) {
        alert('Error: ' + response.data.error);
      }
    } catch (err) {
      console.error('Error generating summary:', err);
      console.error('Error response:', err.response?.data);
      
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to generate summary. Please check if the backend is running.';
      alert(errorMessage);
    } finally {
      setAiLoading(false);
    }
  };

  const updateField = (section, field, value) => {
    setResume({
      ...resume,
      [section]: {
        ...resume[section],
        [field]: value
      }
    });
  };

  const addArrayItem = (section, item) => {
    setResume({
      ...resume,
      [section]: [...(resume[section] || []), item]
    });
  };

  const updateArrayItem = (section, index, field, value) => {
    const updated = [...resume[section]];
    updated[index] = { ...updated[index], [field]: value };
    setResume({ ...resume, [section]: updated });
  };

  const removeArrayItem = (section, index) => {
    setResume({
      ...resume,
      [section]: resume[section].filter((_, i) => i !== index)
    });
  };

  const addSkill = (category, skill) => {
    if (skill.trim()) {
      setResume({
        ...resume,
        skills: {
          ...resume.skills,
          [category]: [...(resume.skills[category] || []), skill.trim()]
        }
      });
    }
  };

  const removeSkill = (category, index) => {
    setResume({
      ...resume,
      skills: {
        ...resume.skills,
        [category]: resume.skills[category].filter((_, i) => i !== index)
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <SimpleBackground />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full relative z-10"
        />
      </div>
    );
  }

  if (error && !resume) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <SimpleBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-red-500/50 max-w-md relative z-10"
        >
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-sky-600 text-white rounded-xl font-semibold"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Simple Background */}
      <SimpleBackground />

      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative bg-black/50 backdrop-blur-xl border-b border-purple-500/30 shadow-lg shadow-purple-500/20 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 px-4 py-2 text-purple-600 hover:text-purple-700 font-semibold rounded-xl hover:bg-purple-50 transition-all"
              >
                <FiArrowLeft />
                <span>Back</span>
              </motion.button>
              <div className="h-8 w-px bg-purple-200" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
                  {id ? 'Edit Resume' : 'Create Resume'}
                </h1>
                <p className="text-sm text-gray-400">Build your professional resume</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 rounded-xl font-semibold flex items-center space-x-2 disabled:opacity-50 transition-all"
              >
                {saving ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <FiSave />
                    <span>Save</span>
                  </>
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerateResume}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-sky-600 text-white rounded-xl shadow-lg font-semibold flex items-center space-x-2"
              >
                <FiZap />
                <span>Generate Resume</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - ATS Score */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-28">
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30 shadow-xl"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                  <FiTarget className="text-purple-400" />
                  <span>ATS Score</span>
                </h3>
                
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <svg className="transform -rotate-90 w-40 h-40">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-purple-100"
                    />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="transparent"
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 440 }}
                      animate={{ 
                        strokeDashoffset: 440 - (440 * (resume?.atsScore || 0)) / 100,
                        strokeDasharray: 440
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7C3AED" />
                        <stop offset="100%" stopColor="#0284C7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-sky-600 bg-clip-text text-transparent"
                      >
                        {resume?.atsScore || 0}%
                      </motion.div>
                      <p className="text-xs text-gray-600">Score</p>
                    </div>
                  </div>
                </div>

                <div className={`px-4 py-2 rounded-xl text-center font-semibold ${
                  (resume?.atsScore || 0) >= 80 ? 'bg-green-500/20 text-green-400' :
                  (resume?.atsScore || 0) >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {(resume?.atsScore || 0) >= 80 ? 'Excellent' :
                   (resume?.atsScore || 0) >= 60 ? 'Good' : 'Needs Improvement'}
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">Target Role</label>
                    <input
                      type="text"
                      value={resume?.targetRole || ''}
                      onChange={(e) => setResume({ ...resume, targetRole: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white/10 border-2 border-purple-500/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">Experience Level</label>
                    <select
                      value={resume?.experienceLevel || 'Entry-Level'}
                      onChange={(e) => setResume({ ...resume, experienceLevel: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white/10 border-2 border-purple-500/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none"
                    >
                      <option value="Entry-Level" className="bg-gray-900">Entry-Level</option>
                      <option value="Mid-Level" className="bg-gray-900">Mid-Level</option>
                      <option value="Senior" className="bg-gray-900">Senior</option>
                      <option value="Lead" className="bg-gray-900">Lead</option>
                      <option value="Executive" className="bg-gray-900">Executive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">Template</label>
                    <select
                      value={resume?.template || 'Modern'}
                      onChange={(e) => setResume({ ...resume, template: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white/10 border-2 border-purple-500/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none"
                    >
                      <option value="Modern" className="bg-gray-900">Modern</option>
                      <option value="Classic" className="bg-gray-900">Classic</option>
                      <option value="Minimal" className="bg-gray-900">Minimal</option>
                      <option value="Creative" className="bg-gray-900">Creative</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Form Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Personal Information Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-sky-500 rounded-xl flex items-center justify-center">
                  <FiUser className="text-2xl text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={resume?.personalInfo?.name || ''}
                    onChange={(e) => updateField('personalInfo', 'name', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={resume?.personalInfo?.email || ''}
                    onChange={(e) => updateField('personalInfo', 'email', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={resume?.personalInfo?.phone || ''}
                    onChange={(e) => updateField('personalInfo', 'phone', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={resume?.personalInfo?.location || ''}
                    onChange={(e) => updateField('personalInfo', 'location', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                    placeholder="City, State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    value={resume?.personalInfo?.linkedin || ''}
                    onChange={(e) => updateField('personalInfo', 'linkedin', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={resume?.personalInfo?.github || ''}
                    onChange={(e) => updateField('personalInfo', 'github', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                    placeholder="https://github.com/johndoe"
                  />
                </div>
              </div>
            </motion.div>

            {/* Professional Summary Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-sky-500 rounded-xl flex items-center justify-center">
                    <FiBriefcase className="text-2xl text-white" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
                    Professional Summary
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerateSummary}
                  disabled={aiLoading}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-sky-600 text-white rounded-xl font-semibold flex items-center space-x-2 disabled:opacity-50"
                >
                  {aiLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <FiZap />
                      <span>AI Generate</span>
                    </>
                  )}
                </motion.button>
              </div>

              <textarea
                value={resume?.professionalSummary || ''}
                onChange={(e) => setResume({ ...resume, professionalSummary: e.target.value })}
                rows="6"
                className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none resize-none placeholder-gray-500"
                placeholder="Write a compelling professional summary or click 'AI Generate'..."
              />
            </motion.div>

            {/* Skills Section */}
            <SkillsSection resume={resume} addSkill={addSkill} removeSkill={removeSkill} />

            {/* Education Section */}
            <EducationSection resume={resume} addArrayItem={addArrayItem} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} />

            {/* Experience Section */}
            <ExperienceSection resume={resume} addArrayItem={addArrayItem} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} />

            {/* Projects Section */}
            <ProjectsSection resume={resume} addArrayItem={addArrayItem} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} />

            {/* Certifications Section */}
            <CertificationsSection resume={resume} addArrayItem={addArrayItem} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} />

            {/* Achievements Section */}
            <AchievementsSection resume={resume} addArrayItem={addArrayItem} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default ResumeBuilder;
