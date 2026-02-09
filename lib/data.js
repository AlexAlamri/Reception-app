// lib/data.js - All triage data for the application
// Cross-checked against: NHS.uk, NICE NG12 (May 2025), NICE NG253 (Jan 2025),
// NICE NG158 (Aug 2023), NICE NG240 (Mar 2024), NICE NG143, UK Sepsis Trust 7th Ed 2024,
// UKHSA guidance, BMA safe triage principles
// Last reviewed: 06 February 2026

export const redFlags = [
  {
    id: 'chest-pain',
    keywords: ['chest pain', 'tight chest', 'pressure chest', 'pain arm jaw', 'heart attack', 'crushing chest', 'heavy chest'],
    description: 'Chest pain / tight chest / pressure / pain spreading to arm, neck, jaw or back',
    action: 'CALL 999 NOW',
    category: 'cardiac'
  },
  {
    id: 'aortic-dissection',
    keywords: ['tearing pain chest', 'tearing pain back', 'ripping pain chest', 'sudden severe back pain tearing', 'worst back pain radiating'],
    description: 'Sudden tearing/ripping chest or back pain radiating between shoulder blades',
    action: 'CALL 999 NOW',
    category: 'cardiac',
    niceRef: 'NHS.uk Aortic dissection'
  },
  {
    id: 'breathing',
    keywords: ['can\'t breathe', 'can\'t speak', 'blue lips', 'grey lips', 'very short breath', 'breathing difficulty severe'],
    description: 'Can\'t breathe / very short of breath / blue or grey lips',
    action: 'CALL 999 NOW',
    category: 'respiratory'
  },
  {
    id: 'stroke',
    keywords: ['face drooping', 'arm weakness', 'slurred speech', 'stroke', 'fast', 'sudden confusion'],
    description: 'Face drooping / arm weakness / slurred speech (FAST - stroke signs)',
    action: 'CALL 999 NOW',
    category: 'neurological'
  },
  {
    id: 'collapse',
    keywords: ['collapsed', 'unconscious', 'fitting', 'seizure', 'not responding', 'passed out won\'t wake'],
    description: 'Collapsed / unconscious / fitting / seizure',
    action: 'CALL 999 NOW',
    category: 'neurological'
  },
  {
    id: 'bleeding-gi',
    keywords: ['vomiting blood', 'black poo', 'tarry stool', 'blood poo', 'heavy bleeding', 'bleeding won\'t stop'],
    description: 'Vomiting blood / black tarry poo / heavy bleeding that won\'t stop',
    action: 'CALL 999 NOW',
    category: 'gastrointestinal'
  },
  {
    id: 'headache-severe',
    keywords: ['worst headache', 'thunderclap', 'sudden severe headache', 'worst headache of my life'],
    description: 'Worst headache of my life / sudden severe headache (thunderclap)',
    action: 'CALL 999 NOW',
    category: 'neurological'
  },
  {
    id: 'meningitis',
    keywords: ['rash doesn\'t fade glass', 'non-blanching rash', 'stiff neck fever', 'light hurts eyes fever', 'purple rash', 'spots don\'t fade', 'meningitis', 'glass test rash', 'rash spreading fast'],
    description: 'Meningitis signs: non-blanching rash (glass test) + fever + stiff neck + sensitivity to light. Check palms, soles, mouth on darker skin.',
    action: 'CALL 999 NOW',
    category: 'sepsis',
    niceRef: 'NICE NG240 (Mar 2024)'
  },
  {
    id: 'non-blanching-rash-child',
    keywords: ['child rash doesn\'t fade', 'baby rash glass test', 'child purple spots', 'baby spots won\'t fade', 'child petechiae'],
    description: 'Child with non-blanching rash (spots that don\'t fade under glass) - assume meningitis until proven otherwise',
    action: 'CALL 999 NOW',
    category: 'sepsis',
    niceRef: 'NICE NG240 (Mar 2024)'
  },
  {
    id: 'allergic',
    keywords: ['allergic reaction', 'face swelling', 'tongue swelling', 'throat closing', 'anaphylaxis', 'can\'t swallow'],
    description: 'Severe allergic reaction / face or tongue swelling / throat closing',
    action: 'CALL 999 NOW',
    category: 'allergy'
  },
  {
    id: 'urinary-retention',
    keywords: ['can\'t pee', 'can\'t urinate', 'can\'t pass urine', 'retention'],
    description: 'Can\'t pee at all with severe pain',
    action: 'CALL 999 NOW',
    category: 'urological'
  },
  {
    id: 'abdo-severe',
    keywords: ['severe tummy pain', 'can\'t move pain', 'rigid abdomen', 'worst stomach pain', 'can\'t pass poo', 'can\'t pass wind', 'can\'t fart', 'bowel obstruction'],
    description: 'Severe sudden abdominal pain / can\'t move with pain / can\'t pass poo or wind with severe pain',
    action: 'CALL 999 NOW',
    category: 'gastrointestinal'
  },
  {
    id: 'cauda-equina',
    keywords: ['back pain bladder', 'can\'t control bowels', 'numb between legs', 'saddle numbness', 'legs giving way', 'pins needles genitals', 'pins needles between legs', 'numb genitals', 'back pain can\'t control bladder', 'back pain bowel control'],
    description: 'Back pain + can\'t control bladder/bowels + numb/pins & needles between legs or genitals (cauda equina - emergency even without all symptoms)',
    action: 'CALL 999 NOW',
    category: 'neurological',
    niceRef: 'NICE CKS Cauda Equina; National CES Guidelines 2025'
  },
  {
    id: 'sepsis',
    keywords: ['acting confused', 'rash doesn\'t fade', 'blotchy skin', 'mottled', 'ashen skin', 'feels like dying', 'feel like I might die', 'very fast breathing', 'cold hands feet', 'very high temperature', 'very low temperature', 'not passed urine 18 hours', 'no urine all day'],
    description: 'Sepsis signs: acting confused / mottled or ashen skin / rash doesn\'t fade / feels like dying / no urine for 18+ hours. NOTE: Sepsis can occur WITHOUT fever.',
    action: 'CALL 999 NOW',
    category: 'sepsis',
    niceRef: 'NICE NG253 (Jan 2025); UK Sepsis Trust 7th Ed 2024'
  },
  {
    id: 'testicular',
    keywords: ['testicle pain', 'testicular pain', 'groin pain sudden', 'balls pain vomiting', 'twisted testicle'],
    description: 'Sudden severe groin/testicle pain with vomiting (possible torsion)',
    action: 'CALL 999 NOW',
    category: 'urological'
  },
  {
    id: 'ectopic',
    keywords: ['pregnant pain one side', 'early pregnancy pain', 'shoulder tip pain pregnant', 'one sided pain pregnant', 'ectopic', 'pregnant collapse'],
    description: 'Pregnancy <12 weeks + one-sided abdominal pain + shoulder tip pain (possible ectopic)',
    action: 'CALL 999 / A&E NOW',
    category: 'obstetric'
  },
  {
    id: 'acute-limb-ischaemia',
    keywords: ['sudden cold leg', 'white leg', 'painful pale leg', 'can\'t feel leg suddenly', 'leg gone white', 'leg gone cold', 'no pulse foot'],
    description: 'Sudden cold, white, painful leg/arm (6 P\'s: pain, pallor, pulselessness, paraesthesia, paralysis, perishing cold)',
    action: 'CALL 999 NOW',
    category: 'vascular',
    niceRef: 'NICE NG224'
  },
  {
    id: 'mscc',
    keywords: ['cancer back pain legs', 'cancer leg weakness', 'known cancer can\'t walk', 'tumour spine', 'cancer numb legs'],
    description: 'Known cancer patient + new back pain + leg weakness/numbness (malignant spinal cord compression - MSCC)',
    action: 'CALL 999 NOW',
    category: 'oncology',
    niceRef: 'NICE CG75 (Metastatic spinal cord compression)'
  },
  {
    id: 'acute-glaucoma',
    keywords: ['severe eye pain headache', 'eye pain vomiting', 'haloes around lights', 'eye rock hard', 'sudden eye pain one side'],
    description: 'Severe eye pain + headache + vomiting + haloes around lights (possible acute angle-closure glaucoma)',
    action: 'CALL 999 / A&E or Royal Eye Unit URGENT',
    category: 'ophthalmology',
    niceRef: 'NICE CKS Glaucoma'
  },
  {
    id: 'suicide-active',
    keywords: ['suicide attempt', 'taken overdose', 'harming self now', 'danger to others', 'going to kill'],
    description: 'Suicide attempt happening now / immediate danger to self or others',
    action: 'CALL 999 + Alert Clinician',
    category: 'mental-health'
  }
];

