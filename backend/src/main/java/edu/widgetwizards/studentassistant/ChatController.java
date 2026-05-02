package edu.widgetwizards.studentassistant;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @PostMapping("/save")
    public void saveChat(@RequestBody ChatHistory chatHistory) {
        // Save chat history to database (implement later if needed)
        System.out.println("User: " + chatHistory.getPrompt());
        System.out.println("AI: " + chatHistory.getResponse());
    }
}