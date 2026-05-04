package edu.widgetwizards.studentassistant.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import edu.widgetwizards.studentassistant.ChatRequest;
import edu.widgetwizards.studentassistant.ChatResponse;

/**
 * AIService - Handles all AI inference by calling Ollama running locally.
 * 
 * Ollama runs at http://localhost:11434 and provides a REST API for local LLMs.
 * This service uses Java's built-in HttpClient (Java 11+) so no extra dependencies needed.
 * 
 * Setup: Install Ollama from https://ollama.com and run: ollama pull gemma2:2b
 */
@Service
public class AIService {

    @Value("${spring.ai.ollama.base-url:http://localhost:11434}")
    private String ollamaBaseUrl;

    @Value("${spring.ai.ollama.model:gemma2:2b}")
    private String defaultModel;

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public AIService() {
        // HttpClient with reasonable timeout - AI generation can be slow
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Send a chat prompt to Ollama and get a response.
     * 
     * @param request The chat request with prompt and optional model
     * @return ChatResponse containing the AI's response
     */
    public ChatResponse chat(ChatRequest request) {
        String model = (request.getModel() != null && !request.getModel().isBlank())
                ? request.getModel()
                : defaultModel;

        try {
            String aiText = callOllama(request.getPrompt(), model);
            return new ChatResponse(aiText, model, "success", null, LocalDateTime.now());
        } catch (Exception e) {
            return new ChatResponse(null, model, "error",
                    "AI request failed: " + e.getMessage() + 
                    ". Make sure Ollama is running (ollama serve) and the model is pulled (ollama pull " + model + ")",
                    LocalDateTime.now());
        }
    }

    /**
     * Summarize a piece of text (e.g., a note's content).
     * Uses prompt engineering to get a concise summary from any LLM.
     * 
     * @param content The text to summarize
     * @return The summary text
     */
    public String summarize(String content) throws Exception {
        if (content == null || content.isBlank()) {
            return "No content to summarize.";
        }

        // Truncate very long content to keep prompt size reasonable
        String truncated = content.length() > 4000 ? content.substring(0, 4000) : content;

        String prompt = "Summarize the following note in 2-3 concise sentences. " +
                "Focus on the key points and main ideas. Be direct and clear.\n\n" +
                "NOTE:\n" + truncated + "\n\nSUMMARY:";

        return callOllama(prompt, defaultModel);
    }

    /**
     * Generate study insights from session data.
     * The frontend passes in summary statistics, the AI generates encouraging analysis.
     * 
     * @param statsText Pre-formatted statistics about study sessions
     * @return AI-generated insights as text
     */
    public String generateInsights(String statsText) throws Exception {
        String prompt = "You are a friendly study coach. Based on the following study session statistics, " +
                "provide encouraging insights and 1-2 actionable tips. Keep it under 100 words and warm in tone.\n\n" +
                "STATISTICS:\n" + statsText + "\n\nINSIGHTS:";

        return callOllama(prompt, defaultModel);
    }

    /**
     * Core method: makes an HTTP POST to Ollama's /api/generate endpoint.
     * Ollama API docs: https://github.com/ollama/ollama/blob/main/docs/api.md
     */
    private String callOllama(String prompt, String model) throws Exception {
        // Build the JSON payload Ollama expects
        Map<String, Object> payload = Map.of(
                "model", model,
                "prompt", prompt,
                "stream", false  // Get the full response at once, not streamed
        );

        String jsonBody = objectMapper.writeValueAsString(payload);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(ollamaBaseUrl + "/api/generate"))
                .header("Content-Type", "application/json")
                .timeout(Duration.ofMinutes(2))  // AI can take a while
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Ollama returned status " + response.statusCode() +
                    ": " + response.body());
        }

        // Parse Ollama's JSON response and extract just the text
        JsonNode root = objectMapper.readTree(response.body());
        JsonNode responseField = root.get("response");

        if (responseField == null) {
            throw new RuntimeException("Unexpected Ollama response format: " + response.body());
        }

        return responseField.asText().trim();
    }

    /**
     * Health check - verify Ollama is reachable.
     */
    public boolean isOllamaAvailable() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(ollamaBaseUrl + "/api/tags"))
                    .timeout(Duration.ofSeconds(3))
                    .GET()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            return response.statusCode() == 200;
        } catch (Exception e) {
            return false;
        }
    }
}