export const amberFlags = [
  {
    id: 'breathing-amber',
    category: 'Breathing / Cough',
    keywords: ['worsening breathlessness', 'new breathlessness', 'wheeze', 'asthma flare', 'asthma attack', 'COPD flare', 'coughing blood', 'fever chest pain'],
    action: 'GP Triager - Same Day',
    searchTerms: ['breathing', 'wheeze', 'asthma', 'copd', 'cough', 'chest']
  },
  {
    id: 'abdo-amber',
    category: 'Tummy / Gut',
    keywords: ['severe persistent pain', 'can\'t keep fluids down', 'dehydrated', 'not drinking', 'persistent vomiting', 'severe diarrhoea', 'diabetes vomiting'],
    action: 'GP Triager - Same Day',
    searchTerms: ['stomach', 'tummy', 'vomiting', 'diarrhoea', 'abdominal', 'gut']
  },
  {
    id: 'diabetes-amber',
    category: 'Diabetes',
    keywords: ['blood sugar low', 'blood sugar under 4', 'blood sugar over 20', 'blood sugar high', 'hypo', 'shaking sweating', 'fruity breath', 'very thirsty urinating', 'type 1 unwell', 'diabetes vomiting'],
    action: 'GP Triager - Same Day',
    searchTerms: ['diabetes', 'sugar', 'insulin', 'diabetic']
  },
  {
    id: 'urinary-amber',
    category: 'Waterworks / Urinary',
    keywords: ['blood in urine', 'flank pain fever', 'back pain fever', 'male UTI', 'male urinary', 'catheter problem', 'pregnant UTI', 'can\'t pass urine', 'bladder won\'t empty'],
    action: 'GP Triager (NOT Pharmacy First)',
    searchTerms: ['urine', 'urinary', 'uti', 'bladder', 'kidney', 'waterworks']
  },
  {
    id: 'neuro-amber',
    category: 'Head / Neurology',
    keywords: ['sudden severe headache', 'new weakness', 'new numbness', 'new confusion', 'blackout', 'fainted', 'loss of consciousness'],
    action: 'GP Triager (if stroke → 999)',
    searchTerms: ['headache', 'head', 'dizzy', 'faint', 'weakness', 'numb']
  },
  {
    id: 'skin-amber',
    category: 'Skin / Infection',
    keywords: ['rapidly spreading redness', 'cellulitis spreading', 'face infection', 'eye infection', 'rigors', 'shivering', 'very unwell', 'tracking redness'],
    action: 'GP Triager - Same Day',
    searchTerms: ['skin', 'rash', 'infection', 'cellulitis', 'red', 'swelling']
  },
  {
    id: 'dvt-amber',
    category: 'DVT (Blood Clot in Leg)',
    keywords: ['swollen leg one side', 'calf swelling', 'red hot leg', 'leg swollen after surgery', 'leg swollen after flight', 'one leg bigger', 'calf pain swelling'],
    action: 'GP Triager - Same Day (Wells score assessment needed)',
    searchTerms: ['leg swelling', 'dvt', 'blood clot', 'calf', 'swollen leg'],
    niceRef: 'NICE NG158 (Aug 2023)'
  },
  {
    id: 'pe-amber',
    category: 'PE (Blood Clot in Lung)',
    keywords: ['breathless chest pain', 'sharp chest pain breathing', 'coughing blood breathless', 'chest pain after surgery', 'chest pain after flight', 'pleuritic chest pain'],
    action: 'GP Triager - URGENT Same Day. If severe breathlessness/collapse → 999',
    searchTerms: ['chest pain breathing', 'pe', 'pulmonary', 'blood clot lung'],
    niceRef: 'NICE NG158 (Aug 2023)'
  },
  {
    id: 'temporal-arteritis',
    category: 'Temporal Arteritis / GCA',
    keywords: ['headache over 50', 'jaw pain chewing', 'scalp tender', 'temple headache', 'vision blurry headache', 'temporal headache new'],
    action: 'GP Triager - URGENT Same Day (risk of permanent vision loss)',
    searchTerms: ['headache', 'temple', 'jaw', 'scalp', 'vision'],
    niceRef: 'NICE NG244; BSR GCA Guidelines'
  },
  {
    id: 'renal-colic',
    category: 'Renal Colic / Kidney Stone',
    keywords: ['loin to groin pain', 'severe side pain', 'can\'t lie still pain', 'kidney pain severe', 'renal colic', 'writhing pain'],
    action: 'GP Triager - Same Day',
    searchTerms: ['kidney', 'loin', 'groin pain', 'side pain', 'renal']
  },
  {
    id: 'fever-under5',
    category: 'Fever in Under 5s',
    keywords: ['baby fever', 'toddler high temperature', 'child hot floppy', 'baby not feeding fever', 'child fever rash', 'baby temperature'],
    action: 'GP Triager - Same Day (NICE traffic light assessment). Non-blanching rash → 999',
    searchTerms: ['baby', 'toddler', 'child', 'fever', 'temperature', 'hot'],
    niceRef: 'NICE NG143 (Fever in under 5s)'
  },
  {
    id: 'neutropenic-sepsis',
    category: 'Neutropenic Sepsis (Chemo Patient with Fever)',
    keywords: ['chemo fever', 'chemotherapy temperature', 'cancer treatment fever', 'immunosuppressed fever', 'transplant fever'],
    action: 'GP Triager - URGENT. May need 999/A&E if unwell. Do NOT use Pharmacy First.',
    searchTerms: ['chemo', 'chemotherapy', 'cancer', 'transplant', 'fever', 'immunosuppressed'],
    niceRef: 'NICE NG151 (Neutropenic sepsis)'
  },
  {
    id: 'testicular-amber',
    category: 'Testicular Pain',
    keywords: ['testicle pain', 'testicular pain', 'sore testicle', 'swollen testicle', 'balls aching'],
    action: 'GP Triager - Same Day. If sudden onset + vomiting → 999 (see RED flags)',
    searchTerms: ['testicle', 'testicular', 'groin', 'balls']
  },
  {
    id: 'cancer-amber',
    category: 'Possible Cancer Red Flags',
    keywords: ['new lump', 'breast lump', 'unexplained weight loss', 'unexplained bleeding', 'change bowels 6 weeks', 'difficulty swallowing', 'blood urine', 'postmenopausal bleeding', 'hoarse voice 3 weeks', 'night sweats', 'persistent cough 3 weeks', 'persistent rectal bleeding', 'blood in poo', 'non-healing ulcer', 'sore won\'t heal', 'mole changed', 'unexplained fatigue', 'iron deficiency', 'persistent bloating', 'nipple discharge', 'breast skin changes', 'nipple changes', 'persistent lymph node', 'swollen glands 3 weeks', 'unexplained bone pain', 'unexplained fracture', 'mouth ulcer won\'t heal'],
    action: 'GP Triager (urgent 2WW referral pathway - NICE NG12, May 2025). Do NOT book routine.',
    searchTerms: ['lump', 'weight loss', 'cancer', 'bleeding', 'swallowing', 'cough persistent', 'mole', 'breast'],
    niceRef: 'NICE NG12 (Suspected cancer, updated May 2025)'
  },
  {
    id: 'pregnancy-early-amber',
    category: 'Pregnancy < 18 weeks',
    keywords: ['pregnant pain', 'pregnant bleeding', 'pregnant can\'t keep fluids', 'early pregnancy pain', 'pregnant vomiting'],
    action: 'GP Triager / Same Day. If <12wks + one-sided pain + shoulder tip → 999 (ectopic)',
    searchTerms: ['pregnant', 'pregnancy', 'early pregnancy', 'miscarriage']
  },
  {
    id: 'pregnancy-late-amber',
    category: 'Pregnancy > 18 weeks',
    keywords: ['reduced movements', 'baby not moving', 'waters breaking', 'contractions', 'pregnant bleeding', 'pregnant headache', 'pregnant vision'],
    action: 'Maternity Helpline: 0208 934 2802',
    searchTerms: ['pregnant', 'pregnancy', 'baby movements', 'maternity']
  },
  {
    id: 'mental-health-amber',
    category: 'Mental Health',
    keywords: ['suicidal thoughts plan', 'going to harm', 'recent self-harm intent', 'hearing voices harm', 'severe agitation', 'psychotic'],
    action: 'GP Triager + Crisis Line: 0800 028 8000 (Under 18: 0203 228 5980)',
    searchTerms: ['suicidal', 'self-harm', 'mental health', 'crisis', 'voices']
  },
  {
    id: 'safeguarding-amber',
    category: 'Safeguarding',
    keywords: ['domestic abuse', 'sexual assault', 'child concern', 'adult safeguarding', 'neglect', 'vulnerable'],
    action: 'Escalate to clinician + follow safeguarding policy',
    searchTerms: ['safeguarding', 'abuse', 'assault', 'child protection']
  }
];

