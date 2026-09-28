// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Click any gallery image to open it full size
const gallery = document.querySelectorAll('.gallery img');
if (gallery.length) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<img alt="">';
  document.body.appendChild(lightbox);
  const full = lightbox.querySelector('img');

  const close = () => {
    lightbox.classList.remove('open');
    full.src = '';
  };

  gallery.forEach((img) => {
    img.addEventListener('click', () => {
      full.src = img.currentSrc || img.src;
      full.alt = img.alt;
      lightbox.classList.add('open');
    });
  });

  lightbox.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}
