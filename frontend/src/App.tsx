import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
