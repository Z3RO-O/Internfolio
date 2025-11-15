'use client';
import React, { useState } from 'react';
import { TEMPLATES, TemplateId, DEFAULT_TEMPLATE } from '@/config/templates';
import { FormData } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Eye } from 'lucide-react';
import TemplatePreviewModal from './TemplatePreviewModal';

interface TemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (templateId: TemplateId) => void;
  formData: FormData;
}

export default function TemplateSelector({
  open,
  onOpenChange,
  onSelectTemplate,
  formData
}: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(DEFAULT_TEMPLATE);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateId | null>(null);

  const handlePublish = () => {
    onSelectTemplate(selectedTemplate);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Choose Your Template</DialogTitle>
            <DialogDescription>
              Select a template style for your portfolio. You can change it later.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {Object.values(TEMPLATES).map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedTemplate === template.id
                    ? 'ring-2 ring-blue-600 border-blue-600'
                    : 'hover:border-gray-400'
                }`}
                onClick={() => setSelectedTemplate(template.id as TemplateId)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{template.name}</CardTitle>
                    {selectedTemplate === template.id && (
                      <Badge className="bg-blue-600">
                        <Check className="h-3 w-3 mr-1" />
                        Selected
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {/* Template preview image */}
                    <img
                      src={template.preview}
                      alt={`${template.name} preview`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image doesn't exist
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.innerHTML = `
                            <div class="text-gray-400 text-center p-4">
                              <div class="text-4xl font-bold mb-2">${template.name[0]}</div>
                              <div class="text-sm">${template.name}</div>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplate(template.id as TemplateId);
                    }}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handlePublish} className="bg-blue-600 hover:bg-blue-700">
              Publish with {TEMPLATES[selectedTemplate].name}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {previewTemplate && (
        <TemplatePreviewModal
          open={previewTemplate !== null}
          onOpenChange={(open) => !open && setPreviewTemplate(null)}
          templateId={previewTemplate}
          formData={formData}
        />
      )}
    </>
  );
}

