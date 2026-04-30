package edu.widgetwizards.studentassistant.dto;

import java.time.LocalDate;

// Keeps code secure: transfers data from the client to controller, ensures the user only has access to non-sensitive info
// This class is what frontend receives from backend
public class StudySessionDto {

    // Only attributes that frontend will need back
    private LocalDate date;
    private int duration;

    // Getters and setters
    public void setDate(LocalDate sessionDate) {
        // Frontend ensures the correct format, so backend doesn't need to do input validation
        date = sessionDate;
    }

    public void setDuration(int studyTime) {
        // Backend provides the correct input
        duration = studyTime;
    }

    public LocalDate getDate() {
        return date;
    }

    public int getDuration() {
        return duration;
    }
}
