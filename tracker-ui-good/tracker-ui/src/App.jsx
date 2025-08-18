// removed duplicate import
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense, lazy } from 'react';
import AppShell from './layout/AppShell.jsx';
import { MacrocycleBuilderProvider } from './contexts/MacrocycleBuilderContext.tsx';
// removed duplicate import
// 5/3/1 V2 barrel imports
import { Program531ActiveV2, ProgramV2Provider } from "./methods/531";
import FiveThreeOneWorkflow from './components/program/FiveThreeOneWorkflow';
// RESTORED - Using the original ProgramWizard531V2 for the 5-step workflow
const ProgramWizard531V2 = lazy(() => import("./methods/531/components/ProgramWizard531V2.jsx"));
const BuilderReviewPage = lazy(() => import('./pages/BuilderReview.tsx'));
import ErrorBoundary from './components/ErrorBoundary.jsx';
import GlobalReset from './components/shared/GlobalReset.jsx';
import './App.css';
// Import GlobalNASMStyles AFTER Tailwind (which is in index.css) to override
import './styles/GlobalNASMStyles.css';

// Lazy load page components for better code splitting
const Tracking = lazy(() => import("./pages/Tracking.jsx"));
const Home = lazy(() => import("./pages/Home.jsx")); // Dashboard
import MethodologySelection from './components/program/tabs/MethodologySelection.jsx';
const Program = lazy(() => import("./pages/Program.jsx"));
const Analytics = lazy(() => import("./pages/Analytics.jsx"));
const AuthPage = lazy(() => import("./pages/AuthPage.jsx"));
const MacrocycleRedirect = lazy(() => import("./pages/MacrocycleRedirect.jsx"));
const TrainToday = lazy(() => import('./pages/TrainToday.jsx'));
const History = lazy(() => import('./pages/History.jsx'));
const Settings = lazy(() => import('./pages/Settings.jsx'));
const PrintWeek = lazy(() => import('./pages/PrintWeek.jsx'));

// Program Design Builder Components
const ContextAwareBuilder = lazy(() => import("./components/builder/ContextAwareBuilder.jsx"));
const ProgramWizard531 = lazy(() => import("./components/program/ProgramWizard531.jsx"));

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
    <>
      <GlobalReset />
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          {/* Temporary helper link removed to keep Dashboard clean */}
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<AppShell />}>
              {/* Dashboard at root */}
              <Route index element={<Home />} />

              {/* Program Design entry menu */}
              <Route path="program-design" element={<MethodologySelection />} />

              {/* Legacy program route (kept temporarily) */}
              <Route path="program" element={<Program />} />

              {/* 5/3/1 canonical - ENHANCED with step-specific routing */}
              <Route path="builder/531" element={<Navigate to="/builder/531/v2/step/1" replace />} />
              <Route path="builder/531/v2" element={<Navigate to="/builder/531/v2/step/1" replace />} />
              <Route path="builder/531/v2/step/:stepNumber" element={
                <ProgramV2Provider>
                  <ProgramWizard531V2 />
                </ProgramV2Provider>
              } />
              <Route path="program/531/active" element={<Program531ActiveV2 />} />
              <Route path="builder/review" element={<ProgramV2Provider><BuilderReviewPage /></ProgramV2Provider>} />

              {/* NASM placeholder */}
              <Route path="builder/nasm" element={<div className='text-gray-300 p-8'>NASM Builder (stub)</div>} />

              {/* Other existing routes */}
              <Route path="tracking" element={<Tracking />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="history" element={<History />} />
              <Route path="settings" element={<Settings />} />
              <Route path="print-week" element={<PrintWeek />} />
              <Route path="exercises" element={<ExercisesPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="resources" element={<ResourcesPage />} />
              <Route path="train" element={<TrainToday />} />

              {/* Redirect legacy builder paths */}
              <Route path="mesocycle" element={<MacrocycleRedirect />} />
              <Route path="microcycle" element={<MacrocycleRedirect />} />
              <Route path="macrocycle" element={<MacrocycleRedirect />} />
              <Route path="macrocycle/:id" element={<MacrocycleRedirect />} />
              <Route path="builder" element={<MacrocycleRedirect />} />
            </Route>
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
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
    </>
  );
}

export default App;