export const highRiskGroups = [
  {
    id: 'pregnant',
    group: 'Pregnant or postnatal (up to 6 weeks after birth)',
    icon: '🤰',
    conditions: ['Any infection', 'Bleeding', 'Headache', 'Tummy pain', 'Breathlessness'],
    action: 'Escalate to GP Triager',
    note: 'Planned postnatal checks can still be booked directly. Higher sepsis risk (NICE NG253).',
    niceRef: 'NICE NG253'
  },
  {
    id: 'immunosuppressed',
    group: 'Weakened immune system',
    icon: '💊',
    conditions: ['Chemotherapy / radiotherapy / targeted therapy', 'Organ transplant', 'Biologic medicines', 'Long-term steroids', 'Advanced HIV'],
    action: 'Any suspected infection, fever, or feeling unwell → GP Triager URGENT',
    note: 'Do NOT use Pharmacy First for infections. Fever in chemo patients = potential neutropenic sepsis.',
    niceRef: 'NICE NG151; NICE NG253'
  },
  {
    id: 'asplenic',
    group: 'No spleen / post-splenectomy / sickle cell disease',
    icon: '🩸',
    conditions: ['Any fever', 'Feeling unwell', 'Any suspected infection'],
    action: 'GP Triager URGENT - overwhelming sepsis risk',
    note: 'These patients can deteriorate extremely rapidly with infection.',
    niceRef: 'NICE NG253; UK Sepsis Trust'
  },
  {
    id: 'frail',
    group: 'Frail elderly / Care home resident',
    icon: '👴',
    conditions: ['Falls', 'New confusion', 'Infection', 'Dehydration', 'Breathlessness', 'Reduced oral intake'],
    action: 'Lower threshold to escalate → GP Triager',
    note: 'Small changes can indicate serious illness. Higher sepsis risk (NICE NG253).',
    niceRef: 'NICE NG253'
  },
  {
    id: 'chronic',
    group: 'Severe chronic conditions',
    icon: '❤️',
    conditions: ['Severe asthma/COPD', 'Heart failure', 'Severe kidney disease', 'All diabetes (Type 1 and Type 2)', 'Liver disease'],
    action: 'Any new or worsening symptoms → GP Triager',
    note: 'All diabetes types are a sepsis risk factor (NICE NG253). Avoid delays.',
    niceRef: 'NICE NG253'
  },
  {
    id: 'cancer-active',
    group: 'Cancer patients on active treatment',
    icon: '🎗️',
    conditions: ['Any fever or infection', 'New pain', 'New back pain (MSCC risk)', 'Breathlessness', 'Bleeding'],
    action: 'GP Triager URGENT. New back pain + leg symptoms = 999 (MSCC)',
    note: 'Separate from general immunosuppression. Any fever may be neutropenic sepsis.',
    niceRef: 'NICE NG151; NICE CG75'
  },
  {
    id: 'baby',
    group: 'Baby under 1 year old',
    icon: '👶',
    conditions: ['All medical concerns'],
    action: 'Direct to GP Triager (NOT self-care)',
    note: 'Unless RED flags → then 999. Higher sepsis risk (NICE NG253).',
    niceRef: 'NICE NG253; NICE NG143'
  },
  {
    id: 'spinal-cord',
    group: 'Spinal cord injury',
    icon: '♿',
    conditions: ['Any fever', 'Feeling unwell', 'Urinary symptoms', 'Skin changes'],
    action: 'GP Triager - higher sepsis risk',
    note: 'Added to NG253 in 2024 update as specific high-risk group for sepsis.',
    niceRef: 'NICE NG253 (2024 update)'
  },
  {
    id: 'safeguarding',
    group: 'Safeguarding concerns / Learning disability / Severe mental illness',
    icon: '🛡️',
    conditions: ['Any unclear or worrying request'],
    action: 'Escalate to GP Triager',
    note: 'Follow reasonable adjustments and safeguarding policy. Communication difficulties increase risk of missed sepsis (NICE NG253).'
  },
  {
    id: 'recent-surgery',
    group: 'Recent surgery or hospitalisation (<6 weeks)',
    icon: '🏥',
    conditions: ['Leg swelling/pain (DVT risk)', 'Breathlessness/chest pain (PE risk)', 'Wound infection', 'Fever'],
    action: 'GP Triager - increased VTE and infection risk',
    note: 'Post-operative patients at higher risk of DVT/PE and surgical site infection.',
    niceRef: 'NICE NG158; NICE NG125'
  },
  {
    id: 'language-barrier',
    group: 'Language barriers / Communication difficulties',
    icon: '🗣️',
    conditions: ['Any medical request where understanding is uncertain'],
    action: 'Use interpreter services. Lower threshold to escalate to GP Triager.',
    note: 'NICE NG253 specifically identifies communication difficulties as a risk factor for missed deterioration.',
    niceRef: 'NICE NG253'
  },
  {
    id: 'homeless',
    group: 'Homeless / Rough sleepers / No fixed abode',
    icon: '🏠',
    conditions: ['Infection', 'Wounds', 'Chest symptoms', 'Mental health'],
    action: 'Lower threshold to escalate → GP Triager',
    note: 'May present late, have limited self-care resources, and higher infection risk.'
  },
  {
    id: 'substance-misuse',
    group: 'Substance misuse / Alcohol dependence',
    icon: '⚠️',
    conditions: ['Confusion', 'Seizures', 'Abdominal pain', 'Chest pain', 'Infection'],
    action: 'GP Triager - symptoms may mimic or mask serious illness',
    note: 'Atypical presentations common. Do not assume symptoms are substance-related.'
  }
];

