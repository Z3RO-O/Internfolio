import { FormData } from './index';
import { LucideIcon } from 'lucide-react';

// ============================================
// COMPONENT METADATA SYSTEM
// ============================================

export type ComponentType = 'atom' | 'molecule' | 'organism';
export type ComponentCategory =
  | 'Layout'
  | 'Typography'
  | 'Media'
  | 'Projects'
  | 'Stats'
  | 'Navigation'
  | 'Content'
  | 'Form';

export type PropType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'color'
  | 'select'
  | 'multiselect'
  | 'toggle'
  | 'slider'
  | 'image'
  | 'icon'
  | 'spacing'
  | 'alignment';

export interface PropValidation {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  custom?: (value: any) => boolean | string;
}

export interface PropDefinition {
  name: string;
  label: string;
  type: PropType;
  defaultValue: any;
  options?: Array<{ label: string; value: any }>;
  validation?: PropValidation;
  group?: string; // For organizing props in tabs/sections
  description?: string;
  placeholder?: string;
}

export interface DataBinding {
  key: string; // Prop name
  label: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  schema?: string; // Reference to FormData type
  required?: boolean;
  description?: string;
}

export interface ComponentConstraints {
  maxInstances?: number;
  minInstances?: number;
  allowedParents?: string[]; // Component IDs
  allowedChildren?: string[]; // Component IDs
  requiredChildren?: string[]; // Component IDs
  nestingLevel?: number; // Max depth in tree
}

export interface ComponentMeta {
  id: string; // Unique component identifier
  type: ComponentType;
  name: string;
  description: string;
  category: ComponentCategory;
  icon: LucideIcon;

  // Component implementation
  component: React.ComponentType<any>;

  // Configuration
  props: PropDefinition[];
  defaultProps: Record<string, any>;

  // Data requirements
  dataBindings: DataBinding[];

  // Constraints
  constraints?: ComponentConstraints;

  // Visual
  preview: string; // Preview image path
  thumbnail?: string;

  // Metadata
  tags?: string[];
  version?: string;
  author?: string;
}

// ============================================
// COMPONENT TREE STRUCTURE
// ============================================

export interface StyleConfig {
  // Layout
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;

  // Spacing
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;

  // Flexbox/Grid
  display?: 'block' | 'flex' | 'grid' | 'inline' | 'inline-block';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  gap?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;

  // Typography
  fontSize?: string;
  fontWeight?: string | number;
  lineHeight?: string | number;
  letterSpacing?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';

  // Colors
  color?: string;
  backgroundColor?: string;

  // Borders
  border?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';

  // Effects
  boxShadow?: string;
  opacity?: number;
  transform?: string;
  transition?: string;

  // Other
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  zIndex?: number;

  // Custom CSS
  [key: string]: any;
}

export interface ComponentNode {
  id: string; // Unique node instance ID (UUID)
  componentId: string; // Reference to ComponentMeta.id

  // Configuration
  props: Record<string, any>;
  styles: StyleConfig;

  // Data binding mapping
  // Maps component prop names to FormData paths
  // e.g., { title: "basicInfo.fullName", projects: "projects" }
  dataMapping: Record<string, string>;

  // Conditional rendering
  showIf?: {
    dataPath: string;
    condition: 'exists' | 'empty' | 'equals' | 'notEquals' | 'greaterThan' | 'lessThan';
    value?: any;
  };

  // Tree structure
  children: ComponentNode[];

  // Metadata
  label?: string; // Custom label for layer tree
  locked?: boolean; // Prevent editing
  hidden?: boolean; // Hide from canvas
}

// ============================================
// THEME CONFIGURATION
// ============================================

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontFamilyHeading?: string;
  baseFontSize: string;
  lineHeight: number;
  scale: 'minor-second' | 'major-second' | 'minor-third' | 'major-third' | 'perfect-fourth';
}

export interface ThemeSpacing {
  unit: number; // Base spacing unit in px
  scale: number[]; // Spacing scale multipliers
}

export interface ThemeConfig {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
    wide: string;
  };
}

// ============================================
// CUSTOM TEMPLATE
// ============================================

export interface CustomTemplate {
  id: string;
  name: string;
  description: string;
  author: string;
  authorId: string;
  version: string;

