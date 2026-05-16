export const skillCategories = {
  'full-stack-web': {
    label: 'Full-Stack Web Development',
    skills: [
      'React',
      'Next.js',
      'Vue.js',
      'Angular',
      'Node.js',
      'Express',
      'TypeScript',
      'JavaScript',
      'HTML',
      'CSS',
      'Tailwind CSS',
      'PostgreSQL',
      'MongoDB',
      'GraphQL',
      'REST APIs',
    ],
  },
  'mobile-development': {
    label: 'Mobile App Development',
    skills: [
      'React Native',
      'Flutter',
      'Dart',
      'Swift',
      'Kotlin',
      'Firebase',
      'Mobile Money Integration',
    ],
  },
  'ui-ux-design': {
    label: 'UI/UX Design',
    skills: [
      'Figma',
      'Adobe XD',
      'User Research',
      'Wireframing',
      'Prototyping',
      'Design Systems',
      'Accessibility',
    ],
  },
  'data-analysis': {
    label: 'Data Analysis & Science',
    skills: [
      'Python',
      'SQL',
      'Pandas',
      'Tableau',
      'Power BI',
      'Machine Learning',
      'Data Visualization',
    ],
  },
  'graphic-design': {
    label: 'Graphic Design',
    skills: [
      'Adobe Illustrator',
      'Photoshop',
      'Brand Identity',
      'Typography',
      'Print Design',
      'Logo Design',
    ],
  },
} as const;

export type SkillCategory = keyof typeof skillCategories;
