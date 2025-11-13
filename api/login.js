const loginForm = document.getElementById('loginForm');
const loginMsg = document.getElementById('loginMsg');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nid = document.getElementById('nid').value.trim();
  const upazila = document.getElementById('upazila').value.trim();
  const district = document.getElementById('district').value.trim();
  const division = document.getElementById('division').value.trim();

  console.log('Login attempt with:', { nid, upazila, district, division });

  try {
    loginMsg.textContent = 'চেক করা হচ্ছে...';
    
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ nid, upazila, district, division })
    });

    console.log('Response status:', res.status);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const text = await res.text();
    console.log('Raw response:', text);
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid response from server');
    }

    console.log('Parsed data:', data);

    if(data.success) {
      sessionStorage.setItem('nid', nid);
      window.location.href = '/index.html';
    } else {
      loginMsg.textContent = data.message;
    }
  } catch (error) {
    console.error('Full login error:', error);
    loginMsg.textContent = `নেটওয়ার্ক ত্রুটি: ${error.message}`;
  }
});
