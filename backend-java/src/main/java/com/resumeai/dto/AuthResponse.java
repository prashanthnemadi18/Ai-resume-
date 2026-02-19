package com.resumeai.dto;

import com.resumeai.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserDTO user;
    
    @Data
    @AllArgsConstructor
    public static class UserDTO {
        private String id;
        private String name;
        private String email;
        
        public static UserDTO fromUser(User user) {
            return new UserDTO(user.getId(), user.getName(), user.getEmail());
        }
    }
}
