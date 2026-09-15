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

  // 4. Gallery Filter & Lightbox Preview Engine
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.style.borderColor = 'transparent';
        });
        btn.classList.add('active');
        btn.style.borderColor = 'var(--accent-blue)';

        const cat = btn.getAttribute('data-filter');
        galleryItems.forEach(item => {
          if (cat === 'all' || item.getAttribute('data-category') === cat) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  if (lightbox && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('h3')?.innerText || '';
        if (img) {
          lightboxImg.src = img.src;
          if (lightboxCaption) lightboxCaption.innerText = title;
          lightbox.style.display = 'flex';
        }
      });
    });

    const closeLb = () => { lightbox.style.display = 'none'; };
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLb();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLb();
    });
  }

  // ==========================================================================
  // 🔒 3D PRINTING CALCULATOR & PASSWORD GATE ENGINE
  // ==========================================================================
  const gateScreen = document.getElementById('password-gate');
  const calcApp = document.getElementById('calculator-app');
  const MASTER_PWD = 'danauth3d';

  if (gateScreen && calcApp) {
    const gateForm = document.getElementById('gate-form');
    const pwdInput = document.getElementById('gate-password-input');
    const togglePwdBtn = document.getElementById('toggle-pwd-btn');
    const errorMsg = document.getElementById('gate-error-msg');
    const btnLock = document.getElementById('btn-lock');

    // Check saved session in localStorage
    const isAuthed = localStorage.getItem('danauth_calc_auth') === 'true';
    if (isAuthed) {
      unlockCalculator();
    }

    function unlockCalculator() {
      gateScreen.style.display = 'none';
      calcApp.style.display = 'block';
      localStorage.setItem('danauth_calc_auth', 'true');
      calculate3DCosts();
    }

    function lockCalculator() {
      localStorage.removeItem('danauth_calc_auth');
      calcApp.style.display = 'none';
      gateScreen.style.display = 'flex';
      if (pwdInput) pwdInput.value = '';
      if (errorMsg) errorMsg.style.display = 'none';
    }

    if (gateForm) {
      gateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const entered = pwdInput.value.trim();
        if (entered === MASTER_PWD) {
          if (errorMsg) errorMsg.style.display = 'none';
          unlockCalculator();
        } else {
          if (errorMsg) {
            errorMsg.style.display = 'block';
            errorMsg.innerText = 'Senha incorreta. Solicite o acesso à equipe Danauth!';
          }
        }
      });
    }

    if (togglePwdBtn && pwdInput) {
      togglePwdBtn.addEventListener('click', () => {
        const isPwd = pwdInput.type === 'password';
        pwdInput.type = isPwd ? 'text' : 'password';
        const icon = togglePwdBtn.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = isPwd ? 'visibility_off' : 'visibility';
      });
    }

    if (btnLock) {
      btnLock.addEventListener('click', lockCalculator);
    }

    // Material Presets
    const presetSelect = document.getElementById('calc-preset-material');
    const precoRoloInput = document.getElementById('calc-preco-rolo');
    
    const MATERIAL_PRESETS = {
      pla: 110.00,
      abs: 120.00,
      petg: 130.00,
      resina: 190.00,
      tpu: 160.00
    };

    if (presetSelect && precoRoloInput) {
      presetSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (MATERIAL_PRESETS[val]) {
          precoRoloInput.value = MATERIAL_PRESETS[val].toFixed(2);
          calculate3DCosts();
        }
      });
    }

    // Calculation Engine
    const calcInputs = [
      'calc-peso', 'calc-preco-rolo', 'calc-tempo-h', 'calc-tempo-m',
      'calc-potencia-w', 'calc-tarifa-kwh', 'calc-depreciacao-h',
      'calc-mao-obra', 'calc-embalagem', 'calc-falhas-pct', 'calc-lucro-pct'
    ];

    calcInputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', calculate3DCosts);
        el.addEventListener('change', calculate3DCosts);
      }
    });

    function formatBRL(val) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    }

    function calculate3DCosts() {
      const pesoG = parseFloat(document.getElementById('calc-peso')?.value) || 0;
      const precoRolo = parseFloat(document.getElementById('calc-preco-rolo')?.value) || 0;
      
      const tempoH = parseFloat(document.getElementById('calc-tempo-h')?.value) || 0;
      const tempoM = parseFloat(document.getElementById('calc-tempo-m')?.value) || 0;
      const tempoTotalHoras = tempoH + (tempoM / 60);

      const potenciaW = parseFloat(document.getElementById('calc-potencia-w')?.value) || 0;
      const tarifaKwh = parseFloat(document.getElementById('calc-tarifa-kwh')?.value) || 0;
      const depreciacaoH = parseFloat(document.getElementById('calc-depreciacao-h')?.value) || 0;

      const maoObra = parseFloat(document.getElementById('calc-mao-obra')?.value) || 0;
      const embalagem = parseFloat(document.getElementById('calc-embalagem')?.value) || 0;

      const falhasPct = parseFloat(document.getElementById('calc-falhas-pct')?.value) || 0;
      const lucroPct = parseFloat(document.getElementById('calc-lucro-pct')?.value) || 0;

      // Update Slider Labels
      const labelFalhas = document.getElementById('label-falhas-pct');
      if (labelFalhas) labelFalhas.innerText = `${falhasPct}%`;
      const labelLucro = document.getElementById('label-lucro-pct');
      if (labelLucro) labelLucro.innerText = `${lucroPct}%`;

      // Formulas
      const custoFilamento = (pesoG / 1000) * precoRolo;
      const custoEnergiaEletrica = tempoTotalHoras * (potenciaW / 1000) * tarifaKwh;
      const custoDepreciacao = tempoTotalHoras * depreciacaoH;
      const custoEnergiaTotal = custoEnergiaEletrica + custoDepreciacao;
      const custoExtras = maoObra + embalagem;

      const custoBrutoSemFalhas = custoFilamento + custoEnergiaTotal + custoExtras;
      const reservaFalhas = custoBrutoSemFalhas * (falhasPct / 100);
      const custoTotalProducao = custoBrutoSemFalhas + reservaFalhas;

      const lucroBolso = custoTotalProducao * (lucroPct / 100);
      const precoSugerido = custoTotalProducao + lucroBolso;

      const custoPorGrama = pesoG > 0 ? (custoTotalProducao / pesoG) : 0;

      // Update Dashboard Output
      const elPrecoSugerido = document.getElementById('res-preco-sugerido');
      if (elPrecoSugerido) elPrecoSugerido.innerText = formatBRL(precoSugerido);

      const elLucroBolso = document.getElementById('res-lucro-bolso');
      if (elLucroBolso) elLucroBolso.innerText = formatBRL(lucroBolso);

      const elFilamento = document.getElementById('res-custo-filamento');
      if (elFilamento) elFilamento.innerText = formatBRL(custoFilamento);

      const elEnergia = document.getElementById('res-custo-energia');
      if (elEnergia) elEnergia.innerText = formatBRL(custoEnergiaTotal);

      const elExtras = document.getElementById('res-custo-extras');
      if (elExtras) elExtras.innerText = formatBRL(custoExtras);

      const elFalhas = document.getElementById('res-reserva-falhas');
      if (elFalhas) elFalhas.innerText = formatBRL(reservaFalhas);

      const elTotal = document.getElementById('res-custo-total');
      if (elTotal) elTotal.innerText = formatBRL(custoTotalProducao);

      const elLucroLiq = document.getElementById('res-lucro-liquido');
      if (elLucroLiq) elLucroLiq.innerText = formatBRL(lucroBolso);

      const elCustoGrama = document.getElementById('res-custo-grama');
      if (elCustoGrama) elCustoGrama.innerText = `${formatBRL(custoPorGrama)} / g`;

      const elMargemPct = document.getElementById('res-margem-pct');
      if (elMargemPct) elMargemPct.innerText = `${lucroPct}% sobre custo`;
    }

    // Action Buttons Handlers
    const btnExample = document.getElementById('btn-example');
    if (btnExample) {
      btnExample.addEventListener('click', () => {
        document.getElementById('calc-peso').value = '122.3';
        document.getElementById('calc-preco-rolo').value = '110.00';
        document.getElementById('calc-tempo-h').value = '7';
        document.getElementById('calc-tempo-m').value = '15';
        document.getElementById('calc-potencia-w').value = '200';
        document.getElementById('calc-tarifa-kwh').value = '0.85';
        document.getElementById('calc-depreciacao-h').value = '1.00';
        document.getElementById('calc-mao-obra').value = '5.00';
        document.getElementById('calc-embalagem').value = '3.00';
        document.getElementById('calc-falhas-pct').value = '10';
        document.getElementById('calc-lucro-pct').value = '100';
        calculate3DCosts();
      });
    }

    const btnClear = document.getElementById('btn-clear');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        document.getElementById('calc-peso').value = '0';
        document.getElementById('calc-preco-rolo').value = '0';
        document.getElementById('calc-tempo-h').value = '0';
        document.getElementById('calc-tempo-m').value = '0';
        document.getElementById('calc-potencia-w').value = '0';
        document.getElementById('calc-tarifa-kwh').value = '0';
        document.getElementById('calc-depreciacao-h').value = '0';
        document.getElementById('calc-mao-obra').value = '0';
        document.getElementById('calc-embalagem').value = '0';
        document.getElementById('calc-falhas-pct').value = '0';
        document.getElementById('calc-lucro-pct').value = '0';
        calculate3DCosts();
      });
    }

    const btnCopyWa = document.getElementById('btn-copy-wa');
    if (btnCopyWa) {
      btnCopyWa.addEventListener('click', () => {
        const preco = document.getElementById('res-preco-sugerido')?.innerText || 'R$ 0,00';
        const peso = document.getElementById('calc-peso')?.value || '0';
        const h = document.getElementById('calc-tempo-h')?.value || '0';
        const m = document.getElementById('calc-tempo-m')?.value || '0';

        const summaryText = `📋 *ORÇAMENTO DE IMPRESSÃO 3D — DANAUTH*\n` +
          `----------------------------------------\n` +
          `📦 Peso estimado: ${peso} g\n` +
          `⏱️ Tempo de produção: ${h}h ${m}min\n` +
          `----------------------------------------\n` +
          `💰 *VALOR TOTAL SUGERIDO: ${preco}*\n` +
          `----------------------------------------\n` +
          `Fale conosco para confirmar seu pedido!`;

        navigator.clipboard.writeText(summaryText).then(() => {
          alert('Orçamento formatado copiado para a área de transferência! Cole no WhatsApp.');
        }).catch(() => {
          window.open(`https://wa.me/5582987584824?text=${encodeURIComponent(summaryText)}`, '_blank');
        });
      });
    }

    const btnPrintPdf = document.getElementById('btn-print-pdf');
    if (btnPrintPdf) {
      btnPrintPdf.addEventListener('click', () => {
        window.print();
      });
    }
  }
});
