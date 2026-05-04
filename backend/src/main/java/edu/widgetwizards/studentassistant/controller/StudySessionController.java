package edu.widgetwizards.studentassistant.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.widgetwizards.studentassistant.dto.StudySessionDto;
import edu.widgetwizards.studentassistant.dto.StudySessionRequestDto;
import edu.widgetwizards.studentassistant.service.StudySessionService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/studysessions")
// CORS now allows both local dev AND production Netlify URL
@CrossOrigin(origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://localhost:3000",
        "http://localhost:8000",
        "https://student-assistant-412.netlify.app"
})
// This class talks to the client code
// It also talks to the service class
// Handles the HTTP requests
public class StudySessionController {
    
    private final StudySessionService sessionService;

    public StudySessionController(StudySessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping
    // @RequestBody maps the JSON data from frontend and converts it to a StudySessionRequestDto object
    // Endpoint for saving a study session
    public StudySessionDto createStudySession(@Valid @RequestBody StudySessionRequestDto requestDto) {
        
        return sessionService.createSession(requestDto); // calls session class method for logic
    
    }


    @GetMapping("/{username}")
    // Endpoint for fetching all study sessions for a username provided by frontend
    public List<StudySessionDto> getAllStudySessions(@PathVariable String username) {
        return sessionService.getAllStudySessions(username); // calls session class method for logic
    }
}