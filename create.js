const createFormButton = document.querySelector("#submitCreateBtn");
const backToLoginButton = document.querySelector("#backToLoginBtn");

if (createFormButton) {
    createFormButton.addEventListener("click", (e) => {
        e.preventDefault();
        // TODO: connect create-account POST logic once backend password support is ready.
    });
}

if (backToLoginButton) {
    backToLoginButton.addEventListener("click", () => {
        window.location.href = "login.html";
    });
}
