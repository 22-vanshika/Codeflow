import * as fs from 'fs';
import * as path from 'path';
import { Executor } from './engine/languages/cpp/executor';

const PROBLEMS_DIR = path.join(__dirname, '../../frontend/src/data/problems');

interface TestResult {
    fileName: string;
    category: string;
    success: boolean;
    stepCount: number;
    visualizerType: string;
    outputSnippet: string;
    error?: string;
}

const getProblemFiles = (dir: string): string[] => {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getProblemFiles(filePath));
        } else if (file.endsWith('.ts') && file !== 'index.ts' && file !== 'types.ts') {
            results.push(filePath);
        }
    });
    return results;
};

const runSheetTests = () => {
    console.log("====================================================");
    console.log("🚀 STARTING DETAILED DSA SHEET PROBLEMS TEST SUITE");
    console.log("====================================================\n");

    if (!fs.existsSync(PROBLEMS_DIR)) {
        console.error(`Error: Problems directory not found at ${PROBLEMS_DIR}`);
        process.exit(1);
    }

    const problemFiles = getProblemFiles(PROBLEMS_DIR);
    const results: TestResult[] = [];

    console.log(`Found ${problemFiles.length} problem files to test.\n`);

    for (const filePath of problemFiles) {
        const relativePath = path.relative(PROBLEMS_DIR, filePath);
        const category = path.dirname(relativePath);
        const fileName = path.basename(filePath);
        const content = fs.readFileSync(filePath, 'utf8');

        // Extract starter code
        const match = content.match(/starterCode:\s*`([\s\S]*?)`/);
        if (!match) {
            console.log(`⚠️ Skip: ${relativePath} (No starterCode found)`);
            continue;
        }

        const sourceCode = match[1];
        console.log(`🧪 Running Sheet Test: [${category}] ${fileName}...`);

        try {
            const executor = new Executor();
            const generator = executor.execute(sourceCode, "");
            const traces: any[] = [];
            let steps = 0;

            for (const trace of generator) {
                traces.push(trace);
                if (steps++ > 1500) {
                    throw new Error("Execution limit exceeded (possible infinite loop or deep recursion)");
                }
            }

            const visualizerTypes = new Set<string>();
            traces.forEach(t => {
                if (t.visuals && t.visuals.type) {
                    visualizerTypes.add(t.visuals.type);
                }
            });

            const finalTrace = traces[traces.length - 1];
            const output = finalTrace?.output || "";

            results.push({
                fileName,
                category,
                success: true,
                stepCount: traces.length,
                visualizerType: Array.from(visualizerTypes).join(', ') || 'none',
                outputSnippet: output.trim().replace(/\n/g, ' | ').substring(0, 55) + '...'
            });
            console.log(`✅ Success! Generated ${traces.length} steps. Visuals: [${Array.from(visualizerTypes).join(', ')}]\n`);

        } catch (error: any) {
            results.push({
                fileName,
                category,
                success: false,
                stepCount: 0,
                visualizerType: 'none',
                outputSnippet: 'N/A',
                error: error.message || 'Unknown error'
            });
            console.error(`❌ Failed! Error: ${error.message}\n`);
        }
    }

    console.log("====================================================");
    console.log("📊 DSA SHEET TEST RESULTS SUMMARY");
    console.log("====================================================");
    
    const passed = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`TOTAL PROBLEMS: ${results.length}`);
    console.log(`✅ PASSED: ${passed.length}`);
    console.log(`❌ FAILED: ${failed.length}\n`);

    if (failed.length > 0) {
        console.log("🚨 FAILED PROBLEMS:");
        failed.forEach(f => {
            console.log(`- [${f.category}] ${f.fileName}: ${f.error}`);
        });
        console.log("");
    }

    console.log("====================================================");
    if (failed.length === 0 && results.length === 200) {
        console.log("🎉 ALL 200 CURATED SHEET PROBLEMS PASSED SUCCESSFULLY!");
        process.exit(0);
    } else {
        if (results.length !== 200) {
            console.error(`🚨 ERROR: Expected exactly 200 problems, but found ${results.length}!`);
        }
        process.exit(1);
    }
};

runSheetTests();
