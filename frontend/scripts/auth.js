export async function checkAuth() {

    const response = await fetch(
        "/api/profile",
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