export const brandColors = {
  primary: '#0b9060',
  primaryLight: '#d3f8e6',
  accent: '#f99b07',
  text: '#0f172a',
  textMuted: '#64748b',
  border: '#e2e8f0',
  bg: '#ffffff',
  bgMuted: '#f8fafc',
} as const;

export const fonts = {
  heading: { size: 20, font: 'helvetica' as const, style: 'bold' as const },
  subheading: { size: 14, font: 'helvetica' as const, style: 'bold' as const },
  body: { size: 11, font: 'helvetica' as const, style: 'normal' as const },
  small: { size: 9, font: 'helvetica' as const, style: 'normal' as const },
  label: { size: 10, font: 'helvetica' as const, style: 'bold' as const },
} as const;

export const spacing = {
  pageMargin: 50,
  sectionGap: 16,
  lineGap: 6,
  paragraphGap: 10,
} as const;

export const page = {
  width: 595.28,
  height: 841.89,
} as const;
