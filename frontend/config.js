const config = {
  API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8080'           // dev
    : 'https://exorcist-yam-factsheet.ngrok-free.dev'  // change before each demo
};
window.APP_CONFIG = config;