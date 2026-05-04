package edu.widgetwizards.studentassistant.entity;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Notes",
uniqueConstraints = @UniqueConstraint(columnNames = {"username", "title"})
)
// Will be used to store the notes data in the database
public class NotesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // assigns ID creation to the db server
    private int notesID;

    // These attributes are mapped to columns/attributes in the database
    @Column(columnDefinition="text")
    private String title;

    @Column(columnDefinition="text")
    private String content;

    @Column(columnDefinition="text")
    private String username;


    // Getters and setters
    public void setUsername(String username) {
        this.username = username;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public String getUsername() {
        return username;
    }

    


}
