// Mock Data
const collegeAppointments = [
  {
    id: 1,
    name: "Mr. Dominic Guiritan",
    subject: "Integrative Programming 1",
    date: "Wed Mar 20",
    time: "8:00 - 9:00 AM",
    avatar: "person",
    color: "#2563eb"
  },
  {
    id: 2,
    name: "Mr. Romel Conquilla",
    subject: "Information Management",
    date: "Thu Mar 21",
    time: "10:00 - 11:00 AM",
    avatar: "person",
    color: "#2563eb"
  },
  {
    id: 3,
    name: "Mr. John Ray Subrastas",
    subject: "Application Development and Emerging Technologies",
    date: "Fri Mar 22",
    time: "2:00 - 3:00 PM",
    avatar: "person",
    color: "#2563eb"
  },
  {
    id: 4,
    name: "Mr. Herman Zafra",
    subject: "Theology - Christian Faith",
    date: "Mon Mar 25",
    time: "1:00 - 2:00 PM",
    avatar: "person",
    color: "#2563eb"
  }
];

const basicEduAppointments = [
  {
    id: 5,
    name: "Ms. Kryzl Rivera",
    subject: "Mathematics",
    date: "Tue Mar 26",
    time: "9:00 - 10:00 AM",
    avatar: "face_3",
    color: "#ec4899"
  },
  {
    id: 6,
    name: "Ms. Sheryn Cuabo",
    subject: "Araling Panlipunan",
    date: "Wed Mar 27",
    time: "11:00 AM - 12:00 PM",
    avatar: "face_3",
    color: "#ec4899"
  },
  {
    id: 7,
    name: "Ms. Charlotte Cirilo",
    subject: "English",
    date: "Thu Mar 28",
    time: "3:00 - 4:00 PM",
    avatar: "face_3",
    color: "#ec4899"
  }
];

const pastAppointments = [
  {
    id: 10,
    name: "Mr. John Doe",
    subject: "History",
    date: "Mon Mar 11",
    time: "9:00 - 10:00 AM",
    avatar: "person",
    color: "#94a3b8"
  }
];

// App State
let currentUser = null;
let currentRole = 'student';
let currentPage = 'login';
let currentLevel = 'college'; // 'basic' or 'college'
let currentTab = 'upcoming';
let selectedAppointment = null;
let historyStack = ['login'];

// DOM Elements
const pages = {
  login: document.getElementById('page-login'),
  home: document.getElementById('page-home'),
  schedule: document.getElementById('page-schedule'),
  alerts: document.getElementById('page-alerts')
};

// Initialize App
function init() {
  renderHomeAppointments();
  renderScheduleList();
}

// Navigation Logic
function navigateTo(pageId, pushToHistory = true) {
  // Hide all pages
  Object.values(pages).forEach(page => page.classList.remove('active'));
  
  // Show target page
  if (pages[pageId]) {
    pages[pageId].classList.add('active');
    currentPage = pageId;
    if (pushToHistory) historyStack.push(pageId);
    
    // Sync nav icons
    updateNavIcons();
  }
}

function goBack() {
  if (historyStack.length > 1) {
    historyStack.pop();
    const prevPage = historyStack[historyStack.length - 1];
    navigateTo(prevPage, false);
  }
}

function updateNavIcons() {
  const navIds = ['nav-home', 'nav-schedule', 'nav-alerts', 'nav-home2', 'nav-schedule2', 'nav-alerts2'];
  navIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (id.includes(currentPage)) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }
  });
}

// Login Logic
function selectRole(role) {
  currentRole = role;
  document.getElementById('role-student').classList.toggle('active', role === 'student');
  document.getElementById('role-teacher').classList.toggle('active', role === 'teacher');
}

function togglePassword() {
  const input = document.getElementById('login-password');
  const icon = document.querySelector('#eye-icon .material-icons-round');
  if (input.type === 'password') {
    input.type = 'text';
    icon.textContent = 'visibility_off';
  } else {
    input.type = 'password';
    icon.textContent = 'visibility';
  }
}

function doSignIn() {
  const email = document.getElementById('login-email').value;
  if (!email) {
    showToast("Please enter your email");
    return;
  }
  
  currentUser = email.split('@')[0] || "User";
  document.getElementById('home-greeting').textContent = `Good Day, ${currentUser}!`;
  
  showToast("Signing in...");
  setTimeout(() => {
    navigateTo('home');
  }, 800);
}

function doLogout() {
  currentUser = null;
  historyStack = ['login'];
  navigateTo('login', false);
  showToast("Logged out successfully");
}

// Home Logic
function goToSchedule(level) {
  currentLevel = level;
  document.getElementById('schedule-title').textContent = level === 'college' ? 'College' : 'Basic Education';
  renderScheduleList();
  navigateTo('schedule');
}

function goToAlerts() {
  navigateTo('alerts');
}

function navTo(page) {
  navigateTo(page);
}

// Rendering Logic
function renderHomeAppointments() {
  const container = document.getElementById('home-appointments');
  container.innerHTML = '';
  
  // Show first 3 college appointments on home
  collegeAppointments.slice(0, 3).forEach(appt => {
    container.appendChild(createApptCard(appt));
  });
}

function renderScheduleList() {
  const container = document.getElementById('schedule-list');
  container.innerHTML = '';
  
  let list = [];
  if (currentTab === 'past') {
    list = pastAppointments;
  } else {
    list = currentLevel === 'college' ? collegeAppointments : basicEduAppointments;
  }
  
  list.forEach(appt => {
    container.appendChild(createApptCard(appt));
  });
}

