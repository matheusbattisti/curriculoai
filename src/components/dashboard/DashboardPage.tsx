import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  FileDown,
  BarChart3,
  Pencil,
  Trash2,
  FileText,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuthStore } from '@/stores/useAuthStore'
import { useResumeStore } from '@/stores/useResumeStore'
import { listResumes, deleteResume, type ResumeRow } from '@/services/resumeService'
import { exportToPDF } from '@/services/pdfExport'
import type { ResumeData } from '@/types/resume'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuthStore()
  const [resumes, setResumes] = useState<ResumeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [exportingId, setExportingId] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/')
      return
    }
    if (user) {
      loadResumes()
    }
  }, [user, authLoading, navigate])

  const loadResumes = async () => {
    if (!user) return
    setLoading(true)
    const data = await listResumes(user.id)
    setResumes(data)
    setLoading(false)
  }

  const handleEdit = (resume: ResumeRow) => {
    const store = useResumeStore.getState()
    const content = resume.content as ResumeData
    store.importLinkedInData(content)
    if (content.template) store.setTemplate(content.template)
    if (content.summary) store.setSummary(content.summary)
    navigate('/editor')
  }

  const handleExportPDF = async (resume: ResumeRow) => {
    setExportingId(resume.id)
    try {
      await exportToPDF(resume.content as ResumeData)
    } catch (error) {
      console.error('Erro ao exportar:', error)
    } finally {
      setExportingId(null)
    }
  }

  const handleDelete = async (resumeId: string) => {
    if (!confirm('Tem certeza que deseja excluir este currículo?')) return
    setDeletingId(resumeId)
    const success = await deleteResume(resumeId)
    if (success) {
      setResumes((prev) => prev.filter((r) => r.id !== resumeId))
    }
    setDeletingId(null)
  }

  const handleNewResume = () => {
    useResumeStore.getState().resetResume()
    navigate('/editor')
  }

  const handleATS = (resume: ResumeRow) => {
    const store = useResumeStore.getState()
    const content = resume.content as ResumeData
    store.importLinkedInData(content)
    if (content.template) store.setTemplate(content.template)
    if (content.summary) store.setSummary(content.summary)
    navigate('/editor?ats=true')
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getResumeStats = (content: ResumeData) => {
    return {
      experiences: content.experiences?.length ?? 0,
      education: content.education?.length ?? 0,
      skills: content.skills?.length ?? 0,
    }
  }

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meus Currículos</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie, edite e exporte seus currículos
            </p>
          </div>
          <Button onClick={handleNewResume} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Currículo
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Empty State */}
        {!loading && resumes.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-16 w-16 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold mb-1">Nenhum currículo ainda</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                Crie seu primeiro currículo otimizado para ATS e comece a receber mais entrevistas.
              </p>
              <Button onClick={handleNewResume} className="gap-2">
                <Plus className="h-4 w-4" />
                Criar Primeiro Currículo
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Resumes Table */}
        {!loading && resumes.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {resumes.length} {resumes.length === 1 ? 'currículo' : 'currículos'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Título</th>
                      <th className="pb-3 font-medium hidden sm:table-cell">Template</th>
                      <th className="pb-3 font-medium hidden md:table-cell">Conteúdo</th>
                      <th className="pb-3 font-medium hidden lg:table-cell">Atualizado</th>
                      <th className="pb-3 font-medium text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {resumes.map((resume) => {
                      const stats = getResumeStats(resume.content)
                      return (
                        <tr key={resume.id} className="group">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium truncate">{resume.title}</p>
                                <p className="text-xs text-muted-foreground sm:hidden">
                                  {formatDate(resume.updated_at)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 hidden sm:table-cell">
                            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize">
                              {resume.template === 'modern' ? 'Moderno' : 'Clássico'}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-muted-foreground hidden md:table-cell">
                            {stats.experiences} exp. · {stats.education} edu. · {stats.skills} hab.
                          </td>
                          <td className="py-4 text-sm text-muted-foreground hidden lg:table-cell">
                            {formatDate(resume.updated_at)}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="Editar"
                                onClick={() => handleEdit(resume)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="Verificar ATS"
                                onClick={() => handleATS(resume)}
                              >
                                <BarChart3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="Exportar PDF"
                                disabled={exportingId === resume.id}
                                onClick={() => handleExportPDF(resume)}
                              >
                                {exportingId === resume.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <FileDown className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                title="Excluir"
                                disabled={deletingId === resume.id}
                                onClick={() => handleDelete(resume.id)}
                              >
                                {deletingId === resume.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
