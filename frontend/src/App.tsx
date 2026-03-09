import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProblemWorkspace from './pages/ProblemWorkspace';
import CuratedSheet from './pages/CuratedSheet';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workspace" element={<ProblemWorkspace />} />
        <Route path="/sheet" element={<CuratedSheet />} />
      </Routes>
    </Router>
  );
}

export default App;
