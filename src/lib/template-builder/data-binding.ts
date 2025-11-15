import { FormData } from '@/types';
import { DataResolutionContext } from '@/types/template-builder';

/**
 * Data Binding System
 * 
 * Resolves data paths from FormData to component props
 * Example: "basicInfo.fullName" → formData.basicInfo.fullName
 */

/**
 * Resolve a data path to its value
 * 
 * @param path - Dot notation path (e.g., "basicInfo.fullName")
 * @param context - Data resolution context with formData
 * @returns Resolved value or undefined
 */
export function resolveDataPath(path: string, context: DataResolutionContext): any {
  if (!path) return undefined;

  const { formData, computedValues } = context;

  // Check computed values first
  if (computedValues && path in computedValues) {
    return computedValues[path];
  }

  // Handle special computed paths
  if (path.startsWith('$computed.')) {
    return resolveComputedValue(path, formData);
  }

  // Split path and traverse object
  const parts = path.split('.');
  let value: any = formData;

  for (const part of parts) {
    if (value === null || value === undefined) {
      return undefined;
    }

    // Handle array indexing (e.g., "projects[0].title")
    const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
    if (arrayMatch) {
      const [, arrayName, index] = arrayMatch;
      value = value[arrayName]?.[parseInt(index, 10)];
    } else {
      value = value[part];
    }
  }

  return value;
}

/**
 * Resolve computed values (special expressions)
 */
function resolveComputedValue(path: string, formData: FormData): any {
  const computed = path.replace('$computed.', '');

  switch (computed) {
    case 'projectCount':
      return formData.projects?.length || 0;

    case 'techStackCount':
      return (
        (formData.techStack?.languages?.length || 0) +
        (formData.techStack?.frameworks?.length || 0) +
        (formData.techStack?.tools?.length || 0)
      );

    case 'totalPRs':
      return formData.projects?.reduce(
        (acc, project) => acc + (project.pullRequests?.length || 0),
        0
      ) || 0;

    case 'totalContributions':
      return formData.techStack?.contributions || 0;

    case 'durationDays':
      if (formData.basicInfo?.startDate && formData.basicInfo?.endDate) {
        const start = new Date(formData.basicInfo.startDate);
        const end = new Date(formData.basicInfo.endDate);
        const diff = end.getTime() - start.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
      }
      return 0;

    case 'durationMonths':
      if (formData.basicInfo?.startDate && formData.basicInfo?.endDate) {
        const start = new Date(formData.basicInfo.startDate);
        const end = new Date(formData.basicInfo.endDate);
        const months =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth());
        return Math.max(1, months);
      }
      return 0;

    case 'allTechnologies':
      return [
        ...(formData.techStack?.languages || []),
        ...(formData.techStack?.frameworks || []),
        ...(formData.techStack?.tools || [])
      ];

    case 'learningCount':
      return (
        (formData.learning?.currentlyLearning?.length || 0) +
        (formData.learning?.interestedIn?.length || 0)
      );

    default:
      return undefined;
  }
}

/**
 * Resolve all data mappings for a component
 * 
 * @param dataMapping - Map of prop names to data paths
 * @param context - Data resolution context
 * @returns Object with resolved values
 */
export function resolveDataMappings(
  dataMapping: Record<string, string>,
  context: DataResolutionContext
): Record<string, any> {
  const resolved: Record<string, any> = {};

  for (const [propName, dataPath] of Object.entries(dataMapping)) {
    resolved[propName] = resolveDataPath(dataPath, context);
  }

  return resolved;
}

/**
 * Check if a data path exists and has a value
 */
export function hasValue(path: string, context: DataResolutionContext): boolean {
  const value = resolveDataPath(path, context);
  
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  
  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).length > 0;
  }
  
  return value !== undefined && value !== null && value !== '';
}

/**
 * Evaluate a conditional expression
 */
export function evaluateCondition(
  dataPath: string,
  condition: 'exists' | 'empty' | 'equals' | 'notEquals' | 'greaterThan' | 'lessThan',
  value: any,
  context: DataResolutionContext
): boolean {
  const resolvedValue = resolveDataPath(dataPath, context);

  switch (condition) {
    case 'exists':
      return resolvedValue !== undefined && resolvedValue !== null;

    case 'empty':
      if (Array.isArray(resolvedValue)) {
        return resolvedValue.length === 0;
      }
      if (typeof resolvedValue === 'object') {
        return Object.keys(resolvedValue).length === 0;
      }
      return !resolvedValue;

    case 'equals':
      return resolvedValue === value;

    case 'notEquals':
      return resolvedValue !== value;

    case 'greaterThan':
      return Number(resolvedValue) > Number(value);

    case 'lessThan':
      return Number(resolvedValue) < Number(value);

    default:
      return true;
  }
}

/**
 * Get available data paths for autocomplete/suggestion
 */
export function getAvailableDataPaths(): string[] {
  return [
    // Basic Info
    'basicInfo.fullName',
    'basicInfo.email',
    'basicInfo.internshipRole',
    'basicInfo.teamDepartment',
    'basicInfo.managerName',
    'basicInfo.startDate',
    'basicInfo.endDate',
    'basicInfo.summary',
    'basicInfo.teammates',

    // Tech Stack
    'techStack.languages',
    'techStack.frameworks',
    'techStack.tools',
    'techStack.other',
    'techStack.commits',
    'techStack.features',
    'techStack.linesOfCode',
    'techStack.contributions',

    // Learning
    'learning.currentlyLearning',
    'learning.interestedIn',
    'learning.technicalLearnings',
    'learning.softSkills',
    'learning.crossTeamCollaboration',
    'learning.technicalLearningEntries',

    // Projects (array)
    'projects',
    'projects[].title',
    'projects[].description',
    'projects[].role',
    'projects[].technologies',
    'projects[].outcome',
    'projects[].timelineStart',
    'projects[].timelineEnd',
    'projects[].link',
    'projects[].pullRequests',
    'projects[].media',
    'projects[].challenges',
    'projects[].tickets',
    'projects[].docs',

    // Computed values
    '$computed.projectCount',
    '$computed.techStackCount',
    '$computed.totalPRs',
    '$computed.totalContributions',
    '$computed.durationDays',
    '$computed.durationMonths',
    '$computed.allTechnologies',
    '$computed.learningCount'
  ];
}

/**
 * Validate data path syntax
 */
export function isValidDataPath(path: string): boolean {
  if (!path) return false;

  // Check for computed values
  if (path.startsWith('$computed.')) {
    return true;
  }

  // Check for valid path format
  const pathRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*(\.[a-zA-Z_$][a-zA-Z0-9_$]*|\[\d+\])*$/;
  return pathRegex.test(path);
}

/**
 * Get type of value at data path
 */
export function getDataPathType(path: string, context: DataResolutionContext): string {
  const value = resolveDataPath(path, context);

  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  return typeof value;
}

/**
 * Create data resolution context from FormData
 */
export function createDataContext(formData: FormData): DataResolutionContext {
  return {
    formData,
    computedValues: {}
  };
}


