//writing some placeholder logic just to test the redirect functionality
const input = document.querySelector("#usernameInput");
const passwordInput = document.querySelector("#passwordInput");
const button = document.querySelector("#loginBtn");
const createAccountButton = document.querySelector("#createAccountBtn");

button.addEventListener("click", (e) => {
    e.preventDefault(); //prevents page refresh

    const username = input.value.trim(); 
    const password = passwordInput.value.trim();

    //here this accepts any username as a way to go to the main page
    if(username && password){
        localStorage.setItem("username", username); //saves user to loval for now
        window.location.href = "index.html"; //moves us to main 
    }
});

createAccountButton.addEventListener("click", () => {
    window.location.href = "create.html";
});
