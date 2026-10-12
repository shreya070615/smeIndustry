import React, { useState } from 'react';
import { DPR_LOAN_DATA, DprLoanData } from '../../data/advancedFeatures';
import { SampleDataBanner } from '../common/Shared';

interface DprPaperworkTabProps {
  selectedFactory: string;
}

export function DprPaperworkTab({ selectedFactory }: DprPaperworkTabProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const dpr: DprLoanData =
    DPR_LOAN_DATA[selectedFactory] || DPR_LOAN_DATA['TexAlpha Mills'];

  const handlePrintDpr = () => {
    window.print();
  };

  const handleSubmitApplication = () => {
    const generatedId = `SIDBI-ADEETIE-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmissionId(generatedId);
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <SampleDataBanner
        text={`Automated Financing & Compliance Paperwork Generator — Transforms raw sensor audits into a statutory Bankable Detailed Project Report (DPR). Qualifies the MSME for the BEE ADEETIE 30% Capital Subsidy and SIDBI 4E 6.75% Concessional Green Loan without hiring expensive audit consultants.`}
      />

      {/* Top Banner Action Bar */}
      <div className="bg-white rounded-[10px] p-5 border border-[#dde5ea] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#e8f5f1] text-[#1d7a5f] px-2 py-0.5 rounded">
              BEE ADEETIE Eligible
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#e3f2fd] text-[#1565c0] px-2 py-0.5 rounded">
              SIDBI 4E Concessional Tier
            </span>
          </div>
          <h2 className="text-[16px] font-extrabold text-[#1e3344] mt-1">
            Bankable DPR & Government Subsidy Application Dossier
          </h2>
          <div className="text-[12px] text-[#607d8b]">
            Dossier Ref: <span className="font-mono text-[#1a6ea8] font-bold">{dpr.application_ref}</span> · Date: {dpr.date_generated}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePrintDpr}
            className="px-3.5 py-2 text-[12px] font-bold rounded-[6px] border border-[#dde5ea] bg-[#f8fafb] hover:bg-[#edf2f5] text-[#1e3344] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <span>🖨️</span>
            <span>Print / Save PDF Dossier</span>
          </button>

          <button
            onClick={handleSubmitApplication}
            disabled={isSubmitted}
            className={`px-4 py-2 text-[12px] font-bold rounded-[6px] text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs ${
              isSubmitted
                ? 'bg-[#1d7a5f] cursor-default'
                : 'bg-[#1565c0] hover:bg-[#0d47a1]'
            }`}
          >
            <span>{isSubmitted ? '✓' : '🚀'}</span>
            <span>
              {isSubmitted
                ? 'Submitted to SIDBI / BEE Portal'
                : 'Submit Dossier to SIDBI Portal'}
            </span>
          </button>
        </div>
      </div>

      {/* Submission Confirmation Alert */}
      {isSubmitted && (
        <div className="p-4 bg-[#e8f5f1] border border-[#c8e6c9] rounded-[8px] text-[12.5px] text-[#1d7a5f] flex items-center justify-between">
          <div>
            <strong>✓ Application Successfully Lodged:</strong> Acknowledgement Receipt{' '}
            <span className="font-mono font-bold">{submissionId}</span> generated. Nodal Energy Economist assigned for desk appraisal.
          </div>
          <span className="text-[11px] font-bold bg-white px-2 py-0.5 rounded border border-[#1d7a5f]/20">
            Status: Under Desk Appraisal
          </span>
        </div>
      )}

      {/* Official DPR Document Paper Shell */}
      <div className="bg-white rounded-[10px] border border-[#dde5ea] shadow-[0_2px_12px_rgba(15,45,69,0.08)] p-6 sm:p-8 space-y-7 print:shadow-none print:border-none">
        {/* Document Title Header */}
        <div className="border-b-2 border-[#1e3344] pb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-extrabold text-[#1a6ea8]">
                BUREAU OF ENERGY EFFICIENCY (BEE) · MINISTRY OF POWER · GOVT. OF INDIA
              </div>
              <h1 className="text-[18px] sm:text-[20px] font-black text-[#1e3344] tracking-tight mt-1 leading-snug">
                {dpr.project_title}
              </h1>
              <div className="text-[12.5px] text-[#607d8b] font-medium mt-1">
                Applicant Enterprise: <strong>{dpr.applicant_factory}</strong> ({dpr.cluster_location})
              </div>
            </div>

            <div className="text-right shrink-0 hidden sm:block">
              <div className="w-[60px] h-[60px] border-2 border-[#1d7a5f] rounded-[8px] flex flex-col items-center justify-center p-1 bg-[#e8f5f1]">
                <span className="text-[9px] font-extrabold text-[#1d7a5f] uppercase leading-none">
                  ADEETIE
                </span>
                <span className="text-[14px] font-black text-[#1d7a5f] leading-none mt-1">
                  30%
                </span>
                <span className="text-[8px] font-bold text-[#1d7a5f] uppercase leading-none mt-0.5">
                  SUBSIDY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Executive Baseline Summary */}
        <div>
          <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#1e3344] bg-[#f0f4f8] p-2 px-3 rounded-[4px] mb-3">
            1.0 Energy Consumption Baseline & Statutory Audit Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
            <div className="p-3 border border-[#dde5ea] rounded-[6px]">
              <span className="text-[10px] uppercase font-bold text-[#607d8b] block">
                Annual Electricity
              </span>
              <span className="text-[16px] font-extrabold text-[#1e3344] tabular-nums">
                {dpr.current_annual_consumption_mwh.toFixed(1)} MWh
              </span>
            </div>
            <div className="p-3 border border-[#dde5ea] rounded-[6px]">
              <span className="text-[10px] uppercase font-bold text-[#607d8b] block">
                Annual Power Bill
              </span>
              <span className="text-[16px] font-extrabold text-[#1e3344] tabular-nums">
                ₹{(dpr.current_annual_bill_inr / 1000).toFixed(0)}k
              </span>
            </div>
            <div className="p-3 border border-[#dde5ea] rounded-[6px]">
              <span className="text-[10px] uppercase font-bold text-[#607d8b] block">
                Factory SEC vs BEE Norm
              </span>
              <span className="text-[16px] font-extrabold text-[#c0392b] tabular-nums">
                {dpr.sec_baseline_kwh_kg} <span className="text-[11px] font-normal text-[#607d8b]">vs {dpr.sec_bee_benchmark_kwh_kg}</span>
              </span>
            </div>
            <div className="p-3 border border-[#dde5ea] rounded-[6px] bg-[#fef9f9] border-[#f4b8b1]">
              <span className="text-[10px] uppercase font-bold text-[#c0392b] block">
                Excess Specific Energy
              </span>
              <span className="text-[16px] font-extrabold text-[#c0392b] tabular-nums">
                +{dpr.sec_excess_pct}%
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Bill of Energy Efficiency Interventions */}
        <div>
          <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#1e3344] bg-[#f0f4f8] p-2 px-3 rounded-[4px] mb-3">
            2.0 Bill of Energy Conservation Measures (ECMs)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="border-b-2 border-[#dde5ea] text-left">
                  <th className="p-2 text-[10px] uppercase font-bold text-[#607d8b]">
                    Energy Conservation Measure (ECM)
                  </th>
                  <th className="p-2 text-[10px] uppercase font-bold text-[#607d8b]">
                    Technology Category
                  </th>
                  <th className="p-2 text-[10px] uppercase font-bold text-[#607d8b] text-right">
                    Capex (INR)
                  </th>
                  <th className="p-2 text-[10px] uppercase font-bold text-[#607d8b] text-right">
                    Annual kWh Saved
                  </th>
                  <th className="p-2 text-[10px] uppercase font-bold text-[#607d8b] text-right">
                    Annual Bill Savings
                  </th>
                </tr>
              </thead>
              <tbody>
                {dpr.interventions.map((item, idx) => (
                  <tr key={idx} className="border-b border-[#edf2f5]">
                    <td className="p-2.5 font-bold text-[#1e3344]">{item.item}</td>
                    <td className="p-2.5 text-[#607d8b]">{item.category}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#1e3344]">
                      ₹{item.cost_inr.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right font-mono text-[#1d7a5f]">
                      {item.annual_energy_saving_kwh.toLocaleString()} kWh
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#1d7a5f]">
                      ₹{item.annual_cost_saving_inr.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="bg-[#f8fafb] font-bold border-t-2 border-[#dde5ea]">
                  <td className="p-2.5" colSpan={2}>
                    Total Project Investment Cost
                  </td>
                  <td className="p-2.5 text-right text-[#1e3344] font-mono text-[13px]">
                    ₹{dpr.total_project_cost_inr.toLocaleString()}
                  </td>
                  <td className="p-2.5 text-right text-[#1d7a5f] font-mono">
                    {dpr.interventions
                      .reduce((acc, i) => acc + i.annual_energy_saving_kwh, 0)
                      .toLocaleString()}{' '}
                    kWh
                  </td>
                  <td className="p-2.5 text-right text-[#1d7a5f] font-mono text-[13px]">
                    ₹{dpr.interventions
                      .reduce((acc, i) => acc + i.annual_cost_saving_inr, 0)
                      .toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Financing Structure (Means of Finance) */}
        <div>
          <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#1e3344] bg-[#f0f4f8] p-2 px-3 rounded-[4px] mb-3">
            3.0 Means of Finance & Subsidy Structure
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-[8px] bg-[#e8f5f1] border border-[#c8e6c9]">
              <div className="text-[10.5px] uppercase font-extrabold text-[#1d7a5f]">
                BEE ADEETIE Capital Grant (30%)
              </div>
              <div className="text-[20px] font-black text-[#1d7a5f] my-1 tabular-nums">
                ₹{dpr.subsidies.adeetie_grant_inr.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#2c4e3f]">
                Non-repayable direct capital grant under National Mission for Enhanced Energy Efficiency (NMEEE).
              </div>
            </div>

            <div className="p-4 rounded-[8px] bg-[#e3f2fd] border border-[#bbdefb]">
              <div className="text-[10.5px] uppercase font-extrabold text-[#1565c0]">
                SIDBI 4E Concessional Term Loan (60%)
              </div>
              <div className="text-[20px] font-black text-[#1565c0] my-1 tabular-nums">
                ₹{dpr.subsidies.sidbi_soft_loan_inr.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#1e3a5f]">
                Soft interest rate: <strong>{dpr.subsidies.sidbi_interest_rate_pct}% p.a.</strong> with 6-month moratorium and 3-year repayment.
              </div>
            </div>

            <div className="p-4 rounded-[8px] bg-[#f8fafb] border border-[#dde5ea]">
              <div className="text-[10.5px] uppercase font-bold text-[#607d8b]">
                Promoter Margin Contribution (10%)
              </div>
              <div className="text-[20px] font-black text-[#1e3344] my-1 tabular-nums">
                ₹{dpr.subsidies.promoter_equity_inr.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#607d8b]">
                Minimum factory equity capital contribution for project sanction.
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Bankability & Financial Viability */}
        <div>
          <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#1e3344] bg-[#f0f4f8] p-2 px-3 rounded-[4px] mb-3">
            4.0 Financial Viability Indicators for Bank Credit Committee
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
            <div className="p-3 border border-[#dde5ea] rounded-[6px] text-center">
              <span className="text-[10px] uppercase font-bold text-[#607d8b] block">
                Simple Payback Period
              </span>
              <span className="text-[18px] font-black text-[#1d7a5f] tabular-nums">
                {dpr.financial_metrics.simple_payback_months} Months
              </span>
              <span className="text-[10px] text-[#607d8b] block mt-0.5">
                Benchmark: &lt; 24 mos
              </span>
            </div>

            <div className="p-3 border border-[#dde5ea] rounded-[6px] text-center">
              <span className="text-[10px] uppercase font-bold text-[#607d8b] block">
                Project IRR
              </span>
              <span className="text-[18px] font-black text-[#1d7a5f] tabular-nums">
                {dpr.financial_metrics.project_irr_pct}%
              </span>
              <span className="text-[10px] text-[#607d8b] block mt-0.5">
                Benchmark: &gt; 25%
              </span>
            </div>

            <div className="p-3 border border-[#dde5ea] rounded-[6px] text-center">
              <span className="text-[10px] uppercase font-bold text-[#607d8b] block">
                Debt Service Coverage (DSCR)
              </span>
              <span className="text-[18px] font-black text-[#1d7a5f] tabular-nums">
                {dpr.financial_metrics.dscr}x
              </span>
              <span className="text-[10px] text-[#607d8b] block mt-0.5">
                SIDBI Threshold: &gt; 1.5x
              </span>
            </div>

            <div className="p-3 border border-[#dde5ea] rounded-[6px] text-center">
              <span className="text-[10px] uppercase font-bold text-[#607d8b] block">
                Annual CO₂ Abatement
              </span>
              <span className="text-[18px] font-black text-[#1565c0] tabular-nums">
                {dpr.financial_metrics.annual_co2_abatement_tonnes} t/yr
              </span>
              <span className="text-[10px] text-[#607d8b] block mt-0.5">
                CEA Grid Baseline
              </span>
            </div>
          </div>
        </div>

        {/* Section 5: Statutory Signatures & Endorsement Block */}
        <div className="pt-4 border-t border-[#dde5ea] text-[11px] text-[#607d8b] grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-3 bg-[#f8fafb] rounded-[6px] border border-[#edf2f5]">
            <div className="font-bold text-[#1e3344] mb-1">
              Statutory Certification & Telemetry Verification
            </div>
            <div>
              Generated via Textile Factory Sensor Audit System algorithms. Evaluated in conformity with BEE Certified Energy Auditor norms and ISO 50001:2018 energy management principles.
            </div>
          </div>

          <div className="flex flex-col justify-end items-end text-right">
            <div className="border-b border-[#1e3344] w-[180px] pb-1 mb-1 font-mono text-[10px] text-[#1e3344]">
              [Digitally Verified Seal]
            </div>
            <div className="font-bold text-[#1e3344]">
              Accredited Energy Auditor (BEE Reg. #EA-10492)
            </div>
            <div className="text-[10px] text-[#607d8b]">
              Techno-Economic Appraisal Wing, SIDBI Green Window
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
