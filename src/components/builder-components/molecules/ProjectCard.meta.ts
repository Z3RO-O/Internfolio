import { FolderKanban } from 'lucide-react';
import { ComponentMeta } from '@/types/template-builder';
import ProjectCard from './ProjectCard';

export const ProjectCardMeta: ComponentMeta = {
  id: 'project-card',
  type: 'molecule',
  name: 'Project Card',
  description: 'Displays a single project with title, description, technologies, and outcome',
  category: 'Projects',
  icon: FolderKanban,
  component: ProjectCard,
  
  props: [
    {
      name: 'layout',
      label: 'Layout',
      type: 'select',
      options: [
        { label: 'Vertical', value: 'vertical' },
        { label: 'Horizontal', value: 'horizontal' }
      ],
      defaultValue: 'vertical',
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
    layout: 'vertical',
    cardStyle: 'elevated',
    showTechnologies: true,
    showOutcome: true,
    showPRs: false
  },

  dataBindings: [
    {
      key: 'project',
      label: 'Project Data',
      type: 'object',
      schema: 'Project',
      required: true,
      description: 'Bind to a project from FormData.projects array'
    }
  ],

  preview: '/component-previews/project-card.png',
  tags: ['project', 'card', 'portfolio', 'work']
};


