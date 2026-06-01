import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Monitor, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProblemWorkspace from './pages/ProblemWorkspace';
import CuratedSheet from './pages/CuratedSheet';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import FAQ from './pages/FAQ';
import Roadmap from './pages/Roadmap';
import Docs from './pages/Docs';
import Blog from './pages/Blog';
import ProfileSettings from './pages/ProfileSettings';
import AlgorithmsHub from './pages/AlgorithmsHub';

function MobileDeviceWarning() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem('cf_desktop_recommend_dismissed');
    if (dismissed === 'true') return;

    const checkDevice = () => {
      // 1024px is standard breakpoint for desktop/large screens
      setShowWarning(window.innerWidth < 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const handleDismiss = () => {
    setShowWarning(false);
    sessionStorage.setItem('cf_desktop_recommend_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-6 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-[9999] liquid-glass-card border border-primary/20 backdrop-blur-xl bg-[#0b0f19]/95 p-5 shadow-2xl flex gap-4"
          style={{ boxShadow: '0 10px 30px rgba(59, 130, 246, 0.15)' }}
        >
          {/* Icon */}
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-2xl flex-shrink-0 h-fit text-primary animate-pulse">
            <Monitor size={22} />
          </div>

          {/* Text Content */}
          <div className="flex-1 text-left">
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-1">
              Desktop Experience Recommended
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              CodeFlow's interactive editor and step-by-step algorithm visualizations are optimized for larger screens. Switch to desktop for the best experience.
            </p>
            <div className="mt-3 flex justify-end">
              <button
                onClick={handleDismiss}
                className="px-4 py-1.5 bg-primary/15 hover:bg-primary/25 border border-primary/30 hover:border-primary/50 text-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300"
              >
                I Understand
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1 text-text-muted hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Dismiss warning"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/workspace';
  const hideFooter = location.pathname === '/workspace';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workspace" element={<ProblemWorkspace />} />
        <Route path="/sheet" element={<CuratedSheet />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/algorithms" element={<AlgorithmsHub />} />
        <Route path="/algorithm" element={<AlgorithmsHub />} />
      </Routes>
      {!hideFooter && <Footer />}
      <MobileDeviceWarning />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
