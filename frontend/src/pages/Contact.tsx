import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Bug, Send, CheckCircle, AlertCircle, Upload, Trash2 } from 'lucide-react';
import DynamicBackground from '../components/DynamicBackground';

type FormType = 'feedback' | 'bug';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: FormType;
}

const TABS: { id: FormType; label: string; icon: any; description: string }[] = [
  {
    id: 'feedback',
    label: 'Write Feedback',
    icon: MessageSquare,
    description: 'Share your thoughts on features, visualizers, or overall UX.',
  },
  {
    id: 'bug',
    label: 'Report a Bug',
    icon: Bug,
    description: 'Found something broken? Tell us and we will squash it!',
  },
];

export default function Contact() {
  const [activeTab, setActiveTab] = useState<FormType>('feedback');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'feedback',
  });

  // Image upload states for Bug reports
  const [attachedImage, setAttachedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTabChange = (tab: FormType) => {
    setActiveTab(tab);
    setForm(prev => ({ ...prev, type: tab }));
    setStatus('idle');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setAttachedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setAttachedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate submission (replace with real API call)
    try {
      await new Promise(res => setTimeout(res, 1200));
      // In production: POST to /api/contact with form data & optional attachedImage (Base64 or multipart)
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '', type: activeTab });
      removeImage();
    } catch {
      setStatus('error');
    }
  };

  const activeTabData = TABS.find(t => t.id === activeTab)!;

  return (
    <div className="min-h-screen pt-[80px] bg-bg-main text-text-primary relative overflow-x-hidden">
      <DynamicBackground />

      <div className="max-w-4xl mx-auto px-6 py-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <Mail size={12} />
            Get in Touch
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            We'd Love to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Hear From You
            </span>
          </h1>
          <p className="text-text-secondary text-base max-w-xl mx-auto">
            Whether it's a question, suggestion, or bug report — our team reads every message.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-surface/50 rounded-2xl border border-border-subtle">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-text-secondary hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Card */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="liquid-glass-card p-8"
        >
          <div className="mb-8 flex items-start gap-4">
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl">
              <activeTabData.icon size={22} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">{activeTabData.label}</h2>
              <p className="text-text-secondary text-sm mt-1">{activeTabData.description}</p>
            </div>
          </div>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <CheckCircle size={52} className="text-accent-green mx-auto mb-4" />
              <h3 className="text-2xl font-black text-white mb-2">Message Sent!</h3>
              <p className="text-text-secondary mb-6">
                Thanks for reaching out. We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="capsule-btn-primary"
              >
                Send Another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-black text-text-secondary uppercase tracking-widest">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3.5 bg-surface border border-border-subtle rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary text-text-primary placeholder:text-text-muted outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-text-secondary uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="user@example.com"
                    className="w-full px-4 py-3.5 bg-surface border border-border-subtle rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary text-text-primary placeholder:text-text-muted outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-text-secondary uppercase tracking-widest">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder={
                    activeTab === 'bug'
                      ? 'Brief description of the bug'
                      : activeTab === 'feedback'
                      ? 'What feature are you referring to?'
                      : 'How can we help?'
                  }
                  className="w-full px-4 py-3.5 bg-surface border border-border-subtle rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary text-text-primary placeholder:text-text-muted outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-text-secondary uppercase tracking-widest">
                  {activeTab === 'bug' ? 'Steps to Reproduce & Expected Behavior' : 'Message'}
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder={
                    activeTab === 'bug'
                      ? '1. Go to...\n2. Click...\n3. Expected: ... Actual: ...'
                      : 'Write your message here...'
                  }
                  className="w-full px-4 py-3.5 bg-surface border border-border-subtle rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary text-text-primary placeholder:text-text-muted outline-none transition-all font-medium resize-none"
                />
              </div>

              {activeTab === 'bug' && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-text-secondary uppercase tracking-widest block">
                    Attach Screenshot (Optional)
                  </label>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {!imagePreview ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                        isDragging
                          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5'
                          : 'border-border-subtle hover:border-primary/50 hover:bg-white/3'
                      }`}
                    >
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-text-muted hover:text-white transition-colors">
                        <Upload size={20} className={isDragging ? 'text-primary animate-bounce' : 'text-text-muted'} />
                      </div>
                      <div>
                        <p className="text-sm text-text-primary font-bold">
                          {isDragging ? 'Drop your image here' : 'Drag & drop your screenshot here'}
                        </p>
                        <p className="text-xs text-text-muted mt-1">
                          or click to browse from device (JPEG, PNG, WEBP, etc.)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative rounded-2xl border border-border-subtle p-3 bg-surface flex items-center justify-between gap-4 overflow-hidden group">
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Preview image */}
                        <div className="w-14 h-14 rounded-xl border border-white/10 overflow-hidden shrink-0">
                          <img
                            src={imagePreview}
                            alt="Screenshot preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-sm font-bold text-white truncate font-sans">
                            {attachedImage ? attachedImage.name : 'screenshot.png'}
                          </p>
                          <p className="text-xs text-text-muted mt-0.5 font-sans">
                            {attachedImage ? `${(attachedImage.size / 1024).toFixed(1)} KB` : 'Attached'}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={removeImage}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-accent-red/10 text-text-muted hover:text-accent-red border border-white/5 hover:border-accent-red/20 transition-all active:scale-95 shrink-0"
                        title="Remove image"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm font-bold">
                  <AlertCircle size={18} />
                  Something went wrong. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full capsule-btn-primary flex items-center justify-center gap-2 py-4"
              >
                {status === 'loading' ? (
                  <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>

        {/* Alt contact info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 max-w-md mx-auto w-full"
        >
          <div className="liquid-glass-card p-6 flex items-center gap-4 justify-center">
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl">
              <Mail size={20} className="text-primary" />
            </div>
            <div className="text-left">
              <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Email</p>
              <a href="mailto:codeflowvisualizer@gmail.com" className="text-white font-bold hover:text-primary transition-colors">
                codeflowvisualizer@gmail.com
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
