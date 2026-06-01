import { motion } from 'framer-motion';
import { Cpu, Users, Target, Zap, Github, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import DynamicBackground from '../components/DynamicBackground';

const team = [
  {
    name: 'Anshika Asati',
    role: 'Founder & Lead Engineer',
    bio: 'Passionate about making DSA accessible through visual learning.',
    avatar: 'AA',
    gradient: 'from-primary to-secondary',
  },
];

const values = [
  {
    icon: Target,
    title: 'Mission-Driven',
    desc: 'We believe every developer deserves a clear mental model of how algorithms work under the hood.',
  },
  {
    icon: Zap,
    title: 'Speed of Understanding',
    desc: 'Our visualizations collapse hours of confusion into minutes of clarity.',
  },
  {
    icon: Users,
    title: 'Community First',
    desc: 'Built for learners, by learners. We listen, iterate, and grow together.',
  },
  {
    icon: Heart,
    title: 'Crafted with Love',
    desc: 'Every animation, every interaction, every color is intentional and purposeful.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen pt-[80px] bg-transparent text-text-primary relative overflow-x-hidden">
      <DynamicBackground />

      <div className="max-w-5xl mx-auto px-6 py-16 relative z-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <Cpu size={12} />
            About CodeFlow
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
            Turning Code into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Visual Stories
            </span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            CodeFlow is a premium algorithm visualization platform built to make data structures and
            algorithms intuitive, interactive, and genuinely fun to learn.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="liquid-glass-card p-10 mb-16 text-center"
        >
          <h2 className="text-2xl font-black mb-4 text-white">Our Mission</h2>
          <p className="text-text-secondary text-base max-w-2xl mx-auto leading-relaxed">
            We started CodeFlow because we were tired of staring at static pseudocode on YouTube and
            whiteboard solutions that didn't click. We wanted to <em>see</em> the algorithm — to
            watch each pointer move, each swap happen, each recursion unfold. So we built it.
          </p>
        </motion.div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-2xl font-black mb-10 text-center">What Drives Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="liquid-glass-card p-8 flex gap-5"
              >
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl h-fit">
                  <v.icon size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">{v.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <h2 className="text-2xl font-black mb-10 text-center">The Team</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="liquid-glass-card p-8 text-center w-64"
              >
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 shadow-lg shadow-primary/20`}
                >
                  {member.avatar}
                </div>
                <h3 className="text-white font-bold text-lg">{member.name}</h3>
                <p className="text-primary text-xs font-bold uppercase tracking-wider mb-3">
                  {member.role}
                </p>
                <p className="text-text-secondary text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center liquid-glass-card p-12"
        >
          <h2 className="text-2xl font-black mb-4">Want to Contribute?</h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">
            CodeFlow is open to collaboration. Whether it's bug fixes, new visualizers, or design
            improvements — we'd love your help.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="capsule-btn-primary flex items-center gap-2"
            >
              <Github size={18} />
              View on GitHub
            </a>
            <Link
              to="/contact"
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-border-subtle text-text-secondary hover:text-white hover:border-white/20 transition-all font-bold text-sm"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
