/**
 * Central registry for all DSA problem definitions.
 * Each problem lives in its own file under the category subfolder.
 * Import from here — never import individual problem files directly.
 */
import type { ProblemDefinition } from './types';

type ProblemModule = { default: ProblemDefinition };

const difficultyRank: Record<ProblemDefinition['difficulty'], number> = {
  Easy: 0,
  Medium: 1,
  Hard: 2,
};

const problemModules = import.meta.glob<ProblemModule>('./*/**/*.ts', { eager: true });

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function isProblemDefinition(v: unknown): v is ProblemDefinition {
  if (!v || typeof v !== 'object') return false;
  const p = v as Partial<ProblemDefinition>;
  return (
    isNonEmptyString(p.id) &&
    isNonEmptyString(p.title) &&
    (p.difficulty === 'Easy' || p.difficulty === 'Medium' || p.difficulty === 'Hard') &&
    isNonEmptyString(p.category) &&
    isNonEmptyString(p.url) &&
    isNonEmptyString(p.starterCode)
  );
}

const allProblemsUnsorted: ProblemDefinition[] = [];
for (const [path, mod] of Object.entries(problemModules)) {
  // Robustly skip internal files and index files
  if (path.includes('index.ts') || path.includes('types.ts')) continue;
  const candidate = (mod as ProblemModule | undefined)?.default;
  if (!isProblemDefinition(candidate)) {
    // Don't let one malformed file blank the entire app.
    console.warn(`[problems] Skipping invalid problem module: ${path}`, candidate);
    continue;
  }
  allProblemsUnsorted.push(candidate);
}

const categoryOrder: Record<string, number> = {
  'Arrays & Hashing': 0,
  'Two Pointers': 1,
  'Sliding Window': 2,
  'Sorting': 3,
  'Binary Search': 4,
  'Linked List': 5,
  'Stack': 6,
  'Intervals': 7,
  'Trees': 8,
  'Graphs': 9,
  'Backtracking': 10,
  'Heap': 11,
  'Heap / Priority Queue': 11,
  'Dynamic Programming': 12,
  'Trie': 13,
  'Bit Manipulation': 14,
};

function getCategoryRank(cat: string): number {
  return categoryOrder[cat] !== undefined ? categoryOrder[cat] : 99;
}

export const problemsList: ProblemDefinition[] = allProblemsUnsorted
  .slice()
  .sort((a, b) => {
    const rankA = getCategoryRank(a.category);
    const rankB = getCategoryRank(b.category);
    if (rankA !== rankB) return rankA - rankB;

    const diff = difficultyRank[a.difficulty] - difficultyRank[b.difficulty];
    if (diff !== 0) return diff;

    return a.title.localeCompare(b.title);
  });

// ─── Map for O(1) lookup by id ───────────────────────────────────────────────
export const problemsMap: Record<string, ProblemDefinition> =
  Object.fromEntries(problemsList.map(p => [p.id, p]));

export type { ProblemDefinition };
