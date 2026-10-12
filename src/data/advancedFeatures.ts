export interface VernacularDispatch {
  id: string;
  machine_id: string;
  trigger_reason: string;
  scheduled_time: string;
  estimated_saving_inr: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  translations: {
    marathi: {
      text: string;
      voice_text: string;
      supervisor_title: string;
    };
    hindi: {
      text: string;
      voice_text: string;
      supervisor_title: string;
    };
    gujarati: {
      text: string;
      voice_text: string;
      supervisor_title: string;
    };
    tamil: {
      text: string;
      voice_text: string;
      supervisor_title: string;
    };
    english: {
      text: string;
      voice_text: string;
      supervisor_title: string;
    };
  };
}

export interface DprLoanData {
  scheme_name: string;
  nodal_agency: string;
  applicant_factory: string;
  cluster_location: string;
  project_title: string;
  application_ref: string;
  date_generated: string;
  current_annual_consumption_mwh: number;
  current_annual_bill_inr: number;
  sec_baseline_kwh_kg: number;
  sec_bee_benchmark_kwh_kg: number;
  sec_excess_pct: number;
  total_project_cost_inr: number;
  subsidies: {
    adeetie_grant_inr: number;
    adeetie_grant_pct: number;
    sidbi_soft_loan_inr: number;
    sidbi_interest_rate_pct: number;
    promoter_equity_inr: number;
  };
  interventions: Array<{
    item: string;
    category: string;
    cost_inr: number;
    annual_energy_saving_kwh: number;
    annual_cost_saving_inr: number;
  }>;
  financial_metrics: {
    simple_payback_months: number;
    project_irr_pct: number;
    dscr: number;
    annual_co2_abatement_tonnes: number;
  };
}

export interface ClusterBenchmark {
  cluster_name: string;
  state: string;
  total_smes_in_cluster: number;
  factory_rank: number;
  factory_percentile: number;
  metrics: Array<{
    label: string;
    unit: string;
    factory_value: number;
    cluster_top_10: number;
    cluster_median: number;
    cluster_worst_25: number;
    verdict: string;
    gap_pct: number;
    is_favorable: boolean;
  }>;
  peer_distribution: Array<{
    bucket: string;
    count: number;
    contains_factory: boolean;
  }>;
}

export interface TodSlot {
  time_range: string;
  slot_type: 'OFF_PEAK' | 'NORMAL' | 'PEAK';
  rate_per_kwh: number;
  grid_carbon_kg_kwh: number;
  label: string;
  is_current_slot?: boolean;
}

export interface MachineScheduleItem {
  machine_id: string;
  machine_type: string;
  nominal_kw: number;
  current_shift: 'A' | 'B' | 'C';
  current_slot: string;
  optimized_slot: string;
  saving_per_cycle_inr: number;
  carbon_reduction_kg: number;
  can_shift: boolean;
}

