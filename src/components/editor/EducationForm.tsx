import { useResumeStore } from '@/stores/useResumeStore'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, GraduationCap } from 'lucide-react'

export default function EducationForm() {
  const education = useResumeStore((s) => s.resume.education)
  const addEducation = useResumeStore((s) => s.addEducation)
  const updateEducation = useResumeStore((s) => s.updateEducation)
  const removeEducation = useResumeStore((s) => s.removeEducation)

  const handleAdd = () => {
    addEducation({
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Educação</h2>
        <Button variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="mr-1.5 h-4 w-4" />
          Adicionar
        </Button>
      </div>

      {education.length === 0 && (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Nenhuma formação adicionada. Clique em &quot;Adicionar&quot; para começar.
        </p>
      )}

      <div className="space-y-4">
        {education.map((edu, index) => (
          <Card key={edu.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  Formação {index + 1}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => removeEducation(edu.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor={`institution-${edu.id}`}>Instituição</Label>
                <Input
                  id={`institution-${edu.id}`}
                  placeholder="Nome da instituição"
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`degree-${edu.id}`}>Grau</Label>
                  <Input
                    id={`degree-${edu.id}`}
                    placeholder="Ex: Bacharelado, Mestrado"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`field-${edu.id}`}>Área de Estudo</Label>
                  <Input
                    id={`field-${edu.id}`}
                    placeholder="Ex: Ciência da Computação"
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`eduStart-${edu.id}`}>Data de Início</Label>
                  <Input
                    id={`eduStart-${edu.id}`}
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`eduEnd-${edu.id}`}>Data de Término</Label>
                  <Input
                    id={`eduEnd-${edu.id}`}
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`description-${edu.id}`}>Descrição</Label>
                <Textarea
                  id={`description-${edu.id}`}
                  placeholder="Descreva atividades relevantes, honras, prêmios..."
                  value={edu.description}
                  rows={3}
                  onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
