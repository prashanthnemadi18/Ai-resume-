package com.resumeai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class GitHubService {
    
    private final OkHttpClient httpClient = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final GeminiService geminiService;
    
    public Map<String, Object> analyzeRepository(String repoUrl) throws IOException {
        // Extract owner and repo from URL
        String[] parts = extractOwnerAndRepo(repoUrl);
        if (parts == null) {
            throw new IllegalArgumentException("Invalid GitHub URL");
        }
        
        String owner = parts[0];
        String repo = parts[1];
        
        Map<String, Object> analysis = new HashMap<>();
        
        // Fetch repository info
        Map<String, Object> repoInfo = fetchRepoInfo(owner, repo);
        analysis.put("name", repoInfo.get("name"));
        analysis.put("description", repoInfo.get("description"));
        analysis.put("url", repoUrl);
        
        // Fetch languages
        List<String> languages = fetchLanguages(owner, repo);
        analysis.put("technologies", languages);
        
        // Fetch README
        String readme = fetchReadme(owner, repo);
        analysis.put("readme", readme);
        
        // Generate AI bullets
        String bullets = generateProjectBullets(
            (String) analysis.get("name"),
            (String) analysis.get("description"),
            readme,
            languages
        );
        analysis.put("bullets", bullets);
        
        return analysis;
    }
    
    private String[] extractOwnerAndRepo(String url) {
        Pattern pattern = Pattern.compile("github\\.com/([^/]+)/([^/]+)");
        Matcher matcher = pattern.matcher(url);
        if (matcher.find()) {
            return new String[]{matcher.group(1), matcher.group(2).replace(".git", "")};
        }
        return null;
    }
    
    private Map<String, Object> fetchRepoInfo(String owner, String repo) throws IOException {
        String url = String.format("https://api.github.com/repos/%s/%s", owner, repo);
        
        Request request = new Request.Builder()
            .url(url)
            .addHeader("Accept", "application/vnd.github.v3+json")
            .build();
        
        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Failed to fetch repo info: " + response.code());
            }
            
            JsonNode json = objectMapper.readTree(response.body().string());
            Map<String, Object> info = new HashMap<>();
            info.put("name", json.path("name").asText());
            info.put("description", json.path("description").asText(""));
            info.put("stars", json.path("stargazers_count").asInt());
            info.put("language", json.path("language").asText(""));
            
            return info;
        }
    }
    
    private List<String> fetchLanguages(String owner, String repo) throws IOException {
        String url = String.format("https://api.github.com/repos/%s/%s/languages", owner, repo);
        
        Request request = new Request.Builder()
            .url(url)
            .addHeader("Accept", "application/vnd.github.v3+json")
            .build();
        
        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                return new ArrayList<>();
            }
            
            JsonNode json = objectMapper.readTree(response.body().string());
            List<String> languages = new ArrayList<>();
            json.fieldNames().forEachRemaining(languages::add);
            
            return languages;
        }
    }
    
    private String fetchReadme(String owner, String repo) throws IOException {
        String url = String.format("https://api.github.com/repos/%s/%s/readme", owner, repo);
        
        Request request = new Request.Builder()
            .url(url)
            .addHeader("Accept", "application/vnd.github.v3.raw")
            .build();
        
        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                return "";
            }
            
            String readme = response.body().string();
            // Limit to first 1000 characters for AI processing
            return readme.length() > 1000 ? readme.substring(0, 1000) : readme;
        }
    }
    
    private String generateProjectBullets(String name, String description, String readme, List<String> technologies) throws IOException {
        String prompt = String.format("""
            Generate 4-5 professional, ATS-optimized bullet points for this GitHub project:
            
            PROJECT: %s
            DESCRIPTION: %s
            TECHNOLOGIES: %s
            README EXCERPT: %s
            
            REQUIREMENTS:
            1. Start each bullet with a strong action verb (Built, Developed, Implemented, Designed, Created)
            2. Include measurable impact or technical achievements
            3. Highlight key technologies and features
            4. Keep each bullet concise (1-2 lines)
            5. Focus on what was accomplished, not just what was used
            6. Make it ATS-friendly with relevant keywords
            
            OUTPUT FORMAT:
            Return ONLY the bullet points, one per line, starting with • symbol.
            No additional text or formatting.
            """, name, description, String.join(", ", technologies), readme);
        
        String systemInstruction = "You are an expert technical resume writer specializing in showcasing software projects effectively.";
        
        return geminiService.generateContent(prompt, systemInstruction);
    }
}
