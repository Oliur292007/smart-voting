const loginForm = document.getElementById('loginForm');
const loginMsg = document.getElementById('loginMsg');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nid = document.getElementById('nid').value.trim();
  const upazila = document.getElementById('upazila').value.trim();
  const district = document.getElementById('district').value.trim();
  const division = document.getElementById('division').value.trim();

  console.log('Sending login request:', { nid, upazila, district, division });

  // Show loading
  loginMsg.textContent = 'চেক করা হচ্ছে...';
  loginMsg.style.color = 'blue';

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nid, upazila, district, division })
    });

    console.log('Response status:', res.status);
    
    const text = await res.text();
    console.log('Raw response:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error(`সার্ভার ত্রুটি: ${text}`);
    }

    if(data.success) {
      sessionStorage.setItem('nid', nid);
      window.location.href = '/index.html';
    } else {
      loginMsg.textContent = data.message;
      loginMsg.style.color = 'red';
    }
  } catch (error) {
    console.error('Login error:', error);
    loginMsg.textContent = error.message || 'নেটওয়ার্ক ত্রুটি! আবার চেষ্টা করুন।';
    loginMsg.style.color = 'red';
  }
});
