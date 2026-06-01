import { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronRight, ChevronLeft, RotateCcw, Sparkles, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type AlgoType = 'bubble' | 'binary' | 'dfs';

interface DemoStep {
  line: number;
  highlightedIndices: number[]; // e.g. compared or current
  pointers: Record<string, number>; // low, high, mid, pivot
  dataState: any; // array or tree structure
  log: string;
  variables: Record<string, any>;
}

// 1. Bubble Sort Trace
const bubbleCode = [
  "void bubbleSort(int arr[], int n) {",
  "    for (int i = 0; i < n-1; i++) {", // 1
  "        for (int j = 0; j < n-i-1; j++) {", // 2
  "            if (arr[j] > arr[j+1]) {", // 3
  "                swap(arr[j], arr[j+1]);", // 4
  "            }",
  "        }",
  "    }",
  "}"
];

const bubbleSteps: DemoStep[] = [
  { line: 1, highlightedIndices: [], pointers: { i: 0 }, dataState: [5, 2, 8, 1, 3], log: "Outer loop: i = 0", variables: { i: 0, j: "N/A", "arr[j]": "N/A", "arr[j+1]": "N/A" } },
  { line: 2, highlightedIndices: [], pointers: { i: 0, j: 0 }, dataState: [5, 2, 8, 1, 3], log: "Inner loop: j = 0", variables: { i: 0, j: 0, "arr[j]": 5, "arr[j+1]": 2 } },
  { line: 3, highlightedIndices: [0, 1], pointers: { i: 0, j: 0 }, dataState: [5, 2, 8, 1, 3], log: "Comparing arr[0] (5) and arr[1] (2) — Swap required", variables: { i: 0, j: 0, "arr[j]": 5, "arr[j+1]": 2 } },
  { line: 4, highlightedIndices: [0, 1], pointers: { i: 0, j: 0 }, dataState: [2, 5, 8, 1, 3], log: "Swapping 5 and 2", variables: { i: 0, j: 0, "arr[j]": 2, "arr[j+1]": 5 } },
  { line: 2, highlightedIndices: [], pointers: { i: 0, j: 1 }, dataState: [2, 5, 8, 1, 3], log: "Inner loop: j = 1", variables: { i: 0, j: 1, "arr[j]": 5, "arr[j+1]": 8 } },
  { line: 3, highlightedIndices: [1, 2], pointers: { i: 0, j: 1 }, dataState: [2, 5, 8, 1, 3], log: "Comparing arr[1] (5) and arr[2] (8) — No swap", variables: { i: 0, j: 1, "arr[j]": 5, "arr[j+1]": 8 } },
  { line: 2, highlightedIndices: [], pointers: { i: 0, j: 2 }, dataState: [2, 5, 8, 1, 3], log: "Inner loop: j = 2", variables: { i: 0, j: 2, "arr[j]": 8, "arr[j+1]": 1 } },
  { line: 3, highlightedIndices: [2, 3], pointers: { i: 0, j: 2 }, dataState: [2, 5, 8, 1, 3], log: "Comparing arr[2] (8) and arr[3] (1) — Swap required", variables: { i: 0, j: 2, "arr[j]": 8, "arr[j+1]": 1 } },
  { line: 4, highlightedIndices: [2, 3], pointers: { i: 0, j: 2 }, dataState: [2, 5, 1, 8, 3], log: "Swapping 8 and 1", variables: { i: 0, j: 2, "arr[j]": 1, "arr[j+1]": 8 } },
  { line: 2, highlightedIndices: [], pointers: { i: 0, j: 3 }, dataState: [2, 5, 1, 8, 3], log: "Inner loop: j = 3", variables: { i: 0, j: 3, "arr[j]": 8, "arr[j+1]": 3 } },
  { line: 3, highlightedIndices: [3, 4], pointers: { i: 0, j: 3 }, dataState: [2, 5, 1, 8, 3], log: "Comparing arr[3] (8) and arr[4] (3) — Swap required", variables: { i: 0, j: 3, "arr[j]": 8, "arr[j+1]": 3 } },
  { line: 4, highlightedIndices: [3, 4], pointers: { i: 0, j: 3 }, dataState: [2, 5, 1, 3, 8], log: "Swapping 8 and 3. Array end element 8 is now sorted.", variables: { i: 0, j: 3, "arr[j]": 3, "arr[j+1]": 8 } }
];

// 2. Binary Search Trace
const binaryCode = [
  "int binarySearch(int arr[], int target) {",
  "    int low = 0, high = n - 1;", // 1
  "    while (low <= high) {", // 2
  "        int mid = low + (high - low) / 2;", // 3
  "        if (arr[mid] == target) return mid;", // 4
  "        if (arr[mid] < target)", // 5
  "            low = mid + 1;", // 6
  "        else",
  "            high = mid - 1;", // 8
  "    }",
  "    return -1;",
  "}"
];

const binarySteps: DemoStep[] = [
  { line: 1, highlightedIndices: [], pointers: { low: 0, high: 6 }, dataState: [1, 3, 4, 6, 8, 9, 12], log: "Init: low = 0, high = 6 (Search space indices 0 to 6)", variables: { low: 0, high: 6, mid: "N/A", "arr[mid]": "N/A" } },
  { line: 2, highlightedIndices: [], pointers: { low: 0, high: 6 }, dataState: [1, 3, 4, 6, 8, 9, 12], log: "Checking: low (0) <= high (6) — True", variables: { low: 0, high: 6, mid: "N/A", "arr[mid]": "N/A" } },
  { line: 3, highlightedIndices: [], pointers: { low: 0, high: 6, mid: 3 }, dataState: [1, 3, 4, 6, 8, 9, 12], log: "Calculating mid = (0+6)/2 = 3 (value 6)", variables: { low: 0, high: 6, mid: 3, "arr[mid]": 6 } },
  { line: 4, highlightedIndices: [3], pointers: { low: 0, high: 6, mid: 3 }, dataState: [1, 3, 4, 6, 8, 9, 12], log: "Comparing arr[3] (6) with target (9) — Not matching", variables: { low: 0, high: 6, mid: 3, "arr[mid]": 6 } },
  { line: 5, highlightedIndices: [3], pointers: { low: 0, high: 6, mid: 3 }, dataState: [1, 3, 4, 6, 8, 9, 12], log: "Checking if arr[mid] (6) < target (9) — True", variables: { low: 0, high: 6, mid: 3, "arr[mid]": 6 } },
  { line: 6, highlightedIndices: [], pointers: { low: 4, high: 6, mid: 3 }, dataState: [1, 3, 4, 6, 8, 9, 12], log: "Updating bounds: low = mid + 1 = 4", variables: { low: 4, high: 6, mid: 3, "arr[mid]": 6 } },
  { line: 2, highlightedIndices: [], pointers: { low: 4, high: 6 }, dataState: [1, 3, 4, 6, 8, 9, 12], log: "Checking: low (4) <= high (6) — True", variables: { low: 4, high: 6, mid: "N/A", "arr[mid]": "N/A" } },
  { line: 3, highlightedIndices: [], pointers: { low: 4, high: 6, mid: 5 }, dataState: [1, 3, 4, 6, 8, 9, 12], log: "Calculating mid = 4 + (6-4)/2 = 5 (value 9)", variables: { low: 4, high: 6, mid: 5, "arr[mid]": 9 } },
  { line: 4, highlightedIndices: [5], pointers: { low: 4, high: 6, mid: 5 }, dataState: [1, 3, 4, 6, 8, 9, 12], log: "Comparing arr[5] (9) with target (9) — Match found!", variables: { low: 4, high: 6, mid: 5, "arr[mid]": 9 } }
];

// 3. DFS Tree Trace
const dfsCode = [
  "void preorder(Node* root) {",
  "    if (root == NULL) return;", // 1
  "    visit(root->val);", // 2
  "    preorder(root->left);", // 3
  "    preorder(root->right);", // 4
  "}"
];

// Tree representation:
//      (1)
//     /   \
//   (2)   (3)
//   / \
// (4) (5)
const dfsSteps: DemoStep[] = [
  { line: 1, highlightedIndices: [1], pointers: { root: 1 }, dataState: [], log: "DFS Preorder: Visiting Root Node (1)", variables: { node: 1, visited: "[]" } },
  { line: 2, highlightedIndices: [1], pointers: { root: 1 }, dataState: [1], log: "Visiting Node 1: Add to visited list", variables: { node: 1, visited: "[1]" } },
  { line: 3, highlightedIndices: [2], pointers: { root: 2 }, dataState: [1], log: "Traversing left child: preorder(Node 2)", variables: { node: 2, visited: "[1]" } },
  { line: 2, highlightedIndices: [2], pointers: { root: 2 }, dataState: [1, 2], log: "Visiting Node 2: Add to visited list", variables: { node: 2, visited: "[1, 2]" } },
  { line: 3, highlightedIndices: [4], pointers: { root: 4 }, dataState: [1, 2], log: "Traversing left child: preorder(Node 4)", variables: { node: 4, visited: "[1, 2]" } },
  { line: 2, highlightedIndices: [4], pointers: { root: 4 }, dataState: [1, 2, 4], log: "Visiting Node 4: Add to visited list", variables: { node: 4, visited: "[1, 2, 4]" } },
  { line: 3, highlightedIndices: [], pointers: { root: 0 }, dataState: [1, 2, 4], log: "Left child is NULL, backtracking...", variables: { node: "NULL", visited: "[1, 2, 4]" } },
  { line: 4, highlightedIndices: [], pointers: { root: 0 }, dataState: [1, 2, 4], log: "Right child is NULL, backtracking...", variables: { node: "NULL", visited: "[1, 2, 4]" } },
  { line: 4, highlightedIndices: [5], pointers: { root: 5 }, dataState: [1, 2, 4], log: "Back at Node 2. Traversing right child: preorder(Node 5)", variables: { node: 5, visited: "[1, 2, 4]" } },
  { line: 2, highlightedIndices: [5], pointers: { root: 5 }, dataState: [1, 2, 4, 5], log: "Visiting Node 5: Add to visited list", variables: { node: 5, visited: "[1, 2, 4, 5]" } },
  { line: 4, highlightedIndices: [3], pointers: { root: 3 }, dataState: [1, 2, 4, 5], log: "Back at Root (Node 1). Traversing right child: preorder(Node 3)", variables: { node: 3, visited: "[1, 2, 4, 5]" } },
  { line: 2, highlightedIndices: [3], pointers: { root: 3 }, dataState: [1, 2, 4, 5, 3], log: "Visiting Node 3: Add to visited list. Preorder finished.", variables: { node: 3, visited: "[1, 2, 4, 5, 3]" } }
];

export default function LiveDemo() {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgoType>('bubble');
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500); // ms delay
  const timerRef = useRef<any>(null);

  const getSteps = (): DemoStep[] => {
    if (selectedAlgo === 'bubble') return bubbleSteps;
    if (selectedAlgo === 'binary') return binarySteps;
    return dfsSteps;
  };

  const getCode = (): string[] => {
    if (selectedAlgo === 'bubble') return bubbleCode;
    if (selectedAlgo === 'binary') return binaryCode;
    return dfsCode;
  };

  const stepsList = getSteps();
  const codeLines = getCode();
  const currentStep = stepsList[stepIndex] || stepsList[0];

  // Auto playback control
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= stepsList.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, selectedAlgo, stepsList.length]);

  const handleNext = () => {
    setIsPlaying(false);
    setStepIndex((prev) => Math.min(prev + 1, stepsList.length - 1));
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStepIndex(0);
  };

  const handleAlgoChange = (algo: AlgoType) => {
    setIsPlaying(false);
    setSelectedAlgo(algo);
    setStepIndex(0);
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-black/10 border-t border-border-subtle">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-text-secondary text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Sparkles size={12} className="text-primary animate-pulse" />
            Interactive Playground
          </motion.div>
          <h2 className="text-3xl sm:text-5xl font-black text-text-primary mb-6 tracking-tight">
            Try it Live Now
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Step through array index swaps, binary searches, and graph traces directly in your browser without leaving the page.
          </p>
        </div>

        {/* Outer Layout: Selector Tabs + Simulator */}
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex justify-center flex-wrap gap-2.5">
            {(['bubble', 'binary', 'dfs'] as AlgoType[]).map((type) => {
              const label = type === 'bubble' ? 'Bubble Sort' : type === 'binary' ? 'Binary Search' : 'Tree DFS';
              return (
                <button
                  key={type}
                  onClick={() => handleAlgoChange(type)}
                  className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full border transition-all cursor-pointer ${
                    selectedAlgo === type
                      ? 'bg-primary border-primary text-white shadow-md'
                      : 'bg-white/5 border-border-subtle text-text-secondary hover:text-text-primary hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Simulator Box */}
          <div className="liquid-glass-card p-5 sm:p-7 border border-white/10 shadow-2xl flex flex-col md:h-[560px] bg-white/[0.01]">
            
            {/* Header / Controller */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5 mb-6 border-b border-border-subtle pb-5">
              
              {/* Left: Playback controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="w-9 h-9 rounded-full bg-white/5 border border-border-subtle hover:border-primary/20 text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center cursor-pointer"
                  title="Reset Playback"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={handlePrev}
                  disabled={stepIndex === 0}
                  className="w-9 h-9 rounded-full bg-white/5 border border-border-subtle hover:border-primary/20 text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center justify-center cursor-pointer"
                  title="Step Backward"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-text-primary text-bg-main border border-text-primary font-bold text-xs rounded-full h-9 px-5 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                  title={isPlaying ? "Pause" : "Play Trace"}
                >
                  {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  onClick={handleNext}
                  disabled={stepIndex === stepsList.length - 1}
                  className="w-9 h-9 rounded-full bg-white/5 border border-border-subtle hover:border-primary/20 text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center justify-center cursor-pointer"
                  title="Step Forward"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Center: Slider */}
              <div className="flex items-center gap-3 w-full sm:w-auto max-w-xs h-9">
                <span className="text-[10px] uppercase font-bold text-text-muted select-none">Speed</span>
                <input
                  type="range"
                  min="600"
                  max="2500"
                  step="200"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-28 accent-primary h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] font-mono text-text-secondary w-12">{(speed / 1000).toFixed(1)}s</span>
              </div>

              {/* Right: Step indices */}
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-text-muted uppercase text-[10px] font-bold select-none">Step:</span>
                <span className="font-bold text-primary bg-primary/10 border border-primary/20 h-9 px-3.5 rounded-xl flex items-center justify-center min-w-[70px]">
                  {stepIndex + 1} / {stepsList.length}
                </span>
              </div>

            </div>

            {/* Split Display: Code View on left, Visualization on right */}
            <div className="grid md:grid-cols-12 gap-6 flex-1 min-h-0">
              
              {/* Left side: Monaco-like code block */}
              <div className="md:col-span-6 flex flex-col font-mono text-[12.5px] bg-black/25 dark:bg-black/20 border border-border-subtle rounded-3xl p-4 overflow-auto no-scrollbar relative">
                <div className="absolute right-3.5 top-3 text-[10px] font-bold text-text-muted flex items-center gap-1">
                  <Terminal size={11} className="text-primary" />
                  source.cpp
                </div>
                {codeLines.map((line, idx) => {
                  const isCurrent = currentStep.line === idx;
                  return (
                    <div
                      key={idx}
                      className={`flex py-0.5 px-2 -mx-2 rounded transition-all duration-300 ${
                        isCurrent
                          ? 'bg-primary/15 border-l-[3px] border-primary text-text-primary font-bold shadow-[0_0_12px_rgba(59,130,246,0.08)]'
                          : 'text-text-secondary/65 border-l-[3px] border-transparent'
                      }`}
                    >
                      <span className={`w-4 text-right mr-4 select-none font-bold text-[10px] ${
                        isCurrent ? 'text-primary' : 'text-text-muted/30'
                      }`}>
                        {idx + 1}
                      </span>
                      <pre className="whitespace-pre">{line}</pre>
                    </div>
                  );
                })}
              </div>

              {/* Right side: Visualization container */}
              <div className="md:col-span-6 flex flex-col gap-4 min-h-0">
                
                {/* Main Visualizer Stage */}
                <div className="flex-1 bg-black/25 dark:bg-black/20 border border-border-subtle rounded-3xl p-4 flex flex-col items-center justify-center min-h-[220px]">
                  
                  {/* Bubble Sort Visual (Bar Graph swapping) */}
                  {selectedAlgo === 'bubble' && (
                    <div className="flex items-end justify-center gap-3.5 w-full max-w-sm h-32 px-4">
                      {(currentStep.dataState as number[]).map((val, idx) => {
                        const isHighlighted = currentStep.highlightedIndices.includes(idx);
                        return (
                          <div key={idx} className="flex flex-col items-center flex-1">
                            <motion.div
                              layout
                              transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                              style={{ height: `${val * 14}px` }}
                              className={`w-full rounded-t-lg border transition-all duration-300 ${
                                isHighlighted
                                  ? 'bg-accent-cyan/25 border-accent-cyan shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-105'
                                  : 'bg-primary/25 border-primary/45'
                              }`}
                            />
                            <span className="text-[10px] font-bold text-text-secondary mt-2">{val}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Binary Search Visual (Boxes mapping pointers) */}
                  {selectedAlgo === 'binary' && (
                    <div className="flex items-center justify-center gap-1.5 w-full max-w-sm flex-wrap">
                      {(currentStep.dataState as number[]).map((val, idx) => {
                        const isLow = currentStep.pointers.low === idx;
                        const isHigh = currentStep.pointers.high === idx;
                        const isMid = currentStep.pointers.mid === idx;
                        const isHighlighted = currentStep.highlightedIndices.includes(idx);
                        const isExcluded = idx < currentStep.pointers.low || idx > currentStep.pointers.high;

                        let styleClass = "border-white/20 bg-white/10 text-text-secondary";
                        if (isExcluded) {
                          styleClass = "border-white/5 bg-white/5 opacity-15 text-text-muted";
                        } else if (isMid) {
                          styleClass = "border-accent-green bg-accent-green/15 text-accent-green font-extrabold scale-105 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
                        } else if (isHighlighted) {
                          styleClass = "border-primary bg-primary/10 text-white";
                        }

                        return (
                          <div key={idx} className="flex flex-col items-center min-w-[28px] max-w-[36px] flex-1">
                            <span className="text-[8px] font-bold text-text-muted mb-1 select-none">{idx}</span>
                            <div className={`w-full h-8 flex items-center justify-center rounded-lg border text-[11px] transition-all duration-300 ${styleClass}`}>
                              {val}
                            </div>
                            <div className="h-4 flex gap-0.5 mt-1 font-bold text-[7px] select-none text-center">
                              {isLow && <span className="text-accent-red">LOW</span>}
                              {isHigh && <span className="text-accent-purple">HIGH</span>}
                              {isMid && <span className="text-accent-green">MID</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* DFS Preorder Tree Visual (Node graph lighting up) */}
                  {selectedAlgo === 'dfs' && (
                    <svg className="w-full max-w-xs h-36" viewBox="0 0 200 100">
                      {/* Connections */}
                      <g stroke="var(--border-subtle)" strokeWidth="1.5">
                        <line x1="100" y1="15" x2="60" y2="45" />
                        <line x1="100" y1="15" x2="140" y2="45" />
                        <line x1="60" y1="45" x2="35" y2="75" />
                        <line x1="60" y1="45" x2="85" y2="75" />
                      </g>

                      {/* Nodes mapping */}
                      {[
                        { id: 1, cx: 100, cy: 15, label: "1" },
                        { id: 2, cx: 60, cy: 45, label: "2" },
                        { id: 3, cx: 140, cy: 45, label: "3" },
                        { id: 4, cx: 35, cy: 75, label: "4" },
                        { id: 5, cx: 85, cy: 75, label: "5" }
                      ].map((node) => {
                        const isVisited = (currentStep.dataState as number[]).includes(node.id);
                        const isCurrent = currentStep.pointers.root === node.id;
                        
                        let fillClass = "fill-surface stroke-white/25";
                        if (isCurrent) {
                          fillClass = "fill-accent-cyan stroke-white stroke-2 shadow-lg scale-105 animate-pulse";
                        } else if (isVisited) {
                          fillClass = "fill-accent-green stroke-white stroke-2 shadow-md";
                        }

                        return (
                          <g key={node.id}>
                            <circle cx={node.cx} cy={node.cy} r="9" className={`transition-all duration-300 ${fillClass}`} />
                            <text x={node.cx} y={node.cy + 3.5} textAnchor="middle" className="text-[8px] font-bold fill-text-primary pointer-events-none">
                              {node.label}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  )}

                </div>

                {/* Variables Panel */}
                <div className="bg-black/25 dark:bg-black/20 border border-border-subtle rounded-3xl p-4 flex flex-col">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3.5 block">
                    Variable Inspector & call stack
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {Object.entries(currentStep.variables).map(([name, value]) => {
                      return (
                        <div key={name} className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-border-subtle">
                          <span className="text-text-muted">{name}:</span>
                          <span className="font-bold text-text-primary">{value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom status log banner */}
            <div className="mt-4 bg-primary/5 border border-primary/20 rounded-2xl p-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary flex-shrink-0">
                <Terminal size={14} />
              </div>
              <div className="text-xs">
                <p className="font-bold text-text-primary uppercase tracking-wide text-[9px] mb-0.5">Execution Logger</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${selectedAlgo}-${stepIndex}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="text-text-secondary leading-relaxed font-semibold"
                  >
                    {currentStep.log}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
