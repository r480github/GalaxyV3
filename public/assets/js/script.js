function opencloak() {
  var win = window.open();
  var url = "index.html";
  var iframe = win.document.createElement("iframe");
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.src = url;
  win.document.body.style.overflow = "hidden";
  win.document.body.style.margin = "-10";
  win.document.body.style.padding = "-10";
  win.document.body.appendChild(iframe);
  window.location.href = "https://classroom.google.com/";
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.onload = function () {
  scrollToTop();
};

function showAlert(message = 'Games might take some time to load depending on your system specs and server status', width = '90%', maxWidth = '800px', padding = '40px') {
  const alertBox = document.getElementById('customAlert');
  document.getElementById('alertMessage').textContent = message;
  alertBox.style.display = 'flex';

  const alertContent = alertBox.querySelector('.alertContent');
  alertContent.style.width = width;
  alertContent.style.maxWidth = maxWidth;
  alertContent.style.padding = padding;

  window.addEventListener('click', closeOnOutsideClick);

  document.addEventListener('keydown', closeOnEscape);
}

function closeAlert() {
  document.getElementById('customAlert').style.display = 'none';

  window.removeEventListener('click', closeOnOutsideClick);

  document.removeEventListener('keydown', closeOnEscape);
}

function closeOnOutsideClick(event) {
  const alertBox = document.getElementById('customAlert');
  if (event.target === alertBox) {
      closeAlert();
  }
}

function closeOnEscape(event) {
  if (event.key === 'Escape') {
      closeAlert();
  }
}

function checkAlert() {
  if (!sessionStorage.getItem("alertDisplayed")) {
      showAlert();
      sessionStorage.setItem("alertDisplayed", "true");
  }
}

checkAlert();
