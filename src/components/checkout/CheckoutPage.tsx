import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Download,
  ArrowLeft,
  Shield,
  CheckCircle,
  CreditCard,
  Star,
  Calendar,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useResumeStore } from '@/stores/useResumeStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { exportToPDF } from '@/services/pdfExport'
import AuthModal from '@/components/auth/AuthModal'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const resume = useResumeStore((state) => state.resume)
  const { user } = useAuthStore()
  const [isExporting, setIsExporting] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [pendingPlan, setPendingPlan] = useState<string | null>(null)

  const handlePayAndDownload = async (plan: string) => {
    // Require login before download
    if (!user) {
      setPendingPlan(plan)
      setShowAuth(true)
      return
    }

    setSelectedPlan(plan)
    setIsExporting(true)
    try {
      // For MVP, skip payment and export PDF directly
      await exportToPDF(resume)
    } catch (error) {
      console.error('Erro ao exportar PDF:', error)
    } finally {
      setIsExporting(false)
      setSelectedPlan(null)
    }
  }

  const handleAuthClose = () => {
    setShowAuth(false)
    // If user just logged in and had a pending plan, proceed with download
    if (useAuthStore.getState().user && pendingPlan) {
      handlePayAndDownload(pendingPlan)
      setPendingPlan(null)
    }
  }

  const experienceCount = resume.experiences.length
  const educationCount = resume.education.length
  const skillCount = resume.skills.length
  const hasContent =
    resume.personalInfo.fullName || experienceCount > 0 || educationCount > 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 px-4">
      <AuthModal isOpen={showAuth} onClose={handleAuthClose} defaultMode="signup" />
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/editor')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Editor
        </Button>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Baixe seu Currículo
          </h1>
          <p className="text-muted-foreground text-lg">
            Escolha o plano ideal para você
          </p>
        </div>

        {/* Resume Preview Summary */}
        {hasContent && (
          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Resumo do Currículo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Nome</p>
                  <p className="font-medium">
                    {resume.personalInfo.fullName || 'Não informado'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Experiências</p>
                  <p className="font-medium">
                    {experienceCount}{' '}
                    {experienceCount === 1 ? 'entrada' : 'entradas'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Formação</p>
                  <p className="font-medium">
                    {educationCount}{' '}
                    {educationCount === 1 ? 'entrada' : 'entradas'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Habilidades</p>
                  <p className="font-medium">
                    {skillCount}{' '}
                    {skillCount === 1 ? 'habilidade' : 'habilidades'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Single Download */}
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-3">
                <Download className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl">Download Único</CardTitle>
              <CardDescription>Ideal para quem precisa de um currículo agora</CardDescription>
              <div className="pt-2">
                <span className="text-3xl font-bold">R$ 19,90</span>
                <span className="text-muted-foreground ml-1">/ único</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  Download em PDF de alta qualidade
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  Formatação profissional ATS-friendly
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  Acesso imediato após o pagamento
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                variant="outline"
                onClick={() => handlePayAndDownload('single')}
                disabled={isExporting}
              >
                {isExporting && selectedPlan === 'single' ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Gerando PDF...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pagar e Baixar
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Weekly Pass */}
          <Card className="border-2 border-primary/50 relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <span className="bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                <Star className="h-3 w-3" />
                Melhor Valor
              </span>
            </div>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Passe Semanal</CardTitle>
              <CardDescription>
                Downloads ilimitados por 7 dias
              </CardDescription>
              <div className="pt-2">
                <span className="text-3xl font-bold">R$ 29,90</span>
                <span className="text-muted-foreground ml-1">/ 7 dias</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  Downloads ilimitados durante 7 dias
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  Edite e baixe quantas versões quiser
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  Formatação profissional ATS-friendly
                </li>
                <li className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary shrink-0" />
                  Sem renovação automática
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={() => handlePayAndDownload('weekly')}
                disabled={isExporting}
              >
                {isExporting && selectedPlan === 'weekly' ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Gerando PDF...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pagar e Baixar
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Separator />

        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 text-center md:text-left">
            <Shield className="h-8 w-8 text-green-600 shrink-0" />
            <div>
              <p className="font-medium text-sm">Pagamento Seguro</p>
              <p className="text-xs text-muted-foreground">
                Seus dados protegidos com criptografia
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 text-center md:text-left">
            <CheckCircle className="h-8 w-8 text-blue-600 shrink-0" />
            <div>
              <p className="font-medium text-sm">Sem Assinatura Escondida</p>
              <p className="text-xs text-muted-foreground">
                Pague apenas pelo que escolher
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 text-center md:text-left">
            <Star className="h-8 w-8 text-yellow-600 shrink-0" />
            <div>
              <p className="font-medium text-sm">Satisfação Garantida</p>
              <p className="text-xs text-muted-foreground">
                Currículo profissional ou seu dinheiro de volta
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
