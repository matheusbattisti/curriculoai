import { useState } from 'react'
import { useResumeStore } from '@/stores/useResumeStore'
import { getScoreColor, getScoreLabel } from '@/services/atsAnalyzer'
import { analyzeATS, type ATSAnalysisResult } from '@/services/aiService'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Search,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Target,
  Loader2,
  AlertTriangle,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Sparkles,
} from 'lucide-react'

export default function ATSPanel() {
  const {
    resume,
    jobDescription,
    matchScore,
    matchedKeywords,
    missingKeywords,
    setJobDescription,
    setMatchResult,
  } = useResumeStore()

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiResult, setAiResult] = useState<ATSAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleAnalyze() {
    if (!jobDescription.trim()) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const result = await analyzeATS(
        resume as unknown as Record<string, unknown>,
        jobDescription
      )
      setAiResult(result)
      setMatchResult(result.score, result.matchedKeywords, result.missingKeywords)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao analisar. Tente novamente.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'alta': return <ArrowUp className="h-3.5 w-3.5 text-red-500" />
      case 'média': return <ArrowRight className="h-3.5 w-3.5 text-yellow-500" />
      case 'baixa': return <ArrowDown className="h-3.5 w-3.5 text-blue-500" />
      default: return null
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'border-red-200 bg-red-50'
      case 'média': return 'border-yellow-200 bg-yellow-50'
      case 'baixa': return 'border-blue-200 bg-blue-50'
      default: return ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Job Description Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5" />
            <Sparkles className="h-4 w-4 text-purple-500" />
            Análise ATS com IA
          </CardTitle>
          <CardDescription>
            Cole a descrição da vaga e a IA analisará a compatibilidade com seu
            currículo, gerando sugestões específicas de melhoria.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Cole aqui a descrição da vaga..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={6}
            className="resize-none"
          />
          <Button
            onClick={handleAnalyze}
            disabled={!jobDescription.trim() || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analisando com IA...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analisar com Claude AI
              </>
            )}
          </Button>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {matchScore !== null && (
        <>
          {/* Score Display */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative flex h-32 w-32 items-center justify-center">
                  <svg
                    className="absolute h-full w-full -rotate-90"
                    viewBox="0 0 120 120"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-muted/30"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(matchScore / 100) * 327} 327`}
                      className={getScoreColor(matchScore)}
                    />
                  </svg>
                  <div className="text-center">
                    <span
                      className={`text-4xl font-bold ${getScoreColor(matchScore)}`}
                    >
                      {matchScore}%
                    </span>
                  </div>
                </div>

                <span
                  className={`text-lg font-semibold ${getScoreColor(matchScore)}`}
                >
                  {getScoreLabel(matchScore)}
                </span>

                <div className="w-full space-y-1">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Compatibilidade</span>
                    <span>{matchScore}%</span>
                  </div>
                  <Progress value={matchScore} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Summary */}
          {aiResult?.summary && (
            <Card className="border-purple-200 bg-purple-50/50">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Sparkles className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed">{aiResult.summary}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Keywords Sections */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Análise de Palavras-chave
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Palavras-chave encontradas ({matchedKeywords.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchedKeywords.length > 0 ? (
                    matchedKeywords.map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="outline"
                        className="border-green-300 bg-green-50 text-green-700"
                      >
                        {keyword}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma palavra-chave encontrada.
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-700">
                  <XCircle className="h-4 w-4" />
                  Palavras-chave ausentes ({missingKeywords.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {missingKeywords.length > 0 ? (
                    missingKeywords.map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="outline"
                        className="border-red-300 bg-red-50 text-red-700"
                      >
                        {keyword}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Todas as palavras-chave foram encontradas!
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Improvements */}
          {aiResult?.improvements && aiResult.improvements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Sugestões de Melhoria da IA
                </CardTitle>
                <CardDescription>
                  Ordenadas por prioridade para maximizar seu score
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiResult.improvements.map((imp, index) => (
                  <div
                    key={index}
                    className={`rounded-lg border p-3 ${getPriorityColor(imp.priority)}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {getPriorityIcon(imp.priority)}
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        {imp.section}
                      </span>
                      <Badge variant="outline" className="ml-auto text-xs capitalize">
                        {imp.priority}
                      </Badge>
                    </div>
                    <p className="text-sm leading-relaxed">{imp.suggestion}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
