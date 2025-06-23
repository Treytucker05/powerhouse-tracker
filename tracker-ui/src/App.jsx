import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppShell from './layout/AppShell.jsx';
import Tracking from "./pages/Tracking.jsx";
import Mesocycle from "./pages/Mesocycle.jsx";
import Microcycle from "./pages/Microcycle.jsx";
import Macrocycle from "./pages/Macrocycle.jsx";
import Home from "./pages/Home.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="tracking" element={<Tracking />} />
          <Route path="mesocycle" element={<Mesocycle />} />
          <Route path="microcycle" element={<Microcycle />} />
          <Route path="macrocycle" element={<Macrocycle />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
