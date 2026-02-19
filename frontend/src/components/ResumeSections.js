import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiTrash2, 
  FiCode,
  FiBook,
  FiBriefcase,
  FiGithub,
  FiAward,
  FiTrendingUp
} from 'react-icons/fi';

// Skills Section Component
export function SkillsSection({ resume, addSkill, removeSkill }) {
  const [newSkill, setNewSkill] = useState({
    programmingLanguages: '',
    frameworks: '',
    databases: '',
    tools: '',
    softSkills: ''
  });

  const skillCategories = [
    { key: 'programmingLanguages', label: 'Programming Languages', icon: FiCode, color: 'purple' },
    { key: 'frameworks', label: 'Frameworks & Libraries', icon: FiCode, color: 'sky' },
    { key: 'databases', label: 'Databases', icon: FiCode, color: 'purple' },
    { key: 'tools', label: 'Tools & Technologies', icon: FiCode, color: 'sky' },
    { key: 'softSkills', label: 'Soft Skills', icon: FiTrendingUp, color: 'purple' }
  ];

  const handleAddSkill = (category) => {
    if (newSkill[category]) {
      addSkill(category, newSkill[category]);
      setNewSkill({ ...newSkill, [category]: '' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-xl"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-sky-500 rounded-xl flex items-center justify-center">
          <FiCode className="text-2xl text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
          Skills
        </h2>
      </div>

      <div className="space-y-6">
        {skillCategories.map((category, idx) => {
          const Icon = category.icon;
          return (
            <div key={category.key} className="space-y-3">
              <label className="block text-sm font-semibold text-gray-300 flex items-center space-x-2">
                <Icon className={`text-${category.color}-400`} />
                <span>{category.label}</span>
              </label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill[category.key]}
                  onChange={(e) => setNewSkill({ ...newSkill, [category.key]: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill(category.key)}
                  className="flex-1 px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                  placeholder={`Add ${category.label.toLowerCase()}...`}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddSkill(category.key)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-sky-600 text-white rounded-xl font-semibold flex items-center space-x-2"
                >
                  <FiPlus />
                  <span>Add</span>
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {resume?.skills?.[category.key]?.map((skill, skillIdx) => (
                    <motion.div
                      key={skillIdx}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500/30 to-sky-500/30 border border-purple-400/50 rounded-xl flex items-center space-x-2 group"
                    >
                      <span className="text-sm font-medium text-purple-300">{skill}</span>
                      <motion.button
                        whileHover={{ scale: 1.2, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeSkill(category.key, skillIdx)}
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiTrash2 size={14} />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}


// Education Section Component
export function EducationSection({ resume, addArrayItem, updateArrayItem, removeArrayItem }) {
  const addEducation = () => {
    addArrayItem('education', {
      degree: '',
      school: '',
      location: '',
      startDate: '',
      endDate: '',
      cgpa: '',
      description: ''
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-sky-500 rounded-xl flex items-center justify-center">
            <FiBook className="text-2xl text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
            Education
          </h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          onClick={addEducation}
          className="px-4 py-2 border-2 border-dashed border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 text-purple-400 rounded-xl font-semibold flex items-center space-x-2 transition-all"
        >
          <FiPlus />
          <span>Add Education</span>
        </motion.button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {resume?.education?.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 relative group"
            >
              <motion.button
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeArrayItem('education', index)}
                className="absolute top-4 right-4 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiTrash2 size={20} />
              </motion.button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateArrayItem('education', index, 'degree', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                    placeholder="Bachelor of Science in Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">School/University</label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => updateArrayItem('education', index, 'school', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                    placeholder="University Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={edu.location}
                    onChange={(e) => updateArrayItem('education', index, 'location', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                    placeholder="City, State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">CGPA/GPA</label>
                  <input
                    type="text"
                    value={edu.cgpa}
                    onChange={(e) => updateArrayItem('education', index, 'cgpa', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                    placeholder="3.8/4.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Start Date</label>
                  <input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateArrayItem('education', index, 'startDate', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">End Date</label>
                  <input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => updateArrayItem('education', index, 'endDate', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Description (Optional)</label>
                  <textarea
                    value={edu.description}
                    onChange={(e) => updateArrayItem('education', index, 'description', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none resize-none placeholder-gray-500"
                    placeholder="Relevant coursework, achievements, honors..."
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}


// Experience Section Component
export function ExperienceSection({ resume, addArrayItem, updateArrayItem, removeArrayItem }) {
  const addExperience = () => {
    addArrayItem('experience', {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-sky-500 rounded-xl flex items-center justify-center">
            <FiBriefcase className="text-2xl text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
            Work Experience
          </h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          onClick={addExperience}
          className="px-4 py-2 border-2 border-dashed border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 text-purple-400 rounded-xl font-semibold flex items-center space-x-2 transition-all"
        >
          <FiPlus />
          <span>Add Experience</span>
        </motion.button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {resume?.experience?.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 relative group"
            >
              <motion.button
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeArrayItem('experience', index)}
                className="absolute top-4 right-4 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiTrash2 size={20} />
              </motion.button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateArrayItem('experience', index, 'company', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Position</label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => updateArrayItem('experience', index, 'position', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => updateArrayItem('experience', index, 'location', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                    placeholder="City, State"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => updateArrayItem('experience', index, 'current', e.target.checked)}
                      className="w-5 h-5 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-semibold text-gray-300">Currently Working</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Start Date</label>
                  <input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateArrayItem('experience', index, 'startDate', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">End Date</label>
                  <input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateArrayItem('experience', index, 'endDate', e.target.value)}
                    disabled={exp.current}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none disabled:bg-white/5 disabled:opacity-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateArrayItem('experience', index, 'description', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none resize-none placeholder-gray-500"
                    placeholder="• Describe your responsibilities and achievements&#10;• Use bullet points for better readability&#10;• Quantify results when possible"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}


// Projects Section Component
export function ProjectsSection({ resume, addArrayItem, updateArrayItem, removeArrayItem }) {
  const addProject = () => {
    addArrayItem('projects', {
      name: '',
      technologies: '',
      description: '',
      githubUrl: '',
      liveUrl: ''
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-sky-500 rounded-xl flex items-center justify-center">
            <FiGithub className="text-2xl text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
            Projects
          </h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          onClick={addProject}
          className="px-4 py-2 border-2 border-dashed border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 text-purple-400 rounded-xl font-semibold flex items-center space-x-2 transition-all"
        >
          <FiPlus />
          <span>Add Project</span>
        </motion.button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {resume?.projects?.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 relative group"
            >
              <motion.button
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeArrayItem('projects', index)}
                className="absolute top-4 right-4 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiTrash2 size={20} />
              </motion.button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateArrayItem('projects', index, 'name', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                    placeholder="E-commerce Platform"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Technologies Used</label>
                  <input
                    type="text"
                    value={project.technologies}
                    onChange={(e) => updateArrayItem('projects', index, 'technologies', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={project.githubUrl}
                    onChange={(e) => updateArrayItem('projects', index, 'githubUrl', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                    placeholder="https://github.com/username/project"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Live URL (Optional)</label>
                  <input
                    type="url"
                    value={project.liveUrl}
                    onChange={(e) => updateArrayItem('projects', index, 'liveUrl', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                    placeholder="https://project-demo.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                  <textarea
                    value={project.description}
                    onChange={(e) => updateArrayItem('projects', index, 'description', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none resize-none placeholder-gray-500"
                    placeholder="Describe the project, your role, and key features..."
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}


// Certifications Section Component
export function CertificationsSection({ resume, addArrayItem, updateArrayItem, removeArrayItem }) {
  const addCertification = () => {
    addArrayItem('certifications', {
      name: '',
      issuer: '',
      date: '',
      credentialUrl: ''
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-sky-500 rounded-xl flex items-center justify-center">
            <FiAward className="text-2xl text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
            Certifications
          </h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          onClick={addCertification}
          className="px-4 py-2 border-2 border-dashed border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 text-purple-400 rounded-xl font-semibold flex items-center space-x-2 transition-all"
        >
          <FiPlus />
          <span>Add Certification</span>
        </motion.button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {resume?.certifications?.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 relative group"
            >
              <motion.button
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeArrayItem('certifications', index)}
                className="absolute top-4 right-4 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiTrash2 size={20} />
              </motion.button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Certification Name</label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateArrayItem('certifications', index, 'name', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                    placeholder="AWS Certified Solutions Architect"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Issuing Organization</label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => updateArrayItem('certifications', index, 'issuer', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                    placeholder="Amazon Web Services"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Issue Date</label>
                  <input
                    type="month"
                    value={cert.date}
                    onChange={(e) => updateArrayItem('certifications', index, 'date', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Credential URL (Optional)</label>
                  <input
                    type="url"
                    value={cert.credentialUrl}
                    onChange={(e) => updateArrayItem('certifications', index, 'credentialUrl', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                    placeholder="https://credential-url.com"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}


// Achievements Section Component
export function AchievementsSection({ resume, addArrayItem, updateArrayItem, removeArrayItem }) {
  const addAchievement = () => {
    addArrayItem('achievements', {
      title: '',
      description: '',
      date: ''
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-sky-500 rounded-xl flex items-center justify-center">
            <FiTrendingUp className="text-2xl text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
            Achievements
          </h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          onClick={addAchievement}
          className="px-4 py-2 border-2 border-dashed border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 text-purple-400 rounded-xl font-semibold flex items-center space-x-2 transition-all"
        >
          <FiPlus />
          <span>Add Achievement</span>
        </motion.button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {resume?.achievements?.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 relative group"
            >
              <motion.button
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeArrayItem('achievements', index)}
                className="absolute top-4 right-4 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiTrash2 size={20} />
              </motion.button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Achievement Title</label>
                  <input
                    type="text"
                    value={achievement.title}
                    onChange={(e) => updateArrayItem('achievements', index, 'title', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none placeholder-gray-500"
                    placeholder="Won First Prize in Hackathon"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Date</label>
                  <input
                    type="month"
                    value={achievement.date}
                    onChange={(e) => updateArrayItem('achievements', index, 'date', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                  <textarea
                    value={achievement.description}
                    onChange={(e) => updateArrayItem('achievements', index, 'description', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-sky-500 transition-all outline-none resize-none placeholder-gray-500"
                    placeholder="Describe your achievement and its impact..."
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
