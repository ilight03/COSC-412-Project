let minutes = 25;
let seconds = 0;
let interval;
const notesInput = document.querySelector('.notes-input');
const titleInput = document.querySelector('.title-input'); 
const notesSaveButton = document.querySelector('.notes-save');

// Date is sent back to the database
// I did some formatting things to ensure backend receives it smoothly since the database just uses year, month, and day, which differs from the JS Date object formatting

function startTimer() {
clearInterval(interval);
  interval = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        clearInterval(interval); // stop when done
        //iago: I moved the date creation inside the timer completion
        const dateObject = new Date();
        let date = dateObject.toISOString(); // date is the variable that should be used for sending the date to backend
        date = date.substring(0, 10); // ensures the right format for backend
        //fire
        fetch("http://localhost:8080/studysessions", {//fetches emmas local database api
        method: "POST",  //fetch is an http get by default so POST to write
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          date: date,
          duration: 25 //here i send 25 just assuming the user completed, I could add logic to dynamically send duration later.
          // that's all just parameters for fetch method, where, how, what to send, what type.
        })
      })
      .then(response => { // now this checks if the request succeeded and does crash on empty/non json
        if(!response.ok){ // only did this bc i didn't know if database returns json always or what.
          throw new Error("Failed to save session");
        }
        return response.text();
      }) //what to do if fetch work return response (safely)
      .then(data => console.log("Saved study session:", data)) //now we can use the data
      .catch(error => console.error("Error saving study session", error)) //error handling
        // [BACKEND] SESSION COMPLETION 
        // This is where you'd log a completed Pomodoro session to the DB.
        // Example API call:
        //   POST /api/sessions { userId, duration: 25, completedAt: new Date() }
        // You could also fetch updated stats to display (e.g., sessions today)
        //

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
  if (!notesInput || !titleInput) {
    return;
  }

  // Currently saves to localStorage (browser only — not persisted to DB)
  localStorage.setItem('studentHelperNotes', notesInput.value);

  //Add notes title to this 
  localStorage.setItem('studentHelperNotesTitle', titleInput.value)
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

  /*

  fetch("http://localhost:8080/notes", {

    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: titleInput.value,
      content: notesInput.value,
      savedAt: new Date().toISOString()
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
  */
}

function loadSavedNotes() {
  if (!notesInput || !titleInput) {
    return;
  }

  // Currently loads from localStorage (browser only)
  notesInput.value = localStorage.getItem('studentHelperNotes') || '';
  titleInput.value = localStorage.getItem('studentHelperNotesTitle') || '';

  // [BACKEND] LOAD NOTE FROM DATABASE
  // Replace or supplement this with a fetch call to retrieve the user's saved note.
  // Example:
  //   GET /api/notes?userId=123
  //   → { content: "My saved notes..." }
  //
  // Then set: notesInput.value = data.content || '';
  //
  // Consider keeping localStorage as an offline/guest fallback.

  // [BACKEND] LOAD NOTE FROM DATABASE

  // Future fetch idea:

  /*

  fetch("http://localhost:8080/notes")

    .then(response => response.json())
    .then(data => {
      titleInput.value = data.title || '';
      notesInput.value = data.content || '';
    })
    .catch(error => console.error("Error loading note:", error));
  */

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
