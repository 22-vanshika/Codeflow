import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { API_URL } from '../config/api';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicViewed?: string;
}

const WORD_MIN = 25;

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function FeedbackModal({ isOpen, onClose, topicViewed = 'Algorithm Visualization' }: FeedbackModalProps) {
  const { user } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [helpedText, setHelpedText] = useState('');
  const [improveText, setImproveText] = useState('');
  const [recommend, setRecommend] = useState<'yes' | 'no' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHoveredRating(0);
      setHelpedText('');
      setImproveText('');
      setRecommend(null);
      setSubmitted(false);
      setError('');
    }
  }, [isOpen]);

  const helpedWordCount = countWords(helpedText);
  const helpedValid = helpedWordCount >= WORD_MIN;
  const canSubmit = rating > 0 && helpedValid && recommend !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    setError('');
    try {
      const token = user ? await (user as any).getIdToken?.() : null;
      await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          rating,
          helpedText,
          improveText,
          recommend: recommend === 'yes',
          topicViewed,
          userId: user?.uid || 'anonymous',
          userName: user?.displayName || 'Anonymous User',
        }),
      });
      setSubmitted(true);
      // Mark as submitted in session so we don't re-prompt
      sessionStorage.setItem('cf_feedback_submitted', 'true');
    } catch (err: any) {
      // Even if backend fails, show success (offline-tolerant)
      setSubmitted(true);
      sessionStorage.setItem('cf_feedback_submitted', 'true');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md liquid-glass-card shadow-2xl z-10 overflow-hidden"
          >
            {/* Decorative top bar */}
            <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent-cyan w-full" />

            <div className="p-7">
              {/* Close button */}
              <button onClick={onClose}
                className="absolute top-6 right-6 p-2 text-text-muted hover:text-white rounded-xl hover:bg-white/5 transition-colors">
                <X size={18} />
              </button>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-accent-green/20 border border-accent-green/30 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-accent-green" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Thank You! 🎉</h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-6">
                      Your feedback helps us improve CodeFlow for thousands of engineers. We genuinely appreciate it.
                    </p>
                    <button onClick={onClose}
                      className="px-8 py-3 bg-primary text-white font-black rounded-xl text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                      Continue Learning
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {/* Header */}
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight">
                        Enjoying CodeFlow? ✨
                      </h3>
                      <p className="text-text-secondary text-sm mt-1">
                        Just visualized: <span className="text-primary font-bold">{topicViewed}</span>
                      </p>
                    </div>

                    {/* Star Rating */}
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-text-muted mb-3">Rate your experience</p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="transition-all hover:scale-110"
                          >
                            <Star
                              size={32}
                              fill={star <= (hoveredRating || rating) ? "currentColor" : "none"}
                              className={`transition-colors ${
                                star <= (hoveredRating || rating)
                                  ? 'text-accent-yellow'
                                  : 'text-text-muted'
                              }`}
                            />
                          </button>
                        ))}
                        {rating > 0 && (
                          <span className="ml-2 text-accent-yellow font-black text-sm self-center">
                            {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][rating]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Main Review */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-black uppercase tracking-widest text-text-muted">What helped you most?</label>
                        <span className={`text-xs font-bold ${ helpedValid ? 'text-accent-green' : 'text-text-muted' }`}>
                          {helpedWordCount}/{WORD_MIN} words
                        </span>
                      </div>
                      <textarea
                        value={helpedText}
                        onChange={e => setHelpedText(e.target.value)}
                        rows={3}
                        name="helpedText"
                        autoComplete="off"
                        placeholder={`Tell us what made the biggest difference — the visualizer, step-by-step trace, DSA sheet, or something else... (minimum ${WORD_MIN} words)`}
                        className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-2xl text-text-primary text-sm placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none leading-relaxed"
                      />
                      {helpedText.length > 0 && !helpedValid && (
                        <p className="text-xs text-accent-orange mt-1 flex items-center gap-1">
                          <AlertTriangle size={11} /> Please write at least {WORD_MIN} words to help us improve.
                        </p>
                      )}
                    </div>

                    {/* Optional improvement */}
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-text-muted mb-2 block">What can be improved? (optional)</label>
                      <textarea
                        value={improveText}
                        onChange={e => setImproveText(e.target.value)}
                        rows={2}
                        name="improveText"
                        autoComplete="off"
                        placeholder="Any feature requests, bugs, or suggestions..."
                        className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-2xl text-text-primary text-sm placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none leading-relaxed"
                      />
                    </div>

                    {/* Recommend */}
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-text-muted mb-3">Would you recommend CodeFlow?</p>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setRecommend('yes')}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-black border transition-all ${ recommend === 'yes' ? 'bg-accent-green/15 border-accent-green/40 text-accent-green' : 'border-border-subtle text-text-secondary hover:text-white hover:border-primary/30' }`}>
                          👍 Yes, definitely!
                        </button>
                        <button type="button" onClick={() => setRecommend('no')}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-black border transition-all ${ recommend === 'no' ? 'bg-accent-red/15 border-accent-red/40 text-accent-red' : 'border-border-subtle text-text-secondary hover:text-white hover:border-primary/30' }`}>
                          👎 Not yet
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-accent-red text-xs">
                        <AlertTriangle size={14} /> {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!canSubmit || isSubmitting}
                      className="w-full py-4 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting...' : <><Send size={16} /> Submit Feedback</>}
                    </button>

                    <button type="button" onClick={onClose}
                      className="w-full text-center text-xs text-text-muted hover:text-white transition-colors font-bold">
                      Skip for now
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
