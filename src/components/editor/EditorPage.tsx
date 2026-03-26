import { useState, useEffect, useCallback } from 'react'
import { useResumeStore } from '@/stores/useResumeStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'
import {
  FileDown,
  BarChart3,
  LayoutTemplate,
  Monitor,
  PenLine,
  FlaskConical,
} from 'lucide-react'

import PersonalInfoForm from '@/components/editor/PersonalInfoForm'
import ExperienceForm from '@/components/editor/ExperienceForm'
import EducationForm from '@/components/editor/EducationForm'
import SkillsForm from '@/components/editor/SkillsForm'
import ResumePreview from '@/components/templates/ResumePreview'
import ATSPanel from '@/components/ats/ATSPanel'
import AuthModal from '@/components/auth/AuthModal'
import Navbar from '@/components/layout/Navbar'
import { exportToPDF } from '@/services/pdfExport'
import { saveResumeToSupabase } from '@/services/resumeService'

type PendingAction = 'export' | 'ats' | null

export default function EditorPage() {
  const template = useResumeStore((s) => s.resume.template)
  const setTemplate = useResumeStore((s) => s.setTemplate)
  const fillSampleData = useResumeStore((s) => s.fillSampleData)
  const { user } = useAuthStore()

  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor')
  const [showAuth, setShowAuth] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [atsOpen, setAtsOpen] = useState(false)
  const [savedResumeId, setSavedResumeId] = useState<string | null>(null)

  const executeAction = useCallback(async (action: PendingAction) => {
    const currentUser = useAuthStore.getState().user
    if (!currentUser) return

    // Save or update resume in Supabase
    const result = await saveResumeToSupabase(
      currentUser.id,
      useResumeStore.getState().resume,
      savedResumeId ?? undefined
    )
    if (result) {
      setSavedResumeId(result.id)
    }

    if (action === 'ats') {
      setAtsOpen(true)
    } else if (action === 'export') {
      exportToPDF(useResumeStore.getState().resume)
    }
  }, [savedResumeId])

  // When user logs in after auth modal, execute the pending action
  useEffect(() => {
    if (user && pendingAction) {
      const action = pendingAction
      setPendingAction(null)
      executeAction(action)
    }
  }, [user, pendingAction, executeAction])

  const requireAuth = (action: PendingAction) => {
    if (!user) {
      setPendingAction(action)
      setShowAuth(true)
      return
    }
    executeAction(action)
  }

  const handleExportPDF = () => requireAuth('export')
  const handleOpenATS = () => requireAuth('ats')

  const handleAuthClose = () => {
    setShowAuth(false)
    if (!useAuthStore.getState().user) {
      setPendingAction(null)
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <AuthModal isOpen={showAuth} onClose={handleAuthClose} defaultMode="signup" />
      <Sheet open={atsOpen} onOpenChange={setAtsOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <ATSPanel />
        </SheetContent>
      </Sheet>

      {/* Top Bar */}
      <header className="flex items-center justify-between border-b bg-background px-4 py-2 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="template-select" className="text-sm font-medium whitespace-nowrap">
              <LayoutTemplate className="mr-1.5 inline h-4 w-4" />
              Template
            </Label>
            <select
              id="template-select"
              value={template}
              onChange={(e) => setTemplate(e.target.value as 'modern' | 'classic')}
              className="flex h-8 rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="modern">Moderno</option>
              <option value="classic">Clássico</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile view toggle */}
          <div className="flex items-center gap-1 md:hidden">
            <Button
              variant={mobileView === 'editor' ? 'default' : 'outline'}
              size="sm"
              className="h-8"
              onClick={() => setMobileView('editor')}
            >
              <PenLine className="mr-1 h-3.5 w-3.5" />
              Editar
            </Button>
            <Button
              variant={mobileView === 'preview' ? 'default' : 'outline'}
              size="sm"
              className="h-8"
              onClick={() => setMobileView('preview')}
            >
              <Monitor className="mr-1 h-3.5 w-3.5" />
              Visualizar
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 border-dashed border-orange-400 text-orange-600 hover:bg-orange-50"
            onClick={fillSampleData}
          >
            <FlaskConical className="mr-1.5 h-4 w-4" />
            Preencher Teste
          </Button>

          <Button variant="outline" size="sm" className="h-8" onClick={handleOpenATS}>
            <BarChart3 className="mr-1.5 h-4 w-4" />
            ATS Score
          </Button>

          <Button size="sm" className="h-8" onClick={handleExportPDF}>
            <FileDown className="mr-1.5 h-4 w-4" />
            Exportar PDF
          </Button>

          <Navbar />
        </div>
      </header>

      {/* Split-screen Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side - Editor */}
        <div
          className={`w-full md:w-1/2 overflow-y-auto border-r p-4 ${
            mobileView === 'preview' ? 'hidden md:block' : ''
          }`}
        >
          <Tabs defaultValue="contato" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="contato">Contato</TabsTrigger>
              <TabsTrigger value="experiencia">Experiência</TabsTrigger>
              <TabsTrigger value="educacao">Educação</TabsTrigger>
              <TabsTrigger value="habilidades">Habilidades</TabsTrigger>
            </TabsList>

            <TabsContent value="contato" className="mt-4">
              <PersonalInfoForm />
            </TabsContent>

            <TabsContent value="experiencia" className="mt-4">
              <ExperienceForm />
            </TabsContent>

            <TabsContent value="educacao" className="mt-4">
              <EducationForm />
            </TabsContent>

            <TabsContent value="habilidades" className="mt-4">
              <SkillsForm />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Side - Preview */}
        <div
          className={`w-full md:w-1/2 overflow-y-auto bg-muted/30 p-4 ${
            mobileView === 'editor' ? 'hidden md:block' : ''
          }`}
        >
          <div className="mx-auto max-w-[210mm]">
            <ResumePreview />
          </div>
        </div>
      </div>
    </div>
  )
}