export const VERNACULAR_DISPATCHES: Record<string, VernacularDispatch[]> = {
  'TexAlpha Mills': [
    {
      id: 'DISP-TA-01',
      machine_id: 'TA-COMP-01',
      trigger_reason: 'Compressor idle bleed & daytime peak tariff charge',
      scheduled_time: 'Tonight @ 22:30 (Off-Peak Slot)',
      estimated_saving_inr: 850,
      priority: 'HIGH',
      translations: {
        marathi: {
          supervisor_title: 'शिफ्ट सी सुपरवायझर (Shift C Floor)',
          text: '📢 [टेक्सअल्फा अलर्ट]: आज रात्री १०:३० नंतर मुख्य एअर कॉम्प्रेसर चालवा. दिवसा चालवल्यास जास्त दर लागतो. रात्री चालवल्यास प्रति शिफ्ट ₹८५० वीज बिल वाचेल.',
          voice_text: 'सुपरवायझर दादा, आज रात्री साडे दहा नंतर कॉम्प्रेसर सुरू करा. रात्री वीज स्वस्त आहे, आठशे पन्नास रुपये वाचतील.',
        },
        hindi: {
          supervisor_title: 'शिफ्ट सी सुपरवाइजर (Shift C Floor)',
          text: '📢 [टेक्सअल्फा अलर्ट]: आज रात १०:३० के बाद ही मुख्य एयर कंप्रेसर चलाएं। पीक ऑवर्स से शिफ्ट करने पर प्रति शिफ्ट ₹८५० की बिजली बचत होगी।',
          voice_text: 'सुपरवाइजर जी, रात साढ़े दस बजे के बाद कंप्रेसर चलाएं। पीक टैरिफ से बचेंगे, साढ़े आठ सौ रुपये बचेंगे।',
        },
        gujarati: {
          supervisor_title: 'શિફ્ટ સી સુપરવાઇઝર',
          text: '📢 [ટેક્સઆલ્ફા નોટિસ]: આજે રાત્રે ૧૦:૩૦ પછી મુખ્ય એર કોમ્પ્રેસર ચલાવો. ₹૮૫૦ વીજળી ખર્ચ બચશે.',
          voice_text: 'સુપરવાઇઝર સાહેબ, રાત્રે સાડા દસ પછી જ કોમ્પ્રેસર ચલાવો. સાડા આઠસો રૂપિયા બચશે.',
        },
        tamil: {
          supervisor_title: 'ஷிப்ட் சி மேற்பார்வையாளர்',
          text: '📢 [நோட்டீஸ்]: இன்று இரவு 10:30 மணிக்குப் பிறகு ஏர் கம்ப்ரஸரை இயக்கவும். ஷிப்ட்டுக்கு ₹850 மின் கட்டணம் மிச்சமாகும்.',
          voice_text: 'சூப்பர்வைசர், இரவு பத்தரை மணிக்கு கம்ப்ரஸரை ஆன் செய்யுங்கள், எண்ணூற்று ஐம்பது ரூபாய் மிச்சமாகும்.',
        },
        english: {
          supervisor_title: 'Shift C Supervisor (Floor Incharge)',
          text: '📢 [Textile Audit Alert]: Shift main compressor operation to post 22:30 (Off-Peak ToD slot). Prevents kVA surcharge, saving ₹850/shift.',
          voice_text: 'Supervisor, please run the compressor after 10:30 PM tonight during off-peak hours to save 850 rupees.',
        },
      },
    },
    {
      id: 'DISP-TA-02',
      machine_id: 'TA-LOOM-02',
      trigger_reason: 'Bearing friction heat threshold breach (>45°C)',
      scheduled_time: 'Immediate Shift Inspection',
      estimated_saving_inr: 450,
      priority: 'CRITICAL',
      translations: {
        marathi: {
          supervisor_title: 'फ्लोर मेकॅनिक व ऑपरेटर',
          text: '⚠️ [तातडीची सूचना]: लूम क्र. ०२ चे बेअरिंग तापमान ४६.५°C वर गेले आहे! ताबडतोब लूम्ब्रिकेशन ऑईल तपासा व वेंटिलेशन डक्ट उघडा, अन्यथा मोठा बिघाड होईल.',
          voice_text: 'लक्ष द्या, लूम नंबर दोन खूप गरम झाला आहे, ४६ डिग्री तापमान आहे. ऑयलिंग करा आणि पंखा चालू करा.',
        },
        hindi: {
          supervisor_title: 'फ्लोर मैकेनिक व ऑपरेटर',
          text: '⚠️ [तत्काल चेतावनी]: लूम नं. ०२ का तापमान ४६.५°C पहुंच चुका है! मोटर का तेल चेक करें और साइड कवर तुरंत खोलें।',
          voice_text: 'ध्यान दें, लूम नंबर दो ओवरहीट हो रहा है। तुरंत तेल चेक करें और कवर खोलें।',
        },
        gujarati: {
          supervisor_title: 'ફ્લોર મેકેનિક',
          text: '⚠️ [ચેતવણી]: લૂમ ૦૨ નું તાપમાન ૪૬.૫°C વટાવી ગયું છે. ઓઇલિંગ કરો અને મોટર તપાસો.',
          voice_text: 'ધ્યાન આપો, લૂમ નંબર બે ગરમ થઈ ગયું છે. તરત ઓઈલિંગ કરો.',
        },
        tamil: {
          supervisor_title: 'மெக்கானிக் மற்றும் ஆப்பரேட்டர்',
          text: '⚠️ [எச்சரிக்கை]: லூம் 02 வெப்பநிலை 46.5°C தாண்டியது! உடனே லூப்ரிகேஷன் எண்ணெய் ஊற்றி குளிரூட்டவும்.',
          voice_text: 'கவனம், லூம் எண் இரண்டு மிகவும் சூடாகிவிட்டது. உடனே எண்ணெய் ஊற்றவும்.',
        },
        english: {
          supervisor_title: 'Floor Maintenance & Operator',
          text: '⚠️ [Immediate Alarm]: Loom TA-LOOM-02 casing temp exceeded 46.5°C! Inspect lubrication oil and engage supplemental cooling fan.',
          voice_text: 'Warning: Loom 02 has exceeded 46.5 degrees Celsius. Inspect lubrication immediately.',
        },
      },
    },
    {
      id: 'DISP-TA-03',
      machine_id: 'TA-SPIN-01',
      trigger_reason: 'Power factor droop below 0.85 on spinning feeder',
      scheduled_time: 'Shift B (14:00 - 22:00)',
      estimated_saving_inr: 1200,
      priority: 'HIGH',
      translations: {
        marathi: {
          supervisor_title: 'इलेक्ट्रिशियन / शिफ्ट इंचार्ज',
          text: '⚡ [पॉवर फॅक्टर सूचना]: स्पिनिंग लाईनचा पॉवर फॅक्टर ०.८५ खाली घसरला आहे. पॅनेलमधील कॅपॅसिटर बँक १ ऑन करा, एमएसईबीसी दंड टळेल.',
          voice_text: 'इलेक्ट्रिशियन भाऊ, स्पिनिंग पॅनेलचा कॅपेसिटर बँक चालू करा, पॉवर फॅक्टर कमी झाला आहे. दंड वाचेल.',
        },
        hindi: {
          supervisor_title: 'इलेक्ट्रीशियन / शिफ्ट इंचार्ज',
          text: '⚡ [पावर फैक्टर सूचना]: स्पिनिंग लाइन का पावर फैक्टर ०.८५ से नीचे गिर गया है। कैपेसिटर बैंक १ स्विच ऑन करें।',
          voice_text: 'इलेक्ट्रीशियन जी, स्पिनिंग पैनल पर कैपेसिटर बैंक ऑन करें, नहीं तो पेनल्टी लगेगी।',
        },
        gujarati: {
          supervisor_title: 'ઇલેક્ટ્રિશિયન',
          text: '⚡ [પાવર ફેક્ટર એલર્ટ]: સ્પિનિંગ લાઇનનો પાવર ફેક્ટર ઘટી ગયો છે. કેપેસિટર બેંક ૧ ચાલુ કરો.',
          voice_text: 'ઇલેક્ટ્રિશિયન, કેપેસિટર બેંક એક તરત ચાલુ કરો.',
        },
        tamil: {
          supervisor_title: 'எலக்ட்ரீஷியன்',
          text: '⚡ [பவர் பேக்டர் எச்சரிக்கை]: ஸ்பின்னிங் பிரிவில் பவர் பேக்டர் 0.85 க்குக் கீழ் குறைந்தது. கெபாசிட்டர் பேங்க் 1 ஐ இயக்கவும்.',
          voice_text: 'எலக்ட்ரீஷியன், கெபாசிட்டர் பேங்க் ஒன்றை உடனே ஆன் செய்யவும்.',
        },
        english: {
          supervisor_title: 'Electrician / Plant Operator',
          text: '⚡ [Power Quality Alert]: Spinning line PF dropped to 0.849. Switch ON capacitor bank #1 at local distribution panel to prevent utility penalty.',
          voice_text: 'Electrician, please engage capacitor bank number one on the spinning line panel now.',
        },
      },
    },
  ],
  'BetaWeave Industries': [
    {
      id: 'DISP-BW-01',
      machine_id: 'BW-HEAT-01',
      trigger_reason: 'Thermic boiler vibration critical breach (>5.0 mm/s)',
      scheduled_time: 'Emergency Maintenance Halt',
      estimated_saving_inr: 3500,
      priority: 'CRITICAL',
      translations: {
        marathi: {
          supervisor_title: 'बॉयलर सुपरवायझर व मेंटेनन्स',
          text: '🚨 [धोकादायक बिघाड]: थर्मिक फ्लुईड बॉयलरचे व्हायब्रेशन ५.०८ mm/s वर पोहोचले आहे! पंप बेअरिंग फुटण्याची शक्यता आहे. बॉयलर लोड तात्काळ कमी करा.',
          voice_text: 'बॉयलर ऑपरेटर, तातडीने लक्ष द्या, व्हायब्रेशन खूप वाढले आहे. पंप लगेच तपासा आणि लोड कमी करा.',
        },
        hindi: {
          supervisor_title: 'बॉयलर सुपरवाइजर व मेंटेनेंस',
          text: '🚨 [गंभीर अलार्म]: थर्मिक फ्लुइड बॉयलर का कंपन ५.०८ mm/s पार कर चुका है! ब्लोअर बंद होने का खतरा है, तत्काल लोड घटाएं।',
          voice_text: 'बॉयलर ऑपरेटर, कंपन बहुत तेज है। तुरंत पंप और पंखा चेक करें, लोड घटाएं।',
        },
        gujarati: {
          supervisor_title: 'બોઈલર ઓપરેટર',
          text: '🚨 [ઇમરજન્સી]: થર્મિક ફ્લુઇડ બોઈલરનું વાઇબ્રેશન ભયજનક સ્તરે છે! તરત જ પંપ તપાસો.',
          voice_text: 'બોઇલર ઓપરેટર, વાઇબ્રેશન ખૂબ વધી ગયું છે, તરત જ તપાસ કરો.',
        },
        tamil: {
          supervisor_title: 'பாய்லர் மேற்பார்வையாளர்',
          text: '🚨 [அவசர எச்சரிக்கை]: பாய்லர் அதிர்வு 5.08 mm/s எட்டியது! உடனடியாக சுமையை குறைக்கவும்.',
          voice_text: 'பாய்லர் சூப்பர்வைசர், அதிர்வு மிக அதிகம், உடனடியாக மோட்டாரை பரிசோதிக்கவும்.',
        },
        english: {
          supervisor_title: 'Boiler Plant Incharge & Maintenance',
          text: '🚨 [Critical Safety Trip]: Thermic fluid circulating pump vibration reached 5.08 mm/s (ISO 10816 Zone C). De-rate firing immediately.',
          voice_text: 'Emergency alarm: Boiler vibration exceeded 5 millimeters per second. De-rate firing rate immediately.',
        },
      },
    },
    {
      id: 'DISP-BW-02',
      machine_id: 'BW-DYE-01',
      trigger_reason: 'Dyeing vat steam runaway (>54°C liquor surface)',
      scheduled_time: 'Tonight @ 23:00 (Off-Peak ToD)',
      estimated_saving_inr: 1400,
      priority: 'HIGH',
      translations: {
        marathi: {
          supervisor_title: 'डायिंग मास्टर (Dyeing Master)',
          text: '📢 [डायिंग सूचना]: जिंगर डायिंग बाथचे स्टीम व्हॉल्व्ह ऑटो मोडवर टाका आणि दुसरी बॅच रात्री ११ वाजता घ्या. ₹१,४०० ची स्टीम व वीज बचत होईल.',
          voice_text: 'डायिंग मास्टरजी, पुढची बॅच रात्री अकरा नंतर घ्या. स्टीम व्हॉल्व्ह कंट्रोल करा, चौदाशे रुपये वाचतील.',
        },
        hindi: {
          supervisor_title: 'डाइंग मास्टर',
          text: '📢 [डाइंग अलर्ट]: जिगर डाइंग मशीन की अगली लॉट रात ११ बजे के बाद चलाएं। स्टीम वाल्व धीमा करें, ₹१,४०० बचेंगे।',
          voice_text: 'डाइंग मास्टर जी, अगला बैच रात ग्यारह बजे के बाद लें, चौदह सौ रुपये बचेंगे।',
        },
        gujarati: {
          supervisor_title: 'ડાઇંગ માસ્ટર',
          text: '📢 [ડાઇંગ એલર્ટ]: ડાઇંગ બેચ રાત્રે ૧૧ વાગ્યા પછી ચલાવો. સ્ટીમ અને વીજળીમાં ₹૧,૪૦૦ બચશે.',
          voice_text: 'ડાઇંગ માસ્ટર, હવે પછીની બેચ રાત્રે અગિયાર વાગ્યા પછી લો.',
        },
        tamil: {
          supervisor_title: 'டையிங் மாஸ்டர்',
          text: '📢 [டையிங் அறிவிப்பு]: அடுத்த டையிங் சுழற்சியை இரவு 11 மணிக்குத் தொடங்கவும். ₹1,400 மிச்சமாகும்.',
          voice_text: 'டையிங் மாஸ்டர், அடுத்த பேட்சை இரவு பதினொரு மணிக்கு எடுக்கவும்.',
        },
        english: {
          supervisor_title: 'Dyeing Hall Master & Boiler Liaison',
          text: '📢 [Process Shift]: Postpone next heavy jigger dye lot to 23:00. Throttle modulating steam valve to 65% to save ₹1,400.',
          voice_text: 'Dyeing master, run the heavy batch after 11 PM tonight to save 1,400 rupees in steam and electricity.',
        },
      },
    },
  ],
};

