// /* OpenWare UI Demo
//    - Explore, Login/Register, Upload (developer), Admin (approve)
//    - Works offline using localStorage demo data; will use real API if available at http://localhost:5000/api
// */

// const API_BASE = (window.__DEV_API_URL__ || 'http://localhost:5000') + '/api';
// const appEl = document.getElementById('app');
// const navUpload = document.getElementById('nav-upload');
// const navAdmin = document.getElementById('nav-admin');
// const navLogin = document.getElementById('nav-login');
// const logoutBtn = document.getElementById('logout-btn');

// /* ---------- Utilities ---------- */
// function uid() { return Math.random().toString(36).slice(2,9) }
// function qs(sel, root=document){ return root.querySelector(sel) }
// function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)) }
// function escapeHtml(s){ if (!s && s !== 0) return ''; return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' })[c])}

// /* ---------- API helper: tries real backend, falls back to localStorage ---------- */
// async function tryApiFetch(path, opts={}){
//   // Try backend first only if backend responds
//   try {
//     const res = await fetch(API_BASE + path, opts);
//     if (!res.ok) {
//       const txt = await res.text().catch(()=>null);
//       throw txt || `HTTP ${res.status}`;
//     }
//     return await res.json();
//   } catch (err) {
//     // fallback to local storage mock
//     return null;
//   }
// }

// /* ---------- Local demo storage helpers ---------- */
// const STORAGE_KEYS = { PROJECTS:'ph_projects_v1', USERS:'ph_users_v1', SESSION:'ph_session_v1' };

// function seedDemoData(){
//   if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)){
//     const demo = [
//       { id: uid(), title:'TaskManager', description:'A productivity app to track tasks and deadlines', authorName:'Alice', authorId:'u_alice', approved:true, apkPath:'', codeZipPath:'' },
//       { id: uid(), title:'WeatherApp', description:'A simple app to display current weather conditions', authorName:'Bob', authorId:'u_bob', approved:true, apkPath:'', codeZipPath:'' },
//       { id: uid(), title:'ChatApp', description:'A real-time chat application', authorName:'Dave', authorId:'u_dave', approved:false, apkPath:'', codeZipPath:'' },
//       { id: uid(), title:'BudgetTracker', description:'An app to manage personal finances', authorName:'Eve', authorId:'u_eve', approved:false, apkPath:'', codeZipPath:'' }
//     ];
//     localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(demo));
//   }
//   if (!localStorage.getItem(STORAGE_KEYS.USERS)){
//     const users = [
//       { id:'u_admin', name:'Admin', email:'admin@OpenWare', role:'admin', password:'admin' },
//       { id:'u_developer', name:'Dev', email:'dev@OpenWare', role:'developer', password:'dev' },
//       { id:'u_user', name:'User', email:'user@OpenWare', role:'user', password:'user' }
//     ];
//     localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
//   }
// }
// function getLocalProjects(){ return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]') }
// function saveLocalProjects(arr){ localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(arr)) }
// function getLocalUsers(){ return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]') }
// function getSession(){ return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || 'null') }
// function setSession(s){ localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(s)) }

// /* ---------- Auth UI ---------- */
// function updateNav(){
//   const user = getSession();
//   if (user){
//     navLogin.style.display = 'none';
//     logoutBtn.style.display = 'inline-block';
//     if (user.role === 'developer') navUpload.style.display = 'inline-block';
//     else navUpload.style.display = 'none';
//     navAdmin.style.display = (user.role === 'admin') ? 'inline-block' : 'none';
//   } else {
//     navLogin.style.display = 'inline-block';
//     logoutBtn.style.display = 'none';
//     navUpload.style.display = 'none';
//     navAdmin.style.display = 'none';
//   }
// }
// logoutBtn.addEventListener('click', ()=>{ setSession(null); updateNav(); location.hash = '#/'; location.reload(); });

// /* ---------- Router ---------- */
// function router(){
//   const hash = location.hash || '#/';
//   if (hash.startsWith('#/login')) return renderLogin();
//   if (hash.startsWith('#/upload')) return renderUpload();
//   if (hash.startsWith('#/admin')) return renderAdmin();
//   if (hash.startsWith('#/project/')) {
//     const id = hash.split('/')[2]; return renderProject(id);
//   }
//   return renderHome();
// }
// window.addEventListener('hashchange', router);

// /* ---------- Views ---------- */

