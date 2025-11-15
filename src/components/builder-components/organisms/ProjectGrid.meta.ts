import { Grid3x3 } from 'lucide-react';
import { ComponentMeta } from '@/types/template-builder';
import ProjectGrid from './ProjectGrid';

export const ProjectGridMeta: ComponentMeta = {
  id: 'project-grid',
  type: 'organism',
  name: 'Project Grid',
  description: 'Grid layout displaying multiple projects',
  category: 'Projects',
  icon: Grid3x3,
  component: ProjectGrid,
  
  props: [
    {
      name: 'title',
      label: 'Section Title',
      type: 'text',
      defaultValue: 'Projects',
      group: 'Content'
    },
    {
      name: 'columns',
      label: 'Columns',
      type: 'select',
      options: [
        { label: '1 Column', value: '1' },
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' }
      ],
      defaultValue: '2',
      group: 'Layout'
    },
    {
      name: 'gap',
      label: 'Gap Between Cards',
      type: 'select',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' }
      ],
      defaultValue: 'md',
      group: 'Layout'
    },
    {
      name: 'cardStyle',
      label: 'Card Style',
      type: 'select',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Bordered', value: 'bordered' },
        { label: 'Elevated (Shadow)', value: 'elevated' },
        { label: 'Flat (No Background)', value: 'flat' }
      ],
      defaultValue: 'elevated',
      group: 'Style'
    },
    {
      name: 'showTechnologies',
      label: 'Show Technologies',
      type: 'toggle',
      defaultValue: true,
      group: 'Content'
    },
    {
      name: 'showOutcome',
      label: 'Show Outcome',
      type: 'toggle',
      defaultValue: true,
      group: 'Content'
    },
    {
      name: 'showPRs',
      label: 'Show Pull Requests',
      type: 'toggle',
      defaultValue: false,
      group: 'Content'
    }
  ],

  defaultProps: {
    title: 'Projects',
    columns: '2',
    gap: 'md',
    cardStyle: 'elevated',
    showTechnologies: true,
    showOutcome: true,
    showPRs: false
  },

  dataBindings: [
    {
      key: 'projects',
      label: 'Projects Array',
      type: 'array',
      schema: 'Project[]',
      required: true,
      description: 'Bind to FormData.projects to display all projects'
    }
  ],

  preview: '/component-previews/project-grid.png',
  tags: ['projects', 'grid', 'portfolio', 'layout']
};


