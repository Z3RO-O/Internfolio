'use client';
import React from 'react';
import { FormData } from '@/types';
import { TemplateRenderer } from '@/utils/templateRenderer';
import TemplateSwitcher from '@/components/template/TemplateSwitcher';
import { DEFAULT_TEMPLATE } from '@/config/templates';

interface PublicPortfolioViewProps {
  data: FormData;
  templateId?: string;
}

export default function PublicPortfolioView({ data, templateId }: PublicPortfolioViewProps) {
  const currentTemplate = templateId || DEFAULT_TEMPLATE;

  return (
    <>
      {/* Template Switcher */}
      <TemplateSwitcher currentTemplate={currentTemplate} />

      {/* Render selected template */}
      <TemplateRenderer templateId={currentTemplate} data={data} />
    </>
  );
}
