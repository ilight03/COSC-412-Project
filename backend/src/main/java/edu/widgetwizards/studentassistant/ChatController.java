package edu.widgetwizards.studentassistant;
/*
 o Holds a the REST controller endpoint for sending a prompt to the model
 */

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final OllamaChatService chatService;

    public ChatController(OllamaChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/ask")
    public ChatResponse askModel(@RequestBody ChatRequest request) {
        return chatService.generateResponse(request);
    }
    

}
