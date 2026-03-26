import { supabase } from '@/lib/supabase'

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`

async function getAccessToken(): Promise<string> {
  // Try getSession first
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) return session.access_token

  // Fallback: refresh the session
  const { data: refreshed } = await supabase.auth.refreshSession()
  if (refreshed.session?.access_token) return refreshed.session.access_token

  throw new Error('Usuário não autenticado. Faça login novamente.')
}

async function callEdgeFunction(action: string, body: Record<string, unknown>) {
  const accessToken = await getAccessToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
  }

  // Pass Anthropic key via header if available (fallback when Supabase secret isn't set)
  const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (anthropicKey) {
    headers['x-anthropic-key'] = anthropicKey
  }

  const response = await fetch(`${FUNCTION_URL}?action=${action}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...body, action }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
    throw new Error(error.error || `Erro ${response.status}`)
  }

  return response.json()
}

export interface ATSAnalysisResult {
  score: number
  matchedKeywords: string[]
  missingKeywords: string[]
  improvements: {
    section: string
    suggestion: string
    priority: 'alta' | 'média' | 'baixa'
  }[]
  summary: string
}

export interface BulletImproveResult {
  improved: string
  reasoning: string
}

export async function analyzeATS(
  resume: Record<string, unknown>,
  jobDescription: string
): Promise<ATSAnalysisResult> {
  return callEdgeFunction('ats-analysis', { resume, jobDescription })
}

export async function improveBullet(
  bullet: string,
  position: string,
  company: string,
  jobContext?: string
): Promise<BulletImproveResult> {
  return callEdgeFunction('bullet-improve', { bullet, position, company, jobContext })
}
