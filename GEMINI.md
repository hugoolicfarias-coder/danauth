# Danauth - ImpressÃ£o 3D & SoluÃ§Ãµes Digitais
> Portal Oficial: https://www.danauth.info | RepositÃ³rio: https://github.com/hugoolicfarias-coder/danauth.git

Este arquivo define todas as regras permanentes, arquitetura, design system e estado das implementaÃ§Ãµes da Danauth.

---

## 1. Identidade & Estrutura do Grupo
- **Danauth**: Marca principal de soluÃ§Ãµes em Manufatura Aditiva (ImpressÃ£o 3D) e Desenvolvimento Digital.
- **Tecsperts**: AgÃªncia/empresa de tecnologia, gestÃ£o e infraestrutura.
- **Tecsform**: Especializada em engenharia/modelagem 3D (CAD) e manufatura.
- **Shopee Oficial (Tecsform 3D)**: Loja virtual oficial para vendas diretas de peÃ§as e colecionÃ¡veis.

---

## 2. Tecnologias & Build
- **Bundler**: Vite (Multi-page App configurado em vite.config.js).
- **Frontend**: HTML5 SemÃ¢ntico, CSS3 Moderno (Vanilla com Design System em index.css), JavaScript Modular (src/main.js).
- **Banco/AutenticaÃ§Ã£o**: Supabase (@supabase/supabase-js, src/supabase.js).
- **Hospedagem & CI/CD**: Vercel conectado Ã  branch main do GitHub com deploy automÃ¡tico.

---

## 3. Design System & Identidade Visual
- Fundo Principal (Amostra Mineral): `#E1E2DB`
- SuperfÃ­cies/Cards: `#FFFFFF` com bordas sutis e sombras elegantes
- Tipografia: Inter (`#0A0F1D` para tÃ­tulos e `#2D3748` para corpo)
- Gradiente de Destaque: `linear-gradient(135deg, #7c3aed 0%, #2563eb 45%, #0284c7 100%)`
- Acentos: Roxo ElÃ©trico `#7C3AED`, Azul Real `#2563EB`, Ciano Cyber `#0284C7`, Verde WhatsApp `#25D366`, Laranja Shopee `#EE4D2D`.

---

## 4. Mapa de PÃ¡ginas e MÃ³dulos
- `index.html`: Home e apresentaÃ§Ã£o institucional completa.
- `services.html`: ServiÃ§os detalhados (3D + Digital).
- `gallery.html`: Galeria de peÃ§as 3D com filtros de material (FDM, Resina, etc.) e Lightbox.
- `calculator.html`: Calculadora de custos de impressÃ£o 3D com gate de senha master (`danauth3d`) e precificaÃ§Ã£o detalhada.
- `web-portfolio.html`: Showroom interativo com simulaÃ§Ã£o de dispositivos (Desktop, Tablet, Mobile) e proteÃ§Ã£o anti-cÃ³pia.
- `public/demos/`: Demos incorporados no portfolio web (`advocacia.html`, `nexo.html`, `medicina.html`, `ecommerce-soft.html`).
- `reserva-override.css` & `working.html`: AdaptaÃ§Ã£o do tema Tray Commerce para layout moderno inspirado na Reserva.
- `contact.html`, `privacy.html`, `terms.html`: FormulÃ¡rio de contato direto via WhatsApp e pÃ¡ginas legais.

---

## 5. Diretrizes para AlteraÃ§Ãµes
- Preservar o Design System e consistÃªncia visual de todas as pÃ¡ginas.
- Ao adicionar novas pÃ¡ginas HTML, registrar o entrypoint correspondente em `vite.config.js`.
- Manter o link de WhatsApp atualizado: `(82) 98758-4824`.
- Todo deploy em produÃ§Ã£o Ã© automÃ¡tico ao realizar commit/push na branch `main`.