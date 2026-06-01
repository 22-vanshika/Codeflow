import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Lock, Globe, Github, Linkedin,
  Save, Camera, Trash2, Moon, CheckCircle, AlertTriangle, Zap, BookOpen, Settings
} from 'lucide-react';
import DynamicBackground from '../components/DynamicBackground';
import { useAuthStore } from '../store/authStore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';

type Tab = 'personal' | 'account' | 'preferences';

export default function ProfileSettings() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('personal');

  // Personal Info State
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [username, setUsername] = useState((user?.email?.split('@')[0] || '').toLowerCase().replace(/[^a-z0-9_]/g, '_'));
  const [bio, setBio] = useState(localStorage.getItem('cf_bio') || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || '');
  const [githubUrl, setGithubUrl] = useState(localStorage.getItem('cf_github') || '');
  const [linkedinUrl, setLinkedinUrl] = useState(localStorage.getItem('cf_linkedin') || '');
  const [portfolioUrl, setPortfolioUrl] = useState(localStorage.getItem('cf_portfolio') || '');

  // Account State
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetError, setResetError] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);

  // Preferences State
  const [defaultLang, setDefaultLang] = useState(localStorage.getItem('cf_lang') || 'cpp');
  const [vizSpeed, setVizSpeed] = useState(Number(localStorage.getItem('cf_speed') || '1'));
  const [autoPlay, setAutoPlay] = useState(localStorage.getItem('cf_autoplay') === 'true');

  // Save status
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Fetch profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const token = await (user as any).getIdToken?.();
        const res = await fetch(`${API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.user) {
          if (data.user.displayName) setDisplayName(data.user.displayName);
          if (data.user.bio) setBio(data.user.bio);
          if (data.user.photoURL) setAvatarUrl(data.user.photoURL);
          if (data.user.githubUrl) setGithubUrl(data.user.githubUrl);
          if (data.user.linkedinUrl) setLinkedinUrl(data.user.linkedinUrl);
          if (data.user.portfolioUrl) setPortfolioUrl(data.user.portfolioUrl);
        }
      } catch (err) {
        console.error('Failed to load profile from backend:', err);
      }
    };

    loadProfile();
  }, [user]);

  const savePersonalInfo = async () => {
    setSaveStatus('saving');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = user ? await (user as any).getIdToken?.() : null;

      // Sync local storage as robust fallback
      localStorage.setItem('cf_bio', bio);
      localStorage.setItem('cf_github', githubUrl);
      localStorage.setItem('cf_linkedin', linkedinUrl);
      localStorage.setItem('cf_portfolio', portfolioUrl);
      localStorage.setItem('cf_avatar', avatarUrl);

      if (token) {
        // Sync profile details
        await fetch(`${API_URL}/api/profile`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            displayName,
            bio,
            githubUrl,
            linkedinUrl,
            portfolioUrl,
            photoURL: avatarUrl
          })
        });

        // Trigger avatar endpoint explicitly if avatarUrl changed
        if (avatarUrl) {
          await fetch(`${API_URL}/api/profile/avatar`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ avatarUrl })
          });
        }
      }
      setSaveStatus('saved');
    } catch (err) {
      console.error('Error saving profile:', err);
      setSaveStatus('error');
    } finally {
      setTimeout(() => setSaveStatus('idle'), 2500);
    }
  };

  const savePreferences = () => {
    setSaveStatus('saving');
    localStorage.setItem('cf_theme', 'dark');
    localStorage.setItem('cf_lang', defaultLang);
    localStorage.setItem('cf_speed', String(vizSpeed));
    localStorage.setItem('cf_autoplay', String(autoPlay));
    setTimeout(() => setSaveStatus('saved'), 500);
    setTimeout(() => setSaveStatus('idle'), 2500);
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setIsSendingReset(true);
    setResetError('');
    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetEmailSent(true);
    } catch (e: any) {
      setResetError(e.message || 'Failed to send reset email.');
    } finally {
      setIsSendingReset(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'account', label: 'Account', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  return (
    <div className="min-h-screen pt-[80px] bg-transparent text-text-primary relative overflow-x-hidden">
      <DynamicBackground />

      <div className="max-w-3xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-white">Profile Settings</h1>
          <p className="text-text-secondary mt-1 text-sm">Manage your account, preferences, and learning configuration.</p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 p-1 bg-surface/50 rounded-2xl border border-border-subtle">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              <tab.icon size={15} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── PERSONAL INFO TAB ── */}
        {activeTab === 'personal' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Avatar */}
            <div className="liquid-glass-card p-6">
              <h3 className="text-base font-black text-white mb-4 flex items-center gap-2"><Camera size={16} className="text-primary" /> Avatar</h3>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary overflow-hidden border-2 border-primary/30 flex items-center justify-center">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" onError={() => setAvatarUrl('')} />
                    ) : (
                      <span className="text-white text-2xl font-black">{(user?.displayName || user?.email || 'U')[0].toUpperCase()}</span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-black text-text-muted uppercase tracking-wider mb-2 block">Avatar URL</label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={e => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-xl text-text-primary text-sm placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  <p className="text-text-muted text-xs mt-1.5">Paste any publicly accessible image URL.</p>
                </div>
                {avatarUrl && (
                  <button onClick={() => setAvatarUrl('')} className="p-2 text-text-muted hover:text-accent-red transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="liquid-glass-card p-6 space-y-5">
              <h3 className="text-base font-black text-white flex items-center gap-2"><User size={16} className="text-primary" /> Basic Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-text-muted uppercase tracking-wider mb-2 block">Display Name</label>
                  <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-xl text-text-primary text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    placeholder="Your Name" />
                </div>
                <div>
                  <label className="text-xs font-black text-text-muted uppercase tracking-wider mb-2 block">Username</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">@</span>
                    <input value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                      className="w-full pl-8 pr-4 py-3 bg-surface border border-border-subtle rounded-xl text-text-primary text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-mono"
                      placeholder="username" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-text-muted uppercase tracking-wider mb-2 block">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input type="email" value={user?.email || ''} disabled
                    className="w-full pl-11 pr-4 py-3 bg-surface/50 border border-border-subtle rounded-xl text-text-muted text-sm cursor-not-allowed" />
                </div>
                <p className="text-text-muted text-xs mt-1.5">Email cannot be changed. Contact support if needed.</p>
              </div>

              <div>
                <label className="text-xs font-black text-text-muted uppercase tracking-wider mb-2 block">Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                  placeholder="Tell us about yourself, your DSA journey, or your learning goals..."
                  className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-xl text-text-primary text-sm placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none leading-relaxed" />
              </div>
            </div>

            {/* Social Links */}
            <div className="liquid-glass-card p-6 space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2"><Globe size={16} className="text-primary" /> Social Links</h3>
              {[
                { icon: Github, label: 'GitHub', value: githubUrl, setter: setGithubUrl, placeholder: 'https://github.com/yourusername' },
                { icon: Linkedin, label: 'LinkedIn', value: linkedinUrl, setter: setLinkedinUrl, placeholder: 'https://linkedin.com/in/yourprofile' },
                { icon: Globe, label: 'Portfolio', value: portfolioUrl, setter: setPortfolioUrl, placeholder: 'https://yourportfolio.com' },
              ].map(({ icon: Icon, label, value, setter, placeholder }) => (
                <div key={label}>
                  <label className="text-xs font-black text-text-muted uppercase tracking-wider mb-2 block">{label}</label>
                  <div className="relative">
                    <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input type="url" value={value} onChange={e => setter(e.target.value)}
                      placeholder={placeholder}
                      className="w-full pl-11 pr-4 py-3 bg-surface border border-border-subtle rounded-xl text-text-primary text-sm placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                  </div>
                </div>
              ))}
            </div>

            <button onClick={savePersonalInfo}
              className="w-full py-4 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all text-sm">
              {saveStatus === 'saving' ? <><Zap size={16} className="animate-spin" /> Saving...</> :
               saveStatus === 'saved' ? <><CheckCircle size={16} /> Saved!</> :
               <><Save size={16} /> Save Personal Info</>}
            </button>
          </motion.div>
        )}

        {/* ── ACCOUNT TAB ── */}
        {activeTab === 'account' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Password Reset */}
            <div className="liquid-glass-card p-6">
              <h3 className="text-base font-black text-white flex items-center gap-2 mb-2"><Lock size={16} className="text-primary" /> Change Password</h3>
              <p className="text-text-secondary text-sm mb-5">We'll send a password reset link to <strong className="text-white">{user?.email}</strong>.</p>
              {resetEmailSent ? (
                <div className="flex items-center gap-3 p-4 bg-accent-green/10 border border-accent-green/20 rounded-2xl text-accent-green">
                  <CheckCircle size={20} />
                  <div>
                    <p className="font-bold text-sm">Reset email sent!</p>
                    <p className="text-xs opacity-80">Check your inbox (and spam folder).</p>
                  </div>
                </div>
              ) : (
                <button onClick={handlePasswordReset} disabled={isSendingReset}
                  className="px-6 py-3 bg-surface border border-border-subtle text-text-primary font-bold rounded-xl hover:border-primary/30 hover:text-white transition-all text-sm flex items-center gap-2">
                  {isSendingReset ? 'Sending...' : <><Mail size={15} /> Send Password Reset Email</>}
                </button>
              )}
              {resetError && (
                <div className="mt-3 flex items-center gap-2 text-accent-red text-xs">
                  <AlertTriangle size={14} /> {resetError}
                </div>
              )}
            </div>

            {/* Connected Accounts */}
            <div className="liquid-glass-card p-6">
              <h3 className="text-base font-black text-white flex items-center gap-2 mb-4"><Github size={16} className="text-primary" /> Connected Accounts</h3>
              <div className="flex items-center justify-between p-4 bg-surface/50 rounded-xl border border-border-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#24292e] rounded-lg flex items-center justify-center border border-white/10">
                    <Github size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">GitHub</p>
                    <p className="text-text-muted text-xs">
                      {user?.providerData?.some(p => p.providerId === 'github.com') ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  user?.providerData?.some(p => p.providerId === 'github.com')
                    ? 'bg-accent-green/10 border-accent-green/20 text-accent-green'
                    : 'bg-white/5 border-border-subtle text-text-muted'
                }`}>
                  {user?.providerData?.some(p => p.providerId === 'github.com') ? '✓ Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="liquid-glass-card p-6 border border-accent-red/20">
              <h3 className="text-base font-black text-accent-red flex items-center gap-2 mb-2"><AlertTriangle size={16} /> Danger Zone</h3>
              <p className="text-text-secondary text-sm mb-4">Deleting your account is permanent and cannot be undone. All your progress, saved visualizations, and data will be lost.</p>
              <button className="px-5 py-2.5 border border-accent-red/30 text-accent-red font-bold rounded-xl text-sm hover:bg-accent-red/10 transition-all">
                Request Account Deletion
              </button>
            </div>
          </motion.div>
        )}

        {/* ── PREFERENCES TAB ── */}
        {activeTab === 'preferences' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Theme */}
            <div className="liquid-glass-card p-6">
              <h3 className="text-base font-black text-white flex items-center gap-2 mb-2"><Moon size={16} className="text-primary" /> Visual Theme</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                CodeFlow is fully optimized for a premium, low-strain dark mode experience. Day mode has been disabled to maintain maximum visual contrast during algorithm trace execution.
              </p>
            </div>

            {/* Learning Prefs */}
            <div className="liquid-glass-card p-6 space-y-5">
              <h3 className="text-base font-black text-white flex items-center gap-2"><BookOpen size={16} className="text-primary" /> Learning Preferences</h3>

              <div>
                <label className="text-xs font-black text-text-muted uppercase tracking-wider mb-3 block">Default Language</label>
                <div className="flex gap-2">
                  {[{ id: 'cpp', label: 'C++' }, { id: 'python', label: 'Python (coming soon)', disabled: true }].map(l => (
                    <button key={l.id} onClick={() => !l.disabled && setDefaultLang(l.id)} disabled={l.disabled}
                      className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                        defaultLang === l.id
                          ? 'bg-primary text-white border-primary'
                          : l.disabled
                          ? 'border-border-subtle text-text-muted cursor-not-allowed opacity-50'
                          : 'border-border-subtle text-text-secondary hover:text-white hover:border-primary/30'
                      }`}>
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-black text-text-muted uppercase tracking-wider">Visualization Speed</label>
                  <span className="text-primary font-black text-sm">{vizSpeed}x</span>
                </div>
                <input type="range" min="0.25" max="3" step="0.25" value={vizSpeed} onChange={e => setVizSpeed(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer" />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>0.25x</span><span>1x</span><span>3x</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface/50 rounded-xl border border-border-subtle">
                <div>
                  <p className="text-white font-bold text-sm">Auto-play Trace</p>
                  <p className="text-text-muted text-xs mt-0.5">Automatically start playback after execution</p>
                </div>
                <button onClick={() => setAutoPlay(!autoPlay)}
                  className={`relative w-12 h-6 rounded-full transition-all ${
                    autoPlay ? 'bg-primary' : 'bg-surface border border-border-subtle'
                  }`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                    autoPlay ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>

            <button onClick={savePreferences}
              className="w-full py-4 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all text-sm">
              {saveStatus === 'saving' ? <><Zap size={16} className="animate-spin" /> Saving...</> :
               saveStatus === 'saved' ? <><CheckCircle size={16} /> Preferences Saved!</> :
               <><Save size={16} /> Save Preferences</>}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
