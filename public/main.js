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
  const btn = document.getElementById('google-login-btn');
  if (btn) btn.style.opacity = '0.5';

  try {
    const resp = await fetch(LAB_CONFIG.authWebhook, {
      method: 'POST',
      mode: 'cors',
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
    console.error('Google Auth Error Detail:', err);
    alert('Erro de conexão com o servidor de autenticação (Google). Verifique sua rede.');
  } finally {
    if (btn) btn.style.opacity = '1';
  }
};

// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Auth UI State
  updateAuthUI();

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
  btnLogout.forEach(btn => btn.addEventListener('click', () => {
    localStorage.removeItem('lab_user');
    window.location.href = '/login.html';
  }));

  // Start Google UI
  window.AuthSystem.initGoogleAuth();
});

function updateAuthUI() {
  const authContainer = document.getElementById('header-auth-buttons');
  if (!authContainer) return;

  if (LabState.user) {
    authContainer.innerHTML = `
      <div class="user-profile-nav">
        <a href="/account.html" class="nav-account-btn">
          <span class="user-icon">👤</span>
          <span class="user-email">${LabState.user.email.split('@')[0]}</span>
        </a>
        <button class="btn-header-logout" onclick="localStorage.removeItem('lab_user'); window.location.reload();">Sair</button>
      </div>
    `;
  }
}

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
      mode: 'cors',
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
      alert('Ops! ' + (data.message || 'Erro ao processar solicitação.'));
    }
  } catch (err) {
    console.error('Fetch Error Detail:', err);
    alert('Erro de conexão: Não foi possível alcançar o servidor. Verifique sua rede ou tente novamente em instantes.');
  } finally {
    btn.disabled = false;
    btn.innerText = mode === 'signup' ? 'Criar conta' : 'Entrar';
  }
}
