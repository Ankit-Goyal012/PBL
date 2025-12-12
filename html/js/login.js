const USERS = [
  { email: "admin@openware.com", password: "admin123", role: "admin" },
  { email: "dev1@openware.com", password: "dev123", role: "developer" },
  { email: "dev2@openware.com", password: "dev123", role: "developer" }
];

const form = document.getElementById("form");
const email_input = document.getElementById("email-input");
const password_input = document.getElementById("password-input");
const error_message = document.getElementById("error-message");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let email = email_input.value;
  let pass = password_input.value;

  let user = USERS.find(u => u.email === email && u.password === pass);

  if (!user) {
    error_message.innerText = "Invalid credentials.";
    return;
  }

  localStorage.setItem("role", user.role);

  if (user.role === "admin") window.location.href = "admin.html";
  else window.location.href = "upload.html";
});

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
