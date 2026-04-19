console.log('🚀 Danauth Hub: Script main.js carrgado e inciando no escopo global...');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM carrgado. Iniciando listeners e UI...');
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
  // --- AI LABS LOGIC ---
  const LAB_CONFIG = {
    authWebhook: 'https://n8n.danauth.info/webhook/lab-auth',
    verifyWebhook: 'https://n8n.danauth.info/webhook/lab-verify',
    genWebhook: 'https://n8n.danauth.info/webhook/lab-generate',
    feedWebhook: 'https://n8n.danauth.info/webhook/lab-feed',
    paymentWebhook: 'https://n8n.danauth.info/webhook/lab-create-payment'
  };

  const LabState = {
    user: JSON.parse(localStorage.getItem('lab_user')) || null,
    currentTab: 'mine',
    isGenerating: false
  };

  const initLab = () => {
    // Global UI Sync (Header)
    updateAuthUI();

    // Authentication Listeners (Global - works on Lab page and Login page)
    const btnLogin = document.getElementById('btn-lab-login');
    const btnVerify = document.getElementById('btn-lab-verify');
    const btnResend = document.getElementById('btn-lab-resend');
    const btnLogout = document.getElementById('btn-lab-logout');

    console.log('Lab IDs found:', { btnLogin: !!btnLogin, btnVerify: !!btnVerify });

    // Google Auth Programmatic Initialization
    if (window.google && document.getElementById('google-login-btn')) {
      console.log('Finalizing Google Auth UI Rendering...');
      google.accounts.id.initialize({
        client_id: "1016363962096-v6l5d5ctmqvvps0o6nf9e968rb59gu7j.apps.googleusercontent.com",
        callback: window.handleGoogleResponse,
        context: "signin",
        ux_mode: "popup"
      });
      google.accounts.id.renderButton(
        document.getElementById("google-login-btn"),
        { 
          theme: "outline", 
          size: "large", 
          shape: "rectangular", 
          text: "signin_with", 
          logo_alignment: "left",
          width: "100%" 
        }
      );
    }

    if (btnLogin) btnLogin.addEventListener('click', handleLogin);
    if (btnVerify) btnVerify.addEventListener('click', handleVerify);
    if (btnResend) btnResend.addEventListener('click', () => handleLogin(true));
    if (btnLogout) btnLogout.addEventListener('click', handleLogout);

    // AI Lab specific logic (only if on Lab page)
    const labContent = document.querySelector('.generator-panel');
    if (labContent) {
      fetchGallery();
      document.getElementById('btn-generate')?.addEventListener('click', handleGenerate);
      
      // Enter key support for OTP
      document.getElementById('lab-otp')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleVerify();
      });
      
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
          LabState.currentTab = e.target.dataset.tab;
          fetchGallery();
        });
      });
    }
  };

  async function handleLogin(isResend = false) {
    const email = document.getElementById('lab-email')?.value.trim();
    const password = document.getElementById('lab-password')?.value.trim();
    const firstName = document.getElementById('lab-first-name')?.value.trim();
    const lastName = document.getElementById('lab-last-name')?.value.trim();
    const mode = window.currentAuthMode || 'signup';

    if (!email || !email.includes('@')) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    if (!password || password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (mode === 'signup' && (!firstName || !lastName)) {
      alert('Por favor, preencha seu nome e sobrenome.');
      return;
    }

    const btn = isResend ? document.getElementById('btn-lab-resend') : document.getElementById('btn-lab-login');
    if (!btn) {
      console.error('Botão de login não encontrado no DOM!');
      return;
    }

    const originalText = btn.innerText;
    btn.disabled = true;
    btn.innerText = 'Processando...';

    console.log('Iniciando login/cadastro:', { email, mode, isResend });

    try {
      const resp = await fetch(LAB_CONFIG.authWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          firstName, 
          lastName, 
          mode, 
          isResend 
        })
      });
      
      if (!resp.ok) throw new Error(`HTTP Error: ${resp.status}`);
      
      const data = await resp.json();
      console.log('Resposta do servidor:', data);
      
      if (data.success) {
        if (data.directLogin) {
          // Password Login Successful (Existing User)
          LabState.user = {
            email,
            token: data.sessionToken,
            credits: data.credits
          };
          localStorage.setItem('lab_user', JSON.stringify(LabState.user));
          updateAuthUI();
          alert('Login realizado com sucesso!');
          window.location.href = '/ai-labs.html';
          return;
        }

        // Registration Mode: Toggle steps
        const s1 = document.getElementById('step-1') || document.getElementById('auth-step-1');
        const s2 = document.getElementById('step-2') || document.getElementById('auth-step-2');
        
        if (s1 && s2 && !isResend) {
          s1.style.display = 'none';
          s2.style.display = 'flex';
          const otpInput = document.getElementById('lab-otp');
          if (otpInput) setTimeout(() => otpInput.focus(), 100);
        }
        
        if (isResend) startResendCooldown(btn);
        alert(data.message || 'Código enviado! Verifique seu e-mail.');
      } else {
        alert(data.message || 'Erro ao processar. Tente novamente.');
      }
    } catch (err) {
      console.error('Login Error:', err);
      alert('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      if (!isResend) {
        btn.disabled = false;
        btn.innerText = originalText;
      }
    }
  }

  // Google Login Callback
  window.handleGoogleResponse = async function(response) {
    console.log('Google Auth Global Handler Triggered');
    console.log('Google Response received, sending to backend...');
    try {
      const resp = await fetch(LAB_CONFIG.authWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          googleToken: response.credential,
          mode: 'google'
        })
      });

      if (!resp.ok) throw new Error(`HTTP Error: ${resp.status}`);

      const data = await resp.json();
      console.log('Google Auth Data:', data);

      if (data.success) {
        LabState.user = {
          email: data.email,
          token: data.sessionToken,
          credits: data.credits || 0
        };
        localStorage.setItem('lab_user', JSON.stringify(LabState.user));
        updateAuthUI();
        console.log('Redirecting to AI Labs...');
        window.location.href = '/ai-labs.html';
      } else {
        alert('Erro no Login Google: ' + (data.message || 'Falha na autenticação'));
      }
    } catch (err) {
      console.error('Google Auth Error:', err);
      alert('Erro ao processar login com Google. Verifique o console.');
    }
  }

  function startResendCooldown(btn) {
    let timeLeft = 60;
    btn.disabled = true;
    const timer = setInterval(() => {
      timeLeft--;
      btn.innerText = `Reenviar (${timeLeft}s)`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        btn.disabled = false;
        btn.innerText = 'Reenviar';
      }
    }, 1000);
  }

  async function handleVerify() {
    const email = document.getElementById('lab-email')?.value.trim();
    const code = document.getElementById('lab-otp')?.value.trim();

    if (!code || code.length < 6) {
      alert('Por favor, insira o código de 6 dígitos enviado ao seu e-mail.');
      return;
    }

    const btn = document.getElementById('btn-lab-verify');
    if (!btn) {
      console.error('Botão de verificação não encontrado!');
      return;
    }
    
    const originalText = btn.innerText;
    btn.disabled = true;
    btn.innerText = 'Verificando...';

    console.log('Iniciando verificação de código:', { email, code });

    try {
      const resp = await fetch(LAB_CONFIG.verifyWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      if (!resp.ok) throw new Error(`HTTP Error: ${resp.status}`);

      const data = await resp.json();
      console.log('Resposta de verificação:', data);

      if (data.success) {
        LabState.user = {
          email,
          token: data.sessionToken,
          credits: data.credits || 0
        };
        localStorage.setItem('lab_user', JSON.stringify(LabState.user));
        updateAuthUI();
        
        console.log('Verificação bem-sucedida, redirecionando...');
        if (window.location.pathname.includes('login.html')) {
          alert('Acesso confirmado! Redirecionando...');
          window.location.href = '/ai-labs.html';
        } else {
          alert(`Sucesso! Você tem ${data.credits} créditos disponíveis.`);
          const s1 = document.getElementById('step-1') || document.getElementById('auth-step-1');
          const s2 = document.getElementById('step-2') || document.getElementById('auth-step-2');
          if (s1 && s2) {
            s2.style.display = 'none';
            s1.style.display = 'flex';
          }
          fetchGallery();
        }
      } else {
        alert(data.message || 'Código incorreto ou expirado. Tente novamente.');
      }
    } catch (err) {
      console.error('Verify Error:', err);
      alert('Erro ao processar verificação. Verifique sua conexão e tente novamente.');
    } finally {
      btn.disabled = false;
      btn.innerText = 'Confirmar Acesso';
    }
  }

  function handleLogout() {
    localStorage.removeItem('lab_user');
    LabState.user = null;
    updateAuthUI();
    if (window.location.pathname.includes('ai-labs.html')) {
       fetchGallery();
       window.location.reload(); // Hard refresh to clear restricted UI
    }
  }

  function updateAuthUI() {
    const headerAuth = document.getElementById('header-auth-buttons');
    const labStatus = document.getElementById('lab-status-bar');
    const labCreditsDisplay = document.getElementById('lab-credits-display');
    const userDisplay = document.getElementById('user-display');
    const userCredits = document.getElementById('user-credits');

    if (LabState.user) {
      // Header Update
      if (headerAuth) {
        headerAuth.innerHTML = `
          <div class="header-user-info">
            <div class="header-credits">${LabState.user.credits} CRÉDITOS</div>
            <button class="btn-signout" id="btn-header-logout">Sair</button>
          </div>
        `;
        document.getElementById('btn-header-logout')?.addEventListener('click', handleLogout);
      }

      // Lab Page Update
      if (labStatus) {
        if (userDisplay) userDisplay.innerText = LabState.user.email;
        if (userCredits) userCredits.innerText = `${LabState.user.credits} CRÉDITOS`;
        if (labCreditsDisplay) labCreditsDisplay.style.display = 'flex';
      }
    } else {
      // Header Update (Guest)
      if (headerAuth) {
        headerAuth.innerHTML = `
          <a href="/login.html" class="login-link">Log in</a>
          <a href="/login.html" class="btn-signup">Sign up</a>
        `;
      }

      // Lab Page Update (Guest)
      if (labStatus) {
        if (userDisplay) userDisplay.innerText = 'Desconectado - Faça login para criar';
        if (labCreditsDisplay) labCreditsDisplay.style.display = 'none';
      }
    }
  }

  async function handleGenerate() {
    if (!LabState.user) {
      alert('Você precisa estar logado para gerar imagens.');
      return;
    }

    if (LabState.user.credits <= 0) {
      alert('Seus créditos expiraram. Entre em contato para pacotes premium!');
      return;
    }

    const prompt = document.getElementById('prompt-input').value.trim();
    if (!prompt) {
      alert('Descreva sua ideia antes de gerar.');
      return;
    }

    const btn = document.getElementById('btn-generate');
    const btnText = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.loader');

    LabState.isGenerating = true;
    btn.disabled = true;
    btnText.style.display = 'none';
    loader.style.display = 'inline-block';

    try {
      const resp = await fetch(LAB_CONFIG.genWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          token: LabState.user.token 
        })
      });
      
      const data = await resp.json();
      
      // Update local credits
      LabState.user.credits -= 1;
      localStorage.setItem('lab_user', JSON.stringify(LabState.user));
      updateAuthUI();

      // Show success and switch tab
      alert('Imagem gerada com sucesso! Verifique em "Minhas Criações".');
      document.getElementById('tab-my-creations').click();
      
    } catch (err) {
      console.error('Gen Error:', err);
      alert('Ocorreu um erro na geração. Verifique sua conexão.');
    } finally {
      LabState.isGenerating = false;
      btn.disabled = false;
      btnText.style.display = 'inline-block';
      loader.style.display = 'none';
    }
  }

  async function fetchGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    grid.innerHTML = '<div class="gallery-empty">Sincronizando com o Lab...</div>';

    try {
      const url = `${LAB_CONFIG.feedWebhook}?type=${LabState.currentTab}&token=${LabState.user?.token || ''}`;
      const resp = await fetch(url);
      const data = await resp.json();

      if (!data || data.length === 0) {
        grid.innerHTML = '<div class="gallery-empty">Nenhuma obra encontrada nesta galeria ainda.</div>';
        return;
      }

      grid.innerHTML = data.map(item => `
        <div class="gallery-item glass reveal active">
          <img src="${item.fields.ImageURL}" alt="AI Generation" loading="lazy">
          <div class="gallery-overlay">
            <p>${item.fields.Prompt}</p>
          </div>
        </div>
      `).join('');

    } catch (err) {
      console.error('Feed Error:', err);
      grid.innerHTML = '<div class="gallery-empty">Falha ao carregar galeria.</div>';
    }
  }

  // --- Dynamic Payment Integration ---
  window.initiatePayment = async function(plan) {
    if (!LabState.user) {
      alert('Por favor, faça login para comprar créditos.');
      window.location.href = '/login.html';
      return;
    }

    const email = LabState.user.email;
    const btn = event?.target || document.querySelector(`.btn-buy[onclick*="${plan}"]`);
    const originalText = btn ? btn.innerText : 'Comprar';
    
    if (btn) {
      btn.disabled = true;
      btn.innerText = 'Processando...';
    }

    try {
      const resp = await fetch(LAB_CONFIG.paymentWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, email })
      });
      const data = await resp.json();
      
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error('Fallback to manual payment');
      }
    } catch (err) {
      console.error('Payment Error:', err);
      const contactUrl = `https://wa.me/5581971217036?text=Olá! Gostaria de comprar o plano ${plan.toUpperCase()} no Danauth AI Lab.`;
      window.open(contactUrl, '_blank');
      if (btn) {
        btn.disabled = false;
        btn.innerText = originalText;
      }
    }
  };

  initLab();
});
