import { supabase } from '@/lib/supabase'
import type { ResumeData } from '@/types/resume'

export interface ResumeRow {
  id: string
  title: string
  template: string
  content: ResumeData
  created_at: string
  updated_at: string
}

export async function saveResumeToSupabase(
  userId: string,
  resumeData: ResumeData,
  existingId?: string
): Promise<{ id: string } | null> {
  const title = resumeData.personalInfo.fullName
    ? `Currículo - ${resumeData.personalInfo.fullName}`
    : 'Meu Currículo'

  if (existingId) {
    const { error } = await supabase
      .from('resumes')
      .update({
        content: resumeData,
        template: resumeData.template,
        title,
      })
      .eq('id', existingId)

    if (error) {
      console.error('Erro ao atualizar currículo:', error)
      return null
    }
    return { id: existingId }
  }

  const { data, error } = await supabase
    .from('resumes')
    .insert({
      user_id: userId,
      content: resumeData,
      template: resumeData.template,
      title,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Erro ao salvar currículo:', error)
    return null
  }
  return data
}

export async function listResumes(userId: string): Promise<ResumeRow[]> {
  const { data, error } = await supabase
    .from('resumes')
    .select('id, title, template, content, created_at, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Erro ao listar currículos:', error)
    return []
  }
  return (data as ResumeRow[]) ?? []
}

export async function loadResumeFromSupabase(
  userId: string
): Promise<ResumeData | null> {
  const { data, error } = await supabase
    .from('resumes')
    .select('content')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) return null
  return data.content as ResumeData
}

export async function deleteResume(resumeId: string): Promise<boolean> {
  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('id', resumeId)

  if (error) {
    console.error('Erro ao deletar currículo:', error)
    return false
  }
  return true
}
