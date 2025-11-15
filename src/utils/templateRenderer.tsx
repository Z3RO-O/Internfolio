import React from 'react';
import { FormData } from '@/types';
import { TemplateId, DEFAULT_TEMPLATE, isValidTemplate } from '@/config/templates';

// Template components will be imported here
import DefaultTemplate from '@/templates/DefaultTemplate';
import ModernTemplate from '@/templates/ModernTemplate';

const TEMPLATE_COMPONENTS: Record<TemplateId, React.ComponentType<{ data: FormData }>> = {
  default: DefaultTemplate,
  modern: ModernTemplate
};

interface TemplateRendererProps {
  templateId: string;
  data: FormData;
}

export function TemplateRenderer({ templateId, data }: TemplateRendererProps) {
  // Validate and get the template ID, fallback to default if invalid
  const validTemplateId = isValidTemplate(templateId) ? templateId : DEFAULT_TEMPLATE;

  const TemplateComponent = TEMPLATE_COMPONENTS[validTemplateId];

  return <TemplateComponent data={data} />;
}

export function getTemplateComponent(templateId: string) {
  const validTemplateId = isValidTemplate(templateId) ? templateId : DEFAULT_TEMPLATE;
  return TEMPLATE_COMPONENTS[validTemplateId];
}

