import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense, lazy } from 'react';
import AppShell from './layout/AppShell.jsx';
import { MacrocycleBuilderProvider } from './contexts/MacrocycleBuilderContext.tsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './App.css';

// Lazy load page components for better code splitting
const TrackingEnhanced = lazy(() => import("./pages/TrackingEnhanced.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Program = lazy(() => import("./pages/Program.jsx"));
const Assessment = lazy(() => import("./pages/Assessment.jsx"));
const Analytics = lazy(() => import("./pages/Analytics.jsx"));
const AuthPage = lazy(() => import("./pages/AuthPage.jsx"));
const MacrocycleRedirect = lazy(() => import("./pages/MacrocycleRedirect.jsx"));

// Placeholder components for new routes
const ExercisesPage = lazy(() => import('./pages/Exercises.jsx'));
const ProfilePage = lazy(() => import('./pages/Profile.jsx'));
const ResourcesPage = lazy(() => import('./pages/Resources.jsx'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<AppShell />}>
            <Route index element={<Home />} />
            <Route path="program" element={<Program />} />
            <Route path="assessment" element={<Assessment />} />
            <Route path="tracking" element={<TrackingEnhanced />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="exercises" element={<ExercisesPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="resources" element={<ResourcesPage />} />

            {/* Unified Builder Routes - All redirect to /program with context */}
            <Route path="mesocycle" element={<MacrocycleRedirect />} />
            <Route path="microcycle" element={<MacrocycleRedirect />} />
            <Route path="macrocycle" element={<MacrocycleRedirect />} />
            <Route path="macrocycle/:id" element={<MacrocycleRedirect />} />
            <Route path="builder" element={<MacrocycleRedirect />} />

            {/* Legacy Program Design Routes - Redirect to unified /program */}
            <Route path="program-design/*" element={<MacrocycleRedirect />} />
          </Route>
        </Routes>
      </Suspense>
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
