import { useState } from 'react'
import { useResumeStore } from '@/stores/useResumeStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, Sparkles, Check, X, GripVertical, Loader2 } from 'lucide-react'
import { improveBullet } from '@/services/aiService'

export default function ExperienceForm() {
  const experiences = useResumeStore((s) => s.resume.experiences)
  const addExperience = useResumeStore((s) => s.addExperience)
  const updateExperience = useResumeStore((s) => s.updateExperience)
  const removeExperience = useResumeStore((s) => s.removeExperience)
  const updateBullet = useResumeStore((s) => s.updateBullet)
  const addBullet = useResumeStore((s) => s.addBullet)
  const removeBullet = useResumeStore((s) => s.removeBullet)

  const [aiSuggestions, setAiSuggestions] = useState<
    Record<string, { bulletIndex: number; suggestion: { improved: string; reasoning: string }; loading: boolean; error?: string }>
  >({})

  const handleAddExperience = () => {
    addExperience({
      id: crypto.randomUUID(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: [''],
    })
  }

  const handleAISuggestion = async (expId: string, bulletIndex: number, currentText: string) => {
    if (!currentText.trim()) return

    const user = useAuthStore.getState().user
    if (!user) return

    const key = `${expId}-${bulletIndex}`
    setAiSuggestions((prev) => ({
      ...prev,
      [key]: { bulletIndex, suggestion: { improved: '', reasoning: '' }, loading: true },
    }))

    try {
      const exp = experiences.find((e) => e.id === expId)
      const jobContext = useResumeStore.getState().jobDescription || undefined
      const result = await improveBullet(
        currentText,
        exp?.position || '',
        exp?.company || '',
        jobContext
      )
      setAiSuggestions((prev) => ({
        ...prev,
        [key]: { bulletIndex, suggestion: result, loading: false },
      }))
    } catch (err) {
      setAiSuggestions((prev) => ({
        ...prev,
        [key]: { bulletIndex, suggestion: { improved: '', reasoning: '' }, loading: false, error: err instanceof Error ? err.message : 'Erro ao melhorar' },
      }))
    }
  }

  const acceptSuggestion = (expId: string, bulletIndex: number) => {
    const key = `${expId}-${bulletIndex}`
    const entry = aiSuggestions[key]
    if (entry?.suggestion?.improved) {
      updateBullet(expId, bulletIndex, entry.suggestion.improved)
    }
    setAiSuggestions((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const dismissSuggestion = (expId: string, bulletIndex: number) => {
    const key = `${expId}-${bulletIndex}`
    setAiSuggestions((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Experiência Profissional</h2>
        <Button variant="outline" size="sm" onClick={handleAddExperience}>
          <Plus className="mr-1.5 h-4 w-4" />
          Adicionar
        </Button>
      </div>

      {experiences.length === 0 && (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Nenhuma experiência adicionada. Clique em &quot;Adicionar&quot; para começar.
        </p>
      )}

      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <Card key={exp.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  Experiência {index + 1}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => removeExperience(exp.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`company-${exp.id}`}>Empresa</Label>
                  <Input
                    id={`company-${exp.id}`}
                    placeholder="Nome da empresa"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`position-${exp.id}`}>Cargo</Label>
                  <Input
                    id={`position-${exp.id}`}
                    placeholder="Seu cargo"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`startDate-${exp.id}`}>Data de Início</Label>
                  <Input
                    id={`startDate-${exp.id}`}
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`endDate-${exp.id}`}>Data de Término</Label>
                  <Input
                    id={`endDate-${exp.id}`}
                    type="month"
                    value={exp.endDate}
                    disabled={exp.current}
                    onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id={`current-${exp.id}`}
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) =>
                    updateExperience(exp.id, {
                      current: e.target.checked,
                      endDate: e.target.checked ? '' : exp.endDate,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor={`current-${exp.id}`} className="text-sm font-normal">
                  Trabalho atual
                </Label>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Atividades / Conquistas</Label>
                  <Button variant="ghost" size="sm" onClick={() => addBullet(exp.id)}>
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    Adicionar item
                  </Button>
                </div>

                {exp.bullets.map((bullet, bulletIndex) => {
                  const suggestionKey = `${exp.id}-${bulletIndex}`
                  const suggestion = aiSuggestions[suggestionKey]

                  return (
                    <div key={bulletIndex} className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="mt-2.5 text-muted-foreground text-sm">•</span>
                        <Input
                          placeholder="Descreva sua atividade ou conquista..."
                          value={bullet}
                          onChange={(e) => updateBullet(exp.id, bulletIndex, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 shrink-0 text-violet-500 hover:text-violet-600 hover:bg-violet-50"
                          title="Melhorar com IA"
                          disabled={suggestion?.loading || !bullet.trim()}
                          onClick={() => handleAISuggestion(exp.id, bulletIndex, bullet)}
                        >
                          {suggestion?.loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 shrink-0 text-destructive hover:text-destructive"
                          onClick={() => removeBullet(exp.id, bulletIndex)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {suggestion && !suggestion.loading && suggestion.error && (
                        <div className="ml-5 rounded-md border border-red-200 bg-red-50 p-3">
                          <p className="text-sm text-red-700">{suggestion.error}</p>
                        </div>
                      )}

                      {suggestion && !suggestion.loading && suggestion.suggestion?.improved && (
                        <div className="ml-5 rounded-md border border-violet-200 bg-violet-50 p-3 space-y-2">
                          <p className="text-sm text-violet-900">
                            <strong>Sugestão IA:</strong> {suggestion.suggestion.improved}
                          </p>
                          {suggestion.suggestion.reasoning && (
                            <p className="text-xs text-violet-600 italic">
                              {suggestion.suggestion.reasoning}
                            </p>
                          )}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs border-violet-300 text-violet-700 hover:bg-violet-100"
                              onClick={() => acceptSuggestion(exp.id, bulletIndex)}
                            >
                              <Check className="mr-1 h-3 w-3" />
                              Aceitar
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs text-muted-foreground"
                              onClick={() => dismissSuggestion(exp.id, bulletIndex)}
                            >
                              <X className="mr-1 h-3 w-3" />
                              Dispensar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
