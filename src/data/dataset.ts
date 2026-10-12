export interface MachineAggregate {
  machine_id: string;
  machine_type: string;
  avg_kw: number;
  max_kw: number;
  avg_temp_c: number;
  max_temp_c: number;
  avg_vibration_mm_s: number;
  avg_noise_db: number;
  power_factor: number;
  fault_rate_pct: number;
  status: 'OK' | 'WARNING' | 'ALERT';
  kw_fill_color: 'green' | 'amber' | 'red';
  fault_fill_color: 'green' | 'amber' | 'red';
}

export interface FactorySummary {
  company_name: string;
  total_readings: number;
  est_monthly_energy_kwh: number;
  avg_power_factor: number;
  fault_rate_pct: number;
  peak_demand_kw: number;
  co2_footprint_tonnes: number;
  annual_energy_bill_k: number;
  machines_monitored: number;
  period_start: string;
  period_end: string;
  machines: MachineAggregate[];
}

export interface SensorReading {
  timestamp: string;
  machine_id: string;
  machine_type: string;
  shift: 'A' | 'B' | 'C';
  temperature_c: number;
  humidity_pct: number;
  power_kw: number;
  power_factor: number;
  vibration_mm_s: number;
  noise_db: number;
  thread_tension_n: number;
  production_count: number;
  fault_flag: 0 | 1;
  notes: string;
}

export interface DatasetInfo {
  company_name: string;
  zenodo_url: string;
  zenodo_id: string;
  row_count: number;
  machine_count: number;
  period: string;
  interval: string;
  column_count: number;
  total_faults: number;
  fault_rate_pct: number;
  machines: Array<{
    id: string;
    type: string;
    color: string;
    dot_color: string;
  }>;
  anomalies_note: string;
  readings: SensorReading[];
}

export interface ColumnDefinition {
  name: string;
  type: string;
  description: string;
  range: string;
}

export interface Finding {
  parameter: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'NON-COMPLIANT' | 'WARNING' | 'COMPLIANT';
  framework: string;
  actual_value: string;
  regulatory_limit: string;
  recommendation: string;
}

export interface MachineCompliance {
  machine_id: string;
  machine_type: string;
  score: number;
  status: 'COMPLIANT' | 'WARNING' | 'NON-COMPLIANT';
  findings: Finding[];
}

export interface OptimisationSuggestion {
  id: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  est_saving_pct: number;
  finding: string;
  action: string;
  framework: string;
}

export interface AuditReportData {
  company_name: string;
  score: number;
  status: 'COMPLIANT' | 'PARTIALLY COMPLIANT' | 'NON-COMPLIANT';
  critical_findings_count: number;
  non_compliant_machines_count: number;
  period: string;
  readings_count: number;
  machines_count: number;
  annual_energy_mwh: number;
  power_factor: number;
  power_factor_compliant: boolean;
  power_factor_note: string;
  co2_per_year_tonnes: number;
  total_faults: number;
  potential_savings_k: number;
  machine_compliance: MachineCompliance[];
  suggestions: OptimisationSuggestion[];
  frameworks: string[];
}

export interface CompanyComparisonProfile {
  name: string;
  score: number;
  score_color: 'green' | 'amber' | 'red';
  status: 'COMPLIANT' | 'PARTIALLY COMPLIANT' | 'NON-COMPLIANT';
  critical_findings_count: number;
  annual_energy_mwh: number;
  annual_bill_k: number;
  co2_per_year_tonnes: number;
  fault_rate_pct: number;
  power_factor: number;
  potential_savings_k: number;
  non_compliant_machines: string[];
  top_high_actions: Array<{
    category: string;
    description: string;
  }>;
}

export interface CompanyComparison {
  banner_note: string;
  winner_badges: Array<{
    title: string;
    winner: string;
    color: 'green' | 'blue';
  }>;
  kpis: Array<{
    label: string;
    tex_val: string;
    beta_val: string;
    winner: 'TexAlpha Mills' | 'BetaWeave Industries';
  }>;
  tex_alpha: CompanyComparisonProfile;
  beta_weave: CompanyComparisonProfile;
}

export const COLUMN_DICTIONARY: ColumnDefinition[] = [
  {
    name: 'timestamp',
    type: 'DATETIME',
    description: 'Reading timestamp recorded in UTC at uniform factory intervals',
    range: '15-min intervals, 30 days continuous',
  },
  {
    name: 'machine_id',
    type: 'STRING',
    description: 'Unique identifier assigned to factory production asset',
    range: 'TA-LOOM-01, TA-LOOM-02, TA-SPIN-01...',
  },
  {
    name: 'machine_type',
    type: 'STRING',
    description: 'Industrial category classification of the physical equipment',
    range: 'Power Loom, Ring Spinning, Dyeing Machine, Air Compressor...',
  },
  {
    name: 'shift',
    type: 'ENUM',
    description: 'Operational work shift designation for worker rotation tracking',
    range: 'A (06:00-14:00) · B (14:00-22:00) · C (22:00-06:00)',
  },
  {
    name: 'temperature_c',
    type: 'FLOAT °C',
    description: 'Machine casing / motor surface operating temperature',
    range: 'Normal 30–50°C · Critical > 50°C · Threshold 45°C',
  },
  {
    name: 'humidity_pct',
    type: 'FLOAT %',
    description: 'Weaving/spinning hall relative ambient humidity',
    range: '40–95 % RH (controlled process environment)',
  },
  {
    name: 'power_kw',
    type: 'FLOAT kW',
    description: 'Instantaneous active electrical power draw',
    range: '0.00 kW (idle/off) to rated equipment peak demand',
  },
  {
    name: 'power_factor',
    type: 'FLOAT 0–1',
    description: 'Ratio of real power to apparent power (BEE statutory limit ≥ 0.85)',
    range: '0.65 – 0.99 (reactive penalty zone below 0.85)',
  },
  {
    name: 'vibration_mm_s',
    type: 'FLOAT mm/s',
    description: 'RMS vibration velocity for motor & bearing health (ISO 10816)',
    range: 'Normal < 4.5 · Warning 4.5–7.1 · Critical > 7.1 mm/s',
  },
  {
    name: 'noise_db',
    type: 'FLOAT dB',
    description: 'Ambient sound pressure level at operator position (CPCB limit 75 dB)',
    range: '30 – 110 dB(A) continuous equivalent',
  },
  {
    name: 'thread_tension_n',
    type: 'FLOAT N',
    description: 'Warp/weft mechanical yarn tension (weaving & spinning only)',
    range: '0.0 – 40.0 N dynamic yarn load',
  },
  {
    name: 'production_count',
    type: 'INTEGER',
    description: 'Cumulative units/picks produced per machine across the period',
    range: 'Monotonically increasing meter ticks',
  },
  {
    name: 'fault_flag',
    type: 'BIT 0/1',
    description: 'Sensor-triggered threshold violation or hardware anomaly in interval',
    range: '0 = OK · 1 = Fault / Anomaly Detected',
  },
  {
    name: 'notes',
    type: 'STRING',
    description: 'System log annotations, shift maintenance tags, or fault codes',
    range: 'Scheduled maintenance, Fault detected, Peak run...',
  },
];

