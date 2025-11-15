import { ComponentMeta, ComponentType, ComponentCategory, ComponentRegistry as IComponentRegistry } from '@/types/template-builder';

/**
 * Component Registry - Central registry for all drag-and-drop components
 * 
 * Manages:
 * - Component registration and retrieval
 * - Search and filtering
 * - Validation
 */
class ComponentRegistryImpl implements IComponentRegistry {
  components: Map<string, ComponentMeta>;

  constructor() {
    this.components = new Map();
  }

  /**
   * Register a new component
   */
  register(meta: ComponentMeta): void {
    if (this.components.has(meta.id)) {
      console.warn(`Component ${meta.id} is already registered. Overwriting.`);
    }

    // Validate metadata
    this.validateMetadata(meta);

    this.components.set(meta.id, meta);
  }

  /**
   * Unregister a component
   */
  unregister(componentId: string): void {
    this.components.delete(componentId);
  }

  /**
   * Get a specific component by ID
   */
  get(componentId: string): ComponentMeta | undefined {
    return this.components.get(componentId);
  }

  /**
   * Get all registered components
   */
  getAll(): ComponentMeta[] {
    return Array.from(this.components.values());
  }

  /**
   * Get components by type (atom, molecule, organism)
   */
  getByType(type: ComponentType): ComponentMeta[] {
    return this.getAll().filter(meta => meta.type === type);
  }

  /**
   * Get components by category
   */
  getByCategory(category: ComponentCategory): ComponentMeta[] {
    return this.getAll().filter(meta => meta.category === category);
  }

  /**
   * Search components by name, description, or tags
   */
  search(query: string): ComponentMeta[] {
    const lowerQuery = query.toLowerCase();
    
    return this.getAll().filter(meta => {
      const matchesName = meta.name.toLowerCase().includes(lowerQuery);
      const matchesDescription = meta.description.toLowerCase().includes(lowerQuery);
      const matchesTags = meta.tags?.some(tag => tag.toLowerCase().includes(lowerQuery));
      const matchesCategory = meta.category.toLowerCase().includes(lowerQuery);

      return matchesName || matchesDescription || matchesTags || matchesCategory;
    });
  }

  /**
   * Validate component metadata
   */
  private validateMetadata(meta: ComponentMeta): void {
    if (!meta.id) {
      throw new Error('Component must have an id');
    }

    if (!meta.name) {
      throw new Error(`Component ${meta.id} must have a name`);
    }

    if (!meta.component) {
      throw new Error(`Component ${meta.id} must have a component implementation`);
    }

    // Validate props
    meta.props.forEach(prop => {
      if (!prop.name) {
        throw new Error(`Component ${meta.id} has a prop without a name`);
      }
      if (!prop.type) {
        throw new Error(`Component ${meta.id} prop ${prop.name} must have a type`);
      }
    });

    // Validate data bindings
    meta.dataBindings.forEach(binding => {
      if (!binding.key) {
        throw new Error(`Component ${meta.id} has a data binding without a key`);
      }
      if (!binding.type) {
        throw new Error(`Component ${meta.id} data binding ${binding.key} must have a type`);
      }
    });
  }

  /**
   * Check if a component can be a child of another
   */
  canBeChildOf(childId: string, parentId: string): boolean {
    const childMeta = this.get(childId);
    const parentMeta = this.get(parentId);

    if (!childMeta || !parentMeta) {
      return false;
    }

    // Check if child has allowed parents restriction
    if (childMeta.constraints?.allowedParents) {
      return childMeta.constraints.allowedParents.includes(parentId);
    }

    // Check if parent has allowed children restriction
    if (parentMeta.constraints?.allowedChildren) {
      return parentMeta.constraints.allowedChildren.includes(childId);
    }

    return true;
  }

  /**
   * Get component count by category
   */
  getStats(): Record<ComponentCategory, number> {
    const stats: Record<string, number> = {};

    this.getAll().forEach(meta => {
      stats[meta.category] = (stats[meta.category] || 0) + 1;
    });

    return stats as Record<ComponentCategory, number>;
  }

  /**
   * Export registry as JSON (for debugging)
   */
  export(): string {
    const data = this.getAll().map(meta => ({
      id: meta.id,
      name: meta.name,
      type: meta.type,
      category: meta.category,
      propsCount: meta.props.length,
      dataBindingsCount: meta.dataBindings.length
    }));

    return JSON.stringify(data, null, 2);
  }
}

// Singleton instance
export const componentRegistry = new ComponentRegistryImpl();

/**
 * Utility function to batch register components
 */
export function registerComponents(components: ComponentMeta[]): void {
  components.forEach(component => {
    componentRegistry.register(component);
  });
}

/**
 * HOC to create a component with metadata
 */
export function createComponent<P = any>(
  meta: Omit<ComponentMeta, 'component'>,
  Component: React.ComponentType<P>
): ComponentMeta {
  return {
    ...meta,
    component: Component as React.ComponentType<any>
  };
}

/**
 * Get all categories with component counts
 */
export function getCategoriesWithCounts(): Array<{ category: ComponentCategory; count: number }> {
  const stats = componentRegistry.getStats();
  
  return Object.entries(stats).map(([category, count]) => ({
    category: category as ComponentCategory,
    count
  }));
}

/**
 * Get grouped components by category
 */
export function getGroupedComponents(): Record<ComponentCategory, ComponentMeta[]> {
  const grouped: Partial<Record<ComponentCategory, ComponentMeta[]>> = {};
  
  componentRegistry.getAll().forEach(meta => {
    if (!grouped[meta.category]) {
      grouped[meta.category] = [];
    }
    grouped[meta.category]!.push(meta);
  });

  return grouped as Record<ComponentCategory, ComponentMeta[]>;
}

/**
 * Get grouped components by type
 */
export function getGroupedByType(): Record<ComponentType, ComponentMeta[]> {
  return {
    atom: componentRegistry.getByType('atom'),
    molecule: componentRegistry.getByType('molecule'),
    organism: componentRegistry.getByType('organism')
  };
}


