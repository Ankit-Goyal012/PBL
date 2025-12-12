// Only developers allowed
if (localStorage.getItem("role") !== "developer") {
  alert("Developer login required!");
  window.location.href = "login.html";
}

// DOM Elements
const photosInput = document.getElementById("photosInput");
const dropArea = document.getElementById("dropArea");
const thumbs = document.getElementById("thumbs");
const uploadForm = document.getElementById("uploadForm");

let files = [];

// Click to open file dialog
dropArea.addEventListener("click", () => photosInput.click());

// Handle file selection
photosInput.addEventListener("change", e => handleFiles(e.target.files));

// Drag over highlight
dropArea.addEventListener("dragover", e => {
  e.preventDefault();
  dropArea.style.background = "rgba(255,255,255,0.35)";
});

// Drag leave
dropArea.addEventListener("dragleave", () => {
  dropArea.style.background = "rgba(255,255,255,0.20)";
});

// Drop images
dropArea.addEventListener("drop", e => {
  e.preventDefault();
  handleFiles(e.dataTransfer.files);
  dropArea.style.background = "rgba(255,255,255,0.20)";
});

// Handle Images
function handleFiles(selected) {
  const incoming = Array.from(selected).slice(0, 5 - files.length);

  incoming.forEach(file => {
    if (file.type.startsWith("image/")) {
      files.push(file);
    }
  });

  renderThumbs();
}

// Show image preview
function renderThumbs() {
  thumbs.innerHTML = "";

  files.forEach((file) => {
    const imgURL = URL.createObjectURL(file);
    thumbs.innerHTML += `<img src="${imgURL}" />`;
  });
}

// Submit action → redirect to success page
uploadForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // You can add API code here

  window.location.href = "success.html";
});

// Logout
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
