import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import DynamicBackground from '../components/DynamicBackground';

const sections = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us when you create an account, use our services, or contact us for support. This includes:
    
• **Account Information**: Email address, display name, and profile photo (when signing in via GitHub OAuth).
• **Usage Data**: Pages you visit, features you use, problems you solve, and how long you spend in the visualizer.
• **Code Submissions**: C++ code you write or import in the workspace. This data is used only for execution and visualization and is not stored permanently unless you explicitly save it.
• **Progress Data**: Which DSA problems you've marked as completed.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information we collect to:
    
• Provide, maintain, and improve our services.
• Personalize your experience (e.g., persisting your DSA progress).
• Send you technical notices and support messages.
• Monitor and analyze trends and usage.
• Detect and prevent fraud or abuse.

We do not sell your personal information to third parties.`,
  },
  {
    title: '3. Data Storage & Security',
    content: `Your data is stored in a MongoDB database hosted on MongoDB Atlas. We use Firebase Authentication to manage user identities securely. All data in transit is encrypted using HTTPS/TLS.

We implement industry-standard security measures but cannot guarantee absolute security. You are responsible for keeping your account credentials confidential.`,
  },
  {
    title: '4. Third-Party Services',
    content: `We use the following third-party services:
    
• **Firebase (Google)**: Authentication and identity management.
• **GitHub OAuth**: Optional sign-in method. We request read access to your public repositories only when you use the GitHub import feature.
• **MongoDB Atlas**: Cloud database for storing user profiles, progress, and saved visualizations.`,
  },
  {
    title: '5. Cookies',
    content: `We use minimal cookies for session management and user preference storage (such as theme selection). We do not use cookies for advertising.`,
  },
  {
    title: '6. Your Rights',
    content: `You have the right to:
    
• Access the personal data we hold about you.
• Request correction of inaccurate data.
• Request deletion of your account and associated data.
• Export your saved visualizations and progress.

To exercise any of these rights, contact us at codeflowvisualizer@gmail.com.`,
  },
  {
    title: '7. Children\'s Privacy',
    content: `CodeFlow is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13.`,
  },
  {
    title: '8. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our platform or sending an email to the address associated with your account.`,
  },
  {
    title: '9. Contact Us',
    content: `If you have questions about this Privacy Policy, please contact us at codeflowvisualizer@gmail.com or use the Contact page on our platform.`,
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-[80px] bg-bg-main text-text-primary relative overflow-x-hidden">
      <DynamicBackground />

      <div className="max-w-3xl mx-auto px-6 py-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <Shield size={12} />
            Legal
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-text-muted text-sm">
            Last updated: <span className="text-text-secondary font-bold">June 1, 2026</span>
          </p>
        </motion.div>

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="liquid-glass-card p-8 mb-8 border border-primary/10"
        >
          <p className="text-text-secondary leading-relaxed">
            Welcome to CodeFlow. We take your privacy seriously. This Privacy Policy explains how we
            collect, use, share, and protect information about you when you use our services at
            <strong className="text-white"> codeflow.dev</strong>.
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="liquid-glass-card p-8"
            >
              <h2 className="text-xl font-black text-white mb-4">{section.title}</h2>
              <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                {section.content.split('**').map((part, j) =>
                  j % 2 === 1 ? (
                    <strong key={j} className="text-text-primary font-bold">
                      {part}
                    </strong>
                  ) : (
                    part
                  )
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
