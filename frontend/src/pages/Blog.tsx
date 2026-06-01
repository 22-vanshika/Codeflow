import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, Tag, ArrowRight, Search, Building, ExternalLink, PlusCircle, Send, X, Trophy } from 'lucide-react';
import DynamicBackground from '../components/DynamicBackground';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  author: string;
  authorInitials: string;
  gradient: string;
}

interface InterviewExperience {
  id: string;
  company: 'Google' | 'Amazon' | 'Microsoft';
  role: string;
  year: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  title: string;
  excerpt: string;
  keyQuestions: string;
  keyLearnings: string;
  sourceUrl: string;
  author: string;
  gradient: string;
}

const posts: Post[] = [
  {
    id: 'visualizing-quicksort',
    title: 'How Visualizing QuickSort Changed My Interview Preparation',
    excerpt: 'I spent weeks trying to understand in-place partitioning by reading textbooks. Three days with a proper visualizer and I finally got it. Here\'s what made the difference.',
    date: 'May 28, 2026',
    readTime: '7 min read',
    tags: ['Sorting', 'Interviews', 'Learning'],
    author: 'Anshika Asati',
    authorInitials: 'AA',
    gradient: 'from-primary to-secondary',
  },
  {
    id: 'bfs-vs-dfs',
    title: 'BFS vs DFS: When to Use Which (With Animations)',
    excerpt: 'Graph traversal is one of the most common interview topics — and one of the most confusing. We break down the key differences with interactive examples.',
    date: 'May 15, 2026',
    readTime: '5 min read',
    tags: ['Graphs', 'BFS', 'DFS'],
    author: 'Anshika Asati',
    authorInitials: 'AA',
    gradient: 'from-accent-cyan to-primary',
  },
  {
    id: 'dynamic-programming-patterns',
    title: 'The 5 Dynamic Programming Patterns You Must Know',
    excerpt: 'DP problems intimidate most developers. But once you recognize the 5 core patterns, you can crack any of them in an interview setting.',
    date: 'May 3, 2026',
    readTime: '9 min read',
    tags: ['Dynamic Programming', 'Patterns', 'Interviews'],
    author: 'Anshika Asati',
    authorInitials: 'AA',
    gradient: 'from-secondary to-accent-purple',
  },
  {
    id: 'two-pointers-technique',
    title: 'Mastering the Two-Pointer Technique in 30 Minutes',
    excerpt: 'Two pointers is one of the highest-leverage techniques in DSA. Learn when and how to apply it with six worked examples ranging from easy to hard.',
    date: 'Apr 20, 2026',
    readTime: '6 min read',
    tags: ['Arrays', 'Two Pointers', 'Patterns'],
    author: 'Anshika Asati',
    authorInitials: 'AA',
    gradient: 'from-accent-green to-accent-cyan',
  },
  {
    id: 'building-codeflow',
    title: 'Building CodeFlow: Architecture & Technical Decisions',
    excerpt: 'A behind-the-scenes look at how CodeFlow was built — from C++ execution sandboxing to React animation systems and real-time WebSocket communication.',
    date: 'Apr 10, 2026',
    readTime: '12 min read',
    tags: ['Engineering', 'React', 'Architecture'],
    author: 'Anshika Asati',
    authorInitials: 'AA',
    gradient: 'from-accent-orange to-accent-red',
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window Problems: A Visual Guide',
    excerpt: 'If you\'ve ever struggled with subarray and substring problems, this guide is for you. We\'ll visualize 4 key problem types and explain the pattern clearly.',
    date: 'Mar 29, 2026',
    readTime: '8 min read',
    tags: ['Arrays', 'Sliding Window', 'Patterns'],
    author: 'Anshika Asati',
    authorInitials: 'AA',
    gradient: 'from-primary to-accent-cyan',
  },
];

