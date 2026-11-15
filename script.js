// Wait for the DOM content to load before executing scripts
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const formAlert = document.getElementById('formAlert');
  const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Retrieve form inputs
      const name = document.getElementById('userName').value.trim();
      const email = document.getElementById('userEmail').value.trim();
      const phone = document.getElementById('userPhone').value.trim();
      const message = document.getElementById('userMessage').value.trim();

      if (!name || !email || !message) {
        showAlert('Please fill out all required fields.', 'error');
        return;
      }

      // UI loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      try {
        // Send inquiry to Node.js / PostgreSQL backend
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, phone, message })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showAlert(`Thank you, ${name}! Your inquiry has been saved to the database. We will contact you soon.`, 'success');
          contactForm.reset();
        } else {
          showAlert(data.error || 'Failed to submit inquiry. Please try again.', 'error');
        }
      } catch (err) {
        console.error('Submission error:', err);
        showAlert('Could not reach the server. Make sure the Node.js server (node server.js) is running.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
      }
    });
  }

  // Helper function to display success/error alerts
  function showAlert(msg, type) {
    if (formAlert) {
      formAlert.textContent = msg;
      formAlert.className = `form-alert ${type}`;
      formAlert.style.display = 'block';
      formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      alert(msg);
    }
  }

  // Smooth scroll for in-page navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
