import { useState } from 'react'
import { useResumeStore } from '@/stores/useResumeStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, X } from 'lucide-react'

export default function SkillsForm() {
  const skills = useResumeStore((s) => s.resume.skills)
  const addSkill = useResumeStore((s) => s.addSkill)
  const removeSkill = useResumeStore((s) => s.removeSkill)

  const [skillName, setSkillName] = useState('')
  const [category, setCategory] = useState<'hard' | 'soft'>('hard')

  const hardSkills = skills.filter((s) => s.category === 'hard')
  const softSkills = skills.filter((s) => s.category === 'soft')

  const handleAdd = () => {
    const trimmed = skillName.trim()
    if (!trimmed) return
    addSkill({
      id: crypto.randomUUID(),
      name: trimmed,
      category,
    })
    setSkillName('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Habilidades</h2>

      <div className="space-y-3">
        <div className="flex items-end gap-3">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="skill-name">Nova Habilidade</Label>
            <Input
              id="skill-name"
              placeholder="Ex: React, Liderança, Python..."
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="skill-category">Categoria</Label>
            <select
              id="skill-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as 'hard' | 'soft')}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="hard">Hard Skill</option>
              <option value="soft">Soft Skill</option>
            </select>
          </div>

          <Button onClick={handleAdd} size="sm" className="h-9">
            <Plus className="mr-1.5 h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </div>

      {skills.length === 0 && (
        <p className="text-sm text-muted-foreground py-4 text-center">
          Nenhuma habilidade adicionada ainda.
        </p>
      )}

      {hardSkills.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Hard Skills</Label>
          <div className="flex flex-wrap gap-2">
            {hardSkills.map((skill) => (
              <Badge
                key={skill.id}
                variant="secondary"
                className="gap-1 pr-1.5 text-sm"
              >
                {skill.name}
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                  aria-label={`Remover ${skill.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {hardSkills.length > 0 && softSkills.length > 0 && <Separator />}

      {softSkills.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Soft Skills</Label>
          <div className="flex flex-wrap gap-2">
            {softSkills.map((skill) => (
              <Badge
                key={skill.id}
                variant="outline"
                className="gap-1 pr-1.5 text-sm"
              >
                {skill.name}
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                  aria-label={`Remover ${skill.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
