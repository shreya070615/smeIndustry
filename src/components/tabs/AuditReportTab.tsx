import React, { useState } from 'react';
import { AuditReportData, Finding, OptimisationSuggestion } from '../../data/dataset';
import {
  KpiCard,
  SampleDataBanner,
  ScoreRing,
  StatusPill,
  LoadingSpinner,
  ErrorState,
} from '../common/Shared';

interface AuditReportTabProps {
  auditData: AuditReportData | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

type InnerTabId = 'machines' | 'suggestions' | 'frameworks';

export function AuditReportTab({
  auditData,
  loading,
  error,
  onRetry,
}: AuditReportTabProps) {
  const [activeInnerTab, setActiveInnerTab] = useState<InnerTabId>('machines');

  if (loading) {
    return <LoadingSpinner text="Executing regulatory compliance audit rule-engine..." />;
  }

  if (error || !auditData) {
    return (
      <ErrorState
        message={error || 'Unable to generate compliance audit report.'}
        onRetry={onRetry}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Sample Data Banner */}
      <SampleDataBanner
        text={`Audit derived from synthetic CSV sensor data for ${auditData.company_name} · Period: ${auditData.period} · ${auditData.readings_count.toLocaleString()} readings across ${auditData.machines_count} machines evaluated against Indian statutory codes.`}
      />

      {/* Audit Header Row Card */}
      <div className="bg-white rounded-[10px] p-6 border border-[#dde5ea] shadow-[0_2px_8px_rgba(15,45,69,0.06)] flex flex-col md:flex-row items-start md:items-center gap-5">
        <ScoreRing score={auditData.score} size={72} />

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-[18px] font-extrabold text-[#1e3344] tracking-tight">
              {auditData.company_name}
            </h2>
            <StatusPill status={auditData.status} />
          </div>

          <div className="text-[12px] text-[#607d8b] mt-1 font-medium">
            Statutory Audit Cycle: {auditData.period} · 15-minute sampling interval
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#fdecea] text-[#c0392b]">
              <span>⚠️</span>
              <span>{auditData.critical_findings_count} Critical Finding{auditData.critical_findings_count !== 1 ? 's' : ''}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#fff3e0] text-[#c96a00]">
              <span>⚙️</span>
              <span>{auditData.non_compliant_machines_count} Non-Compliant Machine{auditData.non_compliant_machines_count !== 1 ? 's' : ''}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#e8f5f1] text-[#1d7a5f]">
              <span>✓</span>
              <span>{auditData.machines_count - auditData.non_compliant_machines_count} Compliant Units</span>
            </span>
          </div>
        </div>
      </div>

      {/* 5 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard
          label="Annual Energy"
          value={`${auditData.annual_energy_mwh.toFixed(1)} MWh`}
          subText="Estimated annual draw"
          variant="green"
        />
        <KpiCard
          label="Power Factor"
          value={auditData.power_factor.toFixed(3)}
          subText={auditData.power_factor_note}
          variant="amber"
        />
        <KpiCard
          label="CO₂ / Year"
          value={`${auditData.co2_per_year_tonnes.toFixed(1)} t`}
          subText="Grid carbon emissions"
          variant="blue"
        />
        <KpiCard
          label="Total Faults"
          value={auditData.total_faults.toLocaleString()}
          subText="Aggregated sensor trips"
          variant="red"
        />
        <KpiCard
          label="Potential Savings"
          value={`₹${auditData.potential_savings_k.toLocaleString()}k`}
          subText="Estimated annual ROI"
          variant="green"
        />
      </div>

      {/* Inner Tab Bar Navigation */}
      <div className="border-b-2 border-[#dde5ea] flex gap-2">
        <button
          onClick={() => setActiveInnerTab('machines')}
          className={`p-[10px_18px] text-[13px] font-bold transition-colors cursor-pointer border-b-[3px] -mb-[2px] ${
            activeInnerTab === 'machines'
              ? 'text-[#1d7a5f] border-[#1d7a5f]'
              : 'text-[#607d8b] border-transparent hover:text-[#1e3344]'
          }`}
        >
          Machine Compliance
        </button>
        <button
          onClick={() => setActiveInnerTab('suggestions')}
          className={`p-[10px_18px] text-[13px] font-bold transition-colors cursor-pointer border-b-[3px] -mb-[2px] ${
            activeInnerTab === 'suggestions'
              ? 'text-[#1d7a5f] border-[#1d7a5f]'
              : 'text-[#607d8b] border-transparent hover:text-[#1e3344]'
          }`}
        >
          Optimisation Suggestions
        </button>
        <button
          onClick={() => setActiveInnerTab('frameworks')}
          className={`p-[10px_18px] text-[13px] font-bold transition-colors cursor-pointer border-b-[3px] -mb-[2px] ${
            activeInnerTab === 'frameworks'
              ? 'text-[#1d7a5f] border-[#1d7a5f]'
              : 'text-[#607d8b] border-transparent hover:text-[#1e3344]'
          }`}
        >
          Frameworks
        </button>
      </div>

      {/* Inner Tab 1: Machine Compliance */}
      {activeInnerTab === 'machines' && (
        <div className="space-y-4">
          {auditData.machine_compliance.map((machine) => (
            <div
              key={machine.machine_id}
              className="bg-white rounded-[10px] p-5 border border-[#dde5ea] shadow-[0_2px_8px_rgba(15,45,69,0.06)]"
            >
              {/* Machine Header */}
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#edf2f5]">
                <div className="flex items-center gap-3">
                  <ScoreRing score={machine.score} size={56} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-extrabold text-[#1e3344] font-mono">
                        {machine.machine_id}
                      </span>
                      <StatusPill status={machine.status} />
                    </div>
                    <div className="text-[12px] text-[#607d8b] font-medium mt-0.5">
                      {machine.machine_type}
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px] text-[#607d8b]">
                  {machine.findings.length === 0 ? (
                    <span className="text-[#1d7a5f] font-bold">100% Compliant</span>
                  ) : (
                    <span className="text-[#c0392b] font-bold">
                      {machine.findings.length} Finding{machine.findings.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Findings List or Empty State */}
              {machine.findings.length === 0 ? (
                <div className="p-3 bg-[#e8f5f1] border border-[#c8e6c9] rounded-[8px] text-[12px] font-semibold text-[#1d7a5f] flex items-center gap-2">
                  <span>✔</span>
                  <span>No compliance issues detected. Operational parameters strictly conform to statutory thresholds.</span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {machine.findings.map((finding: Finding, fIdx: number) => {
                    const variantStyles: Record<
                      string,
                      { border: string; bg: string }
                    > = {
                      CRITICAL: { border: '#f4b8b1', bg: '#fff5f4' },
                      HIGH: { border: '#fcd6a2', bg: '#fffbf5' },
                      MEDIUM: { border: '#b8d9f4', bg: '#f4faff' },
                      LOW: { border: '#c8e6c9', bg: '#f4fbf5' },
                    };
                    const currentStyle =
                      variantStyles[finding.severity] || variantStyles.MEDIUM;

                    return (
                      <div
                        key={fIdx}
                        className="rounded-[8px] p-[12px_14px] border"
                        style={{
                          borderColor: currentStyle.border,
                          backgroundColor: currentStyle.bg,
                        }}
                      >
                        {/* Header flex row */}
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[12.5px] font-bold text-[#1e3344]">
                            Parameter: {finding.parameter}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <StatusPill status={finding.severity} />
                            <StatusPill status={finding.status} />
                          </div>
                        </div>

                        {/* Meta row */}
                        <div className="text-[11px] text-[#607d8b] flex flex-wrap items-center gap-x-3 gap-y-1 mb-2 font-medium">
                          <span>
                            Framework: <strong className="text-[#1e3344]">{finding.framework}</strong>
                          </span>
                          <span>·</span>
                          <span>
                            Actual: <strong className="text-[#c0392b]">{finding.actual_value}</strong>
                          </span>
                          <span>·</span>
                          <span>
                            Limit: <strong className="text-[#1e3344]">{finding.regulatory_limit}</strong>
                          </span>
                        </div>

                        {/* Recommendation */}
                        <div className="text-[12px] text-[#1e3344] leading-relaxed bg-white/70 p-2 rounded-[6px] border border-black/5">
                          {finding.recommendation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Inner Tab 2: Optimisation Suggestions */}
      {activeInnerTab === 'suggestions' && (
        <div className="space-y-3.5">
          {auditData.suggestions.map((sug: OptimisationSuggestion) => {
            const priorityStyles: Record<
              string,
              { border: string; bg: string; dot: string }
            > = {
              HIGH: { border: '#c0392b', bg: '#fef9f9', dot: '🔴' },
              MEDIUM: { border: '#e67e22', bg: '#fffbf5', dot: '🟡' },
              LOW: { border: '#1a6ea8', bg: '#f5faff', dot: '🔵' },
            };
            const pStyle = priorityStyles[sug.priority] || priorityStyles.MEDIUM;

            return (
              <div
                key={sug.id}
                className="rounded-r-[8px] p-[14px_16px] shadow-xs border-y border-r border-[#dde5ea]"
                style={{
                  borderLeft: `4px solid ${pStyle.border}`,
                  backgroundColor: pStyle.bg,
                }}
              >
                {/* Title Row */}
                <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-black/5">
                  <div className="flex items-center gap-2">
                    <span>{pStyle.dot}</span>
                    <span className="text-[13px] font-bold text-[#1e3344]">
                      #{sug.id} — {sug.category}
                    </span>
                    <StatusPill status={sug.priority} />
                  </div>

                  {sug.est_saving_pct > 0 && (
                    <div className="text-[11px] font-extrabold text-[#1d7a5f] bg-[#e8f5f1] px-2.5 py-0.5 rounded-full">
                      Est. {sug.est_saving_pct}% saving
                    </div>
                  )}
                </div>

                {/* Finding */}
                <div className="mb-2 text-[12px] text-[#1e3344] leading-relaxed">
                  <strong className="text-[#607d8b] uppercase text-[10.5px] tracking-wide block mb-0.5">
                    Finding:
                  </strong>
                  {sug.finding}
                </div>

                {/* Action */}
                <div className="mb-2.5 text-[12px] text-[#1e3344] leading-relaxed bg-white/80 p-2.5 rounded-[6px] border border-black/5 whitespace-pre-line font-normal">
                  <strong className="text-[#607d8b] uppercase text-[10.5px] tracking-wide block mb-1">
                    Action Plan:
                  </strong>
                  {sug.action}
                </div>

                {/* Framework reference */}
                <div className="text-[11px] text-[#607d8b] font-medium">
                  Framework: <span className="text-[#1a6ea8]">{sug.framework}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inner Tab 3: Frameworks */}
      {activeInnerTab === 'frameworks' && (
        <div className="bg-white rounded-[10px] p-6 border border-[#dde5ea] shadow-[0_2px_8px_rgba(15,45,69,0.06)] space-y-6">
          <div>
            <h3 className="text-[14px] font-bold text-[#1e3344]">
              Regulatory Frameworks Applied
            </h3>
            <p className="text-[12px] text-[#607d8b] mt-0.5">
              All statutory standards against which this synthetic dataset was evaluated
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {auditData.frameworks.map((fw, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-[8px] bg-[#f8fafb] border border-[#edf2f5]"
              >
                <span className="w-5 h-5 rounded-full bg-[#e8f5f1] text-[#1d7a5f] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-[12.5px] text-[#1e3344] font-medium leading-snug">
                  {fw}
                </span>
              </div>
            ))}
          </div>

          {/* Amber Disclaimer Box */}
          <div className="p-4 bg-[#fffbf0] border border-[#fde68a] rounded-[8px] text-[12px] text-[#78560a] leading-relaxed">
            <strong>⚠️ Statutory Audit Disclaimer:</strong> This compliance evaluation is computationally synthesized from telemetry time series for demonstration and auditing workflow evaluation. Statutory certification requires physical on-site verification, certified calibration instruments, and signoff by an accredited BEE Certified Energy Auditor and CPCB-approved environmental testing consultant.
          </div>
        </div>
      )}
    </div>
  );
}
