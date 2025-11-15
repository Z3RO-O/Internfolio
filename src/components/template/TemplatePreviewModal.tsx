'use client';
import React from 'react';
import { TemplateId } from '@/config/templates';
import { FormData } from '@/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { TemplateRenderer } from '@/utils/templateRenderer';
import { X } from 'lucide-react';

interface TemplatePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateId: TemplateId;
  formData: FormData;
}

export default function TemplatePreviewModal({
  open,
  onOpenChange,
  templateId,
  formData
}: TemplatePreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] p-0 overflow-hidden">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-50 rounded-full bg-white shadow-lg p-2 hover:bg-gray-100 transition-colors">
          <X className="h-5 w-5" />
        </button>
        <div className="w-full h-full overflow-auto">
          <TemplateRenderer templateId={templateId} data={formData} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

