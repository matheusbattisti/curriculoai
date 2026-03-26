import type { ResumeData } from '@/types/resume'

interface ModernTemplateProps {
  resume: ResumeData
}

export default function ModernTemplate({ resume }: ModernTemplateProps) {
  const { personalInfo, summary, experiences, education, skills } = resume

  return (
    <div
      className="font-[system-ui,Arial,sans-serif] text-[11px] leading-[1.5] text-gray-900"
      style={{ padding: '40px 48px' }}
    >
      {/* Header - Name and Contact */}
      <div className="mb-6 text-center">
        <h1 className="mb-1 text-2xl font-bold tracking-wide text-gray-900">
          {personalInfo.fullName || 'Seu Nome Completo'}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-[10px] text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && (
            <>
              {personalInfo.email && <span>|</span>}
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.location && (
            <>
              {(personalInfo.email || personalInfo.phone) && <span>|</span>}
              <span>{personalInfo.location}</span>
            </>
          )}
          {personalInfo.linkedin && (
            <>
              <span>|</span>
              <span>{personalInfo.linkedin}</span>
            </>
          )}
          {personalInfo.website && (
            <>
              <span>|</span>
              <span>{personalInfo.website}</span>
            </>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="mb-5">
          <h2 className="mb-2 border-b border-gray-300 pb-1 text-xs font-bold uppercase tracking-widest text-gray-800">
            Resumo Profissional
          </h2>
          <p className="text-justify text-gray-700">{summary}</p>
        </div>
      )}

      {/* Professional Experience */}
      {experiences.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-2 border-b border-gray-300 pb-1 text-xs font-bold uppercase tracking-widest text-gray-800">
            Experiencia Profissional
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[11px] font-bold text-gray-900">
                      {exp.position}
                    </h3>
                    <p className="text-[10px] text-gray-600">{exp.company}</p>
                  </div>
                  <span className="shrink-0 text-[10px] text-gray-500">
                    {exp.startDate}
                    {' - '}
                    {exp.current ? 'Presente' : exp.endDate}
                  </span>
                </div>
                {exp.bullets.length > 0 && (
                  <ul className="mt-1 list-inside list-disc space-y-0.5 text-gray-700">
                    {exp.bullets
                      .filter((b) => b.trim())
                      .map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-2 border-b border-gray-300 pb-1 text-xs font-bold uppercase tracking-widest text-gray-800">
            Educacao
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[11px] font-bold text-gray-900">
                      {edu.degree}
                      {edu.field ? ` em ${edu.field}` : ''}
                    </h3>
                    <p className="text-[10px] text-gray-600">
                      {edu.institution}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] text-gray-500">
                    {edu.startDate}
                    {edu.endDate ? ` - ${edu.endDate}` : ''}
                  </span>
                </div>
                {edu.description && (
                  <p className="mt-0.5 text-gray-700">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <h2 className="mb-2 border-b border-gray-300 pb-1 text-xs font-bold uppercase tracking-widest text-gray-800">
            Habilidades
          </h2>
          <div className="space-y-1">
            {skills.filter((s) => s.category === 'hard').length > 0 && (
              <p className="text-gray-700">
                <span className="font-semibold">Tecnicas: </span>
                {skills
                  .filter((s) => s.category === 'hard')
                  .map((s) => s.name)
                  .join(', ')}
              </p>
            )}
            {skills.filter((s) => s.category === 'soft').length > 0 && (
              <p className="text-gray-700">
                <span className="font-semibold">Interpessoais: </span>
                {skills
                  .filter((s) => s.category === 'soft')
                  .map((s) => s.name)
                  .join(', ')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
