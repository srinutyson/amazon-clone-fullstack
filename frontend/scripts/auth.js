export async function checkAuth() {

    const response = await fetch(
        "http://localhost:3069/api/profile",
        {
            credentials: "include"
        }
    );

    if (!response.ok) {
        window.location.href = "login.html";
        return false;
    }

    return true;
}