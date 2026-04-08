// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Mobile menu
const navLinks = document.querySelector('.nav-links');
const hamburger = document.querySelector('.hamburger');
const navLinkItems = document.querySelectorAll('.nav-links a, .nav-cta');
const scrollSections = document.querySelectorAll('section[id]');
const backToTop = document.createElement('button');

backToTop.className = 'back-to-top';
backToTop.type = 'button';
backToTop.innerText = '↑';
backToTop.setAttribute('aria-label', 'Back to top');
document.body.appendChild(backToTop);

function toggleMenu() {
  navLinks.classList.toggle('show-mobile');
  hamburger.classList.toggle('active');
}

function closeMenu() {
  navLinks.classList.remove('show-mobile');
  hamburger.classList.remove('active');
}

function updateActiveLink() {
  const scrollY = window.pageYOffset;

  scrollSections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

    if (!link) return;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

navLinkItems.forEach(link => {
  link.addEventListener('click', closeMenu);
});

window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  nav.style.boxShadow = window.scrollY > 50 ? '0 4px 30px rgba(0,0,0,0.4)' : 'none';
  backToTop.classList.toggle('visible', window.scrollY > 400);
  updateActiveLink();
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

updateActiveLink();

// Form submit
function submitForm(btn) {
  const form = btn.closest('form');
  if (form) {
    const email = form.querySelector('input[type="email"]');
    if (email && email.value.trim() === '') {
      email.focus();
      return;
    }
  }

  btn.textContent = '✓ Message Sent! We\'ll be in touch.';
  btn.style.background = '#2d7a4f';
  btn.style.color = '#fff';
  btn.style.borderColor = '#2d7a4f';
  btn.disabled = true;
}

// SDG tile hover tooltips
const sdgDescriptions = {
  1: 'End poverty in all its forms everywhere',
  2: 'End hunger, achieve food security',
  3: 'Ensure healthy lives for all',
  4: 'Ensure inclusive and equitable quality education',
  5: 'Achieve gender equality and empower all women and girls',
  6: 'Ensure availability of clean water and sanitation',
  7: 'Ensure access to affordable, reliable, sustainable energy',
  8: 'Promote sustained, inclusive economic growth',
  9: 'Build resilient infrastructure, promote innovation',
  10: 'Reduce inequality within and among countries',
  11: 'Make cities inclusive, safe, resilient and sustainable',
  12: 'Ensure sustainable consumption and production patterns',
  13: 'Take urgent action to combat climate change',
  14: 'Conserve and sustainably use the oceans',
  15: 'Protect, restore and promote terrestrial ecosystems',
  16: 'Promote peaceful and inclusive societies',
  17: 'Strengthen means of implementation and global partnerships'
};

document.querySelectorAll('.sdg-tile').forEach((tile, i) => {
  tile.title = sdgDescriptions[i + 1] || '';
});