// async function renderHome(){
//   appEl.innerHTML = `<div class="header-large"><h1 class="h1">Explore Projects</h1><div class="controls"><input id="search" placeholder="Search projects..." /><button id="refresh" class="btn small">Refresh</button></div></div><div id="grid" class="grid"></div>`;
//   updateNav();
//   const grid = qs('#grid');
//   grid.innerHTML = `<div style="grid-column:1/-1;color:var(--muted)">Loading...</div>`;

//   // attempt backend
//   const remote = await tryApiFetch('/projects');
//   let projects = [];
//   if (remote && Array.isArray(remote)) {
//     projects = remote.filter(p => p.approved !== false);
//   } else {
//     projects = getLocalProjects().filter(p => p.approved);
//   }

//   function renderList(list){
//     grid.innerHTML = '';
//     if (!list.length) grid.innerHTML = `<div style="grid-column:1/-1;color:var(--muted)">No projects yet.</div>`;
//     list.forEach(p=>{
//       const div = document.createElement('div'); div.className = 'card';
//       div.innerHTML = `<h3 class="card-title">${escapeHtml(p.title)}</h3><p class="card-desc">${escapeHtml((p.description||'').slice(0,160))}</p><div class="meta">By ${escapeHtml(p.authorName||p.author?.name||'Unknown')}</div><div style="margin-top:auto"><a class="btn small" href="#/project/${p.id || p._id}">Open</a></div>`;
//       grid.appendChild(div);
//     });
//   }
//   renderList(projects);

//   qs('#refresh').addEventListener('click', ()=> router());
//   qs('#search').addEventListener('input', (e)=>{
//     const q = e.target.value.toLowerCase();
//     renderList(projects.filter(p => (p.title + ' ' + (p.description||'') + ' ' + (p.authorName||'')).toLowerCase().includes(q)));
//   });
// }

// function renderLogin(){
//   updateNav();
//   appEl.innerHTML = `
//     <h1>Login / Register</h1>
//     <form id="auth" style="max-width:520px">
//       <div id="reg-block" style="display:none">
//         <label>Name<input id="reg-name" /></label>
//         <label>Role
//           <select id="reg-role"><option value="developer">Developer</option><option value="user">User</option></select>
//         </label>
//       </div>
//       <label>Email<input id="email" type="email" required /></label>
//       <label>Password<input id="password" type="password" required /></label>
//       <div class="controls">
//         <button class="btn" type="submit" id="submit">Login</button>
//         <button type="button" class="btn small" id="toggle">Switch to Register</button>
//       </div>
//     </form>
//   `;
//   let reg = false;
//   qs('#toggle').addEventListener('click', ()=>{
//     reg = !reg;
//     qs('#reg-block').style.display = reg ? 'block' : 'none';
//     qs('#submit').textContent = reg ? 'Register' : 'Login';
//     qs('#toggle').textContent = reg ? 'Switch to Login' : 'Switch to Register';
//   });

//   qs('#auth').addEventListener('submit', (ev)=>{
//     ev.preventDefault();
//     const email = qs('#email').value.trim();
//     const pw = qs('#password').value;
//     if (!reg){
//       // login
//       const u = getLocalUsers().find(x=>x.email === email && x.password === pw);
//       if (u){
//         setSession({ id: u.id, name: u.name, role: u.role, email: u.email });
//         updateNav();
//         location.hash = '#/';
//         location.reload();
//       } else {
//         alert('Invalid credentials (demo accounts: admin/dev/user with email admin@OpenWare/dev@OpenWare/user@OpenWare and same as password)');
//       }
//     } else {
//       const name = qs('#reg-name').value.trim() || 'New';
//       const role = qs('#reg-role').value;
//       const users = getLocalUsers();
//       const id = 'u_' + uid();
//       users.push({ id, name, email, role, password: pw });
//       localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
//       setSession({ id, name, role, email });
//       updateNav();
//       alert('Registered (demo). Now you can upload if developer.');
//       location.hash = '#/';
//       location.reload();
//     }
//   });
// }

