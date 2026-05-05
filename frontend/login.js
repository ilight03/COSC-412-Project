const API_BASE_URL = window.APP_CONFIG?.API_BASE_URL || "http://localhost:8080";

const input = document.querySelector("#usernameInput");
const passwordInput = document.querySelector("#passwordInput");
const button = document.querySelector("#loginBtn");
const createAccountButton = document.querySelector("#createAccountBtn");
const loginMessage = document.querySelector("#login-message");

function showLoginMessage(message) {
    if (loginMessage) {
        loginMessage.textContent = message;
    }
}

async function fetchUsernames() {
    const response = await fetch(`${API_BASE_URL}/users`);

    if (!response.ok) {
        throw new Error("Failed to load usernames");
    }

    return response.json();
}

if (button) {
    button.addEventListener("click", async (e) => {
        e.preventDefault();

        const username = input.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            showLoginMessage("Please enter a username and password.");
            return;
        }

        showLoginMessage("");

        try {
            const usernames = await fetchUsernames();
            const userExists = Array.isArray(usernames)
                && usernames.some((user) => user.username === username);

            if (!userExists) {
                showLoginMessage("user not found");
                return;
            }

            const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(username)}`);

            if (!response.ok) {
                throw new Error("Failed to load password");
            }

            const passwordData = await response.json();

            if (!passwordData || passwordData.password !== password) {
                showLoginMessage("password doesn't match");
                return;
            }

            sessionStorage.setItem("username", username);
            localStorage.setItem("username", username);
            window.location.href = "index.html";
        } catch (error) {
            console.error("Error logging in:", error);
            showLoginMessage("Unable to log in right now.");
        }
    });
}

if (createAccountButton) {
    createAccountButton.addEventListener("click", () => {
        window.location.href = "create.html";
    });
}
