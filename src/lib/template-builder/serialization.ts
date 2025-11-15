import {
  CustomTemplate,
  ComponentNode,
  ThemeConfig,
  ValidationResult,
  ValidationError
} from '@/types/template-builder';
import { componentRegistry } from './registry';
import { v4 as uuidv4 } from 'uuid';

/**
 * Template Serialization & Validation
 * 
 * Handles:
 * - Template import/export
 * - JSON serialization
 * - Validation
 * - Migration between versions
 */

/**
 * Export template to JSON string
 */
export function serializeTemplate(template: CustomTemplate): string {
  // Clean up any non-serializable data
  const cleaned = {
    ...template,
    structure: cleanComponentTree(template.structure)
  };

  return JSON.stringify(cleaned, null, 2);
}

/**
 * Import template from JSON string
 */
export function deserializeTemplate(json: string): CustomTemplate {
  try {
    const template = JSON.parse(json) as CustomTemplate;
    
    // Validate structure
    const validation = validateTemplate(template);
    if (!validation.valid) {
      throw new Error(`Invalid template: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    return template;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to deserialize template: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Clean component tree for serialization
 * Removes any React elements or functions
 */
function cleanComponentTree(nodes: ComponentNode[]): ComponentNode[] {
  return nodes.map(node => ({
    ...node,
    children: cleanComponentTree(node.children),
    // Remove any non-serializable props
    props: Object.entries(node.props).reduce((acc, [key, value]) => {
      if (typeof value !== 'function' && !React.isValidElement(value)) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>)
  }));
}

/**
 * Validate template structure
 */
export function validateTemplate(template: CustomTemplate): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Validate basic fields
  if (!template.id) {
    errors.push({
      message: 'Template must have an ID',
      severity: 'error'
    });
  }

  if (!template.name || template.name.trim() === '') {
    errors.push({
      message: 'Template must have a name',
      severity: 'error'
    });
  }

  if (!template.structure || !Array.isArray(template.structure)) {
    errors.push({
      message: 'Template must have a structure array',
      severity: 'error'
    });
    return { valid: false, errors, warnings };
  }

  // Validate component tree
  validateComponentTree(template.structure, errors, warnings);

  // Validate theme
  if (!template.theme) {
    warnings.push({
      message: 'Template is missing theme configuration',
      severity: 'warning'
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate component tree recursively
 */
function validateComponentTree(
  nodes: ComponentNode[],
  errors: ValidationError[],
  warnings: ValidationError[],
  depth: number = 0
): void {
  const MAX_DEPTH = 20;

  if (depth > MAX_DEPTH) {
    errors.push({
      message: `Component tree exceeds maximum depth of ${MAX_DEPTH}`,
      severity: 'error'
    });
    return;
  }

  const nodeIds = new Set<string>();

  for (const node of nodes) {
    // Check for duplicate IDs
    if (nodeIds.has(node.id)) {
      errors.push({
        nodeId: node.id,
        message: `Duplicate node ID: ${node.id}`,
        severity: 'error'
      });
    }
    nodeIds.add(node.id);

    // Validate node structure
    if (!node.id) {
      errors.push({
        componentId: node.componentId,
        message: 'Component node must have an ID',
        severity: 'error'
      });
    }

    if (!node.componentId) {
      errors.push({
        nodeId: node.id,
        message: 'Component node must have a componentId',
        severity: 'error'
      });
      continue;
    }

    // Check if component exists in registry
    const meta = componentRegistry.get(node.componentId);
    if (!meta) {
      warnings.push({
        nodeId: node.id,
        componentId: node.componentId,
        message: `Component ${node.componentId} not found in registry`,
        severity: 'warning'
      });
      continue;
    }

    // Validate required props
    const requiredProps = meta.props.filter(p => p.validation?.required);
    for (const prop of requiredProps) {
      if (!(prop.name in node.props) && !(prop.name in node.dataMapping)) {
        warnings.push({
          nodeId: node.id,
          componentId: node.componentId,
          field: prop.name,
          message: `Missing required prop: ${prop.name}`,
          severity: 'warning'
        });
      }
    }

    // Validate constraints
    if (meta.constraints) {
      // Check nesting level
      if (meta.constraints.nestingLevel && depth > meta.constraints.nestingLevel) {
        warnings.push({
          nodeId: node.id,
          componentId: node.componentId,
          message: `Component ${meta.name} exceeds maximum nesting level`,
          severity: 'warning'
        });
      }

      // Check required children
      if (meta.constraints.requiredChildren) {
        const childComponentIds = node.children.map(c => c.componentId);
        const missingChildren = meta.constraints.requiredChildren.filter(
          id => !childComponentIds.includes(id)
        );
        
        if (missingChildren.length > 0) {
          warnings.push({
            nodeId: node.id,
            componentId: node.componentId,
            message: `Missing required children: ${missingChildren.join(', ')}`,
            severity: 'warning'
          });
        }
      }
    }

    // Recursively validate children
    if (node.children && node.children.length > 0) {
      validateComponentTree(node.children, errors, warnings, depth + 1);
    }
  }
}

/**
 * Create a new empty template
 */
export function createEmptyTemplate(
  authorId: string,
  author: string
): CustomTemplate {
  return {
    id: uuidv4(),
    name: 'Untitled Template',
    description: '',
    author,
    authorId,
    version: '1.0.0',
    thumbnail: '',
    tags: [],
    structure: [],
    theme: getDefaultTheme(),
    isPublic: false,
    isFeatured: false,
    usageCount: 0,
    likesCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Clone a template
 */
export function cloneTemplate(
  template: CustomTemplate,
  newAuthorId: string,
  newAuthor: string
): CustomTemplate {
  return {
    ...template,
    id: uuidv4(),
    name: `${template.name} (Copy)`,
    author: newAuthor,
    authorId: newAuthorId,
    isPublic: false,
    isFeatured: false,
    usageCount: 0,
    likesCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: undefined,
    // Deep clone structure to avoid reference issues
    structure: cloneComponentTree(template.structure),
    theme: JSON.parse(JSON.stringify(template.theme))
  };
}

/**
 * Deep clone component tree with new IDs
 */
function cloneComponentTree(nodes: ComponentNode[]): ComponentNode[] {
  return nodes.map(node => ({
    ...node,
    id: uuidv4(),
    children: cloneComponentTree(node.children)
  }));
}

/**
 * Create a new component node
 */
export function createComponentNode(
  componentId: string,
  parentId?: string
): ComponentNode {
  const meta = componentRegistry.get(componentId);
  
  if (!meta) {
    throw new Error(`Component ${componentId} not found in registry`);
  }

  return {
    id: uuidv4(),
    componentId,
    props: { ...meta.defaultProps },
    styles: {},
    dataMapping: {},
    children: []
  };
}

/**
 * Get default theme configuration
 */
export function getDefaultTheme(): ThemeConfig {
  return {
    colors: {
      primary: '#3B82F6',
      secondary: '#6366F1',
      accent: '#8B5CF6',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      error: '#EF4444',
      success: '#10B981',
      warning: '#F59E0B',
      info: '#3B82F6'
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontFamilyHeading: 'Inter, system-ui, sans-serif',
      baseFontSize: '16px',
      lineHeight: 1.5,
      scale: 'major-third'
    },
    spacing: {
      unit: 4,
      scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64]
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      full: '9999px'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    },
    breakpoints: {
      mobile: '640px',
      tablet: '768px',
      desktop: '1024px',
      wide: '1280px'
    }
  };
}

/**
 * Migrate template to latest version
 */
export function migrateTemplate(template: any): CustomTemplate {
  // Future: Handle version migrations
  // For now, just ensure all required fields exist
  
  return {
    ...template,
    version: template.version || '1.0.0',
    theme: template.theme || getDefaultTheme(),
    tags: template.tags || [],
    isPublic: template.isPublic ?? false,
    isFeatured: template.isFeatured ?? false,
    usageCount: template.usageCount || 0,
    likesCount: template.likesCount || 0
  };
}

/**
 * Calculate template complexity score
 */
export function calculateComplexity(template: CustomTemplate): number {
  let score = 0;
  
  function countNodes(nodes: ComponentNode[]): number {
    return nodes.reduce((acc, node) => {
      return acc + 1 + countNodes(node.children);
    }, 0);
  }
  
  score = countNodes(template.structure);
  return score;
}

/**
 * Get template statistics
 */
export function getTemplateStats(template: CustomTemplate) {
  const stats = {
    totalComponents: 0,
    maxDepth: 0,
    componentTypes: {} as Record<string, number>,
    hasMissingComponents: false
  };

  function traverse(nodes: ComponentNode[], depth: number = 0) {
    stats.maxDepth = Math.max(stats.maxDepth, depth);

    for (const node of nodes) {
      stats.totalComponents++;
      
      const meta = componentRegistry.get(node.componentId);
      if (!meta) {
        stats.hasMissingComponents = true;
      } else {
        stats.componentTypes[meta.type] = (stats.componentTypes[meta.type] || 0) + 1;
      }

      if (node.children.length > 0) {
        traverse(node.children, depth + 1);
      }
    }
  }

  traverse(template.structure);

  return stats;
}


