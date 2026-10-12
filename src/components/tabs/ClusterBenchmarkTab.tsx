import React from 'react';
import {
  CLUSTER_BENCHMARKS,
  ClusterBenchmark,
} from '../../data/advancedFeatures';
import { SampleDataBanner } from '../common/Shared';

interface ClusterBenchmarkTabProps {
  selectedFactory: string;
}

export function ClusterBenchmarkTab({
  selectedFactory,
}: ClusterBenchmarkTabProps) {
  const benchmark: ClusterBenchmark =
    CLUSTER_BENCHMARKS[selectedFactory] ||
    CLUSTER_BENCHMARKS['TexAlpha Mills'];

  return (
    <div className="space-y-6">
      <SampleDataBanner
        text={`Federated Cluster Benchmarking — Compares this factory's sensor telemetry against an anonymous federated cohort of ${benchmark.total_smes_in_cluster} MSME units in the ${benchmark.cluster_name}. Provides objective peer truth to answer: "How inefficient am I compared to my neighbor?"`}
      />

      {/* Cluster Rank Banner Card */}
      <div className="bg-white rounded-[10px] p-6 border border-[#dde5ea] shadow-[0_2px_8px_rgba(15,45,69,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#fff3e0] text-[#c96a00] px-2.5 py-0.5 rounded-full">
              Federated MSME Cluster Analytics
            </span>
            <span className="text-[11px] text-[#607d8b]">
              Location: {benchmark.state}
            </span>
          </div>
          <h2 className="text-[17px] font-extrabold text-[#1e3344] tracking-tight">
            {benchmark.cluster_name}
          </h2>
          <p className="text-[12.5px] text-[#607d8b] mt-0.5">
            Peer Cohort: {benchmark.total_smes_in_cluster} active small textile manufacturing units
          </p>
        </div>

        {/* Big Rank Indicator */}
        <div className="flex items-center gap-4 bg-[#fbfcfd] p-3 px-5 rounded-[8px] border border-[#edf2f5]">
          <div className="text-center">
            <div className="text-[10px] font-bold uppercase text-[#607d8b]">
              Cluster Rank
            </div>
            <div className="text-[24px] font-black text-[#c0392b] tabular-nums leading-none mt-1">
              #{benchmark.factory_rank}{' '}
              <span className="text-[13px] font-medium text-[#607d8b]">
                / {benchmark.total_smes_in_cluster}
              </span>
            </div>
          </div>
          <div className="w-[1px] h-10 bg-[#dde5ea]" />
          <div className="text-center">
            <div className="text-[10px] font-bold uppercase text-[#607d8b]">
              Percentile Tier
            </div>
            <div className="text-[20px] font-extrabold text-[#e67e22] tabular-nums leading-none mt-1">
              {benchmark.factory_percentile.toFixed(1)}th
            </div>
            <span className="text-[9.5px] uppercase font-bold text-[#c0392b]">
              Lagging Quartile
            </span>
          </div>
        </div>
      </div>

      {/* Peer Distribution Histogram Bar */}
      <div className="bg-white rounded-[10px] p-5 border border-[#dde5ea] shadow-xs">
        <div className="mb-3">
          <h3 className="text-[13.5px] font-bold text-[#1e3344]">
            Specific Energy Consumption (SEC) Cluster Distribution Curve
          </h3>
          <p className="text-[11.5px] text-[#607d8b] mt-0.5">
            Frequency distribution of all {benchmark.total_smes_in_cluster} factories in the cluster (kWh consumed per kg of grey cloth)
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
          {benchmark.peer_distribution.map((bucket, bIdx) => (
            <div
              key={bIdx}
              className={`rounded-[8px] p-3 border transition-colors ${
                bucket.contains_factory
                  ? 'bg-[#fef9f9] border-[#f4b8b1] shadow-xs ring-2 ring-[#c0392b]/30'
                  : 'bg-[#f8fafb] border-[#edf2f5]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                <span className={bucket.contains_factory ? 'text-[#c0392b]' : 'text-[#1e3344]'}>
                  {bucket.bucket}
                </span>
                {bucket.contains_factory && (
                  <span className="text-[9px] uppercase font-black bg-[#c0392b] text-white px-1.5 py-0.2 rounded">
                    YOU ARE HERE
                  </span>
                )}
              </div>
              <div className="text-[18px] font-extrabold text-[#1e3344] tabular-nums">
                {bucket.count}{' '}
                <span className="text-[11px] font-normal text-[#607d8b]">factories</span>
              </div>
              <div className="text-[10px] text-[#607d8b] mt-0.5">
                {((bucket.count / benchmark.total_smes_in_cluster) * 100).toFixed(0)}% of cluster cohort
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metric Breakdown Table */}
      <div className="bg-white rounded-[10px] p-5 border border-[#dde5ea] shadow-xs">
        <div className="mb-4">
          <h3 className="text-[14px] font-bold text-[#1e3344]">
            Detailed Cluster Metric Comparison Matrix
          </h3>
          <p className="text-[12px] text-[#607d8b] mt-0.5">
            Evaluates mechanical and electrical efficiency against top 10% performers and the median cluster baseline
          </p>
        </div>

        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full border-collapse text-[12.5px] min-w-[700px]">
            <thead>
              <tr className="border-b-2 border-[#dde5ea] text-left">
                <th className="p-2.5 text-[10px] uppercase font-bold text-[#607d8b]">
                  Metric / Operational Parameter
                </th>
                <th className="p-2.5 text-[10px] uppercase font-bold text-[#607d8b] text-right">
                  Your Factory
                </th>
                <th className="p-2.5 text-[10px] uppercase font-bold text-[#607d8b] text-right">
                  Cluster Median
                </th>
                <th className="p-2.5 text-[10px] uppercase font-bold text-[#607d8b] text-right">
                  Top 10% (Best)
                </th>
                <th className="p-2.5 text-[10px] uppercase font-bold text-[#607d8b]">
                  Diagnostic Verdict
                </th>
              </tr>
            </thead>
            <tbody>
              {benchmark.metrics.map((m, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-[#edf2f5] hover:bg-[#f8fafb] transition-colors`}
                >
                  <td className="p-2.5 font-bold text-[#1e3344]">
                    <div>{m.label}</div>
                    <div className="text-[10.5px] text-[#607d8b] font-normal">
                      Unit: {m.unit}
                    </div>
                  </td>
                  <td className="p-2.5 text-right font-mono font-bold text-[#c0392b] text-[13px] tabular-nums">
                    {m.factory_value}
                  </td>
                  <td className="p-2.5 text-right font-mono font-semibold text-[#1e3344] tabular-nums">
                    {m.cluster_median}
                  </td>
                  <td className="p-2.5 text-right font-mono font-semibold text-[#1d7a5f] tabular-nums">
                    {m.cluster_top_10}
                  </td>
                  <td className="p-2.5 text-[11.5px] text-[#607d8b]">
                    <span className="font-semibold text-[#c0392b] block">
                      {m.verdict}
                    </span>
                    <span className="text-[10.5px] text-[#607d8b]">
                      Lagging by +{m.gap_pct.toFixed(1)}% vs peers
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Peer Truth Conclusion Box */}
      <div className="p-5 bg-[#fffbf0] border border-[#fde68a] rounded-[10px] text-[12px] text-[#78560a] leading-relaxed shadow-2xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[16px]">💡</span>
          <strong className="text-[13px] text-[#78560a]">
            The Objective Cluster Verdict: You are not paranoid; your plant is consuming 43.7% more energy per kilogram than your neighbor.
          </strong>
        </div>
        <p>
          In small textile towns like Ichalkaranji and Surat, SME owners often suspect their energy bill is too high but lack benchmark proof. Federated cluster telemetry proves that the median unit with identical loom counts achieves <strong>7.8 kWh/kg</strong> while your facility is running at <strong>11.21 kWh/kg</strong>. Implementing motor upgrades and off-peak load shifting will immediately return ₹35,000 to ₹45,000/month directly to your operating margin.
        </p>
      </div>
    </div>
  );
}
