import type { ParsedResumeContent } from '@sk-job-pilot/shared';

export interface DeterministicParseResult {
  parsedContent: ParsedResumeContent;
  confidence: number;
  warnings: string[];
}

export function parseResumeText(rawText: string): DeterministicParseResult {
  const warnings: string[] = [];
  if (!rawText || rawText.trim().length === 0) {
    return {
      parsedContent: {},
      confidence: 0,
      warnings: ['Raw text is empty'],
    };
  }

  // 1. Contact Info Extraction via Regex
  const emailMatch = rawText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
  const phoneMatch = rawText.match(/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const urlMatches = rawText.match(/https?:\/\/[^\s]+/gi) || [];

  const contactInfo = {
    email: emailMatch ? emailMatch[0] : undefined,
    phone: phoneMatch ? phoneMatch[0] : undefined,
    urls: Array.from(new Set(urlMatches)),
  };

  // 2. Section Headings Split
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const skills: string[] = [];
  const experience: Array<{
    company?: string;
    title?: string;
    dates?: string;
    bullets?: string[];
  }> = [];
  const education: Array<{ institution?: string; degree?: string; year?: string }> = [];
  const projects: Array<{ name?: string; description?: string }> = [];
  const certifications: string[] = [];
  let summary = '';

  let currentSection = 'summary';

  const knownSkills = [
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'Express',
    'Python',
    'Java',
    'C++',
    'C#',
    'Go',
    'Rust',
    'HTML',
    'CSS',
    'Tailwind',
    'SQL',
    'MongoDB',
    'PostgreSQL',
    'Redis',
    'Docker',
    'Kubernetes',
    'AWS',
    'GCP',
    'Azure',
    'Git',
    'GraphQL',
    'REST',
    'Linux',
  ];

  // Detect skills present anywhere in rawText
  knownSkills.forEach((skill) => {
    const reg = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (reg.test(rawText) && !skills.includes(skill)) {
      skills.push(skill);
    }
  });

  lines.forEach((line) => {
    const lower = line.toLowerCase();
    if (/^(summary|professional summary|about me|profile)$/i.test(lower)) {
      currentSection = 'summary';
      return;
    }
    if (/^(experience|work experience|employment history|work history)$/i.test(lower)) {
      currentSection = 'experience';
      return;
    }
    if (/^(education|academic background|qualifications)$/i.test(lower)) {
      currentSection = 'education';
      return;
    }
    if (/^(projects|personal projects|key projects)$/i.test(lower)) {
      currentSection = 'projects';
      return;
    }
    if (/^(skills|technical skills|core competencies)$/i.test(lower)) {
      currentSection = 'skills';
      return;
    }
    if (/^(certifications|certificates|licenses)$/i.test(lower)) {
      currentSection = 'certifications';
      return;
    }

    if (currentSection === 'summary' && !summary && line.length > 20) {
      summary = line;
    } else if (currentSection === 'certifications') {
      certifications.push(line);
    }
  });

  let confidence = 50;
  if (contactInfo.email) confidence += 20;
  if (contactInfo.phone) confidence += 10;
  if (skills.length > 0) confidence += 10;

  if (!contactInfo.email) {
    warnings.push('No email address detected in text');
  }

  return {
    parsedContent: {
      summary,
      skills,
      experience,
      education,
      projects,
      certifications,
      contactInfo,
    },
    confidence: Math.min(confidence, 100),
    warnings,
  };
}
