
const username = localStorage.getItem("username");
const notesInput = document.querySelector('.notes-input');
const titleInput = document.querySelector('.title-input');
const notesSaveButton = document.querySelector('.notes-save');
let studySessions = [];
const sessionsList = document.querySelector('.sessions-list');
// total session length (25 minutes)
const STUDY_MINUTES = 25;
const totalStudySeconds = STUDY_MINUTES * 60;
// this value counts down during the session
let remainingStudySeconds = totalStudySeconds;
// prevents duplicate saves (ex: clear + finish both firing)
let sessionSaved = false;
let interval
function updateTimerDisplay() {//updates UI and converts minutes to seconds

  const minutes = Math.floor(remainingStudySeconds / 60);
  const seconds = remainingStudySeconds % 60;
  document.querySelector('.minutes').textContent = minutes;
  document.querySelector('.seconds').textContent = String(seconds).padStart(2, '0');
}
// Date is sent back to the database
// I did some formatting things to ensure backewhy nd receives it smoothly since the database just uses year, month, and day, which differs from the JS Date object formatting
function getDate() {
  const dateObject = new Date(); // created right here
  return dateObject.toISOString().substring(0, 10);
}
// 1. timer finishes
// 2. user presses clear

function saveStudySession() {

  // don’t save twice
  if (sessionSaved) return;
  const completedSeconds = totalStudySeconds - remainingStudySeconds;
  // don’t save if user didn’t actually study
  if (completedSeconds <= 0) return;
  sessionSaved = true;
  const durationMinutes = Math.ceil(completedSeconds / 60);
  fetch("http://localhost:8080/studysessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,      // identifies user
      date: getDate(),         // when session happened
      duration: durationMinutes // how long they studied
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to save session");
    }
    return response.text();
  })
  .then(data => console.log("Saved study session:", data))
  .catch(error => console.error("Error saving study session:", error));
}

function startTimer() {
  clearInterval(interval);
  interval = setInterval(() => {
    // if timer already done
    if (remainingStudySeconds <= 0) {
      clearInterval(interval);
      saveStudySession();
      return;
    }
    // decrease time
    remainingStudySeconds--;
    // update UI
    updateTimerDisplay();
    // if it JUST hit zero, save session
    if (remainingStudySeconds === 0) {
      clearInterval(interval);
      saveStudySession();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval); // pause the timer
}

function clearTimer() {
    clearInterval(interval);

    //clear timer and save partial session
    saveStudySession();
    remainingStudySeconds = totalStudySeconds;
    sessionSaved = false;
    updateTimerDisplay();
}

// initialize UI on page load
updateTimerDisplay();
function loadSessions() {
  if (!username || !titleInput) {
    console.error("Missing username or title");//this is the error handling for no saved sessions
    return;
  }
   const title = encodeURIComponent(titleInput.value.trim());
  if (!title) {
    console.log("No title provided fetch skipped");
    return;
  }

  fetch("http://localhost:8080/studysessions?username=${username}&title=${title}")
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to load study sessions");
      }
      return response.json();
    })
    .then(data => {
      studySessions = data;
      // newest sessions first
      studySessions.sort((a, b) => new Date(b.date) - new Date(a.date));
      displaySessions();
    })
    .catch(error => console.error("Error loading sessions:", error));
}


// ----------- NOTE FUNCTIONALITY--------------------
function noteSave() {
  if (!notesInput || !titleInput) {
    return;
  }

  // Currently saves to localStorage (browser only — not persisted to DB)
  //localStorage.setItem('studentHelperNotes', notesInput.value);

  //Add notes title to this 
  //localStorage.setItem('studentHelperNotesTitle', titleInput.value)
  // [BACKEND] SAVE NOTE TO DATABASE
  // Replace or supplement the localStorage call above with an API request.
  // Example:
  //   const userId = getCurrentUserId(); // however you handle auth
  //   POST /api/notes { userId, content: notesInput.value, savedAt: new Date() }
  //
  // On success, you might show a confirmation message to the user.
  // On failure, the localStorage save above acts as a fallback.
  // [BACKEND] SAVE NOTE TO DATABASE

  // Future fetch idea:

  

  fetch("http://localhost:8080/notes", {

    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: titleInput.value,
      content: notesInput.value,
      username: username
      
    })
  })
  .then(response => {

    if (!response.ok) {
      throw new Error("Failed to save note");
    }
    return response.text();
  })
  .then(data => console.log("Saved note:", data))
  .catch(error => console.error("Error saving note:", error));
  
}

function loadSavedNotes() {
  if (!notesInput || !titleInput) {
    console.log("Missing username or title, fetch skipped.")
    return;
  }
  //gets rid of spaces
  const title = encodeURIComponent(titleInput.value.trim());
  // Currently loads from localStorage (browser only)
  notesInput.value = localStorage.getItem('studentHelperNotes') || '';
  titleInput.value = localStorage.getItem('studentHelperNotesTitle') || '';


  fetch("http://localhost:8080/notes/${username}/${title}")

     .then(response => {
      if (!response.ok) {
        throw new Error("Note not found");
      }
      return response.json();
    })
    .then(data => {
      titleInput.value = data.title || '';
      notesInput.value = data.content || '';
    })
    .catch(error => console.error("Error loading note:", error));
}

// event listeners that wait for buttons to be clicked, and when click call methods
document.querySelector('.start').addEventListener('click', startTimer);
document.querySelector('.end').addEventListener('click', stopTimer);
document.querySelector('.clear').addEventListener('click', clearTimer);

if (notesSaveButton) {
  notesSaveButton.addEventListener('click', noteSave);
}

// Load notes on page init
// [BACKEND] Once DB integration is in place, this should await the fetch call
// before rendering, to avoid a flash of empty content
loadSavedNotes();
