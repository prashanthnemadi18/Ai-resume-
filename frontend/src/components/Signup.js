import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { FaRocket, FaMagic, FaBullseye, FaBolt, FaFileAlt, FaShieldAlt, FaSave } from 'react-icons/fa';
import axios from '../api/axios';
import SimpleBackground from './SimpleBackground';

function Signup({ onSignup }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/auth/signup', formData);
      onSignup(response.data.token, response.data.user);
    } catch (err) {
      console.error('Signup error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.response?.data?.detail || 
                          err.message || 
                          'Signup failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 33, label: 'Weak', color: 'bg-red-500' };
    if (password.length < 10) return { strength: 66, label: 'Medium', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Simple Background */}
      <SimpleBackground />

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <FaMagic className="text-white text-4xl" />
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-center text-gray-900 mb-2"
            >
              Create Account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-gray-600 mb-8"
            >
              Start building your perfect resume today
            </motion.p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative group">
                  <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
                    placeholder="you@example.com"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">Password Strength</span>
                      <span className={`font-semibold ${
                        passwordStrength.strength === 100 ? 'text-green-600' :
                        passwordStrength.strength === 66 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${passwordStrength.strength}%` }}
                        className={`h-2 rounded-full ${passwordStrength.color}`}
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg"
                >
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Create Account
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 text-center space-y-4"
            >
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-purple-600 font-semibold hover:text-pink-600 transition-colors"
                >
                  Sign In
                </Link>
              </p>

              <Link
                to="/"
                className="block text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                ← Back to Home
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Side - Benefits */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:block text-white"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="flex items-center space-x-3 mb-8"
          >
            <FaRocket className="text-5xl" />
            <h1 className="text-4xl font-bold">AI Resume Builder</h1>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl font-bold mb-6 leading-tight"
          >
            Join 10,000+ Users
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-gray-300 mb-8"
          >
            Create professional, ATS-optimized resumes in minutes
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="space-y-4"
          >
            {[
              { icon: FaMagic, text: "AI-Powered Content Generation", color: "from-purple-400 to-pink-500" },
              { icon: FaBullseye, text: "95% ATS Pass Rate", color: "from-green-400 to-emerald-500" },
              { icon: FaBolt, text: "Create Resume in 10 Minutes", color: "from-yellow-400 to-orange-500" },
              { icon: FaFileAlt, text: "Professional Templates", color: "from-blue-400 to-cyan-500" },
              { icon: FaShieldAlt, text: "Secure & Private", color: "from-red-400 to-pink-500" },
              { icon: FaSave, text: "Save & Edit Anytime", color: "from-indigo-400 to-purple-500" }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="flex items-center space-x-3 text-lg text-gray-300 bg-white/10 backdrop-blur-sm rounded-xl p-4 group hover:bg-white/20 transition-all cursor-pointer"
                  whileHover={{ scale: 1.05, x: 5 }}
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 360]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      delay: index * 0.3
                    }}
                    className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}
                  >
                    <IconComponent className="text-white text-lg" />
                  </motion.div>
                  <span className="group-hover:text-white transition-colors">{feature.text}</span>
                  <FiCheck className="ml-auto text-green-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Signup;