export const REGULATORY_FRAMEWORKS = [
  'Environment Protection Act 1986 (CPCB Noise Rules 2000)',
  'Factories Act 1948 — IS 3103 (workplace ventilation & temperature)',
  'Energy Conservation Act 2001 / BEE Guidelines',
  'IS 1860 / IEC 60034 (motor efficiency — IE3 mandate)',
  'ISO 10816 / IS 2974 (vibration velocity severity guidelines)',
  'ISO 50001:2018 Energy Management System standard',
  'MSME Sustainable Manufacturing Guidelines 2022',
  'CEA Grid Emission Factor 2023 (0.82 kg CO₂/kWh baseline)',
  'Electricity Act 2003 — Power Factor penalty & tariff norms',
];

// Sample readings for TexAlpha Mills
const TEXALPHA_SAMPLE_ROWS: SensorReading[] = [
  {
    timestamp: '2026-09-01 00:00',
    machine_id: 'TA-LOOM-01',
    machine_type: 'Power Loom',
    shift: 'C',
    temperature_c: 33.7,
    humidity_pct: 69.0,
    power_kw: 2.28,
    power_factor: 0.887,
    vibration_mm_s: 0.6,
    noise_db: 43.5,
    thread_tension_n: 0.6,
    production_count: 7,
    fault_flag: 0,
    notes: 'Normal operation',
  },
  {
    timestamp: '2026-09-01 00:00',
    machine_id: 'TA-LOOM-02',
    machine_type: 'Power Loom',
    shift: 'C',
    temperature_c: 39.2,
    humidity_pct: 65.2,
    power_kw: 3.97,
    power_factor: 0.851,
    vibration_mm_s: 2.31,
    noise_db: 44.1,
    thread_tension_n: 10.65,
    production_count: 0,
    fault_flag: 1,
    notes: 'Fault detected',
  },
  {
    timestamp: '2026-09-01 06:00',
    machine_id: 'TA-LOOM-01',
    machine_type: 'Power Loom',
    shift: 'A',
    temperature_c: 34.9,
    humidity_pct: 67.1,
    power_kw: 3.71,
    power_factor: 0.878,
    vibration_mm_s: 1.84,
    noise_db: 72.5,
    thread_tension_n: 18.52,
    production_count: 48,
    fault_flag: 0,
    notes: 'Shift start inspection',
  },
  {
    timestamp: '2026-09-01 06:00',
    machine_id: 'TA-COMP-01',
    machine_type: 'Air Compressor',
    shift: 'A',
    temperature_c: 45.6,
    humidity_pct: 61.4,
    power_kw: 7.49,
    power_factor: 0.878,
    vibration_mm_s: 1.92,
    noise_db: 83.4,
    thread_tension_n: 0.0,
    production_count: 0,
    fault_flag: 0,
    notes: 'Pneumatic line pressurization',
  },
  {
    timestamp: '2026-09-03 02:00',
    machine_id: 'TA-LOOM-01',
    machine_type: 'Power Loom',
    shift: 'C',
    temperature_c: 0.0,
    humidity_pct: 72.6,
    power_kw: 0.0,
    power_factor: 0.88,
    vibration_mm_s: 0.0,
    noise_db: 7.2,
    thread_tension_n: 0.0,
    production_count: 2880,
    fault_flag: 0,
    notes: 'Scheduled maintenance',
  },
  {
    timestamp: '2026-09-03 08:15',
    machine_id: 'TA-SPIN-01',
    machine_type: 'Ring Spinning',
    shift: 'A',
    temperature_c: 38.4,
    humidity_pct: 64.2,
    power_kw: 9.12,
    power_factor: 0.882,
    vibration_mm_s: 1.25,
    noise_db: 46.2,
    thread_tension_n: 24.1,
    production_count: 3120,
    fault_flag: 0,
    notes: 'Full spindle velocity',
  },
  {
    timestamp: '2026-09-03 12:30',
    machine_id: 'TA-LOOM-02',
    machine_type: 'Power Loom',
    shift: 'A',
    temperature_c: 46.2,
    humidity_pct: 58.9,
    power_kw: 4.15,
    power_factor: 0.849,
    vibration_mm_s: 2.85,
    noise_db: 47.8,
    thread_tension_n: 14.2,
    production_count: 1420,
    fault_flag: 1,
    notes: 'Overheating threshold trip',
  },
  {
    timestamp: '2026-09-04 14:00',
    machine_id: 'TA-WARP-01',
    machine_type: 'Warping Machine',
    shift: 'B',
    temperature_c: 33.1,
    humidity_pct: 68.4,
    power_kw: 1.82,
    power_factor: 0.88,
    vibration_mm_s: 1.12,
    noise_db: 42.1,
    thread_tension_n: 12.0,
    production_count: 850,
    fault_flag: 0,
    notes: 'Warp beam winding nominal',
  },
  {
    timestamp: '2026-09-05 18:45',
    machine_id: 'TA-COMP-01',
    machine_type: 'Air Compressor',
    shift: 'B',
    temperature_c: 48.9,
    humidity_pct: 62.0,
    power_kw: 8.95,
    power_factor: 0.875,
    vibration_mm_s: 2.1,
    noise_db: 84.7,
    thread_tension_n: 0.0,
    production_count: 0,
    fault_flag: 0,
    notes: 'High demand continuous charge',
  },
  {
    timestamp: '2026-09-06 23:15',
    machine_id: 'TA-LOOM-02',
    machine_type: 'Power Loom',
    shift: 'C',
    temperature_c: 43.8,
    humidity_pct: 70.1,
    power_kw: 3.88,
    power_factor: 0.85,
    vibration_mm_s: 2.45,
    noise_db: 45.0,
    thread_tension_n: 9.8,
    production_count: 2190,
    fault_flag: 1,
    notes: 'Fault detected - thermal slip',
  },
  {
    timestamp: '2026-09-07 07:00',
    machine_id: 'TA-SPIN-01',
    machine_type: 'Ring Spinning',
    shift: 'A',
    temperature_c: 39.1,
    humidity_pct: 66.5,
    power_kw: 8.65,
    power_factor: 0.879,
    vibration_mm_s: 1.18,
    noise_db: 44.5,
    thread_tension_n: 23.8,
    production_count: 4250,
    fault_flag: 0,
    notes: 'Bobbin batch turnover',
  },
  {
    timestamp: '2026-09-08 10:30',
    machine_id: 'TA-LOOM-01',
    machine_type: 'Power Loom',
    shift: 'A',
    temperature_c: 36.5,
    humidity_pct: 63.8,
    power_kw: 2.92,
    power_factor: 0.881,
    vibration_mm_s: 1.2,
    noise_db: 43.8,
    thread_tension_n: 11.5,
    production_count: 3640,
    fault_flag: 0,
    notes: 'Weave count stable',
  },
  {
    timestamp: '2026-09-09 15:20',
    machine_id: 'TA-LOOM-02',
    machine_type: 'Power Loom',
    shift: 'B',
    temperature_c: 45.1,
    humidity_pct: 60.3,
    power_kw: 4.1,
    power_factor: 0.848,
    vibration_mm_s: 2.92,
    noise_db: 48.1,
    thread_tension_n: 13.9,
    production_count: 2900,
    fault_flag: 1,
    notes: 'Fault detected - friction alarm',
  },
  {
    timestamp: '2026-09-10 19:40',
    machine_id: 'TA-WARP-01',
    machine_type: 'Warping Machine',
    shift: 'B',
    temperature_c: 34.0,
    humidity_pct: 69.2,
    power_kw: 1.76,
    power_factor: 0.879,
    vibration_mm_s: 1.15,
    noise_db: 43.0,
    thread_tension_n: 12.4,
    production_count: 1980,
    fault_flag: 0,
    notes: 'Creel tension balanced',
  },
  {
    timestamp: '2026-09-11 22:10',
    machine_id: 'TA-COMP-01',
    machine_type: 'Air Compressor',
    shift: 'C',
    temperature_c: 47.3,
    humidity_pct: 67.8,
    power_kw: 6.2,
    power_factor: 0.876,
    vibration_mm_s: 1.8,
    noise_db: 79.5,
    thread_tension_n: 0.0,
    production_count: 0,
    fault_flag: 0,
    notes: 'Receiver tank purge',
  },
  {
    timestamp: '2026-09-12 04:30',
    machine_id: 'TA-SPIN-01',
    machine_type: 'Ring Spinning',
    shift: 'C',
    temperature_c: 39.8,
    humidity_pct: 71.0,
    power_kw: 8.8,
    power_factor: 0.878,
    vibration_mm_s: 1.15,
    noise_db: 44.1,
    thread_tension_n: 24.5,
    production_count: 6100,
    fault_flag: 0,
    notes: 'Night shift automatic feed',
  },
  {
    timestamp: '2026-09-13 11:15',
    machine_id: 'TA-LOOM-01',
    machine_type: 'Power Loom',
    shift: 'A',
    temperature_c: 37.2,
    humidity_pct: 62.4,
    power_kw: 3.05,
    power_factor: 0.884,
    vibration_mm_s: 1.28,
    noise_db: 44.0,
    thread_tension_n: 11.8,
    production_count: 4890,
    fault_flag: 0,
    notes: 'Standard run',
  },
  {
    timestamp: '2026-09-14 16:50',
    machine_id: 'TA-LOOM-02',
    machine_type: 'Power Loom',
    shift: 'B',
    temperature_c: 46.5,
    humidity_pct: 59.8,
    power_kw: 4.22,
    power_factor: 0.852,
    vibration_mm_s: 3.1,
    noise_db: 49.3,
    thread_tension_n: 15.1,
    production_count: 3600,
    fault_flag: 1,
    notes: 'Fault detected - peak heat',
  },
  {
    timestamp: '2026-09-15 21:05',
    machine_id: 'TA-COMP-01',
    machine_type: 'Air Compressor',
    shift: 'B',
    temperature_c: 51.6,
    humidity_pct: 63.5,
    power_kw: 9.38,
    power_factor: 0.878,
    vibration_mm_s: 2.2,
    noise_db: 83.9,
    thread_tension_n: 0.0,
    production_count: 0,
    fault_flag: 0,
    notes: 'Max cycle pressure',
  },
  {
    timestamp: '2026-09-16 01:25',
    machine_id: 'TA-WARP-01',
    machine_type: 'Warping Machine',
    shift: 'C',
    temperature_c: 33.8,
    humidity_pct: 70.5,
    power_kw: 1.74,
    power_factor: 0.88,
    vibration_mm_s: 1.14,
    noise_db: 43.6,
    thread_tension_n: 12.1,
    production_count: 3100,
    fault_flag: 0,
    notes: 'Standard warp speed',
  },
];

