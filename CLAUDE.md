# CurriculoAI

Gerador de curriculos inteligente com IA, focado em performance e conversao ATS.

## Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Estilizacao:** Tailwind CSS + shadcn/ui
- **Estado:** Zustand (persistido em localStorage)
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions)
- **IA:** Claude Sonnet (Anthropic) via Supabase Edge Function
- **PDF:** @react-pdf/renderer

## Paginas e Rotas

### `/` - Landing Page
Pagina de marketing com hero section, features, depoimentos e CTA "Criar Curriculo Agora". Nenhum login e exigido para comecar.

### `/import` - Importacao
Permite importar dados do LinkedIn ou de um curriculo existente para preencher o editor automaticamente. Atualmente usa dados mock no MVP.

### `/editor` - Editor Split-Screen
Pagina principal do produto. Lado esquerdo com formularios em abas, lado direito com preview em tempo real.

**Abas do editor:**
- **Contato** (`PersonalInfoForm`) - Nome, email, telefone, localizacao, LinkedIn, website
- **Experiencia** (`ExperienceForm`) - Empresa, cargo, datas, bullet points com botao "Melhorar com IA"
- **Educacao** (`EducationForm`) - Instituicao, grau, area, datas, descricao
- **Habilidades** (`SkillsForm`) - Skills hard e soft com categorias

**Funcionalidades do editor:**
- Selecao de template (Moderno / Classico)
- Botao "Preencher Teste" para dados ficticios
- Botao "ATS Score" - abre painel lateral com analise de IA
- Botao "Exportar PDF" - gera PDF ATS-friendly
- Navbar com email do usuario + botao Dashboard + botao Sair

### `/dashboard` - Dashboard
Tabela com todos os curriculos salvos do usuario autenticado.

**Acoes por curriculo:**
- Editar (abre no editor)
- Verificar ATS (abre editor com painel ATS)
- Exportar PDF (download direto)
- Excluir (com confirmacao)
- Botao "Novo Curriculo"

### `/checkout` - Checkout
Pagina de pagamento com dois planos:
- Download Unico (R$ 19,90)
- Passe Semanal (R$ 29,90 / 7 dias)

Trust badges e resumo do curriculo. Exige login antes de pagar.

## Funcionalidades

### Autenticacao (Supabase Auth)
- Login/cadastro com email e senha
- Login com Google OAuth
- Modal de auth aparece ao clicar em "Exportar PDF" ou "ATS Score" se nao estiver logado
- Apos autenticar, curriculo e salvo automaticamente no Supabase
- Navbar mostra email + botao Sair quando logado

**Componentes:** `AuthModal`, `Navbar`, `useAuthStore`

### Analise ATS com IA (Claude Sonnet)
- Usuario cola descricao da vaga no painel lateral
- IA analisa compatibilidade curriculo vs vaga
- Retorna: score (0-100), keywords encontradas/ausentes, sugestoes de melhoria por secao com prioridade (alta/media/baixa), resumo da analise
- Sugestoes ordenadas por prioridade com icones coloridos

**Componentes:** `ATSPanel`
**Servicos:** `aiService.ts` (chama Edge Function), `atsAnalyzer.ts` (analise local de keywords)

### Melhoria de Bullet Points com IA
- Cada bullet point de experiencia tem botao de sparkles
- Ao clicar, Claude Sonnet reescreve o bullet com verbo de acao + metricas
- Mostra raciocinio da IA sobre o que foi melhorado
- Botoes Aceitar/Dispensar para aplicar ou ignorar

**Componente:** `ExperienceForm`
**Servico:** `aiService.ts` (endpoint `bullet-improve`)

### Exportacao PDF
- Gera PDF com texto puro (ATS-friendly, sem imagens)
- Respeita o template selecionado (Moderno/Classico)
- Fontes seguras para ATS (Helvetica)
- Layout de coluna unica

**Servico:** `pdfExport.tsx`

### Templates de Curriculo
- **Moderno** (`ModernTemplate`) - Design contemporaneo com acentos de cor
- **Classico** (`ClassicTemplate`) - Layout tradicional e conservador
- Ambos seguem regras ATS: coluna unica, sem graficos, sem tabelas

**Componente:** `ResumePreview` (wrapper que renderiza o template selecionado)

### Persistencia de Dados
- **Antes do login:** dados salvos em localStorage via Zustand persist
- **Apos login:** curriculo salvo no Supabase com update (sem duplicatas)
- `savedResumeId` rastreia o ID do curriculo atual para evitar inserts repetidos

**Servico:** `resumeService.ts` (save, list, load, delete)

## Banco de Dados (Supabase PostgreSQL)

### Tabelas

**`profiles`** - Extensao de `auth.users`
- `id`, `email`, `full_name`, `stripe_customer_id`, `payment_status`, `payment_expires_at`, `created_at`, `updated_at`
- Trigger `on_auth_user_created` cria profile automaticamente no signup

**`resumes`** - Curriculos
- `id`, `user_id`, `local_session_id`, `title`, `content` (JSONB), `template`, `created_at`, `updated_at`
- Suporte a usuarios anonimos via `local_session_id`

**`job_descriptions`** - Vagas para analise ATS
- `id`, `resume_id`, `job_title`, `company_name`, `raw_text`, `parsed_keywords` (JSONB), `match_score`, `created_at`

**`ai_edits`** - Historico de sugestoes da IA
- `id`, `resume_id`, `experience_id`, `bullet_index`, `original_text`, `suggested_text`, `applied`, `created_at`

### Seguranca
- RLS habilitado em todas as tabelas
- Policies garantem que usuarios so acessam seus proprios dados
- Trigger `update_updated_at` automatico em `profiles` e `resumes`

## Edge Function (`ai-assistant`)

Proxy server-side no Supabase que chama a API da Anthropic.

**Endpoints:**
- `?action=ats-analysis` - Analise ATS completa (score + keywords + sugestoes)
- `?action=bullet-improve` - Melhoria de bullet point individual

**Seguranca:** API key da Anthropic fica apenas no servidor (Edge Function). Nunca exposta ao browser.

## Stores (Zustand)

### `useAuthStore`
- `user`, `session`, `loading`
- `signUp()`, `signIn()`, `signInWithGoogle()`, `signOut()`
- `initialize()` - listener de auth state

### `useResumeStore`
- `resume` (ResumeData completo), `jobDescription`, `matchScore`, `matchedKeywords`, `missingKeywords`
- CRUD para personalInfo, experiences, education, skills, bullets
- `fillSampleData()` - preenche com dados ficticios para teste
- `importLinkedInData()`, `resetResume()`
- Persistido em localStorage com key `curriculo-ai-resume`

## Componentes UI (shadcn/ui)

Badge, Button, Card, Dialog, Input, Label, Progress, Separator, Sheet, Tabs, Textarea, Tooltip

## Comandos

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de producao
npm run preview  # Preview do build
```

## Variaveis de Ambiente

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

A API key da Anthropic fica configurada na Edge Function do Supabase (server-side only).
