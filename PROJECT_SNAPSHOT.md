# 📁 Snapshot Atual: Danauth Digital Hub

Este documento serve como um registro permanente de tudo o que foi implementado e do estado atual do projeto (Varredura realizada em 20/04/2026 - Pós-migração Supabase).

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
- **Base de Dados:** Supabase (PostgreSQL) integrado via n8n para gestão de usuários, tokens, gerações e créditos. (Airtable mantido como backup legado).

---

## ✅ Status de Estabilidade
- **CORS:** Resolvido (Backend preparado para chamadas de navegador).
- **Branding:** Aplicado e padronizado em 100% das páginas.
- **Navegação:** Dinâmica (esconde/mostra botões de conta conforme o login).

> [!NOTE]
> Este arquivo é um espelho do estado ideal do site após a transição bem-sucedida para o ecossistema Supabase.

---

## 📱 Automação TikTok (Top 10 Curioso) - Workflow Snapshot
*Data de Atualização: 24/04/2026*

A arquitetura do workflow do TikTok foi radicalmente transformada para um formato focado em alta retenção sem legendas, seguido da resolução de bloqueios estritos da API Sandbox do TikTok.

### 🎬 Nova Estrutura do Vídeo (Shotstack & OpenAI)
1. **Curiosidade Única Aprofundada:** O prompt do `Generate_Script` (OpenAI) foi ajustado para abandonar o formato "Top 10" e focar em uma única história contínua (início, meio e fim) gerando +1 minuto de narração fluida na voz *Nova* (TTS).
2. **Design Visual Minimalista (Zero Legendas):** Todo o texto em HTML que aparecia na tela foi removido do payload de renderização.
3. **Dinamismo Matemático (Retenção):** Para compensar a falta de legenda em um vídeo de 1 minuto, o nó `Aggregate_Scenes` (JavaScript) agora "fatia" o vídeo de fundo do Pexels em blocos de 5 segundos, aplicando efeitos alternados de movimento (`zoomIn`, `slideLeft`, `zoomOut`, `slideRight`).
4. **Marca D'água Elegante:** A logo oficial (hospedada no Cloudinary) foi injetada no código como um `image asset`, com escala ajustada (`scale: 0.15`) e ancorada rigidamente no canto superior direito (`position: topRight`, `offset: -0.05`).

### 🛠️ Resolução de Erros Críticos
- **Quedas de Credenciais (Exclamações no n8n):** Detectado que atualizações estruturais nos nós HTTP Request apagaram o vínculo com as credenciais da OpenAI e Shotstack. **Solução:** Re-vinculação explícita do objeto `credentials` em todos os nós HTTP para restabelecer a conexão.
- **Bloqueio da API do TikTok (403 Unaudited Client):**
  - **O Problema:** O TikTok bloqueia envios públicos ou formatações ambíguas de privacidade para aplicativos não auditados (Sandbox). Enviar `MUTUAL_FOLLOW_FRIENDS` ou omitir o campo causava rejeição imediata da API.
  - **Solução Técnica (Para Testes):** A imposição de `"privacy_level": "SELF_ONLY"` no JSON do `TikTok_Init_Upload` garante que a API receba a requisição de forma limpa, seguindo a regra estrita de "apps em Sandbox só postam no modo Privado".
  - **Limpeza de Headers:** Um cabeçalho inválido (`video-url`) no nó do TikTok foi removido, pois violava as regras da REST API.
  
### 🚀 Status para Produção
O aplicativo foi formalmente **enviado para Revisão (Audit) no TikTok Developer Portal**. 
Assim que aprovado, a restrição de `unaudited_client` desaparecerá, permitindo postagens 100% públicas e automáticas direto do n8n para a conta do usuário. O workflow de testes end-to-end está validado e aguardando a bandeira verde do TikTok.
