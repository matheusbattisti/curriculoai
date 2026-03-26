import type { ResumeData, ParsedKeywords } from '@/types/resume'

const COMMON_HARD_SKILLS = [
  'javascript', 'typescript', 'python', 'java', 'react', 'angular', 'vue',
  'node.js', 'nodejs', 'sql', 'nosql', 'mongodb', 'postgresql', 'aws',
  'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'git', 'agile', 'scrum',
  'rest', 'api', 'graphql', 'html', 'css', 'sass', 'webpack', 'vite',
  'figma', 'sketch', 'adobe', 'photoshop', 'illustrator', 'excel',
  'power bi', 'tableau', 'machine learning', 'data analysis', 'seo',
  'marketing digital', 'vendas', 'gestão de projetos', 'liderança',
  'comunicação', 'negociação', 'planejamento estratégico', 'crm',
  'salesforce', 'hubspot', 'jira', 'confluence', 'slack',
]

const COMMON_SOFT_SKILLS = [
  'liderança', 'comunicação', 'trabalho em equipe', 'resolução de problemas',
  'pensamento crítico', 'adaptabilidade', 'criatividade', 'organização',
  'gestão de tempo', 'proatividade', 'empatia', 'negociação', 'colaboração',
  'autogestão', 'resiliência', 'inovação', 'mentoria', 'feedback',
  'leadership', 'communication', 'teamwork', 'problem-solving',
  'critical thinking', 'adaptability', 'creativity', 'time management',
]

function extractKeywords(text: string): string[] {
  const normalized = text.toLowerCase()
  const words = normalized
    .replace(/[^\w\sáàâãéèêíïóôõöúçñ/.+-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2)

  const bigrams: string[] = []
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]} ${words[i + 1]}`)
  }

  const trigrams: string[] = []
  for (let i = 0; i < words.length - 2; i++) {
    trigrams.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`)
  }

  return [...new Set([...words, ...bigrams, ...trigrams])]
}

function findSkillMatches(
  tokens: string[],
  skillList: string[]
): string[] {
  const found: string[] = []
  const textJoined = tokens.join(' ')

  for (const skill of skillList) {
    if (textJoined.includes(skill.toLowerCase())) {
      found.push(skill)
    }
  }

  return [...new Set(found)]
}

export function parseJobDescription(rawText: string): ParsedKeywords {
  const tokens = extractKeywords(rawText)
  const hardSkills = findSkillMatches(tokens, COMMON_HARD_SKILLS)
  const softSkills = findSkillMatches(tokens, COMMON_SOFT_SKILLS)

  return {
    hardSkills,
    softSkills,
    requirements: [...hardSkills, ...softSkills],
    matched: [],
    missing: [],
  }
}

export function calculateMatchScore(
  resume: ResumeData,
  jobKeywords: ParsedKeywords
): { score: number; matched: string[]; missing: string[] } {
  const resumeText = [
    resume.personalInfo.fullName,
    resume.summary,
    ...resume.experiences.flatMap((e) => [
      e.company,
      e.position,
      ...e.bullets,
    ]),
    ...resume.education.map((e) => `${e.degree} ${e.field} ${e.institution}`),
    ...resume.skills.map((s) => s.name),
  ]
    .join(' ')
    .toLowerCase()

  const allKeywords = [
    ...jobKeywords.hardSkills,
    ...jobKeywords.softSkills,
  ]

  const matched: string[] = []
  const missing: string[] = []

  for (const keyword of allKeywords) {
    if (resumeText.includes(keyword.toLowerCase())) {
      matched.push(keyword)
    } else {
      missing.push(keyword)
    }
  }

  const score =
    allKeywords.length > 0
      ? Math.round((matched.length / allKeywords.length) * 100)
      : 0

  return { score, matched, missing }
}

export function getScoreColor(score: number): string {
  if (score >= 75) return 'text-green-600'
  if (score >= 50) return 'text-yellow-600'
  return 'text-red-600'
}

export function getScoreLabel(score: number): string {
  if (score >= 75) return 'Excelente'
  if (score >= 50) return 'Bom'
  if (score >= 25) return 'Precisa melhorar'
  return 'Baixa compatibilidade'
}
