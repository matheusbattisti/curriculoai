import type { ResumeData } from '@/types/resume'

export async function exportToPDF(resume: ResumeData): Promise<void> {
  const { Document, Page, Text, View, StyleSheet, Font, pdf } = await import(
    '@react-pdf/renderer'
  )

  Font.register({
    family: 'Arial',
    fonts: [
      {
        src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/arial@1.0.4/Arial.ttf',
        fontWeight: 'normal',
      },
      {
        src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/arial-bold@1.0.4/Arial Bold.ttf',
        fontWeight: 'bold',
      },
    ],
  })

  const isClassic = resume.template === 'classic'

  const styles = StyleSheet.create({
    page: {
      padding: isClassic ? 54 : 40, // 0.75in vs ~0.55in
      fontFamily: 'Arial',
      fontSize: isClassic ? 11 : 10.5,
      lineHeight: 1.4,
      color: '#1a1a1a',
    },
    header: {
      marginBottom: 16,
      borderBottomWidth: isClassic ? 0 : 1,
      borderBottomColor: '#d1d5db',
      paddingBottom: 12,
    },
    name: {
      fontSize: isClassic ? 18 : 20,
      fontWeight: 'bold',
      marginBottom: 4,
      textAlign: isClassic ? 'left' : 'left',
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      fontSize: 9.5,
      color: '#4b5563',
    },
    contactItem: {
      marginRight: 12,
    },
    sectionTitle: {
      fontSize: isClassic ? 13 : 12,
      fontWeight: 'bold',
      marginTop: 14,
      marginBottom: 6,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      borderBottomWidth: 1,
      borderBottomColor: isClassic ? '#000' : '#e5e7eb',
      paddingBottom: 3,
    },
    entryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2,
    },
    entryTitle: {
      fontWeight: 'bold',
      fontSize: isClassic ? 11.5 : 11,
    },
    entrySubtitle: {
      fontSize: 10,
      color: '#4b5563',
    },
    entryDate: {
      fontSize: 9.5,
      color: '#6b7280',
    },
    bullet: {
      flexDirection: 'row',
      marginBottom: 2,
      paddingLeft: 8,
    },
    bulletDot: {
      width: 12,
      fontSize: 10,
    },
    bulletText: {
      flex: 1,
      fontSize: isClassic ? 10.5 : 10,
    },
    summary: {
      fontSize: isClassic ? 10.5 : 10,
      marginBottom: 4,
      lineHeight: 1.5,
    },
    skillsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
    },
    skillItem: {
      fontSize: 10,
      marginRight: 8,
    },
    separator: {
      height: isClassic ? 0 : 1,
      backgroundColor: '#f3f4f6',
      marginVertical: 4,
    },
  })

  const ResumeDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{resume.personalInfo.fullName || 'Seu Nome'}</Text>
          <View style={styles.contactRow}>
            {resume.personalInfo.email && (
              <Text style={styles.contactItem}>{resume.personalInfo.email}</Text>
            )}
            {resume.personalInfo.phone && (
              <Text style={styles.contactItem}>{resume.personalInfo.phone}</Text>
            )}
            {resume.personalInfo.location && (
              <Text style={styles.contactItem}>{resume.personalInfo.location}</Text>
            )}
            {resume.personalInfo.linkedin && (
              <Text style={styles.contactItem}>{resume.personalInfo.linkedin}</Text>
            )}
            {resume.personalInfo.website && (
              <Text style={styles.contactItem}>{resume.personalInfo.website}</Text>
            )}
          </View>
        </View>

        {/* Summary */}
        {resume.summary && (
          <View>
            <Text style={styles.sectionTitle}>Resumo Profissional</Text>
            <Text style={styles.summary}>{resume.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {resume.experiences.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Experiência Profissional</Text>
            {resume.experiences.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 10 }}>
                <View style={styles.entryHeader}>
                  <View>
                    <Text style={styles.entryTitle}>{exp.position}</Text>
                    <Text style={styles.entrySubtitle}>{exp.company}</Text>
                  </View>
                  <Text style={styles.entryDate}>
                    {exp.startDate} — {exp.current ? 'Presente' : exp.endDate}
                  </Text>
                </View>
                {exp.bullets.map((bullet, idx) => (
                  <View key={idx} style={styles.bullet}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Educação</Text>
            {resume.education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 8 }}>
                <View style={styles.entryHeader}>
                  <View>
                    <Text style={styles.entryTitle}>
                      {edu.degree} em {edu.field}
                    </Text>
                    <Text style={styles.entrySubtitle}>{edu.institution}</Text>
                  </View>
                  <Text style={styles.entryDate}>
                    {edu.startDate} — {edu.endDate}
                  </Text>
                </View>
                {edu.description && (
                  <Text style={{ fontSize: 10, marginTop: 2 }}>{edu.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {resume.skills.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Habilidades</Text>
            <View style={styles.skillsRow}>
              {resume.skills.map((skill, idx) => (
                <Text key={skill.id} style={styles.skillItem}>
                  {skill.name}
                  {idx < resume.skills.length - 1 ? '  •' : ''}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  )

  const blob = await pdf(<ResumeDocument />).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${resume.personalInfo.fullName || 'curriculo'}_curriculo.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
