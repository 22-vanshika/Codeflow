import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, Play, Award, ShieldAlert } from 'lucide-react';

interface MetricItem {
  id: number;
  label: string;
  target: number;
  suffix: string;
  decimals: boolean;
  desc: string;
  icon: React.ReactNode;
}

const metrics: MetricItem[] = [
  {
    id: 1,
    label: "Execution Latency",
    target: 0.1,
    suffix: "ms",
    decimals: true,
    desc: "C++ trace compiler delivers snapshots instantly.",
    icon: <Zap size={22} className="text-primary" />
  },
  {
    id: 2,
    label: "Render Frame Rate",
    target: 60,
    suffix: " FPS",
    decimals: false,
    desc: "Silky smooth WebGL and SVG structural animations.",
    icon: <Play size={22} className="text-accent-cyan" />
  },
  {
    id: 3,
    label: "Supported Problems",
    target: 200,
    suffix: "+",
    decimals: false,
    desc: "Curated DSA exercises from Arrays to Graph pathfinding.",
    icon: <Award size={22} className="text-accent-purple" />
  },
  {
    id: 4,
    label: "Trace Accuracy",
    target: 100,
    suffix: "%",
    decimals: false,
    desc: "State-to-state variable mutations are fully verified.",
    icon: <ShieldAlert size={22} className="text-accent-green" />
  }
];

export default function PerformanceMetrics() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section ref={containerRef} className="py-20 px-6 relative overflow-hidden bg-black/5">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Metric Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} startCount={isInView} />
          ))}
        </div>

      </div>
    </section>
  );
}

function MetricCard({ metric, startCount }: { metric: MetricItem; startCount: boolean }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!startCount) return;

    let startTime: number | null = null;
    const duration = 1500; // ms

    const runCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const currentVal = progress * metric.target;
      setVal(metric.decimals ? Math.round(currentVal * 10) / 10 : Math.floor(currentVal));

      if (progress < 1) {
        requestAnimationFrame(runCount);
      }
    };

    requestAnimationFrame(runCount);
  }, [startCount, metric.target, metric.decimals]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="liquid-glass-card p-6 border border-white/5 bg-white/[0.01] hover:border-primary/10 transition-all flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
          {metric.icon}
        </div>
      </div>

      <div>
        <span className="text-4xl sm:text-5xl font-black text-text-primary font-mono tracking-tight block mb-2 select-none">
          {val.toFixed(metric.decimals ? 1 : 0)}
          <span className="text-primary font-black">{metric.suffix}</span>
        </span>
        <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">
          {metric.label}
        </h4>
        <p className="text-text-muted text-[11px] leading-relaxed">
          {metric.desc}
        </p>
      </div>
    </motion.div>
  );
}
