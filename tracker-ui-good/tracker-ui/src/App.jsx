import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense, lazy } from 'react';
import AppShell from './layout/AppShell.jsx';
import { MacrocycleBuilderProvider } from './contexts/MacrocycleBuilderContext.tsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import GlobalReset from './components/shared/GlobalReset.jsx';
import './App.css';
// Import GlobalNASMStyles AFTER Tailwind (which is in index.css) to override
import './styles/GlobalNASMStyles.css';

// Lazy load page components for better code splitting
const Tracking = lazy(() => import("./pages/Tracking.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
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
      <Router>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/" element={<AppShell />}>
                <Route index element={<Home />} />
                <Route path="program" element={
                  <ErrorBoundary>
                    <Program />
                  </ErrorBoundary>
                } />
                <Route path="program/builder/531" element={<ProgramWizard531 />} />
                <Route path="tracking" element={<Tracking />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="history" element={<History />} />
                <Route path="settings" element={<Settings />} />
                <Route path="print-week" element={<PrintWeek />} />
                <Route path="exercises" element={<ExercisesPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="resources" element={<ResourcesPage />} />
                <Route path="train" element={<TrainToday />} />

                {/* Unified Builder Routes - All redirect to /program with context */}
                <Route path="mesocycle" element={<MacrocycleRedirect />} />
                <Route path="microcycle" element={<MacrocycleRedirect />} />
                <Route path="macrocycle" element={<MacrocycleRedirect />} />
                <Route path="macrocycle/:id" element={<MacrocycleRedirect />} />
                <Route path="builder" element={<MacrocycleRedirect />} />

                {/* Program Design Builder Routes */}
                <Route path="program-design" element={
                  <MacrocycleBuilderProvider>
                    <ContextAwareBuilder />
                  </MacrocycleBuilderProvider>
                } />
              </Route>
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
      </Router>
    </>
  );
}

export default App;
