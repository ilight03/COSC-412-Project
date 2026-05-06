package edu.widgetwizards.studentassistant.dto;

import jakarta.validation.constraints.NotNull;

public class UserRequestDto {

    @NotNull private String username;
    @NotNull private String password;

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    public String getUsername() {
        return username;
    }
}
