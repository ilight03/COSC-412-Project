package edu.widgetwizards.studentassistant;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.widgetwizards.studentassistant.service.AIService;

/**
 * ChatController - All AI-related endpoints.
 * 
 * Endpoints:
 *   POST /api/chat       - General chat with the AI
 *   POST /api/summarize  - Summarize a note's content
 *   POST /api/insights   - Generate insights from study session statistics
 *   GET  /api/ai/health  - Check if Ollama backend is reachable
 *   POST /api/chat/save  - Save chat history to console (DB integration TBD)
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://localhost:3000",
        "http://localhost:8000",
        "https://student-assistant-412.netlify.app",
        "https://exorcist-yam-factsheet.ngrok-free.dev"

})
public class ChatController {

    private final AIService aiService;

    public ChatController(AIService aiService) {
        this.aiService = aiService;
    }

    /**
     * General chat endpoint - send any prompt, get an AI response.
     */
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        if (request.getPrompt() == null || request.getPrompt().isBlank()) {
            return ResponseEntity.badRequest().body(
                new ChatResponse(null, null, "error", "Prompt cannot be empty", null)
            );
        }

        ChatResponse response = aiService.chat(request);
        
        if ("error".equals(response.getStatus())) {
            return ResponseEntity.status(500).body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Summarize a note's content.
     * Expects body: { "content": "..." }
     * Returns: { "summary": "..." }
     */
    @PostMapping("/summarize")
    public ResponseEntity<Map<String, String>> summarize(@RequestBody Map<String, String> body) {
        String content = body.get("content");

        if (content == null || content.isBlank()) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Content cannot be empty")
            );
        }

        try {
            String summary = aiService.summarize(content);
            return ResponseEntity.ok(Map.of("summary", summary));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                Map.of("error", "Failed to generate summary: " + e.getMessage())
            );
        }
    }

    /**
     * Generate AI insights from pre-calculated study statistics.
     * Expects body: { "stats": "User completed 15 sessions, 380 minutes total..." }
     * Returns: { "insights": "..." }
     */
    @PostMapping("/insights")
    public ResponseEntity<Map<String, String>> insights(@RequestBody Map<String, String> body) {
        String stats = body.get("stats");

        if (stats == null || stats.isBlank()) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Stats cannot be empty")
            );
        }

        try {
            String insights = aiService.generateInsights(stats);
            return ResponseEntity.ok(Map.of("insights", insights));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                Map.of("error", "Failed to generate insights: " + e.getMessage())
            );
        }
    }

    /**
     * Health check - is Ollama running?
     * Visit http://localhost:8080/api/ai/health to verify setup.
     */
    @GetMapping("/ai/health")
    public ResponseEntity<Map<String, Object>> health() {
        boolean available = aiService.isOllamaAvailable();
        return ResponseEntity.ok(Map.of(
            "ollamaAvailable", available,
            "message", available 
                ? "Ollama is running and ready!" 
                : "Ollama is NOT reachable. Start it with: ollama serve"
        ));
    }

    
}