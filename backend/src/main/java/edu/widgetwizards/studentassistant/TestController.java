package edu.widgetwizards.studentassistant;

import java.sql.Connection;

import javax.sql.DataSource;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    private final DataSource dataSource;

    public TestController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/testdb")
    public String testDB() {
        try (Connection conn = dataSource.getConnection()) {
            return "Connected to Neon DB successfully!";
        } catch (Exception e) {
            return "Failed to connect: " + e.getMessage();
        }
    }
}