// function renderUpload(){
//   updateNav();
//   const session = getSession();
//   if (!session || session.role !== 'developer') {
//     appEl.innerHTML = `<h2>Upload</h2><p>Only logged-in <strong>developers</strong> can upload. <a href="#/login">Login / Register</a></p>`;
//     return;
//   }
//   appEl.innerHTML = `
//     <h1>Upload Project / App</h1>
//     <form id="upload" enctype="multipart/form-data">
//       <label>Title<input id="title" required /></label>
//       <label>Description<textarea id="desc" rows="4"></textarea></label>
//       <label>Tags (comma separated)<input id="tags" /></label>
//       <label>APK (optional)<input id="apk" type="file" accept=".apk" /></label>
//       <label>Code ZIP (optional)<input id="code" type="file" accept=".zip" /></label>
//       <div class="controls">
//         <button class="btn" type="submit">Upload</button>
//         <a class="btn small" href="#/">Cancel</a>
//       </div>
//     </form>
//   `;
//   qs('#upload').addEventListener('submit', async (ev)=>{
//     ev.preventDefault();
//     const title = qs('#title').value.trim();
//     const desc = qs('#desc').value.trim();
//     // try backend upload
//     const fd = new FormData();
//     fd.append('title', title);
//     fd.append('description', desc);
//     fd.append('tags', qs('#tags').value || '');
//     const apk = qs('#apk').files[0]; if (apk) fd.append('apk', apk);
//     const code = qs('#code').files[0]; if (code) fd.append('code', code);

//     // try backend
//     try {
//       const token = null; // in demo we don't have backend auth token
//       const res = await fetch(API_BASE + '/projects', { method: 'POST', body: fd, headers: token ? { Authorization: 'Bearer '+token } : {} });
//       if (res.ok){
//         alert('Uploaded to backend (if available).');
//         location.hash = '#/';
//         return;
//       }
//     } catch (err) { /* ignore if backend not available */ }

//     // fallback to localStorage
//     const projects = getLocalProjects();
//     projects.push({
//       id: uid(),
//       title, description: desc,
//       tags: qs('#tags').value.split(',').map(t=>t.trim()).filter(Boolean),
//       apkPath: '',
//       codeZipPath: '',
//       authorId: getSession().id,
//       authorName: getSession().name,
//       approved: (getSession().role === 'admin') ? true : false,
//       createdAt: new Date().toISOString()
//     });
//     saveLocalProjects(projects);
//     alert('Uploaded (demo). Admin must approve it to appear in Explore.');
//     location.hash = '#/';
//     location.reload();
//   });
// }

// async function renderProject(id){
//   // try backend first
//   let p = null;
//   try { p = await tryApiFetch('/projects/' + id); } catch(e){ p = null; }
//   if (!p){
//     p = getLocalProjects().find(x => x.id === id || x._id === id);
//   }
//   if (!p) {
//     appEl.innerHTML = `<div style="color:red">Project not found</div><a href="#/">Back</a>`;
//     return;
//   }
//   appEl.innerHTML = `
//     <div class="project-view">
//       <h1>${escapeHtml(p.title)}</h1>
//       <div class="meta">By ${escapeHtml(p.authorName || p.author?.name || 'Unknown')}</div>
//       <p style="margin-top:12px">${escapeHtml(p.description || '')}</p>
//       <div class="controls" style="margin-top:12px">
//         ${p.apkPath ? `<a class="btn" href="${p.apkPath}" target="_blank">Download APK</a>` : ''}
//         ${p.codeZipPath ? `<a class="btn small" href="${p.codeZipPath}" target="_blank">Download Code</a>` : ''}
//         <a class="btn small" href="#/">Back</a>
//       </div>
//     </div>
//   `;
// }

// /* ---------- Admin UI ---------- */
// function renderAdmin(){
//   updateNav();
//   const session = getSession();
//   if (!session || session.role !== 'admin') {
//     appEl.innerHTML = `<h2>Admin</h2><p>Admin-only page. <a href="#/login">Login</a></p>`;
//     return;
//   }
//   appEl.innerHTML = `<h1>Admin Dashboard</h1><div><h3>Pending Projects</h3><div id="pending" class="pending-list"></div></div>`;
//   const pending = qs('#pending');
//   const all = getLocalProjects();
//   const toApprove = all.filter(p => !p.approved);

//   if (!toApprove.length) pending.innerHTML = `<div style="color:var(--muted)">No pending projects.</div>`;
//   toApprove.forEach(p=>{
//     const row = document.createElement('div'); row.className = 'pending-item';
//     row.innerHTML = `<div><strong>${escapeHtml(p.title)}</strong><div style="color:var(--muted)">${escapeHtml(p.description||'')}</div><div style="color:var(--muted);font-size:13px">By ${escapeHtml(p.authorName||'Unknown')}</div></div>
//       <div style="display:flex;gap:8px">
//         <button class="btn small approve">Approve</button>
//         <button class="btn small" style="background:#f97373">Decline</button>
//       </div>`;
//     pending.appendChild(row);
//     row.querySelector('.approve').addEventListener('click', ()=>{
//       p.approved = true; saveLocalProjects(all); alert('Approved'); renderAdmin();
//     });
//     row.querySelectorAll('.btn.small')[1].addEventListener('click', ()=>{
//       // decline (remove)
//       const idx = all.findIndex(x=>x.id === p.id);
//       if (idx >= 0) { all.splice(idx,1); saveLocalProjects(all); alert('Declined/removed'); renderAdmin(); }
//     });
//   });
// }

