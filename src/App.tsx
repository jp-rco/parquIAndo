import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';
import OperatorPanel from './pages/OperatorPanel';
import NavigationMode from './pages/NavigationMode';

function App() {
  return (
    <Router>
      <div className="h-screen w-screen bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-hidden">
        <main className="h-full w-full relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/navigation" element={<NavigationMode />} />
            <Route path="/operator" element={<OperatorPanel />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
