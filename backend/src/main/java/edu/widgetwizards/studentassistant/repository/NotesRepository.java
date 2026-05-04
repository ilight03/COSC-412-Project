package edu.widgetwizards.studentassistant.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.widgetwizards.studentassistant.entity.NotesEntity;

public interface NotesRepository extends JpaRepository<NotesEntity, Integer> {
    
    // Query used for finding specific notes in the database
    // Will only return a note entity where the username is the same and the title is similar
    // note entity is converted into a dto in the service class
    Optional <NotesEntity> findByUsernameAndTitle(String username, String title);

    // could alter this to return an int or long, which indicates the number of rows that were deleted
    // could also just leave it as void though. Not sure how that would impact frontend
    void deleteByUsernameAndTitle(String username, String title);

    List<NotesEntity> findByUsernameEquals(String username);

}
