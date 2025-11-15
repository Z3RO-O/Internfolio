export const TEMPLATES = {
  default: {
    id: 'default',
    name: 'Classic Professional',
    description: 'Clean, traditional layout ideal for formal presentations',
    preview: '/template-previews/default.png'
  },
  modern: {
    id: 'modern',
    name: 'Modern Minimal',
    description: 'Contemporary design with bold typography and spacious layout',
    preview: '/template-previews/modern.png'
  }
} as const;

export type TemplateId = keyof typeof TEMPLATES;
export const DEFAULT_TEMPLATE: TemplateId = 'default';

export function isValidTemplate(templateId: string): templateId is TemplateId {
  return templateId in TEMPLATES;
}

export function getTemplate(templateId: string) {
  return isValidTemplate(templateId) ? TEMPLATES[templateId] : TEMPLATES[DEFAULT_TEMPLATE];
}

export function getAllTemplates() {
  return Object.values(TEMPLATES);
}
