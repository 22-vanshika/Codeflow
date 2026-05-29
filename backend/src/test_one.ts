import { Executor } from './engine/languages/cpp/executor';
import { Lexer } from './engine/languages/cpp/parser';
import * as fs from 'fs';
import * as path from 'path';

const file = path.join(__dirname, '../../frontend/src/data/problems/backtracking/sudoku-solver.ts');
const content = fs.readFileSync(file, 'utf8');
const match = content.match(/starterCode:\s*`([\s\S]*?)`/);
if (!match) {
    console.error("No starter code");
    process.exit(1);
}
const code = match[1];

console.log("Executing...");
try {
    const executor = new Executor();
    const generator = executor.execute(code, "");
    let count = 0;
    try {
        for (const trace of generator) {
            count++;
            if (count % 5000 === 0) {
                console.log(`Still executing... reached ${count} traces`);
            }
        }
    } catch (err: any) {
        console.error("Generator execution error:", err.stack || err.message);
    }
    console.log("Success! Total traces count:", count);
} catch (e: any) {
    console.error("Failed with error:", e.stack || e.message);
}
