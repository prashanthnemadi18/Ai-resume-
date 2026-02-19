package com.resumeai.dto;

import lombok.Data;
import java.util.Map;

@Data
public class AIGenerateRequest {
    private String promptType; // summary, project_bullets, experience_bullets
    private Map<String, Object> data;
    private String targetRole;
    private String experienceLevel;
}
