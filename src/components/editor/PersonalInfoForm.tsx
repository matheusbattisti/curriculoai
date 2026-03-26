import { useResumeStore } from '@/stores/useResumeStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Phone, MapPin, Link, Globe } from 'lucide-react'

const fields = [
  { key: 'fullName', label: 'Nome Completo', icon: User, placeholder: 'João da Silva', type: 'text' },
  { key: 'email', label: 'E-mail', icon: Mail, placeholder: 'joao@email.com', type: 'email' },
  { key: 'phone', label: 'Telefone', icon: Phone, placeholder: '(11) 99999-9999', type: 'tel' },
  { key: 'location', label: 'Localização', icon: MapPin, placeholder: 'São Paulo, SP', type: 'text' },
  { key: 'linkedin', label: 'LinkedIn', icon: Link, placeholder: 'linkedin.com/in/seu-perfil', type: 'url' },
  { key: 'website', label: 'Website', icon: Globe, placeholder: 'seuperfil.com', type: 'url' },
] as const

export default function PersonalInfoForm() {
  const personalInfo = useResumeStore((s) => s.resume.personalInfo)
  const setPersonalInfo = useResumeStore((s) => s.setPersonalInfo)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Informações Pessoais</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ key, label, icon: Icon, placeholder, type }) => (
          <div key={key} className="space-y-1.5">
            <Label htmlFor={key} className="flex items-center gap-1.5 text-sm">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              {label}
            </Label>
            <Input
              id={key}
              type={type}
              placeholder={placeholder}
              value={personalInfo[key]}
              onChange={(e) => setPersonalInfo({ [key]: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
