import React, { useState } from 'react';
import {
  TOD_TARIFF_STRUCTURE,
  MACHINE_SCHEDULE_ITEMS,
  MachineScheduleItem,
} from '../../data/advancedFeatures';
import { SampleDataBanner } from '../common/Shared';

interface TariffSchedulingTabProps {
  selectedFactory: string;
  onNavigateToDispatch?: () => void;
}

export function TariffSchedulingTab({
  selectedFactory,
  onNavigateToDispatch,
}: TariffSchedulingTabProps) {
  const initialItems =
    MACHINE_SCHEDULE_ITEMS[selectedFactory] ||
    MACHINE_SCHEDULE_ITEMS['TexAlpha Mills'];

  // Track which shiftable machines are toggled for optimization
  const [shiftedMachines, setShiftedMachines] = useState<Record<string, boolean>>({
    'TA-COMP-01': true,
    'TA-WARP-01': true,
    'BW-DYE-01': true,
    'BW-HEAT-01': true,
    'BW-COMP-01': true,
  });

  const [scheduleCommitted, setScheduleCommitted] = useState(false);

  const toggleMachineShift = (id: string) => {
    setShiftedMachines((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    setScheduleCommitted(false);
  };

  // Compute total monthly savings based on active toggles
  const totalDailySavingInr = initialItems.reduce((acc, m) => {
    return acc + (shiftedMachines[m.machine_id] ? m.saving_per_cycle_inr : 0);
  }, 0);

  const totalMonthlySavingInr = totalDailySavingInr * 26; // 26 working days
  const totalMonthlyCarbonKg =
    initialItems.reduce((acc, m) => {
      return acc + (shiftedMachines[m.machine_id] ? m.carbon_reduction_kg : 0);
    }, 0) * 26;

  return (
    <div className="space-y-6">
      <SampleDataBanner
        text={`Time-of-Day (ToD) Tariff & Carbon-Aware Dispatch — Leverages utility differential tariffs (DISCOM Night Rebate ₹4.80/kWh vs Evening Surcharge ₹11.50/kWh) and grid carbon intensity to shift batch machine operations into optimal low-cost, low-carbon windows.`}
      />

      {/* DISCOM Tariff Structure Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TOD_TARIFF_STRUCTURE.map((slot, sIdx) => {
          const isPeak = slot.slot_type === 'PEAK';
          const isOffPeak = slot.slot_type === 'OFF_PEAK';

          return (
            <div
              key={sIdx}
              className={`rounded-[10px] p-5 border shadow-xs ${
                isPeak
                  ? 'bg-[#fef9f9] border-[#f4b8b1]'
                  : isOffPeak
                  ? 'bg-[#eef7f3] border-[#c8e6c9]'
                  : 'bg-white border-[#dde5ea]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    isPeak
                      ? 'bg-[#fdecea] text-[#c0392b]'
                      : isOffPeak
                      ? 'bg-[#e8f5f1] text-[#1d7a5f]'
                      : 'bg-[#f0f4f8] text-[#1e3344]'
                  }`}
                >
                  {slot.slot_type === 'PEAK'
                    ? '⚠️ PEAK TARIFF ZONE'
                    : slot.slot_type === 'OFF_PEAK'
                    ? '✓ OFF-PEAK GREEN ZONE'
                    : 'NORMAL DAY ZONE'}
                </span>
                <span className="text-[11px] font-mono text-[#607d8b]">
                  {slot.time_range}
                </span>
              </div>

              <div className="text-[26px] font-black text-[#1e3344] tabular-nums my-1">
                ₹{slot.rate_per_kwh.toFixed(2)}{' '}
                <span className="text-[12px] font-normal text-[#607d8b]">/ kWh</span>
              </div>

              <div className="text-[11.5px] font-medium text-[#1e3344] leading-snug">
                {slot.label}
              </div>

              <div className="mt-3 pt-2.5 border-t border-black/5 text-[11px] text-[#607d8b] flex items-center justify-between">
                <span>Grid Carbon Factor:</span>
                <span className="font-mono font-bold text-[#1e3344]">
                  {slot.grid_carbon_kg_kwh} kg CO₂/kWh
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Load Shifting Simulator */}
      <div className="bg-white rounded-[10px] p-5 border border-[#dde5ea] shadow-[0_2px_8px_rgba(15,45,69,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-[14px] font-bold text-[#1e3344]">
              Batch Equipment Load Shifting Simulator
            </h3>
            <p className="text-[12px] text-[#607d8b] mt-0.5">
              Toggle non-continuous batch equipment to shift duty cycles from peak hours (18:00–22:00) to off-peak night hours (22:00–06:00)
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#f8fafb] p-2.5 px-3.5 rounded-[8px] border border-[#edf2f5]">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#607d8b] block">
                Projected Monthly Savings
              </span>
              <span className="text-[18px] font-black text-[#1d7a5f] tabular-nums">
                ₹{totalMonthlySavingInr.toLocaleString()}/mo
              </span>
            </div>
            <div className="w-[1px] h-8 bg-[#dde5ea]" />
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#607d8b] block">
                Carbon Abatement
              </span>
              <span className="text-[16px] font-black text-[#1565c0] tabular-nums">
                {(totalMonthlyCarbonKg / 1000).toFixed(2)} t CO₂/mo
              </span>
            </div>
          </div>
        </div>

        {/* Machine Table with Toggles */}
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full border-collapse text-[12.5px] min-w-[700px]">
            <thead>
              <tr className="border-b-2 border-[#dde5ea] text-left">
                <th className="p-2.5 text-[10px] uppercase font-bold text-[#607d8b]">
                  Machine Asset
                </th>
                <th className="p-2.5 text-[10px] uppercase font-bold text-[#607d8b]">
                  Current Schedule
                </th>
                <th className="p-2.5 text-[10px] uppercase font-bold text-[#607d8b]">
                  Recommended ToD Shift
                </th>
                <th className="p-2.5 text-[10px] uppercase font-bold text-[#607d8b] text-right">
                  Saving / Cycle
                </th>
                <th className="p-2.5 text-[10px] uppercase font-bold text-[#607d8b] text-center">
                  Optimization State
                </th>
              </tr>
            </thead>
            <tbody>
              {initialItems.map((item: MachineScheduleItem) => {
                const isShifted = shiftedMachines[item.machine_id];

                return (
                  <tr
                    key={item.machine_id}
                    className="border-b border-[#edf2f5] hover:bg-[#f8fafb] transition-colors"
                  >
                    <td className="p-2.5">
                      <div className="font-bold text-[#1e3344] font-mono text-[12px]">
                        {item.machine_id}
                      </div>
                      <div className="text-[11.5px] text-[#607d8b]">
                        {item.machine_type} ({item.nominal_kw.toFixed(2)} kW)
                      </div>
                    </td>

                    <td className="p-2.5 text-[#c0392b] font-medium">
                      <span className="bg-[#fdecea] px-2 py-0.5 rounded text-[11px] font-bold">
                        {item.current_slot}
                      </span>
                    </td>

                    <td className="p-2.5 text-[#1d7a5f] font-medium">
                      {item.can_shift ? (
                        <span className="bg-[#e8f5f1] px-2 py-0.5 rounded text-[11px] font-bold">
                          {item.optimized_slot}
                        </span>
                      ) : (
                        <span className="text-[#607d8b] text-[11px] italic">
                          Base load (Continuous loom weaving)
                        </span>
                      )}
                    </td>

                    <td className="p-2.5 text-right font-mono font-bold text-[#1d7a5f] tabular-nums">
                      {item.can_shift ? `+₹${item.saving_per_cycle_inr}` : '—'}
                    </td>

                    <td className="p-2.5 text-center">
                      {item.can_shift ? (
                        <button
                          onClick={() => toggleMachineShift(item.machine_id)}
                          className={`px-3 py-1 text-[11px] font-bold rounded-[6px] transition-colors cursor-pointer border ${
                            isShifted
                              ? 'bg-[#1d7a5f] text-white border-[#1d7a5f]'
                              : 'bg-white text-[#607d8b] border-[#dde5ea] hover:border-[#b8d0e0]'
                          }`}
                        >
                          {isShifted ? '✓ Shift Enabled' : 'Leave in Peak'}
                        </button>
                      ) : (
                        <span className="text-[10.5px] text-[#607d8b] font-medium">
                          Non-Shiftable
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Commitment Action Bar */}
        <div className="mt-5 pt-4 border-t border-[#edf2f5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[12px] text-[#607d8b]">
            {scheduleCommitted ? (
              <span className="text-[#1d7a5f] font-bold">
                ✓ Shift schedule committed and synced with floor dispatch queue.
              </span>
            ) : (
              <span>
                Commit this plan to automatically generate vernacular shift alerts for floor supervisors.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setScheduleCommitted(true)}
              className="px-4 py-2 text-[12px] font-bold rounded-[6px] bg-[#1d7a5f] text-white hover:bg-[#16604b] transition-colors cursor-pointer shadow-xs"
            >
              <span>💾</span>
              <span>Commit Dispatch Schedule</span>
            </button>

            {onNavigateToDispatch && (
              <button
                onClick={onNavigateToDispatch}
                className="px-3.5 py-2 text-[12px] font-bold rounded-[6px] bg-[#0f2d45] text-white hover:bg-[#1a3d5c] transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>🎙️</span>
                <span>Review Vernacular Floor Alerts →</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
