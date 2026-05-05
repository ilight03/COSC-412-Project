// ==================== Configuration ====================
const API_BASE_URL = window.APP_CONFIG?.API_BASE_URL || "http://localhost:8080";

const username = sessionStorage.getItem("username") || localStorage.getItem("username");
if (!username) {
  window.location.href = "login.html";
  throw new Error("Not logged in - redirecting");
}

// ==================== DOM References ====================
const createTitleInput = document.getElementById("create-note-title");
const notesInput = document.getElementById("create-note-content");
const saveNoteButton = document.getElementById("save-note-button");
const noteSaveMessage = document.getElementById("note-save-message");

const loadSessionsButton = document.getElementById("load-sessions-button");
const sessionsDisplay = document.getElementById("sessions-display");

const searchTitleInput = document.getElementById("search-note-title");
const searchNoteButton = document.getElementById("search-note-button");

const retrievedNoteTitle = document.getElementById("retrieved-note-title");
const retrievedNoteContent = document.getElementById("retrieved-note-content");
const noteActionMessage = document.getElementById("note-action-message");

const updateNoteButton = document.getElementById("update-note-button");
const deleteNoteButton = document.getElementById("delete-note-button");

const generateSummaryButton = document.getElementById("generate-summary-button");
const summaryDisplay = document.getElementById("summary-display");
const generateInsightsButton = document.getElementById("generate-insights-button");

const startButton = document.querySelector(".start");
const pauseButton = document.querySelector(".pause");
const clearButton = document.querySelector(".clear");
const minutesDisplay = document.querySelector(".minutes");
const secondsDisplay = document.querySelector(".seconds");

// ==================== Timer State ====================
let studySessions = [];
const STUDY_MINUTES = 25;
const totalStudySeconds = STUDY_MINUTES * 60;
let remainingStudySeconds = totalStudySeconds;
let sessionSaved = false;
let interval;

// ==================== Helpers ====================
function updateTimerDisplay() {
  if (!minutesDisplay || !secondsDisplay) {
    return;
  }

  const minutes = Math.floor(remainingStudySeconds / 60);
  const seconds = remainingStudySeconds % 60;

  minutesDisplay.textContent = minutes;
  secondsDisplay.textContent = String(seconds).padStart(2, "0");
}

function getDate() {
  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York"
  }).formatToParts(new Date());

  const year = dateParts.find((part) => part.type === "year")?.value;
  const month = dateParts.find((part) => part.type === "month")?.value?.padStart(2, "0");
  const day = dateParts.find((part) => part.type === "day")?.value?.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function showSessionsMessage(message) {
  if (sessionsDisplay) {
    sessionsDisplay.value = message;
  }
}

function showNoteMessage(message) {
  if (retrievedNoteTitle) {
    retrievedNoteTitle.value = "";
  }

  if (retrievedNoteContent) {
    retrievedNoteContent.value = message;
  }
}

function showNoteSaveMessage(message) {
  if (noteSaveMessage) {
    noteSaveMessage.textContent = message;
  }
}

function showNoteActionMessage(message) {
  if (noteActionMessage) {
    noteActionMessage.textContent = message;
  }
}

function setOriginalRetrievedNoteContent(content) {
  if (retrievedNoteContent) {
    retrievedNoteContent.dataset.originalContent = content;
  }
}

function displaySessions() {
  if (!sessionsDisplay) {
    return;
  }

  sessionsDisplay.value = studySessions
    .map((session) => `Date: ${session.date} | Duration: ${session.duration} minutes`)
    .join("\n");
}