export const pharmacyFirstConditions = [
  { id: 'sore-throat', name: 'Sore Throat', icon: '🗣️', ageRange: 'Age 5+', exclusions: ['Immunosuppressed', 'Very unwell', 'Can\'t swallow fluids'], duration: 'Up to 2 weeks' },
  { id: 'earache', name: 'Earache', icon: '👂', ageRange: 'Age 1-17', exclusions: ['Discharge from ear', 'Very unwell', 'Behind-ear swelling'], duration: 'Up to 3 days (or 7 days if >17)' },
  { id: 'sinusitis', name: 'Sinusitis', icon: '👃', ageRange: 'Age 12+', exclusions: ['Periorbital swelling', 'Very unwell', 'Immunosuppressed'], duration: 'Up to 12 weeks' },
  { id: 'insect-bite', name: 'Infected Insect Bite', icon: '🐜', ageRange: 'Age 1+', exclusions: ['Rapidly spreading', 'Very unwell', 'Facial bite with swelling'], duration: 'Signs of infection' },
  { id: 'impetigo', name: 'Impetigo', icon: '🩹', ageRange: 'Age 1+', exclusions: ['Widespread', 'Very unwell', 'Near eyes'], duration: 'Localised patches' },
  { id: 'shingles', name: 'Shingles', icon: '⚡', ageRange: 'Age 18+', exclusions: ['Facial/eye involvement', 'Immunosuppressed', 'Very unwell'], duration: 'Within 72 hours of rash' },
  { id: 'uti-women', name: 'Uncomplicated UTI', icon: '🚽', ageRange: 'Women 16-64', exclusions: ['Pregnant', 'Male', 'Catheter', 'Kidney pain', 'Fever'], duration: 'Typical symptoms' },
  { id: 'otitis-media', name: 'Acute Otitis Media', icon: '👂', ageRange: 'Age 1-17', exclusions: ['Discharge', 'Mastoid swelling', 'Very unwell'], duration: 'Up to 3 days' }
];

export const directBookingItems = [
  { id: 'follow-up', item: 'Follow-up already planned', emis_check: 'Recent consultation notes say "review in X weeks/months"', bookWith: 'The clinician named in the plan', timeframe: 'As stated in plan', warning: 'If unclear who/when → GP Triager' },
  { id: 'bloods', item: 'Blood tests due (chronic disease / medication monitoring)', emis_check: 'Recall/alert + last monitoring date + clinician plan', bookWith: 'Phlebotomy / HCA slot', timeframe: 'Within due window', warning: 'If patient says very unwell → escalate' },
  { id: 'ecg', item: 'ECG requested', emis_check: 'Clear plan in notes or hospital letter, not already booked', bookWith: 'ECG appointment (HCA/nurse)', timeframe: 'Per plan', warning: 'If chest pain NOW → Section 8 (999)' },
  { id: 'annual-review', item: 'Annual / chronic disease review due', emis_check: 'Recall alerts (diabetes, asthma, COPD, hypertension, CKD, CHD, stroke)', bookWith: 'Nurse/HCA chronic disease review + pre-review bloods if needed', timeframe: 'Within recall window', warning: 'If flare-up or red flags → GP Triager' },
  { id: 'diabetes-review', item: 'Diabetes annual review package', emis_check: 'Diabetes recall alert + bloods and foot check due', bookWith: 'Bloods + review appointments per local pathway', timeframe: 'As per recall', warning: 'Hypo/hyper symptoms (BM <4 or >20), new confusion, fruity breath, vomiting → escalate' },
  { id: 'postnatal', item: 'Postnatal check', emis_check: 'Delivery date / postnatal recall, not already completed', bookWith: 'Postnatal check appointment per local policy', timeframe: '6-8 weeks postnatal', warning: 'Heavy bleeding, severe headache, chest pain, breathlessness → Section 8' },
  { id: 'vaccines', item: 'Immunisations / vaccines due', emis_check: 'Immunisation record + recall flags', bookWith: 'Vaccination clinic', timeframe: 'As per schedule', warning: 'Vaccine side effects query → CalmCare/self-care unless red flags' },
  { id: 'smear', item: 'Cervical screening / smear due', emis_check: 'Cervical screening recall status', bookWith: 'Nurse/HCA trained for smears', timeframe: 'Within recall window', warning: 'Post-coital bleeding, postmenopausal bleeding, or lump → GP Triager' },
  { id: 'dressing', item: 'Planned dressing change / suture removal', emis_check: 'Documented plan from clinician/UTC/hospital', bookWith: 'Treatment room nurse', timeframe: 'As per plan', warning: 'NEW wounds needing assessment → UTC' }
];

