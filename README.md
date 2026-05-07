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

# Dependencies (DO BEFORE RUNNING): 
### Java
- Java 17 needs to be installed and available on your path

### Live Server
- As a VScode Extension, Install live server. 
- After installation you should see a "Go Live" button on the bottom right corner of the window.

### AI Model 
### Step 1: Download Ollama
- Download Ollama launcher at this link: [Ollama](https://ollama.com/download/windows)
- You will be prompted to make an account with them. 
    - **Verify by running the command in PowerShell:**
    ```powershell
    ollama --version 
    ```
    - this should return the current version number 
    ```powershell
    ollama --version
    ollama version is 0.21.0
    ```
### Step 2: Install the model (Gemma:2b)
- Now Run: 
    ```powershell
    ollama run gemma:2b` 
    ```

    - After the install finishes, you will will be met with:
    ```powershell
    ollama run gemma:2b
    >>> Send a message (/? for help)
    ```
    - End the instance of the model.
    ```powershell
    /bye
    ```
    - **Verify the model is installed properly by running**
    ```powershell
        ollama list
    ```
    - This will list out all of the models currently installed. 
    ```powershell
    ollama list
    NAME        ID              SIZE      MODIFIED       
    gemma:2b    b50d6c999e59    1.7 GB    30 minutes ago    
    ```
    - You should see the model name, size, ID , and date modified in a collumn. 


## Manual Start Commands (Windows PowerShell)



*If you prefer to run the components separately, open **PowerShell** and execute these commands in order:*

### Step 1: Start Ollama
- With the project open on VScode, in project terminal 
```powershell
ollama serve
```

#### For troubleshooting:
Ollama will listen on `http://localhost:11434`. 
If You're returned: 
```powershell
    Error: listen tcp 127.0.0.1:11434: bind: Only one usage of each socket address (protocol/network address/port) is normally permitted.
```
Run: 

```powershell
netstat -ano | findstr :11434
```

If you see an instance of: 

```powershell
    TCP    127.0.0.1:11434        0.0.0.0:0              LISTENING       29652
    TCP    127.0.0.1:52315        127.0.0.1:11434        TIME_WAIT       0
  ```
  Terminate that process by the last number of the service
  ```powershell
    taskkill /PID <last number of service. In this case: 29652> /F
```
### Step 2: Pull the Model 
```powershell
ollama pull gemma:2b
```

### Step 3: Start the Backend 
Navigate to the project's `backend` folder and run:
```powershell
cd backend
./mvnw.cmd spring-boot:run
```
Wait for the message: `Started StudentassistantApplication in X seconds`. Backend will be at `http://localhost:8080`.

### Step 4: Start the Frontend
1. Open the project folder in VS Code.
2. Right-click on `frontend/login.html` and select **"Open with Live Server"**.
3. Your browser will open to the login page automatically.



