(function () {
  var figures = document.querySelectorAll('.main-figure');

  figures.forEach(function (fig) {
    var border = fig.querySelector('.image-border');
    if (!border) return;

    // Create expand icon
    var icon = document.createElement('div');
    icon.className = 'expand-icon';
    icon.innerHTML = '&#x26F6;';
    border.style.position = 'relative';
    border.appendChild(icon);

    border.addEventListener('click', function (e) {
      if (e.target.closest('button, a, input, select')) return;
      if (document.body.classList.contains('expand-active')) return;
      openOverlay(border);
    });
  });

  function openOverlay(border) {
    var placeholder = document.createElement('div');
    placeholder.className = 'expand-placeholder';
    placeholder.style.height = border.offsetHeight + 'px';
    border.parentNode.insertBefore(placeholder, border);

    var overlay = document.createElement('div');
    overlay.className = 'expand-overlay';

    var closeBtn = document.createElement('div');
    closeBtn.className = 'expand-close';
    closeBtn.innerHTML = '&times;';

    var icon = border.querySelector('.expand-icon');
    if (icon) icon.style.display = 'none';

    border.classList.add('expand-content');
    overlay.appendChild(closeBtn);
    overlay.appendChild(border);
    document.body.appendChild(overlay);
    document.body.classList.add('expand-active');

    // Check if this is a static image (no interactive content)
    var img = border.querySelector('img');
    var isInteractive = border.querySelector('svg, canvas, #brain-chart, .network-chart-wrap');
    var zoomState = null;

    if (img && !isInteractive) {
      zoomState = { scale: 1, x: 0, y: 0, dragging: false, startX: 0, startY: 0 };
      img.style.transformOrigin = '0 0';
      img.style.cursor = 'grab';
      border.style.overflow = 'hidden';

      border.addEventListener('wheel', onWheel, { passive: false });
      img.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }

    function applyTransform() {
      img.style.transform = 'translate(' + zoomState.x + 'px, ' + zoomState.y + 'px) scale(' + zoomState.scale + ')';
    }

    function onWheel(e) {
      e.preventDefault();
      var rect = border.getBoundingClientRect();
      var mouseX = e.clientX - rect.left;
      var mouseY = e.clientY - rect.top;

      var prevScale = zoomState.scale;
      var delta = e.deltaY > 0 ? 0.9 : 1.1;
      zoomState.scale = Math.min(Math.max(zoomState.scale * delta, 1), 8);

      // Zoom toward cursor position
      var ratio = zoomState.scale / prevScale;
      zoomState.x = mouseX - ratio * (mouseX - zoomState.x);
      zoomState.y = mouseY - ratio * (mouseY - zoomState.y);

      // Reset pan if fully zoomed out
      if (zoomState.scale <= 1) {
        zoomState.x = 0;
        zoomState.y = 0;
      }

      applyTransform();
      img.style.cursor = zoomState.scale > 1 ? 'grab' : 'grab';
    }

    function onMouseDown(e) {
      if (zoomState.scale <= 1) return;
      e.preventDefault();
      zoomState.dragging = true;
      zoomState.startX = e.clientX - zoomState.x;
      zoomState.startY = e.clientY - zoomState.y;
      img.style.cursor = 'grabbing';
    }

    function onMouseMove(e) {
      if (!zoomState || !zoomState.dragging) return;
      zoomState.x = e.clientX - zoomState.startX;
      zoomState.y = e.clientY - zoomState.startY;
      applyTransform();
    }

    function onMouseUp() {
      if (!zoomState) return;
      zoomState.dragging = false;
      if (img) img.style.cursor = zoomState.scale > 1 ? 'grab' : 'grab';
    }

    function closeOverlay() {
      // Clean up zoom listeners
      if (zoomState) {
        border.removeEventListener('wheel', onWheel);
        img.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        img.style.transform = '';
        img.style.transformOrigin = '';
        img.style.cursor = '';
        border.style.overflow = '';
      }

      border.classList.remove('expand-content');
      if (icon) icon.style.display = '';
      placeholder.parentNode.insertBefore(border, placeholder);
      placeholder.parentNode.removeChild(placeholder);
      document.body.removeChild(overlay);
      document.body.classList.remove('expand-active');
      document.removeEventListener('keydown', escHandler);
    }

    closeBtn.addEventListener('click', closeOverlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeOverlay();
    });

    var escHandler = function (e) {
      if (e.key === 'Escape') closeOverlay();
    };
    document.addEventListener('keydown', escHandler);
  }
})();
