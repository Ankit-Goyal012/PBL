// Only admin allowed
if (localStorage.getItem("role") !== "admin") {
  alert("Admin access only!");
  window.location.href = "login.html";
}

// Approve Buttons
document.querySelectorAll(".approve").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.parentElement.innerHTML += `<p style="color:#4CAF50;font-weight:600;margin-top:5px;">✔ Approved</p>`;
  });
});

// Reject Buttons
document.querySelectorAll(".reject").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.parentElement.innerHTML += `<p style="color:#E34E4E;font-weight:600;margin-top:5px;">✘ Rejected</p>`;
  });
});

// Logout
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
