import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppShell from './layout/AppShell.jsx';
import Sessions from "./pages/Sessions.jsx";
import Intelligence from "./pages/Intelligence.jsx";
import Logger from "./pages/Logger.jsx";
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
          <Route path="sessions" element={<Sessions />} />
          <Route path="intelligence" element={<Intelligence />} />
          <Route path="logger" element={<Logger />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
