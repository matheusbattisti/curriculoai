import type { ResumeData } from '@/types/resume'

interface ClassicTemplateProps {
  resume: ResumeData
}

export default function ClassicTemplate({ resume }: ClassicTemplateProps) {
  const { personalInfo, summary, experiences, education, skills } = resume

  return (
    <div
      className="text-[11px] leading-[1.6] text-gray-900"
      style={{
        fontFamily: '"Times New Roman", "Georgia", serif',
        padding: '48px 56px',
      }}
    >
      {/* Header - Name and Contact */}
      <div className="mb-5 text-center">
        <h1
          className="mb-1 text-2xl font-bold text-gray-900"
          style={{ fontFamily: '"Times New Roman", "Georgia", serif' }}
        >
          {personalInfo.fullName || 'Seu Nome Completo'}
        </h1>
        <div className="text-[10px] leading-relaxed text-gray-600">
          {[
            personalInfo.email,
            personalInfo.phone,
            personalInfo.location,
            personalInfo.linkedin,
            personalInfo.website,
          ]
            .filter(Boolean)
            .join('  |  ')}
        </div>
      </div>

      <hr className="mb-4 border-t border-gray-900" />

      {/* Professional Summary */}
      {summary && (
        <div className="mb-5">
          <h2 className="mb-1 text-[12px] font-bold uppercase text-gray-900">
            Resumo Profissional
          </h2>
          <hr className="mb-2 border-t border-gray-400" />
          <p className="text-justify text-gray-800">{summary}</p>
        </div>
      )}

      {/* Professional Experience */}
      {experiences.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-1 text-[12px] font-bold uppercase text-gray-900">
            Experiencia Profissional
          </h2>
          <hr className="mb-2 border-t border-gray-400" />
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[11px] font-bold text-gray-900">
                      {exp.position}
                    </h3>
                    <p className="text-[10px] italic text-gray-700">
                      {exp.company}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] text-gray-600">
                    {exp.startDate}
                    {' - '}
                    {exp.current ? 'Presente' : exp.endDate}
                  </span>
                </div>
                {exp.bullets.length > 0 && (
                  <ul className="mt-1 list-inside list-disc space-y-0.5 text-gray-800">
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
          <h2 className="mb-1 text-[12px] font-bold uppercase text-gray-900">
            Educacao
          </h2>
          <hr className="mb-2 border-t border-gray-400" />
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[11px] font-bold text-gray-900">
                      {edu.degree}
                      {edu.field ? ` em ${edu.field}` : ''}
                    </h3>
                    <p className="text-[10px] italic text-gray-700">
                      {edu.institution}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] text-gray-600">
                    {edu.startDate}
                    {edu.endDate ? ` - ${edu.endDate}` : ''}
                  </span>
                </div>
                {edu.description && (
                  <p className="mt-0.5 text-gray-800">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <h2 className="mb-1 text-[12px] font-bold uppercase text-gray-900">
            Habilidades
          </h2>
          <hr className="mb-2 border-t border-gray-400" />
          <div className="space-y-1">
            {skills.filter((s) => s.category === 'hard').length > 0 && (
              <p className="text-gray-800">
                <span className="font-bold">Tecnicas: </span>
                {skills
                  .filter((s) => s.category === 'hard')
                  .map((s) => s.name)
                  .join(', ')}
              </p>
            )}
            {skills.filter((s) => s.category === 'soft').length > 0 && (
              <p className="text-gray-800">
                <span className="font-bold">Interpessoais: </span>
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
