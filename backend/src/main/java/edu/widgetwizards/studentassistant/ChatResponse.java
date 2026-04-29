package edu.widgetwizards.studentassistant;

import java.time.LocalDateTime;

/*
    o A DTO that returns the models output
    o 
 */
public class ChatResponse {
    private String response;
    private String model;
    private String status;
    private String error;
    private LocalDateTime timestamp;

    public ChatResponse() {
    }

    public ChatResponse(String response, String model, String status, String error, LocalDateTime timestamp) {
        this.response = response;
        this.model = model;
        this.status = status;
        this.error = error;
        this.timestamp = timestamp;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
