export type ExperienceItem = {
  id: string;
  title: {
    tr: string;
    en: string;
  };
  company: {
    tr: string;
    en: string;
  };
  location: {
    tr: string;
    en: string;
  };
  period: {
    tr: string;
    en: string;
  };
  description: {
    tr: string;
    en: string;
  };
};

export type EducationItem = {
  id: string;
  degree: {
    tr: string;
    en: string;
  };
  institution: {
    tr: string;
    en: string;
  };
  location: {
    tr: string;
    en: string;
  };
  period: {
    tr: string;
    en: string;
  };
  description: {
    tr: string;
    en: string;
  };
};

export type SkillCategory = {
  id: string;
  category: {
    tr: string;
    en: string;
  };
  items: string[]; // Language-independent items like software names
};

export type ResumeData = {
  summary: {
    tr: string;
    en: string;
  };
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  cvUrl?: {
    tr?: string;
    en?: string;
  };
};
