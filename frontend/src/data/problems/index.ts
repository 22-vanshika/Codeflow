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

export const problemsList: ProblemDefinition[] = allProblemsUnsorted
  .slice()
  .sort((a, b) => {
    const cat = a.category.localeCompare(b.category);
    if (cat !== 0) return cat;

    const diff = difficultyRank[a.difficulty] - difficultyRank[b.difficulty];
    if (diff !== 0) return diff;

    return a.title.localeCompare(b.title);
  });

// ─── Map for O(1) lookup by id ───────────────────────────────────────────────
export const problemsMap: Record<string, ProblemDefinition> =
  Object.fromEntries(problemsList.map(p => [p.id, p]));

export type { ProblemDefinition };