// ==================== Timer Logic ====================
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

  fetch(`${API_BASE_URL}/studysessions`, {
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

function clearTimer() {
  clearInterval(interval);
  saveStudySession();
  remainingStudySeconds = totalStudySeconds;
  sessionSaved = false;
  updateTimerDisplay();
}

// ==================== Study Sessions ====================
function loadSessions() {
  if (!username) {
    showSessionsMessage("Missing username. Please log in.");
    return;
  }

  fetch(`${API_BASE_URL}/studysessions/${username}`)
    .then(async (response) => {
      if (response.status === 404) {
        return [];
      }

      if (!response.ok) {
        throw new Error("Failed to load study sessions");
      }

      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) {
        studySessions = [];
        showSessionsMessage("No study sessions logged yet.");
        return;
      }

      studySessions = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
      displaySessions();
    })
    .catch((error) => {
      console.error("Error loading sessions:", error);
      showSessionsMessage("Unable to load study sessions. Is the backend running?");
    });
}

// ==================== Notes (CRUD) ====================
function noteSave() {
  if (!username || !createTitleInput || !notesInput) {
    return;
  }

  const title = createTitleInput.value.trim();

  if (!title) {
    showNoteSaveMessage("");
    showNoteActionMessage("");
    showNoteMessage("Please enter a title before saving.");
    return;
  }

  showNoteSaveMessage("");
  showNoteActionMessage("");

  fetch(`${API_BASE_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
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
      showNoteSaveMessage("Note saved successfully");
    })
    .catch((error) => {
      console.error("Error saving note:", error);
      showNoteSaveMessage("");
      showNoteMessage("Unable to save note.");
    });
}

function loadSavedNotes() {
  if (!username || !searchTitleInput || !retrievedNoteContent) {
    return;
  }

  const rawTitle = searchTitleInput.value.trim();
  if (!rawTitle) {
    showNoteActionMessage("");
    showNoteMessage("Please enter a title to search.");
    return;
  }

  const title = encodeURIComponent(rawTitle);

  fetch(`${API_BASE_URL}/notes/${username}/${title}`)
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
      if (!data || !data.title) {
        showNoteActionMessage("");
        showNoteMessage("No note found with that title.");
        return;
      }

      if (retrievedNoteTitle) {
        retrievedNoteTitle.value = data.title || rawTitle;
      }

      retrievedNoteContent.value = data.content || "";
      setOriginalRetrievedNoteContent(data.content || "");
      showNoteActionMessage("");

      if (summaryDisplay) {
        summaryDisplay.value = "";
      }
    })
    .catch((error) => {
      console.error("Error loading note:", error);
      showNoteActionMessage("");
      showNoteMessage("No note found with that title.");
    });
}

function updateNote() {
  if (!retrievedNoteContent || !searchTitleInput) {
    return;
  }

  const titleValue = retrievedNoteTitle
    ? retrievedNoteTitle.value.trim()
    : searchTitleInput.value.trim();

  if (!titleValue) {
    showNoteActionMessage("");
    showNoteMessage("Please load or enter a note title first.");
    return;
  }

  if (retrievedNoteContent.value === (retrievedNoteContent.dataset.originalContent || "")) {
    showNoteActionMessage("No changes made");
    return;
  }

  showNoteActionMessage("");
  const encodedTitle = encodeURIComponent(titleValue);

  fetch(`${API_BASE_URL}/notes/${username}/${encodedTitle}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
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
    .then(() => {
      setOriginalRetrievedNoteContent(retrievedNoteContent.value);
      showNoteActionMessage("Note updated successfully");
    })
    .catch((error) => {
      console.error("Error updating note:", error);
      showNoteActionMessage("");
      showNoteMessage("Unable to update note.");
    });
}

function deleteNote() {
  if (!retrievedNoteContent || !searchTitleInput) {
    return;
  }

  const titleValue = retrievedNoteTitle
    ? retrievedNoteTitle.value.trim() || searchTitleInput.value.trim()
    : searchTitleInput.value.trim();

  if (!titleValue) {
    showNoteActionMessage("");
    showNoteMessage("Please enter a title to delete.");
    return;
  }

  showNoteActionMessage("");
  const encodedTitle = encodeURIComponent(titleValue);

  fetch(`${API_BASE_URL}/notes/${username}/${encodedTitle}`, {
    method: "DELETE"
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      if (retrievedNoteTitle) {
        retrievedNoteTitle.value = "";
      }
      retrievedNoteContent.value = "";
      setOriginalRetrievedNoteContent("");
      showNoteActionMessage("Note deleted successfully");

      if (summaryDisplay) {
        summaryDisplay.value = "";
      }
    })
    .catch((error) => {
      console.error("Error deleting note:", error);
      showNoteActionMessage("");
      showNoteMessage("Unable to delete note.");
    });
}

// ==================== AI Features ====================
async function generateSummary() {
  if (!generateSummaryButton) {
    return;
  }

  const contentValue = retrievedNoteContent?.value?.trim();
  if (!contentValue) {
    if (summaryDisplay) {
      summaryDisplay.value = "Please load a note first to generate a summary.";
    }
    return;
  }

  const originalText = generateSummaryButton.textContent;
  generateSummaryButton.textContent = "Generating...";
  generateSummaryButton.disabled = true;

  if (summaryDisplay) {
    summaryDisplay.value = "AI is summarizing your note (this may take 5-30 seconds)...";
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/summarize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ content: contentValue })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate summary");
    }

    if (summaryDisplay) {
      summaryDisplay.value = data.summary || "(Empty summary returned)";
    }
  } catch (error) {
    console.error("Error generating summary:", error);
    if (summaryDisplay) {
      summaryDisplay.value = "Error: " + error.message +
        "\n\nMake sure:\n1. Backend is running\n2. Ollama is running\n3. The model is available";
    }
  } finally {
    generateSummaryButton.textContent = originalText;
    generateSummaryButton.disabled = false;
  }
}

