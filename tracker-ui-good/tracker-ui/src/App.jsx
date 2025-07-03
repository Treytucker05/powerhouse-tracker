import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppShell from './layout/AppShell.jsx';
import TrackingEnhanced from "./pages/TrackingEnhanced.jsx";
import MesocycleEnhanced from "./pages/MesocycleEnhanced.jsx";
import Microcycle from "./pages/MicrocycleNew.jsx";
import Macrocycle from "./pages/Macrocycle.jsx";
import Home from "./pages/Home.jsx";
import Program from "./pages/Program.jsx";
import Analytics from "./pages/Analytics.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />        <Route path="/" element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="program" element={<Program />} />
          <Route path="tracking" element={<TrackingEnhanced />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="mesocycle" element={<MesocycleEnhanced />} />
          <Route path="microcycle" element={<Microcycle />} />
          <Route path="macrocycle" element={<Macrocycle />} />
          <Route path="macrocycle/:id" element={<Macrocycle />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: '#111827',
          color: '#ffffff',
          border: '1px solid #374151'
        }}
      />
    </Router>
  );
}

export default App;
