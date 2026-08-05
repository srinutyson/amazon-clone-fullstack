export async function checkAuth() {

    const response = await fetch(
        "https://amazon-clone-fullstack-production-5e4c.up.railway.app/api/profile",
        {
            credentials: "include"
        }
    );

    if (!response.ok) {
        // window.location.href = "login.html";
        console.log("page no reload bro");
        return false;
    }

    return true;
}