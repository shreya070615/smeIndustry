import React, { useState, useEffect } from 'react';

export interface KpiCardProps {
  label: string;
  value: string | number;
  subText?: string;
  variant?: 'green' | 'amber' | 'red' | 'blue';
}

export function KpiCard({
  label,
  value,
  subText,
  variant = 'green',
}: KpiCardProps) {
  const borderColors = {
    green: '#1d7a5f',
    amber: '#e67e22',
    red: '#c0392b',
    blue: '#1a6ea8',
  };

  return (
    <div
      className="bg-white rounded-[10px] p-[18px] border border-[#dde5ea] transition-shadow hover:shadow-sm"
      style={{
        borderLeft: `3px solid ${borderColors[variant]}`,
        boxShadow: '0 2px 8px rgba(15,45,69,0.06)',
      }}
    >
      <div className="text-[10px] uppercase font-bold text-[#607d8b] tracking-wider mb-1">
        {label}
      </div>
      <div className="text-[26px] font-extrabold text-[#1e3344] tabular-nums tracking-tight leading-none my-1.5">
        {value}
      </div>
      {subText && (
        <div className="text-[11px] text-[#607d8b] font-normal leading-tight">
          {subText}
        </div>
      )}
    </div>
  );
}

export interface StatusPillProps {
  status:
    | 'OK'
    | 'WARNING'
    | 'ALERT'
    | 'COMPLIANT'
    | 'PARTIALLY COMPLIANT'
    | 'NON-COMPLIANT'
    | 'FAULT'
    | 'CRITICAL'
    | 'HIGH'
    | 'MEDIUM'
    | 'LOW'
    | 'A'
    | 'B'
    | 'C'
    | string;
  type?: 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'grey' | 'auto';
  className?: string;
}

export function StatusPill({ status, type = 'auto', className = '' }: StatusPillProps) {
  let resolvedType = type;
  if (type === 'auto') {
    const s = status.toUpperCase();
    if (s.includes('OK') || s === 'COMPLIANT' || s === 'LOW') {
      resolvedType = 'green';
    } else if (
      s.includes('WARN') ||
      s.includes('PARTIAL') ||
      s === 'MEDIUM'
    ) {
      resolvedType = 'amber';
    } else if (
      s.includes('ALERT') ||
      s.includes('NON-COMPLIANT') ||
      s.includes('FAULT') ||
      s === 'CRITICAL' ||
      s === 'HIGH'
    ) {
      resolvedType = 'red';
    } else if (s === 'A' || s === 'B' || s === 'C') {
      resolvedType = 'blue';
    } else {
      resolvedType = 'grey';
    }
  }

  const colorStyles: Record<string, { bg: string; text: string }> = {
    green: { bg: '#e8f5f1', text: '#1d7a5f' },
    amber: { bg: '#fff3e0', text: '#c96a00' },
    red: { bg: '#fdecea', text: '#c0392b' },
    blue: { bg: '#e3f2fd', text: '#1565c0' },
    purple: { bg: '#f3e8ff', text: '#6d28d9' },
    grey: { bg: '#f1f5f8', text: '#607d8b' },
  };

  const style = colorStyles[resolvedType] || colorStyles.grey;

  return (
    <span
      className={`inline-flex items-center px-2 py-[3px] rounded-full text-[10px] font-bold uppercase tracking-wide whitespace-nowrap ${className}`}
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {status}
    </span>
  );
}

export interface ScoreRingProps {
  score: number;
  size?: 72 | 56;
}

export function ScoreRing({ score, size = 72 }: ScoreRingProps) {
  let borderColor = '#1d7a5f';
  let textColor = '#1d7a5f';
  let bgColor = '#e8f5f1';

  if (score < 50) {
    borderColor = '#c0392b';
    textColor = '#c0392b';
    bgColor = '#fdecea';
  } else if (score < 80) {
    borderColor = '#e67e22';
    textColor = '#e67e22';
    bgColor = '#fff3e0';
  }

  const dimensionClass = size === 72 ? 'w-[72px] h-[72px]' : 'w-[56px] h-[56px]';
  const numberClass = size === 72 ? 'text-[20px] font-extrabold' : 'text-[16px] font-bold';
  const subClass = size === 72 ? 'text-[9px]' : 'text-[8px]';

  return (
    <div
      className={`rounded-full flex flex-col items-center justify-center shrink-0 tabular-nums ${dimensionClass}`}
      style={{
        border: '4px solid',
        borderColor: borderColor,
        color: textColor,
        backgroundColor: bgColor,
      }}
    >
      <span className={`${numberClass} leading-none`}>{score}</span>
      <span className={`${subClass} font-semibold opacity-80 leading-none mt-0.5`}>
        /100
      </span>
    </div>
  );
}

export interface CssHorizontalBarProps {
  label: string;
  value: number;
  max: number;
  displayValue: string;
  variant?: 'green' | 'amber' | 'red';
}

export function CssHorizontalBarRow({
  label,
  value,
  max,
  displayValue,
  variant = 'green',
}: CssHorizontalBarProps) {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  const colors = {
    green: '#1d7a5f',
    amber: '#e67e22',
    red: '#c0392b',
  };

  const pct = Math.min(100, Math.max(3, (value / max) * 100));

  useEffect(() => {
    // Animate from 0 to target width on mount
    const timer = setTimeout(() => {
      setAnimatedWidth(pct);
    }, 60);
    return () => clearTimeout(timer);
  }, [pct]);

  return (
    <div className="flex items-center gap-3 py-1.5">
      <div
        className="w-[130px] shrink-0 text-right text-[11px] font-medium text-[#1e3344] truncate"
        title={label}
      >
        {label}
      </div>
      <div className="flex-1 bg-[#edf1f3] h-[20px] rounded-[4px] overflow-hidden relative">
        <div
          className="h-full rounded-[4px] flex items-center justify-end px-2 transition-all duration-600 ease-out"
          style={{
            width: `${animatedWidth}%`,
            backgroundColor: colors[variant],
          }}
        >
          <span className="text-[10px] font-bold text-white tabular-nums tracking-wide whitespace-nowrap drop-shadow-sm">
            {displayValue}
          </span>
        </div>
      </div>
    </div>
  );
}

export function SampleDataBanner({ text }: { text: string }) {
  return (
    <div className="p-[10px_14px] bg-[#fffbf0] border border-[#fde68a] rounded-[8px] mb-4 text-[12px] text-[#78560a] flex items-start gap-2 shadow-xs">
      <span className="text-[14px] leading-tight select-none">📂</span>
      <div className="flex-1 leading-snug">{text}</div>
    </div>
  );
}

export function LoadingSpinner({ text = 'Loading sensor data from synthetic repository...' }: { text?: string }) {
  return (
    <div className="py-16 flex flex-col items-center justify-center">
      <div className="spinner mb-3" />
      <div className="text-[12px] text-[#607d8b] font-medium tracking-wide">
        {text}
      </div>
    </div>
  );
}

export function ErrorState({
  message = 'Failed to load telemetry dataset. Please retry.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="border border-dashed border-[#dde5ea] rounded-[8px] p-[40px_20px] text-center my-4">
      <div className="text-[22px] mb-2">⚠️</div>
      <div className="text-[13px] text-[#c0392b] font-medium mb-3">{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1.5 text-[11px] font-bold uppercase rounded bg-[#1d7a5f] text-white hover:bg-[#16604b] transition-colors"
        >
          Retry Connection
        </button>
      )}
    </div>
  );
}
