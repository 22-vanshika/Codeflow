import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FileCode, Activity, PlayCircle, BarChart3, HelpCircle } from 'lucide-react';

interface Step {
  num: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

const steps: Step[] = [
  {
    num: "01",
    title: "Paste Your Code",
    desc: "Drop in your algorithmic solution inside our workspace. We support C++ syntax validation, smart imports, and template starters.",
    icon: <FileCode size={20} />,
    color: "var(--primary)"
  },
  {
    num: "02",
    title: "Compile Execution Trace",
    desc: "Our engine executes your code, capturing deep memory states, variable values, call stacks, and recursion trees on every step.",
    icon: <Activity size={20} />,
    color: "var(--accent-purple)"
  },
  {
    num: "03",
    title: "Watch Visualization",
    desc: "Hit Play to watch data structures animate in real time. Hover over array cells, step through recursion logs, and inspect nodes.",
    icon: <PlayCircle size={20} />,
    color: "var(--accent-cyan)"
  },
  {
    num: "04",
    title: "Verify Space & Time",
    desc: "Examine execution logs, space complexity traces, and AI explanations to solidify your understanding of algorithm mechanics.",
    icon: <BarChart3 size={20} />,
    color: "var(--accent-green)"
  }
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position inside this component for a scrolling line effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Grow glowing line based on scroll
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={containerRef} className="py-24 px-6 relative overflow-hidden bg-black/5">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-text-secondary text-xs font-bold uppercase tracking-wider mb-6"
          >
            <HelpCircle size={12} className="text-primary" />
            Simple Workflow
          </motion.div>
          <h2 className="text-3xl sm:text-5xl font-black text-text-primary mb-6 tracking-tight">
            How CodeFlow Works
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Translate abstract code structures into visual logic in 4 simple stages.
          </p>
        </div>

        {/* Timeline Path container */}
        <div className="relative">
          {/* Static gray timeline line on mobile */}
          <div className="absolute left-4 md:hidden top-0 bottom-0 w-[2px] bg-border-subtle -translate-x-[1px]" />
          
          {/* Scrolling glowing progress line on mobile */}
          <motion.div 
            className="absolute left-4 md:hidden top-0 bottom-0 w-[2.5px] bg-gradient-to-b from-primary via-secondary to-accent-green origin-top -translate-x-[1.25px] shadow-[0_0_10px_rgba(59,130,246,0.3)]"
            style={{ scaleY }}
          />

          {/* Curved SVG Wave Line on desktop */}
          <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
            <svg 
              className="w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
              fill="none"
            >
              <defs>
                <linearGradient id="timeline-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="50%" stopColor="var(--secondary)" />
                  <stop offset="100%" stopColor="var(--accent-green)" />
                </linearGradient>
              </defs>
              
              {/* Static gray curved path */}
              <path 
                d="M 50,0 C 50,4 60,6 60,12.5 C 60,19 40,21 40,37.5 C 40,46 60,49 60,62.5 C 60,71 40,74 40,87.5 C 40,94 50,96 50,100"
                stroke="var(--border-subtle)" 
                strokeWidth="0.5" 
                strokeLinecap="round"
              />
              
              {/* Scrolling glowing progress path */}
              <motion.path 
                d="M 50,0 C 50,4 60,6 60,12.5 C 60,19 40,21 40,37.5 C 40,46 60,49 60,62.5 C 60,71 40,74 40,87.5 C 40,94 50,96 50,100"
                stroke="url(#timeline-gradient)" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                style={{ pathLength: scrollYProgress }}
                className="drop-shadow-[0_0_12px_rgba(123,116,209,0.5)]"
              />
            </svg>
          </div>

          {/* Steps container */}
          <div className="relative z-10 flex flex-col justify-between">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div 
                  key={idx} 
                  className="relative flex flex-col md:flex-row items-start md:items-center w-full min-h-[160px] md:min-h-[180px] py-6 md:py-0"
                >
                  
                  {/* Left Side Column */}
                  <div className={`w-full md:w-[55%] md:pr-16 md:text-right order-1 ${isEven ? '' : 'hidden md:block md:w-[40%]'}`}>
                    {isEven && (
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="pl-12 md:pl-0"
                      >
                        <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-cyan opacity-25 font-mono mb-2 block select-none">
                          {step.num}
                        </span>
                        <h3 className="text-xl font-bold text-text-primary mb-3">{step.title}</h3>
                        <p className="text-text-secondary text-sm leading-relaxed max-w-md md:ml-auto">{step.desc}</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Bullet (Winding positioning on desktop) */}
                  <div 
                    className={`absolute left-0 w-8 h-8 rounded-full bg-surface border-2 flex items-center justify-center -translate-x-[15px] z-20 transition-all duration-500 shadow-xl
                      ${isEven ? 'md:left-[60%] md:-translate-x-4' : 'md:left-[40%] md:-translate-x-4'}`}
                    style={{ borderColor: step.color }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: step.color }} />
                  </div>

                  {/* Right Side Column */}
                  <div className={`w-full md:w-[55%] pl-12 md:pl-16 order-2 ${!isEven ? '' : 'hidden md:block md:w-[40%]'}`}>
                    {!isEven && (
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent-cyan opacity-25 font-mono mb-2 block select-none">
                          {step.num}
                        </span>
                        <h3 className="text-xl font-bold text-text-primary mb-3">{step.title}</h3>
                        <p className="text-text-secondary text-sm leading-relaxed max-w-md md:mr-auto">{step.desc}</p>
                      </motion.div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
