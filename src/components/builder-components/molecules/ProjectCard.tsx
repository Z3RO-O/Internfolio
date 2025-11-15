'use client';

import React from 'react';
import { Project } from '@/types';
import { cn } from '@/lib/utils';

export interface ProjectCardProps {
  project?: Project;
  layout?: 'vertical' | 'horizontal';
  showTechnologies?: boolean;
  showOutcome?: boolean;
  showPRs?: boolean;
  cardStyle?: 'default' | 'bordered' | 'elevated' | 'flat';
  className?: string;
  style?: React.CSSProperties;
}

export default function ProjectCard({
  project,
  layout = 'vertical',
  showTechnologies = true,
  showOutcome = true,
  showPRs = false,
  cardStyle = 'elevated',
  className,
  style,
  ...props
}: ProjectCardProps) {
  if (!project) {
    return (
      <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-400 text-center">No project data</p>
      </div>
    );
  }

  const cardClasses = cn(
    'rounded-lg p-6 transition-all',
    {
      'bg-white': cardStyle !== 'flat',
      'border border-gray-200': cardStyle === 'bordered',
      'shadow-md hover:shadow-lg': cardStyle === 'elevated',
      'bg-transparent border-none': cardStyle === 'flat'
    },
    {
      'flex gap-6': layout === 'horizontal',
      'flex-col': layout === 'vertical'
    },
    className
  );

  return (
    <div className={cardClasses} style={style} {...props}>
      <div className="flex-1">
        <h3 className="text-2xl font-bold mb-2 text-gray-900">{project.title}</h3>
        
        {project.role && (
          <p className="text-sm text-blue-600 font-medium mb-3">{project.role}</p>
        )}
        
        <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>

        {showTechnologies && project.technologies && project.technologies.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {showOutcome && project.outcome && (
          <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <h4 className="text-sm font-semibold text-green-900 mb-1">Outcome</h4>
            <p className="text-sm text-green-800">{project.outcome}</p>
          </div>
        )}

        {showPRs && project.pullRequests && project.pullRequests.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Pull Requests ({project.pullRequests.length})
            </h4>
            <div className="space-y-2">
              {project.pullRequests.slice(0, 3).map((pr, idx) => (
                <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800 truncate">{pr.title}</span>
                    <span
                      className={cn('px-2 py-0.5 rounded text-xs font-medium', {
                        'bg-purple-100 text-purple-800': pr.status === 'Merged',
                        'bg-green-100 text-green-800': pr.status === 'Open',
                        'bg-gray-100 text-gray-800': pr.status === 'Draft',
                        'bg-red-100 text-red-800': pr.status === 'Closed'
                      })}>
                      {pr.status}
                    </span>
                  </div>
                </div>
              ))}
              {project.pullRequests.length > 3 && (
                <p className="text-xs text-gray-500 text-center">
                  +{project.pullRequests.length - 3} more
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


