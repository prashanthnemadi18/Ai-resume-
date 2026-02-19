package com.resumeai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class GeminiService {
    
    @Value("${gemini.api.key}")
    private String apiKey;
    
    @Value("${gemini.api.url}")
    private String apiUrl;
    
    private final OkHttpClient httpClient = new OkHttpClient.Builder()
        .connectTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
        .writeTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
        .readTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
        .build();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public String generateContent(String prompt, String systemInstruction) throws IOException {
        String url = apiUrl + "?key=" + apiKey;
        
        // Using Gemini 2.5 Flash - Fast and efficient model
        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of(
                    "parts", List.of(
                        Map.of("text", systemInstruction + "\n\n" + prompt)
                    )
                )
            ),
            "generationConfig", Map.of(
                "temperature", 0.7,
                "topK", 40,
                "topP", 0.95,
                "maxOutputTokens", 1500,
                "responseMimeType", "text/plain"
            ),
            "safetySettings", List.of(
                Map.of("category", "HARM_CATEGORY_HARASSMENT", "threshold", "BLOCK_NONE"),
                Map.of("category", "HARM_CATEGORY_HATE_SPEECH", "threshold", "BLOCK_NONE"),
                Map.of("category", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold", "BLOCK_NONE"),
                Map.of("category", "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold", "BLOCK_NONE")
            )
        );
        
        String jsonBody = objectMapper.writeValueAsString(requestBody);
        
        RequestBody body = RequestBody.create(
            jsonBody,
            MediaType.parse("application/json")
        );
        
        Request request = new Request.Builder()
            .url(url)
            .post(body)
            .addHeader("Content-Type", "application/json")
            .build();
        
        log.info("Calling Gemini 2.5 Flash API...");
        
        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "No error details";
                log.error("Gemini API call failed: {} - {}", response.code(), errorBody);
                throw new IOException("Gemini API call failed: " + response.code() + " - " + errorBody);
            }
            
            String responseBody = response.body().string();
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            
            // Extract text from response
            String generatedText = jsonNode
                .path("candidates")
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText();
            
            log.info("Gemini API response received successfully");
            return generatedText;
        } catch (Exception e) {
            log.error("Error calling Gemini API: {}", e.getMessage());
            throw new IOException("Failed to generate content: " + e.getMessage(), e);
        }
    }
}
