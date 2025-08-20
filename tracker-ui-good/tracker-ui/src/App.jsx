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
import ProgramFundamentals from './components/program/steps/ProgramFundamentals.tsx';
import TemplateAndScheme from './components/program/steps/TemplateAndScheme.tsx';
import DesignCustomize from './components/program/steps/DesignCustomize.tsx';
import ProgramPreview from './components/program/steps/ProgramPreview.tsx';
import ProgramProgression from './components/program/steps/ProgramProgression.tsx';
import { BuilderStateProvider } from './context/BuilderState';
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
const AuthCallback = lazy(() => import('./pages/AuthCallback.jsx'));
const AuthUpdatePassword = lazy(() => import('./pages/AuthUpdatePassword.jsx'));
import { ProtectRoute } from '@/components/auth/ProtectRoute';
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
            <Route path="/login" element={<AuthPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/update-password" element={<AuthUpdatePassword />} />
            <Route path="/" element={<AppShell />}>
              {/* Dashboard at root */}
              <Route index element={<Home />} />
              <Route path="hub" element={<ProtectRoute><Home /></ProtectRoute>} />

              {/* Program Design entry now routes to unified Program component (includes methodology selection + 5/3/1) */}
              <Route path="program-design" element={<ProtectRoute><Program /></ProtectRoute>} />

              {/* Legacy program route (kept temporarily) */}
              <Route path="program" element={<Program />} />

              {/* 5/3/1 canonical - ENHANCED with step-specific routing */}
              <Route path="builder/531" element={<Navigate to="/builder/531/v2/step/1" replace />} />
              <Route path="builder/531/v2" element={<Navigate to="/builder/531/v2/step/1" replace />} />
              <Route path="builder/531/v2/step/:stepNumber" element={<ProtectRoute><ProgramV2Provider><ProgramWizard531V2 /></ProgramV2Provider></ProtectRoute>} />
              {/* New spec-aligned build routes (UI-first scaffold) with a single persistent provider */}
              <Route
                path="build/*"
                element={
                  <ProtectRoute>
                    <BuilderStateProvider>
                      <Routes>
                        <Route path="step1" element={<ProgramFundamentals />} />
                        <Route path="step2" element={<TemplateAndScheme />} />
                        <Route path="step3" element={<DesignCustomize />} />
                        <Route path="step4" element={<ProgramPreview />} />
                        <Route path="step5" element={<ProgramProgression />} />
                        <Route path="*" element={<Navigate to="/build/step1" replace />} />
                      </Routes>
                    </BuilderStateProvider>
                  </ProtectRoute>
                }
              />
              {/* Legacy alias redirects to new spec routes */}
              <Route path="builder/531/v2/step/1" element={<Navigate to="/build/step1" replace />} />
              <Route path="builder/531/v2/step/2" element={<Navigate to="/build/step2" replace />} />
              <Route path="builder/531/v2/step/3" element={<Navigate to="/build/step3" replace />} />
              <Route path="builder/531/v2/step/4" element={<Navigate to="/build/step4" replace />} />
              <Route path="builder/531/v2/step/5" element={<Navigate to="/build/step5" replace />} />
              <Route path="program/531/active" element={<ProtectRoute><Program531ActiveV2 /></ProtectRoute>} />
              <Route path="builder/review" element={<ProtectRoute><ProgramV2Provider><BuilderReviewPage /></ProgramV2Provider></ProtectRoute>} />

              {/* NASM placeholder */}
              <Route path="builder/nasm" element={<div className='text-gray-300 p-8'>NASM Builder (stub)</div>} />

              {/* Other existing routes */}
              <Route path="tracking" element={<ProtectRoute><Tracking /></ProtectRoute>} />
              <Route path="analytics" element={<ProtectRoute><Analytics /></ProtectRoute>} />
              <Route path="history" element={<ProtectRoute><History /></ProtectRoute>} />
              <Route path="settings" element={<ProtectRoute><Settings /></ProtectRoute>} />
              <Route path="print-week" element={<ProtectRoute><PrintWeek /></ProtectRoute>} />
              <Route path="exercises" element={<ProtectRoute><ExercisesPage /></ProtectRoute>} />
              <Route path="profile" element={<ProtectRoute><ProfilePage /></ProtectRoute>} />
              <Route path="resources" element={<ResourcesPage />} />
              <Route path="train" element={<ProtectRoute><TrainToday /></ProtectRoute>} />

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
