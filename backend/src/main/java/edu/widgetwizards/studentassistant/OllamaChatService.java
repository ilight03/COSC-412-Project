package edu.widgetwizards.studentassistant;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

/*Handles the HTTP Endpoint. 
o Holds the actual call to the model 
o In order to keep the controller clean
 */
@Service
public class OllamaChatService {
    private final ChatModel ollamaLanguageModel;

    public OllamaChatService(ChatModel ollamaLanguageModel) {
        this.ollamaLanguageModel = ollamaLanguageModel;
    }

    public ChatResponse generateResponse(ChatRequest request) {
        try {
            String modelName = request.getModel() != null ? request.getModel() : "gemma4";
            String prompt = request.getPrompt();

            if (prompt == null || prompt.trim().isEmpty()) {
                return new ChatResponse(
                    null,
                    modelName,
                    "error",
                    "Prompt cannot be empty",
                    LocalDateTime.now()
                );
            }

            // Call Ollama
            String response = ollamaLanguageModel.call(new Prompt(prompt)).getResult().getOutput().getContent();

            return new ChatResponse(
                response,
                modelName,
                "success",
                null,
                LocalDateTime.now()
            );
        } catch (Exception e) {
            return new ChatResponse(
                null,
                request.getModel() != null ? request.getModel() : "gemma4",
                "error",
                "Failed to generate response: " + e.getMessage(),
                LocalDateTime.now()
            );
        }
    }
}
