import React, { useState } from 'react';

export interface UserSession {
  username: string;
  role: 'admin' | 'user';
  displayName: string;
  loginTime: string;
}

interface LoginViewProps {
  onLogin: (session: UserSession) => void;
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleNormalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both a username and password to proceed.');
      return;
    }

    setError(null);
    onLogin({
      username: username.trim(),
      role: 'user',
      displayName: username.trim(),
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const handleAdminLogin = () => {
    setError(null);
    onLogin({
      username: 'admin',
      role: 'admin',
      displayName: 'System Administrator (Lead Auditor)',
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const handleFillDemoCreds = () => {
    setUsername('auditor_rahul');
    setPassword('audit2026');
    setError(null);
  };

  return (
    <div className="min-h-screen w-screen bg-[#f0f4f8] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[460px] bg-white rounded-[10px] border border-[#dde5ea] shadow-[0_2px_12px_rgba(15,45,69,0.08)] overflow-hidden">
        {/* Header Block with Industrial Brand */}
        <div className="bg-[#0f2d45] text-white p-6 border-b border-[#1a3f58]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-[42px] h-[42px] rounded-[8px] bg-[#1d7a5f] flex items-center justify-center shrink-0 shadow-xs">
              <span className="text-[22px] leading-none">🏭</span>
            </div>
            <div>
              <h1 className="text-[16px] font-extrabold tracking-tight leading-tight">
                Textile Factory Audit
              </h1>
              <p className="text-[11px] text-[#7ea8be] mt-0.5">
                Sensor-Driven Regulatory Compliance Console
              </p>
            </div>
          </div>
          <div className="text-[11px] text-[#cddde6] opacity-90 mt-2 border-t border-[#1f4f72] pt-2">
            MSME Industrial Safety · BEE Energy Standards · CPCB Environmental Norms
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Admin Login (No Username or Password Required) */}
          <div className="bg-[#f0f7f4] border border-[#c8e6c9] rounded-[8px] p-4 text-center">
            <div className="text-[10px] uppercase font-bold text-[#1d7a5f] tracking-wider mb-1">
              One-Click Administrator Access
            </div>
            <div className="text-[12px] text-[#2c4e3f] mb-3 leading-snug">
              Instant bypass — no username or password required. Full audit and override privileges.
            </div>
            <button
              type="button"
              onClick={handleAdminLogin}
              className="w-full py-2.5 px-4 bg-[#1d7a5f] hover:bg-[#16604b] text-white text-[13px] font-bold rounded-[6px] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <span>⚡</span>
              <span>Login as Admin (Bypass Credentials)</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#dde5ea] w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-[#607d8b] uppercase tracking-wider shrink-0">
              Or Normal User Login
            </span>
          </div>

          {/* Standard Form Login */}
          <form onSubmit={handleNormalLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-[6px] bg-[#fdecea] border border-[#f4b8b1] text-[#c0392b] text-[12px] font-medium flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="login-username"
                className="block text-[11px] font-bold uppercase tracking-wider text-[#607d8b] mb-1.5"
              >
                Username
              </label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. auditor_officer"
                className="w-full bg-[#fcfdfe] border border-[#dde5ea] text-[#1e3344] text-[13px] rounded-[6px] p-[9px_12px] focus:outline-hidden focus:border-[#1d7a5f] focus:ring-1 focus:ring-[#1d7a5f]"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-[11px] font-bold uppercase tracking-wider text-[#607d8b] mb-1.5"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#fcfdfe] border border-[#dde5ea] text-[#1e3344] text-[13px] rounded-[6px] p-[9px_12px] focus:outline-hidden focus:border-[#1d7a5f] focus:ring-1 focus:ring-[#1d7a5f]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#0f2d45] hover:bg-[#1a3d5c] text-white text-[13px] font-bold rounded-[6px] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <span>🔑</span>
              <span>Sign In (Normal Login)</span>
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleFillDemoCreds}
                className="text-[11px] text-[#1a6ea8] hover:underline cursor-pointer font-medium"
              >
                Fill sample auditor credentials
              </button>
              <span className="text-[11px] text-[#607d8b]">
                Standard Inspector Role
              </span>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-[#f8fafb] px-6 py-3.5 border-t border-[#dde5ea] text-center text-[10.5px] text-[#607d8b]">
          Synthetic Sensor Repository · Indian Factories Act & CPCB Audit System
        </div>
      </div>
    </div>
  );
}
