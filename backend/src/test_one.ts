import { Executor } from './engine/languages/cpp/executor';
import * as fs from 'fs';
import * as path from 'path';

const file = path.join(__dirname, '../../frontend/src/data/problems/binary-search/search-a-2d-matrix.ts');
const content = fs.readFileSync(file, 'utf8');
const match = content.match(/starterCode:\s*`([\s\S]*?)`/);
if (!match) {
    console.error("No starter code");
    process.exit(1);
}
const code = match[1];

console.log("Executing search-a-2d-matrix...");
try {
    const executor = new Executor();
    const generator = executor.execute(code, "");
    let count = 0;

    for (const trace of generator) {
        count++;
        if (trace.visuals) {
            let matrixVisual = null;
            if (trace.visuals.type === 'multi_visuals') {
                matrixVisual = trace.visuals.visuals.find((v: any) => v.type === 'matrix');
            } else if (trace.visuals.type === 'matrix') {
                matrixVisual = trace.visuals;
            }
            if (matrixVisual) {
                console.log(`Step ${count} [Line ${trace.line}]: lastAccessed =`, matrixVisual.lastAccessedCell, `visited =`, matrixVisual.visitedCells, `range =`, matrixVisual.binarySearchRange);
            }
        }
    }
    console.log("Success! Total steps count:", count);
} catch (e: any) {
    console.error("Failed with error:", e.stack || e.message);
}
