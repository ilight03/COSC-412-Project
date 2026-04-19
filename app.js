let minutes = 25;
let seconds = 0;
let interval;
const notesInput = document.querySelector('.notes-input');
const notesSaveButton = document.querySelector('.notes-save');

function startTimer() {
clearInterval(interval);
  interval = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        clearInterval(interval); // stop when done


        // [BACKEND] SESSION COMPLETION 
        // This is where you'd log a completed Pomodoro session to the DB.
        // Example API call:
        //   POST /api/sessions { userId, duration: 25, completedAt: new Date() }
        // You could also fetch updated stats to display (e.g., sessions today)
        return;
      }
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }

    // update the display
    document.querySelector('.minutes').textContent = minutes;
    document.querySelector('.seconds').textContent = String(seconds).padStart(2, '0');
  }, 1000);
}

function stopTimer() {
  clearInterval(interval); // pause the timer
}

function clearTimer() {
    clearInterval(interval);

    // reset timer state to default
    minutes = 25;
    seconds = 0;
    document.querySelector('.minutes').textContent = minutes;
    document.querySelector('.seconds').textContent = '00';

}


// ----------- NOTE FUNCTIONALITY--------------------
function noteSave() {
  if (!notesInput) {
    return;
  }

  // Currently saves to localStorage (browser only — not persisted to DB)
  localStorage.setItem('studentHelperNotes', notesInput.value);

  // [BACKEND] SAVE NOTE TO DATABASE
  // Replace or supplement the localStorage call above with an API request.
  // Example:
  //   const userId = getCurrentUserId(); // however you handle auth
  //   POST /api/notes { userId, content: notesInput.value, savedAt: new Date() }
  //
  // On success, you might show a confirmation message to the user.
  // On failure, the localStorage save above acts as a fallback.
}

function loadSavedNotes() {
  if (!notesInput) {
    return;
  }

  // Currently loads from localStorage (browser only)
  notesInput.value = localStorage.getItem('studentHelperNotes') || '';

  // [BACKEND] LOAD NOTE FROM DATABASE
  // Replace or supplement this with a fetch call to retrieve the user's saved note.
  // Example:
  //   GET /api/notes?userId=123
  //   → { content: "My saved notes..." }
  //
  // Then set: notesInput.value = data.content || '';
  //
  // Consider keeping localStorage as an offline/guest fallback.

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
