import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Visualizer from './pages/Visualizer';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visualizer" element={<Visualizer />} />
      </Routes>
    </Router>
  );
}

export default App;
