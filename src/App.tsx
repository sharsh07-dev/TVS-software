import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ApplicationDetailPage } from './pages/ApplicationDetailPage';
import { EcosystemPage } from './pages/EcosystemPage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { AlertsPage } from './pages/AlertsPage';
import { InvestigationPage } from './pages/InvestigationPage';
import { DealersPage } from './pages/DealersPage';
import { DataStatusPage } from './pages/DataStatusPage';
import { ReportsPage } from './pages/ReportsPage';

export function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page at root */}
        <Route path="/" element={<LandingPage />} />

        {/* Main application shell at /app/* */}
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Navigate to="/app/overview" replace />} />
          <Route path="overview" element={<DashboardPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="applications/:id" element={<ApplicationDetailPage />} />
          <Route path="ecosystems" element={<EcosystemPage />} />
          <Route path="risk-analysis" element={<RiskAnalysisPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="investigations" element={<InvestigationPage />} />
          <Route path="investigations/:id" element={<InvestigationPage />} />
          <Route path="dealers" element={<DealersPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="data-status" element={<DataStatusPage />} />
          <Route path="*" element={<Navigate to="/app/overview" replace />} />
        </Route>

        {/* Legacy redirects */}
        <Route path="/dashboard" element={<Navigate to="/app/overview" replace />} />
        <Route path="/applications" element={<Navigate to="/app/applications" replace />} />
        <Route path="/applications/:id" element={<Navigate to="/app/applications" replace />} />
        <Route path="/ecosystem" element={<Navigate to="/app/ecosystems" replace />} />
        <Route path="/alerts" element={<Navigate to="/app/alerts" replace />} />
        <Route path="/investigations" element={<Navigate to="/app/investigations" replace />} />
        <Route path="/dealers" element={<Navigate to="/app/dealers" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
