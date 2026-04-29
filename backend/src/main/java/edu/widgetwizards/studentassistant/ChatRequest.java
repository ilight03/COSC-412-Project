package edu.widgetwizards.studentassistant;
/*
    o DTO request form frontend. 
    o This is the initial request that will be prompted to the model
 */
public class ChatRequest {
    private String prompt;
    private String model;
    private String conversationId;

    public ChatRequest() {
    }

    public ChatRequest(String prompt, String model, String conversationId) {
        this.prompt = prompt;
        this.model = model;
        this.conversationId = conversationId;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }
}
