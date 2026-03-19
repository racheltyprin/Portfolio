const contactForm = document.querySelector('.contact-form');
if (!contactForm) return; // exits early on non-contact pages

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  var btn = contactForm.querySelector('.contact-submit');
  var msg = document.getElementById('contact-success');
  btn.disabled = true;
  btn.textContent = 'Sending...';
  fetch(contactForm.action, {
    method: 'POST',
    body: new FormData(contactForm),
    headers: { 'Accept': 'application/json' }
  }).then(function(res) {
    if (res.ok) {
      msg.classList.add('show');
      contactForm.reset();
      setTimeout(function() { msg.classList.remove('show'); }, 10000);
    }
  }).finally(function() {
    btn.disabled = false;
    btn.textContent = 'Send Message';
  });
});