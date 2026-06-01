import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import DynamicBackground from '../components/DynamicBackground';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using CodeFlow ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service. We reserve the right to update these Terms at any time.`,
  },
  {
    title: '2. Use of the Service',
    content: `You agree to use CodeFlow only for lawful purposes. Prohibited activities include:
    
• Attempting to gain unauthorized access to our systems or other users' accounts.
• Using the Service to distribute malware, harmful code, or exploit payloads.
• Reverse-engineering or decompiling the CodeFlow platform.
• Automated scraping or harvesting of data from the platform.
• Using the Service in a manner that violates applicable laws or regulations.`,
  },
  {
    title: '3. Accounts',
    content: `To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and all activities that occur under your account. Notify us immediately at codeflowvisualizer@gmail.com of any unauthorized account use.`,
  },
  {
    title: '4. Intellectual Property',
    content: `The CodeFlow name, logo, platform design, and codebase are the intellectual property of CodeFlow and its contributors. You are granted a limited, non-exclusive, non-transferable license to use the Service for personal, educational purposes.

User-submitted code remains the property of the user. By submitting code to CodeFlow, you grant us a limited license to execute and visualize it for the purpose of providing the Service.`,
  },
  {
    title: '5. Disclaimer of Warranties',
    content: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.`,
  },
  {
    title: '6. Limitation of Liability',
    content: `TO THE FULLEST EXTENT PERMITTED BY LAW, CODEFLOW SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICE.`,
  },
  {
    title: '7. Termination',
    content: `We reserve the right to suspend or terminate your access to the Service at any time, for any reason, including violation of these Terms, without notice.`,
  },
  {
    title: '8. Governing Law',
    content: `These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict-of-law principles.`,
  },
  {
    title: '9. Contact',
    content: `Questions about these Terms should be sent to codeflowvisualizer@gmail.com.`,
  },
];

export default function TermsOfService() {
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
            <FileText size={12} />
            Legal
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-4">Terms of Service</h1>
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
            These Terms of Service govern your use of the CodeFlow platform. Please read them
            carefully. By using our service, you acknowledge that you have read, understood, and
            agree to be bound by these Terms.
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
              <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