// /* ---------- Init ---------- */
// seedDemoData();
// updateNav();
// router();
/* OpenWare UI Demo
   - Explore, Login/Register, Upload (developer), Admin (approve)
   - Works offline using localStorage demo data; will use real API if available at http://localhost:5000/api
*/

const API_BASE = (window.__DEV_API_URL__ || 'http://localhost:5000') + '/api';
const appEl = document.getElementById('app');
const navUpload = document.getElementById('nav-upload');
const navAdmin = document.getElementById('nav-admin');
const navLogin = document.getElementById('nav-login');
const logoutBtn = document.getElementById('logout-btn');

/* ---------- Utilities ---------- */
function uid() { return Math.random().toString(36).slice(2,9) }
function qs(sel, root=document){ return root.querySelector(sel) }
function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)) }
function escapeHtml(s){ if (!s && s !== 0) return ''; return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' })[c])}

/* ---------- API helper: tries real backend, falls back to localStorage ---------- */
async function tryApiFetch(path, opts={}){
  // Try backend first only if backend responds
  try {
    const res = await fetch(API_BASE + path, opts);
    if (!res.ok) {
      const txt = await res.text().catch(()=>null);
      throw txt || `HTTP ${res.status}`;
    }
    return await res.json();
  } catch (err) {
    // fallback to local storage mock
    return null;
  }
}

/* ---------- Local demo storage helpers ---------- */
const STORAGE_KEYS = { PROJECTS:'ph_projects_v1', USERS:'ph_users_v1', SESSION:'ph_session_v1' };

function seedDemoData(){
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)){
    const demo = [
      { id: uid(), title:'TaskManager', description:'A productivity app to track tasks and deadlines', authorName:'Alice', authorId:'u_alice', approved:true, apkPath:'', codeZipPath:'' },
      { id: uid(), title:'WeatherApp', description:'A simple app to display current weather conditions', authorName:'Bob', authorId:'u_bob', approved:true, apkPath:'', codeZipPath:'' },
      { id: uid(), title:'ChatApp', description:'A real-time chat application', authorName:'Dave', authorId:'u_dave', approved:false, apkPath:'', codeZipPath:'' },
      { id: uid(), title:'BudgetTracker', description:'An app to manage personal finances', authorName:'Eve', authorId:'u_eve', approved:false, apkPath:'', codeZipPath:'' }
    ];
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(demo));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)){
    const users = [
      { id:'u_admin', name:'Admin', email:'admin@OpenWare', role:'admin', password:'admin' },
      { id:'u_developer', name:'Dev', email:'dev@OpenWare', role:'developer', password:'dev' },
      { id:'u_developer2', name:'Dev2', email:'dev2@OpenWare', role:'developer', password:'dev2' }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
}
function getLocalProjects(){ return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]') }
function saveLocalProjects(arr){ localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(arr)) }
function getLocalUsers(){ return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]') }
function getSession(){ return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || 'null') }
function setSession(s){ localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(s)) }

/* ---------- Auth UI ---------- */
function updateNav(){
  const user = getSession();
  if (user){
    navLogin.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    if (user.role === 'developer') navUpload.style.display = 'inline-block';
    else navUpload.style.display = 'none';
    navAdmin.style.display = (user.role === 'admin') ? 'inline-block' : 'none';
  } else {
    navLogin.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    navUpload.style.display = 'none';
    navAdmin.style.display = 'none';
  }
}
logoutBtn.addEventListener('click', ()=>{ setSession(null); updateNav(); location.hash = '#/'; location.reload(); });

/* ---------- Router ---------- */
function router(){
  const hash = location.hash || '#/';
  if (hash.startsWith('#/login')) return renderLogin();
  if (hash.startsWith('#/upload')) return renderUpload();
  if (hash.startsWith('#/admin')) return renderAdmin();
  if (hash.startsWith('#/project/')) {
    const id = hash.split('/')[2]; return renderProject(id);
  }
  return renderHome();
}
window.addEventListener('hashchange', router);

