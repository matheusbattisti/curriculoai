import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Zap,
  Shield,
  Target,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Upload,
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleCTA = () => navigate('/editor');

  return (
    <div className="min-h-screen bg-white">
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700">
        {/* decorative blobs */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40 text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-blue-100 backdrop-blur mb-6">
            Inteligência Artificial + Otimização ATS
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            90–95% dos currículos são{' '}
            <span className="text-yellow-300">rejeitados por robôs ATS</span>
            <br className="hidden sm:block" /> antes de um humano ler.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-blue-100 leading-relaxed">
            O CurriculoAI garante que o seu currículo{' '}
            <strong className="text-white">passa pelos filtros automáticos</strong> e chega
            nas mãos do recrutador — sem cadastro, sem paywall escondido.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={handleCTA}
              className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-6 rounded-xl shadow-lg shadow-green-500/30 transition-all hover:scale-105"
            >
              Crie seu Currículo sem Login
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <span className="text-sm text-blue-200">Grátis para começar — sem cartão de crédito</span>
          </div>

          {/* anti-frustration badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-blue-100">
            {[
              'Sem login obrigatório',
              'IA otimizada para ATS',
              'Preço transparente',
            ].map((text) => (
              <span key={text} className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-400" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FEATURES ───────── */}
      <section id="features" className="py-20 sm:py-28 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Tudo que você precisa para ser aprovado pelo ATS
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Ferramentas inteligentes que transformam seu currículo em uma máquina de
              conseguir entrevistas.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: FileText,
                title: 'Edição sem Login',
                description:
                  'Comece a criar seu currículo imediatamente. Sem formulários, sem espera — só resultados.',
                color: 'text-indigo-600',
                bg: 'bg-indigo-100',
              },
              {
                icon: Upload,
                title: 'Importar do LinkedIn',
                description:
                  'Importe seus dados do LinkedIn em segundos e tenha um currículo pronto para personalizar.',
                color: 'text-blue-600',
                bg: 'bg-blue-100',
              },
              {
                icon: Target,
                title: 'ATS Match Score',
                description:
                  'Simule a análise de compatibilidade ATS e veja sua pontuação antes de enviar.',
                color: 'text-emerald-600',
                bg: 'bg-emerald-100',
              },
              {
                icon: Sparkles,
                title: 'Bullet Points com IA',
                description:
                  'A IA reescreve suas experiências com verbos de ação e métricas que impressionam recrutadores.',
                color: 'text-amber-600',
                bg: 'bg-amber-100',
              },
            ].map(({ icon: Icon, title, description, color, bg }) => (
              <div
                key={title}
                className="group rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div
                  className={`inline-flex items-center justify-center rounded-xl ${bg} p-3 mb-4`}
                >
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── SOCIAL PROOF / STATS ───────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Números que comprovam resultados
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Candidatos que otimizam seus currículos com IA conseguem mais entrevistas.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                stat: '3x',
                label: 'mais entrevistas',
                detail: 'Currículos otimizados para ATS recebem até 3x mais convites.',
              },
              {
                stat: '< 5 min',
                label: 'para criar',
                detail: 'Importe do LinkedIn e tenha um currículo pronto em minutos.',
              },
              {
                stat: '95%',
                label: 'score ATS médio',
                detail: 'Nossos usuários atingem pontuação média de 95 no simulador ATS.',
              },
            ].map(({ stat, label, detail }) => (
              <div
                key={label}
                className="text-center rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 p-8 border border-indigo-100"
              >
                <p className="text-5xl font-extrabold text-indigo-600">{stat}</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">{label}</p>
                <p className="mt-2 text-sm text-gray-600">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Como funciona — 3 passos simples
            </h2>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                step: '01',
                icon: Zap,
                title: 'Cole a vaga desejada',
                description:
                  'Copie e cole a descrição da vaga. Nossa IA analisa as palavras-chave que o ATS procura.',
              },
              {
                step: '02',
                icon: Shield,
                title: 'Edite com sugestões de IA',
                description:
                  'Receba sugestões inteligentes de bullet points, habilidades e formatação otimizada.',
              },
              {
                step: '03',
                icon: Target,
                title: 'Exporte e candidate-se',
                description:
                  'Baixe seu currículo em PDF profissional pronto para enviar com confiança.',
              },
            ].map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="relative text-center">
                <span className="text-7xl font-black text-indigo-100 select-none">
                  {step}
                </span>
                <div className="mt-[-0.5rem] flex flex-col items-center">
                  <div className="inline-flex items-center justify-center rounded-full bg-indigo-600 p-3 mb-4 shadow-lg shadow-indigo-600/30">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                  <p className="mt-2 text-gray-600 max-w-xs leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FINAL CTA ───────── */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Pare de ser filtrado. Comece agora.
          </h2>
          <p className="mt-4 text-lg text-blue-100 max-w-xl mx-auto">
            Crie um currículo que os robôs aprovam e os recrutadores adoram — em
            minutos, sem cadastro.
          </p>
          <Button
            size="lg"
            onClick={handleCTA}
            className="mt-8 bg-green-500 hover:bg-green-600 text-white text-lg px-10 py-6 rounded-xl shadow-lg shadow-green-500/30 transition-all hover:scale-105"
          >
            Crie seu Currículo sem Login
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="mt-4 text-sm text-blue-200">
            Sem cartão de crédito. Sem pegadinhas.
          </p>
        </div>
      </section>

      {/* ───────── FOOTER ───────── */}
      <footer className="bg-gray-900 py-10 text-center text-sm text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} CurriculoAI. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
