import axios from 'axios';

export interface RunResult {
    stdout: string;
    stderr: string;
    output: string; // Combined
    code: number;   // Exit code
    signal: string | null;
}

export class CompilerService {
    /**
     * Compile and execute code via Wandbox API
     */
    public async execute(language: string, source: string, stdin: string = ""): Promise<RunResult> {
        try {
            // Map languages to Wandbox compiler names
            const langMap: Record<string, string> = {
                'cpp': 'gcc-head',
                'c++': 'gcc-head',
                'c': 'gcc-head-c',
                'python': 'cpython-head',
                'javascript': 'nodejs-head',
                'typescript': 'typescript-head'
            };

            const compiler = langMap[language.toLowerCase()];
            if (!compiler) {
                return { stdout: "", stderr: `Unsupported language: ${language}`, output: `Unsupported language: ${language}`, code: -1, signal: null };
            }

            const payload: any = {
                compiler: compiler,
                code: source,
                stdin: stdin || ''
            };

            // Add C++ specific options
            if (compiler === 'gcc-head') {
                payload.options = 'warning,gnu++17';
            }

            const response = await axios.post('https://wandbox.org/api/compile.json', payload);
            const data = response.data;

            // Compilation error handling
            if (data.compiler_error) {
                return {
                    stdout: data.compiler_message || "",
                    stderr: data.compiler_error,
                    output: `COMPILATION ERROR:\n${data.compiler_error}`,
                    code: 1,
                    signal: null
                };
            }

            const statusCode = parseInt(data.status);

            return {
                stdout: data.program_message || "",
                stderr: data.program_error || "",
                output: (data.program_error ? data.program_error + '\n' : '') + (data.program_message || ''),
                code: isNaN(statusCode) ? -1 : statusCode,
                signal: data.signal || null
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
