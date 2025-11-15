/**
 * Component Registry Initialization
 * 
 * This file imports and registers all available components
 * for the template builder system
 */

import { componentRegistry } from '../registry';

// Import all component metadata
import { TextMeta } from '@/components/builder-components/atoms/Text.meta';
import { ContainerMeta } from '@/components/builder-components/atoms/Container.meta';
import { ProjectCardMeta } from '@/components/builder-components/molecules/ProjectCard.meta';
import { ProjectGridMeta } from '@/components/builder-components/organisms/ProjectGrid.meta';

/**
 * Register all components
 */
export function initializeComponentRegistry() {
  // Atoms
  componentRegistry.register(TextMeta);
  componentRegistry.register(ContainerMeta);

  // Molecules
  componentRegistry.register(ProjectCardMeta);

  // Organisms
  componentRegistry.register(ProjectGridMeta);

  console.log(`✅ Registered ${componentRegistry.getAll().length} components`);
}

/**
 * Get all registered components grouped by type
 */
export function getComponentsByType() {
  return {
    atoms: componentRegistry.getByType('atom'),
    molecules: componentRegistry.getByType('molecule'),
    organisms: componentRegistry.getByType('organism')
  };
}

/**
 * Get all registered components grouped by category
 */
export function getComponentsByCategory() {
  const all = componentRegistry.getAll();
  const grouped: Record<string, any[]> = {};

  all.forEach(meta => {
    if (!grouped[meta.category]) {
      grouped[meta.category] = [];
    }
    grouped[meta.category].push(meta);
  });

  return grouped;
}

// Auto-initialize on import
initializeComponentRegistry();