  // Metadata
  thumbnail?: string;
  tags: string[];
  category?: string;

  // Template structure
  structure: ComponentNode[];
  theme: ThemeConfig;

  // Settings
  isPublic: boolean;
  isFeatured: boolean;

  // Stats
  usageCount: number;
  likesCount: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// ============================================
// TEMPLATE BUILDER STATE
// ============================================

export type CanvasMode = 'desktop' | 'tablet' | 'mobile';
export type BuilderPanel = 'components' | 'properties' | 'layers' | 'theme';

export interface TemplateBuilderState {
  // Current template
  template: CustomTemplate | null;

  // Canvas
  componentTree: ComponentNode[];
  canvasMode: CanvasMode;

  // Selection
  selectedNodeId: string | null;
  hoveredNodeId: string | null;

  // UI State
  activePanel: BuilderPanel;
  showPreview: boolean;
  showGrid: boolean;
  snapToGrid: boolean;

  // History (for undo/redo)
  history: ComponentNode[][];
  historyIndex: number;

  // Clipboard
  clipboard: ComponentNode | null;

  // Drag state
  isDragging: boolean;
  draggingComponentId: string | null;
  dropTargetId: string | null;
}

// ============================================
// TEMPLATE BUILDER ACTIONS
// ============================================

export interface TemplateBuilderActions {
  // Template management
  loadTemplate: (template: CustomTemplate) => void;
  saveTemplate: () => Promise<void>;
  publishTemplate: () => Promise<void>;
  resetTemplate: () => void;

  // Component manipulation
  addComponent: (componentId: string, parentId?: string, index?: number) => void;
  removeComponent: (nodeId: string) => void;
  duplicateComponent: (nodeId: string) => void;
  moveComponent: (nodeId: string, newParentId: string, index: number) => void;
  updateComponentProps: (nodeId: string, props: Partial<Record<string, any>>) => void;
  updateComponentStyles: (nodeId: string, styles: Partial<StyleConfig>) => void;
  updateDataMapping: (nodeId: string, mapping: Record<string, string>) => void;

  // Selection
  selectNode: (nodeId: string | null) => void;
  hoverNode: (nodeId: string | null) => void;

  // Canvas
  setCanvasMode: (mode: CanvasMode) => void;
  togglePreview: () => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;

  // History
  undo: () => void;
  redo: () => void;
  addToHistory: () => void;

  // Clipboard
  copyComponent: (nodeId: string) => void;
  pasteComponent: (parentId?: string) => void;

  // Theme
  updateTheme: (theme: Partial<ThemeConfig>) => void;

  // UI
  setActivePanel: (panel: BuilderPanel) => void;
}

// ============================================
// DATA RESOLUTION
// ============================================

export interface DataResolutionContext {
  formData: FormData;
  computedValues?: Record<string, any>;
}

export type DataResolver = (path: string, context: DataResolutionContext) => any;

// ============================================
// COMPONENT REGISTRY
// ============================================

export interface ComponentRegistry {
  components: Map<string, ComponentMeta>;
  
  register: (meta: ComponentMeta) => void;
  unregister: (componentId: string) => void;
  get: (componentId: string) => ComponentMeta | undefined;
  getAll: () => ComponentMeta[];
  getByType: (type: ComponentType) => ComponentMeta[];
  getByCategory: (category: ComponentCategory) => ComponentMeta[];
  search: (query: string) => ComponentMeta[];
}

// ============================================
// TEMPLATE VALIDATION
// ============================================

export interface ValidationError {
  nodeId?: string;
  componentId?: string;
  field?: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// ============================================
// TEMPLATE MARKETPLACE
// ============================================

export interface TemplateFilter {
  category?: string;
  tags?: string[];
  author?: string;
  featured?: boolean;
  sortBy?: 'popular' | 'recent' | 'likes' | 'name';
  search?: string;
}

export interface TemplateLike {
  id: string;
  templateId: string;
  userId: string;
  createdAt: string;
}

// ============================================
// PRESET LAYOUTS
// ============================================

export interface PresetLayout {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  structure: ComponentNode[];
  category: 'starter' | 'section' | 'full-page';
}


