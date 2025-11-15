import { create } from 'zustand';
import {
  CustomTemplate,
  ComponentNode,
  TemplateBuilderState,
  TemplateBuilderActions,
  CanvasMode,
  BuilderPanel,
  ThemeConfig
} from '@/types/template-builder';
import {
  createEmptyTemplate,
  createComponentNode,
  serializeTemplate,
  deserializeTemplate
} from '@/lib/template-builder/serialization';
import { v4 as uuidv4 } from 'uuid';

type TemplateBuilderStore = TemplateBuilderState & TemplateBuilderActions;

export const useTemplateBuilderStore = create<TemplateBuilderStore>((set, get) => ({
  // Initial state
  template: null,
  componentTree: [],
  canvasMode: 'desktop',
  selectedNodeId: null,
  hoveredNodeId: null,
  activePanel: 'components',
  showPreview: false,
  showGrid: true,
  snapToGrid: false,
  history: [[]],
  historyIndex: 0,
  clipboard: null,
  isDragging: false,
  draggingComponentId: null,
  dropTargetId: null,

  // Template management
  loadTemplate: (template: CustomTemplate) => {
    set({
      template,
      componentTree: template.structure,
      history: [template.structure],
      historyIndex: 0,
      selectedNodeId: null
    });
  },

  saveTemplate: async () => {
    const { template, componentTree } = get();
    if (!template) return;

    const updatedTemplate: CustomTemplate = {
      ...template,
      structure: componentTree,
      updatedAt: new Date().toISOString()
    };

    // TODO: Save to Supabase
    console.log('Saving template:', serializeTemplate(updatedTemplate));
    
    set({ template: updatedTemplate });
  },

  publishTemplate: async () => {
    const { template, componentTree } = get();
    if (!template) return;

    const updatedTemplate: CustomTemplate = {
      ...template,
      structure: componentTree,
      isPublic: true,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // TODO: Save to Supabase
    console.log('Publishing template:', serializeTemplate(updatedTemplate));
    
    set({ template: updatedTemplate });
  },

  resetTemplate: () => {
    set({
      template: null,
      componentTree: [],
      selectedNodeId: null,
      history: [[]],
      historyIndex: 0
    });
  },

  // Component manipulation
  addComponent: (componentId: string, parentId?: string, index?: number) => {
    const { componentTree } = get();
    const newNode = createComponentNode(componentId, parentId);

    let newTree: ComponentNode[];

    if (!parentId) {
      // Add to root level
      if (index !== undefined) {
        newTree = [
          ...componentTree.slice(0, index),
          newNode,
          ...componentTree.slice(index)
        ];
      } else {
        newTree = [...componentTree, newNode];
      }
    } else {
      // Add as child of parent
      newTree = addNodeToParent(componentTree, parentId, newNode, index);
    }

    set({
      componentTree: newTree,
      selectedNodeId: newNode.id
    });

    get().addToHistory();
  },

  removeComponent: (nodeId: string) => {
    const { componentTree } = get();
    const newTree = removeNodeById(componentTree, nodeId);

    set({
      componentTree: newTree,
      selectedNodeId: null
    });

    get().addToHistory();
  },

  duplicateComponent: (nodeId: string) => {
    const { componentTree } = get();
    const node = findNodeById(componentTree, nodeId);
    
    if (!node) return;

    // Clone node with new IDs
    const clonedNode = cloneNodeWithNewIds(node);
    
    // Add next to original
    const newTree = addNodeNextTo(componentTree, nodeId, clonedNode);

    set({
      componentTree: newTree,
      selectedNodeId: clonedNode.id
    });

    get().addToHistory();
  },

  moveComponent: (nodeId: string, newParentId: string, index: number) => {
    const { componentTree } = get();
    
    // Remove from current location
    const nodeToMove = findNodeById(componentTree, nodeId);
    if (!nodeToMove) return;

    let treeWithoutNode = removeNodeById(componentTree, nodeId);
    
    // Add to new location
    const newTree = addNodeToParent(treeWithoutNode, newParentId, nodeToMove, index);

    set({ componentTree: newTree });
    get().addToHistory();
  },

  updateComponentProps: (nodeId: string, props: Partial<Record<string, any>>) => {
    const { componentTree } = get();
    const newTree = updateNode(componentTree, nodeId, node => ({
      ...node,
      props: { ...node.props, ...props }
    }));

    set({ componentTree: newTree });
    get().addToHistory();
  },

  updateComponentStyles: (nodeId: string, styles: Partial<StyleConfig>) => {
    const { componentTree } = get();
    const newTree = updateNode(componentTree, nodeId, node => ({
      ...node,
      styles: { ...node.styles, ...styles }
    }));

    set({ componentTree: newTree });
    get().addToHistory();
  },

  updateDataMapping: (nodeId: string, mapping: Record<string, string>) => {
    const { componentTree } = get();
    const newTree = updateNode(componentTree, nodeId, node => ({
      ...node,
      dataMapping: { ...node.dataMapping, ...mapping }
    }));

    set({ componentTree: newTree });
    get().addToHistory();
  },

  // Selection
  selectNode: (nodeId: string | null) => {
    set({ selectedNodeId: nodeId });
  },

  hoverNode: (nodeId: string | null) => {
    set({ hoveredNodeId: nodeId });
  },

  // Canvas
  setCanvasMode: (mode: CanvasMode) => {
    set({ canvasMode: mode });
  },

  togglePreview: () => {
    set(state => ({ showPreview: !state.showPreview }));
  },

  toggleGrid: () => {
    set(state => ({ showGrid: !state.showGrid }));
  },

  toggleSnapToGrid: () => {
    set(state => ({ snapToGrid: !state.snapToGrid }));
  },

  // History (undo/redo)
  addToHistory: () => {
    const { componentTree, history, historyIndex } = get();
    
    // Remove any future history if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1);
    
    // Add current state
    newHistory.push(JSON.parse(JSON.stringify(componentTree)));
    
    // Limit history size to 50
    if (newHistory.length > 50) {
      newHistory.shift();
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        componentTree: JSON.parse(JSON.stringify(history[newIndex])),
        historyIndex: newIndex
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        componentTree: JSON.parse(JSON.stringify(history[newIndex])),
        historyIndex: newIndex
      });
    }
  },

  // Clipboard
  copyComponent: (nodeId: string) => {
    const { componentTree } = get();
    const node = findNodeById(componentTree, nodeId);
    
    if (node) {
      set({ clipboard: JSON.parse(JSON.stringify(node)) });
    }
  },

  pasteComponent: (parentId?: string) => {
    const { clipboard, componentTree } = get();
    
    if (!clipboard) return;

    // Clone with new IDs
    const clonedNode = cloneNodeWithNewIds(clipboard);

    let newTree: ComponentNode[];

    if (!parentId) {
      newTree = [...componentTree, clonedNode];
    } else {
      newTree = addNodeToParent(componentTree, parentId, clonedNode);
    }

    set({
      componentTree: newTree,
      selectedNodeId: clonedNode.id
    });

    get().addToHistory();
  },

  // Theme
  updateTheme: (theme: Partial<ThemeConfig>) => {
    const { template } = get();
    
    if (template) {
      set({
        template: {
          ...template,
          theme: { ...template.theme, ...theme }
        }
      });
    }
  },

  // UI
  setActivePanel: (panel: BuilderPanel) => {
    set({ activePanel: panel });
  }
}));