export const DPR_LOAN_DATA: Record<string, DprLoanData> = {
  'TexAlpha Mills': {
    scheme_name: 'ADEETIE Scheme (Bureau of Energy Efficiency) & SIDBI 4E Green MSME Loan',
    nodal_agency: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Govt. of India',
    applicant_factory: 'TexAlpha Mills Pvt. Ltd.',
    cluster_location: 'Ichalkaranji Textile Cluster, Kolhapur District, Maharashtra (PIN: 416115)',
    project_title: 'Techno-Economic DPR for Motor Upgradation (IE3) & APFC Power Factor Normalization',
    application_ref: 'BEE/ADEETIE/MH-ICH/2026/0482',
    date_generated: 'October 12, 2026',
    current_annual_consumption_mwh: 34.2,
    current_annual_bill_inr: 2898000,
    sec_baseline_kwh_kg: 11.21,
    sec_bee_benchmark_kwh_kg: 3.2,
    sec_excess_pct: 250.3,
    total_project_cost_inr: 350000,
    subsidies: {
      adeetie_grant_inr: 105000,
      adeetie_grant_pct: 30,
      sidbi_soft_loan_inr: 210000,
      sidbi_interest_rate_pct: 6.75,
      promoter_equity_inr: 35000,
    },
    interventions: [
      {
        item: 'Premium Efficiency IE3 Motors (4 x 5.5 kW & 1 x 11 kW)',
        category: 'Motor Driven Systems (MDS)',
        cost_inr: 185000,
        annual_energy_saving_kwh: 18200,
        annual_cost_saving_inr: 198000,
      },
      {
        item: 'Automatic Power Factor Correction (APFC) Panel - 15 kVAR Stepped',
        category: 'Electrical Power Quality',
        cost_inr: 65000,
        annual_energy_saving_kwh: 5800,
        annual_cost_saving_inr: 112000,
      },
      {
        item: 'Variable Frequency Drives (VFD) on Compressor & Warper Motors',
        category: 'Speed Control & Pressure Regulation',
        cost_inr: 100000,
        annual_energy_saving_kwh: 11200,
        annual_cost_saving_inr: 122000,
      },
    ],
    financial_metrics: {
      simple_payback_months: 9.7,
      project_irr_pct: 118.4,
      dscr: 2.85,
      annual_co2_abatement_tonnes: 28.9,
    },
  },
  'BetaWeave Industries': {
    scheme_name: 'ADEETIE Scheme (BEE) & SIDBI MSME Green Energy Transition Facility',
    nodal_agency: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Govt. of India',
    applicant_factory: 'BetaWeave Industries Ltd.',
    cluster_location: 'Surat Synthetic Weaving Cluster, Gujarat (PIN: 395002)',
    project_title: 'DPR for Waste Heat Recovery Economizer & Dynamic Motor Re-Balancing',
    application_ref: 'BEE/ADEETIE/GJ-SUR/2026/0891',
    date_generated: 'October 12, 2026',
    current_annual_consumption_mwh: 28.6,
    current_annual_bill_inr: 2430000,
    sec_baseline_kwh_kg: 10.45,
    sec_bee_benchmark_kwh_kg: 3.4,
    sec_excess_pct: 207.3,
    total_project_cost_inr: 480000,
    subsidies: {
      adeetie_grant_inr: 144000,
      adeetie_grant_pct: 30,
      sidbi_soft_loan_inr: 288000,
      sidbi_interest_rate_pct: 6.75,
      promoter_equity_inr: 48000,
    },
    interventions: [
      {
        item: 'Thermic Fluid Flue Gas Economizer with Condensate Return',
        category: 'Thermal Waste Heat Recovery',
        cost_inr: 240000,
        annual_energy_saving_kwh: 24000,
        annual_cost_saving_inr: 264000,
      },
      {
        item: 'Automated Microprocessor Steam Control for Jigger Dyeing Baths',
        category: 'Process Automation',
        cost_inr: 120000,
        annual_energy_saving_kwh: 14500,
        annual_cost_saving_inr: 156000,
      },
      {
        item: 'Dynamic Shaft Balancing & Laser Alignment on Circulation Pumps',
        category: 'Vibration & Mechanical Reliability',
        cost_inr: 120000,
        annual_energy_saving_kwh: 12000,
        annual_cost_saving_inr: 160000,
      },
    ],
    financial_metrics: {
      simple_payback_months: 10.0,
      project_irr_pct: 114.2,
      dscr: 2.65,
      annual_co2_abatement_tonnes: 32.4,
    },
  },
};

