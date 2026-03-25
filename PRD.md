# Product Requirements Document (PRD) - CurriculoAI (Versão 1 - MVP)

## 1. Visão Geral do Produto e Contexto de Mercado

O **CurriculoAI** é um gerador de currículos inteligente focado em **performance e conversão**.

**O Problema:** O mercado atual está quebrado. Cerca de 90 a 95% dos currículos são rejeitados automaticamente por sistemas de rastreamento de candidatos (ATS) porque os usuários criam designs complexos e ilegíveis para robôs. Além disso, quando chegam a mãos humanas, os recrutadores gastam em média apenas 7,4 segundos lendo o documento. Para piorar, ferramentas concorrentes (como Resume.io, Zety e Canva) atraem usuários com modelos bonitos, mas ilegíveis para o ATS, e os prendem em "paywalls" ocultos com assinaturas mensais difíceis de cancelar.

**A Solução (Nosso Diferencial):** O CurriculoAI será uma ferramenta baseada em transparência e dados. Oferecemos um onboarding sem atrito (sem login obrigatório no início), templates 100% otimizados para ATS (sem colunas duplas ou gráficos), ferramentas de IA que geram _bullet points_ focados em resultados, e um modelo de negócio honesto (como passes semanais ou pagamento único por download).

---

## 2. Jornada do Usuário (User Flow)

A jornada do MVP deve ser otimizada para o menor tempo possível entre a chegada no site e a visualização de valor:

1. **Landing Page:** O usuário clica em "Criar Currículo Agora" (nenhum cadastro ou e-mail é exigido).
2. **Onboarding / Importação:** O usuário escolhe entre começar do zero ou fazer a **Importação do LinkedIn** via extração segura (OAuth) para preencher o rascunho automaticamente.
3. **Editor Split-Screen:** O usuário edita as seções do lado esquerdo (Contato, Resumo, Experiência, Educação, Habilidades) enquanto visualiza a renderização em tempo real no lado direito.
4. **Otimização (Simulador ATS):** O usuário abre a aba lateral, cola a descrição da vaga dos sonhos e a IA analisa o currículo, gerando um **Match Score** e destacando as palavras-chave ausentes.
5. **Aprimoramento com IA:** O usuário clica em "Melhorar com IA" nos seus _bullet points_ de experiência, e a ferramenta sugere métricas e linguagem voltada para impacto.
6. **Checkout Transparente e Download:** O usuário visualiza o preço claro. Para baixar, ele finalmente cria a conta (via Supabase Auth), faz o pagamento (via Stripe) e baixa um PDF ou DOCX amigável para ATS.

---

## 3. Funcionalidades Essenciais do MVP (Escopo Fechado)

Para a V1, construiremos estritamente o seguinte:

- **Editor "No-Login":** Gerenciamento do estado da aplicação salvo no cache local (Local Storage/Zustand) até a etapa de pagamento.
- **Importação LinkedIn:** Automação que extrai os dados do perfil, mapeia títulos, datas e descrições para a estrutura JSON do nosso banco de dados, eliminando a síndrome da página em branco.
- **Gerador Generativo de Bullet Points:** Uma integração com LLM que transforma frases fracas em declarações de impacto. Exemplo: transforma "trabalhei com vendas" para "Aumentou vendas em 20%, gerando $1.2M", considerando o contexto da vaga.
- **Simulador de ATS (Match Score):** Motor de análise semântica que compara o texto do currículo com a descrição da vaga colada pelo usuário. Retorna uma pontuação (0 a 100), palavras-chave encontradas (em verde) e palavras-chave ausentes (em vermelho).
- **Exportação Segura para ATS:** Exportador de PDF baseado em texto (com codificação Unicode segura) e DOCX. **Importante:** Não usar exportação convertendo HTML/DOM para imagem, pois o ATS não consegue ler imagens.

---

## 4. Design System e Regras de Interface (UI/UX)

O design visual da plataforma deve ser minimalista e focado no usuário, usando **Tailwind CSS e Shadcn/ui**. As regras para os templates gerados devem seguir estudos de _eye-tracking_ e padrões de máquina:

- **Padrão de Leitura F e E:** Recrutadores escaneiam buscando títulos de cargos e subtítulos. Portanto, os cargos devem estar sempre em **negrito** e apoiados por _bullet points_ curtos em vez de parágrafos.
- **Layout Estrito de Coluna Única:** Templates em duas colunas ou com gráficos falham na leitura do ATS. Todos os templates do MVP devem ter uma única coluna e alinhamento à esquerda.
- **Tipografia Segura:** Utilizar fontes padrões de sistema (Arial, Calibri, Times New Roman) com tamanhos entre 10 e 12pt para corpo, e 14 a 16pt para títulos.
- **Cabeçalhos Padronizados:** As seções devem possuir títulos que os robôs entendem universalmente (Experiência, Educação, Habilidades).
- **Ausência de Elementos Visuais Quebrados:** Zero tabelas, zero ícones complexos, zero barras de progresso de habilidades e nenhuma foto do candidato.

---

## 5. Stack de Tecnologia e Arquitetura

- **Frontend:** React (TypeScript) via Vite.
- **Estilização:** Tailwind CSS + Componentes Acessíveis do Shadcn/ui.
- **Estado:** Zustand (para gerenciar os dados do currículo localmente antes do login) e React Query para mutações.
- **Backend & Banco de Dados:** Supabase. Usaremos o banco de dados PostgreSQL relacional.
- **Autenticação:** Supabase Auth (acionado apenas no final do funil).
- **Pagamentos:** Stripe Checkout (pagamento único ou passe semanal).

**Esquema de Banco de Dados Mapeado (Supabase):**

1.  `profiles`: Extensão de `auth.users` contendo dados de inscrição e status de pagamento da Stripe.
2.  `resumes`: Tabela central contendo uma coluna `content` (tipo JSONB) para máxima flexibilidade dos dados do currículo. Pode conter `user_id` nulo temporariamente se atrelado a um `local_session_id`.
3.  `job_descriptions`: Guarda a descrição da vaga, a análise das `parsed_keywords` e o `match_score` atrelado a um `resume_id`.
4.  `ai_edits`: Histórico das sugestões do LLM, incluindo `original_text`, `suggested_text` e se foi aceito pelo usuário.

---

## 6. Métricas de Sucesso do MVP

- **Taxa de Início:** % de usuários que entram na Landing Page e começam a preencher um dado.
- **Taxa de Conversão Final:** % de usuários que chegam ao checkout e pagam para fazer o download do currículo otimizado.
- **Métrica de Valor (Retenção/Indicação):** % de currículos gerados que atingem um ATS Match Score superior a 75% antes do download.

**Nota para o Claude/Desenvolvedor:** Este PRD prioriza a função sobre a forma visual excessiva. Seu foco de engenharia não deve ser criar um editor de "arrastar e soltar" (drag-and-drop), mas sim uma interface estruturada em formulários limpos que renderizam de forma automatizada e infalível um currículo altamente técnico e legível tanto por máquinas quanto por recrutadores de alto nível.
