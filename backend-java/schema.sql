-- AI Resume Builder Database Schema
-- This file is for reference only - tables are created automatically by Hibernate

-- Database Creation
CREATE DATABASE IF NOT EXISTS resume_db;
USE resume_db;

-- Users Table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Resumes Table
CREATE TABLE resumes (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    target_role VARCHAR(255),
    experience_level VARCHAR(100),
    template VARCHAR(100),
    personal_info JSON,
    summary TEXT,
    skills JSON,
    education JSON,
    projects JSON,
    experience JSON,
    certifications JSON,
    achievements JSON,
    preferences JSON,
    ats_score INT DEFAULT 0,
    ats_optimized BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_updated_at (updated_at)
);

-- Sample Queries

-- Get all resumes for a user
-- SELECT * FROM resumes WHERE user_id = 'user-uuid' ORDER BY updated_at DESC;

-- Get user with email
-- SELECT * FROM users WHERE email = 'user@example.com';

-- Get resume with ATS score
-- SELECT id, name, target_role, ats_score FROM resumes WHERE user_id = 'user-uuid';

-- Update ATS score
-- UPDATE resumes SET ats_score = 85, updated_at = NOW() WHERE id = 'resume-uuid';

-- PostgreSQL Version (if using PostgreSQL instead of MySQL)
/*
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    target_role VARCHAR(255),
    experience_level VARCHAR(100),
    template VARCHAR(100),
    personal_info JSONB,
    summary TEXT,
    skills JSONB,
    education JSONB,
    projects JSONB,
    experience JSONB,
    certifications JSONB,
    achievements JSONB,
    preferences JSONB,
    ats_score INTEGER DEFAULT 0,
    ats_optimized BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_updated_at ON resumes(updated_at);
*/
