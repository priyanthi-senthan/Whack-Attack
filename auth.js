// Utility function to set a cookie
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}

// Utility function to get a cookie by name
function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length);
    }
    return null;
}

// Register form submission handler
document.getElementById("registerForm")?.addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Save username and password in cookies (for demonstration purposes)
    setCookie("username", username, 7); // Cookies expire in 7 days
    setCookie("password", password, 7);

    alert("Registration successful! Please login.");
    window.location.href = "login.html";
});

// Login form submission handler
document.getElementById("loginForm")?.addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const storedUsername = getCookie("username");
    const storedPassword = getCookie("password");

    if (username === storedUsername && password === storedPassword) {
        alert("Login successful!");
        window.location.href = "index.html"; // Redirect to the main game page
    } else {
        alert("Incorrect username or password!");
    }
});

// Utility function to delete a cookie
// This function deletes the user's cookies and redirects to the login page
function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}

// Logout function
function logout() {
    // Delete cookies
    deleteCookie("username");
    deleteCookie("password");

    // Redirect to login page after logout
    window.location.href = "login.html";
}

// Attach event listener to the logout button
document.getElementById("logout-button")?.addEventListener("click", logout);
