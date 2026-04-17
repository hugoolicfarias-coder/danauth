document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const chatBubble = document.getElementById('chat-bubble');
  const chatWindow = document.getElementById('chat-window');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  // Header Scroll Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    revealElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementTop < windowHeight - 100) {
        el.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial check

  // Mobile Menu Toggle
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-active');
      if (navLinks.classList.contains('mobile-active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  // Authie Chat Logic
  if (chatBubble && chatWindow) {
    chatBubble.addEventListener('click', () => {
      chatWindow.classList.toggle('active');
    });

    const messagesContainer = chatWindow.querySelector('.chat-messages');

    const addMessage = (text, type) => {
      const msg = document.createElement('div');
      msg.className = `message ${type}`;
      msg.textContent = text;
      msg.style.margin = '5px 0';
      msg.style.padding = '8px 12px';
      msg.style.borderRadius = '10px';
      msg.style.fontSize = '0.85rem';
      msg.style.maxWidth = '80%';
      
      if (type === 'bot') {
        msg.style.background = 'rgba(255,255,255,0.05)';
        msg.style.alignSelf = 'flex-start';
      } else {
        msg.style.background = 'var(--accent)';
        msg.style.color = '#000';
        msg.style.alignSelf = 'flex-end';
      }
      
      messagesContainer.appendChild(msg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    // Auto Greeting after 3 seconds
    setTimeout(() => {
      if (!chatWindow.classList.contains('active')) {
        addMessage("Olá! Sou a Authie. Como posso ajudar com o seu projeto digital hoje?", "bot");
      }
    }, 3000);
  }
});
