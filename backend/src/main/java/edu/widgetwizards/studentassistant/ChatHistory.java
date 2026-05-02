package edu.widgetwizards.studentassistant;

public class ChatHistory {
    private String prompt;
    private String response;
    private String timestamp;

    // Getters and setters
    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
    
    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }
    
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
} 
