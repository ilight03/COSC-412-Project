package edu.widgetwizards.studentassistant.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import edu.widgetwizards.studentassistant.dto.PasswordDto;
import edu.widgetwizards.studentassistant.dto.UserDto;
import edu.widgetwizards.studentassistant.dto.UserRequestDto;
import edu.widgetwizards.studentassistant.dto.UsernameDto;
import edu.widgetwizards.studentassistant.entity.UserEntity;
import edu.widgetwizards.studentassistant.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UsernameDto> getAllUsernames() {
        List<UserEntity> entityList = userRepository.findAll();
        List<UsernameDto> dtoList = new ArrayList<>();

        if (!entityList.isEmpty()) {
            for (int i = 0; i < entityList.size(); i++) {
                dtoList.add(toUsernameDto(entityList.get(i)));
            }
        }

        return dtoList;
    }

    public PasswordDto getPassword(String username) {
        Optional<UserEntity> returnedEntity = userRepository.findByUsername(username);
        if (!returnedEntity.isEmpty()) {
            return toPasswordDto(returnedEntity.get());
        } else {
            return null;
        }
    }

    public UserDto createUser(UserRequestDto requestDto) {
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(requestDto.getUsername());
        userEntity.setPassword(requestDto.getPassword());
        return toDto(userRepository.save(userEntity));
    }

    private UserDto toDto(UserEntity userEntity) {
        UserDto dto = new UserDto();
        dto.setUsername(userEntity.getUsername());
        dto.setPassword(userEntity.getPassword());
        return dto;
    }

    private UsernameDto toUsernameDto(UserEntity userEntity) {
        UsernameDto usernameDto = new UsernameDto();
        usernameDto.setUsername(userEntity.getUsername());
        return usernameDto;
    }

    private PasswordDto toPasswordDto(UserEntity userEntity) {
        PasswordDto passwordDto = new PasswordDto();
        passwordDto.setPassword(userEntity.getPassword());
        return passwordDto;
    }
}
