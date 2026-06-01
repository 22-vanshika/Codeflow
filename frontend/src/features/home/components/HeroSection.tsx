import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Code2, Play, Pause, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// Code lines for the live Binary Search simulator
const codeLines = [
  { text: "int binarySearch(int arr[], int n, int target) {", indent: 0 },
  { text: "    int low = 0, high = n - 1;", indent: 0 }, // 1
  { text: "    while (low <= high) {", indent: 0 }, // 2
  { text: "        int mid = low + (high - low) / 2;", indent: 0 }, // 3
  { text: "        if (arr[mid] == target)", indent: 0 }, // 4
  { text: "            return mid; // Found!", indent: 0 }, // 5
  { text: "        if (arr[mid] < target)", indent: 0 }, // 6
  { text: "            low = mid + 1;", indent: 0 }, // 7
  { text: "        else", indent: 0 }, // 8
  { text: "            high = mid - 1;", indent: 0 }, // 9
  { text: "    }", indent: 0 },
  { text: "    return -1;", indent: 0 }, // 11
  { text: "}", indent: 0 }
];

interface TraceStep {
  line: number;
  low: number;
  high: number;
  mid: number;
  status: string;
  variables: Record<string, string | number>;
}

// Pre-baked execution trace steps for Binary Search
// Searching for target 23 in array [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
const traceSteps: TraceStep[] = [
  { line: 1, low: 0, high: 9, mid: -1, status: "Initializing bounds: low = 0, high = 9", variables: { low: 0, high: 9, mid: "N/A", "arr[mid]": "N/A" } },
  { line: 2, low: 0, high: 9, mid: -1, status: "Checking loop condition: low (0) <= high (9)", variables: { low: 0, high: 9, mid: "N/A", "arr[mid]": "N/A" } },
  { line: 3, low: 0, high: 9, mid: 4, status: "Calculating mid index: 0 + (9-0)/2 = 4 (value: 16)", variables: { low: 0, high: 9, mid: 4, "arr[mid]": 16 } },
  { line: 4, low: 0, high: 9, mid: 4, status: "Comparing mid element 16 with target 23", variables: { low: 0, high: 9, mid: 4, "arr[mid]": 16 } },
  { line: 6, low: 0, high: 9, mid: 4, status: "Checking if arr[mid] (16) < target (23) — True", variables: { low: 0, high: 9, mid: 4, "arr[mid]": 16 } },
  { line: 7, low: 5, high: 9, mid: 4, status: "Updating lower bound: low = mid + 1 = 5", variables: { low: 5, high: 9, mid: 4, "arr[mid]": 16 } },
  { line: 2, low: 5, high: 9, mid: 4, status: "Loop condition: low (5) <= high (9) — True", variables: { low: 5, high: 9, mid: 4, "arr[mid]": 16 } },
  { line: 3, low: 5, high: 9, mid: 7, status: "Calculating mid: 5 + (9-5)/2 = 7 (value: 56)", variables: { low: 5, high: 9, mid: 7, "arr[mid]": 56 } },
  { line: 4, low: 5, high: 9, mid: 7, status: "Comparing mid element 56 with target 23", variables: { low: 5, high: 9, mid: 7, "arr[mid]": 56 } },
  { line: 6, low: 5, high: 9, mid: 7, status: "Checking if arr[mid] (56) < target (23) — False", variables: { low: 5, high: 9, mid: 7, "arr[mid]": 56 } },
  { line: 9, low: 5, high: 6, mid: 7, status: "Updating upper bound: high = mid - 1 = 6", variables: { low: 5, high: 6, mid: 7, "arr[mid]": 56 } },
  { line: 2, low: 5, high: 6, mid: 7, status: "Loop condition: low (5) <= high (6) — True", variables: { low: 5, high: 6, mid: 7, "arr[mid]": 56 } },
  { line: 3, low: 5, high: 6, mid: 5, status: "Calculating mid: 5 + (6-5)/2 = 5 (value: 23)", variables: { low: 5, high: 6, mid: 5, "arr[mid]": 23 } },
  { line: 4, low: 5, high: 6, mid: 5, status: "Comparing mid element 23 with target 23", variables: { low: 5, high: 6, mid: 5, "arr[mid]": 23 } },
  { line: 5, low: 5, high: 6, mid: 5, status: "Element found at index 5! Returning index.", variables: { low: 5, high: 6, mid: 5, "arr[mid]": 23 } }
];

