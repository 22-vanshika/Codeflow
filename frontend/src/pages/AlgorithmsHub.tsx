import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Database, BookOpen, Lightbulb, ChevronRight, Search, Code2, CheckCircle, Zap, HelpCircle, ArrowRight } from 'lucide-react';
import DynamicBackground from '../components/DynamicBackground';
import { algorithms, algorithmCategories, getAlgorithmsByCategory, type AlgorithmEntry } from '../data/algorithms';
import { Link } from 'react-router-dom';

function ComplexityBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`flex flex-col items-center px-4 py-3 rounded-2xl border ${color} min-w-[90px]`}>
      <span className="text-[10px] font-black uppercase tracking-wider opacity-70 mb-1">{label}</span>
      <code className="text-sm font-black font-mono">{value}</code>
    </div>
  );
}

function AlgorithmDetail({ algo }: { algo: AlgorithmEntry }) {
  const [activeSection, setActiveSection] = useState<'overview' | 'complexity' | 'dryrun' | 'questions'>('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'complexity', label: 'Complexity', icon: Clock },
    { id: 'dryrun', label: 'Dry Run', icon: Code2 },
    { id: 'questions', label: 'Interview Qs', icon: HelpCircle },
  ] as const;

  return (
    <motion.div
      key={algo.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg-main/90 backdrop-blur-xl border-b border-border-subtle px-8 py-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {algo.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">{algo.name}</h1>
        <p className="text-text-secondary mt-1 leading-relaxed">{algo.shortDesc}</p>

        {/* Sub-tabs */}
        <div className="flex gap-1 mt-5">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeSection === s.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <s.icon size={14} />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 space-y-8">
        <AnimatePresence mode="wait">
          {activeSection === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Overview text */}
              <div className="liquid-glass-card p-6 mb-6">
                <p className="text-text-secondary leading-relaxed text-sm">{algo.overview}</p>
              </div>

              {/* How it works */}
              <div className="liquid-glass-card p-6 mb-6">
                <h3 className="text-sm font-black uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
                  <Zap size={14} /> How It Works
                </h3>
                <ol className="space-y-3">
                  {algo.howItWorks.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-black flex items-center justify-center">{i+1}</span>
                      <span className="text-text-secondary text-sm leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Key insight */}
              <div className="p-5 rounded-2xl bg-accent-yellow/5 border border-accent-yellow/20">
                <div className="flex items-start gap-3">
                  <Lightbulb size={18} className="text-accent-yellow flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black text-accent-yellow uppercase tracking-wider mb-1">Key Insight</p>
                    <p className="text-text-secondary text-sm leading-relaxed">{algo.keyInsight}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'complexity' && (
            <motion.div key="complexity" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Time Complexity */}
              <div className="liquid-glass-card p-6">
                <h3 className="text-sm font-black uppercase tracking-wider text-primary mb-5 flex items-center gap-2">
                  <Clock size={14} /> Time Complexity
                </h3>
                <div className="flex flex-wrap gap-3 mb-4">
                  <ComplexityBadge label="Best" value={algo.timeComplexity.best} color="bg-accent-green/10 border-accent-green/20 text-accent-green" />
                  <ComplexityBadge label="Average" value={algo.timeComplexity.average} color="bg-accent-orange/10 border-accent-orange/20 text-accent-orange" />
                  <ComplexityBadge label="Worst" value={algo.timeComplexity.worst} color="bg-accent-red/10 border-accent-red/20 text-accent-red" />
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{algo.timeComplexity.note}</p>
              </div>

              {/* Space Complexity */}
              <div className="liquid-glass-card p-6">
                <h3 className="text-sm font-black uppercase tracking-wider text-secondary mb-5 flex items-center gap-2">
                  <Database size={14} /> Space Complexity
                </h3>
                <div className="flex flex-wrap gap-3 mb-4">
                  <ComplexityBadge label="Space" value={algo.spaceComplexity.value} color="bg-secondary/10 border-secondary/20 text-secondary" />
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{algo.spaceComplexity.note}</p>
              </div>

              {/* Optimization opportunities */}
              <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20">
                <p className="text-xs font-black text-primary uppercase tracking-wider mb-2">Optimization Tip</p>
                <p className="text-text-secondary text-sm">
                  For most algorithms, you can trade space for time (memoization) or time for space (bit manipulation). Look for opportunities to reduce complexity by one factor through better data structures.
                </p>
              </div>
            </motion.div>
          )}

          {activeSection === 'dryrun' && (
            <motion.div key="dryrun" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="liquid-glass-card p-6">
                <h3 className="text-sm font-black uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
                  <Code2 size={14} /> Dry Run Example
                </h3>
                <div className="mb-4 p-3 bg-surface/80 rounded-xl border border-border-subtle font-mono text-sm">
                  <span className="text-text-muted text-xs font-sans font-bold uppercase tracking-wider">Input:</span>
                  <p className="text-white mt-1">{algo.dryRun.input}</p>
                </div>
                <div className="space-y-2 mb-4">
                  {algo.dryRun.steps.map((step, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="text-primary text-xs font-black font-mono mt-0.5 w-8 flex-shrink-0">#{i+1}</span>
                      <code className="text-text-secondary text-sm leading-relaxed font-mono">{step}</code>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-accent-green/10 border border-accent-green/20 rounded-xl font-mono text-sm">
                  <span className="text-text-muted text-xs font-sans font-bold uppercase tracking-wider">Output:</span>
                  <p className="text-accent-green mt-1 font-bold">{algo.dryRun.output}</p>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-2xl border border-border-subtle bg-surface/30 text-sm text-text-secondary">
                <p className="text-xs font-black text-primary uppercase tracking-wider mb-2 flex items-center gap-2"><CheckCircle size={12} /> Visualize This</p>
                <p>Load this algorithm into the CodeFlow workspace to watch the dry run animate step-by-step.</p>
                <Link to="/workspace" className="inline-flex items-center gap-2 mt-3 text-primary font-bold hover:text-white transition-colors">
                  Open Visualizer <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          )}

          {activeSection === 'questions' && (
            <motion.div key="questions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="liquid-glass-card p-6">
                <h3 className="text-sm font-black uppercase tracking-wider text-primary mb-4">Common Interview Questions</h3>
                <ul className="space-y-2">
                  {algo.commonQuestions.map((q, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                      <ChevronRight size={14} className="text-primary flex-shrink-0" />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="liquid-glass-card p-6">
                <h3 className="text-sm font-black uppercase tracking-wider text-secondary mb-4">Related Problems</h3>
                <ul className="space-y-2">
                  {algo.relatedProblems.map((p, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <span className="w-5 h-5 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-[10px] font-black flex items-center justify-center flex-shrink-0">{i+1}</span>
                      <span className="text-text-secondary">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center py-4">
                <Link to="/sheet" className="inline-flex items-center gap-2 text-primary font-bold hover:text-white transition-colors text-sm">
                  Practice on DSA Sheet <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function AlgorithmsHub() {
  const [activeCategory, setActiveCategory] = useState(algorithmCategories[0].id);
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmEntry>(algorithms[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  const categoryAlgos = getAlgorithmsByCategory(activeCategory);
  const filteredAlgos = searchQuery
    ? algorithms.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.tags.some(t => t.includes(searchQuery.toLowerCase())))
    : categoryAlgos;

  const handleSelectAlgo = (algo: AlgorithmEntry) => {
    setSelectedAlgo(algo);
    setMobileView('detail');
  };

  return (
    <div className="min-h-screen pt-[80px] bg-transparent text-text-primary flex flex-col relative overflow-hidden">
      <DynamicBackground />

      {/* Page Header */}
      <div className="relative z-10 px-6 py-8 border-b border-border-subtle">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
                🧠 Knowledge Hub
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white">Important Algorithms</h1>
              <p className="text-text-secondary text-sm mt-1">Master the foundations before solving problems</p>
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search algorithms..."
                className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border-subtle rounded-xl text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Category tabs */}
          {!searchQuery && (
            <div className="flex flex-wrap gap-2 mt-5">
              {algorithmCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSelectedAlgo(getAlgorithmsByCategory(cat.id)[0]); setMobileView('list'); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                    activeCategory === cat.id
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                      : 'text-text-secondary border-border-subtle hover:text-white hover:border-primary/30'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span className="hidden sm:inline">{cat.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main layout */}
      <div className="relative z-10 flex flex-1 overflow-hidden max-w-6xl mx-auto w-full">
        {/* Left sidebar — Algorithm list */}
        <div className={`w-full lg:w-72 flex-shrink-0 border-r border-border-subtle overflow-y-auto ${
          mobileView === 'detail' ? 'hidden lg:flex flex-col' : 'flex flex-col'
        }`}>
          <div className="p-4 space-y-1">
            {(searchQuery ? filteredAlgos : categoryAlgos).map(algo => (
              <button
                key={algo.id}
                onClick={() => handleSelectAlgo(algo)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all group ${
                  selectedAlgo?.id === algo.id
                    ? 'bg-primary/15 border border-primary/30'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-sm ${ selectedAlgo?.id === algo.id ? 'text-white' : 'text-text-secondary group-hover:text-white' }`}>
                    {algo.name}
                  </span>
                  <ChevronRight size={14} className={selectedAlgo?.id === algo.id ? 'text-primary' : 'text-text-muted group-hover:text-primary transition-colors'} />
                </div>
                <p className="text-xs text-text-muted mt-0.5 truncate">{algo.shortDesc}</p>
              </button>
            ))}
            {filteredAlgos.length === 0 && (
              <div className="text-center py-8 text-text-muted text-sm">
                No algorithms found for "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* Right panel — Algorithm detail */}
        <div className={`flex-1 overflow-y-auto ${
          mobileView === 'list' ? 'hidden lg:flex flex-col' : 'flex flex-col'
        }`}>
          {/* Mobile back button */}
          <div className="lg:hidden px-4 pt-4">
            <button onClick={() => setMobileView('list')} className="flex items-center gap-2 text-primary text-sm font-bold">
              ← Back to list
            </button>
          </div>
          {selectedAlgo ? (
            <AlgorithmDetail algo={selectedAlgo} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-text-muted p-8 text-center">
              <div>
                <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
                <p>Select an algorithm from the list to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
