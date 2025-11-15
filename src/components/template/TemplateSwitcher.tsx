'use client';
import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { TEMPLATES, TemplateId, DEFAULT_TEMPLATE, isValidTemplate } from '@/config/templates';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

interface TemplateSwitcherProps {
  currentTemplate?: string;
}

export default function TemplateSwitcher({ currentTemplate }: TemplateSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = React.useState(false);

  const activeTemplate = isValidTemplate(currentTemplate || '')
    ? currentTemplate
    : DEFAULT_TEMPLATE;

  const handleTemplateChange = (templateId: TemplateId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('template', templateId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="bg-white shadow-lg hover:shadow-xl transition-all">
          <Palette className="h-4 w-4 mr-2" />
          {TEMPLATES[activeTemplate as TemplateId]?.name || 'Template'}
        </Button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />

            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-40">
              <div className="p-2">
                <div className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">
                  Choose Template
                </div>
                {Object.values(TEMPLATES).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateChange(template.id as TemplateId)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeTemplate === template.id
                        ? 'bg-blue-100 text-blue-900 font-semibold'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-xs text-gray-500">{template.description}</div>
                      </div>
                      {activeTemplate === template.id && (
                        <svg
                          className="h-4 w-4 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

