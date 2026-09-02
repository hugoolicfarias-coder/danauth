import { supabase } from './supabase.js';

console.log('🚀 Danauth Digital & 3D Solutions initialized.');

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.textContent = navMenu.classList.contains('active') ? 'close' : 'menu';
      }
    });

    // Close mobile menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = 'menu';
      });
    });
  }

  // 2. Contact Form to WhatsApp Redirect
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value || '';
      const contactInfo = document.getElementById('contact-info')?.value || '';
      const service = document.getElementById('contact-service')?.value || '';
      const message = document.getElementById('contact-message')?.value || '';

      const fullMessage = `Olá! Meu nome é ${name} (${contactInfo}).\nInteresse: ${service}\nMensagem: ${message}`;
      const encodedMsg = encodeURIComponent(fullMessage);
      const whatsappUrl = `https://wa.me/5582987584824?text=${encodedMsg}`;

      window.open(whatsappUrl, '_blank');
    });
  }

  // 3. Smooth Reveal Animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
