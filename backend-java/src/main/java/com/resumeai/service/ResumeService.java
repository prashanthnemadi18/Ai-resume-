package com.resumeai.service;

import com.resumeai.model.Resume;
import com.resumeai.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ResumeService {
    
    private final ResumeRepository resumeRepository;
    private final ATSService atsService;
    
    @Transactional
    public Resume createResume(String userId, String name, String targetRole, 
                              String experienceLevel, String template) {
        Resume resume = new Resume();
        resume.setUserId(userId);
        resume.setName(name);
        resume.setTargetRole(targetRole);
        resume.setExperienceLevel(experienceLevel);
        resume.setTemplate(template);
        
        return resumeRepository.save(resume);
    }
    
    @Transactional
    public Resume saveResume(Resume resume) {
        // Calculate ATS score if relevant data exists
        if (resume.getSkills() != null || resume.getExperience() != null || resume.getProjects() != null) {
            int atsScore = atsService.calculateATSScore(resume);
            resume.setAtsScore(atsScore);
        }
        
        return resumeRepository.save(resume);
    }
    
    @Transactional(readOnly = true)
    public Resume getResume(String resumeId, String userId) {
        return resumeRepository.findByIdAndUserId(resumeId, userId)
            .orElseThrow(() -> new RuntimeException("Resume not found"));
    }
    
    @Transactional(readOnly = true)
    public List<Resume> getUserResumes(String userId) {
        return resumeRepository.findByUserIdOrderByUpdatedAtDesc(userId);
    }
    
    @Transactional
    public Resume updateResume(String resumeId, String userId, Map<String, Object> updates) {
        Resume resume = getResume(resumeId, userId);
        
        // Update fields
        if (updates.containsKey("name")) {
            resume.setName((String) updates.get("name"));
        }
        if (updates.containsKey("personalInfo")) {
            resume.setPersonalInfo((Map<String, Object>) updates.get("personalInfo"));
        }
        if (updates.containsKey("summary")) {
            resume.setSummary((String) updates.get("summary"));
        }
        if (updates.containsKey("skills")) {
            resume.setSkills((Map<String, List<String>>) updates.get("skills"));
        }
        if (updates.containsKey("education")) {
            resume.setEducation((List<Map<String, Object>>) updates.get("education"));
        }
        if (updates.containsKey("projects")) {
            resume.setProjects((List<Map<String, Object>>) updates.get("projects"));
        }
        if (updates.containsKey("experience")) {
            resume.setExperience((List<Map<String, Object>>) updates.get("experience"));
        }
        if (updates.containsKey("certifications")) {
            resume.setCertifications((List<Map<String, Object>>) updates.get("certifications"));
        }
        if (updates.containsKey("achievements")) {
            resume.setAchievements((List<Map<String, Object>>) updates.get("achievements"));
        }
        if (updates.containsKey("preferences")) {
            resume.setPreferences((Map<String, Object>) updates.get("preferences"));
        }
        if (updates.containsKey("atsOptimized")) {
            resume.setAtsOptimized((Boolean) updates.get("atsOptimized"));
        }
        
        resume.setUpdatedAt(LocalDateTime.now());
        
        // Calculate ATS score if relevant data exists
        if (resume.getSkills() != null || resume.getExperience() != null || resume.getProjects() != null) {
            int atsScore = atsService.calculateATSScore(resume);
            resume.setAtsScore(atsScore);
        }
        
        return resumeRepository.save(resume);
    }
    
    @Transactional
    public void deleteResume(String resumeId, String userId) {
        Resume resume = getResume(resumeId, userId);
        resumeRepository.delete(resume);
    }
}