// Sample readings for BetaWeave Industries
const BETAWEAVE_SAMPLE_ROWS: SensorReading[] = [
  {
    timestamp: '2026-09-01 00:00',
    machine_id: 'BW-LOOM-01',
    machine_type: 'Shuttle Loom',
    shift: 'C',
    temperature_c: 35.1,
    humidity_pct: 66.4,
    power_kw: 2.45,
    power_factor: 0.872,
    vibration_mm_s: 1.45,
    noise_db: 68.2,
    thread_tension_n: 8.5,
    production_count: 12,
    fault_flag: 0,
    notes: 'Night shift cycle',
  },
  {
    timestamp: '2026-09-01 00:00',
    machine_id: 'BW-DYE-01',
    machine_type: 'Jigger Dyeing Machine',
    shift: 'C',
    temperature_c: 48.5,
    humidity_pct: 88.0,
    power_kw: 5.62,
    power_factor: 0.855,
    vibration_mm_s: 3.4,
    noise_db: 74.0,
    thread_tension_n: 0.0,
    production_count: 5,
    fault_flag: 1,
    notes: 'Fault detected - steam bath thermal runaway',
  },
  {
    timestamp: '2026-09-01 06:00',
    machine_id: 'BW-HEAT-01',
    machine_type: 'Thermic Fluid Boiler',
    shift: 'A',
    temperature_c: 54.2,
    humidity_pct: 54.1,
    power_kw: 7.8,
    power_factor: 0.86,
    vibration_mm_s: 4.82,
    noise_db: 78.6,
    thread_tension_n: 0.0,
    production_count: 0,
    fault_flag: 1,
    notes: 'Critical casing temperature > 50°C',
  },
  {
    timestamp: '2026-09-01 06:00',
    machine_id: 'BW-SPIN-01',
    machine_type: 'Rotor Spinning',
    shift: 'A',
    temperature_c: 38.2,
    humidity_pct: 65.0,
    power_kw: 6.4,
    power_factor: 0.87,
    vibration_mm_s: 1.6,
    noise_db: 71.0,
    thread_tension_n: 19.5,
    production_count: 42,
    fault_flag: 0,
    notes: 'Standard rotor speed',
  },
  {
    timestamp: '2026-09-02 09:15',
    machine_id: 'BW-COMP-01',
    machine_type: 'Screw Compressor',
    shift: 'A',
    temperature_c: 44.8,
    humidity_pct: 62.5,
    power_kw: 5.1,
    power_factor: 0.868,
    vibration_mm_s: 1.85,
    noise_db: 76.5,
    thread_tension_n: 0.0,
    production_count: 0,
    fault_flag: 0,
    notes: 'Air line duty cycle',
  },
  {
    timestamp: '2026-09-02 14:00',
    machine_id: 'BW-DYE-01',
    machine_type: 'Jigger Dyeing Machine',
    shift: 'B',
    temperature_c: 52.1,
    humidity_pct: 91.2,
    power_kw: 6.05,
    power_factor: 0.852,
    vibration_mm_s: 3.9,
    noise_db: 76.2,
    thread_tension_n: 0.0,
    production_count: 14,
    fault_flag: 1,
    notes: 'Excess liquor temp & noise',
  },
  {
    timestamp: '2026-09-03 18:30',
    machine_id: 'BW-HEAT-01',
    machine_type: 'Thermic Fluid Boiler',
    shift: 'B',
    temperature_c: 56.4,
    humidity_pct: 51.0,
    power_kw: 8.2,
    power_factor: 0.858,
    vibration_mm_s: 5.15,
    noise_db: 81.2,
    thread_tension_n: 0.0,
    production_count: 0,
    fault_flag: 1,
    notes: 'Vibration & thermal alarm trip',
  },
  {
    timestamp: '2026-09-04 01:10',
    machine_id: 'BW-LOOM-01',
    machine_type: 'Shuttle Loom',
    shift: 'C',
    temperature_c: 36.4,
    humidity_pct: 68.0,
    power_kw: 2.5,
    power_factor: 0.871,
    vibration_mm_s: 1.52,
    noise_db: 69.1,
    thread_tension_n: 8.8,
    production_count: 1400,
    fault_flag: 0,
    notes: 'Weaving nominal',
  },
  {
    timestamp: '2026-09-04 08:00',
    machine_id: 'BW-SPIN-01',
    machine_type: 'Rotor Spinning',
    shift: 'A',
    temperature_c: 39.5,
    humidity_pct: 64.0,
    power_kw: 6.55,
    power_factor: 0.872,
    vibration_mm_s: 1.65,
    noise_db: 72.4,
    thread_tension_n: 20.1,
    production_count: 2200,
    fault_flag: 0,
    notes: 'Shift run steady',
  },
  {
    timestamp: '2026-09-05 13:45',
    machine_id: 'BW-DYE-01',
    machine_type: 'Jigger Dyeing Machine',
    shift: 'A',
    temperature_c: 49.8,
    humidity_pct: 86.5,
    power_kw: 5.8,
    power_factor: 0.854,
    vibration_mm_s: 3.65,
    noise_db: 75.1,
    thread_tension_n: 0.0,
    production_count: 28,
    fault_flag: 1,
    notes: 'Fault detected - effluent circulation',
  },
  {
    timestamp: '2026-09-06 20:15',
    machine_id: 'BW-HEAT-01',
    machine_type: 'Thermic Fluid Boiler',
    shift: 'B',
    temperature_c: 55.0,
    humidity_pct: 53.0,
    power_kw: 8.0,
    power_factor: 0.862,
    vibration_mm_s: 4.9,
    noise_db: 79.4,
    thread_tension_n: 0.0,
    production_count: 0,
    fault_flag: 1,
    notes: 'Bearing vibration warning',
  },
  {
    timestamp: '2026-09-07 03:00',
    machine_id: 'BW-COMP-01',
    machine_type: 'Screw Compressor',
    shift: 'C',
    temperature_c: 43.1,
    humidity_pct: 67.2,
    power_kw: 4.9,
    power_factor: 0.87,
    vibration_mm_s: 1.72,
    noise_db: 75.8,
    thread_tension_n: 0.0,
    production_count: 0,
    fault_flag: 0,
    notes: 'Unloaded air cycle',
  },
  {
    timestamp: '2026-09-08 11:20',
    machine_id: 'BW-LOOM-01',
    machine_type: 'Shuttle Loom',
    shift: 'A',
    temperature_c: 37.0,
    humidity_pct: 63.5,
    power_kw: 2.6,
    power_factor: 0.873,
    vibration_mm_s: 1.58,
    noise_db: 70.0,
    thread_tension_n: 9.1,
    production_count: 3100,
    fault_flag: 0,
    notes: 'Weave count nominal',
  },
  {
    timestamp: '2026-09-09 16:30',
    machine_id: 'BW-DYE-01',
    machine_type: 'Jigger Dyeing Machine',
    shift: 'B',
    temperature_c: 51.4,
    humidity_pct: 89.4,
    power_kw: 5.95,
    power_factor: 0.851,
    vibration_mm_s: 3.8,
    noise_db: 76.0,
    thread_tension_n: 0.0,
    production_count: 45,
    fault_flag: 1,
    notes: 'Fault detected - bath overheating',
  },
  {
    timestamp: '2026-09-10 22:50',
    machine_id: 'BW-HEAT-01',
    machine_type: 'Thermic Fluid Boiler',
    shift: 'C',
    temperature_c: 57.1,
    humidity_pct: 50.5,
    power_kw: 8.35,
    power_factor: 0.857,
    vibration_mm_s: 5.3,
    noise_db: 82.0,
    thread_tension_n: 0.0,
    production_count: 0,
    fault_flag: 1,
    notes: 'Critical high vibration trip',
  },
  {
    timestamp: '2026-09-11 07:15',
    machine_id: 'BW-SPIN-01',
    machine_type: 'Rotor Spinning',
    shift: 'A',
    temperature_c: 38.9,
    humidity_pct: 66.2,
    power_kw: 6.48,
    power_factor: 0.871,
    vibration_mm_s: 1.62,
    noise_db: 71.8,
    thread_tension_n: 19.8,
    production_count: 4500,
    fault_flag: 0,
    notes: 'Sliver feed synchronized',
  },
  {
    timestamp: '2026-09-12 12:40',
    machine_id: 'BW-COMP-01',
    machine_type: 'Screw Compressor',
    shift: 'A',
    temperature_c: 45.2,
    humidity_pct: 61.8,
    power_kw: 5.25,
    power_factor: 0.867,
    vibration_mm_s: 1.9,
    noise_db: 77.2,
    thread_tension_n: 0.0,
    production_count: 0,
    fault_flag: 0,
    notes: 'Continuous delivery mode',
  },
  {
    timestamp: '2026-09-13 17:00',
    machine_id: 'BW-DYE-01',
    machine_type: 'Jigger Dyeing Machine',
    shift: 'B',
    temperature_c: 50.6,
    humidity_pct: 87.8,
    power_kw: 5.88,
    power_factor: 0.853,
    vibration_mm_s: 3.72,
    noise_db: 75.5,
    thread_tension_n: 0.0,
    production_count: 62,
    fault_flag: 1,
    notes: 'Fault detected - wash drain cycle',
  },
  {
    timestamp: '2026-09-14 21:40',
    machine_id: 'BW-HEAT-01',
    machine_type: 'Thermic Fluid Boiler',
    shift: 'B',
    temperature_c: 55.8,
    humidity_pct: 52.3,
    power_kw: 8.12,
    power_factor: 0.86,
    vibration_mm_s: 5.05,
    noise_db: 80.5,
    thread_tension_n: 0.0,
    production_count: 0,
    fault_flag: 1,
    notes: 'Severe acoustic noise warning',
  },
  {
    timestamp: '2026-09-15 02:15',
    machine_id: 'BW-LOOM-01',
    machine_type: 'Shuttle Loom',
    shift: 'C',
    temperature_c: 36.8,
    humidity_pct: 67.5,
    power_kw: 2.52,
    power_factor: 0.87,
    vibration_mm_s: 1.55,
    noise_db: 69.8,
    thread_tension_n: 8.9,
    production_count: 4800,
    fault_flag: 0,
    notes: 'Scheduled auto-lubrication',
  },
];

