import * as fs from 'fs';
import * as path from 'path';
import { Executor } from './engine/languages/cpp/executor';

const TEST_CODES_DIR = path.join(__dirname, '../../test_codes');

interface TestResult {
    fileName: string;
    success: boolean;
    stepCount: number;
    visualizerType: string;
    outputSnippet: string;
    error?: string;
}

const runTests = () => {
    console.log("====================================================");
    console.log("🚀 STARTING CODEFLOW DETERMINISTIC DSA TEST SUITE");
    console.log("====================================================\n");

    const testFiles = fs.readdirSync(TEST_CODES_DIR).filter(f => f.endsWith('.cpp'));
    const results: TestResult[] = [];

    for (const file of testFiles) {
        const filePath = path.join(TEST_CODES_DIR, file);
        const sourceCode = fs.readFileSync(filePath, 'utf8');

        console.log(`🧪 Running Test: ${file}...`);
        
        try {
            const executor = new Executor();
            const generator = executor.execute(sourceCode, "");
            const traces: any[] = [];
            let steps = 0;

            for (const trace of generator) {
                traces.push(trace);
                if (steps++ > 1500) {
                    throw new Error("Execution limit exceeded (possible infinite loop)");
                }
            }

            // Identify visualizer types used in the traces
            const visualizerTypes = new Set<string>();
            traces.forEach(t => {
                if (t.visuals && t.visuals.type) {
                    visualizerTypes.add(t.visuals.type);
                }
            });

            const finalTrace = traces[traces.length - 1];
            const output = finalTrace?.output || "";

            results.push({
                fileName: file,
                success: true,
                stepCount: traces.length,
                visualizerType: Array.from(visualizerTypes).join(', ') || 'none',
                outputSnippet: output.trim().replace(/\n/g, ' | ').substring(0, 50) + '...'
            });
            console.log(`✅ Success! Generated ${traces.length} steps. Visuals: [${Array.from(visualizerTypes).join(', ')}]\n`);

        } catch (error: any) {
            results.push({
                fileName: file,
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
    console.log("📊 TEST RESULTS SUMMARY");
    console.log("====================================================");
    console.table(results.map(r => ({
        "File Name": r.fileName,
        "Status": r.success ? "✅ PASSED" : "❌ FAILED",
        "Steps": r.stepCount,
        "Visualizers Used": r.visualizerType,
        "Output/Error": r.success ? r.outputSnippet : `Error: ${r.error}`
    })));
    console.log("====================================================");

    const allPassed = results.every(r => r.success);
    if (allPassed) {
        console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! CodeFlow is stable and robust!");
        process.exit(0);
    } else {
        console.error("🚨 SOME TESTS FAILED! Review details above.");
        process.exit(1);
    }
};

runTests();
