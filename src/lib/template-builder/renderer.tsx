'use client';

import React from 'react';
import { FormData } from '@/types';
import {
  ComponentNode,
  CustomTemplate,
  ThemeConfig,
  DataResolutionContext
} from '@/types/template-builder';
import { componentRegistry } from './registry';
import { resolveDataMappings, evaluateCondition, createDataContext } from './data-binding';

/**
 * Template Renderer
 * 
 * Dynamically renders a custom template by:
 * 1. Traversing the component tree
 * 2. Resolving data bindings
 * 3. Applying styles and props
 * 4. Rendering React components
 */

interface RendererProps {
  template: CustomTemplate;
  data: FormData;
  className?: string;
}

export function TemplateRenderer({ template, data, className }: RendererProps) {
  const context = createDataContext(data);

  return (
    <div
      className={className}
      style={getThemeStyles(template.theme)}
      data-template-id={template.id}>
      {template.structure.map(node => renderNode(node, context))}
    </div>
  );
}

/**
 * Render a single component node
 */
function renderNode(
  node: ComponentNode,
  context: DataResolutionContext
): React.ReactElement | null {
  // Check if component should be hidden
  if (node.hidden) {
    return null;
  }

  // Evaluate conditional rendering
  if (node.showIf) {
    const shouldShow = evaluateCondition(
      node.showIf.dataPath,
      node.showIf.condition,
      node.showIf.value,
      context
    );

    if (!shouldShow) {
      return null;
    }
  }

  // Get component metadata
  const meta = componentRegistry.get(node.componentId);
  if (!meta) {
    console.warn(`Component ${node.componentId} not found in registry`);
    return <div key={node.id} className="text-red-500">Component not found: {node.componentId}</div>;
  }

  // Get component implementation
  const Component = meta.component;

  // Resolve data bindings
  const boundData = resolveDataMappings(node.dataMapping, context);

  // Merge props: defaults → node props → bound data
  const finalProps = {
    ...meta.defaultProps,
    ...node.props,
    ...boundData,
    style: node.styles,
    'data-node-id': node.id,
    'data-component-id': node.componentId
  };

  // Render children
  const children = node.children.length > 0
    ? node.children.map(child => renderNode(child, context))
    : undefined;

  try {
    return (
      <Component key={node.id} {...finalProps}>
        {children}
      </Component>
    );
  } catch (error) {
    console.error(`Error rendering component ${node.componentId}:`, error);
    return (
      <div key={node.id} className="text-red-500 p-4 border border-red-300 rounded">
        Error rendering component: {node.componentId}
      </div>
    );
  }
}

/**
 * Convert theme config to CSS variables
 */
function getThemeStyles(theme: ThemeConfig): React.CSSProperties {
  return {
    // Colors
    '--color-primary': theme.colors.primary,
    '--color-secondary': theme.colors.secondary,
    '--color-accent': theme.colors.accent,
    '--color-background': theme.colors.background,
    '--color-surface': theme.colors.surface,
    '--color-text': theme.colors.text,
    '--color-text-secondary': theme.colors.textSecondary,
    '--color-border': theme.colors.border,
    '--color-error': theme.colors.error,
    '--color-success': theme.colors.success,
    '--color-warning': theme.colors.warning,
    '--color-info': theme.colors.info,

    // Typography
    '--font-family': theme.typography.fontFamily,
    '--font-family-heading': theme.typography.fontFamilyHeading || theme.typography.fontFamily,
    '--font-size-base': theme.typography.baseFontSize,
    '--line-height': theme.typography.lineHeight,

    // Spacing
    '--spacing-unit': `${theme.spacing.unit}px`,

    // Border Radius
    '--radius-sm': theme.borderRadius.sm,
    '--radius-md': theme.borderRadius.md,
    '--radius-lg': theme.borderRadius.lg,
    '--radius-xl': theme.borderRadius.xl,
    '--radius-full': theme.borderRadius.full,

    // Shadows
    '--shadow-sm': theme.shadows.sm,
    '--shadow-md': theme.shadows.md,
    '--shadow-lg': theme.shadows.lg,
    '--shadow-xl': theme.shadows.xl
  } as React.CSSProperties;
}

/**
 * Preview renderer (for template builder)
 * Shows placeholder when data is missing
 */
interface PreviewRendererProps {
  node: ComponentNode;
  data: FormData;
  isSelected?: boolean;
  onSelect?: (nodeId: string) => void;
  onHover?: (nodeId: string | null) => void;
}

export function PreviewRenderer({
  node,
  data,
  isSelected,
  onSelect,
  onHover
}: PreviewRendererProps) {
  const context = createDataContext(data);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(node.id);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    onHover?.(node.id);
  };

  const handleMouseLeave = () => {
    onHover?.(null);
  };

  const rendered = renderNode(node, context);

  if (!rendered) return null;

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        hover:ring-2 hover:ring-blue-300
        transition-all
      `}>
      {rendered}
      {isSelected && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl">
          {componentRegistry.get(node.componentId)?.name}
        </div>
      )}
    </div>
  );
}

/**
 * Render empty state when no data
 */
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
      <div className="text-center">
        <p className="text-gray-500 text-lg">{message}</p>
      </div>
    </div>
  );
}


