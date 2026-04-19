console.log('🚀 Danauth Hub: Global Auth 2.0 Management Started');

// State Management
const LabState = {
  user: JSON.parse(localStorage.getItem('lab_user')) || null,
  currentTab: 'mine',
  isGenerating: false,
  authMode: 'signup'
};

const LAB_CONFIG = {
  authWebhook: 'https://n8n.danauth.info/webhook/lab-auth',
  verifyWebhook: 'https://n8n.danauth.info/webhook/lab-verify',
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

    const checkLibrary = setInterval(() => {
      if (window.google && google.accounts) {
        clearInterval(checkLibrary);
        console.log('Google API Loaded. Rendering Button...');
        
        google.accounts.id.initialize({
          client_id: "1016363962096-v6l5d5ctmqvvps0o6nf9e968rb59gu7j.apps.googleusercontent.com",
          callback: window.handleGoogleResponse,
          context: "signin",
          ux_mode: "popup"
        });

        google.accounts.id.renderButton(container, {
          theme: "outline",
          size: "large",
          width: container.offsetWidth || 300,
          text: "signin_with",
          shape: "rectangular"
        });
      }
    }, 500);
  }
};

// Global Google Response Handler
window.handleGoogleResponse = async function(response) {
  console.log('Processing Google Payload...');
  try {
    const resp = await fetch(LAB_CONFIG.authWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        googleToken: response.credential,
        mode: 'google'
      })
    });
    const data = await resp.json();
    if (data.success) {
      LabState.user = { email: data.email, token: data.sessionToken, credits: data.credits || 0 };
      localStorage.setItem('lab_user', JSON.stringify(LabState.user));
      window.location.href = '/ai-labs.html';
    } else {
      alert('Acesso negado: ' + data.message);
    }
  } catch (err) {
    console.error('Auth Error:', err);
  }
};

// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Ready. Synchronizing state...');
  
  // UI Effects
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 50);
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
  
  const btnLogout = document.getElementById('btn-lab-logout') || document.getElementById('btn-header-logout');
  if (btnLogout) btnLogout.addEventListener('click', () => {
    localStorage.removeItem('lab_user');
    window.location.reload();
  });

  // Start Google UI
  window.AuthSystem.initGoogleAuth();
});

async function handleLocalAuth() {
  const email = document.getElementById('lab-email')?.value.trim();
  const password = document.getElementById('lab-password')?.value.trim();
  const firstName = document.getElementById('lab-first-name')?.value.trim();
  const lastName = document.getElementById('lab-last-name')?.value.trim();
  const mode = LabState.authMode;

  if (!email || !password) return alert('Preecha todos os campos!');

  const btn = document.getElementById('btn-lab-login');
  btn.disabled = true;
  btn.innerText = 'Verificando...';

  try {
    const resp = await fetch(LAB_CONFIG.authWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName, lastName, mode })
    });
    const data = await resp.json();
    
    if (data.success) {
      if (data.directLogin) {
        LabState.user = { email, token: data.sessionToken, credits: data.credits };
        localStorage.setItem('lab_user', JSON.stringify(LabState.user));
        window.location.href = '/ai-labs.html';
      } else {
        document.getElementById('step-1').style.display = 'none';
        document.getElementById('step-2').style.display = 'flex';
      }
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert('Erro de conexão.');
  } finally {
    btn.disabled = false;
    btn.innerText = mode === 'signup' ? 'Criar conta' : 'Entrar';
  }
}
