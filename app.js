//currently logged in username stored after button click
const username = localStorage.getItem("username");

const createTitleInput = document.getElementById("create-note-title");
const notesInput = document.getElementById("create-note-content");
const saveNoteButton = document.getElementById("save-note-button");

const loadSessionsButton = document.getElementById("load-sessions-button");
const sessionsDisplay = document.getElementById("sessions-display");

const searchTitleInput = document.getElementById("search-note-title");
const searchNoteButton = document.getElementById("search-note-button");

const retrievedNoteTitle = document.getElementById("retrieved-note-title");
const retrievedNoteContent = document.getElementById("retrieved-note-content");

const updateNoteButton = document.getElementById("update-note-button");
const deleteNoteButton = document.getElementById("delete-note-button");

const startButton = document.querySelector(".start");
const pauseButton = document.querySelector(".pause");
const clearButton = document.querySelector(".clear");
const minutesDisplay = document.querySelector(".minutes");
const secondsDisplay = document.querySelector(".seconds");

//stores sessions currently loaded from backend!!
let studySessions = [];

//timer duration gets tracked in seconds for my countdown math logic
const STUDY_MINUTES = 25;
const totalStudySeconds = STUDY_MINUTES * 60;
let remainingStudySeconds = totalStudySeconds;
//prevents duplicates saves if timer finishes and clear is pressed close together
let sessionSaved = false;
let interval;

//converts remaining seconds into MM:SS for display
function updateTimerDisplay() {
  if (!minutesDisplay || !secondsDisplay) {
    return;
  }

  const minutes = Math.floor(remainingStudySeconds / 60);
  const seconds = remainingStudySeconds % 60;

  minutesDisplay.textContent = minutes;
  secondsDisplay.textContent = String(seconds).padStart(2, "0");
}

//returns todays date in yyyy-mm-dd
function getDate() {
  const dateObject = new Date();
  let preformatDate = dateObject.toLocaleString('en-US', { timeZone: 'America/New_York' });
  // this manual construction is necessary because JavaScript uses a different timezone
  let date = preformatDate.substring(5,9)+ "-" + (dateObject.getMonth() + 1).toString().padStart(2, "0") + "-" + preformatDate.substring(2,4);
  return date;
}

//displays some fallback text when no sessions returned
function showSessionsMessage(message) {
  if (sessionsDisplay) {
    sessionsDisplay.value = message;
  }
}

//similar to above, but for notes
function showNoteMessage(message) {
  if (retrievedNoteTitle) {
    retrievedNoteTitle.value = "";
  }

  if (retrievedNoteContent) {
    retrievedNoteContent.value = message;
  }
}

//formats all retrieved sessions into lines for textarea
function displaySessions() {
  if (!sessionsDisplay) {
    return;
  }

  sessionsDisplay.value = studySessions
    .map((session) => `Date: ${session.date} | Duration: ${session.duration} minutes`)
    .join("\n");
}

//saves completed study sessions when timer hits 0 or clear is hit
function saveStudySession() {
  if (sessionSaved || !username) {
    return;
  }

  const completedSeconds = totalStudySeconds - remainingStudySeconds;

  if (completedSeconds <= 0) {
    return;
  }

  sessionSaved = true;

  const durationMinutes = Math.ceil(completedSeconds / 60);

  fetch("http://localhost:8080/studysessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      date: getDate(),
      duration: durationMinutes
    })
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to save session");
      }

      return response.text();
    })
    .catch((error) => {
      console.error("Error saving study session:", error);
      sessionSaved = false;
    });
}