async function generateInsights() {
  if (!username) {
    showSessionsMessage("Please login first to see insights.");
    return;
  }

  showSessionsMessage("Loading your study data...");

  try {
    const sessionsResponse = await fetch(`${API_BASE_URL}/studysessions/${username}`);
    const sessions = sessionsResponse.status === 404 ? [] : await sessionsResponse.json();

    if (!sessions || sessions.length === 0) {
      showSessionsMessage("No study sessions recorded yet.\nStart tracking your study time to get insights!");
      return;
    }

    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);
    const avgMinutes = Math.round(totalMinutes / totalSessions);

    const sessionsByDate = {};
    sessions.forEach((session) => {
      sessionsByDate[session.date] = (sessionsByDate[session.date] || 0) + session.duration;
    });

    const dates = Object.keys(sessionsByDate).sort();
    const recentDates = dates.slice(-7);
    const recentMinutes = recentDates.map((date) => sessionsByDate[date]);
    const recentAvg = recentMinutes.length > 0
      ? Math.round(recentMinutes.reduce((a, b) => a + b, 0) / recentMinutes.length)
      : 0;

    const maxMinutes = Math.max(...Object.values(sessionsByDate));
    const bestDate = Object.entries(sessionsByDate).find(([, minutes]) => minutes === maxMinutes)?.[0];

    const statsForAI =
      `Total sessions: ${totalSessions}\n` +
      `Total study time: ${totalMinutes} minutes (${(totalMinutes / 60).toFixed(1)} hours)\n` +
      `Average session length: ${avgMinutes} minutes\n` +
      `Recent daily average (last 7 unique days): ${recentAvg} minutes\n` +
      `Best day: ${bestDate} with ${maxMinutes} minutes\n` +
      `Days tracked: ${dates.length}`;

    let displayText = "=== YOUR STUDY STATS ===\n\n";
    displayText += statsForAI + "\n\n";
    displayText += "=== DAILY BREAKDOWN ===\n";
    Object.entries(sessionsByDate).sort().forEach(([date, minutes]) => {
      displayText += `${date}: ${minutes} minutes\n`;
    });
    displayText += "\n=== AI INSIGHTS ===\n";
    displayText += "Generating personalized insights...\n";

    if (sessionsDisplay) {
      sessionsDisplay.value = displayText;
    }

    try {
      const aiResponse = await fetch(`${API_BASE_URL}/api/insights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ stats: statsForAI })
      });

      const aiData = await aiResponse.json();
      const finalText = displayText.replace(
        "Generating personalized insights...\n",
        (aiData.insights || aiData.error || "(no insights returned)") + "\n"
      );

      if (sessionsDisplay) {
        sessionsDisplay.value = finalText;
      }
    } catch (aiError) {
      console.error("AI insights failed:", aiError);
      const fallback = displayText.replace(
        "Generating personalized insights...\n",
        "(AI insights unavailable - make sure Ollama is running)\n"
      );
      if (sessionsDisplay) {
        sessionsDisplay.value = fallback;
      }
    }
  } catch (error) {
    console.error("Error generating insights:", error);
    showSessionsMessage("Unable to generate insights. Make sure the backend is running.");
  }
}

// ==================== Initialization ====================
updateTimerDisplay();

if (startButton) startButton.addEventListener("click", startTimer);
if (pauseButton) pauseButton.addEventListener("click", stopTimer);
if (clearButton) clearButton.addEventListener("click", clearTimer);
if (saveNoteButton) saveNoteButton.addEventListener("click", noteSave);
if (searchNoteButton) searchNoteButton.addEventListener("click", loadSavedNotes);
if (updateNoteButton) updateNoteButton.addEventListener("click", updateNote);
if (deleteNoteButton) deleteNoteButton.addEventListener("click", deleteNote);
if (loadSessionsButton) loadSessionsButton.addEventListener("click", loadSessions);
if (generateSummaryButton) generateSummaryButton.addEventListener("click", generateSummary);
if (generateInsightsButton) generateInsightsButton.addEventListener("click", generateInsights);
