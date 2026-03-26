export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin: string
  website: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  description: string
}

export interface Skill {
  id: string
  name: string
  category: 'hard' | 'soft'
}

export interface ResumeData {
  personalInfo: PersonalInfo
  summary: string
  experiences: Experience[]
  education: Education[]
  skills: Skill[]
  template: 'modern' | 'classic'
}

export interface JobDescription {
  id: string
  resumeId: string
  jobTitle: string
  rawText: string
  parsedKeywords: ParsedKeywords
  matchScore: number
  createdAt: string
}

export interface ParsedKeywords {
  hardSkills: string[]
  softSkills: string[]
  requirements: string[]
  matched: string[]
  missing: string[]
}

export interface AIEdit {
  id: string
  resumeId: string
  originalText: string
  suggestedText: string
  applied: boolean
  createdAt: string
}

export const emptyResume: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
  },
  summary: '',
  experiences: [],
  education: [],
  skills: [],
  template: 'modern',
}

export const sampleResume: ResumeData = {
  personalInfo: {
    fullName: 'Ana Carolina Silva',
    email: 'ana.silva@email.com',
    phone: '(11) 98765-4321',
    location: 'São Paulo, SP',
    linkedin: 'linkedin.com/in/anacarolinasilva',
    website: 'anasilva.dev',
  },
  summary:
    'Desenvolvedora Full Stack com 5 anos de experiência em React, Node.js e TypeScript. Especialista em construir aplicações web escaláveis e de alta performance. Apaixonada por criar soluções que impactam positivamente a vida das pessoas.',
  experiences: [
    {
      id: 'exp-1',
      company: 'TechCorp Brasil',
      position: 'Desenvolvedora Full Stack Senior',
      startDate: '2022-03',
      endDate: '',
      current: true,
      bullets: [
        'Liderou a migração do monolito para microsserviços, reduzindo o tempo de deploy em 70%',
        'Implementou sistema de cache distribuído que reduziu latência da API de 800ms para 120ms',
        'Mentorou 4 desenvolvedores juniores, resultando em 2 promoções em 12 meses',
      ],
    },
    {
      id: 'exp-2',
      company: 'StartupX',
      position: 'Desenvolvedora Frontend Pleno',
      startDate: '2020-01',
      endDate: '2022-02',
      current: false,
      bullets: [
        'Desenvolveu o design system utilizado por 3 squads, padronizando a UI em 15+ produtos',
        'Aumentou a cobertura de testes de 30% para 85%, reduzindo bugs em produção em 60%',
        'Otimizou o bundle size em 45% através de code splitting e lazy loading',
      ],
    },
    {
      id: 'exp-3',
      company: 'Agência Digital Plus',
      position: 'Desenvolvedora Frontend Junior',
      startDate: '2019-01',
      endDate: '2019-12',
      current: false,
      bullets: [
        'Construiu 12 landing pages responsivas com taxa de conversão média de 4.2%',
        'Implementou integrações com APIs de pagamento (Stripe, PagSeguro) em 5 projetos',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Universidade de São Paulo (USP)',
      degree: 'Bacharelado',
      field: 'Ciência da Computação',
      startDate: '2015',
      endDate: '2019',
      description: 'Destaque acadêmico com projeto de conclusão sobre otimização de algoritmos de busca.',
    },
    {
      id: 'edu-2',
      institution: 'Rocketseat',
      degree: 'Certificação',
      field: 'Ignite - React & Node.js',
      startDate: '2021',
      endDate: '2021',
      description: 'Formação intensiva em React, Next.js, Node.js e TypeScript.',
    },
  ],
  skills: [
    { id: 'sk-1', name: 'React', category: 'hard' },
    { id: 'sk-2', name: 'TypeScript', category: 'hard' },
    { id: 'sk-3', name: 'Node.js', category: 'hard' },
    { id: 'sk-4', name: 'PostgreSQL', category: 'hard' },
    { id: 'sk-5', name: 'Docker', category: 'hard' },
    { id: 'sk-6', name: 'AWS', category: 'hard' },
    { id: 'sk-7', name: 'Git', category: 'hard' },
    { id: 'sk-8', name: 'Tailwind CSS', category: 'hard' },
    { id: 'sk-9', name: 'Liderança Técnica', category: 'soft' },
    { id: 'sk-10', name: 'Comunicação', category: 'soft' },
    { id: 'sk-11', name: 'Resolução de Problemas', category: 'soft' },
  ],
  template: 'modern',
}
