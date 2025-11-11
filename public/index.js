const nominees = document.querySelectorAll('.nominee');
const submitBtn = document.getElementById('submitBtn');
const confirmOverlay = document.getElementById('confirmOverlay');
const confirmText = document.getElementById('confirmText');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');
const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlayText');

let selectedNominee = null;

// চেক করুন ব্যবহারকারী লগইন করেছে কিনা
const nid = sessionStorage.getItem('nid');
if(!nid) {
  window.location.href = '/login.html';
}

// Nominee নির্বাচন
nominees.forEach(n => {
  n.addEventListener('click', () => {
    nominees.forEach(x => x.classList.remove('selected'));
    n.classList.add('selected');
    selectedNominee = n.dataset.bn;
  });
});

// Submit button ক্লিক করলে confirmation দেখানো
submitBtn.addEventListener('click', () => {
  if(!selectedNominee) return;
  confirmText.textContent = `আপনি কি নিশ্চিত যে ${selectedNominee}-কে ভোট দিতে চাচ্ছেন?`;
  confirmOverlay.classList.add('active');
});

// Confirmation Yes
confirmYes.addEventListener('click', async () => {
  // API call: ভোট সাবমিট
  const res = await fetch('/api/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nid, nominee: selectedNominee })
  });

  const data = await res.json();

  overlayText.textContent = data.message;
  overlay.classList.add('active');
  confirmOverlay.classList.remove('active');

  // ভোট দেওয়ার পর nominee selection reset
  nominees.forEach(x => x.classList.remove('selected'));
  selectedNominee = null;
});

// Confirmation No
confirmNo.addEventListener('click', () => {
  confirmOverlay.classList.remove('active');
});

// Overlay ক্লিক করলে hide
overlay.addEventListener('click', () => {
  overlay.classList.remove('active');
});


