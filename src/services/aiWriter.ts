import type { Experience } from '@/types/resume'

interface AIBulletSuggestion {
  original: string
  suggested: string
  reasoning: string
}

const ACTION_VERBS = [
  'Liderou', 'Implementou', 'Desenvolveu', 'Otimizou', 'Gerenciou',
  'Aumentou', 'Reduziu', 'Criou', 'Automatizou', 'Projetou',
  'Coordenou', 'Estabeleceu', 'Transformou', 'Impulsionou',
  'Aprimorou', 'Estruturou', 'Conduziu', 'Entregou', 'Negociou',
  'Viabilizou', 'Expandiu', 'Consolidou', 'Reformulou',
]

const METRIC_TEMPLATES = [
  'resultando em {X}% de aumento em {área}',
  'reduzindo {área} em {X}%',
  'impactando {X}+ {unidade}',
  'gerando R$ {X} em {área}',
  'com {X}% de melhoria em {área}',
  'atingindo {X}% de {métrica}',
]

function startsWithActionVerb(text: string): boolean {
  return ACTION_VERBS.some((verb) =>
    text.trim().toLowerCase().startsWith(verb.toLowerCase())
  )
}

function hasMetrics(text: string): boolean {
  return /\d+[%$RkKmM]|\d+\s*(por cento|percent|reais|dólares|users|usuários|clientes)/i.test(text)
}

function generateImprovedBullet(
  originalText: string,
  _position: string,
  jobContext?: string
): AIBulletSuggestion {
  const text = originalText.trim()

  if (!text) {
    return {
      original: text,
      suggested: '',
      reasoning: 'Bullet point vazio',
    }
  }

  const hasAction = startsWithActionVerb(text)
  const hasNumbers = hasMetrics(text)

  let suggested = text
  const improvements: string[] = []

  if (!hasAction) {
    const verb = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)]
    suggested = `${verb} ${suggested.charAt(0).toLowerCase()}${suggested.slice(1)}`
    improvements.push('Adicionado verbo de ação no início')
  }

  if (!hasNumbers) {
    const template = METRIC_TEMPLATES[Math.floor(Math.random() * METRIC_TEMPLATES.length)]
    suggested = `${suggested}, ${template.replace('{X}', '[X]').replace('{área}', '[especifique a área]').replace('{unidade}', '[unidade]').replace('{métrica}', '[métrica]')}`
    improvements.push('Sugestão de métrica adicionada — preencha com seus dados reais')
  }

  if (jobContext) {
    improvements.push('Considere incluir termos-chave da vaga no bullet point')
  }

  return {
    original: originalText,
    suggested,
    reasoning: improvements.length > 0
      ? improvements.join('. ')
      : 'Bullet point já está bem estruturado com verbo de ação e métricas',
  }
}

export function generateBulletSuggestions(
  experience: Experience,
  jobContext?: string
): AIBulletSuggestion[] {
  return experience.bullets.map((bullet) =>
    generateImprovedBullet(bullet, experience.position, jobContext)
  )
}

export function generateSingleBulletSuggestion(
  bulletText: string,
  position: string,
  jobContext?: string
): AIBulletSuggestion {
  return generateImprovedBullet(bulletText, position, jobContext)
}

export function getWritingTips(experience: Experience): string[] {
  const tips: string[] = []

  if (experience.bullets.length === 0) {
    tips.push('Adicione pelo menos 3 bullet points descrevendo suas realizações neste cargo')
  }

  if (experience.bullets.length < 3) {
    tips.push('Recrutadores preferem entre 3-5 bullet points por experiência')
  }

  const bulletsWithMetrics = experience.bullets.filter(hasMetrics)
  if (bulletsWithMetrics.length < experience.bullets.length / 2) {
    tips.push('Tente incluir métricas e números em pelo menos metade dos seus bullet points')
  }

  const bulletsWithAction = experience.bullets.filter(startsWithActionVerb)
  if (bulletsWithAction.length < experience.bullets.length) {
    tips.push('Comece cada bullet point com um verbo de ação forte (ex: Liderou, Implementou, Aumentou)')
  }

  return tips
}
