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
// IA scaffold pages
import Step1Fundamentals from './pages/build/Step1Fundamentals.tsx';
import Step2TemplateAndSchemePage from './pages/build/Step2TemplateAndSchemePage.tsx';
import Step3Customize from './pages/build/Step3Customize.tsx';
import Step4Preview from './pages/build/Step4Preview.tsx';
import Step5Progression from './pages/build/Step5Progression.tsx';
import TemplatesLibrary from './pages/library/TemplatesLibrary.tsx';
import AssistanceLibrary from './pages/library/AssistanceLibrary.tsx';
import WarmupsLibrary from './pages/library/WarmupsLibrary.tsx';
import SupplementalLibrary from './pages/library/SupplementalLibrary.tsx';
import ConditioningLibrary from './pages/library/ConditioningLibrary.tsx';
import SpecialRulesLibrary from './pages/library/SpecialRulesLibrary.tsx';
import JumpsThrowsLibrary from './pages/library/JumpsThrowsLibrary.tsx';
import TMCalculator from './pages/tools/TMCalculator.tsx';
import PercentTable from './pages/tools/PercentTable.tsx';
import SetRepCalculator from './pages/tools/SetRepCalculator.tsx';
import EquipmentProfile from './pages/tools/EquipmentProfile.tsx';
import DataCoveragePage from './pages/tools/DataCoverage.tsx';
import DataStatus from './pages/data/DataStatus.tsx';
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
import CalendarPage from './pages/calendar/CalendarPage';
import Step6Calendar from '@/components/program/steps/Step6Calendar';
import PreviewPage from '@/pages/preview/PreviewPage';
import { useFinalPlan } from './store/finalPlanStore';
import TemplateDetail from './pages/TemplateDetail.jsx';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
  </div>
);

function LockGuard({ children }) {
  const { locked } = useFinalPlan();
  return locked ? <Navigate to="/build/step6" replace /> : children;
}

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
            {/* Hard redirect legacy /hub to Dashboard */}
            <Route path="/hub" element={<Navigate to="/" replace />} />
            <Route path="/" element={<AppShell />}>
              {/* Dashboard at root */}
              <Route index element={<Home />} />
              <Route path="hub" element={<Navigate to="/" replace />} />

              {/* Program Design entry now routes to unified Program component (includes methodology selection + 5/3/1) */}
              <Route path="program-design" element={<ProtectRoute><Program /></ProtectRoute>} />

              {/* Legacy program route (kept temporarily) */}
              <Route path="program" element={<Program />} />

              {/* 5/3/1 canonical - ENHANCED with step-specific routing */}
              <Route path="builder/531" element={<Navigate to="/builder/531/v2/step/1" replace />} />
              <Route path="builder/531/v2" element={<Navigate to="/builder/531/v2/step/1" replace />} />
              <Route path="builder/531/v2/step/:stepNumber" element={<ProtectRoute><ProgramV2Provider><LockGuard><ProgramWizard531V2 /></LockGuard></ProgramV2Provider></ProtectRoute>} />
              {/* New spec-aligned build routes (UI-first scaffold) with a single persistent provider */}
              <Route
                path="build/*"
                element={
                  <ProtectRoute>
                    <BuilderStateProvider>
                      <ProgramV2Provider>
                        <Routes>
                          <Route path="step1" element={<LockGuard><Step1Fundamentals /></LockGuard>} />
                          <Route path="step2" element={<LockGuard><Step2TemplateAndSchemePage /></LockGuard>} />
                          <Route path="step3" element={<LockGuard><Step3Customize /></LockGuard>} />
                          <Route path="step4" element={<LockGuard><Step4Preview /></LockGuard>} />
                          <Route path="step5" element={<LockGuard><Step5Progression /></LockGuard>} />
                          <Route path="step6" element={<Step6Calendar />} />
                          <Route path="templates/:id" element={<TemplateDetail />} />
                          <Route path="*" element={<Navigate to="/build/step1" replace />} />
                        </Routes>
                      </ProgramV2Provider>
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
              <Route path="builder/531/v2/step/6" element={<Navigate to="/build/step6" replace />} />
              {/* Libraries */}
              <Route path="library/templates" element={<TemplatesLibrary />} />
              <Route path="library/assistance" element={<AssistanceLibrary />} />
              <Route path="library/warmups" element={<WarmupsLibrary />} />
              <Route path="library/supplemental" element={<SupplementalLibrary />} />
              <Route path="library/conditioning" element={<ConditioningLibrary />} />
              <Route path="library/jumps-throws" element={<JumpsThrowsLibrary />} />
              <Route path="library/special-rules" element={<SpecialRulesLibrary />} />
              {/* Tools */}
              <Route path="tools/tm-calculator" element={<TMCalculator />} />
              <Route path="tools/percent-table" element={<PercentTable />} />
              <Route path="tools/set-rep-calculator" element={<SetRepCalculator />} />
              <Route path="tools/equipment" element={<EquipmentProfile />} />
              <Route path="tools/data-coverage" element={<DataCoveragePage />} />
              {/* Data & Dev */}
              <Route path="data/status" element={<DataStatus />} />
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
              <Route path="calendar" element={<ProtectRoute><CalendarPage /></ProtectRoute>} />
              <Route path="preview" element={<ProtectRoute><PreviewPage /></ProtectRoute>} />

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
