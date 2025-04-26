// signup.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  const signupList = document.getElementById('signup-list');

  form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const role = document.getElementById('role').value;

      if (!name || !role) {
          alert('Please enter your name and select a role.');
          return;
      }

      await fetch('/signup', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, role })
      });

      form.reset();
      fetchSignups(); // refresh the list
  });

  async function fetchSignups() {
      const res = await fetch('/signups');
      const signups = await res.json();

      signupList.innerHTML = '';
      signups.forEach(user => {
          const li = document.createElement('li');
          li.textContent = `${user.name} (${user.role === 'lead' ? 'L' : 'F'})`;
          signupList.appendChild(li);
      });
  }

  fetchSignups(); // load initial list
});
