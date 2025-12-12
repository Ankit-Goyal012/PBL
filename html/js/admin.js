if (localStorage.getItem("role") !== "admin") {
  alert("Admin access only!");
  window.location.href = "login.html";
}

let apps = JSON.parse(localStorage.getItem("apps") || "[]");
const container = document.getElementById("appsContainer");

function renderApps(){
  container.innerHTML = "";

  apps.forEach((app,index)=>{
    const div = document.createElement("div");
    div.className="app-card";

    div.innerHTML = `
      <div class="app-icon">
        <img src="${app.screenshots[0] || ''}">
      </div>
      <div class="app-info">
        <h3>${app.title}</h3>
        <p>${app.description}</p>
        <p>Status: <strong>${app.status}</strong></p>
        <div class="actions">
          <button class="approve-btn" data-id="${index}">Approve</button>
          <button class="reject-btn" data-id="${index}">Reject</button>
        </div>
      </div>
    `;

    container.appendChild(div);
  });
}

renderApps();

document.addEventListener("click", e => {
  if (e.target.classList.contains("approve-btn")) {
    let id = e.target.dataset.id;
    apps[id].status = "approved";
    localStorage.setItem("apps", JSON.stringify(apps));
    renderApps();
  }

  if (e.target.classList.contains("reject-btn")) {
    let id = e.target.dataset.id;
    apps[id].status = "rejected";
    localStorage.setItem("apps", JSON.stringify(apps));
    renderApps();
  }
});

function logout(){
  localStorage.clear();
  window.location.href="login.html";
}
