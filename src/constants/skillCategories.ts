// Skill Categories Configuration
// Maps individual question categories to 5 core skill groups

export const SKILL_CATEGORIES = {
  'Frontend Foundations': [
    'react',
    'html',
    'css',
    'browser',
    'nextjs',
    'react-native',
    'web3',
    'mobile',
  ],
  'Programming Languages': ['javascript', 'typescript'],
  'System & Architecture': ['system-design', 'architecture', 'networking', 'algorithms'],
  'Quality & Performance': ['performance', 'security', 'testing'],
  'Developer Tools': ['tooling', 'soft-skills'],
} as const;

export type SkillCategoryName = keyof typeof SKILL_CATEGORIES;

/**
 * Get the skill category group for a given question category
 * @param category - The category from the question (e.g., 'react', 'javascript')
 * @returns The skill category group name (e.g., 'Frontend Foundations')
 */
export function getCategoryGroup(category: string): SkillCategoryName {
  for (const [groupName, categories] of Object.entries(SKILL_CATEGORIES)) {
    if ((categories as readonly string[]).includes(category)) {
      return groupName as SkillCategoryName;
    }
  }
  // Default fallback to Frontend Foundations for unknown categories
  return 'Frontend Foundations';
}

/**
 * Get all skill category names in display order
 */
export function getAllSkillCategories(): SkillCategoryName[] {
  return Object.keys(SKILL_CATEGORIES) as SkillCategoryName[];
}

/**
 * Get default skill data structure (all categories with 0%)
 */
export function getDefaultSkillData() {
  return getAllSkillCategories().map((category) => ({
    category,
    score: 0,
    fullMark: 100,
  }));
}
