import React from 'react';
import { FactorySummary } from '../../data/dataset';
import {
  KpiCard,
  SampleDataBanner,
  StatusPill,
  CssHorizontalBarRow,
  LoadingSpinner,
  ErrorState,
} from '../common/Shared';

interface DashboardTabProps {
  summary: FactorySummary | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function DashboardTab({
  summary,
  loading,
  error,
  onRetry,
}: DashboardTabProps) {
  if (loading) {
    return <LoadingSpinner text="Computing factory sensor telemetry aggregates..." />;
  }

  if (error || !summary) {
    return (
      <ErrorState
        message={error || 'Unable to retrieve factory summary metrics.'}
        onRetry={onRetry}
      />
    );
  }

  const maxKw = Math.max(...summary.machines.map((m) => m.avg_kw), 10);

  return (
    <div className="space-y-6">
      {/* Sample Data Banner */}
      <SampleDataBanner
        text={`Synthetic CSV Dataset — Showing aggregated statistics computed from ${summary.total_readings.toLocaleString()} sensor readings across ${summary.machines_monitored} machines for ${summary.company_name} (${summary.period_start} → ${summary.period_end}). Data modelled on Zenodo Small Textile Industry Dataset.`}
      />

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Readings"
          value={summary.total_readings.toLocaleString()}
          subText="15-min intervals / 30 days"
          variant="green"
        />
        <KpiCard
          label="Est. Monthly Energy"
          value={`${summary.est_monthly_energy_kwh.toLocaleString()} kWh`}
          subText="Active power consumption"
          variant="green"
        />
        <KpiCard
          label="Avg Power Factor"
          value={summary.avg_power_factor.toFixed(3)}
          subText="BEE statutory target ≥ 0.85"
          variant={summary.avg_power_factor >= 0.85 ? 'amber' : 'red'}
        />
        <KpiCard
          label="Fault Rate"
          value={`${summary.fault_rate_pct.toFixed(1)}%`}
          subText="Synthetic anomaly injections"
          variant={summary.fault_rate_pct > 15 ? 'red' : 'green'}
        />
        <KpiCard
          label="Peak Demand"
          value={`${summary.peak_demand_kw.toFixed(1)} kW`}
          subText="Recorded instantaneous peak"
          variant="green"
        />
        <KpiCard
          label="CO₂ Footprint"
          value={`${summary.co2_footprint_tonnes.toFixed(1)} t/yr`}
          subText="CEA emission factor 0.82 kg/kWh"
          variant="blue"
        />
        <KpiCard
          label="Annual Energy Bill"
          value={`₹${summary.annual_energy_bill_k.toLocaleString()}k`}
          subText="Est. commercial MSME tariff"
          variant="blue"
        />
        <KpiCard
          label="Machines Monitored"
          value={summary.machines_monitored}
          subText="Continuous telemetry streams"
          variant="green"
        />
      </div>

      {/* Machine-wise Sensor Aggregates Table */}
      <div className="bg-white rounded-[10px] p-5 border border-[#dde5ea] shadow-[0_2px_8px_rgba(15,45,69,0.06)]">
        <div className="mb-4">
          <h3 className="text-[14px] font-bold text-[#1e3344] leading-tight">
            Machine Performance Overview
          </h3>
          <p className="text-[12px] text-[#607d8b] mt-0.5">
            Per-machine sensor aggregates — avg and peak values from synthetic CSV dataset — 30-day window
          </p>
        </div>

        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full border-collapse text-[12.5px] min-w-[920px]">
            <thead>
              <tr className="border-b-2 border-[#dde5ea] text-left">
                <th className="p-[9px_10px] text-[10px] uppercase font-bold text-[#607d8b] tracking-wider">
                  Machine ID
                </th>
                <th className="p-[9px_10px] text-[10px] uppercase font-bold text-[#607d8b] tracking-wider">
                  Type
                </th>
                <th className="p-[9px_10px] text-[10px] uppercase font-bold text-[#607d8b] tracking-wider text-right">
                  Avg kW
                </th>
                <th className="p-[9px_10px] text-[10px] uppercase font-bold text-[#607d8b] tracking-wider text-right">
                  Max kW
                </th>
                <th className="p-[9px_10px] text-[10px] uppercase font-bold text-[#607d8b] tracking-wider text-right">
                  Avg Temp °C
                </th>
                <th className="p-[9px_10px] text-[10px] uppercase font-bold text-[#607d8b] tracking-wider text-right">
                  Max Temp °C
                </th>
                <th className="p-[9px_10px] text-[10px] uppercase font-bold text-[#607d8b] tracking-wider text-right">
                  Avg Vibr mm/s
                </th>
                <th className="p-[9px_10px] text-[10px] uppercase font-bold text-[#607d8b] tracking-wider text-right">
                  Avg Noise dB
                </th>
                <th className="p-[9px_10px] text-[10px] uppercase font-bold text-[#607d8b] tracking-wider text-right">
                  PF
                </th>
                <th className="p-[9px_10px] text-[10px] uppercase font-bold text-[#607d8b] tracking-wider text-right">
                  Fault %
                </th>
                <th className="p-[9px_10px] text-[10px] uppercase font-bold text-[#607d8b] tracking-wider text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {summary.machines.map((m, idx) => {
                const isTempBreached = m.avg_temp_c > 45 || m.max_temp_c > 45;
                const isNoiseBreached = m.avg_noise_db > 75;
                const isVibrWarning = m.avg_vibration_mm_s > 4.5;
                const isPfWarning = m.power_factor < 0.85;
                const isFaultBreached = m.fault_rate_pct > 5;

                return (
                  <tr
                    key={m.machine_id}
                    className={`table-row-hover transition-colors ${
                      idx < summary.machines.length - 1 ? 'border-b border-[#f0f4f5]' : ''
                    }`}
                  >
                    <td className="p-[10px] font-bold text-[#1e3344] font-mono text-[12px]">
                      {m.machine_id}
                    </td>
                    <td className="p-[10px] text-[#1e3344]">{m.machine_type}</td>
                    <td className="p-[10px] text-right tabular-nums text-[#1e3344]">
                      {m.avg_kw.toFixed(2)}
                    </td>
                    <td className="p-[10px] text-right tabular-nums text-[#607d8b]">
                      {m.max_kw.toFixed(2)}
                    </td>
                    <td
                      className={`p-[10px] text-right tabular-nums ${
                        isTempBreached
                          ? 'text-[#c0392b] font-bold'
                          : m.avg_temp_c > 40
                          ? 'text-[#e67e22] font-semibold'
                          : 'text-[#1e3344]'
                      }`}
                    >
                      {m.avg_temp_c.toFixed(1)}
                    </td>
                    <td
                      className={`p-[10px] text-right tabular-nums ${
                        m.max_temp_c > 45
                          ? 'text-[#c0392b] font-bold'
                          : 'text-[#607d8b]'
                      }`}
                    >
                      {m.max_temp_c.toFixed(1)}
                    </td>
                    <td
                      className={`p-[10px] text-right tabular-nums ${
                        isVibrWarning ? 'text-[#e67e22] font-bold' : 'text-[#1e3344]'
                      }`}
                    >
                      {m.avg_vibration_mm_s.toFixed(2)}
                    </td>
                    <td
                      className={`p-[10px] text-right tabular-nums ${
                        isNoiseBreached
                          ? 'text-[#c0392b] font-bold'
                          : 'text-[#1e3344]'
                      }`}
                    >
                      {m.avg_noise_db.toFixed(1)}
                    </td>
                    <td
                      className={`p-[10px] text-right tabular-nums ${
                        isPfWarning ? 'text-[#e67e22] font-bold' : 'text-[#1e3344]'
                      }`}
                    >
                      {m.power_factor.toFixed(3)}
                    </td>
                    <td
                      className={`p-[10px] text-right tabular-nums ${
                        isFaultBreached ? 'text-[#c0392b] font-bold' : 'text-[#1e3344]'
                      }`}
                    >
                      {m.fault_rate_pct.toFixed(1)}%
                    </td>
                    <td className="p-[10px] text-center">
                      <StatusPill status={m.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Horizontal CSS Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Average Power Draw by Machine */}
        <div className="bg-white rounded-[10px] p-5 border border-[#dde5ea] shadow-[0_2px_8px_rgba(15,45,69,0.06)]">
          <div className="mb-4">
            <h3 className="text-[14px] font-bold text-[#1e3344]">
              Average Power Draw by Machine
            </h3>
            <p className="text-[12px] text-[#607d8b] mt-0.5">
              Active load distribution in kW (IE3 motor audit benchmark)
            </p>
          </div>
          <div className="space-y-1">
            {summary.machines.map((m) => (
              <CssHorizontalBarRow
                key={m.machine_id}
                label={`${m.machine_id} (${m.machine_type})`}
                value={m.avg_kw}
                max={maxKw}
                displayValue={`${m.avg_kw.toFixed(2)} kW`}
                variant={m.kw_fill_color}
              />
            ))}
          </div>
        </div>

        {/* Chart 2: Fault Rate by Machine */}
        <div className="bg-white rounded-[10px] p-5 border border-[#dde5ea] shadow-[0_2px_8px_rgba(15,45,69,0.06)]">
          <div className="mb-4">
            <h3 className="text-[14px] font-bold text-[#1e3344]">
              Fault Rate by Machine
            </h3>
            <p className="text-[12px] text-[#607d8b] mt-0.5">
              Percentage of reading intervals triggering threshold anomalies
            </p>
          </div>
          <div className="space-y-1">
            {summary.machines.map((m) => (
              <CssHorizontalBarRow
                key={m.machine_id}
                label={`${m.machine_id} (${m.machine_type})`}
                value={m.fault_rate_pct}
                max={100}
                displayValue={`${m.fault_rate_pct.toFixed(1)}%`}
                variant={m.fault_fill_color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