export const CLUSTER_BENCHMARKS: Record<string, ClusterBenchmark> = {
  'TexAlpha Mills': {
    cluster_name: 'Ichalkaranji Powerloom & Sizing Cluster (Maharashtra)',
    state: 'Maharashtra',
    total_smes_in_cluster: 52,
    factory_rank: 41,
    factory_percentile: 78.8,
    metrics: [
      {
        label: 'Specific Energy Consumption (SEC)',
        unit: 'kWh/kg cloth',
        factory_value: 11.21,
        cluster_top_10: 5.4,
        cluster_median: 7.8,
        cluster_worst_25: 11.9,
        verdict: '43.7% worse than Ichalkaranji cluster median',
        gap_pct: 43.7,
        is_favorable: false,
      },
      {
        label: 'Average Power Factor',
        unit: 'ratio (0-1)',
        factory_value: 0.874,
        cluster_top_10: 0.985,
        cluster_median: 0.942,
        cluster_worst_25: 0.865,
        verdict: 'Trailing cluster median (0.942); incurring reactive power penalty',
        gap_pct: 7.2,
        is_favorable: false,
      },
      {
        label: 'Floor Thermal Loss Index',
        unit: '°C above ambient',
        factory_value: 14.2,
        cluster_top_10: 4.5,
        cluster_median: 8.2,
        cluster_worst_25: 15.1,
        verdict: 'High radiant motor heat indicates uninsulated or overloaded drives',
        gap_pct: 73.1,
        is_favorable: false,
      },
      {
        label: 'Connected Load Utilization',
        unit: '% of sanctioned kVA',
        factory_value: 62.4,
        cluster_top_10: 82.0,
        cluster_median: 71.5,
        cluster_worst_25: 54.0,
        verdict: 'Moderate load factor with low off-peak utilization',
        gap_pct: 12.7,
        is_favorable: false,
      },
    ],
    peer_distribution: [
      { bucket: 'Top 10% (SEC < 6.0)', count: 5, contains_factory: false },
      { bucket: 'Efficient (SEC 6.0 - 7.5)', count: 14, contains_factory: false },
      { bucket: 'Median (SEC 7.5 - 9.0)', count: 18, contains_factory: false },
      { bucket: 'Lagging (SEC 9.0 - 11.0)', count: 9, contains_factory: false },
      { bucket: 'Critical (SEC > 11.0)', count: 6, contains_factory: true },
    ],
  },
  'BetaWeave Industries': {
    cluster_name: 'Surat Synthetic Weaving & Dyeing Hub (Gujarat)',
    state: 'Gujarat',
    total_smes_in_cluster: 68,
    factory_rank: 59,
    factory_percentile: 86.7,
    metrics: [
      {
        label: 'Specific Energy Consumption (SEC)',
        unit: 'kWh/kg cloth',
        factory_value: 10.45,
        cluster_top_10: 4.8,
        cluster_median: 7.1,
        cluster_worst_25: 10.8,
        verdict: '47.1% higher power consumption per kg than Surat median',
        gap_pct: 47.1,
        is_favorable: false,
      },
      {
        label: 'Average Power Factor',
        unit: 'ratio (0-1)',
        factory_value: 0.868,
        cluster_top_10: 0.99,
        cluster_median: 0.955,
        cluster_worst_25: 0.87,
        verdict: 'Bottom quartile; DGVCL power factor surcharge charged monthly',
        gap_pct: 9.1,
        is_favorable: false,
      },
      {
        label: 'Thermic Fluid Heat Loss',
        unit: 'stack temp °C',
        factory_value: 235.0,
        cluster_top_10: 145.0,
        cluster_median: 175.0,
        cluster_worst_25: 240.0,
        verdict: 'High flue gas temperature; 34% boiler thermal heat lost up chimney',
        gap_pct: 34.2,
        is_favorable: false,
      },
      {
        label: 'Vibration Fault Frequency',
        unit: 'events / 1000 hrs',
        factory_value: 24.5,
        cluster_top_10: 2.1,
        cluster_median: 6.4,
        cluster_worst_25: 22.0,
        verdict: 'Critical: 3.8x higher bearing wear than cluster average',
        gap_pct: 282.8,
        is_favorable: false,
      },
    ],
    peer_distribution: [
      { bucket: 'Top 10% (SEC < 5.5)', count: 7, contains_factory: false },
      { bucket: 'Efficient (SEC 5.5 - 7.0)', count: 18, contains_factory: false },
      { bucket: 'Median (SEC 7.0 - 8.5)', count: 24, contains_factory: false },
      { bucket: 'Lagging (SEC 8.5 - 10.0)', count: 11, contains_factory: false },
      { bucket: 'Critical (SEC > 10.0)', count: 8, contains_factory: true },
    ],
  },
};

