/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, Topbar, TabId } from './components/layout/Navigation';
import { DashboardTab } from './components/tabs/DashboardTab';
import { DatasetOverviewTab } from './components/tabs/DatasetOverviewTab';
import { AuditReportTab } from './components/tabs/AuditReportTab';
import { CompareCompaniesTab } from './components/tabs/CompareCompaniesTab';
import { VernacularDispatchTab } from './components/tabs/VernacularDispatchTab';
import { DprPaperworkTab } from './components/tabs/DprPaperworkTab';
import { ClusterBenchmarkTab } from './components/tabs/ClusterBenchmarkTab';
import { TariffSchedulingTab } from './components/tabs/TariffSchedulingTab';
import { LoginView, UserSession } from './components/auth/LoginView';
import {
  FactorySummary,
  DatasetInfo,
  AuditReportData,
  CompanyComparison,
} from './data/dataset';
import {
  getCompanySummary,
  getCompanyReadings,
  getCompanyAudit,
  getAuditComparison,
  clearApiCache,
} from './services/api';

const SESSION_STORAGE_KEY = 'textile_audit_user_session';

export default function App() {
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [currentTab, setCurrentTab] = useState<TabId>('dashboard');
  const [selectedFactory, setSelectedFactory] = useState<string>('TexAlpha Mills');

  // Tab data states
  const [summaryData, setSummaryData] = useState<FactorySummary | null>(null);
  const [datasetData, setDatasetData] = useState<DatasetInfo | null>(null);
  const [auditData, setAuditData] = useState<AuditReportData | null>(null);
  const [comparisonData, setComparisonData] = useState<CompanyComparison | null>(null);

  // Loading & error states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch logic according to active tab and selected factory
  const loadActiveTabData = useCallback(
    async (factory: string, tab: TabId, force = false) => {
      setLoading(true);
      setError(null);

      try {
        if (tab === 'dashboard') {
          const data = await getCompanySummary(factory, force);
          setSummaryData(data);
        } else if (tab === 'dataset') {
          const data = await getCompanyReadings(factory, 20, force);
          setDatasetData(data);
        } else if (tab === 'audit') {
          const data = await getCompanyAudit(factory, force);
          setAuditData(data);
        } else if (tab === 'compare') {
          const data = await getAuditComparison(force);
          setComparisonData(data);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error communicating with compliance sensor repository.'
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Re-fetch on factory or tab change (only if logged in)
  useEffect(() => {
    if (userSession) {
      loadActiveTabData(selectedFactory, currentTab);
    }
  }, [userSession, selectedFactory, currentTab, loadActiveTabData]);

  const handleLogin = (session: UserSession) => {
    setUserSession(session);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Ignore storage error
    }
  };

  const handleLogout = () => {
    setUserSession(null);
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
  };

  // Handle factory change: clear cache and re-render
  const handleSelectFactory = (factory: string) => {
    if (factory === selectedFactory) return;
    clearApiCache();
    setSelectedFactory(factory);
  };

  // Switch factory from comparison screen
  const handleSwitchFactoryFromCompare = (factoryName: string) => {
    handleSelectFactory(factoryName);
    setCurrentTab('dashboard');
  };

  // If user is not logged in, show the simple login screen
  if (!userSession) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f0f4f8] text-[#1e3344]">
      {/* Fixed Left Sidebar (240px) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        selectedFactory={selectedFactory}
        onSelectFactory={handleSelectFactory}
        userSession={userSession}
        onLogout={handleLogout}
      />

      {/* Main Area: Topbar + Scrollable Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Fixed Topbar (60px) */}
        <Topbar
          currentTab={currentTab}
          userSession={userSession}
          onLogout={handleLogout}
        />

        {/* Scrollable Workspace (soft grey-blue #f0f4f8) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-[1320px] mx-auto w-full pb-10">
            {/* Admin mode banner if role === 'admin' */}
            {userSession.role === 'admin' && (
              <div className="mb-4 p-2.5 px-4 bg-[#e8f5f1] border border-[#c8e6c9] rounded-[8px] flex items-center justify-between text-[11.5px] text-[#1d7a5f] shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold uppercase bg-[#1d7a5f] text-white px-1.5 py-0.5 rounded text-[9.5px]">
                    Admin Mode Active
                  </span>
                  <span>
                    Full statutory inspection privileges enabled. You have override authority over sensor baselines.
                  </span>
                </div>
                <button
                  onClick={() => {
                    clearApiCache();
                    loadActiveTabData(selectedFactory, currentTab, true);
                  }}
                  className="font-bold underline hover:text-[#16604b] cursor-pointer text-[11px]"
                >
                  Force Re-index Telemetry
                </button>
              </div>
            )}

            {currentTab === 'dashboard' && (
              <DashboardTab
                summary={summaryData}
                loading={loading}
                error={error}
                onRetry={() => loadActiveTabData(selectedFactory, 'dashboard', true)}
              />
            )}

            {currentTab === 'dataset' && (
              <DatasetOverviewTab
                datasetInfo={datasetData}
                loading={loading}
                error={error}
                onRetry={() => loadActiveTabData(selectedFactory, 'dataset', true)}
              />
            )}

            {currentTab === 'audit' && (
              <AuditReportTab
                auditData={auditData}
                loading={loading}
                error={error}
                onRetry={() => loadActiveTabData(selectedFactory, 'audit', true)}
              />
            )}

            {currentTab === 'compare' && (
              <CompareCompaniesTab
                comparison={comparisonData}
                loading={loading}
                error={error}
                onRetry={() => loadActiveTabData(selectedFactory, 'compare', true)}
                onSwitchFactory={handleSwitchFactoryFromCompare}
              />
            )}

            {currentTab === 'dispatch' && (
              <VernacularDispatchTab selectedFactory={selectedFactory} />
            )}

            {currentTab === 'dpr' && (
              <DprPaperworkTab selectedFactory={selectedFactory} />
            )}

            {currentTab === 'cluster' && (
              <ClusterBenchmarkTab selectedFactory={selectedFactory} />
            )}

            {currentTab === 'scheduling' && (
              <TariffSchedulingTab
                selectedFactory={selectedFactory}
                onNavigateToDispatch={() => setCurrentTab('dispatch')}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