/* ---------- Views ---------- */

async function renderHome(){
  appEl.innerHTML = `<div class="header-large"><h1 class="h1">Explore Projects</h1><div class="controls"><input id="search" placeholder="Search projects..." /><button id="refresh" class="btn small">Refresh</button></div></div><div id="grid" class="grid"></div>`;
  updateNav();
  const grid = qs('#grid');
  grid.innerHTML = `<div style="grid-column:1/-1;color:var(--muted)">Loading...</div>`;

  // attempt backend
  const remote = await tryApiFetch('/projects');
  let projects = [];
  if (remote && Array.isArray(remote)) {
    projects = remote.filter(p => p.approved !== false);
  } else {
    projects = getLocalProjects().filter(p => p.approved);
  }

  function renderList(list){
    grid.innerHTML = '';
    if (!list.length) grid.innerHTML = `<div style="grid-column:1/-1;color:var(--muted)">No projects yet.</div>`;
    list.forEach(p=>{
      const div = document.createElement('div'); div.className = 'card';
      div.innerHTML = `<h3 class="card-title">${escapeHtml(p.title)}</h3><p class="card-desc">${escapeHtml((p.description||'').slice(0,160))}</p><div class="meta">By ${escapeHtml(p.authorName||p.author?.name||'Unknown')}</div><div style="margin-top:auto"><a class="btn small" href="#/project/${p.id || p._id}">Open</a></div>`;
      grid.appendChild(div);
    });
  }
  renderList(projects);

  qs('#refresh').addEventListener('click', ()=> router());
  qs('#search').addEventListener('input', (e)=>{
    const q = e.target.value.toLowerCase();
    renderList(projects.filter(p => (p.title + ' ' + (p.description||'') + ' ' + (p.authorName||'')).toLowerCase().includes(q)));
  });
}

function renderLogin(){
  updateNav();
  appEl.innerHTML = `
    <h1>Login / Register</h1>
    <form id="auth" style="max-width:520px">
      <div id="reg-block" style="display:none">
        <label>Name<input id="reg-name" /></label>
        <label>Role
          <select id="reg-role">
            <option value="developer">Developer</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      </div>
      <label>Email<input id="email" type="email" required /></label>
      <label>Password<input id="password" type="password" required /></label>
      <div class="controls">
        <button class="btn" type="submit" id="submit">Login</button>
        <button type="button" class="btn small" id="toggle">Switch to Register</button>
      </div>
    </form>
  `;
  let reg = false;
  qs('#toggle').addEventListener('click', ()=>{
    reg = !reg;
    qs('#reg-block').style.display = reg ? 'block' : 'none';
    qs('#submit').textContent = reg ? 'Register' : 'Login';
    qs('#toggle').textContent = reg ? 'Switch to Login' : 'Switch to Register';
  });

  qs('#auth').addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const email = qs('#email').value.trim();
    const pw = qs('#password').value;
    if (!reg){
      // login
      const u = getLocalUsers().find(x=>x.email === email && x.password === pw);
      if (u){
        setSession({ id: u.id, name: u.name, role: u.role, email: u.email });
        updateNav();
        location.hash = '#/';
        location.reload();
      } else {
        alert('Invalid credentials (demo accounts: admin/dev/dev2 with email admin@OpenWare/dev@OpenWare/dev2@OpenWare and same as password)');
      }
    } else {
      const name = qs('#reg-name').value.trim() || 'New';
      const role = qs('#reg-role').value;
      const users = getLocalUsers();
      const id = 'u_' + uid();
      users.push({ id, name, email, role, password: pw });
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      setSession({ id, name, role, email });
      updateNav();
      alert('Registered (demo). Now you can upload if developer.');
      location.hash = '#/';
      location.reload();
    }
  });
}

