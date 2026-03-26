import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ResumeData, Experience, Education, Skill, PersonalInfo } from '@/types/resume'
import { emptyResume, sampleResume } from '@/types/resume'

interface ResumeStore {
  resume: ResumeData
  jobDescription: string
  matchScore: number | null
  matchedKeywords: string[]
  missingKeywords: string[]

  setPersonalInfo: (info: Partial<PersonalInfo>) => void
  setSummary: (summary: string) => void
  setTemplate: (template: 'modern' | 'classic') => void

  addExperience: (exp: Experience) => void
  updateExperience: (id: string, exp: Partial<Experience>) => void
  removeExperience: (id: string) => void

  addEducation: (edu: Education) => void
  updateEducation: (id: string, edu: Partial<Education>) => void
  removeEducation: (id: string) => void

  addSkill: (skill: Skill) => void
  removeSkill: (id: string) => void

  setJobDescription: (text: string) => void
  setMatchResult: (score: number, matched: string[], missing: string[]) => void

  updateBullet: (expId: string, bulletIndex: number, text: string) => void
  addBullet: (expId: string) => void
  removeBullet: (expId: string, bulletIndex: number) => void

  importLinkedInData: (data: Partial<ResumeData>) => void
  resetResume: () => void
  fillSampleData: () => void
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: emptyResume,
      jobDescription: '',
      matchScore: null,
      matchedKeywords: [],
      missingKeywords: [],

      setPersonalInfo: (info) =>
        set((state) => ({
          resume: {
            ...state.resume,
            personalInfo: { ...state.resume.personalInfo, ...info },
          },
        })),

      setSummary: (summary) =>
        set((state) => ({ resume: { ...state.resume, summary } })),

      setTemplate: (template) =>
        set((state) => ({ resume: { ...state.resume, template } })),

      addExperience: (exp) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experiences: [...state.resume.experiences, exp],
          },
        })),

      updateExperience: (id, exp) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experiences: state.resume.experiences.map((e) =>
              e.id === id ? { ...e, ...exp } : e
            ),
          },
        })),

      removeExperience: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experiences: state.resume.experiences.filter((e) => e.id !== id),
          },
        })),

      addEducation: (edu) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: [...state.resume.education, edu],
          },
        })),

      updateEducation: (id, edu) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: state.resume.education.map((e) =>
              e.id === id ? { ...e, ...edu } : e
            ),
          },
        })),

      removeEducation: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: state.resume.education.filter((e) => e.id !== id),
          },
        })),

      addSkill: (skill) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: [...state.resume.skills, skill],
          },
        })),

      removeSkill: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: state.resume.skills.filter((s) => s.id !== id),
          },
        })),

      setJobDescription: (text) => set({ jobDescription: text }),

      setMatchResult: (score, matched, missing) =>
        set({ matchScore: score, matchedKeywords: matched, missingKeywords: missing }),

      updateBullet: (expId, bulletIndex, text) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experiences: state.resume.experiences.map((e) =>
              e.id === expId
                ? {
                    ...e,
                    bullets: e.bullets.map((b, i) =>
                      i === bulletIndex ? text : b
                    ),
                  }
                : e
            ),
          },
        })),

      addBullet: (expId) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experiences: state.resume.experiences.map((e) =>
              e.id === expId ? { ...e, bullets: [...e.bullets, ''] } : e
            ),
          },
        })),

      removeBullet: (expId, bulletIndex) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experiences: state.resume.experiences.map((e) =>
              e.id === expId
                ? { ...e, bullets: e.bullets.filter((_, i) => i !== bulletIndex) }
                : e
            ),
          },
        })),

      importLinkedInData: (data) =>
        set((state) => ({
          resume: {
            ...state.resume,
            ...data,
            personalInfo: {
              ...state.resume.personalInfo,
              ...(data.personalInfo || {}),
            },
          },
        })),

      resetResume: () =>
        set({
          resume: emptyResume,
          jobDescription: '',
          matchScore: null,
          matchedKeywords: [],
          missingKeywords: [],
        }),

      fillSampleData: () =>
        set({
          resume: sampleResume,
          jobDescription: '',
          matchScore: null,
          matchedKeywords: [],
          missingKeywords: [],
        }),
    }),
    {
      name: 'curriculo-ai-resume',
    }
  )
)
