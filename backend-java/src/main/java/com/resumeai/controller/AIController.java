package com.resumeai.controller;

import com.resumeai.dto.AIGenerateRequest;
import com.resumeai.model.Resume;
import com.resumeai.service.AIService;
import com.resumeai.service.ATSService;
import com.resumeai.service.GitHubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AIController {
    
    private final AIService aiService;
    private final ATSService atsService;
    private final GitHubService gitHubService;
    
    @PostMapping("/ai/generate")
    public ResponseEntity<Map<String, String>> generateContent(@RequestBody AIGenerateRequest request,
                                                               Authentication authentication) {
        try {
            String content = aiService.generateContent(
                request.getPromptType(),
                request.getData(),
                request.getTargetRole(),
                request.getExperienceLevel()
            );
            return ResponseEntity.ok(Map.of("content", content));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "AI generation failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/ai/generate-resume")
    public ResponseEntity<Map<String, Object>> generateCompleteResume(@RequestBody Resume resumeData,
                                                                       Authentication authentication) {
        try {
            String targetRole = resumeData.getTargetRole();
            String experienceLevel = resumeData.getExperienceLevel();
            Boolean atsOptimized = resumeData.getAtsOptimized() != null ? resumeData.getAtsOptimized() : true;
            
            // Generate complete resume using AI
            Map<String, Object> generatedResume = aiService.generateCompleteResume(
                resumeData,
                targetRole,
                experienceLevel,
                atsOptimized
            );
            
            // Calculate ATS score
            int atsScore = atsService.calculateATSScore(resumeData);
            generatedResume.put("atsScore", atsScore);
            
            return ResponseEntity.ok(generatedResume);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Resume generation failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/github/analyze")
    public ResponseEntity<Map<String, Object>> analyzeGitHub(@RequestBody Map<String, String> request,
                                                              Authentication authentication) {
        try {
            String repoUrl = request.get("repoUrl");
            Map<String, Object> analysis = gitHubService.analyzeRepository(repoUrl);
            return ResponseEntity.ok(analysis);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "GitHub analysis failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/ats/calculate")
    public ResponseEntity<Map<String, Object>> calculateATSScore(@RequestBody Resume resume,
                                                                 Authentication authentication) {
        int score = atsService.calculateATSScore(resume);
        Map<String, Object> feedback = atsService.getFeedback(resume);
        
        return ResponseEntity.ok(Map.of(
            "score", score,
            "feedback", feedback
        ));
    }
}
