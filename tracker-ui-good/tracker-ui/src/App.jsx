import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense, lazy } from 'react';
import AppShell from './layout/AppShell.jsx';
import { MacrocycleBuilderProvider } from './contexts/MacrocycleBuilderContext.tsx';
import './App.css';

// Lazy load page components for better code splitting
const TrackingEnhanced = lazy(() => import("./pages/TrackingEnhanced.jsx"));
const MesocycleEnhanced = lazy(() => import("./pages/MesocycleEnhanced.jsx"));
const Microcycle = lazy(() => import("./pages/MicrocycleNew.jsx"));
const Macrocycle = lazy(() => import("./pages/Macrocycle.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Program = lazy(() => import("./pages/Program.jsx"));
const Analytics = lazy(() => import("./pages/Analytics.jsx"));
const AuthPage = lazy(() => import("./pages/AuthPage.jsx"));
const ProgramDetails = lazy(() => import('./components/ProgramDetails.tsx'));
const TemplateSelection = lazy(() => import('./components/builder/TemplateSelection.tsx'));
const TimelineBlocks = lazy(() => import('./components/builder/TimelineBlocks.tsx'));
const VolumeDistribution = lazy(() => import('./components/builder/VolumeDistribution.tsx'));
const ReviewGenerate = lazy(() => import('./components/builder/ReviewGenerate.tsx'));

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
            <Route path="tracking" element={<TrackingEnhanced />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="mesocycle" element={<MesocycleEnhanced />} />
            <Route path="microcycle" element={<Microcycle />} />
            <Route path="macrocycle" element={<Macrocycle />} />
            <Route path="macrocycle/:id" element={<Macrocycle />} />

            {/* Program Design Builder Routes */}
            <Route path="program-design/*" element={
              <MacrocycleBuilderProvider>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route index element={<ProgramDetails />} />
                    <Route path="template" element={<TemplateSelection />} />
                    <Route path="timeline" element={<TimelineBlocks />} />
                    <Route path="volume-distribution" element={<VolumeDistribution />} />
                    <Route path="review" element={<ReviewGenerate />} />
                  </Routes>
                </Suspense>
              </MacrocycleBuilderProvider>
            } />
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