// Factory Summaries
export const FACTORY_SUMMARIES: Record<string, FactorySummary> = {
  'TexAlpha Mills': {
    company_name: 'TexAlpha Mills',
    total_readings: 14400,
    est_monthly_energy_kwh: 2847,
    avg_power_factor: 0.878,
    fault_rate_pct: 34.7,
    peak_demand_kw: 13.1,
    co2_footprint_tonnes: 4.2,
    annual_energy_bill_k: 2898,
    machines_monitored: 5,
    period_start: '2026-09-01',
    period_end: '2026-09-30',
    machines: [
      {
        machine_id: 'TA-LOOM-01',
        machine_type: 'Power Loom',
        avg_kw: 2.87,
        max_kw: 4.63,
        avg_temp_c: 36.0,
        max_temp_c: 40.2,
        avg_vibration_mm_s: 1.13,
        avg_noise_db: 43.6,
        power_factor: 0.879,
        fault_rate_pct: 0.0,
        status: 'OK',
        kw_fill_color: 'green',
        fault_fill_color: 'green',
      },
      {
        machine_id: 'TA-LOOM-02',
        machine_type: 'Power Loom',
        avg_kw: 3.56,
        max_kw: 4.63,
        avg_temp_c: 42.0,
        max_temp_c: 46.5,
        avg_vibration_mm_s: 1.54,
        avg_noise_db: 44.1,
        power_factor: 0.851,
        fault_rate_pct: 100.0,
        status: 'ALERT',
        kw_fill_color: 'amber',
        fault_fill_color: 'red',
      },
      {
        machine_id: 'TA-SPIN-01',
        machine_type: 'Ring Spinning',
        avg_kw: 8.7,
        max_kw: 13.75,
        avg_temp_c: 39.6,
        max_temp_c: 43.8,
        avg_vibration_mm_s: 1.13,
        avg_noise_db: 43.9,
        power_factor: 0.879,
        fault_rate_pct: 0.0,
        status: 'OK',
        kw_fill_color: 'red',
        fault_fill_color: 'green',
      },
      {
        machine_id: 'TA-WARP-01',
        machine_type: 'Warping Machine',
        avg_kw: 1.74,
        max_kw: 2.75,
        avg_temp_c: 33.5,
        max_temp_c: 37.2,
        avg_vibration_mm_s: 1.14,
        avg_noise_db: 43.6,
        power_factor: 0.879,
        fault_rate_pct: 0.0,
        status: 'OK',
        kw_fill_color: 'green',
        fault_fill_color: 'green',
      },
      {
        machine_id: 'TA-COMP-01',
        machine_type: 'Air Compressor',
        avg_kw: 5.93,
        max_kw: 9.38,
        avg_temp_c: 46.6,
        max_temp_c: 51.6,
        avg_vibration_mm_s: 1.14,
        avg_noise_db: 50.9,
        power_factor: 0.878,
        fault_rate_pct: 0.0,
        status: 'WARNING',
        kw_fill_color: 'green',
        fault_fill_color: 'green',
      },
    ],
  },
  'BetaWeave Industries': {
    company_name: 'BetaWeave Industries',
    total_readings: 14400,
    est_monthly_energy_kwh: 2383,
    avg_power_factor: 0.868,
    fault_rate_pct: 50.0,
    peak_demand_kw: 11.8,
    co2_footprint_tonnes: 3.5,
    annual_energy_bill_k: 2430,
    machines_monitored: 5,
    period_start: '2026-09-01',
    period_end: '2026-09-30',
    machines: [
      {
        machine_id: 'BW-LOOM-01',
        machine_type: 'Shuttle Loom',
        avg_kw: 2.51,
        max_kw: 3.95,
        avg_temp_c: 36.4,
        max_temp_c: 41.0,
        avg_vibration_mm_s: 1.52,
        avg_noise_db: 69.2,
        power_factor: 0.871,
        fault_rate_pct: 0.0,
        status: 'OK',
        kw_fill_color: 'green',
        fault_fill_color: 'green',
      },
      {
        machine_id: 'BW-DYE-01',
        machine_type: 'Jigger Dyeing Machine',
        avg_kw: 5.86,
        max_kw: 8.2,
        avg_temp_c: 50.6,
        max_temp_c: 54.8,
        avg_vibration_mm_s: 3.75,
        avg_noise_db: 75.8,
        power_factor: 0.853,
        fault_rate_pct: 100.0,
        status: 'ALERT',
        kw_fill_color: 'amber',
        fault_fill_color: 'red',
      },
      {
        machine_id: 'BW-HEAT-01',
        machine_type: 'Thermic Fluid Boiler',
        avg_kw: 8.12,
        max_kw: 11.8,
        avg_temp_c: 55.7,
        max_temp_c: 61.2,
        avg_vibration_mm_s: 5.08,
        avg_noise_db: 80.6,
        power_factor: 0.859,
        fault_rate_pct: 100.0,
        status: 'ALERT',
        kw_fill_color: 'red',
        fault_fill_color: 'red',
      },
      {
        machine_id: 'BW-SPIN-01',
        machine_type: 'Rotor Spinning',
        avg_kw: 6.45,
        max_kw: 9.6,
        avg_temp_c: 38.8,
        max_temp_c: 42.5,
        avg_vibration_mm_s: 1.63,
        avg_noise_db: 71.9,
        power_factor: 0.871,
        fault_rate_pct: 0.0,
        status: 'OK',
        kw_fill_color: 'amber',
        fault_fill_color: 'green',
      },
      {
        machine_id: 'BW-COMP-01',
        machine_type: 'Screw Compressor',
        avg_kw: 5.08,
        max_kw: 7.4,
        avg_temp_c: 44.3,
        max_temp_c: 48.0,
        avg_vibration_mm_s: 1.82,
        avg_noise_db: 76.6,
        power_factor: 0.869,
        fault_rate_pct: 0.0,
        status: 'WARNING',
        kw_fill_color: 'green',
        fault_fill_color: 'green',
      },
    ],
  },
};