function startTimer() {
  clearInterval(interval);

  interval = setInterval(() => {
    if (remainingStudySeconds <= 0) {
      clearInterval(interval);
      saveStudySession();
      return;
    }

    remainingStudySeconds -= 1;
    updateTimerDisplay();

    if (remainingStudySeconds === 0) {
      clearInterval(interval);
      saveStudySession();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
}

//clears timer and saves partial progress
function clearTimer() {
  clearInterval(interval);
  saveStudySession();
  remainingStudySeconds = totalStudySeconds;
  sessionSaved = false;
  updateTimerDisplay();
}

//retrieves ALL sessions for current user
//MIGHT CHANGE ENDPOINT HERE???
function loadSessions() {
  if (!username) {
    showSessionsMessage("Missing username.");
    return;
  }

  // Future backend hook: this endpoint may need to be adjusted once backend is finalized.
  fetch(`http://localhost:8080/studysessions/${username}`)
    .then(async (response) => {
      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error("Failed to load study sessions");
      }

      return response.json();
    })
    .then((data) => {
      if (!data || (Array.isArray(data) && data.length === 0)) {
        studySessions = [];
        showSessionsMessage("No study sessions logged yet.");
        return;
      }

      if (!Array.isArray(data)) {
        studySessions = [];
        showSessionsMessage("No study sessions logged yet.");
        return;
      }

      studySessions = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
      displaySessions();
    })
    .catch((error) => {
      console.error("Error loading sessions:", error);
      showSessionsMessage("Unable to load study sessions.");
    });
}

function noteSave() {
  if (!username || !createTitleInput || !notesInput) {
    return;
  }

  const title = createTitleInput.value.trim();

  if (!title) {
    showNoteMessage("Please enter a title before saving.");
    return;
  }

  fetch("http://localhost:8080/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      date: getDate(),
      title,
      content: notesInput.value
    })
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      return response.text();
    })
    .then(() => {
     /* if (retrievedNoteTitle) {
        retrievedNoteTitle.value = title;
      }

      if (retrievedNoteContent) {
        retrievedNoteContent.value = notesInput.value;
      }*/
    })
    .catch((error) => {
      console.error("Error saving note:", error);
      showNoteMessage("Unable to save note.");
    });
}

function loadSavedNotes() {
  if (!username || !searchTitleInput || !retrievedNoteTitle || !retrievedNoteContent) {
    return;
  }

  const rawTitle = searchTitleInput.value.trim();

  if (!rawTitle) {
    showNoteMessage("Please enter a title to search.");
    return;
  }

  const title = encodeURIComponent(rawTitle);

  fetch(`http://localhost:8080/notes/${username}/${title}`)
    .then(async (response) => {
      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error("Failed to load note");
      }

      return response.json();
    })
    .then((data) => {
      if (!data) {
        showNoteMessage("No note found with that title.");
        return;
      }

      retrievedNoteTitle.value = data.title || rawTitle;
      retrievedNoteContent.value = data.content || "";
    })
    .catch((error) => {
      console.error("Error loading note:", error);
      showNoteMessage("No note found with that title.");
    });
}

//updates existing note using the editable retrieved notes fields
function updateNote() {
  if (!retrievedNoteTitle || !retrievedNoteContent) {
    return;
  }

  const titleValue = retrievedNoteTitle.value.trim();

  if (!titleValue) {
    showNoteMessage("Please load or enter a note title first.");
    return;
  }

  const encodedTitle = encodeURIComponent(titleValue);

  fetch(`http://localhost:8080/notes/${username}/${encodedTitle}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({  
      username, 
      date: getDate(),
      title: titleValue,
      content: retrievedNoteContent.value
    })
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      return response.text();
    })
    .catch((error) => {
      console.error("Error updating note:", error);
      showNoteMessage("Unable to update note.");
    });
}

//deletes currently loaded note from the backend
function deleteNote() {
  if (!retrievedNoteTitle || !retrievedNoteContent || !searchTitleInput) {
    return;
  }

  const titleValue = retrievedNoteTitle.value.trim() || searchTitleInput.value.trim();

  if (!titleValue) {
    showNoteMessage("Please enter a title to delete.");
    return;
  }

  const encodedTitle = encodeURIComponent(titleValue);

  fetch(`http://localhost:8080/notes/${username}/${encodedTitle}`, {
    method: "DELETE"
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      retrievedNoteTitle.value = "";
      retrievedNoteContent.value = "";
    })
    .catch((error) => {
      console.error("Error deleting note:", error);
      showNoteMessage("Unable to delete note.");
    });
}

updateTimerDisplay();

//guarded (if wrapped) listeners prevent crashes if an element is missing from the page
if (startButton) {
  startButton.addEventListener("click", startTimer);
}

if (pauseButton) {
  pauseButton.addEventListener("click", stopTimer);
}

if (clearButton) {
  clearButton.addEventListener("click", clearTimer);
}

if (saveNoteButton) {
  saveNoteButton.addEventListener("click", noteSave);
}

if (searchNoteButton) {
  searchNoteButton.addEventListener("click", loadSavedNotes);
}

if (updateNoteButton) {
  updateNoteButton.addEventListener("click", updateNote);
}

if (deleteNoteButton) {
  deleteNoteButton.addEventListener("click", deleteNote);
}

if (loadSessionsButton) {
  loadSessionsButton.addEventListener("click", loadSessions);
}