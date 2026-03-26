import type { ResumeData } from '@/types/resume'

export function generateMockLinkedInData(): Partial<ResumeData> {
  return {
    personalInfo: {
      fullName: 'Ana Silva',
      email: 'ana.silva@email.com',
      phone: '(11) 98765-4321',
      location: 'São Paulo - SP',
      linkedin: 'linkedin.com/in/anasilva',
      website: '',
    },
    summary:
      'Profissional de tecnologia com mais de 6 anos de experiência em desenvolvimento de software, liderança de equipes ágeis e entrega de soluções escaláveis. Apaixonada por inovação e melhoria contínua de processos.',
    experiences: [
      {
        id: 'exp-mock-1',
        company: 'Tech Corp',
        position: 'Desenvolvedora Full Stack Sênior',
        startDate: '2021-03',
        endDate: '',
        current: true,
        bullets: [
          'Liderança técnica de equipe de 5 desenvolvedores na migração de sistema monolítico para microsserviços, reduzindo o tempo de deploy em 60%',
          'Desenvolvimento e manutenção de APIs RESTful em Node.js e TypeScript, atendendo mais de 50 mil requisições diárias',
          'Implementação de pipeline CI/CD com GitHub Actions, aumentando a frequência de deploys de semanal para diária',
        ],
      },
      {
        id: 'exp-mock-2',
        company: 'Inovação Digital Ltda',
        position: 'Desenvolvedora Front-end Pleno',
        startDate: '2018-06',
        endDate: '2021-02',
        current: false,
        bullets: [
          'Desenvolvimento de interfaces responsivas com React e TypeScript para plataforma SaaS com mais de 10 mil usuários ativos',
          'Redução de 40% no tempo de carregamento das páginas através de otimizações de performance e lazy loading',
          'Colaboração com equipe de UX/UI na criação de design system utilizado em 3 produtos da empresa',
        ],
      },
    ],
    education: [
      {
        id: 'edu-mock-1',
        institution: 'Universidade de São Paulo (USP)',
        degree: 'Bacharelado',
        field: 'Ciência da Computação',
        startDate: '2014',
        endDate: '2018',
        description:
          'Projeto de conclusão de curso sobre aplicações de Machine Learning em análise de dados urbanos.',
      },
      {
        id: 'edu-mock-2',
        institution: 'FIAP',
        degree: 'Pós-graduação',
        field: 'Arquitetura de Software',
        startDate: '2019',
        endDate: '2020',
        description:
          'Especialização em arquitetura de microsserviços, cloud computing e práticas DevOps.',
      },
    ],
    skills: [
      { id: 'skill-mock-1', name: 'React', category: 'hard' },
      { id: 'skill-mock-2', name: 'TypeScript', category: 'hard' },
      { id: 'skill-mock-3', name: 'Node.js', category: 'hard' },
      { id: 'skill-mock-4', name: 'Liderança de Equipe', category: 'soft' },
      { id: 'skill-mock-5', name: 'Comunicação', category: 'soft' },
      { id: 'skill-mock-6', name: 'Docker', category: 'hard' },
    ],
    template: 'modern',
  }
}

/**
 * Parses raw LinkedIn profile text into structured ResumeData.
 * Currently returns mock data — structured for future real implementation.
 */
export function parseLinkedInProfile(rawText: string): Partial<ResumeData> {
  // TODO: Implement real LinkedIn profile parsing
  // Future implementation will:
  // 1. Parse the raw text from LinkedIn profile export
  // 2. Extract personal info, experiences, education, and skills
  // 3. Map LinkedIn data fields to ResumeData structure
  // 4. Handle different LinkedIn export formats

  // For MVP, return mock data regardless of input
  console.log(`[linkedinImport] Recebido texto com ${rawText.length} caracteres. Usando dados simulados para o MVP.`)
  return generateMockLinkedInData()
}