export const TOD_TARIFF_STRUCTURE: TodSlot[] = [
  {
    time_range: '22:00 → 06:00 (Night)',
    slot_type: 'OFF_PEAK',
    rate_per_kwh: 4.8,
    grid_carbon_kg_kwh: 0.68,
    label: 'Off-Peak Green Slot (-25% Tariff Discount)',
  },
  {
    time_range: '06:00 → 18:00 (Day Normal)',
    slot_type: 'NORMAL',
    rate_per_kwh: 7.2,
    grid_carbon_kg_kwh: 0.82,
    label: 'Standard Commercial Industrial Tariff',
  },
  {
    time_range: '18:00 → 22:00 (Evening Peak)',
    slot_type: 'PEAK',
    rate_per_kwh: 11.5,
    grid_carbon_kg_kwh: 1.05,
    label: 'DISCOM Peak Demand Surcharge (+59% Tariff Penalty)',
    is_current_slot: true,
  },
];

export const MACHINE_SCHEDULE_ITEMS: Record<string, MachineScheduleItem[]> = {
  'TexAlpha Mills': [
    {
      machine_id: 'TA-COMP-01',
      machine_type: 'Air Compressor (Air receiver pressurization)',
      nominal_kw: 5.93,
      current_shift: 'A',
      current_slot: '18:00 → 22:00 (Peak)',
      optimized_slot: '22:00 → 06:00 (Off-Peak)',
      saving_per_cycle_inr: 850,
      carbon_reduction_kg: 8.8,
      can_shift: true,
    },
    {
      machine_id: 'TA-WARP-01',
      machine_type: 'Warping Machine (Beam preparation)',
      nominal_kw: 1.74,
      current_shift: 'B',
      current_slot: '18:00 → 22:00 (Peak)',
      optimized_slot: '06:00 → 12:00 (Morning Normal)',
      saving_per_cycle_inr: 290,
      carbon_reduction_kg: 3.2,
      can_shift: true,
    },
    {
      machine_id: 'TA-LOOM-01',
      machine_type: 'Power Loom #1 (Continuous weaving)',
      nominal_kw: 2.87,
      current_shift: 'A',
      current_slot: 'Continuous 3-shift',
      optimized_slot: 'Maintain continuous base',
      saving_per_cycle_inr: 0,
      carbon_reduction_kg: 0,
      can_shift: false,
    },
    {
      machine_id: 'TA-LOOM-02',
      machine_type: 'Power Loom #2 (Continuous weaving)',
      nominal_kw: 3.56,
      current_shift: 'B',
      current_slot: 'Continuous 3-shift',
      optimized_slot: 'Maintain continuous base',
      saving_per_cycle_inr: 0,
      carbon_reduction_kg: 0,
      can_shift: false,
    },
  ],
  'BetaWeave Industries': [
    {
      machine_id: 'BW-DYE-01',
      machine_type: 'Jigger Dyeing Machine (Hot water liquor circulation)',
      nominal_kw: 5.86,
      current_shift: 'B',
      current_slot: '18:00 → 22:00 (Peak)',
      optimized_slot: '22:00 → 06:00 (Off-Peak Night)',
      saving_per_cycle_inr: 1570,
      carbon_reduction_kg: 17.4,
      can_shift: true,
    },
    {
      machine_id: 'BW-HEAT-01',
      machine_type: 'Thermic Fluid Boiler (Boiler preheating & draft)',
      nominal_kw: 8.12,
      current_shift: 'A',
      current_slot: '18:00 → 22:00 (Peak)',
      optimized_slot: '04:00 → 07:00 (Early Morning)',
      saving_per_cycle_inr: 2180,
      carbon_reduction_kg: 24.1,
      can_shift: true,
    },
    {
      machine_id: 'BW-COMP-01',
      machine_type: 'Screw Compressor (Air supply receiver)',
      nominal_kw: 5.08,
      current_shift: 'B',
      current_slot: '18:00 → 22:00 (Peak)',
      optimized_slot: '22:00 → 06:00 (Off-Peak Night)',
      saving_per_cycle_inr: 1360,
      carbon_reduction_kg: 15.0,
      can_shift: true,
    },
  ],
};
