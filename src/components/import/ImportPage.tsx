import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, Link, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useResumeStore } from '@/stores/useResumeStore'
import {
  generateMockLinkedInData,
  parseLinkedInProfile,
} from '@/services/linkedinImport'

export default function ImportPage() {
  const navigate = useNavigate()
  const { importLinkedInData, resetResume } = useResumeStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [linkedInText, setLinkedInText] = useState('')
  const [isImporting, setIsImporting] = useState(false)

  const handleStartFromScratch = () => {
    resetResume()
    navigate('/editor')
  }

  const handleSimulateImport = () => {
    setIsImporting(true)
    // Simulate a brief loading delay for UX
    setTimeout(() => {
      const mockData = linkedInText.trim()
        ? parseLinkedInProfile(linkedInText)
        : generateMockLinkedInData()
      importLinkedInData(mockData)
      setIsImporting(false)
      setDialogOpen(false)
      navigate('/editor')
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Como você quer começar?
          </h1>
          <p className="text-muted-foreground text-lg">
            Escolha a melhor opção para criar seu currículo profissional
          </p>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* LinkedIn Import Card */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="absolute top-3 right-3">
              <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
                Recomendado
              </span>
            </div>
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <Link className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Importar do LinkedIn</CardTitle>
              <CardDescription>
                Importe seus dados do LinkedIn e tenha seu currículo pronto em
                segundos
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Preenche automaticamente suas experiências
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Importa formação e habilidades
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Economize tempo na criação
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={() => setDialogOpen(true)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Importar do LinkedIn
              </Button>
            </CardFooter>
          </Card>

          {/* Start from Scratch Card */}
          <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-3">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl">Começar do Zero</CardTitle>
              <CardDescription>
                Crie seu currículo preenchendo cada seção manualmente
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Controle total sobre cada detalhe
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Ideal para quem não tem LinkedIn
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Editor intuitivo e fácil de usar
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={handleStartFromScratch}
              >
                <FileText className="mr-2 h-4 w-4" />
                Começar do Zero
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Separator />

        <p className="text-center text-sm text-muted-foreground">
          Você poderá editar todas as informações depois, independente da opção
          escolhida.
        </p>
      </div>

      {/* LinkedIn Import Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link className="h-5 w-5 text-primary" />
              Importar do LinkedIn
            </DialogTitle>
            <DialogDescription>
              Cole a URL do seu perfil do LinkedIn ou os dados exportados. No
              MVP, usaremos dados simulados para demonstrar a funcionalidade.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="linkedin-data">
                URL do perfil ou dados do LinkedIn
              </Label>
              <Textarea
                id="linkedin-data"
                placeholder="Ex: https://linkedin.com/in/seu-perfil ou cole os dados exportados aqui..."
                value={linkedInText}
                onChange={(e) => setLinkedInText(e.target.value)}
                rows={4}
              />
            </div>

            <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">
                Como funciona no MVP:
              </p>
              <p>
                Clique em &quot;Simular Importação&quot; para preencher o
                currículo com dados de exemplo (Ana Silva, Desenvolvedora Full
                Stack). Na versão final, os dados reais do LinkedIn serão
                importados automaticamente.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSimulateImport} disabled={isImporting}>
              {isImporting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Importando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Simular Importação
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
