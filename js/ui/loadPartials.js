// js/ui/loadPartials.js
async function loadPartial(id, url) {
  const resp = await fetch(url);
  document.getElementById(id).innerHTML = await resp.text();
}

// load auth modal
loadPartial('authRoot', 'partials/authModal.html');
