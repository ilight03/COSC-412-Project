package edu.widgetwizards.studentassistant.service;


import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import edu.widgetwizards.studentassistant.dto.StudySessionDto;
import edu.widgetwizards.studentassistant.dto.StudySessionRequestDto;
import edu.widgetwizards.studentassistant.entity.StudySessionEntity;
import edu.widgetwizards.studentassistant.repository.StudySessionRepository;

@Service
public class StudySessionService {
    
    private final StudySessionRepository sessionRepository;


    public StudySessionService(StudySessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    // Logic for saving a study session to the database
    public StudySessionDto createSession(StudySessionRequestDto requestDto) {
        StudySessionEntity studySessionEntity = new StudySessionEntity();
        // Set all of the entity's attributes based on the values received from frontend
        studySessionEntity.setDate(requestDto.getDate());
        studySessionEntity.setDuration(requestDto.getDuration());       
        studySessionEntity.setUsername(requestDto.getUsername());
        
        return toDto(sessionRepository.save(studySessionEntity));
    }

    
    // Logic for retrieving all of the study sessions associated with the username sent by frontend
    public List<StudySessionDto> getAllStudySessions(String username) {
        List<StudySessionEntity> entityList = sessionRepository.findByUsernameEquals(username);
        List<StudySessionDto> dtoList = new ArrayList<>();
      
        if (!entityList.isEmpty()) { // If the list isn't empty
            for(int i = 0; i < entityList.size(); i++) {
                dtoList.add(toDto(entityList.get(i))); // Convert every entity in the list to a dto
            }
        }  // if the list is empty, this method returns an empty list

        return dtoList;

        
     
    }

    // Converts a study session entity into a dto that's sent back to frontend
    private StudySessionDto toDto(StudySessionEntity sessionEntity) {
        StudySessionDto dto = new StudySessionDto();
        dto.setDate(sessionEntity.getDate());
        dto.setDuration(sessionEntity.getDuration());
        return dto;
    }
}
