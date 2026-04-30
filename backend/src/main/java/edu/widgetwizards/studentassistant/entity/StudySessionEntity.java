package edu.widgetwizards.studentassistant.entity;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Study_Sessions")
// Will be used to store the data in the database
public class StudySessionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // assigns ID creation to the db server
    private int studySessionID;

    // These are mapped to attributs/columns in the database
    @Column
    private LocalDate date;

    @Column
    private int duration;

    @Column(columnDefinition="text")
    private String username;

    // Getters and setters
    public void setUsername(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setDate(LocalDate sessionDate) {
        date = sessionDate;
    }

    public void setDuration(int studyTime) {
        duration = studyTime;
    }

    public LocalDate getDate() {
        return date;
    }

    public int getDuration() {
        return duration;
    }
    
}
