# 📁 Base de Conhecimento & Snapshot: Danauth (danauth.info)

Este documento registra permanentemente todas as decisões de arquitetura, identidade visual, marcas do grupo, nichos de atuação, dados de contato e processos de deploy do projeto.

---

## 🏢 1. Estrutura das Marcas & Empresas
- **Danauth (`danauth.info`):** Marca e portal principal voltado para soluções de alta precisão em **Impressão 3D** e **Serviços Digitais**.
- **Empresas por trás de Danauth (Grupo):**
  1. **Tecsperts (`public/assets/brand/tecsperts.png`):** Empresa geral / agência de tecnologia, gestão e infraestrutura.
  2. **Tecsform (`public/assets/brand/tecsform.png`):** Marca especializada na elaboração e criação de projetos 3D (CAD) e manufatura.
- **Loja Online Oficial na Shopee (Tecsform 3D):**
  - **URL:** `https://shopee.com.br/tecsform3d?mmp_pid=an_18324000217&share_channel_code=1&uls_trackid=56hfeiom023h&utm_campaign=-&utm_content=-&utm_medium=affiliates&utm_source=an_18324000217&utm_term=fgnom57dkvs1`
  - Apresentada no card de *Vendas em Impressão 3D* e no rodapé.

---

## 🎯 2. Pilares de Atuação & Serviços Oferecidos

### **Pilar 01: Universo 3D (`#impressao-3d`)**
1. **Vendas em Impressão 3D:**
   - Produção sob demanda de peças personalizadas, protótipos funcionais, maquetes arquitetônicas, peças técnicas de reposição, itens de decoração e colecionáveis.
   - Botão direto para compra na **Shopee** e orçamento via WhatsApp.
2. **Elaboração e Criação de Projetos em 3D:**
   - Modelagem tridimensional em CAD a partir de ideias, medidas ou esboços.
   - Exportação de arquivos industriais prontos para fabricação (STL, OBJ, STEP).

### **Pilar 02: Web Design & Estratégia Digital (`#webdesign`)**
3. **Criação de Sites:**
   - Landing Pages de alta conversão e sites institucionais modernos, 100% responsivos para mobile e otimizados para SEO.
4. **Artes para Empresas:**
   - Design para redes sociais (Instagram, Facebook, carrosséis, stories, criativos de anúncios e banners promocionais).
5. **Chatbots Inteligentes para WhatsApp e Instagram:**
   - Automação de atendimento e vendas 24/7 com fluxos automáticos de orçamento e captação de leads.

---

## 🎨 3. Design System & Identidade Visual (Tema Claro Tecnológico)

- **Fundo Principal (Amostra Mineral Solicitada):** `#E1E2DB` (Warm Mineral Light Gray).
- **Cards & Superfícies:** `#FFFFFF` (Branco Puro com bordas sutis `rgba(10, 15, 29, 0.10)` e sombras elegantes).
- **Tipografia & Contraste:** `#0A0F1D` (Ardósia Profunda) para títulos e `#2D3748` para corpo de texto.
- **Gradientes de Alto Destaque nos Títulos:**
  - `linear-gradient(135deg, #7c3aed 0%, #2563eb 45%, #0284c7 100%)`
- **Cores de Destaque (Accents):**
  - Roxo Elétrico: `#7C3AED`
  - Azul Real: `#2563EB`
  - Ciano Cyber: `#0284C7`
  - Verde WhatsApp: `#25D366` / `#128C7E`
  - Laranja Shopee: `#EE4D2D` / `#FF5722`
- **Banner CTA:** Gradiente escuro de alto contraste (`linear-gradient(135deg, #0f172a, #1e1b4b)`) posicionado antes do rodapé.
- **Rodapé:** Fundo mineral suave (`#d8d9d2`), título em negrito `Empresas por trás de Danauth` com as logos da **Tecsperts** e **Tecsform** em badges de alta visibilidade (`.partner-logo-pill`).

---

## 📞 4. Contato Oficial
- **WhatsApp:** `(82) 98758-4824`
- **Link Direto:** `https://wa.me/5582987584824?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20com%20a%20Danauth.`

---

## 🚀 5. Fluxo de Publicação & CI/CD
- **Repositório GitHub:** `https://github.com/hugoolicfarias-coder/danauth.git`
- **Branch de Produção:** `main`
- **Hospedagem / Deploy:** **Vercel** (Deploy contínuo e automático a cada `git push origin main`).
- **Domínio de Produção:** [https://www.danauth.info](https://www.danauth.info)
