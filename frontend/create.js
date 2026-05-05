const API_BASE_URL = window.APP_CONFIG?.API_BASE_URL || "http://localhost:8080";

const createUsernameInput = document.querySelector("#createUsernameInput");
const createPasswordInput = document.querySelector("#createPasswordInput");
const confirmPasswordInput = document.querySelector("#confirmPasswordInput");
const createFormButton = document.querySelector("#submitCreateBtn");
const backToLoginButton = document.querySelector("#backToLoginBtn");
const createMessage = document.querySelector("#create-message");

function showCreateMessage(message) {
    if (createMessage) {
        createMessage.textContent = message;
    }
}

async function fetchUsernames() {
    const response = await fetch(`${API_BASE_URL}/users`);

    if (!response.ok) {
        throw new Error("Failed to load usernames");
    }

    return response.json();
}

if (createFormButton) {
    createFormButton.addEventListener("click", async (e) => {
        e.preventDefault();

        const username = createUsernameInput.value.trim();
        const password = createPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (!username || !password || !confirmPassword) {
            showCreateMessage("Please fill out all fields.");
            return;
        }

        if (password !== confirmPassword) {
            showCreateMessage("Passwords do not match.");
            return;
        }

        showCreateMessage("");

        try {
            const usernames = await fetchUsernames();
            const usernameExists = Array.isArray(usernames)
                && usernames.some((user) => user.username === username);

            if (usernameExists) {
                showCreateMessage("Already a user with that name.");
                return;
            }

            const createUserResponse = await fetch(`${API_BASE_URL}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            if (!createUserResponse.ok) {
                throw new Error("Failed to create user");
            }

            window.location.href = "login.html";
        } catch (error) {
            console.error("Error creating user:", error);
            showCreateMessage("Unable to create account right now.");
        }
    });
}

if (backToLoginButton) {
    backToLoginButton.addEventListener("click", () => {
        window.location.href = "login.html";
    });
}
