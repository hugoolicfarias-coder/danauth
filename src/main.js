import { supabase } from './supabase.js';

console.log('🚀 Danauth Hub: Supabase Auth 3.0 Management Started');

// State Management
const LabState = {
  user: null,
  profile: null,
  currentTab: 'mine',
  isGenerating: false,
  authMode: 'signup'
};

const LAB_CONFIG = {
  // We keep these for non-auth automations if needed
  genWebhook: 'https://n8n.danauth.info/webhook/lab-generate',
  feedWebhook: 'https://n8n.danauth.info/webhook/lab-feed',
  paymentWebhook: 'https://n8n.danauth.info/webhook/lab-create-payment'
};

// --- AUTH SYSTEM CORE ---
window.AuthSystem = {
  setMode: (mode) => {
    LabState.authMode = mode;
    console.log('Auth Mode Switched:', mode);
  },
  
  initGoogleAuth: () => {
    const container = document.getElementById('google-login-btn');
    if (!container) return;
    
    // In Supabase, we usually just trigger a redirect/popup
    container.innerHTML = `
      <button class="btn-login" style="background: white; color: #333; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 0;">
        <img src="https://www.google.com/favicon.ico" width="18"> Entrar com Google
      </button>
    `;
    container.onclick = async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/ai-labs.html'
        }
      });
      if (error) alert('Erro no Google Auth: ' + error.message);
    };
  }
};

// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Check current session
  const { data: { session } } = await supabase.auth.getSession();
  handleAuthStateChange(session?.user || null);

  // 2. Listen for auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
    handleAuthStateChange(session?.user || null);
  });

  // Reveal Animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Initialize Auth Buttons
  const btnLogin = document.getElementById('btn-lab-login');
  if (btnLogin) btnLogin.addEventListener('click', handleLocalAuth);
  
  const btnLogout = document.querySelectorAll('.btn-lab-logout, .btn-header-logout');
  btnLogout.forEach(btn => btn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = '/login.html';
  }));

  // Start Google UI
  window.AuthSystem.initGoogleAuth();

  // Initialize IA Lab Features (if on page)
  if (window.location.pathname.includes('ai-labs.html')) {
    initLab();
  }

  // Initialize Authie Chat (all pages)
  initAuthieChat();
});

async function handleAuthStateChange(user) {
  LabState.user = user;
  if (user) {
    // Fetch profile data from Supabase DB
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    LabState.profile = profile;
    // Update legacy local storage for compatibility with other parts of the site if needed
    localStorage.setItem('lab_user', JSON.stringify({
      email: user.email,
      id: user.id,
      credits: profile?.credits || 0
    }));

    // If we have an active lab session, refresh credits visually
    const creditValue = document.getElementById('user-credits');
    if (creditValue) creditValue.innerText = `${profile?.credits || 0} CRÉDITOS`;
  } else {
    LabState.profile = null;
    localStorage.removeItem('lab_user');
  }
  updateAuthUI();
}

function updateAuthUI() {
  const authContainer = document.getElementById('header-auth-buttons');
  const userDisplay = document.getElementById('user-display');
  const creditDisplay = document.getElementById('lab-credits-display');
  const creditValue = document.getElementById('user-credits');

  if (LabState.user) {
    const userName = LabState.profile?.first_name || LabState.user.email.split('@')[0];
    
    // Header
    if (authContainer) {
      authContainer.innerHTML = `
        <div class="user-profile-nav">
          <a href="/account.html" class="nav-account-btn">
            <span class="user-icon">👤</span>
            <span class="user-email">${userName}</span>
          </a>
          <button class="btn-header-logout" id="btn-logout-header">Sair</button>
        </div>
      `;
      document.getElementById('btn-logout-header')?.addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.reload();
      });
    }

    // AI Labs Status Bar
    if (userDisplay) userDisplay.innerText = `Bem-vindo, ${userName}`;
    if (creditDisplay) creditDisplay.style.display = 'flex';
    if (creditValue) creditValue.innerText = `${LabState.profile?.credits || 0} CRÉDITOS`;

  } else {
    // Guest State
    if (userDisplay) userDisplay.innerText = 'Conecte-se para usar o Laboratório';
    if (creditDisplay) creditDisplay.style.display = 'none';
  }
}

// --- IA LAB LOGIC ---
function initLab() {
  console.log('🤖 IA Lab: Module Initialized');
  
  const btnGenerate = document.getElementById('btn-generate');
  const promptInput = document.getElementById('image-prompt');
  
  if (btnGenerate) {
    btnGenerate.onclick = async () => {
      const prompt = promptInput.value.trim();
      if (!prompt) return alert('Por favor, digite uma ideia para a imagem!');
      if (!LabState.user) return alert('Você precisa estar logado para gerar imagens.');
      if ((LabState.profile?.credits || 0) <= 0) return alert('Você não possui créditos suficientes!');
      
      generateImage(prompt);
    };
  }

  // Gallery Tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      LabState.currentTab = tab.dataset.tab;
      loadGallery();
    };
  });

  // Initial load
  loadGallery();
}

