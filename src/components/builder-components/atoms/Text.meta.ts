import { Type } from 'lucide-react';
import { ComponentMeta } from '@/types/template-builder';
import Text from './Text';

export const TextMeta: ComponentMeta = {
  id: 'text',
  type: 'atom',
  name: 'Text',
  description: 'Customizable text element with typography controls',
  category: 'Typography',
  icon: Type,
  component: Text,
  
  props: [
    {
      name: 'content',
      label: 'Text Content',
      type: 'textarea',
      defaultValue: 'Enter text here',
      group: 'Content'
    },
    {
      name: 'variant',
      label: 'Element Type',
      type: 'select',
      options: [
        { label: 'Heading 1', value: 'h1' },
        { label: 'Heading 2', value: 'h2' },
        { label: 'Heading 3', value: 'h3' },
        { label: 'Heading 4', value: 'h4' },
        { label: 'Heading 5', value: 'h5' },
        { label: 'Heading 6', value: 'h6' },
        { label: 'Paragraph', value: 'p' },
        { label: 'Span', value: 'span' },
        { label: 'Label', value: 'label' }
      ],
      defaultValue: 'p',
      group: 'Style'
    },
    {
      name: 'size',
      label: 'Font Size',
      type: 'select',
      options: [
        { label: 'Extra Small', value: 'xs' },
        { label: 'Small', value: 'sm' },
        { label: 'Base', value: 'base' },
        { label: 'Large', value: 'lg' },
        { label: 'Extra Large', value: 'xl' },
        { label: '2XL', value: '2xl' },
        { label: '3XL', value: '3xl' },
        { label: '4XL', value: '4xl' },
        { label: '5XL', value: '5xl' }
      ],
      defaultValue: 'base',
      group: 'Style'
    },
    {
      name: 'weight',
      label: 'Font Weight',
      type: 'select',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Normal', value: 'normal' },
        { label: 'Medium', value: 'medium' },
        { label: 'Semibold', value: 'semibold' },
        { label: 'Bold', value: 'bold' },
        { label: 'Extra Bold', value: 'extrabold' },
        { label: 'Black', value: 'black' }
      ],
      defaultValue: 'normal',
      group: 'Style'
    },
    {
      name: 'align',
      label: 'Text Alignment',
      type: 'select',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
        { label: 'Justify', value: 'justify' }
      ],
      defaultValue: 'left',
      group: 'Layout'
    },
    {
      name: 'color',
      label: 'Text Color',
      type: 'color',
      defaultValue: '',
      group: 'Style'
    }
  ],

  defaultProps: {
    content: 'Enter text here',
    variant: 'p',
    size: 'base',
    weight: 'normal',
    align: 'left'
  },

  dataBindings: [
    {
      key: 'content',
      label: 'Text Content',
      type: 'string',
      description: 'Bind to any string field from FormData'
    }
  ],

  preview: '/component-previews/text.png',
  tags: ['text', 'typography', 'heading', 'paragraph']
};


