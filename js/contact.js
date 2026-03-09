document.querySelector('.contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  var form = this;
  var btn = form.querySelector('.contact-submit');
  var msg = document.getElementById('contact-success');
  btn.disabled = true;
  btn.textContent = 'Sending...';
  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  }).then(function(res) {
    if (res.ok) {
      msg.classList.add('show');
      form.reset();
      setTimeout(function() { msg.classList.remove('show'); }, 10000);
    }
  }).finally(function() {
    btn.disabled = false;
    btn.textContent = 'Send Message';
  });
});