const arrayData = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as any } }
};

export default function HeroSection() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const playTimerRef = useRef<any>(null);

  const activeStep = traceSteps[stepIndex];

  // Logic to handle auto-playing visualizer mockup
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setStepIndex((prev) => (prev + 1) % traceSteps.length);
      }, 1800);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying]);

  return (
    <section className="min-h-[92vh] flex items-center justify-center px-6 py-16 relative overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 max-w-7xl w-full grid lg:grid-cols-12 gap-12 lg:gap-8 items-center"
      >
        {/* Left Side: Copywriting */}
        <div className="lg:col-span-5 text-left flex flex-col justify-center">
          <motion.div 
            variants={itemVariants} 
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-md self-start"
          >
            <Sparkles size={14} className="text-primary animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Interactive Code visualizer</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants} 
            className="text-4xl sm:text-6xl lg:text-6xl font-black tracking-tight text-text-primary mb-6 leading-[1.05]"
          >
            See Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent-cyan to-secondary bg-300% animate-gradient-x font-extrabold">
              Code Think.
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants} 
            className="text-base sm:text-lg text-text-secondary mb-10 max-w-xl leading-relaxed"
          >
            Visualize algorithms, data structures, memory flow, and execution traces in real time. Learn DSA by watching your code execute step-by-step.
          </motion.p>

          <motion.div 
            variants={itemVariants} 
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto"
          >
            <button
              onClick={() => document.dispatchEvent(new CustomEvent('open-auth-modal'))}
              className="capsule-btn-primary group w-full sm:w-auto flex items-center justify-center gap-2"
              style={{
                boxShadow: '0 4px 20px var(--card-glow)'
              }}
            >
              Start Visualizing <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <Link
              to="/workspace"
              className="capsule-btn-secondary group w-full sm:w-auto flex items-center justify-center"
            >
              Explore Problems
            </Link>
          </motion.div>

          {/* Metrics / Social Proof */}
          <motion.div 
            variants={itemVariants} 
            className="mt-12 flex items-center gap-6 text-text-secondary border-t border-border-subtle pt-8 max-w-md"
          >
            <div className="flex -space-x-2.5">
              {[1, 2, 3, 4].map(i => (
                <div 
                  key={i} 
                  className="w-9 h-9 rounded-full border-2 border-bg-main bg-surface flex items-center justify-center overflow-hidden shadow-md"
                >
                  <div className={`w-full h-full bg-gradient-to-br ${
                    i === 1 ? 'from-primary/50 to-accent-cyan/50' : 
                    i === 2 ? 'from-secondary/50 to-primary/50' : 
                    i === 3 ? 'from-accent-cyan/50 to-accent-green/50' : 
                    'from-accent-orange/50 to-secondary/50'
                  }`} />
                </div>
              ))}
            </div>
            <p className="text-xs font-semibold">
              Trusted by <span className="text-text-primary font-bold">1,200+ developers</span> learning data structures.
            </p>
          </motion.div>
        </div>

        {/* Right Side: Interactive Algorithmic Simulator */}
        <div className="lg:col-span-7 w-full relative">
          {/* Radial ambient glow */}
          <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

          {/* Main Visualizer Container */}
          <motion.div 
            variants={itemVariants}
            className="relative liquid-glass-card p-5 sm:p-6 border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[560px] max-w-2xl mx-auto"
          >
            {/* Window bar */}
            <div className="flex items-center justify-between mb-5 border-b border-border-subtle pb-4">
              <div className="flex gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-accent-red/30 border border-accent-red/50" />
                <span className="w-3.5 h-3.5 rounded-full bg-accent-orange/30 border border-accent-orange/50" />
                <span className="w-3.5 h-3.5 rounded-full bg-accent-green/30 border border-accent-green/50" />
              </div>
              <div className="text-[11px] text-text-secondary font-mono bg-white/5 border border-white/5 px-4 py-1.5 rounded-full flex items-center gap-2">
                <Code2 size={13} className="text-primary" />
                binary_search.cpp
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-mono text-text-muted font-bold mr-1.5 select-none">
                  Step: <span className="text-accent-cyan font-bold">{stepIndex + 1}</span> / {traceSteps.length}
                </span>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-primary/20 text-text-secondary hover:text-white transition-colors cursor-pointer"
                  title={isPlaying ? "Pause Trace" : "Play Trace"}
                >
                  {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIndex(0);
                  }}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-primary/20 text-text-secondary hover:text-white transition-colors cursor-pointer"
                  title="Restart Trace"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>

            {/* Split Panel: Code on left, Visualizer on right/bottom */}
            <div className="grid md:grid-cols-12 gap-5 flex-1 min-h-0">
              {/* Code Panel */}
              <div className="md:col-span-7 flex flex-col font-mono text-[12px] bg-black/25 dark:bg-black/20 border border-border-subtle rounded-xl p-3.5 overflow-auto no-scrollbar relative">
                {codeLines.map((line, idx) => {
                  const isCurrent = activeStep.line === idx;
                  return (
                    <div 
                      key={idx}
                      className={`flex items-start py-0.5 px-2 -mx-2 rounded transition-all duration-300 ${
                        isCurrent 
                          ? 'bg-primary/15 border-l-[3px] border-primary text-text-primary font-bold shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                          : 'text-text-secondary/70 border-l-[3px] border-transparent'
                      }`}
                    >
                      <span className={`w-5 text-right mr-3.5 select-none font-bold text-[10px] ${
                        isCurrent ? 'text-primary' : 'text-text-muted/40'
                      }`}>
                        {idx.toString().padStart(2, '0')}
                      </span>
                      <pre className={`whitespace-pre ${isCurrent ? 'text-text-primary' : 'text-text-secondary/80'}`}>
                        {line.text}
                      </pre>
                    </div>
                  );
                })}
              </div>

              {/* Visualizer Panel */}
              <div className="md:col-span-5 flex flex-col gap-4 min-h-0">
                {/* Array rendering */}
                <div className="bg-black/25 dark:bg-black/20 border border-border-subtle rounded-xl p-4 flex flex-col justify-center flex-1">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3.5 block">
                    Array Memory
                  </span>
                  
                  <div className="flex items-center justify-between gap-1 w-full flex-wrap">
                    {arrayData.map((val, idx) => {
                      const isLow = activeStep.low === idx;
                      const isHigh = activeStep.high === idx;
                      const isMid = activeStep.mid === idx;
                      const inRange = idx >= activeStep.low && idx <= activeStep.high;

                      let cellClass = "border-border-subtle bg-white/5 dark:bg-black/10 opacity-30 text-text-muted";
                      if (inRange) {
                        cellClass = "border-primary/30 bg-primary/10 text-text-primary";
                      }
                      if (isMid) {
                        cellClass = "border-accent-green bg-accent-green/15 text-accent-green font-bold scale-105 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
                      }

                      return (
                        <div key={idx} className="flex flex-col items-center flex-1 min-w-[28px] max-w-[36px]">
                          <span className="text-[8px] font-bold text-text-muted mb-1">{idx}</span>
                          <div 
                            className={`w-full h-8 flex items-center justify-center rounded-lg border text-[11px] transition-all duration-300 ${cellClass}`}
                          >
                            {val}
                          </div>
                          <div className="h-4 flex gap-0.5 mt-1 select-none font-bold text-[7px] text-center">
                            {isLow && <span className="text-accent-red">L</span>}
                            {isHigh && <span className="text-accent-purple">H</span>}
                            {isMid && <span className="text-accent-green">M</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Variable Inspector */}
                <div className="bg-black/25 dark:bg-black/20 border border-border-subtle rounded-xl p-4 flex flex-col">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3 block">
                    Variables
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {Object.entries(activeStep.variables).map(([name, value]) => {
                      const isMid = name === 'mid' || name === 'arr[mid]';
                      return (
                        <div 
                          key={name} 
                          className="flex items-center justify-between p-2 rounded bg-white/5 border border-border-subtle"
                        >
                          <span className="text-text-muted">{name}:</span>
                          <span className={`font-bold ${isMid ? 'text-accent-green' : 'text-text-primary'}`}>{value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Trace description banner */}
            <div className="mt-4 bg-primary/5 border border-primary/10 rounded-xl p-3.5 flex items-start gap-3 transition-colors duration-300">
              <Zap size={15} className="text-primary mt-0.5 flex-shrink-0 animate-pulse" />
              <div className="text-xs">
                <p className="font-bold text-text-primary uppercase tracking-wide text-[9px] mb-0.5">Execution Log</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={stepIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="text-text-secondary leading-relaxed font-medium"
                  >
                    {activeStep.status}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