// Dataset Info
export const DATASET_INFOS: Record<string, DatasetInfo> = {
  'TexAlpha Mills': {
    company_name: 'TexAlpha Mills',
    zenodo_url: 'https://zenodo.org/records/15277168',
    zenodo_id: '15277168',
    row_count: 14400,
    machine_count: 5,
    period: '2026-09-01 → 2026-09-30',
    interval: '15 minutes / 2,880 per machine',
    column_count: 14,
    total_faults: 5011,
    fault_rate_pct: 34.7,
    machines: [
      { id: 'TA-LOOM-01', type: 'Power Loom', color: 'green', dot_color: '#1d7a5f' },
      { id: 'TA-LOOM-02', type: 'Power Loom', color: 'blue', dot_color: '#1a6ea8' },
      { id: 'TA-SPIN-01', type: 'Ring Spinning', color: 'orange', dot_color: '#e67e22' },
      { id: 'TA-WARP-01', type: 'Warping Machine', color: 'red', dot_color: '#c0392b' },
      { id: 'TA-COMP-01', type: 'Air Compressor', color: 'purple', dot_color: '#8e44ad' },
    ],
    anomalies_note:
      '⚠️ Injected anomalies — some machines have deliberate compliance violations baked into the data to simulate real-world audit scenarios: TA-LOOM-02 (+6°C overheating) · TA-COMP-01 (+12 dB excess noise)',
    readings: TEXALPHA_SAMPLE_ROWS,
  },
  'BetaWeave Industries': {
    company_name: 'BetaWeave Industries',
    zenodo_url: 'https://zenodo.org/records/15277168',
    zenodo_id: '15277168',
    row_count: 14400,
    machine_count: 5,
    period: '2026-09-01 → 2026-09-30',
    interval: '15 minutes / 2,880 per machine',
    column_count: 14,
    total_faults: 7200,
    fault_rate_pct: 50.0,
    machines: [
      { id: 'BW-LOOM-01', type: 'Shuttle Loom', color: 'green', dot_color: '#1d7a5f' },
      { id: 'BW-DYE-01', type: 'Jigger Dyeing Machine', color: 'red', dot_color: '#c0392b' },
      { id: 'BW-HEAT-01', type: 'Thermic Fluid Boiler', color: 'orange', dot_color: '#e67e22' },
      { id: 'BW-SPIN-01', type: 'Rotor Spinning', color: 'blue', dot_color: '#1a6ea8' },
      { id: 'BW-COMP-01', type: 'Screw Compressor', color: 'purple', dot_color: '#8e44ad' },
    ],
    anomalies_note:
      '⚠️ Injected anomalies — severe compliance violations baked in: BW-DYE-01 (+8°C process steam overheating, 100% fault rate) · BW-HEAT-01 (+11°C boiler casing overheat, >5.0 mm/s vibration breach, 100% fault rate)',
    readings: BETAWEAVE_SAMPLE_ROWS,
  },
};