const experiences: InterviewExperience[] = [
  {
    id: 'google-swe-onsite',
    company: 'Google',
    role: 'Software Engineer (L3)',
    year: '2025',
    difficulty: 'Hard',
    title: 'Google SWE Onsite: Graph Algorithms & Dynamic Programming Focus',
    excerpt: 'A detailed rundown of a 3-round virtual onsite interview focusing heavily on complex Graph traversals and recursive pattern mutations.',
    keyQuestions: 'Reconstruct Itinerary (Graph DFS / Eulerian Path), Sliding Window Maximum (Monotonic Queue)',
    keyLearnings: 'Practice dry-running algorithms line-by-line while drawing the recursive trace stack explicitly. Google interviewers highly value clear verbal tracing of variables.',
    sourceUrl: 'https://leetcode.com/discuss/interview-experience',
    author: 'Cited from LeetCode (user: algorithm_chef)',
    gradient: 'from-primary to-accent-cyan'
  },
  {
    id: 'amazon-sde-intern',
    company: 'Amazon',
    role: 'SDE Intern',
    year: '2026',
    difficulty: 'Medium',
    title: 'Amazon SDE Intern: LRU Cache & Topological Sorting Experience',
    excerpt: 'Walkthrough of the Amazon OA and subsequent technical rounds covering basic cache design and scheduling dependencies.',
    keyQuestions: 'LRU Cache Design (HashMap + Doubly Linked List), Course Schedule II (Topological Sort)',
    keyLearnings: 'Understand the underlying pointer structures for LRU cache updates. Amazon leadership principles are core — be ready with STAR-method behavioral scenarios.',
    sourceUrl: 'https://www.geeksforgeeks.org/amazon-interview-experience',
    author: 'Cited from GeeksforGeeks (author: sde_aspirant_10)',
    gradient: 'from-accent-orange to-accent-yellow'
  },
  {
    id: 'microsoft-sde2',
    company: 'Microsoft',
    role: 'Software Engineer II',
    year: '2025',
    difficulty: 'Medium',
    title: 'Microsoft SDE-2: Level-Order Traversals & k-Way Merging',
    excerpt: 'Insights into Microsoft\'s 4-round technical interview covering trees, list merging, and basic system design fundamentals.',
    keyQuestions: 'Binary Tree Zigzag Level Order Traversal (BFS / Two Stacks), Merge k Sorted Lists (Min Heap)',
    keyLearnings: 'Always clarify boundary constraints (e.g. empty inputs or negative values) before typing code. Tree mutations are easier to explain if you draw deque actions sequentially.',
    sourceUrl: 'https://leetcode.com/discuss/interview-experience',
    author: 'Cited from LeetCode (user: binary_star)',
    gradient: 'from-secondary to-accent-purple'
  }
];

const allTags = Array.from(new Set(posts.flatMap(p => p.tags)));

