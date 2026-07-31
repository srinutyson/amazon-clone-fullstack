const signupButton = document.getElementById("signup-btn");

signupButton.addEventListener("click", signup);

async function signup() {

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const errorMessage = document.getElementById("error-message");
    errorMessage.innerText = "";

    if (!name || !email || !password) {
        errorMessage.innerText = "Please fill in all fields.";
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:3069/api/signup",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            window.location.href = "amazon.html";
        } else {
            errorMessage.innerText = data.message;
        }

    } catch (err) {
        console.error(err);
        errorMessage.innerText = "Unable to connect to server.";
    }

}