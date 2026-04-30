package edu.widgetwizards.studentassistant.dto;


public class NotesDto {
    
    // NotesDTO attributes
    // These are the only attributes that frontend needs back
    private String title;
    private String content;

    
    // Getters and setters
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
}