export default function Blog() {
  const [activeTab, setActiveTab] = useState<'guides' | 'experiences'>('guides');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  // Submit Modal state
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form inputs
  const [formCompany, setFormCompany] = useState('Google');
  const [formRole, setFormRole] = useState('');
  const [formYear, setFormYear] = useState('2026');
  const [formDifficulty, setFormDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [formTitle, setFormTitle] = useState('');
  const [formQuestions, setFormQuestions] = useState('');
  const [formLearnings, setFormLearnings] = useState('');

  // Dynamic CMS state
  const [blogsList, setBlogsList] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/blogs`);
        const data = await res.json();
        if (data.blogs && data.blogs.length > 0) {
          setBlogsList(data.blogs);
        }
      } catch (err) {
        console.error('Failed to fetch blogs from API:', err);
      }
    };
    fetchBlogs();
  }, []);

  // Map dynamic backend blogs to Post/InterviewExperience formats, or fallback to offline lists
  const tutorials = blogsList.length > 0 
    ? blogsList.filter(b => b.category === 'Tutorial' || !b.category).map(b => ({
        id: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        date: b.date,
        readTime: b.readTime,
        tags: b.tags || ['Sorting', 'Interviews', 'Learning'],
        author: b.author,
        authorInitials: b.authorInitials,
        gradient: b.gradient
      }))
    : posts;

  const interviewLogs = blogsList.length > 0
    ? blogsList.filter(b => b.category === 'Interview Experience').map(b => ({
        id: b.slug,
        company: b.company || 'Google',
        role: b.role || 'Software Engineer (L3)',
        year: b.year || '2025',
        difficulty: b.difficulty || 'Medium',
        title: b.title,
        excerpt: b.excerpt,
        keyQuestions: b.keyQuestions || 'Reconstruct Itinerary, Graph DFS',
        keyLearnings: b.keyLearnings || 'Practice drawing the trace stack.',
        sourceUrl: b.sourceUrl || 'https://leetcode.com/discuss/interview-experience',
        author: b.author,
        gradient: b.gradient
      }))
    : experiences;

  const filteredPosts = tutorials.filter(post => {
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !activeTag || post.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  const filteredExperiences = interviewLogs.filter(exp => {
    const matchesSearch =
      !searchQuery ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.keyQuestions.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany = !selectedCompany || exp.company === selectedCompany;
    return matchesSearch && matchesCompany;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRole || !formTitle || !formQuestions || !formLearnings) return;

    setSubmitting(true);
    // Simulate API request saving it for moderation
    setTimeout(() => {
      setSubmitting(false);
      setSubmitSuccess(true);
      // Reset form
      setFormRole('');
      setFormTitle('');
      setFormQuestions('');
      setFormLearnings('');
    }, 1000);
  };

  const handleCloseSubmit = () => {
    setIsSubmitOpen(false);
    // Delay success reset so it looks smooth
    setTimeout(() => setSubmitSuccess(false), 300);
  };

  const [featured, ...rest] = filteredPosts;

  return (
    <div className="min-h-screen pt-[80px] bg-transparent text-text-primary relative overflow-x-hidden">
      <DynamicBackground />

      <div className="max-w-5xl mx-auto px-6 py-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <BookOpen size={12} />
            Ecosystem Hub
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Insights, Guides &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Real Experiences
            </span>
          </h1>
          <p className="text-text-secondary text-base max-w-xl mx-auto">
            Deepen your algorithmic intuition and read authenticated technical interview logs from leading tech companies.
          </p>
        </motion.div>

        {/* Tab Toggle Navigation */}
        <div className="flex gap-1 mb-8 p-1 bg-surface/50 rounded-2xl border border-border-subtle max-w-md mx-auto">
          <button
            onClick={() => { setActiveTab('guides'); setSearchQuery(''); }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'guides'
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Algorithm Guides
          </button>
          <button
            onClick={() => { setActiveTab('experiences'); setSearchQuery(''); }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'experiences'
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Interview Experiences
          </button>
        </div>

        {/* Search, Filters & Action Button Row */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'guides' ? "Search articles..." : "Search questions or companies..."}
                className="w-full pl-12 pr-4 py-3.5 bg-surface border border-border-subtle rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary text-text-primary placeholder:text-text-muted outline-none transition-all font-medium text-sm"
              />
            </div>
            
            {activeTab === 'experiences' && (
              <button
                onClick={() => setIsSubmitOpen(true)}
                className="px-5 py-3.5 bg-primary hover:bg-primary/95 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 shrink-0"
              >
                <PlusCircle size={15} />
                Share Experience
              </button>
            )}
          </div>

          {/* Filtering Sub-row */}
          <AnimatePresence mode="wait">
            {activeTab === 'guides' ? (
              <motion.div
                key="tags"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex flex-wrap gap-2"
              >
                <button
                  onClick={() => setActiveTag(null)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    !activeTag ? 'bg-primary border-primary text-white' : 'bg-white/5 border-border-subtle text-text-secondary hover:text-white'
                  }`}
                >
                  All Tags
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      activeTag === tag ? 'bg-primary border-primary text-white' : 'bg-white/5 border-border-subtle text-text-secondary hover:text-white'
                    }`}
                  >
                    <Tag size={10} />
                    {tag}
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="companies"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex flex-wrap gap-2"
              >
                <button
                  onClick={() => setSelectedCompany(null)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    !selectedCompany ? 'bg-primary border-primary text-white' : 'bg-white/5 border-border-subtle text-text-secondary hover:text-white'
                  }`}
                >
                  All Companies
                </button>
                {['Google', 'Amazon', 'Microsoft'].map(comp => (
                  <button
                    key={comp}
                    onClick={() => setSelectedCompany(comp === selectedCompany ? null : comp)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      selectedCompany === comp ? 'bg-primary border-primary text-white' : 'bg-white/5 border-border-subtle text-text-secondary hover:text-white'
                    }`}
                  >
                    <Building size={10} />
                    {comp}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* TAB CONTENTS */}
        {activeTab === 'guides' ? (
          /* GUIDES TAB */
          filteredPosts.length === 0 ? (
            <div className="text-center py-16 text-text-muted">
              <BookOpen size={40} className="mx-auto mb-4 opacity-40" />
              <p>No guides found matching that search.</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featured && !searchQuery && !activeTag && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="liquid-glass-card overflow-hidden mb-8 group cursor-pointer hover:shadow-2xl hover:shadow-primary/10 transition-all"
                >
                  <div className={`h-3 w-full bg-gradient-to-r ${featured.gradient}`} />
                  <div className="p-8 md:p-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-black uppercase bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full tracking-wider">
                        Featured
                      </span>
                      {featured.tags.map((tag: string) => (
                        <span key={tag} className="text-[10px] text-text-muted font-bold">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-4 group-hover:text-primary transition-colors leading-tight">
                      {featured.title}
                    </h2>
                    <p className="text-text-secondary leading-relaxed mb-6">{featured.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${featured.gradient} flex items-center justify-center text-white text-xs font-black`}>
                          {featured.authorInitials}
                        </div>
                        <div>
                          <p className="text-white text-sm font-bold">{featured.author}</p>
                          <div className="flex items-center gap-2 text-text-muted text-xs">
                            <span>{featured.date}</span>
                            <span>·</span>
                            <Clock size={10} />
                            <span>{featured.readTime}</span>
                          </div>
                        </div>
                      </div>
                      <button className="flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
                        Read More <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Grid of Posts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(searchQuery || activeTag ? filteredPosts : rest).map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="liquid-glass-card overflow-hidden group cursor-pointer hover:shadow-xl hover:shadow-primary/5 transition-all"
                  >
                    <div className={`h-1.5 w-full bg-gradient-to-r ${post.gradient}`} />
                    <div className="p-6">
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.tags.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="text-[10px] text-primary font-bold bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-white font-bold text-base mb-3 group-hover:text-primary transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed mb-5 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-text-muted text-xs">
                          <Clock size={11} />
                          <span>{post.readTime}</span>
                          <span>·</span>
                          <span>{post.date}</span>
                        </div>
                        <ArrowRight size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )
        ) : (
          /* INTERVIEW EXPERIENCES TAB */
          filteredExperiences.length === 0 ? (
            <div className="text-center py-16 text-text-muted">
              <Building size={40} className="mx-auto mb-4 opacity-40" />
              <p>No interview experiences found matching that query.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredExperiences.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="liquid-glass-card overflow-hidden group shadow-xl border border-white/5"
                >
                  <div className={`h-2 w-full bg-gradient-to-r ${exp.gradient}`} />
                  <div className="p-6 sm:p-8">
                    {/* Upper row: badging details */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/5 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                          <Building size={11} className="text-primary" />
                          {exp.company}
                        </span>
                        <span className="text-[10px] text-text-muted font-bold font-mono">
                          {exp.year} · {exp.role}
                        </span>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                        exp.difficulty === 'Easy' ? 'border-accent-green/20 text-accent-green bg-accent-green/5' :
                        exp.difficulty === 'Medium' ? 'border-accent-orange/20 text-accent-orange bg-accent-orange/5' :
                        'border-accent-red/20 text-accent-red bg-accent-red/5'
                      }`}>
                        {exp.difficulty}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-white mb-3 group-hover:text-primary transition-colors leading-tight">
                      {exp.title}
                    </h2>
                    <p className="text-text-secondary text-sm leading-relaxed mb-6">
                      {exp.excerpt}
                    </p>

                    {/* Technical details box */}
                    <div className="p-5 rounded-2xl bg-surface/50 border border-border-subtle space-y-4 mb-6">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary block mb-1">Key Interview Questions</span>
                        <p className="text-sm font-bold text-white leading-relaxed">{exp.keyQuestions}</p>
                      </div>
                      <div className="border-t border-border-subtle pt-3">
                        <span className="text-[9px] font-black uppercase tracking-widest text-accent-yellow block mb-1">Recommended Strategy & Learnings</span>
                        <p className="text-xs text-text-secondary leading-relaxed font-mono">{exp.keyLearnings}</p>
                      </div>
                    </div>

                    {/* Attribution & Link Footer */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-border-subtle pt-4 gap-3 text-xs">
                      <span className="text-text-muted font-medium italic">
                        {exp.author}
                      </span>
                      <a
                        href={exp.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary hover:text-white font-bold transition-colors"
                      >
                        Verify Original Source <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}
      </div>

      {/* SHARE EXPERIENCES FORM MODAL */}
      <AnimatePresence>
        {isSubmitOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg liquid-glass-card shadow-2xl overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent-cyan w-full" />
              
              <button
                onClick={handleCloseSubmit}
                className="absolute top-5 right-5 p-2 text-text-muted hover:text-white rounded-xl hover:bg-white/5 transition-colors z-10"
              >
                <X size={18} />
              </button>

              <div className="p-7 max-h-[85vh] overflow-y-auto">
                {submitSuccess ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-full bg-accent-green/20 border border-accent-green/30 flex items-center justify-center mx-auto mb-5">
                      <Trophy size={32} className="text-accent-green" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Submitted Successfully! 🎉</h3>
                    <p className="text-text-secondary text-sm leading-relaxed max-w-sm mx-auto mb-8">
                      Thank you! Your interview experience has been submitted for moderation. Once reviewed by our team, it will appear here.
                    </p>
                    <button
                      onClick={handleCloseSubmit}
                      className="px-8 py-3.5 bg-primary text-white font-black rounded-xl text-sm hover:bg-primary/95 transition-all shadow-lg shadow-primary/20"
                    >
                      Back to Hub
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight">Share Your Journey 🚀</h3>
                      <p className="text-text-secondary text-xs mt-1">Help fellow engineers prepare for interviews by detailing your technical rounds.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Company</label>
                        <select
                          value={formCompany}
                          onChange={e => setFormCompany(e.target.value)}
                          className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-xl text-text-primary text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-bold"
                        >
                          <option value="Google">Google</option>
                          <option value="Amazon">Amazon</option>
                          <option value="Microsoft">Microsoft</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Year</label>
                        <select
                          value={formYear}
                          onChange={e => setFormYear(e.target.value)}
                          className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-xl text-text-primary text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-bold"
                        >
                          <option value="2026">2026</option>
                          <option value="2025">2025</option>
                          <option value="2024">2024</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Role / Title</label>
                        <input
                          type="text"
                          value={formRole}
                          onChange={e => setFormRole(e.target.value)}
                          placeholder="e.g. SDE Intern"
                          className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-xl text-text-primary text-sm placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-medium"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Difficulty</label>
                        <div className="flex gap-1.5 p-1 bg-surface border border-border-subtle rounded-xl">
                          {(['Easy', 'Medium', 'Hard'] as const).map(diff => (
                            <button
                              key={diff}
                              type="button"
                              onClick={() => setFormDifficulty(diff)}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                formDifficulty === diff
                                  ? 'bg-primary text-white'
                                  : 'text-text-muted hover:text-white'
                              }`}
                            >
                              {diff}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Title</label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={e => setFormTitle(e.target.value)}
                        placeholder="e.g. 4 rounds focusing on Trees and Min Heaps"
                        className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-xl text-text-primary text-sm placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Key Interview Questions</label>
                      <textarea
                        value={formQuestions}
                        onChange={e => setFormQuestions(e.target.value)}
                        rows={2}
                        placeholder="e.g. Course Schedule II, LRU Cache..."
                        className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-xl text-text-primary text-sm placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none leading-relaxed"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Learnings & Strategy Advice</label>
                      <textarea
                        value={formLearnings}
                        onChange={e => setFormLearnings(e.target.value)}
                        rows={3}
                        placeholder="Detail what strategies worked, what topics to prepare, and tips on visual debugging during coding..."
                        className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-xl text-text-primary text-sm placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none leading-relaxed"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/45 transition-all uppercase text-xs tracking-wider"
                    >
                      {submitting ? 'Submitting...' : <><Send size={14} /> Submit Experience for Review</>}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