export const eConsultExclusions = [
  { id: 'red-flags', exclusion: 'Any RED flag symptoms', reason: 'Requires immediate assessment - do not delay with remote consulting', action: '999 or same-day face-to-face' },
  { id: 'amber-flags', exclusion: 'Any AMBER flags not yet clinically reviewed', reason: 'Needs same-day clinician assessment', action: 'GP Triager for face-to-face' },
  { id: 'high-risk-unwell', exclusion: 'Unwell high-risk/vulnerable patients', reason: 'Higher risk of rapid deterioration', action: 'GP Triager face-to-face. Admin queries in well patients OK.' },
  { id: 'multiple-problems', exclusion: 'Multiple problems / severe / worsening / >2 weeks not improving', reason: 'Too complex for remote assessment', action: 'GP Triager to determine urgency' },
  { id: 'post-op', exclusion: 'Post-operative concerns', reason: 'Risk of surgical complications, DVT/PE, wound infection', action: 'GP Triager face-to-face', niceRef: 'NICE NG158' },
  { id: 'suspected-dvt-pe', exclusion: 'Suspected DVT or PE', reason: 'Requires urgent clinical assessment and Wells score', action: 'GP Triager face-to-face urgent', niceRef: 'NICE NG158' },
  { id: 'under-1', exclusion: 'Any child under 1 year', reason: 'All concerns in under 1s need clinical assessment', action: 'GP Triager', niceRef: 'NICE NG143' },
  { id: 'suspected-fracture', exclusion: 'Suspected fractures', reason: 'Requires examination and possibly imaging', action: 'UTC or A&E' },
  { id: 'new-neuro', exclusion: 'New neurological symptoms (weakness, numbness, visual changes)', reason: 'May indicate stroke, cord compression, or other emergency', action: 'GP Triager face-to-face urgent. If stroke signs → 999' }
];

export const contacts = [
  { id: 'emergency', service: 'Emergency Services', number: '999', hours: '24/7', priority: 'red', description: 'Life-threatening emergencies', icon: '🚨' },
  { id: 'las-onsite', service: 'LAS Admissions (On-Site Ambulance)', number: '020 3162 7525', hours: '24/7', priority: 'red', description: 'If patient on site and needs ambulance', icon: '🏥' },
  { id: 'nhs111', service: 'NHS 111', number: '111', hours: '24/7', priority: 'normal', description: 'Urgent but not life-threatening', icon: '📞' },
  { id: 'maternity', service: 'Maternity Helpline (Kingston)', number: '0208 934 2802', hours: '24/7', priority: 'amber', description: 'Pregnancy concerns >18 weeks', icon: '🤰' },
  { id: 'maternity-dau', service: 'Maternity DAU', number: '020 8934 1234 ext 4034', hours: '8:30am - 7:30pm', priority: 'normal', description: 'Day Assessment Unit (call first)', icon: '🏥' },
  { id: 'eye-unit', service: 'Royal Eye Unit (Urgent)', number: '020 8934 6799', hours: 'Mon-Fri 8:30am-4pm', priority: 'normal', description: 'Urgent eye problems (appointment only)', icon: '👁️' },
  { id: 'eye-main', service: 'Royal Eye Unit (Main)', number: '020 8934 6404', hours: 'Mon-Fri 9am-5pm', priority: 'normal', description: 'General eye enquiries', icon: '👁️' },
  { id: 'wolverton', service: 'Wolverton Centre (Sexual Health)', number: '0208 974 9331', hours: 'See website', priority: 'normal', description: 'Contraception, STI testing, genital symptoms', website: 'sexualhealthkingston.co.uk', icon: '💊' },
  { id: 'crisis', service: 'Mental Health Crisis Line', number: '0800 028 8000', hours: '24/7', priority: 'amber', description: 'Adult mental health crisis', icon: '🧠' },
  { id: 'camhs', service: 'CAMHS Crisis (Under 18)', number: '0203 228 5980', hours: '24/7', priority: 'amber', description: 'Child & adolescent mental health crisis', icon: '👶' },
  { id: 'utc', service: 'Richmond UTC (Teddington)', number: 'Book via NHS 111', hours: '8am - 8pm daily', priority: 'normal', description: 'Minor injuries, burns, wounds', address: 'Teddington Memorial Hospital, Hampton Road, TW11 0JL', icon: '🩹' },
  { id: 'talking-therapies', service: 'Kingston Talking Therapies', number: 'Self-refer online', hours: 'N/A', priority: 'normal', description: 'Anxiety, low mood, stress', website: 'swlstg.nhs.uk/kingston-talking-therapies', icon: '💬' },
  { id: 'nupas', service: 'NUPAS (Abortion)', number: '0333 004 6666', hours: 'See website', priority: 'normal', description: 'NHS-funded abortion services', icon: '🏥' },
  { id: 'bpas', service: 'BPAS (Abortion)', number: '0345 730 4030', hours: 'See website', priority: 'normal', description: 'NHS-funded abortion services', icon: '🏥' },
  { id: 'msi', service: 'MSI (Abortion)', number: '0345 300 8090', hours: 'See website', priority: 'normal', description: 'NHS-funded abortion services', icon: '🏥' }
];

export const scripts = {
  pharmacyFirst: {
    title: 'Pharmacy First Referral',
    script: "We can refer you to your local Pharmacy First Service for further assessment and treatment, including prescription-only medicines like antibiotics and antivirals, without waiting for a GP. Would you like me to do that?"
  },
  calmCare: {
    title: 'CalmCare Self-Care (Adults)',
    script: "Thanks for explaining. We have NHS-aligned self-care advice called CalmCare. I'll send you the most relevant one now. It tells you what to do today and when to get medical help. If it doesn't feel right for your situation, or you're not improving, contact us and we'll pass it to the GP triager. If you develop chest pain, severe breathlessness, collapse, confusion, or heavy bleeding, call 999."
  },
  healthierTogether: {
    title: 'Healthier Together (Children)',
    script: "Thanks. Because this is for a child/young person, we use NHS Healthier Together advice. I'll send you the link for the right symptom and age. Please follow the advice on the page, including the Red/Amber guidance. If you're worried or they're getting worse, let us know or use NHS 111, and call 999 for emergencies."
  },
  abortion: {
    title: 'Abortion/Termination Request',
    script: "If you are pregnant and do not wish to continue with the pregnancy, you can refer yourself for NHS-funded (free) abortion care. If you're registered with a GP in any London borough or Surrey, you can contact NUPAS on 0333 004 6666, BPAS on 0345 730 4030, or MSI on 0345 300 8090."
  },
  safetyNet: {
    title: 'Safety Net Advice',
    script: "If your symptoms get worse, or you develop any of the following: chest pain, severe breathlessness, collapse, confusion, or heavy bleeding - please call 999 immediately. If you're not improving after following this advice, please contact us again and we'll arrange for a clinician to review."
  }
};

