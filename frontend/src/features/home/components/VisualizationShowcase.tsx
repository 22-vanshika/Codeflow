import { motion } from 'framer-motion';
import { GitCommit, Network, Layers, ArrowRightLeft, Grid, Sparkles, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface ShowcaseCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  desc: string;
  category: string;
  color: string;
}

const cards: ShowcaseCard[] = [
  {
    id: 'tree',
    title: 'Tree Visualization',
    icon: <GitCommit className="rotate-90" size={24} />,
    desc: 'Visualize recursive traversals (Pre, In, Post order) on binary trees and AVL trees in real time.',
    category: 'Hierarchical',
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400'
  },
  {
    id: 'graph',
    title: 'Graph Visualization',
    icon: <Network size={24} />,
    desc: 'Watch BFS, DFS, Dijkstra, and A* pathfind through dense node grids and custom networks.',
    category: 'Non-Linear',
    color: 'from-purple-500/20 to-pink-500/20 text-purple-400'
  },
  {
    id: 'stack',
    title: 'Stack & Queue',
    icon: <Layers size={24} />,
    desc: 'Inspect LIFO and FIFO execution traces. Watch elements push, pop, enqueue, and dequeue.',
    category: 'Linear',
    color: 'from-blue-500/20 to-indigo-500/20 text-blue-400'
  },
  {
    id: 'list',
    title: 'Linked List',
    icon: <ArrowRightLeft size={24} />,
    desc: 'Trace pointer reassignments, node inserts, and list reversals with intuitive node arrows.',
    category: 'Sequential',
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400'
  },
  {
    id: 'dp',
    title: 'Dynamic Programming',
    icon: <Grid size={24} />,
    desc: 'Demystify memoization and tabulation. See DP grids fill value-by-value with direction flows.',
    category: 'Optimization',
    color: 'from-amber-500/20 to-orange-500/20 text-amber-400'
  }
];

