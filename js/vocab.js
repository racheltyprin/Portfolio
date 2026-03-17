// Position hover definitions to the right of the content well
document.querySelectorAll('.vocab').forEach(function(el) {
  el.addEventListener('mouseenter', function() {
    var def = el.querySelector('.vocab-def');
    if (!def) return;
    var well = el.closest('.content-well');
    if (!well) return;
    var wordTop = el.getBoundingClientRect().top;
    var wellTop = well.getBoundingClientRect().top;
    def.style.top = (wordTop - wellTop) + 'px';
  });
});

// Click vocab word -> scroll to glossary entry and highlight it
document.querySelectorAll('.vocab').forEach(function(el) {
  el.addEventListener('click', function(e) {
    var targetId = el.getAttribute('href');
    if (!targetId) return;
    var entry = document.querySelector(targetId);
    if (!entry) return;

    // Remove any existing highlight
    document.querySelectorAll('.glossary-entry.gloss-active').forEach(function(prev) {
      prev.classList.remove('gloss-active');
    });

    // Add highlight to the clicked entry
    entry.classList.add('gloss-active');
  });
});

// Click anywhere else to remove highlight
document.addEventListener('click', function(e) {
  if (!e.target.closest('.vocab')) {
    document.querySelectorAll('.glossary-entry.gloss-active').forEach(function(el) {
      el.classList.remove('gloss-active');
    });
  }
});
