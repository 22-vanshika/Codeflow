import { motion } from 'framer-motion';
import { Star, MessageSquare } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  org: string;
  avatar: string;
  text: string;
  rating: number;
}

const reviews: Testimonial[] = [
  {
    name: "Aarav Mehta",
    role: "Software Development Engineer",
    org: "Amazon",
    avatar: "AM",
    text: "The tree DFS preorder traversal visualization helped me pass my technical interview rounds. Absolute lifesaver!",
    rating: 5
  },
  {
    name: "Dr. Sarah Chen",
    role: "Computer Science Professor",
    org: "Stanford University",
    avatar: "SC",
    text: "I've been teaching algorithms for years, and this is the best visual trace debugger I've ever recommended to students.",
    rating: 5
  },
  {
    name: "Alex Rivera",
    role: "Frontend Engineer",
    org: "Vercel",
    avatar: "AR",
    text: "The liquid glass design is Apple-level premium. It actually makes visualizing algorithm call stacks enjoyable.",
    rating: 5
  },
  {
    name: "Liam O'Connor",
    role: "Graduate CS Student",
    org: "MIT",
    avatar: "LO",
    text: "Watching dynamic programming tabulation grids calculate values step-by-step is pure wizardry. Outstanding work.",
    rating: 5
  },
  {
    name: "Elena Rostova",
    role: "Self-Taught Developer",
    org: "Freelance",
    avatar: "ER",
    text: "Backtracking recursion was always a nightmare for me. CodeFlow makes the stack frames click in minutes.",
    rating: 5
  },
  {
    name: "Marcus Aurelius",
    role: "SDE II",
    org: "Microsoft",
    avatar: "MA",
    text: "Seeing variable values mutate in real time alongside code lines is the ultimate way to study data structures.",
    rating: 5
  }
];

export default function Testimonials() {
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

        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden py-4 mask-marquee">
          {/* Track */}
          <div className="flex gap-6 w-max animate-marquee hover:[animation-play-state:paused]">
            
            {/* First Set */}
            {reviews.map((rev, idx) => (
              <TestimonialCard key={`a-${idx}`} review={rev} />
            ))}
            
            {/* Second Set (Duplicate for infinite seamless loop) */}
            {reviews.map((rev, idx) => (
              <TestimonialCard key={`b-${idx}`} review={rev} />
            ))}

          </div>
        </div>

      </div>

      {/* Global CSS injection for marquee animations */}
      <style>{`
        .animate-marquee {
          animation: marquee 25s linear infinite;
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
          "{review.text}"
        </p>
      </div>

      {/* Avatar details */}
      <div className="flex items-center gap-3.5 border-t border-border-subtle pt-4 mt-auto">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-white text-sm shadow-md">
          {review.avatar}
        </div>
        <div>
          <h4 className="text-sm font-bold text-text-primary">{review.name}</h4>
          <p className="text-[10px] text-text-secondary font-semibold">
            {review.role} @ <span className="text-primary font-bold">{review.org}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
