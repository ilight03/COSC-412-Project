// Backend API configuration
// The backend (Spring Boot + Ollama) MUST be running locally on your machine.
//
// For local development (Live Server, etc.):  uses http://localhost:8080
// For Netlify-hosted frontend:                  also uses http://localhost:8080
//   Note: The Netlify site calls YOUR computer. Backend must be running locally.
//   If you deploy backend to a server, change the production URL below.
const config = {
    API_BASE_URL: 'http://localhost:8080'
  };
  
  window.APP_CONFIG = config;
