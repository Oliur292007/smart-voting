const loginForm = document.getElementById('loginForm');
const loginMsg = document.getElementById('loginMsg');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nid = document.getElementById('nid').value.trim();
  const upazila = document.getElementById('upazila').value.trim();
  const district = document.getElementById('district').value.trim();
  const division = document.getElementById('division').value.trim();

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nid, upazila, district, division })
  });

  const data = await res.json();

  if(data.success) {
    // লগইন সফল
    sessionStorage.setItem('nid', nid);
    window.location.href = '/index.html';
  } else {
    // লগইন ব্যর্থ
    loginMsg.textContent = data.message;
  }
});


