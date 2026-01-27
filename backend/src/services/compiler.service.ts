import axios from 'axios';

export interface RunResult {
    stdout: string;
    stderr: string;
    output: string; // Combined
    code: number;   // Exit code
    signal: string | null;
}

export interface PistonResponse {
    language: string;
    version: string;
    run: {
        stdout: string;
        stderr: string;
        output: string;
        code: number;
        signal: string | null;
    };
    compile?: {
        stdout: string;
        stderr: string;
        output: string;
        code: number;
        signal: string | null;
    };
}

export class CompilerService {
    private readonly PISTON_API = 'https://emkc.org/api/v2/piston';

    /**
     * Execute code using Piston API
     */
    public async execute(language: string, source: string, stdin: string = ""): Promise<RunResult> {
        try {
            // Piston expects 'c++' as 'cpp' usually, but let's map it safely
            const langMap: Record<string, string> = {
                'cpp': 'c++',
                'c++': 'c++',
                'c': 'c',
                'python': 'python',
                'javascript': 'javascript',
                'typescript': 'typescript'
            };

            const lang = langMap[language.toLowerCase()] || language;

            const payload = {
                language: lang,
                version: "*", // Use latest available
                files: [
                    {
                        name: 'main.cpp', // Piston handles extension based on lang usually, but good to be specific
                        content: source
                    }
                ],
                stdin: stdin,
                args: [],
                compile_timeout: 10000,
                run_timeout: 3000,
                compile_memory_limit: -1,
                run_memory_limit: -1
            };

            // console.log(`[Compiler] Sending request to Piston for ${lang}`);
            const response = await axios.post<PistonResponse>(`${this.PISTON_API}/execute`, payload);

            if (!response.data || !response.data.run) {
                throw new Error("Invalid response from execution engine");
            }

            const run = response.data.run;
            const compile = response.data.compile;

            // If compilation failed, return that info
            if (compile && compile.code !== 0) {
                return {
                    stdout: compile.stdout,
                    stderr: compile.stderr,
                    output: `COMPILATION ERROR:\n${compile.output}`,
                    code: compile.code,
                    signal: compile.signal
                };
            }

            return {
                stdout: run.stdout,
                stderr: run.stderr,
                output: run.output,
                code: run.code,
                signal: run.signal
            };

        } catch (error: any) {
            console.error("Compiler Service Error:", error.message);
            return {
                stdout: "",
                stderr: error.message,
                output: `Error executing code: ${error.message}`,
                code: -1,
                signal: null
            };
        }
    }
}
