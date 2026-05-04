package edu.widgetwizards.studentassistant.service;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import edu.widgetwizards.studentassistant.dto.NotesDto;
import edu.widgetwizards.studentassistant.dto.NotesRequestDto;
import edu.widgetwizards.studentassistant.entity.NotesEntity;
import edu.widgetwizards.studentassistant.repository.NotesRepository;

@Service
public class NotesService {
    private final NotesRepository notesRepository;


    public NotesService(NotesRepository notesRepository) {
        this.notesRepository = notesRepository;
    }

    
    // Logic for creating a note
    public NotesDto createNote(NotesRequestDto requestDto) {
        // Look for an existing note with this username + title
        Optional<NotesEntity> existing = notesRepository.findByUsernameAndTitleLike(
            requestDto.getUsername(), 
            requestDto.getTitle()
        );
    
        NotesEntity notesEntity;
        if (existing.isPresent()) {
            // Update the existing note
            notesEntity = existing.get();
            notesEntity.setContent(requestDto.getContent());
        } else {
            // Create a new one
            notesEntity = new NotesEntity();
            notesEntity.setTitle(requestDto.getTitle());
            notesEntity.setContent(requestDto.getContent());
            notesEntity.setUsername(requestDto.getUsername());
        }
    
        return toDto(notesRepository.save(notesEntity));
    }
        
   
    // Logic for retrieving a note based on a title and username sent by frontend
    public NotesDto getNote(String title, String username) {
        Optional<NotesEntity> returnedEntity = notesRepository.findByUsernameAndTitleLike(username, title);
        if(!returnedEntity.isEmpty()) { // if the requested note is found
            return toDto(returnedEntity.get()); // return it as a note dto
        } else {
            return null; // if this doesn't work, I can try returning returnedEntity.get()
        }
            
    }

    // Deletes the requested note if found
    public void deleteNoteByUsernameAndTitle(String username, String title) {
        notesRepository.deleteByUsernameAndTitle(username, title);
    }

    // Logic for updating a note
    // Takes in the title, username, and request DTO from the controller class
    // The parameters listed above come from frontend
    // This method searches for the note that frontend wants to update
    // If found, it returns the note to this service class method, makes the appropriate modifications,
    // saves the note to the database, and returns it as a dto to the controller class
    // Otherwise, it returns a null to the controller class
    public NotesDto updateNote(String title, String username, NotesRequestDto requestDto) {
        // Find the requested note
        Optional<NotesEntity> returnedEntity = notesRepository.findByUsernameAndTitleLike(username, title);
        if(!returnedEntity.isEmpty()) { // If the requested note was found
            // Update all fields
            NotesEntity notesEntity = returnedEntity.get(); // .get() extracts the NotesEntity from the Optional wrapper
            notesEntity.setTitle(requestDto.getTitle());
            notesEntity.setContent(requestDto.getContent());
            notesEntity.setUsername(username);
            // Saves the updated note in the database and returns a note dto to the controller class
            return toDto(notesRepository.save(notesEntity));
        } else {
            return null; // if the requested note wasn't found, return null to the controller class
        }
       
    }

    public List<NotesDto> getAllTitles(String username) {
        List<NotesEntity> entityList = notesRepository.findByUsernameEquals(username);
        List<NotesDto> dtoList = new ArrayList<>();
     
        if (!entityList.isEmpty()) { // If the list isn't empty
            for(int i = 0; i < entityList.size(); i++) {
                dtoList.add(toDto(entityList.get(i))); // Convert every entity in the list to a dto
            }
        }  // if the list is empty, this method returns an empty list


        return dtoList;
    }


    // Converts a NotesEntity into a NotesDto (because frontend needs a DTO back)
    private NotesDto toDto(NotesEntity notesEntity) {
        NotesDto dto = new NotesDto();
        dto.setTitle(notesEntity.getTitle());
        dto.setContent(notesEntity.getContent());
        return dto;
    }
}

