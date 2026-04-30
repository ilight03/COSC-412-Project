package edu.widgetwizards.studentassistant.dto;

import jakarta.validation.constraints.NotNull;

public class NotesRequestDto {
    
    // NotNull notation ensures invalid data from frontend isn't passed to backend
    // These are the attributs that frontend needs to send when creating or updating a note
    @NotNull private String title;
    @NotNull private String content;
    @NotNull private String username;

    // Setters and getters
    public void setUsername(String username) {
        this.username = username;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setContent(String content) {
        this.content = content;
    }

    
    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public String getUsername() {
        return username;
    }
}
