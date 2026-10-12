import React, { useState } from 'react';
import { DatasetInfo, COLUMN_DICTIONARY } from '../../data/dataset';
import {
  SampleDataBanner,
  StatusPill,
  LoadingSpinner,
  ErrorState,
} from '../common/Shared';

interface DatasetOverviewTabProps {
  datasetInfo: DatasetInfo | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function DatasetOverviewTab({
  datasetInfo,
  loading,
  error,
  onRetry,
}: DatasetOverviewTabProps) {
  const [filterShift, setFilterShift] = useState<'ALL' | 'A' | 'B' | 'C'>('ALL');
  const [filterFaultOnly, setFilterFaultOnly] = useState(false);

  if (loading) {
    return <LoadingSpinner text="Retrieving synthetic CSV structure and telemetry headers..." />;
  }

  if (error || !datasetInfo) {
    return (
      <ErrorState
        message={error || 'Unable to load dataset metadata.'}
        onRetry={onRetry}
      />
    );
  }

  const filteredReadings = datasetInfo.readings.filter((row) => {
    if (filterShift !== 'ALL' && row.shift !== filterShift) return false;
    if (filterFaultOnly && row.fault_flag !== 1) return false;
    return true;
  });

  const downloadCsv = () => {
    const headers = [
      'timestamp',
      'machine_id',
      'machine_type',
      'shift',
      'temperature_c',
      'humidity_pct',
      'power_kw',
      'power_factor',
      'vibration_mm_s',
      'noise_db',
      'thread_tension_n',
      'production_count',
      'fault_flag',
      'notes',
    ];
    const rows = datasetInfo.readings.map((r) => [
      r.timestamp,
      r.machine_id,
      `"${r.machine_type}"`,
      r.shift,
      r.temperature_c,
      r.humidity_pct,
      r.power_kw,
      r.power_factor,
      r.vibration_mm_s,
      r.noise_db,
      r.thread_tension_n,
      r.production_count,
      r.fault_flag,
      `"${r.notes}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `${datasetInfo.company_name.replace(/\s+/g, '_')}_sensor_data_sample.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <SampleDataBanner
        text={`Synthetic CSV Dataset — Ingestion schema for ${datasetInfo.company_name}. 15-minute sampling interval spanning 30 continuous operational days across 5 production units.`}
      />

      {/* Header Card */}
      <div className="bg-white rounded-[10px] p-5 border border-[#dde5ea] shadow-[0_2px_8px_rgba(15,45,69,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#dde5ea]">
          <div>
            <h2 className="text-[16px] font-bold text-[#1e3344] leading-tight flex items-center gap-2">
              <span>📂</span>
              <span>{datasetInfo.company_name} — Synthetic Sensor Dataset</span>
            </h2>
            <a
              href={datasetInfo.zenodo_url}
              target="_blank"
              rel="noreferrer"
              className="text-[12px] text-[#1a6ea8] hover:underline inline-flex items-center gap-1 mt-1 font-medium"
            >
              <span>Modelled on the Zenodo Small Textile Industry Dataset</span>
              <span className="font-mono text-[11px]">(zenodo.org/records/15277168)</span>
              <span>↗</span>
            </a>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#f3e8ff] text-[#6d28d9]">
              📂 CSV Source
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#e3f2fd] text-[#1565c0]">
              {datasetInfo.row_count.toLocaleString()} rows
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#e8f5f1] text-[#1d7a5f]">
              {datasetInfo.machine_count} machines
            </span>
          </div>
        </div>

        {/* 4 Mini Stat Cells */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="bg-[#f8fafb] rounded-[8px] p-3 border border-[#edf2f5]">
            <div className="text-[10px] uppercase font-bold text-[#607d8b]">Period</div>
            <div className="text-[13px] font-bold text-[#1e3344] mt-1 font-mono">
              {datasetInfo.period}
            </div>
            <div className="text-[10.5px] text-[#607d8b] mt-0.5">30 continuous days</div>
          </div>
          <div className="bg-[#f8fafb] rounded-[8px] p-3 border border-[#edf2f5]">
            <div className="text-[10px] uppercase font-bold text-[#607d8b]">Interval</div>
            <div className="text-[13px] font-bold text-[#1e3344] mt-1 font-mono">
              {datasetInfo.interval}
            </div>
            <div className="text-[10.5px] text-[#607d8b] mt-0.5">96 readings/day</div>
          </div>
          <div className="bg-[#f8fafb] rounded-[8px] p-3 border border-[#edf2f5]">
            <div className="text-[10px] uppercase font-bold text-[#607d8b]">Columns</div>
            <div className="text-[13px] font-bold text-[#1e3344] mt-1 font-mono">
              {datasetInfo.column_count} fields
            </div>
            <div className="text-[10.5px] text-[#607d8b] mt-0.5">Uniform schema</div>
          </div>
          <div className="bg-[#f8fafb] rounded-[8px] p-3 border border-[#edf2f5]">
            <div className="text-[10px] uppercase font-bold text-[#607d8b]">Faults</div>
            <div className="text-[13px] font-bold text-[#c0392b] mt-1 tabular-nums">
              {datasetInfo.total_faults.toLocaleString()} detected
            </div>
            <div className="text-[10.5px] text-[#607d8b] mt-0.5">
              {datasetInfo.fault_rate_pct.toFixed(1)}% anomaly rate
            </div>
          </div>
        </div>
      </div>

      {/* Machines in Dataset */}
      <div className="bg-white rounded-[10px] p-5 border border-[#dde5ea] shadow-[0_2px_8px_rgba(15,45,69,0.06)]">
        <div className="mb-3">
          <h3 className="text-[14px] font-bold text-[#1e3344]">Machines in Dataset</h3>
          <p className="text-[12px] text-[#607d8b] mt-0.5">
            Each machine contributes an independent time series in the CSV
          </p>
        </div>

        {/* Machine Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {datasetInfo.machines.map((m) => (
            <div
              key={m.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f0f4f8] border border-[#dde5ea] text-[12px]"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: m.dot_color }}
              />
              <span className="font-bold text-[#1e3344] font-mono">{m.id}</span>
              <span className="text-[#607d8b]">— {m.type}</span>
            </div>
          ))}
        </div>

        {/* Amber Injected Anomalies Box */}
        <div className="p-3 bg-[#fffbf0] border border-[#fde68a] rounded-[8px] text-[12px] text-[#78560a] leading-relaxed">
          {datasetInfo.anomalies_note}
        </div>
      </div>

      {/* Column Dictionary */}
      <div className="bg-white rounded-[10px] p-5 border border-[#dde5ea] shadow-[0_2px_8px_rgba(15,45,69,0.06)]">
        <div className="mb-4">
          <h3 className="text-[14px] font-bold text-[#1e3344]">Column Dictionary</h3>
          <p className="text-[12px] text-[#607d8b] mt-0.5">
            All 14 columns in the CSV with data types, descriptions, and value ranges
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {COLUMN_DICTIONARY.map((col) => (
            <div
              key={col.name}
              className="bg-[#fcfdfe] rounded-[8px] p-3.5 border border-[#dde5ea] hover:border-[#b8d0e0] transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-mono text-[12px] font-bold text-[#1a6ea8]">
                  {col.name}
                </span>
                <span className="text-[9.5px] uppercase font-bold text-[#607d8b] bg-[#edf2f7] px-1.5 py-0.5 rounded">
                  {col.type}
                </span>
              </div>
              <p className="text-[11.5px] text-[#1e3344] leading-snug mb-2">
                {col.description}
              </p>
              <div className="text-[10.5px] text-[#607d8b] font-mono leading-tight">
                ↳ {col.range}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Data — First 20 Rows */}
      <div className="bg-white rounded-[10px] p-5 border border-[#dde5ea] shadow-[0_2px_8px_rgba(15,45,69,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-[14px] font-bold text-[#1e3344]">
              Sample Data — First 20 Rows
            </h3>
            <p className="text-[12px] text-[#607d8b] mt-0.5">
              Actual rows from the synthetic CSV file for {datasetInfo.company_name}
            </p>
          </div>

          {/* Quick Filters and Download */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-[#f0f4f8] rounded-[6px] p-0.5 border border-[#dde5ea] text-[11px]">
              {(['ALL', 'A', 'B', 'C'] as const).map((shift) => (
                <button
                  key={shift}
                  onClick={() => setFilterShift(shift)}
                  className={`px-2 py-1 rounded-[4px] font-bold cursor-pointer transition-colors ${
                    filterShift === shift
                      ? 'bg-white text-[#1e3344] shadow-xs'
                      : 'text-[#607d8b] hover:text-[#1e3344]'
                  }`}
                >
                  {shift === 'ALL' ? 'All Shifts' : `Shift ${shift}`}
                </button>
              ))}
            </div>

            <button
              onClick={() => setFilterFaultOnly(!filterFaultOnly)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-[6px] border transition-colors cursor-pointer ${
                filterFaultOnly
                  ? 'bg-[#fdecea] border-[#f4b8b1] text-[#c0392b]'
                  : 'bg-white border-[#dde5ea] text-[#607d8b] hover:border-[#b8d0e0]'
              }`}
            >
              {filterFaultOnly ? '⚠️ Showing Faults Only' : 'Show Faults Only'}
            </button>

            <button
              onClick={downloadCsv}
              className="px-2.5 py-1 text-[11px] font-bold rounded-[6px] bg-[#1d7a5f] text-white hover:bg-[#16604b] transition-colors cursor-pointer inline-flex items-center gap-1 shadow-xs"
            >
              <span>📥</span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Horizontally Scrollable 14-Column Table */}
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full border-collapse text-[12px] min-w-[1100px]">
            <thead>
              <tr className="border-b-2 border-[#dde5ea] text-left">
                <th className="p-[8px_10px] text-[10px] uppercase font-bold text-[#607d8b]">
                  Timestamp
                </th>
                <th className="p-[8px_10px] text-[10px] uppercase font-bold text-[#607d8b]">
                  Machine
                </th>
                <th className="p-[8px_10px] text-[10px] uppercase font-bold text-[#607d8b]">
                  Type
                </th>
                <th className="p-[8px_10px] text-[10px] uppercase font-bold text-[#607d8b] text-center">
                  Shift
                </th>
                <th className="p-[8px_10px] text-[10px] uppercase font-bold text-[#607d8b] text-right">
                  Temp °C
                </th>
                <th className="p-[8px_10px] text-[10px] uppercase font-bold text-[#607d8b] text-right">
                  Humid %
                </th>
                <th className="p-[8px_10px] text-[10px] uppercase font-bold text-[#607d8b] text-right">
                  Power kW
                </th>
                <th className="p-[8px_10px] text-[10px] uppercase font-bold text-[#607d8b] text-right">
                  PF
                </th>
                <th className="p-[8px_10px] text-[10px] uppercase font-bold text-[#607d8b] text-right">
                  Vibr mm/s
                </th>
                <th className="p-[8px_10px] text-[10px] uppercase font-bold text-[#607d8b] text-right">
                  Noise dB
                </th>
                <th className="p-[8px_10px] text-[10px] uppercase font-bold text-[#607d8b] text-right">
                  Tension N
                </th>
                <th className="p-[8px_10px] text-[10px] uppercase font-bold text-[#607d8b] text-right">
                  Prod Count
                </th>
                <th className="p-[8px_10px] text-[10px] uppercase font-bold text-[#607d8b] text-center">
                  Fault
                </th>
                <th className="p-[8px_10px] text-[10px] uppercase font-bold text-[#607d8b]">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredReadings.map((row, idx) => {
                const isTempBreached = row.temperature_c > 45;
                const isNoiseBreached = row.noise_db > 75;

                return (
                  <tr
                    key={`${row.timestamp}_${row.machine_id}_${idx}`}
                    className={`table-row-hover transition-colors ${
                      idx < filteredReadings.length - 1 ? 'border-b border-[#f0f4f5]' : ''
                    }`}
                  >
                    <td className="p-[8px_10px] font-mono text-[11px] text-[#1e3344] whitespace-nowrap">
                      {row.timestamp}
                    </td>
                    <td className="p-[8px_10px] font-mono font-bold text-[11.5px] text-[#1a6ea8]">
                      {row.machine_id}
                    </td>
                    <td className="p-[8px_10px] text-[#1e3344] whitespace-nowrap">
                      {row.machine_type}
                    </td>
                    <td className="p-[8px_10px] text-center">
                      <StatusPill status={row.shift} type="blue" />
                    </td>
                    <td
                      className={`p-[8px_10px] text-right tabular-nums ${
                        isTempBreached ? 'text-[#c0392b] font-bold' : 'text-[#1e3344]'
                      }`}
                    >
                      {row.temperature_c.toFixed(1)}
                    </td>
                    <td className="p-[8px_10px] text-right tabular-nums text-[#1e3344]">
                      {row.humidity_pct.toFixed(1)}
                    </td>
                    <td className="p-[8px_10px] text-right tabular-nums text-[#1e3344]">
                      {row.power_kw.toFixed(3)}
                    </td>
                    <td
                      className={`p-[8px_10px] text-right tabular-nums ${
                        row.power_factor < 0.85
                          ? 'text-[#e67e22] font-semibold'
                          : 'text-[#1e3344]'
                      }`}
                    >
                      {row.power_factor.toFixed(3)}
                    </td>
                    <td
                      className={`p-[8px_10px] text-right tabular-nums ${
                        row.vibration_mm_s > 4.5
                          ? 'text-[#e67e22] font-semibold'
                          : 'text-[#1e3344]'
                      }`}
                    >
                      {row.vibration_mm_s.toFixed(3)}
                    </td>
                    <td
                      className={`p-[8px_10px] text-right tabular-nums ${
                        isNoiseBreached ? 'text-[#c0392b] font-bold' : 'text-[#1e3344]'
                      }`}
                    >
                      {row.noise_db.toFixed(1)}
                    </td>
                    <td className="p-[8px_10px] text-right tabular-nums text-[#607d8b]">
                      {row.thread_tension_n.toFixed(2)}
                    </td>
                    <td className="p-[8px_10px] text-right tabular-nums text-[#1e3344] font-medium">
                      {row.production_count.toLocaleString()}
                    </td>
                    <td className="p-[8px_10px] text-center">
                      <StatusPill
                        status={row.fault_flag === 1 ? 'FAULT' : 'OK'}
                        type={row.fault_flag === 1 ? 'red' : 'green'}
                      />
                    </td>
                    <td className="p-[8px_10px] text-[#607d8b] text-[11px] italic whitespace-nowrap">
                      {row.notes || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[#edf2f5] text-[11px] text-[#607d8b] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            Showing {filteredReadings.length} of {datasetInfo.row_count.toLocaleString()} total rows. Full dataset available in synthetic storage.
          </div>
          <div className="font-mono text-[10.5px]">
            data/{datasetInfo.company_name.replace(/\s+/g, '_')}_sensor_data.csv
          </div>
        </div>
      </div>
    </div>
  );
}
