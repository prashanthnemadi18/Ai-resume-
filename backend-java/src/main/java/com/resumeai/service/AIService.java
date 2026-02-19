package com.resumeai.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIService {
    
    private final GeminiService geminiService;
    
    public String generateContent(String promptType, Map<String, Object> data, 
                                  String targetRole, String experienceLevel) throws IOException {
        return switch (promptType) {
            case "summary" -> generateSummary(data, targetRole, experienceLevel);
            case "project_bullets" -> generateProjectBullets(data, targetRole);
            case "experience_bullets" -> generateExperienceBullets(data, targetRole);
            case "optimize_content" -> optimizeContent(data, targetRole);
            default -> throw new IllegalArgumentException("Unknown prompt type: " + promptType);
        };
    }
    
    private String generateSummary(Map<String, Object> data, String targetRole, String experienceLevel) throws IOException {
        Map<String, List<String>> skills = (Map<String, List<String>>) data.get("skills");
        List<Map<String, Object>> experience = (List<Map<String, Object>>) data.get("experience");
        List<Map<String, Object>> education = (List<Map<String, Object>>) data.get("education");
        
        String skillsList = skills != null ? 
            skills.values().stream()
                .flatMap(List::stream)
                .collect(Collectors.joining(", ")) : "Not provided";
        
        String educationInfo = education != null && !education.isEmpty() ? 
            (String) education.get(0).get("degree") : "Not provided";
        
        String prompt = String.format("""
            Create a powerful, ATS-optimized professional summary for a %s %s position.
            
            CANDIDATE PROFILE:
            - Experience Level: %s
            - Key Skills: %s
            - Work Experience: %d positions
            - Education: %s
            
            REQUIREMENTS:
            1. Write 3-4 compelling sentences (60-80 words)
            2. Start with a strong value proposition
            3. Include specific technical skills and expertise areas
            4. Mention years of experience or key achievements
            5. Use action-oriented, confident language
            6. Make it ATS-friendly (avoid special characters, use standard keywords)
            7. Tailor specifically for %s role
            8. Include measurable impact where possible
            
            OUTPUT FORMAT:
            Return ONLY the professional summary text. No labels, no formatting, just the summary.
            """, experienceLevel, targetRole, experienceLevel, skillsList, 
            experience != null ? experience.size() : 0, educationInfo, targetRole);
        
        String systemInstruction = "You are an expert resume writer and career coach specializing in ATS-optimized content. Create compelling, professional summaries that help candidates stand out.";
        
        return geminiService.generateContent(prompt, systemInstruction);
    }
    
    private String generateProjectBullets(Map<String, Object> data, String targetRole) throws IOException {
        Map<String, Object> projectInfo = (Map<String, Object>) data.get("project_info");
        List<String> technologies = (List<String>) data.get("technologies");
        String description = (String) data.get("description");
        
        String techList = technologies != null ? String.join(", ", technologies) : "Not specified";
        
        String prompt = String.format("""
            Create 4-5 compelling bullet points for this project targeting a %s position.
            
            Project Description: %s
            Technologies: %s
            Additional Info: %s
            
            Requirements:
            - Start each bullet with a strong action verb (Developed, Implemented, Designed, Optimized, Built, etc.)
            - Include measurable impacts when possible (improved by X%%, reduced by Y, processed Z requests)
            - Highlight technical skills and tools used
            - Keep bullets concise (1-2 lines each)
            - Focus on achievements, not just responsibilities
            - Make it ATS-friendly
            - Tailor to %s role requirements
            
            Return ONLY the bullet points, one per line, starting with • symbol.
            """, targetRole, description, techList, projectInfo, targetRole);
        
        String systemInstruction = "You are an expert resume writer specializing in ATS-optimized content.";
        
        return geminiService.generateContent(prompt, systemInstruction);
    }
    
    private String generateExperienceBullets(Map<String, Object> data, String targetRole) throws IOException {
        String role = (String) data.get("role");
        String company = (String) data.get("company");
        String responsibilities = (String) data.get("responsibilities");
        List<String> technologies = (List<String>) data.get("technologies");
        
        String techList = technologies != null ? String.join(", ", technologies) : "Not specified";
        
        String prompt = String.format("""
            Create 4-6 compelling bullet points for this work experience targeting a %s position.
            
            Role: %s
            Company: %s
            Responsibilities: %s
            Technologies: %s
            
            Requirements:
            - Start each bullet with a strong action verb (Led, Developed, Implemented, Architected, Optimized, etc.)
            - Include measurable achievements (increased by X%%, reduced by Y, managed Z projects)
            - Highlight leadership and impact
            - Keep bullets concise (1-2 lines each)
            - Focus on results and value delivered
            - Make it ATS-friendly
            - Emphasize skills relevant to %s
            
            Return ONLY the bullet points, one per line, starting with • symbol.
            """, targetRole, role, company, responsibilities, techList, targetRole);
        
        String systemInstruction = "You are an expert resume writer specializing in ATS-optimized content.";
        
        return geminiService.generateContent(prompt, systemInstruction);
    }
    
    private String optimizeContent(Map<String, Object> data, String targetRole) throws IOException {
        String content = (String) data.get("content");
        
        String prompt = String.format("""
            Optimize the following content for a %s position:
            
            %s
            
            Requirements:
            - Use strong action verbs
            - Add measurable metrics where possible
            - Include relevant keywords for %s
            - Maintain ATS-friendly formatting
            - Keep the same general structure
            - Make it more impactful
            
            Return ONLY the optimized content.
            """, targetRole, content, targetRole);
        
        String systemInstruction = "You are an expert in ATS optimization and resume writing.";
        
        return geminiService.generateContent(prompt, systemInstruction);
    }
    
    public Map<String, Object> generateCompleteResume(com.resumeai.model.Resume resumeData,
                                                       String targetRole,
                                                       String experienceLevel,
                                                       Boolean atsOptimized) throws IOException {
        log.info("Generating complete resume for role: {}, level: {}", targetRole, experienceLevel);
        
        // Build comprehensive prompt for complete resume generation
        String prompt = buildCompleteResumePrompt(resumeData, targetRole, experienceLevel, atsOptimized);
        String systemInstruction = """
            You are an expert resume writer and ATS optimization specialist with 15+ years of experience.
            Your resumes consistently achieve 90+ ATS scores and help candidates land interviews at top companies.
            You understand what recruiters and hiring managers look for in resumes.
            """;
        
        String generatedContent = geminiService.generateContent(prompt, systemInstruction);
        
        // Parse and structure the generated content
        return Map.of(
            "generatedContent", generatedContent,
            "targetRole", targetRole,
            "experienceLevel", experienceLevel,
            "atsOptimized", atsOptimized,
            "timestamp", System.currentTimeMillis()
        );
    }
    
    private String buildCompleteResumePrompt(com.resumeai.model.Resume resume,
                                             String targetRole,
                                             String experienceLevel,
                                             Boolean atsOptimized) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append(String.format("""
            Create an ATS-optimized resume for %s %s role.
            
            CANDIDATE DATA:
            """, experienceLevel, targetRole));
        
        // Personal Info
        if (resume.getPersonalInfo() != null) {
            Map<String, Object> personalInfo = resume.getPersonalInfo();
            prompt.append(String.format("Name: %s | Email: %s | Phone: %s",
                personalInfo.get("name"), personalInfo.get("email"), personalInfo.get("phone")));
            if (personalInfo.get("location") != null) {
                prompt.append(String.format(" | Location: %s", personalInfo.get("location")));
            }
            if (personalInfo.get("linkedin") != null) {
                prompt.append(String.format(" | LinkedIn: %s", personalInfo.get("linkedin")));
            }
            if (personalInfo.get("github") != null) {
                prompt.append(String.format(" | GitHub: %s", personalInfo.get("github")));
            }
            prompt.append("\n\n");
        }
        
        // Skills
        if (resume.getSkills() != null) {
            Map<String, List<String>> skills = resume.getSkills();
            prompt.append("SKILLS: ");
            skills.forEach((category, skillList) -> {
                if (skillList != null && !skillList.isEmpty()) {
                    prompt.append(String.format("%s: %s | ", 
                        category, String.join(", ", skillList)));
                }
            });
            prompt.append("\n\n");
        }
        
        // Education
        if (resume.getEducation() != null && !resume.getEducation().isEmpty()) {
            prompt.append("EDUCATION: ");
            resume.getEducation().forEach(edu -> {
                prompt.append(String.format("%s in %s, %s (%s-%s, CGPA: %s) | ",
                    edu.get("degree"), edu.get("field"), edu.get("school"),
                    edu.get("startYear"), edu.get("endYear"), edu.get("cgpa")));
            });
            prompt.append("\n\n");
        }
        
        // Experience
        if (resume.getExperience() != null && !resume.getExperience().isEmpty()) {
            prompt.append("EXPERIENCE: ");
            resume.getExperience().forEach(exp -> {
                prompt.append(String.format("%s at %s (%s): %s | ",
                    exp.get("role"), exp.get("company"), exp.get("duration"), exp.get("description")));
            });
            prompt.append("\n\n");
        }
        
        // Projects
        if (resume.getProjects() != null && !resume.getProjects().isEmpty()) {
            prompt.append("PROJECTS: ");
            resume.getProjects().forEach(project -> {
                prompt.append(String.format("%s (%s): %s | ",
                    project.get("name"), project.get("technologies"), project.get("description")));
            });
            prompt.append("\n\n");
        }
        
        // Certifications
        if (resume.getCertifications() != null && !resume.getCertifications().isEmpty()) {
            prompt.append("CERTIFICATIONS: ");
            resume.getCertifications().forEach(cert -> {
                prompt.append(String.format("%s (%s, %s) | ",
                    cert.get("name"), cert.get("platform"), cert.get("year")));
            });
            prompt.append("\n\n");
        }
        
        // Achievements
        if (resume.getAchievements() != null && !resume.getAchievements().isEmpty()) {
            prompt.append("ACHIEVEMENTS: ");
            resume.getAchievements().forEach(achievement -> {
                prompt.append(String.format("%s: %s | ",
                    achievement.get("title"), achievement.get("description")));
            });
            prompt.append("\n\n");
        }
        
        prompt.append(String.format("""
            
            GENERATE:
            1. Professional Summary (3-4 sentences with key skills for %s)
            2. Skills (organized by category, ATS-friendly)
            3. Experience (4-5 bullet points per role with action verbs and metrics)
            4. Projects (3-4 bullet points per project with technologies and impact)
            5. Education (formatted with degree, school, year, CGPA)
            6. Certifications & Achievements
            
            Make it ATS-optimized, professional, and impactful. Use standard formatting.
            """, targetRole));
        
        return prompt.toString();
    }
}
