# Student Note-taking Assistant 
### A note-taking app that utilizes a LLM to assist with studies.  

## Technology Stack 

### Frontend
- HTML, CSS, and JavaScript
- Static UI files located in the `frontend` folder

### Backend
- Java 17
- Spring Boot 3.x
- Spring Web for REST endpoints
- Spring Data JPA for database access

### AI Integration
- Ollama running locally on the user's computer
- Local model: `gemma4`
- Java `HttpClient` and Jackson for API communication and JSON handling

### Database
- PostgreSQL
- JPA entities, repositories, and services for notes and study sessions

## 2. Prerequisites

If you already have VS Code and your hardware meets the requirements, you still need the following software ready before running the app:

- Java 17 installed and available on your PATH
- Ollama installed locally
- Live Server Extension installed on VScode

## 3. How to Run the Application

1. Open the project folder in VS Code.
2. Double-click `START_STUDENT_ASSISTANT.bat` in the project root.
3. Wait for the batch file to finish starting the services.
4. Now open  `frontend\login.html` on live server 
5. Use the main page to create notes, review study sessions, and try the AI features.

### What the batch file does
- First checks for Java 17, the bundled Maven wrapper, and Ollama with the `gemma2` model.
- Starts the Ollama server locally on your machine.
- Pulls the configured AI model, which is currently `gemma2`.
- Launches the Spring Boot backend using the bundled Maven wrapper.
- Opens the frontend login page in your browser.
- Connects the frontend to the backend on `http://localhost:8080`.



