document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const chatBubble = document.getElementById('chat-bubble');
  const chatWindow = document.getElementById('chat-window');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-item');

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
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('mobile-active');
      document.body.style.overflow = navLinks.classList.contains('mobile-active') ? 'hidden' : '';
    });
  }

  // Mobile Submenu Logic (Accordion)
  navItems.forEach(item => {
    const link = item.querySelector('a');
    const dropdown = item.querySelector('.dropdown');
    
    if (dropdown && window.innerWidth <= 991) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 991) {
          e.preventDefault();
          item.classList.toggle('active');
          
          // Close other submenus
          navItems.forEach(other => {
            if (other !== item) other.classList.remove('active');
          });
        }
      });
    }
  });

  // Close menu when clicking outside or on a final link
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('mobile-active') && !navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      navLinks.classList.remove('mobile-active');
      document.body.style.overflow = '';
    }
  });

  // Authie Chat Logic
  if (chatBubble && chatWindow) {
    const chatInput = chatWindow.querySelector('input');
    const messagesContainer = chatWindow.querySelector('.chat-messages');
    let isWaiting = false;

    const toggleChat = () => {
      chatWindow.classList.toggle('active');
      if (chatWindow.classList.contains('active')) {
        chatInput.focus();
      }
    };

    chatBubble.addEventListener('click', toggleChat);

    const addMessage = (text, type) => {
      const msg = document.createElement('div');
      msg.className = `message ${type}`;
      msg.innerHTML = text.replace(/\n/g, '<br>'); // Support newlines
      
      // Premium Styling for Messages
      Object.assign(msg.style, {
        margin: '8px 0',
        padding: '10px 14px',
        borderRadius: '12px',
        fontSize: '0.9rem',
        maxWidth: '85%',
        lineHeight: '1.4',
        position: 'relative'
      });

      if (type === 'bot') {
        msg.style.background = 'rgba(255,255,255,0.07)';
        msg.style.border = '1px solid rgba(255,255,255,0.1)';
        msg.style.alignSelf = 'flex-start';
        msg.style.borderBottomLeftRadius = '2px';
      } else {
        msg.style.background = 'var(--accent)';
        msg.style.color = '#000';
        msg.style.fontWeight = '500';
        msg.style.alignSelf = 'flex-end';
        msg.style.borderBottomRightRadius = '2px';
      }
      
      messagesContainer.appendChild(msg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      return msg;
    };

    const sendMessage = async () => {
      const text = chatInput.value.trim();
      if (!text || isWaiting) return;

      chatInput.value = '';
      addMessage(text, 'user');
      
      // Typing Indicator
      isWaiting = true;
      const loader = addMessage('<span class="typing-dots">Authie está pensando...</span>', 'bot');
      
      try {
        const response = await fetch('https://n8n.danauth.info/webhook/authie-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: text,
            sessionId: 'site-user-' + Date.now() 
          })
        });

        const data = await response.json();
        loader.remove();
        
        if (data.response) {
          addMessage(data.response, 'bot');
        } else {
          addMessage("Desculpe, tive um breve curto-circuito. Pode repetir?", "bot");
        }
      } catch (err) {
        loader.remove();
        addMessage("Estou com dificuldade de conexão no momento. Tente novamente em instantes!", "bot");
        console.error('Authie Error:', err);
      } finally {
        isWaiting = false;
      }
    };

    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });

    // Auto Greeting
    setTimeout(() => {
      if (!messagesContainer.hasChildNodes()) {
        addMessage("Olá! Sou a Authie, sua guia no Danauth Digital Hub. ✨ Como posso transformar seu negócio hoje?", "bot");
      }
    }, 2000);
  }
});
