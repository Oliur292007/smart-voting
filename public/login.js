const loginForm = document.getElementById('loginForm');
const loginMsg = document.getElementById('loginMsg');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nid = document.getElementById('nid').value.trim();
  const upazila = document.getElementById('upazila').value.trim();
  const district = document.getElementById('district').value.trim();
  const division = document.getElementById('division').value.trim();

  console.log('Sending login request:', { nid, upazila, district, division });

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nid, upazila, district, division })
    });

    console.log('Response status:', res.status);
    
    // Check if response is JSON
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('Non-JSON response:', text);
      throw new Error('সার্ভার থেকে ভুল রেসপন্স');
    }

    const data = await res.json();
    console.log('Response data:', data);

    if(data.success) {
      sessionStorage.setItem('nid', nid);
      window.location.href = '/index.html';
    } else {
      loginMsg.textContent = data.message;
    }
  } catch (error) {
    console.error('Login error:', error);
    loginMsg.textContent = 'নেটওয়ার্ক ত্রুটি! আবার চেষ্টা করুন।';
  }
});
