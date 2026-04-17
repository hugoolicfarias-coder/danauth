document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const revealElements = document.querySelectorAll('.reveal');

  // Header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Reveal on scroll animation
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;

    revealElements.forEach(el => {
      const revealTop = el.getBoundingClientRect().top;
      if (revealTop < windowHeight - revealPoint) {
        el.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial check

  // Mobile Menu Toggle (Simple placeholder logic)
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      // For a real premium site, we'd add a full-screen overlay
      // For now, let's just alert or toggle a class
      navLinks.classList.toggle('mobile-active');
      console.log('Mobile menu toggled');
    });
  }
});
