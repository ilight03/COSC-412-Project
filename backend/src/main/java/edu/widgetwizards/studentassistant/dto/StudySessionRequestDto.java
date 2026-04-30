package edu.widgetwizards.studentassistant.dto;
import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

// This differs from the StudySessionDto class in that it ensures valid date from frontend with the notnull notation
// This is the class that's used when receiving data from frontend
public class StudySessionRequestDto {

    // NotNull ensures valid input from frontend
    // Attributes that frontend must send for every put or post endpoint
    @NotNull private LocalDate date;
    @NotNull private int duration;
    @NotNull private String username;

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
