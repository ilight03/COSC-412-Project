//writing some placeholder logic just to test the redirect functionality
const input = document.querySelector("#usernameInput");
const button = document.querySelector("#loginBtn");

button.addEventListener("click", (e) => {
    e.preventDefault(); //prevents page refresh

    const username = input.value.trim(); 

    //here this accepts any username as a way to go to the main page
    if(username){
        localStorage.setItem("username", username); //saves user to loval for now
        window.location.href = "index.html"; //moves us to main 
    }
})
