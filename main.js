document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const revealElements = document.querySelectorAll('.reveal');

  // Header scroll effect
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
    revealOnScroll();
  };

  // Reveal on scroll animation
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 100;

    revealElements.forEach(el => {
      const revealTop = el.getBoundingClientRect().top;
      if (revealTop < windowHeight - revealPoint) {
        el.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-active');
      const isExpanded = navLinks.classList.contains('mobile-active');
      document.body.style.overflow = isExpanded ? 'hidden' : '';
    });
  }

  // Authie Chat Agent Logic
  const initAuthie = () => {
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    
    if (chatBubble && chatWindow) {
      chatBubble.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
      });

      // Simple auto-greeting after 2 seconds
      setTimeout(() => {
        const messagesContainer = document.querySelector('.chat-messages');
        if (messagesContainer && messagesContainer.children.length === 0) {
          const greeting = document.createElement('div');
          greeting.className = 'msg bot';
          greeting.textContent = 'Olá! Eu sou a Authie, sua assistente virtual. Como posso ajudar você hoje?';
          messagesContainer.appendChild(greeting);
        }
      }, 2000);
    }
  };

  initAuthie();
});