function createApptCard(appt) {
  const card = document.createElement('div');
  card.className = 'appt-card';
  card.style.borderLeftColor = appt.color;
  card.onclick = () => viewApptDetails(appt);
  
  card.innerHTML = `
    <div class="appt-card-main">
      <p class="appt-label">Appointment date</p>
      <div class="appt-date-row">
        <span class="material-icons-round">calendar_today</span>
        <span>${appt.date} • ${appt.time}</span>
      </div>
      <div class="appt-profile">
        <div class="appt-avatar">
          <span class="material-icons-round">${appt.avatar}</span>
        </div>
        <div class="appt-info">
          <h4>${appt.name}</h4>
          <p>${appt.subject}</p>
        </div>
      </div>
    </div>
    <button class="dot-btn" onclick="openDotMenu(event, ${appt.id})">
      <span class="material-icons-round">more_vert</span>
    </button>
  `;
  
  return card;
}

// Tab Switching
function switchTab(tab) {
  currentTab = tab;
  document.getElementById('tab-upcoming').classList.toggle('active', tab === 'upcoming');
  document.getElementById('tab-past').classList.toggle('active', tab === 'past');
  renderScheduleList();
}

// Modal Logic
function viewApptDetails(appt) {
  selectedAppointment = appt;
  document.getElementById('modal-name').textContent = appt.name;
  document.getElementById('modal-subject').textContent = appt.subject;
  document.getElementById('modal-date').textContent = appt.date;
  document.getElementById('modal-time').textContent = appt.time;
  
  const avatarEl = document.getElementById('modal-avatar');
  avatarEl.innerHTML = `<span class="material-icons-round">${appt.avatar}</span>`;
  avatarEl.style.color = appt.color;
  
  document.getElementById('appt-modal').classList.add('active');
}

function closeApptModal() {
  document.getElementById('appt-modal').classList.remove('active');
}

function closeModal(e) {
  if (e.target.id === 'appt-modal') closeApptModal();
}

// Messaging Logic
function openMessageModal() {
  document.getElementById('msg-recipient').textContent = selectedAppointment.name;
  document.getElementById('message-modal').classList.add('active');
}

function closeMessageModal() {
  document.getElementById('message-modal').classList.remove('active');
}

function closeMessageOverlay(e) {
  if (e.target.id === 'message-modal') closeMessageModal();
}

function sendMessage() {
  const msg = document.getElementById('msg-body').value;
  if (!msg) {
    showToast("Please enter a message");
    return;
  }
  showToast("Message sent to " + selectedAppointment.name);
  document.getElementById('msg-body').value = '';
  closeMessageModal();
}

// Email Logic
function openEmailModal() {
  document.getElementById('email-recipient').textContent = selectedAppointment.name;
  document.getElementById('email-modal').classList.add('active');
}

function closeEmailModal() {
  document.getElementById('email-modal').classList.remove('active');
}

function closeEmailOverlay(e) {
  if (e.target.id === 'email-modal') closeEmailModal();
}

function sendEmail() {
  const subject = document.getElementById('email-subject').value;
  const body = document.getElementById('email-body').value;
  
  if (!subject || !body) {
    showToast("Please fill in subject and message");
    return;
  }
  
  showToast("Email sent successfully!");
  document.getElementById('email-subject').value = '';
  document.getElementById('email-body').value = '';
  closeEmailModal();
}

// Other UI Actions
function cancelAppointment() {
  if (confirm("Are you sure you want to cancel this appointment?")) {
    showToast("Appointment cancelled");
    closeApptModal();
  }
}

function showToast(text) {
  const toast = document.getElementById('toast');
  toast.textContent = text;
  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 2500);
}

// Dot Menu Logic
function openDotMenu(e, id) {
  e.stopPropagation();
  const menu = document.getElementById('dot-menu');
  menu.classList.remove('hidden');
  menu.style.top = (e.pageY + 10) + 'px';
  menu.style.left = (e.pageX - 100) + 'px';
}

function closeDotMenu() {
  document.getElementById('dot-menu').classList.add('hidden');
}

document.addEventListener('click', () => {
  closeDotMenu();
});

// Auth Extras
function showForgotModal() { document.getElementById('forgot-modal').classList.add('active'); }
function closeForgotModal() { document.getElementById('forgot-modal').classList.remove('active'); }
function closeForgotOverlay(e) { if (e.target.id === 'forgot-modal') closeForgotModal(); }
function sendResetLink() { 
  if (!document.getElementById('forgot-email').value) return showToast("Enter email");
  showToast("Reset link sent!"); closeForgotModal(); 
}

function showSignUpModal() { document.getElementById('signup-modal').classList.add('active'); }
function closeSignUpModal() { document.getElementById('signup-modal').classList.remove('active'); }
function closeSignUpOverlay(e) { if (e.target.id === 'signup-modal') closeSignUpModal(); }
function selectSignUpRole(role) {
  document.getElementById('signup-role-student').classList.toggle('active', role === 'student');
  document.getElementById('signup-role-teacher').classList.toggle('active', role === 'teacher');
}
function doSignUp() {
  if (!document.getElementById('signup-name').value) return showToast("Enter name");
  showToast("Account created! Please sign in.");
  closeSignUpModal();
}

// Start app
init();