// Helper functions for tree manipulation

function findNodeById(tree: ComponentNode[], nodeId: string): ComponentNode | null {
  for (const node of tree) {
    if (node.id === nodeId) {
      return node;
    }
    const found = findNodeById(node.children, nodeId);
    if (found) return found;
  }
  return null;
}

function removeNodeById(tree: ComponentNode[], nodeId: string): ComponentNode[] {
  return tree
    .filter(node => node.id !== nodeId)
    .map(node => ({
      ...node,
      children: removeNodeById(node.children, nodeId)
    }));
}

function updateNode(
  tree: ComponentNode[],
  nodeId: string,
  updater: (node: ComponentNode) => ComponentNode
): ComponentNode[] {
  return tree.map(node => {
    if (node.id === nodeId) {
      return updater(node);
    }
    return {
      ...node,
      children: updateNode(node.children, nodeId, updater)
    };
  });
}

function addNodeToParent(
  tree: ComponentNode[],
  parentId: string,
  newNode: ComponentNode,
  index?: number
): ComponentNode[] {
  return tree.map(node => {
    if (node.id === parentId) {
      const newChildren = [...node.children];
      if (index !== undefined) {
        newChildren.splice(index, 0, newNode);
      } else {
        newChildren.push(newNode);
      }
      return { ...node, children: newChildren };
    }
    return {
      ...node,
      children: addNodeToParent(node.children, parentId, newNode, index)
    };
  });
}

function addNodeNextTo(
  tree: ComponentNode[],
  nodeId: string,
  newNode: ComponentNode
): ComponentNode[] {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === nodeId) {
      return [...tree.slice(0, i + 1), newNode, ...tree.slice(i + 1)];
    }
    
    const newChildren = addNodeNextTo(tree[i].children, nodeId, newNode);
    if (newChildren !== tree[i].children) {
      const newTree = [...tree];
      newTree[i] = { ...tree[i], children: newChildren };
      return newTree;
    }
  }
  return tree;
}

function cloneNodeWithNewIds(node: ComponentNode): ComponentNode {
  return {
    ...node,
    id: uuidv4(),
    children: node.children.map(child => cloneNodeWithNewIds(child))
  };
}

// Import StyleConfig type
import { StyleConfig } from '@/types/template-builder';