function renderUpload(){
  updateNav();
  const session = getSession();
  if (!session || session.role !== 'developer') {
    appEl.innerHTML = `<h2>Upload</h2><p>Only logged-in <strong>developers</strong> can upload. <a href="#/login">Login / Register</a></p>`;
    return;
  }
  appEl.innerHTML = `
    <h1>Upload Project / App</h1>
    <form id="upload" enctype="multipart/form-data">
      <label>Title<input id="title" required /></label>
      <label>Description<textarea id="desc" rows="4"></textarea></label>
      <label>Tags (comma separated)<input id="tags" /></label>
      <label>APK (optional)<input id="apk" type="file" accept=".apk" /></label>
      <label>Code ZIP (optional)<input id="code" type="file" accept=".zip" /></label>
      <div class="controls">
        <button class="btn" type="submit">Upload</button>
        <a class="btn small" href="#/">Cancel</a>
      </div>
    </form>
  `;
  qs('#upload').addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    const title = qs('#title').value.trim();
    const desc = qs('#desc').value.trim();
    // try backend upload
    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', desc);
    fd.append('tags', qs('#tags').value || '');
    const apk = qs('#apk').files[0]; if (apk) fd.append('apk', apk);
    const code = qs('#code').files[0]; if (code) fd.append('code', code);

    // try backend
    try {
      const token = null; // in demo we don't have backend auth token
      const res = await fetch(API_BASE + '/projects', { method: 'POST', body: fd, headers: token ? { Authorization: 'Bearer '+token } : {} });
      if (res.ok){
        alert('Uploaded to backend (if available).');
        location.hash = '#/';
        return;
      }
    } catch (err) { /* ignore if backend not available */ }

    // fallback to localStorage
    const projects = getLocalProjects();
    projects.push({
      id: uid(),
      title, description: desc,
      tags: qs('#tags').value.split(',').map(t=>t.trim()).filter(Boolean),
      apkPath: '',
      codeZipPath: '',
      authorId: getSession().id,
      authorName: getSession().name,
      approved: (getSession().role === 'admin') ? true : false,
      createdAt: new Date().toISOString()
    });
    saveLocalProjects(projects);
    alert('Uploaded (demo). Admin must approve it to appear in Explore.');
    location.hash = '#/';
    location.reload();
  });
}

async function renderProject(id){
  // try backend first
  let p = null;
  try { p = await tryApiFetch('/projects/' + id); } catch(e){ p = null; }
  if (!p){
    p = getLocalProjects().find(x => x.id === id || x._id === id);
  }
  if (!p) {
    appEl.innerHTML = `<div style="color:red">Project not found</div><a href="#/">Back</a>`;
    return;
  }
  appEl.innerHTML = `
    <div class="project-view">
      <h1>${escapeHtml(p.title)}</h1>
      <div class="meta">By ${escapeHtml(p.authorName || p.author?.name || 'Unknown')}</div>
      <p style="margin-top:12px">${escapeHtml(p.description || '')}</p>
      <div class="controls" style="margin-top:12px">
        ${p.apkPath ? `<a class="btn" href="${p.apkPath}" target="_blank">Download APK</a>` : ''}
        ${p.codeZipPath ? `<a class="btn small" href="${p.codeZipPath}" target="_blank">Download Code</a>` : ''}
        <a class="btn small" href="#/">Back</a>
      </div>
    </div>
  `;
}

/* ---------- Admin UI ---------- */
function renderAdmin(){
  updateNav();
  const session = getSession();
  if (!session || session.role !== 'admin') {
    appEl.innerHTML = `<h2>Admin</h2><p>Admin-only page. <a href="#/login">Login</a></p>`;
    return;
  }
  appEl.innerHTML = `<h1>Admin Dashboard</h1><div><h3>Pending Projects</h3><div id="pending" class="pending-list"></div></div>`;
  const pending = qs('#pending');
  const all = getLocalProjects();
  const toApprove = all.filter(p => !p.approved);

  if (!toApprove.length) pending.innerHTML = `<div style="color:var(--muted)">No pending projects.</div>`;
  toApprove.forEach(p=>{
    const row = document.createElement('div'); row.className = 'pending-item';
    row.innerHTML = `<div><strong>${escapeHtml(p.title)}</strong><div style="color:var(--muted)">${escapeHtml(p.description||'')}</div><div style="color:var(--muted);font-size:13px">By ${escapeHtml(p.authorName||'Unknown')}</div></div>
      <div style="display:flex;gap:8px">
        <button class="btn small approve">Approve</button>
        <button class="btn small" style="background:#f97373">Decline</button>
      </div>`;
    pending.appendChild(row);
    row.querySelector('.approve').addEventListener('click', ()=>{
      p.approved = true; saveLocalProjects(all); alert('Approved'); renderAdmin();
    });
    row.querySelectorAll('.btn.small')[1].addEventListener('click', ()=>{
      // decline (remove)
      const idx = all.findIndex(x=>x.id === p.id);
      if (idx >= 0) { all.splice(idx,1); saveLocalProjects(all); alert('Declined/removed'); renderAdmin(); }
    });
  });
}

/* ---------- Init ---------- */
seedDemoData();
updateNav();
router();