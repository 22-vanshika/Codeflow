import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProblemWorkspace from './pages/ProblemWorkspace';
import CuratedSheet from './pages/CuratedSheet';
import Dashboard from './pages/Dashboard';

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/workspace';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workspace" element={<ProblemWorkspace />} />
        <Route path="/sheet" element={<CuratedSheet />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
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
