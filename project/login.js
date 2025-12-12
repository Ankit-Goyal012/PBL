// --- HARDCODED USERS ---
const USERS = [
  { email: "admin@openware.com", password: "admin123", role: "admin" },
  { email: "dev1@openware.com", password: "dev123", role: "developer" },
  { email: "dev2@openware.com", password: "dev123", role: "developer" }
];

// DOM Elements
const form = document.getElementById("form");
const email_input = document.getElementById("email-input");
const password_input = document.getElementById("password-input");
const error_message = document.getElementById("error-message");

// Handle Login
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = email_input.value.trim();
  const pass = password_input.value.trim();

  const user = USERS.find(u => u.email === email && u.password === pass);

  if (!user) {
    error_message.innerText = "Invalid email or password!";
    return;
  }

  localStorage.setItem("role", user.role);

  // Redirect based on role
  if (user.role === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "upload.html";
  }
});

// Logout Function
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
