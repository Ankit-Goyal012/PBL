// ONLY DEVELOPERS
if (localStorage.getItem("role") !== "developer") {
  alert("Developer login required!");
  window.location.href = "login.html";
}

const photosInput = document.getElementById("photosInput");
const dropArea = document.getElementById("dropArea");
const thumbs = document.getElementById("thumbs");
const uploadForm = document.getElementById("uploadForm");

let files = [];

// CLICK = OPEN FILE SELECT
dropArea.addEventListener("click", () => photosInput.click());

// FILE SELECT
photosInput.addEventListener("change", e => handleFiles(e.target.files));

// DRAG & DROP
dropArea.addEventListener("dragover", e => { 
  e.preventDefault();
});
dropArea.addEventListener("drop", e => {
  e.preventDefault();
  handleFiles(e.dataTransfer.files);
});

function handleFiles(selected) {
  const incoming = Array.from(selected).slice(0, 5 - files.length);
  incoming.forEach(file => {
    if (file.type.startsWith("image/")) {
      files.push(file);
    }
  });
  renderThumbs();
}

function renderThumbs() {
  thumbs.innerHTML = "";
  files.forEach((file) => {
    const url = URL.createObjectURL(file);
    thumbs.innerHTML += `<img src="${url}" />`;
  });
}

// SUBMIT → SAVE DATA → GO TO SUCCESS PAGE
uploadForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const appData = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    screenshots: [],
    status: "pending"
  };

  // SCREENSHOTS AS BASE64
  const readerPromises = files.map(f => fileToBase64(f));

  Promise.all(readerPromises).then(base64Images => {
    appData.screenshots = base64Images;

    // SAVE DATA TO LOCALSTORAGE
    let stored = JSON.parse(localStorage.getItem("apps") || "[]");
    stored.push(appData);
    localStorage.setItem("apps", JSON.stringify(stored));

    window.location.href = "success.html";
  });
});

// Convert file into Base64
function fileToBase64(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

// LOGOUT
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
