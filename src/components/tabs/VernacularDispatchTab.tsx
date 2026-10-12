import React, { useState } from 'react';
import {
  VERNACULAR_DISPATCHES,
  VernacularDispatch,
} from '../../data/advancedFeatures';
import { SampleDataBanner, StatusPill } from '../common/Shared';

interface VernacularDispatchTabProps {
  selectedFactory: string;
}

type SupportedLang = 'marathi' | 'hindi' | 'gujarati' | 'tamil' | 'english';

export function VernacularDispatchTab({
  selectedFactory,
}: VernacularDispatchTabProps) {
  const [currentLang, setCurrentLang] = useState<SupportedLang>('marathi');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('9822045612');
  const [dispatchStatus, setDispatchStatus] = useState<Record<string, string>>({
    'DISP-TA-01': 'Acknowledged by Shift C Supervisor at 22:15',
    'DISP-BW-01': 'Acknowledged by Boiler Team at 19:40',
  });

  const dispatches =
    VERNACULAR_DISPATCHES[selectedFactory] ||
    VERNACULAR_DISPATCHES['TexAlpha Mills'];

  const langNames: Record<SupportedLang, { label: string; script: string }> = {
    marathi: { label: 'मराठी', script: 'Marathi (Kolhapur/Ichalkaranji/Bhiwandi)' },
    hindi: { label: 'हिंदी', script: 'Hindi (Central/North Textile Belts)' },
    gujarati: { label: 'ગુજરાતી', script: 'Gujarati (Surat/Ahmedabad Clusters)' },
    tamil: { label: 'தமிழ்', script: 'Tamil (Tirupur/Coimbatore Knitwear)' },
    english: { label: 'English', script: 'English (Management Briefing)' },
  };

  const playVoiceNote = (dispatch: VernacularDispatch) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (playingId === dispatch.id) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    setPlayingId(dispatch.id);

    const voiceText = dispatch.translations[currentLang].voice_text;
    const utterance = new SpeechSynthesisUtterance(voiceText);

    // Map language code
    const langCodes: Record<SupportedLang, string> = {
      marathi: 'mr-IN',
      hindi: 'hi-IN',
      gujarati: 'gu-IN',
      tamil: 'ta-IN',
      english: 'en-IN',
    };
    utterance.lang = langCodes[currentLang] || 'hi-IN';
    utterance.rate = 0.95;

    utterance.onend = () => {
      setPlayingId(null);
    };

    utterance.onerror = () => {
      setPlayingId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const sendWhatsApp = (dispatch: VernacularDispatch) => {
    const text = dispatch.translations[currentLang].text;
    const encoded = encodeURIComponent(text);
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const waUrl = `https://wa.me/91${cleanPhone}?text=${encoded}`;

    // Mark as sent in state
    setDispatchStatus((prev) => ({
      ...prev,
      [dispatch.id]: `Dispatched to +91 ${cleanPhone} (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
    }));

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <SampleDataBanner
        text={`Floor-Level Vernacular Dispatch — Designed for shopfloor shift supervisors. Converts complex industrial energy anomalies into actionable 10-second WhatsApp voice notes in local languages (Marathi, Hindi, Gujarati, Tamil) to drive immediate shopfloor behavior.`}
      />

      {/* Rationale Callout Card */}
      <div className="bg-[#eef7f3] border border-[#c8e6c9] rounded-[10px] p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[18px]">🎙️</span>
            <h3 className="text-[14px] font-bold text-[#1d7a5f]">
              Closing the Last-Mile Gap: Why Dashboards Don't Save Power Alone
            </h3>
          </div>
          <p className="text-[12px] text-[#2c4e3f] leading-relaxed">
            The SME owner may glance at a web chart, but the shift supervisor on the factory floor is responsible for turning off the compressor valve or scheduling dye vats. A voice note saying <strong className="text-[#1d7a5f]">"आज रात्री १० नंतर डायिंग पंप सुरू करा, ₹८०० ची बचत होईल"</strong> changes actual machine schedules.
          </p>
        </div>

        {/* Floor Phone config */}
        <div className="bg-white rounded-[8px] p-3 border border-[#dde5ea] shrink-0 w-full md:w-auto">
          <label className="block text-[10px] font-bold uppercase text-[#607d8b] mb-1">
            Floor Supervisor WhatsApp No.
          </label>
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-bold text-[#1e3344] bg-[#f0f4f8] px-2 py-1 rounded">
              +91
            </span>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-[130px] border border-[#dde5ea] text-[12px] font-mono font-bold rounded p-1 px-2 text-[#1e3344] focus:outline-hidden focus:border-[#1d7a5f]"
              placeholder="9822045612"
            />
          </div>
        </div>
      </div>

      {/* Language Selector Bar */}
      <div className="bg-white rounded-[10px] p-4 border border-[#dde5ea] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-[12px] font-bold text-[#1e3344] flex items-center gap-2">
          <span>🌐</span>
          <span>Select Operational Vernacular Dialect:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(Object.keys(langNames) as SupportedLang[]).map((lang) => {
            const isSelected = currentLang === lang;
            return (
              <button
                key={lang}
                onClick={() => {
                  if (playingId) {
                    window.speechSynthesis.cancel();
                    setPlayingId(null);
                  }
                  setCurrentLang(lang);
                }}
                className={`px-3 py-1.5 rounded-[6px] text-[12px] font-bold transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#1d7a5f] text-white shadow-xs'
                    : 'bg-[#f0f4f8] text-[#607d8b] hover:bg-[#e4ecf2] hover:text-[#1e3344]'
                }`}
              >
                {langNames[lang].label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dispatches List */}
      <div className="space-y-4">
        {dispatches.map((disp) => {
          const trans = disp.translations[currentLang];
          const isPlaying = playingId === disp.id;
          const statusNote = dispatchStatus[disp.id];

          return (
            <div
              key={disp.id}
              className="bg-white rounded-[10px] border border-[#dde5ea] shadow-[0_2px_8px_rgba(15,45,69,0.06)] overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-[#f8fafb] px-5 py-3.5 border-b border-[#dde5ea] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[12px] font-bold text-[#1a6ea8] bg-[#e3f2fd] px-2 py-0.5 rounded">
                    {disp.machine_id}
                  </span>
                  <StatusPill status={disp.priority} />
                  <span className="text-[12px] text-[#607d8b] font-medium hidden sm:inline">
                    {disp.trigger_reason}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-[#1d7a5f] bg-[#e8f5f1] px-2.5 py-1 rounded-full">
                    Est. Saving: ₹{disp.estimated_saving_inr}/shift
                  </span>
                  <span className="text-[11px] text-[#607d8b] font-mono">
                    {disp.scheduled_time}
                  </span>
                </div>
              </div>

              {/* Card Content Grid */}
              <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left: Message Preview (WhatsApp Bubble Format) */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="text-[10.5px] uppercase font-bold text-[#607d8b] mb-1.5 flex items-center justify-between">
                      <span>Target Recipient: {trans.supervisor_title}</span>
                      <span className="text-[#1a6ea8] font-normal">
                        Language: {langNames[currentLang].script}
                      </span>
                    </div>

                    {/* WhatsApp-Style Bubble */}
                    <div className="bg-[#e7f7ed] border border-[#c1e7ce] rounded-[10px] rounded-tl-none p-3.5 text-[#144229] shadow-2xs relative">
                      <div className="text-[13px] font-medium leading-relaxed whitespace-pre-wrap">
                        {trans.text}
                      </div>
                      <div className="flex items-center justify-end gap-1.5 mt-2 text-[10px] text-[#3e7e59] font-medium">
                        <span>Today {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>✓✓</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Status */}
                  {statusNote && (
                    <div className="mt-3 text-[11px] text-[#1d7a5f] font-semibold flex items-center gap-1.5 bg-[#e8f5f1] p-2 rounded-[6px]">
                      <span>●</span>
                      <span>{statusNote}</span>
                    </div>
                  )}
                </div>

                {/* Right: Audio Action Console */}
                <div className="lg:col-span-5 bg-[#fbfcfd] border border-[#edf2f5] rounded-[8px] p-4 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-[#1e3344] uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Voice Note Dispatcher</span>
                      <span className="text-[#607d8b] text-[10px] font-normal">
                        Web Speech API
                      </span>
                    </div>

                    <p className="text-[11px] text-[#607d8b] leading-snug mb-3">
                      Spoken transcript: "{trans.voice_text}"
                    </p>

                    {/* Audio Wave Simulation */}
                    <div className="h-9 bg-[#edf2f7] rounded-[6px] px-3 flex items-center justify-center gap-1 mb-3">
                      {[40, 70, 30, 90, 60, 100, 45, 80, 50, 75, 35, 65, 85, 40].map(
                        (h, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full transition-all duration-300 ${
                              isPlaying ? 'bg-[#1d7a5f] animate-pulse' : 'bg-[#a0aec0]'
                            }`}
                            style={{ height: isPlaying ? `${h}%` : '25%' }}
                          />
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                    {/* Listen Button */}
                    <button
                      onClick={() => playVoiceNote(disp)}
                      className={`flex-1 w-full py-2 px-3 rounded-[6px] text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        isPlaying
                          ? 'bg-[#c0392b] text-white hover:bg-[#a93226]'
                          : 'bg-[#1d7a5f] text-white hover:bg-[#16604b]'
                      }`}
                    >
                      <span>{isPlaying ? '⏹' : '▶'}</span>
                      <span>{isPlaying ? 'Stop Voice Note' : 'Play Voice Note'}</span>
                    </button>

                    {/* Send WhatsApp Button */}
                    <button
                      onClick={() => sendWhatsApp(disp)}
                      className="flex-1 w-full py-2 px-3 rounded-[6px] text-[12px] font-bold bg-[#25d366] text-white hover:bg-[#1ebe5d] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <span>💬</span>
                      <span>Send WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