async function generateImage(prompt) {
  const btn = document.getElementById('btn-generate');
  const status = document.getElementById('gen-status');
  const loadingOverlay = document.getElementById('loading-overlay');
  
  LabState.isGenerating = true;
  btn.disabled = true;
  if (loadingOverlay) loadingOverlay.style.display = 'flex';
  if (status) status.innerText = 'Gerando sua obra-prima...';

  try {
    const response = await fetch(LAB_CONFIG.genWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt,
        email: LabState.user.email,
        id: LabState.user.id
      })
    });

    const data = await response.json();
    if (data.success) {
      // Refresh user profile for credits
      handleAuthStateChange(LabState.user);
      loadGallery();
      alert('Imagem gerada com sucesso! Veja em "Minhas Criações".');
    } else {
      throw new Error(data.message || 'Erro na geração');
    }
  } catch (err) {
    console.error('Generation Error:', err);
    alert('Erro ao gerar imagem: ' + err.message);
  } finally {
    LabState.isGenerating = false;
    btn.disabled = false;
    if (loadingOverlay) loadingOverlay.style.display = 'none';
    if (status) status.innerText = '';
  }
}

async function loadGallery() {
  const container = document.getElementById('gallery-grid');
  if (!container) return;
  
  container.innerHTML = '<div class="loading-spinner">Carregando galeria...</div>';

  try {
    const email = LabState.currentTab === 'mine' ? LabState.user?.email : 'all';
    const response = await fetch(`${LAB_CONFIG.feedWebhook}?email=${email}`);
    const data = await response.json();

    if (data.images && data.images.length > 0) {
      container.innerHTML = data.images.map(img => `
        <div class="image-card reveal active">
          <img src="${img.url}" alt="${img.prompt}" loading="lazy">
          <div class="image-info">
            <p>${img.prompt}</p>
          </div>
        </div>
      `).join('');
    } else {
      container.innerHTML = '<div class="empty-gallery">Nenhuma imagem encontrada.</div>';
    }
  } catch (err) {
    console.error('Gallery Load Error:', err);
    container.innerHTML = '<div class="error-gallery">Falha ao carregar galeria.</div>';
  }
}

// --- AUTHIE CHAT LOGIC ---
function initAuthieChat() {
  const bubble = document.getElementById('chat-bubble');
  const chatWin = document.getElementById('chat-window');
  const closeBtn = document.getElementById('close-chat');
  const sendBtn = document.getElementById('send-message');
  const chatInput = document.getElementById('chat-input');
  const messagesContainer = document.querySelector('.chat-messages');

  if (!bubble || !chatWin) return;

  bubble.onclick = () => {
    chatWin.classList.toggle('active');
    bubble.style.display = chatWin.classList.contains('active') ? 'none' : 'flex';
  };

  closeBtn.onclick = () => {
    chatWin.classList.remove('active');
    bubble.style.display = 'flex';
  };

  const addMessage = (text, sender) => {
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    msg.innerText = text;
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  const handleSend = async () => {
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    addMessage(text, 'user');

    // Bot Typing
    const typingMsg = document.createElement('div');
    typingMsg.className = 'message bot typing';
    typingMsg.innerText = 'Authie está pensando...';
    messagesContainer.appendChild(typingMsg);

    try {
      const response = await fetch('https://n8n.danauth.info/webhook/authie-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, email: LabState.user?.email || 'guest' })
      });
      const data = await response.json();
      typingMsg.remove();
      addMessage(data.response || 'Desculpe, tive um problema técnico.', 'bot');
    } catch (err) {
      typingMsg.remove();
      addMessage('Sistema offline temporariamente.', 'bot');
    }
  };

  if (sendBtn) sendBtn.onclick = handleSend;
  if (chatInput) chatInput.onkeypress = (e) => (e.key === 'Enter' ? handleSend() : null);
}

async function handleLocalAuth() {
  const email = document.getElementById('lab-email')?.value.trim();
...
  const password = document.getElementById('lab-password')?.value.trim();
  const firstName = document.getElementById('lab-first-name')?.value.trim();
  const lastName = document.getElementById('lab-last-name')?.value.trim();
  const mode = LabState.authMode;

  if (!email || !password) return alert('Preecha todos os campos!');

  const btn = document.getElementById('btn-lab-login');
  btn.disabled = true;
  btn.innerText = mode === 'signup' ? 'Criando conta...' : 'Entrando...';

  try {
    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (error) throw error;
      
      if (data.user && data.session) {
        // Success - Logged in
        window.location.href = '/ai-labs.html';
      } else {
        // Verification email sent
        alert('Conta criada com sucesso! Verifique seu e-mail para confirmar o cadastro.');
        window.location.href = '/login.html';
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      window.location.href = '/ai-labs.html';
    }
  } catch (err) {
    console.error('Auth Error:', err);
    alert('Erro: ' + (err.message || 'Falha na autenticação.'));
  } finally {
    btn.disabled = false;
    btn.innerText = mode === 'signup' ? 'Criar conta' : 'Entrar';
  }
}