export const pathways = {
  eye: {
    title: 'Eye Problems',
    icon: '👁️',
    routes: [
      { condition: 'Most eye problems', examples: 'Red eye, painful eye, irritation, floaters, flashes, stye, eyelid lump', action: 'Signpost to local optician for MECS (self-referral)', link: 'primaryeyecare.co.uk', priority: 'green' },
      { condition: 'Urgent eye problems', examples: 'Vision loss, shingles near eye, painful red eye + light sensitivity, contact lens + painful red eye', action: 'Royal Eye Unit: 020 8934 6799 (Mon-Fri 8:30am-4pm)', priority: 'amber' },
      { condition: 'Acute glaucoma signs', examples: 'Severe eye pain + headache + vomiting + haloes around lights', action: 'CALL 999 / A&E or Royal Eye Unit URGENT', priority: 'red' },
      { condition: 'Emergency', examples: 'Chemical splash, penetrating injury, sudden vision loss with stroke signs', action: 'CALL 999 / A&E NOW', priority: 'red' }
    ]
  },
  injury: {
    title: 'Injuries, Burns, Wounds',
    icon: '🩹',
    routes: [
      { condition: 'Minor injuries', examples: 'Cuts needing stitches, minor burns/scalds, sprains, possible fractures, bites', action: 'Richmond UTC (Teddington): Book via NHS 111 or walk in, 8am-8pm daily', priority: 'green' },
      { condition: 'Severe injuries', examples: 'Major trauma, heavy bleeding, head injury with confusion, open fractures', action: 'CALL 999 / A&E NOW', priority: 'red' }
    ]
  },
  pregnancy: {
    title: 'Pregnancy',
    icon: '🤰',
    routes: [
      { condition: 'New pregnancy - booking', examples: 'Just found out pregnant, need to register', action: 'Self-refer via Kingston Maternity online form', link: 'kingstonmaternity.org.uk', priority: 'green' },
      { condition: 'Pregnancy >18 weeks with concerns', examples: 'Reduced movements, bleeding, waters breaking, contractions, severe headache/vision', action: 'Maternity Helpline (24/7): 0208 934 2802', priority: 'amber' },
      { condition: 'Pregnancy <18 weeks with pain/bleeding', examples: 'Abdominal pain, vaginal bleeding, unable to keep fluids down', action: 'GP Triager / Same Day', priority: 'amber' },
      { condition: 'Pregnancy <12 weeks + one-sided pain + shoulder tip pain', examples: 'Possible ectopic pregnancy', action: 'CALL 999 / A&E NOW', priority: 'red' }
    ]
  },
  sexualHealth: {
    title: 'Sexual Health & Contraception',
    icon: '💊',
    routes: [
      { condition: 'Contraception (all types)', examples: 'Pills, patches, injections, implants, coils, emergency contraception', action: 'Wolverton Centre (self-referral): 0208 974 9331', link: 'sexualhealthkingston.co.uk', priority: 'green' },
      { condition: 'STI testing/treatment', examples: 'Discharge, itching, sores, partner notification', action: 'Wolverton Centre (self-referral): 0208 974 9331', priority: 'green' },
      { condition: 'Severe pelvic pain', examples: 'With fever, fainting, heavy bleeding', action: 'GP Triager or 999 if severe', priority: 'amber' }
    ]
  },
  fitNote: {
    title: 'Fit Notes (MED3)',
    icon: '📝',
    routes: [
      { condition: 'NEW fit note - previously discussed with GP', examples: 'Check EMIS: GP appointment or hospital letter about the issue exists', action: 'GP Triager to issue', priority: 'green' },
      { condition: 'NEW fit note - NOT previously discussed', examples: 'No record of the issue being assessed', action: 'Needs GP appointment first', priority: 'amber' },
      { condition: 'RENEWAL - no follow-up due', examples: 'Check EMIS: no review planned, same condition', action: 'GP Triager to issue', priority: 'green' },
      { condition: 'RENEWAL - follow-up due', examples: 'Check EMIS: review was planned or condition worsening', action: 'Book GP follow-up, then fit note', priority: 'amber' }
    ]
  },
  mentalHealth: {
    title: 'Mental Health',
    icon: '🧠',
    routes: [
      { condition: 'Low mood, anxiety, stress', examples: 'Ongoing symptoms affecting daily life, wants support', action: 'Kingston Talking Therapies (self-referral online)', link: 'swlstg.nhs.uk/kingston-talking-therapies', priority: 'green' },
      { condition: 'Worsening mental health / crisis', examples: 'Suicidal thoughts, self-harm urges, severe distress', action: 'GP Triager + Crisis Line: 0800 028 8000 (CAMHS: 0203 228 5980)', priority: 'amber' },
      { condition: 'Immediate danger', examples: 'Suicide attempt now, harming self/others now', action: 'CALL 999', priority: 'red' }
    ]
  }
};

