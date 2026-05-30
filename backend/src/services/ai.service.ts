import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import { Lexer, Parser } from '../engine/languages/cpp/parser';
dotenv.config();

export class AiService {
    private groq: Groq;
    private apiKey: string | undefined;

    // Use Llama 3.3 for best speed/quality balance (3.1 decommissioned Jan 2025)
    private readonly MODEL = "llama-3.3-70b-versatile";

    constructor() {
        const key = process.env.GROQ_API_KEY;
        this.apiKey = key ? key.trim() : undefined;

        if (!this.apiKey) {
            console.warn("GROQ_API_KEY not found. AI features will use mocks.");
        } else {
            console.log(`AI Initialized (Groq). Key starts with: ${this.apiKey.substring(0, 4)}...`);
        }

        this.groq = new Groq({ apiKey: this.apiKey || "mock-key" });
    }

    private async generateCompletion(prompt: string, jsonMode: boolean = false): Promise<string> {
        if (!this.apiKey) throw new Error("No API Key");

        try {
            const completion = await this.groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: this.MODEL,
                temperature: 0.1,
                max_tokens: 8192,
                response_format: jsonMode ? { type: 'json_object' } : undefined
            });

            return completion.choices[0]?.message?.content || "";
        } catch (error: any) {
            console.error(`Groq API Error: ${error.message}`);
            throw error;
        }
    }

    private getAnalysisPrompt(code: string): string {
        return `
        Analyze this C++ code for complexity.
        
        Return a JSON object with the following keys:
        - "title": A brief descriptive title for the algorithm/code
        - "timeComplexity": Time complexity in Big-O notation (e.g., "O(N)", "O(N²)", "O(log N)")
        - "spaceComplexity": Space complexity in Big-O notation (e.g., "O(1)", "O(N)")
        - "complexityExplanation": A brief explanation of why the code has this complexity (1-2 sentences)
        - "pattern": The algorithmic pattern used (e.g., "Two Pointers", "Sliding Window", "Recursion", "Iteration", "Sorting", "Graph Traversal", "Binary Search")
        - "explanation": A map of line numbers to short explanations (e.g., {"5": "This initializes the counter"})
        - "overview": A brief summary of what the code does
        
        And these additional detailed analysis keys for our Complexity tab:
        - "timeBreakdown": Array of objects, each with "operation" and "complexity" (e.g. [{"operation": "Loop Traversal", "complexity": "O(N)"}, {"operation": "HashMap Operations", "complexity": "O(1)"}])
        - "spaceBreakdown": Array of objects, each with "structure" and "complexity" (e.g. [{"structure": "Input Array", "complexity": "O(N)"}, {"structure": "HashMap", "complexity": "O(k)"}])
        - "stepExplanations": Array of step-by-step human explanations showing how the complexity was derived (e.g. ["The algorithm traverses the array once.", "Each HashMap lookup is O(1).", "Therefore total complexity is O(N)."])
        - "detections": Array of objects detailing detected features (e.g. loops, recursion, trees, graphs, STL containers). Each object has:
            * "title": Name of detected feature (e.g. "Single Loop", "HashMap usage", "Sliding Window")
            * "detectedType": Feature type (e.g. "loop", "stl_container", "two_pointer", "sliding_window", "recursion", "sorting", "tree", "graph", "heap", "trie")
            * "codeSnippet": The specific C++ code snippet (e.g. "for(int i=0; i<n; i++)")
            * "complexity": Individual complexity of this feature (e.g. "O(N)" or "O(1)")
            * "explanation": Why it has this complexity
            * "visualTree": Optional array of strings showing visual reduction/calculation (e.g., for loops: ["for loop", "↓", "n iterations", "↓", "O(N)"], for nested loops: ["n", "×", "n", "=", "n²"], for binary search: ["N", "↓", "N/2", "↓", "N/4", "↓", "log N", "↓", "O(log N)"], for recursion tree: ["Levels = log n", "Work per level = n", "Total = n log n"])
        - "learningMode": An object comparing the current solution with alternatives:
            * "bruteForce": { "time": string, "space": string, "explanation": string }
            * "optimized": { "time": string, "space": string, "explanation": string }
            * "improvement": String showing complexity transition (e.g. "O(N²) → O(N)")
            * "optimizationReason": Explanation of why the optimization works
            
        Ensure the JSON is strictly formatted and valid. Do not include comments or markdown formatting in the JSON payload itself.
        
        Code:
        ${code}
        `;
    }

    private getTracePrompt(code: string, input: string): string {
        return `
        You are a strict C++ execution simulator generating a step-by-step pedagogical trace for a code visualizer (like SWE180 or PythonTutor). 
        You MUST simulate the code LINE-BY-LINE. Do NOT skip any loop iterations. Do NOT summarize steps. Every single time a line of code executes, you must generate a new step.
        
        CRITICAL RULES:
        1. STRICTLY LINE-BY-LINE: If a loop runs 5 times, you must generate steps for the loop condition and loop body 5 times.
        2. NO SKIPPING: Do not summarize "The loop finishes". Trace every exact iteration and comparison.
        3. VARIABLE TRACKING: Update the 'variables' dictionary at every step with the current precise state of local variables.
        4. POINTER VISUALS: If visualizing arrays/graphs, the 'pointers' array MUST continuously update its 'index' or 'nodeId' position to match the current variable state (e.g. if 'i' increments, the pointer for 'i' must have the new index).
        5. HIGHLIGHTING: The 'line' number must accurately reflect the exact line currently executing.
        6. CONDITIONALS: Log conditions being checked before entering if/else blocks.
        
        Input provided to the program (if any cin/scanf/arguments): "${input}"
        
        Determine if the algorithm is dealing with a specific data structure and provide a matching "visuals" object. Supported types:
        - "graph": {type: "graph", nodes: [{id, value, label}], edges: [{from, to, directed, weight}], activeNodes: [], visitedNodes: []}
        - "tree": {type: "tree", nodes: [{id, value, parentId}], activeNodes: [], visitedNodes: []}
        - "stack" | "queue": {type: "stack"|"queue", target: string, elements: any[], pointers: [{name, index, color}], activeIndices: []}
        - "array_1d": {type: "array_1d", target: string, values: any[], pointers: [{name, index, color, action}], highlightIndices: []}
        - "hash_map": {type: "hash_map", target: string, entries: [{key, value}], activeKeys: []}
        
        Return a JSON object matching this TypeScript interface exactly:
        {
            success: boolean;
            pattern?: { name: string; description: string; color: string; };
            totalSteps: number;
            output?: string;
            steps: {
                step: number; 
                line: number; 
                lineContent: string; 
                type: "assignment" | "condition" | "loop_start" | "loop_continue" | "loop_end" | "function_call" | "return" | "comparison";
                variables: Record<string, any>;
                visuals?: object; // Must match one of the schema types described above based on current state
                teacherNote: { what: string; why: string; next: string; };
            }[];
        }

        Code to trace:
        ${code}
        `;
    }

    private getFlowchartPrompt(code: string): string {
        return `
        Create a Mermaid.js flowchart (graph TD) for the logic of this code.
        Return ONLY the mermaid code string. No markdown formatting.
        
        Code:
        ${code}
        `;
    }

    public async analyzeCode(code: string): Promise<any> {
        if (!this.apiKey) return this.mockAnalyze(code);

        const prompt = this.getAnalysisPrompt(code);

        try {
            const text = await this.generateCompletion(prompt, true);
            return JSON.parse(text);
        } catch (error) {
            console.warn("AI Analysis Failed, using mock.");
            return this.mockAnalyze(code);
        }
    }

    public async generateFlowchart(code: string): Promise<any> {
        if (!this.apiKey) return this.mockFlowchart(code);

        const prompt = this.getFlowchartPrompt(code);

        try {
            let text = await this.generateCompletion(prompt, false);
            // Clean markdown if present
            text = text.replace(/```mermaid/g, '').replace(/```/g, '').trim();
            return {
                markdown: text,
                mapping: {}
            };
        } catch (error) {
            console.warn("AI Flowchart Failed, using mock.");
            return this.mockFlowchart(code);
        }
    }

    public async generateTrace(code: string, input: string): Promise<any> {
        if (!this.apiKey) return this.mockTrace(code);

        const prompt = this.getTracePrompt(code, input);

        try {
            const text = await this.generateCompletion(prompt, true);
            const data = JSON.parse(text);
            return data;
        } catch (error) {
            console.error("AI Trace Failed:", error);
            return { success: false, error: "AI Trace generation failed." };
        }
    }

    // --- HEURISTIC FALLBACK ANALYZER ---
    private heuristicAnalyze(code: string): any {
        const detections: any[] = [];
        const timeBreakdown: any[] = [];
        const spaceBreakdown: any[] = [];
        const stepExplanations: string[] = [];

        // Basic detection patterns
        const hasVector = /\bvector\s*</.test(code);
        const hasUnorderedMap = /\bunordered_map\s*</.test(code);
        const hasUnorderedSet = /\bunordered_set\s*</.test(code);
        const hasMap = /\bmap\s*</.test(code);
        const hasSet = /\bset\s*</.test(code);
        const hasStack = /\bstack\s*</.test(code);
        const hasQueue = /\bqueue\s*</.test(code) && !/\bpriority_queue\s*</.test(code);
        const hasPriorityQueue = /\bpriority_queue\s*</.test(code);
        const hasDeque = /\bdeque\s*</.test(code);

        // Algorithm patterns
        const hasBinarySearch = /(\b(low|high|mid|left|right)\b.*<=.*(low|high|left|right))|(\bmid\s*=\s*.*\/.*2)/.test(code);
        const hasTwoPointers = /while\s*\(\s*(left|l|low)\s*<\s*(right|r|high)\s*\)/.test(code) && !hasBinarySearch;
        const hasSlidingWindow = /while\s*\(\s*(right|r|i|j)\s*<\s*(n|size)\s*\)/.test(code) && (hasUnorderedMap || hasUnorderedSet || /window|max|len/i.test(code)) && !hasBinarySearch && !hasTwoPointers;
        const hasSortingCall = /\bsort\s*\(/.test(code);
        
        // Custom Sorting implementation detection
        const hasSwap = /\bswap\s*\(/.test(code) || /temp\s*=\s*\w+\[\w+\];\s*\w+\[\w+\]\s*=\s*\w+\[\w+\]/.test(code);
        const loopCount = (code.match(/\bfor\s*\(/g) || []).length + (code.match(/\bwhile\s*\(/g) || []).length;
        
        // Recursion detection
        const functionMatches = [...code.matchAll(/\b(\w+)\s+(\w+)\s*\([^)]*\)\s*\{/g)];
        let isRecursive = false;
        let recursiveFuncName = "";
        for (const m of functionMatches) {
            const funcName = m[2];
            if (funcName !== "main" && !['size', 'push_back', 'pop', 'push', 'top', 'front', 'back'].includes(funcName)) {
                // simple recursive call regex
                const bodyRegex = new RegExp(`\\b${funcName}\\s*\\(`);
                const searchArea = code.substring(m.index + m[0].length);
                if (bodyRegex.test(searchArea)) {
                    isRecursive = true;
                    recursiveFuncName = funcName;
                    break;
                }
            }
        }

        // Loop nesting detection (Heuristic based on open braces)
        let maxNesting = 0;
        let currentNesting = 0;
        let inLoopBlock = false;
        
        const lines = code.split('\n');
        for (const line of lines) {
            if (/\bfor\s*\(|\bwhile\s*\(/.test(line)) {
                currentNesting++;
                maxNesting = Math.max(maxNesting, currentNesting);
                inLoopBlock = true;
            }
            if (line.includes('}') && inLoopBlock) {
                currentNesting = Math.max(0, currentNesting - 1);
                if (currentNesting === 0) inLoopBlock = false;
            }
        }

        // Establish core time & space complexities
        let timeComplexity = "O(N)";
        let spaceComplexity = "O(1)";
        let patternName = "Iteration / Linear Scan";
        let titleName = "Linear Search / Scan";
        let explanation = "The algorithm runs in linear time by traversing the input array once.";

        // Resolve Complexity Details based on heuristics
        if (hasSortingCall) {
            timeComplexity = "O(N log N)";
            spaceComplexity = "O(log N)";
            patternName = "Sorting / Divide & Conquer";
            titleName = "Standard Sorting";
            explanation = "Uses C++ std::sort which is O(N log N) time complexity (Introsort, a hybrid of Quicksort, Heapsort, and Insertion Sort) and O(log N) auxiliary space.";
            
            timeBreakdown.push({ operation: "std::sort operations", complexity: "O(N log N)" });
            spaceBreakdown.push({ structure: "Recursion call stack (quicksort)", complexity: "O(log N)" });
            
            stepExplanations.push(
                "The algorithm invokes standard std::sort which internally runs Introsort.",
                "It splits the input and sorts subarrays recursively.",
                "Therefore, time complexity is O(N log N) and space complexity is O(log N)."
            );
        } else if (hasBinarySearch) {
            timeComplexity = "O(log N)";
            spaceComplexity = "O(1)";
            patternName = "Binary Search";
            titleName = "Binary Search Lookup";
            explanation = "At each step, the search range is halved, resulting in logarithmic time complexity.";
            
            timeBreakdown.push({ operation: "Range Halving", complexity: "O(log N)" });
            spaceBreakdown.push({ structure: "Iterative Pointers", complexity: "O(1)" });
            
            stepExplanations.push(
                "The search range starts at size N.",
                "In each iteration, the midpoint is checked, and the search window is cut in half (N -> N/2 -> N/4).",
                "The total number of iterations needed to reduce N to 1 is log₂ N.",
                "Therefore, the time complexity is O(log N)."
            );
            
            detections.push({
                title: "Binary Search Loop",
                detectedType: "binary_search",
                codeSnippet: "while(low <= high)",
                complexity: "O(log N)",
                explanation: "Dividing search space by 2 recursively or iteratively takes logarithmic operations.",
                visualTree: ["N", "↓", "N/2", "↓", "N/4", "↓", "N/8", "↓", "log N", "↓", "O(log N)"]
            });
        } else if (hasSlidingWindow) {
            timeComplexity = "O(N)";
            spaceComplexity = hasUnorderedMap || hasUnorderedSet ? "O(k)" : "O(1)";
            patternName = "Sliding Window";
            titleName = "Sliding Window Scan";
            explanation = "A dynamic window boundaries scan. Left and right pointers only move forward, ensuring linear O(N) operations.";
            
            timeBreakdown.push({ operation: "Right pointer expansion", complexity: "O(N)" });
            timeBreakdown.push({ operation: "Left pointer contraction", complexity: "O(N)" });
            timeBreakdown.push({ operation: "Total Operations", complexity: "O(N)" });
            
            if (hasUnorderedMap) {
                spaceBreakdown.push({ structure: "Frequency Map / HashMap", complexity: "O(k)" });
            } else {
                spaceBreakdown.push({ structure: "Window Variables", complexity: "O(1)" });
            }
            
            stepExplanations.push(
                "The right pointer expands the window by running at most N times.",
                "The left pointer contracts the window from behind, also moving at most N times.",
                "Since neither pointer ever backtracks, total steps are bounded by 2N.",
                "This results in a linear time complexity of O(N)."
            );

            detections.push({
                title: "Sliding Window Pointers",
                detectedType: "sliding_window",
                codeSnippet: "while(right < n)",
                complexity: "O(N)",
                explanation: "Both pointers move monotonically from left to right. Sum of their steps is at most 2N.",
                visualTree: ["Left pointer moves ≤ N", "Right pointer moves ≤ N", "Total operations ≤ 2N", "Time = O(N)"]
            });
        } else if (hasTwoPointers) {
            timeComplexity = "O(N)";
            spaceComplexity = "O(1)";
            patternName = "Two Pointers";
            titleName = "Two Pointers Traversal";
            explanation = "Two pointers converge from ends towards the center, meeting in at most N steps.";
            
            timeBreakdown.push({ operation: "Convergence loop", complexity: "O(N)" });
            spaceBreakdown.push({ structure: "Iterative Pointers", complexity: "O(1)" });
            
            stepExplanations.push(
                "One pointer starts at index 0, the other starts at index N - 1.",
                "In each iteration, the distance between pointers decreases by at least 1.",
                "They meet in at most N iterations, leading to linear O(N) time complexity."
            );

            detections.push({
                title: "Two Pointer Loop",
                detectedType: "two_pointer",
                codeSnippet: "while(left < right)",
                complexity: "O(N)",
                explanation: "Left and right pointers start at opposite ends and move towards each other. Total movement is bounded by N.",
                visualTree: ["Left →", "Right ←", "Total movement ≤ N"]
            });
        } else if (isRecursive) {
            const isDivideAndConquer = /mid|split|left.*right|\/2/.test(code) && (code.match(new RegExp(`\\b${recursiveFuncName}\\b`, 'g')) || []).length >= 2;
            if (isDivideAndConquer) {
                timeComplexity = "O(N log N)";
                spaceComplexity = "O(N)";
                patternName = "Recursion / Divide & Conquer";
                titleName = "Divide & Conquer Recursion";
                explanation = "Recursively divides problem of size N into halves and merges. Tree depth is log N, work per level is N.";
                
                timeBreakdown.push({ operation: "Subproblem splits", complexity: "O(log N) levels" });
                timeBreakdown.push({ operation: "Work per level", complexity: "O(N)" });
                timeBreakdown.push({ operation: "Total Time", complexity: "O(N log N)" });
                spaceBreakdown.push({ structure: "Recursion Stack & Aux Array", complexity: "O(N)" });
                
                stepExplanations.push(
                    "The problem of size N is halved at each recursion step, forming log N levels.",
                    "At each level of the tree, merging or processing requires N work.",
                    "Multiplying levels by work gives O(N log N) total time complexity.",
                    "Space complexity is O(N) due to the auxiliary arrays and recursion stack."
                );

                detections.push({
                    title: "Divide and Conquer Tree",
                    detectedType: "recursion",
                    codeSnippet: recursiveFuncName + "(mid)",
                    complexity: "O(N log N)",
                    explanation: "Tree of depth log N with N work per level. Highly efficient divide-and-conquer strategy.",
                    visualTree: ["Levels = log N", "Work per level = N", "Total = N log N"]
                });
            } else {
                timeComplexity = "O(N)";
                spaceComplexity = "O(N)";
                patternName = "Recursion";
                titleName = "Simple Recursion";
                explanation = "Recursively calls itself N times, using O(N) space on the call stack.";
                
                timeBreakdown.push({ operation: "Recursive Calls", complexity: "O(N)" });
                spaceBreakdown.push({ structure: "Call Stack frames", complexity: "O(N)" });
                
                stepExplanations.push(
                    "Each call creates a new stack frame on the call stack.",
                    "It goes down to a depth of N before reaching the base case and returning.",
                    "Therefore, both time and space complexity are O(N)."
                );

                detections.push({
                    title: "Recursion Call Stack",
                    detectedType: "recursion",
                    codeSnippet: recursiveFuncName + "(n-1)",
                    complexity: "O(N) Space",
                    explanation: "The depth of recursive calls matches the input size N, creating N activation records on the stack.",
                    visualTree: [recursiveFuncName + "(n)", "↓", "N stack frames", "↓", "O(N) space"]
                });
            }
        } else if (maxNesting >= 3) {
            timeComplexity = "O(N³)";
            spaceComplexity = "O(1)";
            patternName = "Triple Nested Loops";
            titleName = "Cubic Iteration";
            explanation = "Three nested loops executing N times each, resulting in O(N³) cubic time complexity.";
            
            timeBreakdown.push({ operation: "Outer Loop", complexity: "O(N)" });
            timeBreakdown.push({ operation: "Middle Loop", complexity: "O(N)" });
            timeBreakdown.push({ operation: "Inner Loop", complexity: "O(N)" });
            timeBreakdown.push({ operation: "Total Time", complexity: "O(N³)" });
            spaceBreakdown.push({ structure: "Iterators / Local vars", complexity: "O(1)" });
            
            stepExplanations.push(
                "Outer loop executes N times.",
                "For every outer iteration, the middle loop executes N times.",
                "For every middle iteration, the inner loop executes N times.",
                "Multiplying the iterations: N × N × N = N³ total operations."
            );

            detections.push({
                title: "Triple Nested Loops",
                detectedType: "loop",
                codeSnippet: "for(...) { for(...) { for(...) } }",
                complexity: "O(N³)",
                explanation: "Three levels of nested loops. Very expensive for large N.",
                visualTree: ["N", "×", "N", "×", "N", "=", "N³"]
            });
        } else if (maxNesting === 2) {
            timeComplexity = "O(N²)";
            spaceComplexity = "O(1)";
            patternName = "Nested Loops";
            titleName = "Quadratic Iteration";
            explanation = "Two nested loops executing N times each, resulting in O(N²) quadratic time complexity.";
            
            timeBreakdown.push({ operation: "Outer Loop", complexity: "O(N)" });
            timeBreakdown.push({ operation: "Inner Loop", complexity: "O(N)" });
            timeBreakdown.push({ operation: "Total Time", complexity: "O(N²)" });
            spaceBreakdown.push({ structure: "Iterators / Local vars", complexity: "O(1)" });
            
            stepExplanations.push(
                "Outer loop executes N times.",
                "For every outer iteration, the inner loop executes N times.",
                "Multiplying the iterations: N × N = N² total operations."
            );

            detections.push({
                title: "Nested Loops",
                detectedType: "loop",
                codeSnippet: "for(...) { for(...) }",
                complexity: "O(N²)",
                explanation: "Two levels of nested loops. Typical of brute force comparisons or nested grid scans.",
                visualTree: ["n", "×", "n", "=", "n²"]
            });
        } else if (loopCount >= 2) {
            timeComplexity = "O(N)";
            spaceComplexity = "O(1)";
            patternName = "Independent Loops";
            titleName = "Multi-Pass Linear Scan";
            explanation = "Multiple independent loops execute in sequence. Their complexities add up linearly (N + N = 2N -> O(N)).";
            
            timeBreakdown.push({ operation: "First Loop Traversal", complexity: "O(N)" });
            timeBreakdown.push({ operation: "Second Loop Traversal", complexity: "O(N)" });
            timeBreakdown.push({ operation: "Total Time", complexity: "O(N)" });
            spaceBreakdown.push({ structure: "Iterative Pointers", complexity: "O(1)" });
            
            stepExplanations.push(
                "First loop runs N times to perform initial work.",
                "Second loop runs N times independently afterwards.",
                "Total operations are O(N) + O(N) = O(2N).",
                "Simplifying Big-O: constant coefficients are dropped, yielding O(N)."
            );

            detections.push({
                title: "Independent Loops",
                detectedType: "loop",
                codeSnippet: "for(...)\nfor(...)",
                complexity: "O(N)",
                explanation: "Sequential loops that do not nest. Complexities add rather than multiply.",
                visualTree: ["O(n) + O(n)", "↓", "O(2n)", "↓", "O(n)"]
            });
        } else {
            const hasLoop = loopCount === 1;
            timeComplexity = hasLoop ? "O(N)" : "O(1)";
            spaceComplexity = "O(1)";
            patternName = hasLoop ? "Iteration / Linear Scan" : "Constant Execution";
            titleName = hasLoop ? "Linear Traversal" : "Constant-time logic";
            explanation = hasLoop 
                ? "The algorithm traverses the input sequentially with a single loop." 
                : "The algorithm runs in constant time without any loops or recursion.";
            
            if (hasLoop) {
                timeBreakdown.push({ operation: "Loop Traversal", complexity: "O(N)" });
                spaceBreakdown.push({ structure: "Iterative variables", complexity: "O(1)" });
                stepExplanations.push(
                    "The loop starts at index 0 and advances incrementally.",
                    "It iterates exactly N times, executing O(1) constant-time operations inside.",
                    "Therefore, the overall time complexity is O(N)."
                );
                detections.push({
                    title: "Single Loop",
                    detectedType: "loop",
                    codeSnippet: "for(int i=0; i<n; i++)",
                    complexity: "O(N)",
                    explanation: "Iterates through the data once. Standard traversal model.",
                    visualTree: ["for loop", "↓", "n iterations", "↓", "O(n)"]
                });
            } else {
                timeBreakdown.push({ operation: "Constant time operations", complexity: "O(1)" });
                spaceBreakdown.push({ structure: "Local variables", complexity: "O(1)" });
                stepExplanations.push(
                    "The algorithm executes a fixed set of instructions without looping.",
                    "Each operation runs in O(1) time.",
                    "Therefore, total complexity is O(1)."
                );
            }
        }

        // Add standard STL detections if present
        if (hasVector) {
            detections.push({
                title: "Vector Container",
                detectedType: "stl_container",
                codeSnippet: "vector<int> v;",
                complexity: "O(1) access",
                explanation: "Dynamic array container. Provides O(1) random access, O(1) amortized push_back/pop_back, and O(N) element insert/erase."
            });
            spaceBreakdown.push({ structure: "Dynamic Vector Allocation", complexity: "O(N)" });
            if (spaceComplexity === "O(1)") spaceComplexity = "O(N)";
        }
        if (hasUnorderedMap) {
            detections.push({
                title: "Unordered Map (Hash Map)",
                detectedType: "stl_container",
                codeSnippet: "unordered_map<int, int> mp;",
                complexity: "O(1) average",
                explanation: "Hash table structure. Searching, inserting, and deleting items take O(1) average time, but O(N) in the worst-case due to hash collisions."
            });
            spaceBreakdown.push({ structure: "Hash Map bucket storage", complexity: "O(k)" });
            if (spaceComplexity === "O(1)") spaceComplexity = "O(k)";
        }
        if (hasUnorderedSet) {
            detections.push({
                title: "Unordered Set (Hash Set)",
                detectedType: "stl_container",
                codeSnippet: "unordered_set<int> s;",
                complexity: "O(1) average",
                explanation: "Hash table storing unique keys. Search and insert take O(1) average time."
            });
            spaceBreakdown.push({ structure: "Hash Set storage", complexity: "O(n)" });
            if (spaceComplexity === "O(1)") spaceComplexity = "O(N)";
        }
        if (hasMap) {
            detections.push({
                title: "Map (Ordered Dictionary)",
                detectedType: "stl_container",
                codeSnippet: "map<int, int> mp;",
                complexity: "O(log N)",
                explanation: "Implemented as a Red-Black Tree. Elements are sorted, and find, insert, and delete take logarithmic time O(log N)."
            });
            spaceBreakdown.push({ structure: "Red-Black Tree Nodes", complexity: "O(n)" });
            if (spaceComplexity === "O(1)") spaceComplexity = "O(N)";
        }
        if (hasSet) {
            detections.push({
                title: "Set (Ordered Set)",
                detectedType: "stl_container",
                codeSnippet: "set<int> s;",
                complexity: "O(log N)",
                explanation: "Implemented as a Red-Black Tree. Maintains unique sorted elements. Operations take O(log N) time."
            });
            spaceBreakdown.push({ structure: "Red-Black Tree Nodes", complexity: "O(n)" });
            if (spaceComplexity === "O(1)") spaceComplexity = "O(N)";
        }
        if (hasPriorityQueue) {
            detections.push({
                title: "Priority Queue (Heap)",
                detectedType: "stl_container",
                codeSnippet: "priority_queue<int> pq;",
                complexity: "O(log N) push/pop",
                explanation: "Implemented as a binary heap. Accessing the top element is O(1). Inserting and deleting elements take logarithmic time O(log N)."
            });
            spaceBreakdown.push({ structure: "Binary Heap array", complexity: "O(n)" });
            if (spaceComplexity === "O(1)") spaceComplexity = "O(N)";
        }
        if (hasStack) {
            detections.push({
                title: "Stack (LIFO)",
                detectedType: "stl_container",
                codeSnippet: "stack<int> st;",
                complexity: "O(1) operations",
                explanation: "Last-In-First-Out adapter. Push, pop, and top are constant-time O(1) operations."
            });
            spaceBreakdown.push({ structure: "Stack elements", complexity: "O(n)" });
            if (spaceComplexity === "O(1)") spaceComplexity = "O(N)";
        }
        if (hasQueue) {
            detections.push({
                title: "Queue (FIFO)",
                detectedType: "stl_container",
                codeSnippet: "queue<int> q;",
                complexity: "O(1) operations",
                explanation: "First-In-First-Out adapter. Push (enqueue), pop (dequeue), and front are constant-time O(1) operations."
            });
            spaceBreakdown.push({ structure: "Queue elements", complexity: "O(n)" });
            if (spaceComplexity === "O(1)") spaceComplexity = "O(N)";
        }

        // Space Breakdown formatting
        if (spaceBreakdown.length === 0) {
            spaceBreakdown.push({ structure: "Primitive Variables", complexity: "O(1)" });
        } else {
            const seen = new Set();
            const uniq = [];
            for (const item of spaceBreakdown) {
                if (!seen.has(item.structure)) {
                    seen.add(item.structure);
                    uniq.push(item);
                }
            }
            if (!seen.has("Variables")) {
                uniq.push({ structure: "Variables", complexity: "O(1)" });
            }
            spaceBreakdown.length = 0;
            spaceBreakdown.push(...uniq);
        }

        // Setup learningMode comparisons
        let learningMode = {
            bruteForce: { time: "O(N²)", space: "O(1)", explanation: "Nested loops checking all elements." },
            optimized: { time: "O(N)", space: "O(1)", explanation: "Linear scans or single loop algorithms." },
            improvement: "O(N²) → O(N)",
            optimizationReason: "Using sliding window or hash map instead of checking all pairs reduces time complexity to linear."
        };

        if (timeComplexity === "O(1)") {
            learningMode = {
                bruteForce: { time: "O(N)", space: "O(1)", explanation: "Sequential scan checking each item." },
                optimized: { time: "O(1)", space: "O(1)", explanation: "Direct index lookup or mathematical formulas." },
                improvement: "O(N) → O(1)",
                optimizationReason: "Mathematical formulas or lookup tables can replace iterative scans."
            };
        } else if (timeComplexity === "O(log N)") {
            learningMode = {
                bruteForce: { time: "O(N)", space: "O(1)", explanation: "Linear search checks each element one by one." },
                optimized: { time: "O(log N)", space: "O(1)", explanation: "Binary search on sorted input splits search bounds recursively." },
                improvement: "O(N) → O(log N)",
                optimizationReason: "Binary search on sorted input reduces search bounds logarithmically compared to linear search."
            };
        } else if (timeComplexity === "O(N log N)") {
            learningMode = {
                bruteForce: { time: "O(N²)", space: "O(1)", explanation: "Bubble or selection sort comparing every pair." },
                optimized: { time: "O(N log N)", space: "O(N)", explanation: "Merge sort or heapsort dividing subarrays recursively." },
                improvement: "O(N²) → O(N log N)",
                optimizationReason: "Divide and conquer structures (like Merge Sort or Quicksort) divide sorting work recursively, making it faster than O(N²) bubble/selection sort."
            };
        } else if (timeComplexity === "O(N²)") {
            learningMode = {
                bruteForce: { time: "O(N²)", space: "O(1)", explanation: "Nested loops checking all pair combinations." },
                optimized: { time: "O(N log N) / O(N)", space: "O(N)", explanation: "HashMap search or preprocessing using sorting." },
                improvement: "O(N²) → O(N)",
                optimizationReason: "Optimizing nested loops can be achieved using Hash Maps (for O(N) sum search) or Sorting first (for O(N log N) pair search)."
            };
        } else if (timeComplexity === "O(N)") {
            if (hasUnorderedMap) {
                learningMode = {
                    bruteForce: { time: "O(N²)", space: "O(1)", explanation: "Brute force checks all pairs in nested loops." },
                    optimized: { time: "O(N)", space: "O(N)", explanation: "HashMap stores visited values, making lookups constant time." },
                    improvement: "O(N²) → O(N)",
                    optimizationReason: "A Hash Map trades space for time, storing past elements to perform lookup in O(1) instead of nested linear scans."
                };
            } else if (hasTwoPointers || hasSlidingWindow) {
                learningMode = {
                    bruteForce: { time: "O(N²)", space: "O(1)", explanation: "Brute force checks all subarrays or elements using nested loops." },
                    optimized: { time: "O(N)", space: "O(1)", explanation: "Two pointers move forward without backtracking." },
                    improvement: "O(N²) → O(N)",
                    optimizationReason: "Two pointers converge/slide monotonically, ensuring elements are visited at most twice."
                };
            } else {
                learningMode = {
                    bruteForce: { time: "O(N)", space: "O(1)", explanation: "Iterating element-by-element." },
                    optimized: { time: "O(N)", space: "O(1)", explanation: "Optimal single pass iteration." },
                    improvement: "Optimal solution is active",
                    optimizationReason: "The linear time complexity is optimal for reading all elements in the input."
                };
            }
        }

        const explanationMap: Record<string, string> = {};
        lines.forEach((line, idx) => {
            const lineNum = idx + 1;
            const trimmed = line.trim();
            if (trimmed.startsWith('for') || trimmed.startsWith('while')) {
                explanationMap[String(lineNum)] = "Loop iterates to process inputs.";
            } else if (trimmed.startsWith('unordered_map') || trimmed.startsWith('map')) {
                explanationMap[String(lineNum)] = "Initializes lookup map.";
            } else if (trimmed.includes('return')) {
                explanationMap[String(lineNum)] = "Returns calculated result.";
            }
        });

        return {
            title: titleName,
            timeComplexity,
            spaceComplexity,
            complexityExplanation: explanation,
            pattern: patternName,
            explanation: explanationMap,
            overview: `Analyzed code using fallback heuristic parsing. Identified ${patternName} pattern.`,
            timeBreakdown,
            spaceBreakdown,
            stepExplanations,
            detections,
            learningMode
        };
    }

    private mockAnalyze(code: string): any {
        return this.heuristicAnalyze(code);
    }

    private mockFlowchart(code: string): any {
        return {
            markdown: `graph TD;\nA([Start]) --> B[Process];\nB --> C([End]);`,
            mapping: {}
        };
    }

    private mockTrace(code: string): any {
        return {
            success: false,
            error: "No API Key available to generate trace."
        };
    }
}

import { FlowchartData, FlowchartNodeMetadata } from '../types';

// Helper Class to build Mermaid Syntax with enhanced visualization support
class MermaidBuilder {
    private nodes: string[] = [];
    private edges: string[] = [];
    private nidCount: number = 0;
    private mapping: Record<string, string> = {};                     // Line -> NodeId
    private nodeMetadata: Record<string, FlowchartNodeMetadata> = {}; // NodeId -> Metadata
    private executionOrder: string[] = [];                            // Nodes in visitation order

    // Generate unique ID
    private nextId(): string {
        return `n${this.nidCount++}`;
    }

    public addNode(
        id: string,
        label: string,
        line?: number,
        metadata?: FlowchartNodeMetadata
    ): void {
        this.nodes.push(`${id}${label}`);
        if (line) {
            this.mapping[String(line)] = id;
        }
        if (metadata) {
            this.nodeMetadata[id] = metadata;
        }
        // Add to execution order (will be refined during traversal)
        this.executionOrder.push(id);
    }

    public addEdge(from: string, to: string, label?: string): void {
        const arrow = label ? `-->|${label}|` : '-->';
        this.edges.push(`${from} ${arrow} ${to}`);

        // Track branches in node metadata
        if (label && this.nodeMetadata[from]) {
            if (!this.nodeMetadata[from].branches) {
                this.nodeMetadata[from].branches = [];
            }
            this.nodeMetadata[from].branches!.push({ label, targetNodeId: to });
        }
    }

    public toString(): string {
        return `graph TD;\n${this.nodes.join(';\n')};\n${this.edges.join(';\n')};`;
    }

    public toJSON(): FlowchartData {
        return {
            markdown: this.toString(),
            mapping: this.mapping,
            nodeMetadata: this.nodeMetadata,
            executionOrder: this.executionOrder
        };
    }

    // Process a block of statements and return the last node ID
    public processBlock(statements: any[], entryId: string, firstEdgeLabel?: string): string {
        let prevId = entryId;
        let isFirst = true;

        for (const stmt of statements) {
            const nodeId = this.nextId();
            const line = stmt.line;

            if (stmt.type === 'IfStatement') {
                // Decision diamond for if/else
                const cond = this.sanitize(this.expressionToString(stmt.test));
                this.addNode(nodeId, `{${cond}?}`, line, {
                    type: 'decision',
                    condition: cond
                });
                this.addEdge(prevId, nodeId, isFirst ? firstEdgeLabel : undefined);

                // True branch (consequent)
                const trueStmts = stmt.consequent.type === 'Block' ? stmt.consequent.body : [stmt.consequent];
                const trueEndId = this.processBlock(trueStmts, nodeId, "Yes ✓");

                // False branch (alternate)
                let falseEndId = nodeId;
                if (stmt.alternate) {
                    const falseStmts = stmt.alternate.type === 'Block' ? stmt.alternate.body : [stmt.alternate];
                    falseEndId = this.processBlock(falseStmts, nodeId, "No ✗");
                }

                // Merge point after if/else
                const mergeId = this.nextId();
                this.addNode(mergeId, `(( ))`, undefined, { type: 'merge' });
                this.addEdge(trueEndId, mergeId);
                if (stmt.alternate) {
                    this.addEdge(falseEndId, mergeId);
                } else {
                    this.addEdge(nodeId, mergeId, "No ✗");
                }
                prevId = mergeId;
            }
            else if (stmt.type === 'WhileStatement' || stmt.type === 'ForStatement') {
                // Loop with actual looping arrow
                const testExpr = stmt.test ? this.expressionToString(stmt.test) : "true";
                const cond = this.sanitize(testExpr);

                // Loop condition node (diamond shape)
                this.addNode(nodeId, `{🔄 ${cond}?}`, line, {
                    type: 'loop',
                    condition: cond
                });
                this.addEdge(prevId, nodeId, isFirst ? firstEdgeLabel : undefined);

                // Loop body
                const bodyStmts = stmt.body.type === 'Block' ? stmt.body.body : [stmt.body];
                const bodyEndId = this.processBlock(bodyStmts, nodeId, "True ↓");

                // Loop back arrow - this is the key visual for loops!
                this.addEdge(bodyEndId, nodeId, "↩ Repeat");

                // Exit path
                const exitId = this.nextId();
                this.addNode(exitId, `(( ))`, undefined, { type: 'merge' });
                this.addEdge(nodeId, exitId, "False → Exit");
                prevId = exitId;
            }
            else if (stmt.type === 'SwitchStatement') {
                // Switch with fan-out to cases
                const switchExpr = this.sanitize(this.expressionToString(stmt.discriminant));
                this.addNode(nodeId, `{Switch: ${switchExpr}}`, line, {
                    type: 'decision',
                    condition: switchExpr
                });
                this.addEdge(prevId, nodeId, isFirst ? firstEdgeLabel : undefined);

                // Create merge point for all cases
                const mergeId = this.nextId();
                this.addNode(mergeId, `(( ))`, undefined, { type: 'merge' });

                // Process each case
                if (stmt.cases && Array.isArray(stmt.cases)) {
                    for (const caseClause of stmt.cases) {
                        const caseLabel = caseClause.test
                            ? `case ${this.expressionToString(caseClause.test)}`
                            : 'default';
                        const caseEndId = this.processBlock(caseClause.consequent || [], nodeId, caseLabel);
                        this.addEdge(caseEndId, mergeId);
                    }
                }
                prevId = mergeId;
            }
            else {
                // Regular statement - determine type and use appropriate shape
                let label = this.getStatementLabel(stmt);
                let metadata: FlowchartNodeMetadata = { type: 'process' };

                // Stack/Queue operations: Use cylinder/database shape
                if (label.startsWith('Push') || label.startsWith('Pop')) {
                    this.addNode(nodeId, `[("📥 ${label}")]`, line, {
                        type: 'data_structure',
                        dataStructure: 'stack'
                    });
                }
                else if (label.startsWith('Enqueue') || label.startsWith('Dequeue')) {
                    this.addNode(nodeId, `[("📤 ${label}")]`, line, {
                        type: 'data_structure',
                        dataStructure: 'queue'
                    });
                }
                else if (label.startsWith('Insert')) {
                    this.addNode(nodeId, `[("➕ ${label}")]`, line, {
                        type: 'data_structure',
                        dataStructure: 'array'
                    });
                }
                // Function Call: Use subroutine shape
                else if (label.startsWith('Call')) {
                    this.addNode(nodeId, `[[📞 ${label}]]`, line, { type: 'call' });
                }
                // Return: Use stadium shape
                else if (label.startsWith('Return')) {
                    this.addNode(nodeId, `([🔙 ${label}])`, line, { type: 'return' });
                }
                // Output/Input: Use parallelogram
                else if (label.startsWith('Output') || label.startsWith('Input')) {
                    this.addNode(nodeId, `[/${label}/]`, line, { type: 'process' });
                }
                // Default process box
                else {
                    this.addNode(nodeId, `[${label}]`, line, { type: 'process' });
                }

                this.addEdge(prevId, nodeId, isFirst ? firstEdgeLabel : undefined);
                prevId = nodeId;
            }
            isFirst = false;
        }
        return prevId;
    }

    private expressionToString(expr: any): string {
        if (!expr) return "";
        if (expr.type === 'BinaryExpression') {
            return `${this.expressionToString(expr.left)} ${expr.operator} ${this.expressionToString(expr.right)}`;
        }
        if (expr.type === 'Identifier') return expr.name;
        if (expr.type === 'Literal') {
            if (typeof expr.value === 'string') return `'${expr.value}'`;
            return String(expr.value);
        }
        if (expr.type === 'CallExpression') {
            const callee = this.expressionToString(expr.callee);
            return `${callee}()`;
        }
        if (expr.type === 'MemberExpression') {
            return `${this.expressionToString(expr.object)}.${this.expressionToString(expr.property)}`;
        }
        if (expr.type === 'UpdateExpression') {
            return `${this.expressionToString(expr.argument)}${expr.operator}`;
        }
        return "...";
    }

    private getStatementLabel(stmt: any): string {
        // Variable Declaration
        if (stmt.type === 'VariableDeclaration') {
            if (stmt.init && stmt.init.type === 'CallExpression') {
                const callee = this.expressionToString(stmt.init.callee);
                return `Call ${callee} → ${stmt.name}`;
            }
            if (stmt.init) {
                const val = this.expressionToString(stmt.init);
                return `${stmt.name} = ${this.sanitize(val)}`;
            }
            return `Declare ${stmt.name}`;
        }

        // Assignment
        if (stmt.type === 'Assignment') {
            const target = stmt.left ? this.expressionToString(stmt.left) : stmt.name;
            const val = this.expressionToString(stmt.value);
            return `${target} = ${this.sanitize(val)}`;
        }

        // Output (cout)
        if (stmt.type === 'ExpressionStatement' && stmt.expression.type === 'BinaryExpression' && stmt.expression.operator === '<<') {
            return "Output";
        }

        // Input (cin)
        if (stmt.type === 'ExpressionStatement' && stmt.expression.type === 'BinaryExpression' && stmt.expression.operator === '>>') {
            return "Input";
        }

        // Stack/Queue Operations
        if (stmt.type === 'ExpressionStatement' && stmt.expression.type === 'CallExpression') {
            const call = stmt.expression;
            const callee = this.expressionToString(call.callee);
            if (callee.includes('.push')) return `Push to ${callee.split('.')[0]}`;
            if (callee.includes('.pop')) return `Pop from ${callee.split('.')[0]}`;
            if (callee.includes('.push_back')) return `Push to ${callee.split('.')[0]}`;
            if (callee.includes('.push_front')) return `Enqueue to ${callee.split('.')[0]}`;
            if (callee.includes('.pop_front')) return `Dequeue from ${callee.split('.')[0]}`;
            if (callee.includes('.insert')) return `Insert into ${callee.split('.')[0]}`;
            if (callee.includes('.erase')) return `Remove from ${callee.split('.')[0]}`;
            return `Call ${callee}`;
        }

        // Return
        if (stmt.type === 'ReturnStatement') {
            if (stmt.argument && this.containsCall(stmt.argument)) {
                return `Return & Call`;
            }
            if (stmt.argument) {
                return `Return ${this.sanitize(this.expressionToString(stmt.argument))}`;
            }
            return "Return";
        }

        // Update expression (i++, i--)
        if (stmt.type === 'UpdateExpression') {
            return this.expressionToString(stmt);
        }
        if (stmt.type === 'ExpressionStatement' && stmt.expression.type === 'UpdateExpression') {
            return this.expressionToString(stmt.expression);
        }

        // Process generic ExpressionStatement (avoid empty string)
        if (stmt.type === 'ExpressionStatement') {
            return this.sanitize(this.expressionToString(stmt.expression));
        }

        return stmt.type.replace('Statement', '').replace('Expression', '');
    }

    // Helper to check for nested calls (recursion detection)
    private containsCall(expr: any): boolean {
        if (!expr) return false;
        if (expr.type === 'CallExpression') return true;
        if (expr.type === 'BinaryExpression') return this.containsCall(expr.left) || this.containsCall(expr.right);
        return false;
    }

    private sanitize(str: string): string {
        return str.replace(/"/g, "'").replace(/[\[\]\{\}\(\)]/g, '').substring(0, 25);
    }
}

