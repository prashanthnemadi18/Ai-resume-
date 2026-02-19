package com.resumeai.controller;

import com.resumeai.model.Resume;
import com.resumeai.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ResumeController {
    
    private final ResumeService resumeService;
    
    @PostMapping("/resume")
    public ResponseEntity<Resume> createResume(@RequestBody Resume resumeData,
                                               Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        
        // Set user ID
        resumeData.setUserId(userId);
        
        // Ensure name is set
        if (resumeData.getName() == null || resumeData.getName().trim().isEmpty()) {
            String personName = "";
            if (resumeData.getPersonalInfo() != null && resumeData.getPersonalInfo().get("name") != null) {
                personName = resumeData.getPersonalInfo().get("name").toString();
            }
            resumeData.setName(personName.isEmpty() ? "My Resume" : personName + "'s Resume");
        }
        
        // Set defaults if not provided
        if (resumeData.getTargetRole() == null) resumeData.setTargetRole("");
        if (resumeData.getExperienceLevel() == null) resumeData.setExperienceLevel("Entry-Level");
        if (resumeData.getTemplate() == null) resumeData.setTemplate("Modern");
        if (resumeData.getAtsOptimized() == null) resumeData.setAtsOptimized(true);
        if (resumeData.getAtsScore() == null) resumeData.setAtsScore(0);
        
        Resume savedResume = resumeService.saveResume(resumeData);
        return ResponseEntity.ok(savedResume);
    }
    
    @GetMapping("/resume/{resumeId}")
    public ResponseEntity<Resume> getResume(@PathVariable String resumeId,
                                           Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        Resume resume = resumeService.getResume(resumeId, userId);
        return ResponseEntity.ok(resume);
    }
    
    @GetMapping("/resumes")
    public ResponseEntity<List<Resume>> getUserResumes(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        List<Resume> resumes = resumeService.getUserResumes(userId);
        return ResponseEntity.ok(resumes);
    }
    
    @PutMapping("/resume/{resumeId}")
    public ResponseEntity<Resume> updateResume(@PathVariable String resumeId,
                                              @RequestBody Map<String, Object> updates,
                                              Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        Resume resume = resumeService.updateResume(resumeId, userId, updates);
        return ResponseEntity.ok(resume);
    }
    
    @DeleteMapping("/resume/{resumeId}")
    public ResponseEntity<Map<String, String>> deleteResume(@PathVariable String resumeId,
                                                            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        resumeService.deleteResume(resumeId, userId);
        return ResponseEntity.ok(Map.of("message", "Resume deleted successfully"));
    }
}
