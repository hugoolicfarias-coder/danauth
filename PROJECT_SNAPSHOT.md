# 📁 Snapshot Atual: Danauth Digital Hub

Este documento serve como um registro permanente de tudo o que foi implementado e do estado atual do projeto (Varredura realizada em 19/04/2026).

---

## 🎨 Identidade Visual & Branding (Super Branding)
- **Logotipo:** Substituído de texto para imagem oficial em todas as páginas.
- **Escalabilidade:** 
  - Header: Altura ampliada para 130px (Logo a 100px) para máxima visibilidade.
  - Rodapé: Logo com 110px de altura.
  - Página de Login: Logo ampliado para 220px para impacto imediato.
- **Favicon:** Atualizado para o ícone oficial da marca.
- **Fundo Hero (Home):** Imagem tecnológica P&B personalizada com efeito matte (fosco), transparência controlada e fundo fixo (parallax).

---

## 🏗️ Estrutura de Páginas
1.  **Home (`index.html`):** Portal principal com Hero futurista e pilares de serviços.
2.  **Serviços (`services.html`):** Detalhamento de IA, Engenharia de Software e Automação.
3.  **Danauth Shopping (`shopping.html`):** Vitrine de produtos digitais com grid moderno.
4.  **AI Labs (`ai-labs.html`):** Laboratório de geração de imagens e vídeos via IA.
5.  **Cinema Hub (`entertainment.html`):** Seção de entretenimento com fundo de vídeo (He-Man) e carrossel infinito.
6.  **Preços (`pricing.html`):** Planos de assinatura e pacotes de créditos.
7.  **Área do Cliente (`account.html`):** Painel logado para gestão de perfil e saldos.
8.  **Login/Cadastro (`login.html`):** Fluxo de autenticação dual (Email/Google).
9.  **Institucional:** Contato, Termos de Uso e Privacidade.

---

## ⚙️ Arquitetura Técnica & Funcionalidades
- **Sistema de Autenticação 2.0:**
  - Integração com **n8n** como backend inteligente.
  - Suporte a login por email (OTP no cadastro) e Google Sign-In.
  - **Correção de Conexão:** Webhooks configurados para aceitar o método `OPTIONS` (CORS preflight).
- **Gestão de Sessão:** `localStorage` sincronizado entre páginas para manter o usuário logado e mostrar créditos no header.
- **Infraestrutura:** Projeto estruturado com **Vite** para desenvolvimento rápido e bundling eficiente.
- **Base de Dados:** Airtable integrado via n8n para gestão de usuários, tokens e créditos.

---

## ✅ Status de Estabilidade
- **CORS:** Resolvido (Backend preparado para chamadas de navegador).
- **Branding:** Aplicado e padronizado em 100% das páginas.
- **Navegação:** Dinâmica (esconde/mostra botões de conta conforme o login).

> [!NOTE]
> Este arquivo é um espelho do estado ideal do site até o momento. Nenhuma alteração foi realizada durante esta varredura.