export default function VisualizationShowcase() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-black/10 border-t border-border-subtle">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-text-secondary text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Sparkles size={12} className="text-primary animate-pulse" />
            Algorithm Showcase
          </motion.div>
          <h2 className="text-3xl sm:text-5xl font-black text-text-primary mb-6 tracking-tight">
            Designed for Every Structure
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            CodeFlow parses your code and automatically renders beautiful, responsive visual components tailored to the active structures.
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {cards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="liquid-glass-card p-6 border border-white/5 hover:border-primary/20 shadow-xl flex flex-col justify-between relative overflow-hidden group min-h-[380px] bg-white/[0.02]"
            >
              {/* Dynamic Gradient background shift */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none`} />

              <div>
                {/* Category & Badge */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    {card.category}
                  </span>
                  <div className={`p-2.5 rounded-xl bg-white/5 border border-white/5 transition-all group-hover:scale-110 group-hover:bg-primary/10 ${card.color.split(' ')[2]}`}>
                    {card.icon}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 text-text-primary group-hover:text-primary transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                  {card.desc}
                </p>
              </div>

              {/* Graphic Preview Box */}
              <div className="w-full h-32 rounded-2xl bg-black/35 border border-white/5 overflow-hidden flex items-center justify-center relative bg-gradient-to-b from-black/20 to-black/45">
                
                {/* Tree Animation preview */}
                {card.id === 'tree' && (
                  <svg className="w-full h-full p-4" viewBox="0 0 200 100">
                    <line x1="100" y1="20" x2="60" y2="50" stroke="var(--border-subtle)" strokeWidth="2" />
                    <line x1="100" y1="20" x2="140" y2="50" stroke="var(--border-subtle)" strokeWidth="2" />
                    <line x1="60" y1="50" x2="35" y2="80" stroke="var(--border-subtle)" strokeWidth="1.5" />
                    <line x1="60" y1="50" x2="85" y2="80" stroke="var(--border-subtle)" strokeWidth="1.5" />
                    
                    {/* Root */}
                    <circle 
                      cx="100" cy="20" r="10" 
                      className={`transition-all duration-300 ${
                        hoveredCard === 'tree' ? 'fill-primary stroke-white stroke-2 shadow-lg animate-pulse' : 'fill-surface stroke-border-subtle'
                      }`}
                    />
                    
                    {/* Left node */}
                    <circle 
                      cx="60" cy="50" r="8" 
                      className={`transition-all duration-300 delay-100 ${
                        hoveredCard === 'tree' ? 'fill-accent-cyan stroke-white stroke-2 shadow-lg' : 'fill-surface stroke-border-subtle'
                      }`}
                    />
                    {/* Right node */}
                    <circle 
                      cx="140" cy="50" r="8" 
                      className={`transition-all duration-300 delay-200 ${
                        hoveredCard === 'tree' ? 'fill-secondary stroke-white stroke-2 shadow-lg' : 'fill-surface stroke-border-subtle'
                      }`}
                    />
                    
                    {/* Leaf 1 */}
                    <circle 
                      cx="35" cy="80" r="7" 
                      className={`transition-all duration-300 delay-300 ${
                        hoveredCard === 'tree' ? 'fill-accent-green stroke-white stroke-2 shadow-lg' : 'fill-surface stroke-border-subtle'
                      }`}
                    />
                    {/* Leaf 2 */}
                    <circle 
                      cx="85" cy="80" r="7" 
                      className={`transition-all duration-300 delay-400 ${
                        hoveredCard === 'tree' ? 'fill-accent-green stroke-white stroke-2' : 'fill-surface stroke-border-subtle'
                      }`}
                    />
                  </svg>
                )}

                {/* Graph Pathfinding preview */}
                {card.id === 'graph' && (
                  <svg className="w-full h-full p-4" viewBox="0 0 200 100">
                    <path 
                      d="M 30 50 Q 80 15 100 50 T 170 50" 
                      fill="none" 
                      stroke="var(--border-subtle)" 
                      strokeWidth="2" 
                    />
                    <path 
                      d="M 30 50 Q 100 85 170 50" 
                      fill="none" 
                      stroke="var(--border-subtle)" 
                      strokeWidth="2" 
                    />
                    
                    {/* Node points */}
                    <circle cx="30" cy="50" r="8" className="fill-surface stroke-border-subtle" />
                    <circle cx="100" cy="50" r="8" className="fill-surface stroke-border-subtle" />
                    <circle cx="170" cy="50" r="8" className="fill-surface stroke-border-subtle" />
                    
                    {/* Path pulse animation */}
                    {hoveredCard === 'graph' && (
                      <>
                        <circle cx="30" cy="50" r="8" className="fill-primary stroke-white stroke-2 animate-ping" />
                        <circle cx="170" cy="50" r="8" className="fill-secondary stroke-white stroke-2" />
                        <circle r="4" className="fill-accent-cyan">
                          <animateMotion 
                            path="M 30 50 Q 80 15 100 50 T 170 50" 
                            dur="2s" 
                            repeatCount="indefinite" 
                          />
                        </circle>
                        <circle r="4" className="fill-accent-purple">
                          <animateMotion 
                            path="M 30 50 Q 100 85 170 50" 
                            dur="2s" 
                            repeatCount="indefinite" 
                          />
                        </circle>
                      </>
                    )}
                  </svg>
                )}

                {/* Stack Push/Pop preview */}
                {card.id === 'stack' && (
                  <svg className="w-full h-full p-4" viewBox="0 0 200 100">
                    {/* Container frame */}
                    <path d="M 80 20 L 80 85 L 120 85 L 120 20" fill="none" stroke="var(--border-subtle)" strokeWidth="2.5" />
                    
                    {/* Floating block 1 */}
                    <rect 
                      x="85" y="68" width="30" height="13" rx="3"
                      className={`fill-primary/70 stroke-primary transition-all duration-500 ${
                        hoveredCard === 'stack' ? 'translate-y-0 opacity-100' : 'translate-y-[-50px] opacity-0'
                      }`}
                    />
                    {/* Floating block 2 */}
                    <rect 
                      x="85" y="52" width="30" height="13" rx="3"
                      className={`fill-secondary/70 stroke-secondary transition-all duration-500 delay-200 ${
                        hoveredCard === 'stack' ? 'translate-y-0 opacity-100' : 'translate-y-[-50px] opacity-0'
                      }`}
                    />
                    {/* Floating block 3 */}
                    <rect 
                      x="85" y="36" width="30" height="13" rx="3"
                      className={`fill-accent-cyan/70 stroke-accent-cyan transition-all duration-500 delay-400 ${
                        hoveredCard === 'stack' ? 'translate-y-0 opacity-100' : 'translate-y-[-50px] opacity-0'
                      }`}
                    />
                  </svg>
                )}

                {/* Linked List pointer manipulation preview */}
                {card.id === 'list' && (
                  <svg className="w-full h-full p-4" viewBox="0 0 200 100">
                    {/* Node 1 */}
                    <rect x="25" y="35" width="30" height="25" rx="4" className="fill-surface stroke-border-subtle" />
                    <line x1="45" y1="35" x2="45" y2="60" stroke="var(--border-subtle)" />
                    <text x="35" y="51" fill="currentColor" className="text-[10px] font-bold">12</text>
                    
                    {/* Node 2 */}
                    <rect x="85" y="35" width="30" height="25" rx="4" className="fill-surface stroke-border-subtle" />
                    <line x1="105" y1="35" x2="105" y2="60" stroke="var(--border-subtle)" />
                    <text x="95" y="51" fill="currentColor" className="text-[10px] font-bold">45</text>

                    {/* Node 3 */}
                    <rect x="145" y="35" width="30" height="25" rx="4" className="fill-surface stroke-border-subtle" />
                    <line x1="165" y1="35" x2="165" y2="60" stroke="var(--border-subtle)" />
                    <text x="155" y="51" fill="currentColor" className="text-[10px] font-bold">99</text>

                    {/* Arrow Connections */}
                    <g stroke="var(--border-subtle)" strokeWidth="1.5">
                      <line x1="50" y1="47.5" x2="80" y2="47.5" />
                      <line x1="110" y1="47.5" x2="140" y2="47.5" />
                    </g>
                    
                    {/* Glowing Pointer Shift */}
                    {hoveredCard === 'list' && (
                      <g stroke="var(--primary)" strokeWidth="2">
                        <line x1="50" y1="47.5" x2="80" y2="47.5" className="stroke-primary" />
                        <line x1="110" y1="47.5" x2="140" y2="47.5" className="stroke-accent-cyan" />
                        <circle cx="50" cy="47.5" r="3" className="fill-white" />
                        <circle cx="110" cy="47.5" r="3" className="fill-white" />
                      </g>
                    )}
                  </svg>
                )}

                {/* DP Grid calculation preview */}
                {card.id === 'dp' && (
                  <div className="grid grid-cols-4 gap-1 p-2 w-32 h-20 items-center justify-center font-mono text-[9px] font-bold text-center">
                    {[...Array(8)].map((_, i) => {
                      const fillIndex = hoveredCard === 'dp' ? (i + 1) : 0;
                      return (
                        <div 
                          key={i} 
                          className={`w-7 h-7 flex items-center justify-center border rounded transition-all duration-300 ${
                            fillIndex > i 
                              ? 'bg-accent-orange/15 border-accent-orange text-accent-orange font-black scale-105 shadow-md shadow-accent-orange/5' 
                              : 'bg-white/5 border-white/5 text-text-muted/40'
                          }`}
                        >
                          {fillIndex > i ? (i * 2 + 1) : '0'}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Try workspace block */}
        <div className="text-center">
          <Link
            to="/workspace"
            className="capsule-btn-secondary inline-flex items-center gap-2 shadow-md"
          >
            Open Sandbox Workspace <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
