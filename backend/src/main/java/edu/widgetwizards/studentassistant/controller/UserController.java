package edu.widgetwizards.studentassistant.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.widgetwizards.studentassistant.dto.PasswordDto;
import edu.widgetwizards.studentassistant.dto.UserDto;
import edu.widgetwizards.studentassistant.dto.UserRequestDto;
import edu.widgetwizards.studentassistant.dto.UsernameDto;
import edu.widgetwizards.studentassistant.service.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
@CrossOrigin(originPatterns = {
    "http://localhost:*",
    "http://127.0.0.1:*"
})
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UsernameDto> getAllUsernames() {
        return userService.getAllUsernames();
    }

    @GetMapping("/{username}")
    public PasswordDto getPassword(@PathVariable String username) {
        return userService.getPassword(username);
    }

    @PostMapping
    public UserDto createUser(@Valid @RequestBody UserRequestDto requestDto) {
        return userService.createUser(requestDto);
    }
}
