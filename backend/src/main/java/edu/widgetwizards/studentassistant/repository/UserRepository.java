package edu.widgetwizards.studentassistant.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.widgetwizards.studentassistant.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    @Override
    List<UserEntity> findAll();

    Optional<UserEntity> findByUsername(String username);
}
