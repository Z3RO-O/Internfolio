'use client';

import React from 'react';
import { Project } from '@/types';
import ProjectCard from '../molecules/ProjectCard';
import { cn } from '@/lib/utils';

export interface ProjectGridProps {
  projects?: Project[];
  title?: string;
  columns?: '1' | '2' | '3';
  gap?: 'sm' | 'md' | 'lg';
  showTechnologies?: boolean;
  showOutcome?: boolean;
  showPRs?: boolean;
  cardStyle?: 'default' | 'bordered' | 'elevated' | 'flat';
  className?: string;
  style?: React.CSSProperties;
}

export default function ProjectGrid({
  projects = [],
  title = 'Projects',
  columns = '2',
  gap = 'md',
  showTechnologies = true,
  showOutcome = true,
  showPRs = false,
  cardStyle = 'elevated',
  className,
  style,
  ...props
}: ProjectGridProps) {
  if (!projects || projects.length === 0) {
    return (
      <div className="p-12 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-400 text-center text-lg">No projects to display</p>
      </div>
    );
  }

  const gridClasses = cn(
    'grid',
    {
      'grid-cols-1': columns === '1',
      'grid-cols-1 md:grid-cols-2': columns === '2',
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': columns === '3'
    },
    {
      'gap-4': gap === 'sm',
      'gap-6': gap === 'md',
      'gap-8': gap === 'lg'
    },
    className
  );

  return (
    <section style={style} {...props}>
      {title && (
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">{title}</h2>
      )}
      
      <div className={gridClasses}>
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            project={project}
            showTechnologies={showTechnologies}
            showOutcome={showOutcome}
            showPRs={showPRs}
            cardStyle={cardStyle}
          />
        ))}
      </div>
    </section>
  );
}


