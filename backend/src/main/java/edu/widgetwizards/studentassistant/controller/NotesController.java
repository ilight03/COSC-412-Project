package edu.widgetwizards.studentassistant.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.widgetwizards.studentassistant.dto.NotesDto;
import edu.widgetwizards.studentassistant.dto.NotesRequestDto;
import edu.widgetwizards.studentassistant.service.NotesService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/notes")
// CORS now allows both local dev (Live Server, common dev ports) AND production Netlify URL.
@CrossOrigin(origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://localhost:3000",
        "http://localhost:8000",
        "https://student-assistant-412.netlify.app"
})
public class NotesController {

    private final NotesService notesService;

    public NotesController(NotesService notesService) {
        this.notesService = notesService;
    }

    @PostMapping
    // @RequestBody maps the JSON data from frontend and converts it to a NotesRequestDto object
    // Endpoint for saving a note to the database
    public NotesDto createNote(@Valid @RequestBody NotesRequestDto requestDto) {
        
        return notesService.createNote(requestDto); // calls session class method for logic
    
    }

    // NEEDS TO BE TESTED
    // Endpoint for retrieving a note from the database based on the username and title provided by frontend
    @GetMapping("/{username}/{title}")
    public NotesDto getNote(@PathVariable String username, @PathVariable String title) {
        return notesService.getNote(title, username); // calls session class method for logic
    }

    // NEEDS TO BE TESTED
    // Endpoint for deleting a note from the database based on the username and title provided by frontend
    @DeleteMapping("/{username}/{title}")
    @Transactional
    public void deleteNoteByTitle(@PathVariable String username, @PathVariable String title) {
        notesService.deleteNoteByUsernameAndTitle(username, title); // calls session class method for logic
    }

    // NEEDS TO BE TESTED
    @PutMapping("/{username}/{title}")
    public NotesDto updateNote(@PathVariable String username, @PathVariable String title, @Valid @RequestBody NotesRequestDto requestDto) { // requestDto accounts for all fields
        return notesService.updateNote(title, username, requestDto); // calls session class method for logic
    }
}