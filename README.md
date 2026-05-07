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

# Install Homebrew if you don't have it (Mac)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Java, Postgres, Node, and Ollama (Mac/Linux)
brew install --cask temurin@17
brew install postgresql@16 node
brew install --cask ollama
brew services start postgresql@16

# Install Java, Postgres, Node, and Ollama (Windows)
winget install EclipseAdoptium.Temurin.17.JDK
winget install OpenJS.NodeJS.LTS
winget install PostgreSQL.PostgreSQL.16
winget install Ollama.Ollama
createdb studentassistant

# Configure database credentials on application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/studentassistant
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update

## 3. How to Run the Application

1. Open the project folder in VS Code.
2. Open the terminal and use the command 'cd backend' to make your way to the backend files
3. Once there, in the terminal use the command 'mvnw.cmd clean install' (For Windows), or './mvnw clean install' to start the backend so that it can receive requests from the frontend
4. Open a new terminal, and use the commad 'ollama pull gemma2:2b' to download AI model
5. After the model as been downloaded, use the command 'ollama serve', this will start the AI model
6. You can now go to the file 'login.html' and right-click on the file to open it with a Live Server
7. This should open application in the user's browser







spring.datasource.url=jdbc:postgresql://localhost:5432/studentassistant
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update


