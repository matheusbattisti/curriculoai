-- ============================================
-- CurriculoAI - Schema do Banco de Dados
-- Supabase PostgreSQL
-- ============================================

-- Tabela: profiles (extensão de auth.users)
-- Armazena dados adicionais do usuário e status de pagamento
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  stripe_customer_id text,
  payment_status text default 'free' check (payment_status in ('free', 'single', 'weekly')),
  payment_expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabela: resumes
-- Tabela central com coluna JSONB para flexibilidade
create table if not exists public.resumes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  local_session_id text, -- Para usuários anônimos antes do login
  title text default 'Meu Currículo',
  content jsonb not null default '{}'::jsonb, -- Estrutura completa do currículo
  template text default 'modern' check (template in ('modern', 'classic')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabela: job_descriptions
-- Armazena descrições de vagas e análise de compatibilidade
create table if not exists public.job_descriptions (
  id uuid default gen_random_uuid() primary key,
  resume_id uuid references public.resumes(id) on delete cascade not null,
  job_title text,
  company_name text,
  raw_text text not null,
  parsed_keywords jsonb default '{}'::jsonb, -- { hardSkills, softSkills, requirements }
  match_score integer default 0 check (match_score >= 0 and match_score <= 100),
  created_at timestamptz default now()
);

-- Tabela: ai_edits
-- Histórico de sugestões da IA para bullet points
create table if not exists public.ai_edits (
  id uuid default gen_random_uuid() primary key,
  resume_id uuid references public.resumes(id) on delete cascade not null,
  experience_id text, -- ID da experiência dentro do JSONB
  bullet_index integer,
  original_text text not null,
  suggested_text text not null,
  applied boolean default false,
  created_at timestamptz default now()
);

-- ============================================
-- Índices para performance
-- ============================================
create index if not exists idx_resumes_user_id on public.resumes(user_id);
create index if not exists idx_resumes_local_session on public.resumes(local_session_id);
create index if not exists idx_job_descriptions_resume on public.job_descriptions(resume_id);
create index if not exists idx_ai_edits_resume on public.ai_edits(resume_id);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.job_descriptions enable row level security;
alter table public.ai_edits enable row level security;

-- Policies: profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Policies: resumes
create policy "Users can view own resumes"
  on public.resumes for select
  using (auth.uid() = user_id);

create policy "Users can insert own resumes"
  on public.resumes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own resumes"
  on public.resumes for update
  using (auth.uid() = user_id);

create policy "Users can delete own resumes"
  on public.resumes for delete
  using (auth.uid() = user_id);

-- Policies: job_descriptions
create policy "Users can manage own job descriptions"
  on public.job_descriptions for all
  using (
    resume_id in (
      select id from public.resumes where user_id = auth.uid()
    )
  );

-- Policies: ai_edits
create policy "Users can manage own ai edits"
  on public.ai_edits for all
  using (
    resume_id in (
      select id from public.resumes where user_id = auth.uid()
    )
  );

-- ============================================
-- Trigger: auto-create profile on signup
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- Trigger: updated_at automático
-- ============================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create or replace trigger update_resumes_updated_at
  before update on public.resumes
  for each row execute procedure public.update_updated_at();
