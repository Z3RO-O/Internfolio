import { Box } from 'lucide-react';
import { ComponentMeta } from '@/types/template-builder';
import Container from './Container';

export const ContainerMeta: ComponentMeta = {
  id: 'container',
  type: 'atom',
  name: 'Container',
  description: 'Flexible layout container with flex/grid support',
  category: 'Layout',
  icon: Box,
  component: Container,
  
  props: [
    {
      name: 'maxWidth',
      label: 'Max Width',
      type: 'select',
      options: [
        { label: 'Small (640px)', value: 'sm' },
        { label: 'Medium (768px)', value: 'md' },
        { label: 'Large (1024px)', value: 'lg' },
        { label: 'Extra Large (1280px)', value: 'xl' },
        { label: '2XL (1536px)', value: '2xl' },
        { label: 'Full Width', value: 'full' }
      ],
      defaultValue: 'xl',
      group: 'Layout'
    },
    {
      name: 'padding',
      label: 'Padding',
      type: 'select',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'Extra Large', value: 'xl' }
      ],
      defaultValue: 'md',
      group: 'Layout'
    },
    {
      name: 'layout',
      label: 'Layout Type',
      type: 'select',
      options: [
        { label: 'Block', value: 'block' },
        { label: 'Flexbox', value: 'flex' },
        { label: 'Grid', value: 'grid' }
      ],
      defaultValue: 'block',
      group: 'Layout'
    },
    {
      name: 'direction',
      label: 'Flex Direction',
      type: 'select',
      options: [
        { label: 'Row', value: 'row' },
        { label: 'Column', value: 'column' }
      ],
      defaultValue: 'row',
      group: 'Layout'
    },
    {
      name: 'justify',
      label: 'Justify Content',
      type: 'select',
      options: [
        { label: 'Start', value: 'start' },
        { label: 'Center', value: 'center' },
        { label: 'End', value: 'end' },
        { label: 'Space Between', value: 'between' },
        { label: 'Space Around', value: 'around' }
      ],
      defaultValue: 'start',
      group: 'Layout'
    },
    {
      name: 'align',
      label: 'Align Items',
      type: 'select',
      options: [
        { label: 'Start', value: 'start' },
        { label: 'Center', value: 'center' },
        { label: 'End', value: 'end' },
        { label: 'Stretch', value: 'stretch' }
      ],
      defaultValue: 'start',
      group: 'Layout'
    },
    {
      name: 'gap',
      label: 'Gap',
      type: 'select',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'Extra Large', value: 'xl' }
      ],
      defaultValue: 'md',
      group: 'Layout'
    },
    {
      name: 'gridCols',
      label: 'Grid Columns',
      type: 'select',
      options: [
        { label: '1 Column', value: '1' },
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
        { label: '5 Columns', value: '5' },
        { label: '6 Columns', value: '6' }
      ],
      defaultValue: '3',
      group: 'Layout'
    }
  ],

  defaultProps: {
    maxWidth: 'xl',
    padding: 'md',
    layout: 'block',
    direction: 'row',
    justify: 'start',
    align: 'start',
    gap: 'md',
    gridCols: '3'
  },

  dataBindings: [],

  constraints: {
    allowedChildren: [] // Can contain any children
  },

  preview: '/component-previews/container.png',
  tags: ['layout', 'container', 'flex', 'grid', 'wrapper']
};