export const trainingScenarios = [
  // === TIER 1: BASIC RECOGNITION ===
  { id: 1, category: 'Red Flags', scenario: "A 45-year-old man calls saying he has had a sore throat for 3 days. He is otherwise well, no other symptoms, no medical conditions.", correctAnswer: 'pharmacy-first', explanation: 'Straightforward sore throat suitable for Pharmacy First (Step 6). Adult with no red flags, short duration, no high-risk factors. Safety gate checks all pass.', options: [{ id: '999', text: 'Call 999' }, { id: 'tier2', text: 'Forward to Tier 2' }, { id: 'pharmacy-first', text: 'Pharmacy First' }, { id: 'calmcare', text: 'CalmCare self-care' }] },
  { id: 2, category: 'High-Risk Groups', scenario: "A woman calls about her 8-month-old baby who has had a runny nose and cough for 2 days. No fever, feeding normally, no breathing difficulty.", correctAnswer: 'tier2', explanation: 'Babies under 1 year are a HIGH-RISK group (Step 4). Forward to Tier 2 with HIGH RISK flag — do NOT use self-care or Pharmacy First, even for seemingly minor symptoms.', options: [{ id: '999', text: 'Call 999' }, { id: 'tier2', text: 'Forward to Tier 2 (HIGH RISK)' }, { id: 'pharmacy-first', text: 'Pharmacy First' }, { id: 'healthier-together', text: 'Healthier Together self-care' }] },
  { id: 3, category: 'Red Flags', scenario: "A 67-year-old man with diabetes calls saying he has chest tightness and feels sweaty. It started 30 minutes ago.", correctAnswer: '999', explanation: 'Chest tightness + sweating = possible heart attack. This is a RED FLAG (Step 1) — call 999 immediately, do NOT delay. Do not forward to Tier 2.', options: [{ id: '999', text: 'Call 999' }, { id: 'tier2', text: 'Forward to Tier 2' }, { id: 'pharmacy-first', text: 'Pharmacy First' }, { id: 'book-ecg', text: 'Book an ECG' }] },
  { id: 4, category: 'Specific Pathways', scenario: "A woman who is 24 weeks pregnant calls saying she hasn't felt the baby move since yesterday morning.", correctAnswer: 'maternity', explanation: 'Reduced fetal movements in pregnancy >18 weeks = specific external pathway (Step 5). Direct to Maternity Helpline (0208 934 2802), not Tier 2 or GP.', options: [{ id: '999', text: 'Call 999' }, { id: 'maternity', text: 'Maternity Helpline' }, { id: 'tier2', text: 'Forward to Tier 2' }, { id: 'book-midwife', text: 'Book midwife appointment' }] },
  { id: 5, category: 'High-Risk Groups', scenario: "A 35-year-old woman on chemotherapy for breast cancer calls with a temperature of 38.2°C and feeling unwell.", correctAnswer: 'tier2', explanation: 'Immunosuppressed patient (chemotherapy) with fever = HIGH-RISK group (Step 4). Forward to Tier 2 immediately with HIGH RISK flag. Tier 2 will escalate to Tier 3 GP Triager. May need 999/A&E.', options: [{ id: '999', text: 'Call 999' }, { id: 'tier2', text: 'Forward to Tier 2 (HIGH RISK)' }, { id: 'pharmacy-first', text: 'Pharmacy First' }, { id: 'calmcare', text: 'CalmCare self-care' }] },
  { id: 6, category: 'EMIS & Direct Booking', scenario: "A patient's notes show a task from 2 weeks ago: 'Book diabetes annual review — bloods + foot check due'. The patient calls to book this.", correctAnswer: 'direct-book', explanation: 'EMIS check (Step 2) shows a clear planned item. This is option C in Step 3: PLANNED or DUE item found in EMIS. Book directly with chronic disease nurse — no need to forward to Tier 2.', options: [{ id: 'tier2', text: 'Forward to Tier 2' }, { id: 'direct-book', text: 'Book directly (bloods + nurse review)' }, { id: 'ask-clinician', text: 'Ask a clinician first' }, { id: 'pharmacy-first', text: 'Pharmacy First' }] },
  { id: 7, category: 'Tier 2 Escalation', scenario: "A 52-year-old man calls saying he's found a new lump in his neck. It's been there about 2 weeks and is getting bigger.", correctAnswer: 'tier2', explanation: 'New lump = a possible cancer indicator. This is a NEW problem (Step 3D) that does not fit self-care or specific pathways. Forward to Tier 2 at Step 7 — Tier 2 will escalate to Tier 3 for urgent 2WW cancer referral (NICE NG12).', options: [{ id: '999', text: 'Call 999' }, { id: 'tier2', text: 'Forward to Tier 2' }, { id: 'pharmacy-first', text: 'Pharmacy First' }, { id: 'routine-gp', text: 'Book routine GP appointment' }] },
  { id: 8, category: 'Specific Pathways', scenario: "A 25-year-old woman calls wanting emergency contraception after unprotected sex last night.", correctAnswer: 'signpost', explanation: 'Emergency contraception = specific external pathway (Step 5: Sexual Health). Signpost to pharmacy (over the counter) or Wolverton Centre. No need to forward to Tier 2.', options: [{ id: 'tier2', text: 'Forward to Tier 2' }, { id: 'signpost', text: 'Signpost to pharmacy or Wolverton Centre' }, { id: 'book-gp', text: 'Book GP appointment' }, { id: 'utc', text: 'Send to UTC' }] },
  { id: 9, category: 'Tier 2 Escalation', scenario: "A 70-year-old woman calls with a new headache over her right temple for the past week. She says her jaw aches when she chews and her scalp is tender.", correctAnswer: 'tier2-urgent', explanation: 'New headache in >50 + jaw claudication + scalp tenderness = amber buzzwords. Forward to Tier 2 flagging URGENT. Tier 2 will book same-day duty GP for suspected temporal arteritis/GCA (NICE NG244).', options: [{ id: '999', text: 'Call 999' }, { id: 'tier2-urgent', text: 'Forward to Tier 2 (flag URGENT)' }, { id: 'pharmacy-first', text: 'Pharmacy First for painkillers' }, { id: 'calmcare', text: 'CalmCare self-care' }] },
  { id: 10, category: 'Tier 2 Escalation', scenario: "A 40-year-old man calls saying his left calf has been swollen and painful for 2 days. He had knee surgery 3 weeks ago.", correctAnswer: 'tier2-urgent', explanation: 'Unilateral calf swelling + recent surgery = amber buzzwords (DVT). Forward to Tier 2 flagging URGENT. Tier 2 will book same-day for Wells score assessment (NICE NG158).', options: [{ id: '999', text: 'Call 999' }, { id: 'tier2-urgent', text: 'Forward to Tier 2 (flag URGENT)' }, { id: 'pharmacy-first', text: 'Pharmacy First' }, { id: 'calmcare', text: 'CalmCare self-care' }] },
  { id: 11, category: 'Red Flags', scenario: "A parent calls about their 2-year-old who has a high temperature, is floppy, and has some spots on their tummy that don't fade when pressed with a glass.", correctAnswer: '999', explanation: 'Child with fever + non-blanching rash (glass test positive) = suspected meningitis/meningococcal disease (NICE NG240). RED FLAG (Step 1) — CALL 999 IMMEDIATELY.', options: [{ id: '999', text: 'Call 999 NOW' }, { id: 'tier2', text: 'Forward to Tier 2' }, { id: 'utc', text: 'Send to UTC' }, { id: 'healthier-together', text: 'Healthier Together' }] },
  { id: 12, category: 'Red Flags', scenario: "A 55-year-old woman with breast cancer on chemotherapy calls saying she has new severe back pain and her legs feel weak and tingly since yesterday.", correctAnswer: '999', explanation: 'Known cancer + new back pain + leg weakness/tingling = possible malignant spinal cord compression (MSCC). RED FLAG (Step 1) — CALL 999. Delay risks permanent paralysis.', options: [{ id: '999', text: 'Call 999 NOW' }, { id: 'tier2', text: 'Forward to Tier 2' }, { id: 'book-gp', text: 'Book routine GP' }, { id: 'calmcare', text: 'CalmCare for back pain' }] },

  // === HEE-STYLE CARE NAVIGATION SCENARIOS ===
  // Based on Health Education England Care Navigation Competency Framework
  { id: 13, category: 'EMIS Check', scenario: "ANIMA request: 'Patient says their knee has been hurting for a week.' You check EMIS and find the GP saw them 10 days ago for knee pain and wrote: 'Likely strain. Review in 2 weeks if not better. Ibuprofen gel.' What do you do?", correctAnswer: 'direct-book', explanation: 'EMIS check (Step 2) reveals this is ONGOING with a GP plan (Step 3A). The GP already reviewed, there is a follow-up plan, and the timeframe matches. Direct book the review — no need to forward to Tier 2.', options: [{ id: 'tier2', text: 'Forward to Tier 2' }, { id: 'direct-book', text: 'Book GP review (follow-up plan in EMIS)' }, { id: 'pharmacy-first', text: 'Pharmacy First for painkillers' }, { id: 'calmcare', text: 'CalmCare for knee pain' }] },
  { id: 14, category: 'New vs Ongoing', scenario: "ANIMA request: 'Patient says back pain is getting worse and painkillers aren't working anymore.' EMIS shows GP saw them 3 weeks ago for same back pain, plan was: 'Paracetamol + exercises. Review if worsening.' What step do you take?", correctAnswer: 'tier2-worsened', explanation: 'This is Step 3B: ONGOING but WORSENED. The words "getting worse" and "not working" are change words. Even though a GP reviewed before, the condition has changed. Check Step 4 (high-risk) then forward to Tier 2 with worsening flag.', options: [{ id: 'direct-book', text: 'Book GP review (plan said review)' }, { id: 'tier2-worsened', text: 'Forward to Tier 2 (worsened/changed)' }, { id: 'pharmacy-first', text: 'Pharmacy First for stronger painkillers' }, { id: 'calmcare', text: 'CalmCare self-care' }] },
  { id: 15, category: 'New vs Ongoing', scenario: "ANIMA request: 'Patient has earache since yesterday.' You check EMIS: no record of ear problems, no recent consultations about this. No high-risk flags. What is your Tier 1 action?", correctAnswer: 'pharmacy-first', explanation: 'EMIS check shows this is NEW (Step 3D). Continue through steps: not high-risk (Step 4), no specific pathway (Step 5), and earache is a Pharmacy First condition (Step 6). Single symptom, short duration, meets all safety gate criteria.', options: [{ id: 'tier2', text: 'Forward to Tier 2 (new problem)' }, { id: 'pharmacy-first', text: 'Pharmacy First (earache)' }, { id: 'direct-book', text: 'Book GP appointment' }, { id: 'calmcare', text: 'CalmCare self-care' }] },
  { id: 16, category: 'Three-Tier Model', scenario: "A 30-year-old patient messages via ANIMA: 'I've had a headache, stomach pain, and feeling dizzy for 3 days. Nothing is helping.' No significant EMIS history. What do you do?", correctAnswer: 'tier2', explanation: 'Multiple symptoms (headache + stomach pain + dizziness) means you cannot match to ONE self-care pathway. The safety gate at Step 6 fails ("Minor SINGLE symptom" — not met). Forward to Tier 2 at Step 7.', options: [{ id: 'pharmacy-first', text: 'Pharmacy First for headache' }, { id: 'calmcare', text: 'CalmCare self-care' }, { id: 'tier2', text: 'Forward to Tier 2' }, { id: '999', text: 'Call 999' }] },
  { id: 17, category: 'EMIS Check', scenario: "A patient calls asking for a blood test. You check EMIS and find a GP note from last week: 'Check HbA1c in 3 months.' It has been 1 week since the note. What do you do?", correctAnswer: 'explain-timing', explanation: 'EMIS shows a planned item (Step 3C) but the timing is wrong — the GP said 3 months, and it has only been 1 week. Explain the GP requested this in 3 months and offer to note their call. Do not book early unless the patient insists, in which case forward to Tier 2.', options: [{ id: 'direct-book', text: 'Book the blood test now' }, { id: 'tier2', text: 'Forward to Tier 2' }, { id: 'explain-timing', text: 'Explain it is due in 3 months, not yet' }, { id: 'ignore', text: 'Tell them to call back later' }] },
  { id: 18, category: 'Signposting', scenario: "A 42-year-old man calls saying he has had a red, painful eye for 2 days. No vision loss, no trauma, no contact lenses. He is otherwise well.", correctAnswer: 'optician', explanation: 'Red eye without vision loss or red flags = specific external pathway (Step 5: Eye). Signpost to local optician for MECS (Minor Eye Conditions Service — self-referral). This is faster than GP and is the correct Tier 1 pathway.', options: [{ id: 'tier2', text: 'Forward to Tier 2' }, { id: 'optician', text: 'Signpost to optician (MECS)' }, { id: 'eye-unit', text: 'Royal Eye Unit' }, { id: 'pharmacy-first', text: 'Pharmacy First for eye drops' }] },
  { id: 19, category: 'Three-Tier Model', scenario: "A patient says: 'I want to see a GP about my anxiety. I've been feeling really low for months.' You check EMIS: no recent mental health consultations. What is the best Tier 1 action?", correctAnswer: 'talking-therapies', explanation: 'Low mood + anxiety with no acute risk = specific pathway (Step 5: Mental Health). Kingston Talking Therapies offers self-referral — this is faster than GP and is the correct signposting. If the patient mentions suicidal thoughts, escalate immediately.', options: [{ id: 'tier2', text: 'Forward to Tier 2' }, { id: 'talking-therapies', text: 'Signpost to Talking Therapies (self-referral)' }, { id: 'book-gp', text: 'Book routine GP appointment' }, { id: 'crisis-line', text: 'Crisis line (0800 028 8000)' }] },
  { id: 20, category: 'Safety Netting', scenario: "You are sending a patient a CalmCare self-care leaflet for their cough. Which statement should you ALWAYS include?", correctAnswer: 'safety-net', explanation: 'ALWAYS safety net (Step 6 rule). Every self-care/Pharmacy First action must include: "If not improving, contact us again — we will escalate to the GP triager. If you develop chest pain, severe breathlessness, collapse, confusion, or heavy bleeding, call 999."', options: [{ id: 'its-minor', text: '"Don\'t worry, it\'s just a minor cough"' }, { id: 'safety-net', text: '"If not improving, contact us and we\'ll escalate. Call 999 for chest pain, breathlessness, collapse"' }, { id: 'no-followup', text: '"The leaflet has everything you need, no need to call back"' }, { id: 'wait-two-weeks', text: '"Give it two weeks and then see how you feel"' }] },
  { id: 21, category: 'Handover Quality', scenario: "You are forwarding a request to Tier 2. Which of these is the BEST handover message?", correctAnswer: 'full-handover', explanation: 'A complete Tier 1→Tier 2 handover must include: patient exact words, EMIS findings, NEW/ONGOING status, any red/amber keywords spotted, and contact details. This helps Tier 2 act quickly and safely without re-asking the patient.', options: [{ id: 'minimal', text: '"Patient wants GP appointment"' }, { id: 'vague', text: '"Patient unwell, please review"' }, { id: 'full-handover', text: '"Patient says: knee swelling 3 days, worse today. EMIS: no prior knee notes, diabetes on record (high-risk). NEW problem. Amber: swelling + worsening. Mobile: 07XXX"' }, { id: 'clinical', text: '"I think this might be a DVT, please arrange urgent scan"' }] },
  { id: 22, category: 'Scope of Role', scenario: "A patient asks you: 'Do you think this rash could be shingles?' What should you say?", correctAnswer: 'correct-response', explanation: 'Tier 1 NEVER diagnoses or interprets symptoms (Golden Rule). Use patient\'s exact words, do not add clinical opinion. Redirect to the appropriate pathway — if it might be shingles, that is a Pharmacy First condition for the pharmacist to assess.', options: [{ id: 'yes-shingles', text: '"Yes, that sounds like it could be shingles"' }, { id: 'no-shingles', text: '"No, I don\'t think that\'s shingles"' }, { id: 'correct-response', text: '"I can\'t say what it is, but I can help you get to the right person. Let me check a few things"' }, { id: 'google', text: '"Have you tried looking it up online?"' }] }
];

// eConsult hard stops - see detailed version above (line ~433)

// Self-care eligibility checklist - ALL must be true
export const selfCareChecklist = [
  { id: 'single', label: 'Minor SINGLE symptom' },
  { id: 'short', label: 'Short-lived (<7 days)' },
  { id: 'no-red', label: 'NO red or amber flags mentioned' },
  { id: 'no-high-risk', label: 'NOT in a high-risk group' },
  { id: 'not-severe', label: 'NOT described as "severe" or "worsening"' },
  { id: 'confident', label: "You're confident it fits a self-care resource" },
  { id: 'agrees', label: 'Patient agrees to self-care pathway' }
];