// Audit Reports
export const AUDIT_REPORTS: Record<string, AuditReportData> = {
  'TexAlpha Mills': {
    company_name: 'TexAlpha Mills',
    score: 55,
    status: 'PARTIALLY COMPLIANT',
    critical_findings_count: 1,
    non_compliant_machines_count: 2,
    period: '2026-09-01 to 2026-09-30',
    readings_count: 14400,
    machines_count: 5,
    annual_energy_mwh: 34.2,
    power_factor: 0.874,
    power_factor_compliant: false,
    power_factor_note: '✗ Below 0.85 statutory target',
    co2_per_year_tonnes: 28.0,
    total_faults: 5011,
    potential_savings_k: 432,
    machine_compliance: [
      {
        machine_id: 'TA-LOOM-01',
        machine_type: 'Power Loom',
        score: 100,
        status: 'COMPLIANT',
        findings: [],
      },
      {
        machine_id: 'TA-LOOM-02',
        machine_type: 'Power Loom',
        score: 25,
        status: 'NON-COMPLIANT',
        findings: [
          {
            parameter: 'Temperature',
            severity: 'CRITICAL',
            status: 'NON-COMPLIANT',
            framework: 'Factories Act 1948 / IS 3103',
            actual_value: '42.0°C avg / 46.5°C max',
            regulatory_limit: '45.0°C workplace threshold',
            recommendation:
              '💡 Install industrial cooling / ventilation immediately. Schedule HVAC maintenance and consider heat shields for hot equipment.',
          },
          {
            parameter: 'Power Factor',
            severity: 'MEDIUM',
            status: 'NON-COMPLIANT',
            framework: 'BEE Guidelines / Electricity Act 2003',
            actual_value: '0.851',
            regulatory_limit: '≥ 0.85 statutory limit',
            recommendation:
              '💡 Install capacitor banks for reactive power compensation. Target PF correction to ≥ 0.85. This will reduce kVA demand charges and potential utility penalties.',
          },
          {
            parameter: 'Fault Rate',
            severity: 'HIGH',
            status: 'NON-COMPLIANT',
            framework: 'ISO 50001:2018 / MSME Guidelines',
            actual_value: '100.0% (2880 faults in 2880 readings)',
            regulatory_limit: '< 5% allowable limit',
            recommendation:
              '💡 Implement predictive maintenance program. Review operating parameters and calibrate sensors. Train operators on fault detection and early intervention.',
          },
        ],
      },
      {
        machine_id: 'TA-SPIN-01',
        machine_type: 'Ring Spinning',
        score: 100,
        status: 'COMPLIANT',
        findings: [],
      },
      {
        machine_id: 'TA-WARP-01',
        machine_type: 'Warping Machine',
        score: 100,
        status: 'COMPLIANT',
        findings: [],
      },
      {
        machine_id: 'TA-COMP-01',
        machine_type: 'Air Compressor',
        score: 80,
        status: 'COMPLIANT',
        findings: [
          {
            parameter: 'Noise Level',
            severity: 'HIGH',
            status: 'NON-COMPLIANT',
            framework: 'CPCB Noise Rules 2000 / Factories Act 1948',
            actual_value: '50.9 dB(A) avg / 83.9 dB(A) max',
            regulatory_limit: '75.0 dB(A) (daytime industrial limit)',
            recommendation:
              '💡 Provide PPE (ear protection) to workers immediately. Install acoustic enclosures or vibration-damping mounts. Schedule noise audit with CPCB-approved consultant.',
          },
        ],
      },
    ],
    suggestions: [
      {
        id: 1,
        priority: 'HIGH',
        category: 'Energy Efficiency',
        est_saving_pct: 15,
        finding:
          'Specific Energy Consumption (11.21 kWh/kg) exceeds BEE benchmark (3.2 kWh/kg) by 250.3%. High baseload power observed in spinning and compressor drives.',
        action:
          '1. Conduct comprehensive energy audit to identify top energy consumers.\n2. Upgrade to IE3-class motors for continuous-duty machines.\n3. Install VFDs (Variable Frequency Drives) on motors operating below 80% load.\n4. Implement load scheduling to avoid peak tariff hours (6 AM–10 PM).',
        framework: 'BEE / Energy Conservation Act 2001',
      },
      {
        id: 2,
        priority: 'HIGH',
        category: 'Power Quality',
        est_saving_pct: 8,
        finding:
          'Average power factor 0.874 is below BEE minimum 0.85 target threshold on feeder lines. Factory is likely incurring utility PF penalty surcharges on kVA billing.',
        action:
          '1. Install automatic capacitor bank (APFC) of approximately 1.2 kVAR.\n2. Segment capacitor banks per feeder for localized reactive compensation.\n3. Validate PF improvement with utility check meter before next billing cycle.',
        framework: 'Electricity Act 2003 / BEE',
      },
      {
        id: 3,
        priority: 'HIGH',
        category: 'Predictive Maintenance',
        est_saving_pct: 12,
        finding:
          'Machine TA-LOOM-02 has fault rate > 5% (100% persistent trip flags), indicating systemic mechanical reliability issues and friction heat generation.',
        action:
          '1. Implement IIoT-based Condition Monitoring System (CMS).\n2. Use vibration + temperature trending for bearing health prediction.\n3. Establish Preventive Maintenance intervals based on MTBF data.\n4. Apply for MSME Technology Upgrade Fund (TUF) subsidy for CMS installation.',
        framework: 'ISO 50001:2018 / MSME Guidelines',
      },
      {
        id: 4,
        priority: 'HIGH',
        category: 'Occupational Health & Safety',
        est_saving_pct: 0,
        finding:
          'Machine TA-COMP-01 exceeds CPCB noise limit of 75 dB(A) during pressure buildup cycles. Workers in adjacent aisles face occupational noise-induced hearing loss risk.',
        action:
          '1. Issue PPE (ear muffs / earplugs, SNR ≥ 25 dB) to all workers in affected compressor zones immediately.\n2. Install acoustic enclosures and anti-vibration damping pads.\n3. Reduce operating speeds or route intake outside factory floor.\n4. Obtain annual noise monitoring verification report from CPCB-certified lab.',
        framework: 'CPCB Noise Rules 2000 / Factories Act 1948',
      },
      {
        id: 5,
        priority: 'MEDIUM',
        category: 'Energy Management System',
        est_saving_pct: 10,
        finding:
          'No formal ISO 50001 Energy Management System (EnMS) detected. Factory lacks systematic real-time sub-metering and shift-wise accountability.',
        action:
          '1. Adopt ISO 50001:2018 EnMS framework and appoint designated Energy Manager.\n2. Set baseline specific energy consumption per loom and spinning line.\n3. Deploy digital sub-metering on top-5 energy consumers.\n4. Target 5% annual energy intensity reduction via BEE SME Energy Efficiency portal.',
        framework: 'ISO 50001:2018 / BEE / Energy Conservation Act 2001',
      },
    ],
    frameworks: REGULATORY_FRAMEWORKS,
  },
  'BetaWeave Industries': {
    company_name: 'BetaWeave Industries',
    score: 20,
    status: 'NON-COMPLIANT',
    critical_findings_count: 3,
    non_compliant_machines_count: 2,
    period: '2026-09-01 to 2026-09-30',
    readings_count: 14400,
    machines_count: 5,
    annual_energy_mwh: 28.6,
    power_factor: 0.868,
    power_factor_compliant: false,
    power_factor_note: '✗ Below 0.85 target threshold',
    co2_per_year_tonnes: 23.5,
    total_faults: 7200,
    potential_savings_k: 580,
    machine_compliance: [
      {
        machine_id: 'BW-LOOM-01',
        machine_type: 'Shuttle Loom',
        score: 100,
        status: 'COMPLIANT',
        findings: [],
      },
      {
        machine_id: 'BW-DYE-01',
        machine_type: 'Jigger Dyeing Machine',
        score: 15,
        status: 'NON-COMPLIANT',
        findings: [
          {
            parameter: 'Temperature',
            severity: 'CRITICAL',
            status: 'NON-COMPLIANT',
            framework: 'Factories Act 1948 / IS 3103',
            actual_value: '50.6°C avg / 54.8°C max',
            regulatory_limit: '45.0°C workplace threshold',
            recommendation:
              '💡 Install thermal heat recovery jacket and exhaust ducting over dyeing baths. Eliminate hot liquor spillages.',
          },
          {
            parameter: 'Noise Level',
            severity: 'HIGH',
            status: 'NON-COMPLIANT',
            framework: 'CPCB Noise Rules 2000',
            actual_value: '75.8 dB(A) avg',
            regulatory_limit: '75.0 dB(A) industrial zone limit',
            recommendation:
              '💡 Rebalance circulation pumps and mandate hearing protection for operators on shift B and C.',
          },
          {
            parameter: 'Fault Rate',
            severity: 'CRITICAL',
            status: 'NON-COMPLIANT',
            framework: 'ISO 50001:2018',
            actual_value: '100.0% fault flag frequency',
            regulatory_limit: '< 5% allowable limit',
            recommendation:
              '💡 Full mechanical overhaul required. Inspect drive shafts, pump seals, and liquor heating valves.',
          },
        ],
      },
      {
        machine_id: 'BW-HEAT-01',
        machine_type: 'Thermic Fluid Boiler',
        score: 10,
        status: 'NON-COMPLIANT',
        findings: [
          {
            parameter: 'Temperature',
            severity: 'CRITICAL',
            status: 'NON-COMPLIANT',
            framework: 'Factories Act 1948 / IS 3103',
            actual_value: '55.7°C avg / 61.2°C max',
            regulatory_limit: '45.0°C workplace threshold',
            recommendation:
              '💡 Severe hazard: Replace degraded insulation refractory blanket. Add automatic shutdown safety interlock.',
          },
          {
            parameter: 'Vibration',
            severity: 'CRITICAL',
            status: 'NON-COMPLIANT',
            framework: 'ISO 10816 / IS 2974',
            actual_value: '5.08 mm/s avg / 5.30 mm/s peak',
            regulatory_limit: '< 4.5 mm/s (Zone B/C limit)',
            recommendation:
              '💡 Stop operation and laser-align circulating pump and blower motor shafts. Replace worn bearings.',
          },
          {
            parameter: 'Noise Level',
            severity: 'CRITICAL',
            status: 'NON-COMPLIANT',
            framework: 'CPCB Noise Rules 2000',
            actual_value: '80.6 dB(A) avg / 82.0 dB(A) peak',
            regulatory_limit: '75.0 dB(A) threshold',
            recommendation:
              '💡 Fit industrial silencers on burner intake and exhaust stack. Issue class-A ear defenders.',
          },
        ],
      },
      {
        machine_id: 'BW-SPIN-01',
        machine_type: 'Rotor Spinning',
        score: 100,
        status: 'COMPLIANT',
        findings: [],
      },
      {
        machine_id: 'BW-COMP-01',
        machine_type: 'Screw Compressor',
        score: 75,
        status: 'WARNING',
        findings: [
          {
            parameter: 'Noise Level',
            severity: 'HIGH',
            status: 'NON-COMPLIANT',
            framework: 'CPCB Noise Rules 2000',
            actual_value: '76.6 dB(A) avg',
            regulatory_limit: '75.0 dB(A) limit',
            recommendation:
              '💡 Enclose compressor housing in modular sound-attenuating panels with forced ventilation.',
          },
        ],
      },
    ],
    suggestions: [
      {
        id: 1,
        priority: 'HIGH',
        category: 'Thermal Management & Safety',
        est_saving_pct: 18,
        finding:
          'Machines BW-DYE-01 and BW-HEAT-01 consistently operate above 50°C casing temperature, generating massive radiant heat loss and acute worker heat-stress hazards.',
        action:
          '1. Re-insulate thermic fluid piping and boiler casing with high-density ceramic fiber blankets.\n2. Install waste heat recovery unit (economizer) on flue gas duct to preheat boiler feed water.\n3. Establish continuous thermal imaging inspections monthly.',
        framework: 'Factories Act 1948 / BEE Guidelines',
      },
      {
        id: 2,
        priority: 'HIGH',
        category: 'Predictive Maintenance',
        est_saving_pct: 14,
        finding:
          'Machines BW-DYE-01 and BW-HEAT-01 have continuous 100% fault rates and severe vibration breaches exceeding ISO 10816 limits.',
        action:
          '1. Shut down BW-HEAT-01 for precision dynamic balancing of blower impellers.\n2. Overhaul circulating pump mechanical seals and replace degraded bearings.\n3. Install real-time tri-axial vibration transmitters with automatic trip relays.',
        framework: 'ISO 10816 / ISO 50001:2018',
      },
      {
        id: 3,
        priority: 'HIGH',
        category: 'Occupational Noise Mitigation',
        est_saving_pct: 0,
        finding:
          'Ambient noise across dyeing and boiler halls peaks at 82.0 dB(A), violating CPCB industrial noise threshold of 75 dB(A).',
        action:
          '1. Deploy acoustic baffling enclosures around boiler burner assemblies.\n2. Isolate screw compressor into external walled room with acoustic louver vents.\n3. Provide mandatory hearing protective equipment with annual audiometry checkups.',
        framework: 'CPCB Noise Rules 2000 / Factories Act 1948',
      },
      {
        id: 4,
        priority: 'HIGH',
        category: 'Power Quality & Power Factor',
        est_saving_pct: 9,
        finding:
          'Average power factor of 0.868 results in reactive power draw penalty. High inductive loads from old pump motors degrade bus voltage stability.',
        action:
          '1. Install automatic power factor correction panel (15 kVAR stepped capacitor bank).\n2. Replace burned-out power capacitors on main 415V switchboard.\n3. Target continuous power factor > 0.95 to claim discom rebate incentives.',
        framework: 'Electricity Act 2003 / BEE',
      },
      {
        id: 5,
        priority: 'MEDIUM',
        category: 'Process Optimization',
        est_saving_pct: 11,
        finding:
          'Jigger dyeing machine lacks liquor ratio automation, resulting in excessive steam and water consumption during dye cycles.',
        action:
          '1. Retrofit microprocessor controller with automated steam modulating valve.\n2. Optimize liquor-to-goods ratio from 1:8 down to 1:5.\n3. Connect dye vat condensate return to boiler feed tank.',
        framework: 'MSME Sustainable Manufacturing Guidelines 2022',
      },
    ],
    frameworks: REGULATORY_FRAMEWORKS,
  },
};

