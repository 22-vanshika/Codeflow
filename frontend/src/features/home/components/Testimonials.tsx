import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, PenTool } from 'lucide-react';
import FeedbackModal from '../../../components/FeedbackModal';

interface Testimonial {
  _id: string;
  userName: string;
  helpedText: string;
  rating: number;
  recommend: boolean;
  topicViewed: string;
}

export default function Testimonials() {
  const [feedbacks, setFeedbacks] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/feedback`);
        if (res.ok) {
          const data = await res.json();
          setFeedbacks(data.feedbacks || []);
        }
      } catch (err) {
        console.error("Failed to fetch feedbacks:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  // Helper to ensure enough items for seamless marquee repeating
  const displayFeedbacks = feedbacks.length > 0
    ? feedbacks.length < 5
      ? Array(Math.ceil(5 / feedbacks.length)).fill(feedbacks).flat()
      : feedbacks
    : [];

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-black/10 border-t border-border-subtle">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-text-secondary text-xs font-bold uppercase tracking-wider mb-6"
          >
            <MessageSquare size={12} className="text-primary" />
            Developer Feedback
          </motion.div>
          <h2 className="text-3xl sm:text-5xl font-black text-text-primary mb-6 tracking-tight">
            Loved by Engineers
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            See how developers are using CodeFlow to master coding interviews and conceptualize logic.
          </p>
        </div>

        {/* Loading / Empty State / Marquee */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12 text-text-muted">
            <span className="text-sm font-bold tracking-widest uppercase font-mono animate-pulse">Loading reviews...</span>
          </div>
        ) : feedbacks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto text-center p-10 rounded-3xl border border-white/5 bg-white/[0.01] shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-100 pointer-events-none rounded-3xl" />
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/5">
              <Star size={28} className="text-text-muted animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">No reviews yet</h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-8 max-w-sm mx-auto">
              Be the first to review! Share how CodeFlow helped you visualize code execution or prepare for technical interviews.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-primary/20 flex items-center gap-2 mx-auto active:scale-95"
            >
              <PenTool size={13} />
              Write a Review
            </button>
          </motion.div>
        ) : (
          <div className="relative w-full overflow-hidden py-4 mask-marquee">
            {/* Track */}
            <div className="flex gap-6 w-max animate-marquee hover:[animation-play-state:paused]">
              
              {/* First Set */}
              {displayFeedbacks.map((rev, idx) => (
                <TestimonialCard key={`a-${rev._id}-${idx}`} review={rev} />
              ))}
              
              {/* Second Set (Duplicate for infinite seamless loop) */}
              {displayFeedbacks.map((rev, idx) => (
                <TestimonialCard key={`b-${rev._id}-${idx}`} review={rev} />
              ))}

            </div>
          </div>
        )}

      </div>

      {/* Write review directly from Home */}
      <FeedbackModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        topicViewed="CodeFlow Homepage"
      />

      {/* Global CSS injection for marquee animations */}
      <style>{`
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(calc(-50% - 12px), 0, 0);
          }
        }

        .mask-marquee {
          -webkit-mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
          mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
        }
      `}</style>
    </section>
  );
}

function TestimonialCard({ review }: { review: Testimonial }) {
  const avatar = review.userName?.[0]?.toUpperCase() || 'U';
  return (
    <div className="w-[320px] sm:w-[350px] p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:border-primary/20 backdrop-blur-md flex flex-col justify-between transition-all duration-300 relative group shadow-xl">
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

      <div className="relative">
        {/* Rating stars */}
        <div className="flex gap-0.5 text-accent-orange mb-4">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} size={13} fill="currentColor" />
          ))}
        </div>
        
        <p className="text-text-secondary text-sm leading-relaxed mb-6 font-medium italic">
          "{review.helpedText}"
        </p>
      </div>

      {/* Avatar details */}
      <div className="flex items-center gap-3.5 border-t border-border-subtle pt-4 mt-auto">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-white text-sm shadow-md">
          {avatar}
        </div>
        <div>
          <h4 className="text-sm font-bold text-text-primary">{review.userName}</h4>
          <p className="text-[10px] text-text-secondary font-semibold">
            Visualized <span className="text-primary font-bold">{review.topicViewed || 'Algorithms'}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
