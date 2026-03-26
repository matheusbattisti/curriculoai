import { useResumeStore } from '@/stores/useResumeStore'
import ModernTemplate from './ModernTemplate'
import ClassicTemplate from './ClassicTemplate'

export default function ResumePreview() {
  const resume = useResumeStore((state) => state.resume)

  return (
    <div className="flex items-start justify-center">
      <div
        className="origin-top overflow-hidden bg-white shadow-lg"
        style={{
          width: '210mm',
          minHeight: '297mm',
          maxWidth: '100%',
          transform: 'scale(var(--preview-scale, 0.5))',
          transformOrigin: 'top center',
        }}
      >
        {resume.template === 'classic' ? (
          <ClassicTemplate resume={resume} />
        ) : (
          <ModernTemplate resume={resume} />
        )}
      </div>
    </div>
  )
}