// Company Comparison Data
export const COMPANY_COMPARISON: CompanyComparison = {
  banner_note:
    '📂 Comparison based on synthetic CSV sensor data for both factories. Each company’s CSV was processed independently through the same regulatory audit engine.',
  winner_badges: [
    {
      title: 'Best Compliance',
      winner: 'TexAlpha Mills',
      color: 'green',
    },
    {
      title: 'Best Energy Efficiency',
      winner: 'BetaWeave Industries',
      color: 'blue',
    },
  ],
  kpis: [
    {
      label: 'Compliance Score',
      tex_val: '55 /100',
      beta_val: '20 /100',
      winner: 'TexAlpha Mills',
    },
    {
      label: 'Annual Energy',
      tex_val: '34.2 MWh',
      beta_val: '28.6 MWh',
      winner: 'BetaWeave Industries',
    },
    {
      label: 'CO₂ Footprint',
      tex_val: '28.0 t/yr',
      beta_val: '23.5 t/yr',
      winner: 'BetaWeave Industries',
    },
    {
      label: 'Fault Rate',
      tex_val: '8.0%',
      beta_val: '50.0%',
      winner: 'TexAlpha Mills',
    },
    {
      label: 'Power Factor',
      tex_val: '0.874',
      beta_val: '0.868',
      winner: 'TexAlpha Mills',
    },
  ],
  tex_alpha: {
    name: 'TexAlpha Mills',
    score: 55,
    score_color: 'amber',
    status: 'PARTIALLY COMPLIANT',
    critical_findings_count: 1,
    annual_energy_mwh: 34.2,
    annual_bill_k: 292,
    co2_per_year_tonnes: 28.0,
    fault_rate_pct: 8.0,
    power_factor: 0.874,
    potential_savings_k: 432,
    non_compliant_machines: ['TA-LOOM-02', 'TA-COMP-01'],
    top_high_actions: [
      {
        category: 'Energy Efficiency',
        description:
          'Specific Energy Consumption (11.21 kWh/kg) exceeds BEE benchmark (3.2 kWh/kg) by 250.3%. Upgrade motors to IE3 standard.',
      },
      {
        category: 'Power Quality',
        description:
          'Average power factor 0.874 is below BEE minimum 0.85 target. Install 1.2 kVAR APFC automatic capacitor bank.',
      },
    ],
  },
  beta_weave: {
    name: 'BetaWeave Industries',
    score: 20,
    score_color: 'red',
    status: 'NON-COMPLIANT',
    critical_findings_count: 3,
    annual_energy_mwh: 28.6,
    annual_bill_k: 243,
    co2_per_year_tonnes: 23.5,
    fault_rate_pct: 50.0,
    power_factor: 0.868,
    potential_savings_k: 580,
    non_compliant_machines: ['BW-DYE-01', 'BW-HEAT-01'],
    top_high_actions: [
      {
        category: 'Thermal Management & Safety',
        description:
          'Machines BW-DYE-01 and BW-HEAT-01 consistently operate above 50°C casing temperature. Immediate thermal insulation and flue heat recovery required.',
      },
      {
        category: 'Predictive Maintenance',
        description:
          'Machines BW-DYE-01, BW-HEAT-01 have continuous 100% fault rates with excessive vibration > 5.0 mm/s. Laser alignment and bearing replacement required.',
      },
    ],
  },
};
