package edu.widgetwizards.studentassistant.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.widgetwizards.studentassistant.entity.StudySessionEntity;

// Talks to the service class and the database
public interface StudySessionRepository extends JpaRepository<StudySessionEntity, Integer> {
    // JpaRepository API provides the implementation at runtime
    // Queries needed for CRUD operations
    // all methods should return the object type StudySessionEntity

    // Searches the database for all study sessions with a username attribute value matching that of the username provided
    // by frontend
    // Returns a list of study session entities that are then converted to dtos in the service class
    List<StudySessionEntity> findByUsernameEquals(String username);
    
}
