package com.resumeai.service;

import com.resumeai.model.Resume;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ATSService {
    
    public int calculateATSScore(Resume resume) {
        int score = 0;
        
        // Personal Info (10 points)
        if (resume.getPersonalInfo() != null && !resume.getPersonalInfo().isEmpty()) {
            score += 10;
        }
        
        // Summary (15 points)
        if (resume.getSummary() != null && !resume.getSummary().isEmpty()) {
            score += 15;
        }
        
        // Skills (25 points)
        if (resume.getSkills() != null && !resume.getSkills().isEmpty()) {
            int skillCount = resume.getSkills().values().stream()
                .mapToInt(List::size)
                .sum();
            score += Math.min(25, skillCount * 2);
        }
        
        // Experience (30 points)
        if (resume.getExperience() != null && !resume.getExperience().isEmpty()) {
            score += Math.min(30, resume.getExperience().size() * 10);
        }
        
        // Education (10 points)
        if (resume.getEducation() != null && !resume.getEducation().isEmpty()) {
            score += 10;
        }
        
        // Projects (10 points)
        if (resume.getProjects() != null && !resume.getProjects().isEmpty()) {
            score += Math.min(10, resume.getProjects().size() * 3);
        }
        
        return Math.min(100, score);
    }
    
    public Map<String, Object> getFeedback(Resume resume) {
        List<String> suggestions = new ArrayList<>();
        List<String> strengths = new ArrayList<>();
        
        // Check personal info
        if (resume.getPersonalInfo() == null || resume.getPersonalInfo().isEmpty()) {
            suggestions.add("Add personal information (name, email, phone, location)");
        } else {
            strengths.add("Personal information is complete");
        }
        
        // Check summary
        if (resume.getSummary() == null || resume.getSummary().isEmpty()) {
            suggestions.add("Add a professional summary to highlight your expertise");
        } else {
            strengths.add("Professional summary is present");
        }
        
        // Check skills
        if (resume.getSkills() == null || resume.getSkills().isEmpty()) {
            suggestions.add("Add relevant skills for your target role");
        } else {
            int skillCount = resume.getSkills().values().stream()
                .mapToInt(List::size)
                .sum();
            if (skillCount < 10) {
                suggestions.add("Add more skills (aim for 10-15 relevant skills)");
            } else {
                strengths.add("Good variety of skills listed");
            }
        }
        
        // Check experience
        if (resume.getExperience() == null || resume.getExperience().isEmpty()) {
            suggestions.add("Add work experience with measurable achievements");
        } else {
            strengths.add("Work experience is documented");
            if (resume.getExperience().size() < 2) {
                suggestions.add("Add more work experience entries if available");
            }
        }
        
        // Check education
        if (resume.getEducation() == null || resume.getEducation().isEmpty()) {
            suggestions.add("Add your educational background");
        } else {
            strengths.add("Education is included");
        }
        
        // Check projects
        if (resume.getProjects() == null || resume.getProjects().isEmpty()) {
            suggestions.add("Add relevant projects to showcase your skills");
        } else {
            strengths.add("Projects are included");
        }
        
        Map<String, Object> feedback = new HashMap<>();
        feedback.put("suggestions", suggestions);
        feedback.put("strengths", strengths);
        feedback.put("score", calculateATSScore(resume));
        
        return feedback;
    }
}
