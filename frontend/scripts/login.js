const loginButton = document.getElementById("login-btn");

loginButton.addEventListener("click", login);

async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch(
            "/api/login",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
         window.location.href = "amazon.html";
} else {
            document.getElementById("error-message").innerText = data.message;
        }

    } catch (err) {
        console.error(err);
    }
}