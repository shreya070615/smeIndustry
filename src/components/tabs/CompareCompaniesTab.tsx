import React from 'react';
import { CompanyComparison, CompanyComparisonProfile } from '../../data/dataset';
import {
  SampleDataBanner,
  ScoreRing,
  StatusPill,
  LoadingSpinner,
  ErrorState,
} from '../common/Shared';

interface CompareCompaniesTabProps {
  comparison: CompanyComparison | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSwitchFactory: (factoryName: string) => void;
}

export function CompareCompaniesTab({
  comparison,
  loading,
  error,
  onRetry,
  onSwitchFactory,
}: CompareCompaniesTabProps) {
  if (loading) {
    return <LoadingSpinner text="Benchmarking multi-factory compliance matrices..." />;
  }

  if (error || !comparison) {
    return (
      <ErrorState
        message={error || 'Unable to perform side-by-side factory comparison.'}
        onRetry={onRetry}
      />
    );
  }

  const renderCompanyCard = (profile: CompanyComparisonProfile) => {
    return (
      <div className="bg-white rounded-[10px] border border-[#dde5ea] shadow-[0_2px_8px_rgba(15,45,69,0.06)] overflow-hidden flex flex-col">
        {/* Green-tinted header bar */}
        <div className="bg-[#e8f5f1] border-b border-[#c8e6c9] px-5 py-3 flex items-center justify-between">
          <h3 className="text-[15px] font-extrabold text-[#1d7a5f] tracking-tight">
            {profile.name}
          </h3>
          <button
            onClick={() => onSwitchFactory(profile.name)}
            className="text-[11px] font-bold text-[#1d7a5f] hover:underline cursor-pointer bg-white/70 px-2.5 py-1 rounded-[4px] border border-[#1d7a5f]/20"
          >
            Inspect in Detail →
          </button>
        </div>

        <div className="p-5 flex-1 flex flex-col space-y-5">
          {/* Score & Status Row */}
          <div className="flex items-center gap-4 pb-4 border-b border-[#edf2f5]">
            <ScoreRing score={profile.score} size={72} />
            <div>
              <div className="flex items-center gap-2">
                <StatusPill status={profile.status} />
              </div>
              <div className="text-[11.5px] text-[#607d8b] font-medium mt-1">
                {profile.critical_findings_count} critical finding
                {profile.critical_findings_count !== 1 ? 's' : ''} detected
              </div>
              <div className="text-[11px] text-[#1a6ea8] font-mono mt-0.5">
                Audit standard: MSME-BEE-CPCB
              </div>
            </div>
          </div>

          {/* Mini Stats Table (6 rows) */}
          <div>
            <div className="text-[10px] uppercase font-bold text-[#607d8b] mb-2">
              Operational & Statutory Metrics
            </div>
            <div className="bg-[#fcfdfe] rounded-[8px] border border-[#edf2f5] divide-y divide-[#edf2f5] text-[12px]">
              <div className="flex items-center justify-between p-2.5">
                <span className="text-[#607d8b]">Annual Energy</span>
                <span className="font-bold text-[#1e3344] tabular-nums">
                  {profile.annual_energy_mwh.toFixed(1)} MWh
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5">
                <span className="text-[#607d8b]">Annual Bill</span>
                <span className="font-bold text-[#1e3344] tabular-nums">
                  ₹{profile.annual_bill_k.toLocaleString()}k
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5">
                <span className="text-[#607d8b]">CO₂ Footprint</span>
                <span className="font-bold text-[#1a6ea8] tabular-nums">
                  {profile.co2_per_year_tonnes.toFixed(1)} t/yr
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5">
                <span className="text-[#607d8b]">Fault Rate</span>
                <span
                  className={`font-bold tabular-nums ${
                    profile.fault_rate_pct > 10 ? 'text-[#c0392b]' : 'text-[#1d7a5f]'
                  }`}
                >
                  {profile.fault_rate_pct.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5">
                <span className="text-[#607d8b]">Power Factor</span>
                <span className="font-bold text-[#e67e22] tabular-nums">
                  {profile.power_factor.toFixed(3)} ✗
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#f6faf8]">
                <span className="text-[#1d7a5f] font-semibold">Potential Savings</span>
                <span className="font-extrabold text-[#1d7a5f] tabular-nums">
                  ₹{profile.potential_savings_k.toLocaleString()}k/yr
                </span>
              </div>
            </div>
          </div>

          {/* Non-Compliant Machines */}
          <div>
            <div className="text-[10px] uppercase font-bold text-[#607d8b] mb-2">
              Non-Compliant Machines
            </div>
            {profile.non_compliant_machines.length === 0 ? (
              <div className="p-2.5 rounded-[6px] bg-[#e8f5f1] text-[#1d7a5f] text-[12px] font-bold">
                ✔ None
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.non_compliant_machines.map((id) => (
                  <span
                    key={id}
                    className="px-2.5 py-1 rounded-[6px] bg-[#fdecea] border border-[#f4b8b1] text-[#c0392b] text-[11px] font-bold font-mono"
                  >
                    {id}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Top 2 HIGH Priority Actions */}
          <div className="flex-1">
            <div className="text-[10px] uppercase font-bold text-[#607d8b] mb-2">
              Top HIGH Priority Corrective Actions
            </div>
            <div className="space-y-2">
              {profile.top_high_actions.map((act, aIdx) => (
                <div
                  key={aIdx}
                  className="rounded-r-[6px] p-2.5 bg-[#fef9f9] border-y border-r border-[#dde5ea] text-[11.5px]"
                  style={{ borderLeft: '3px solid #c0392b' }}
                >
                  <div className="font-bold text-[#1e3344] mb-0.5">
                    {act.category}
                  </div>
                  <div className="text-[#607d8b] leading-tight">
                    {act.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Sample Data Banner */}
      <SampleDataBanner text={comparison.banner_note} />

      {/* Winner Badges Row */}
      <div className="flex flex-wrap items-center gap-3">
        {comparison.winner_badges.map((badge, bIdx) => (
          <div
            key={bIdx}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-[8px] text-[12.5px] font-bold shadow-xs border ${
              badge.color === 'green'
                ? 'bg-[#e8f5f1] border-[#c8e6c9] text-[#1d7a5f]'
                : 'bg-[#e3f2fd] border-[#bbdefb] text-[#1565c0]'
            }`}
          >
            <span>{badge.color === 'green' ? '🏆' : '⚡'}</span>
            <span>
              {badge.title}: <strong className="underline">{badge.winner}</strong>
            </span>
          </div>
        ))}
      </div>

      {/* Side-by-Side Comparison KPI Table */}
      <div className="bg-white rounded-[10px] p-5 border border-[#dde5ea] shadow-[0_2px_8px_rgba(15,45,69,0.06)]">
        <div className="mb-4">
          <h3 className="text-[14px] font-bold text-[#1e3344]">
            Side-by-Side Regulatory Benchmark
          </h3>
          <p className="text-[12px] text-[#607d8b] mt-0.5">
            Independent comparative evaluation across statutory and resource dimensions
          </p>
        </div>

        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full border-collapse text-[12.5px] min-w-[550px]">
            <thead>
              <tr className="border-b-2 border-[#dde5ea] text-left">
                <th className="p-[9px_12px] text-[10px] uppercase font-bold text-[#607d8b]">
                  Metric / KPI
                </th>
                <th className="p-[9px_12px] text-[10px] uppercase font-bold text-[#607d8b] text-center w-[35%]">
                  TexAlpha Mills
                </th>
                <th className="p-[9px_12px] text-[10px] uppercase font-bold text-[#607d8b] text-center w-[35%]">
                  BetaWeave Industries
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.kpis.map((kpi, idx) => {
                const texWins = kpi.winner === 'TexAlpha Mills';
                const betaWins = kpi.winner === 'BetaWeave Industries';

                return (
                  <tr
                    key={kpi.label}
                    className={`table-row-hover transition-colors ${
                      idx < comparison.kpis.length - 1 ? 'border-b border-[#f0f4f5]' : ''
                    }`}
                  >
                    <td className="p-[11px_12px] font-semibold text-[#1e3344]">
                      {kpi.label}
                    </td>

                    {/* TexAlpha Column */}
                    <td
                      className={`p-[11px_12px] text-center tabular-nums ${
                        texWins
                          ? 'bg-[#e8f5f1]/60 text-[#1d7a5f] font-bold'
                          : 'text-[#1e3344]'
                      }`}
                    >
                      <span>{kpi.tex_val}</span>
                      {texWins && <span className="ml-1.5 text-[13px]">🏆</span>}
                    </td>

                    {/* BetaWeave Column */}
                    <td
                      className={`p-[11px_12px] text-center tabular-nums ${
                        betaWins
                          ? 'bg-[#e8f5f1]/60 text-[#1d7a5f] font-bold'
                          : 'text-[#1e3344]'
                      }`}
                    >
                      <span>{kpi.beta_val}</span>
                      {betaWins && <span className="ml-1.5 text-[13px]">🏆</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2-Column Grid (One Card per Company) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {renderCompanyCard(comparison.tex_alpha)}
        {renderCompanyCard(comparison.beta_weave)}
      </div>
    </div>
  );
}
