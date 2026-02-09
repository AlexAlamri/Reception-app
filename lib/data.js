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
  { id: 'eye-unit', service: 'Royal Eye Unit (Urgent)', number: '020 8934 6799', hours: 'Mon-Fri 8:30-4:30', priority: 'normal', description: 'Urgent eye problems (appointment only)', icon: '👁️' },
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
    script: "We can refer you to your local Pharmacy First Service for further assessment & treatment, including prescription-only treatment such as antibiotics and antivirals, without waiting for a GP."
  },
  calmCare: {
    title: 'CalmCare Self-Care (Adults)',
    script: "Thanks for explaining. We have an NHS-aligned self-care card for adults called CalmCare. I'll send you the most relevant one now. It tells you what to do today and when you should get medical help. If it doesn't feel right for your situation, or you're not improving, contact us again and we'll pass it to the GP triager. If you develop chest pain, severe breathlessness, collapse, confusion, or heavy bleeding, call 999."
  },
  healthierTogether: {
    title: 'Healthier Together (Children)',
    script: "Thanks. Because this is for a child/young person, we use the NHS Healthier Together advice. I'll send you the link for the right symptom and age. Please follow the advice on the page, including the Red/Amber guidance. If you're worried or they're getting worse, please let us know if appropriate within the advice or use NHS 111, and call 999 for emergencies."
  },
  abortion: {
    title: 'Abortion/Termination Request',
    script: "If you are pregnant and do not wish to continue with the pregnancy you can refer yourself for NHS-funded (free) abortion care. If you are registered with a GP practice in any London borough or Surrey you can contact any of the following providers. NUPAS on 0333 004 6666, BPAS on 0345 730 4030, or MSI on 0345 300 8090."
  },
  safetyNet: {
    title: 'Safety Net Advice',
    script: "If not improving, or you're worried, contact us again. For chest pain, severe breathlessness, collapse, confusion, or heavy bleeding \u2192 call 999."
  },
  patientDeclined: {
    title: 'Patient Declined Self-Care',
    script: "That's absolutely fine. I'll pass your request to our triage team so a clinician can review it. If your symptoms get worse in the meantime, or you develop chest pain, severe breathlessness, collapse, confusion, or heavy bleeding, please call 999.",
    internalNote: 'Patient declined self-care, feels symptoms are more serious. Forward to Tier 2 and flag as safety signal.'
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
  { id: 1, scenario: "A 45-year-old man calls saying he has had a sore throat for 3 days. He is otherwise well, no other symptoms, no medical conditions.", correctAnswer: 'pharmacy-first', explanation: 'This is a straightforward sore throat suitable for Pharmacy First. Adult with no red flags, short duration, no high-risk factors.', options: [{ id: '999', text: 'Call 999' }, { id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'pharmacy-first', text: 'Pharmacy First' }, { id: 'calmcare', text: 'CalmCare self-care' }] },
  { id: 2, scenario: "A woman calls about her 8-month-old baby who has had a runny nose and cough for 2 days. No fever, feeding normally, no breathing difficulty.", correctAnswer: 'gp-triager', explanation: 'Babies under 1 year should go to GP Triager, not self-care, even for minor symptoms. This is a high-risk group.', options: [{ id: '999', text: 'Call 999' }, { id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'pharmacy-first', text: 'Pharmacy First' }, { id: 'healthier-together', text: 'Healthier Together self-care' }] },
  { id: 3, scenario: "A 67-year-old man with diabetes calls saying he has chest tightness and feels sweaty. It started 30 minutes ago.", correctAnswer: '999', explanation: 'Chest tightness + sweating = possible heart attack. This is a RED flag - call 999 immediately, do NOT delay.', options: [{ id: '999', text: 'Call 999' }, { id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'pharmacy-first', text: 'Pharmacy First' }, { id: 'book-ecg', text: 'Book an ECG' }] },
  { id: 4, scenario: "A woman who is 24 weeks pregnant calls saying she hasn't felt the baby move since yesterday morning.", correctAnswer: 'maternity', explanation: 'Reduced fetal movements in pregnancy >18 weeks should be directed to Maternity Helpline (0208 934 2802), not GP.', options: [{ id: '999', text: 'Call 999' }, { id: 'maternity', text: 'Maternity Helpline' }, { id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'book-midwife', text: 'Book midwife appointment' }] },
  { id: 5, scenario: "A 35-year-old woman on chemotherapy for breast cancer calls with a temperature of 38.2°C and feeling unwell.", correctAnswer: 'gp-triager', explanation: 'Immunosuppressed patient (chemotherapy) with fever = potential neutropenic sepsis. Needs URGENT GP Triager review - do NOT use Pharmacy First. May need 999/A&E.', options: [{ id: '999', text: 'Call 999' }, { id: 'gp-triager', text: 'Send to GP Triager (urgent)' }, { id: 'pharmacy-first', text: 'Pharmacy First' }, { id: 'calmcare', text: 'CalmCare self-care' }] },
  { id: 6, scenario: "A patient's notes show a task from 2 weeks ago: 'Book diabetes annual review - bloods + foot check due'. The patient calls to book this.", correctAnswer: 'direct-book', explanation: 'This is clearly planned and due in EMIS. Book directly with the chronic disease nurse - no need for GP Triager.', options: [{ id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'direct-book', text: 'Book directly (bloods + nurse review)' }, { id: 'ask-clinician', text: 'Ask a clinician first' }, { id: 'pharmacy-first', text: 'Pharmacy First' }] },
  { id: 7, scenario: "A 52-year-old man calls saying he's found a new lump in his neck. It's been there about 2 weeks and is getting bigger.", correctAnswer: 'gp-triager', explanation: 'New lump is a possible cancer red flag (NICE NG12). Must go to GP Triager for urgent assessment and potential 2WW referral - do not book routine or signpost to self-care.', options: [{ id: '999', text: 'Call 999' }, { id: 'gp-triager', text: 'Send to GP Triager (urgent)' }, { id: 'pharmacy-first', text: 'Pharmacy First' }, { id: 'routine-gp', text: 'Book routine GP appointment' }] },
  { id: 8, scenario: "A 25-year-old woman calls wanting emergency contraception after unprotected sex last night.", correctAnswer: 'signpost', explanation: 'Emergency contraception can be obtained from pharmacy (over the counter) or Wolverton Centre. No GP appointment needed.', options: [{ id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'signpost', text: 'Signpost to pharmacy or Wolverton Centre' }, { id: 'book-gp', text: 'Book GP appointment' }, { id: 'utc', text: 'Send to UTC' }] },
  { id: 9, scenario: "A 70-year-old woman calls with a new headache over her right temple for the past week. She says her jaw aches when she chews and her scalp is tender.", correctAnswer: 'gp-triager-urgent', explanation: 'New headache in >50 year old + jaw claudication + scalp tenderness = suspected temporal arteritis/GCA. Needs URGENT same-day GP Triager - risk of permanent vision loss if untreated.', options: [{ id: '999', text: 'Call 999' }, { id: 'gp-triager-urgent', text: 'Send to GP Triager (URGENT same-day)' }, { id: 'pharmacy-first', text: 'Pharmacy First for painkillers' }, { id: 'calmcare', text: 'CalmCare self-care' }] },
  { id: 10, scenario: "A 40-year-old man calls saying his left calf has been swollen and painful for 2 days. He had knee surgery 3 weeks ago.", correctAnswer: 'gp-triager-urgent', explanation: 'Unilateral calf swelling + recent surgery = suspected DVT (NICE NG158). Needs URGENT same-day GP Triager for Wells score assessment. Do NOT use self-care.', options: [{ id: '999', text: 'Call 999' }, { id: 'gp-triager-urgent', text: 'Send to GP Triager (URGENT same-day)' }, { id: 'pharmacy-first', text: 'Pharmacy First' }, { id: 'calmcare', text: 'CalmCare self-care' }] },
  { id: 11, scenario: "A man calls about his 76-year-old wife who has had chest pain since 3am. He says she's had this before and doesn't want to go to hospital.", correctAnswer: '999', explanation: "Chest pain since 3am = RED flag regardless of history. Call 999. If she declines, escalate to Tier 2 & Duty GP with comment 'declined 999/A&E'. Never delay emergency care because a patient is reluctant.", options: [{ id: '999', text: 'Call 999' }, { id: 'same-day-gp', text: 'Book same-day GP' }, { id: 'nhs111', text: 'Advise NHS 111' }, { id: 'gp-triager', text: 'Send to GP Triager' }] },
  { id: 12, scenario: "Mrs B has asthma and doesn't usually bother the GP. She phones because she woke up very short of breath, is struggling, frightened, and asking to see a doctor immediately.", correctAnswer: '999', explanation: 'This is unusual for her asthma. She is struggling, frightened, and can barely talk \u2014 listen for broken speech. These are RED flags for severe breathing difficulty. Call 999 immediately.', options: [{ id: '999', text: 'Call 999' }, { id: 'same-day-gp', text: 'Book same-day GP' }, { id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'calmcare', text: 'CalmCare asthma card' }] },
  { id: 13, scenario: "Patient calls: 'My husband has had the worst headache of his life, it came on suddenly 20 minutes ago, and his neck feels stiff.'", correctAnswer: '999', explanation: 'Sudden worst-ever headache + neck stiffness = possible subarachnoid haemorrhage. RED flag. Call 999 immediately.', options: [{ id: '999', text: 'Call 999' }, { id: 'same-day-gp', text: 'Book same-day GP' }, { id: 'calmcare', text: 'CalmCare headache card' }, { id: 'paracetamol', text: 'Advise paracetamol and call back' }] },
  { id: 14, scenario: "Parent calls about their 3-year-old with a temperature and a rash that doesn't fade when they press a glass on it.", correctAnswer: '999', explanation: 'Non-blanching rash in a child = possible meningitis/sepsis. RED flag. Call 999 immediately. Under 5 is also a high-risk group.', options: [{ id: '999', text: 'Call 999' }, { id: 'same-day-gp', text: 'Book same-day GP' }, { id: 'healthier-together', text: 'Healthier Together' }, { id: 'pharmacy-first', text: 'Pharmacy First' }] },
  { id: 15, scenario: "Patient says: 'I need my blood test done, the doctor told me to come back in 2 weeks for bloods.'", correctAnswer: 'direct-book', explanation: 'Check EMIS \u2014 this is a planned follow-up with a documented plan. Direct-book with phlebotomy/HCA. No triage needed.', options: [{ id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'direct-book', text: 'Direct-book bloods' }, { id: 'econsult', text: 'Ask them to submit eConsult' }, { id: 'pharmacy-first', text: 'Pharmacy First' }] },
  { id: 16, scenario: "Patient: 'I've had this cough for 3 weeks now and I've noticed some blood when I cough.'", correctAnswer: 'gp-triager', explanation: 'Coughing blood = amber flag for same-day review. But >3 weeks + haemoptysis = possible cancer red flag (NICE NG12). Must go to Tier 3 GP Triager for 2WW assessment.', options: [{ id: '999', text: 'Call 999' }, { id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'pharmacy-first', text: 'Pharmacy First' }, { id: 'calmcare', text: 'CalmCare cough card' }] },
  { id: 17, scenario: "Patient: 'I need a repeat of my contraceptive pill prescription.'", correctAnswer: 'external-pathway', explanation: 'Contraception \u2192 Wolverton Centre (self-referral) or practice contraception clinic. This is a Quick-Match Pathway, not a GP appointment.', options: [{ id: 'book-gp', text: 'Book GP appointment' }, { id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'external-pathway', text: 'Direct to Wolverton Centre' }, { id: 'pharmacy-first', text: 'Pharmacy First' }] },
  { id: 18, scenario: "Parent calls: 'My 5-year-old has had earache for 2 days, no fever, otherwise well.'", correctAnswer: 'pharmacy-first', explanation: 'Earache age 1-17 = Acute Otitis Media pathway. Pharmacy First eligible. No red flags, no high-risk factors, short duration.', options: [{ id: '999', text: 'Call 999' }, { id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'pharmacy-first', text: 'Pharmacy First' }, { id: 'healthier-together', text: 'Healthier Together' }] },
  { id: 19, scenario: "Patient on chemotherapy calls: 'I've got a sore throat and I'm feeling shivery and unwell.'", correctAnswer: 'gp-triager', explanation: "Patient on chemotherapy = immunosuppressed = HIGH RISK group. Sore throat + shivering = possible neutropenic sepsis. Do NOT use Pharmacy First. Forward to Tier 2 with HIGH RISK flag \u2192 immediate escalation to Tier 3/Duty GP.", options: [{ id: 'pharmacy-first', text: 'Pharmacy First' }, { id: 'calmcare', text: 'CalmCare sore throat' }, { id: 'gp-triager', text: 'Send to GP Triager (HIGH RISK)' }, { id: 'routine-gp', text: 'Book routine GP' }] },
  { id: 20, scenario: "Patient: 'I can't pee at all and my stomach is really painful and swollen.'", correctAnswer: '999', explanation: 'Cannot pass urine + severe abdominal pain = acute urinary retention. This is a RED flag in SOP v3.0. Call 999 / advise A&E now.', options: [{ id: '999', text: 'Call 999' }, { id: 'same-day-gp', text: 'Book same-day GP' }, { id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'drink-water', text: 'Advise drink more water' }] },
  { id: 21, scenario: "A patient calls requesting a fit note renewal. Their current fit note expires in 4 days and EMIS shows a GP reviewed their condition 2 weeks ago.", correctAnswer: 'tier2', explanation: 'Fit note renewal within 7 days of expiry + previously discussed + documented in EMIS \u2192 Forward to Tier 2 for processing. Tier 2 can handle this with existing GP sign-off.', options: [{ id: 'book-gp', text: 'Book GP appointment' }, { id: 'tier2', text: 'Forward to Tier 2' }, { id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'advise-wait', text: 'Advise patient to wait until expiry' }] }
];

export const trainingTopics = {
  'Red Flag Recognition': [1, 3, 11, 12, 13, 14, 20],
  'EMIS & Direct Booking': [4, 15],
  'Pharmacy First & Self-Care': [5, 6, 18],
  'High-Risk Patients': [2, 8, 19],
  'Pathways & Signposting': [9, 10, 17],
  'Amber Flags & GP Triager': [7, 16],
  'Fit Notes': [21],
  'Patient Declines': [11]
};

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

export const quickMatchPathways = [
  {
    pathway: 'Eye',
    symptoms: 'Red eye, painful eye, floaters, flashes, stye',
    action: 'CUES via local optician (self-refer)',
    contact: 'primaryeyecare.co.uk',
    keywords: [
      'red eye', 'painful eye', 'sore eye', 'floaters', 'flashes', 'stye',
      'eye irritation', 'itchy eye', 'watery eye', 'gritty eye', 'dry eye',
      'eyelid lump', 'eyelid swollen', 'swollen eyelid', 'conjunctivitis', 'pink eye',
      'foreign body eye', 'something in eye', 'eye discharge', 'eye problem',
      'blurry eye', 'mecs', 'optician', 'eye infection'
    ]
  },
  {
    pathway: 'Eye (urgent)',
    symptoms: 'Vision loss, shingles near eye, contact lens + pain',
    action: 'Royal Eye Unit',
    contact: '020 8934 6799',
    keywords: [
      'vision loss', 'losing sight', 'can\'t see', 'blurred vision sudden',
      'shingles eye', 'shingles near eye', 'shingles forehead',
      'contact lens pain', 'contact lens red eye', 'contact lens infection',
      'light sensitivity eye', 'photophobia', 'double vision', 'distorted vision',
      'partial vision loss', 'visual disturbance', 'painful red eye',
      'sudden blurred vision', 'flashes and floaters'
    ]
  },
  {
    pathway: 'Eye (999)',
    symptoms: 'Chemical splash, penetrating injury, acute glaucoma, sudden vision loss + stroke',
    action: 'CALL 999 / A&E NOW',
    contact: '',
    keywords: [
      'chemical splash eye', 'chemical in eye', 'bleach in eye', 'acid in eye',
      'alkali in eye', 'penetrating eye injury', 'object stuck in eye',
      'acute glaucoma', 'severe eye pain headache', 'eye pain vomiting',
      'haloes around lights', 'sudden vision loss', 'sudden blindness',
      'eye trauma', 'eye puncture', 'eye laceration',
      'vision loss stroke', 'can\'t see stroke'
    ]
  },
  {
    pathway: 'Injury/Burn',
    symptoms: 'Cuts needing stitches, minor burns, sprains, possible fracture',
    action: 'Richmond UTC Teddington',
    contact: 'Book via NHS 111',
    keywords: [
      'cut', 'cuts needing stitches', 'laceration', 'wound', 'deep cut',
      'burn', 'minor burn', 'scald', 'scalded', 'burned',
      'sprain', 'sprained ankle', 'twisted ankle', 'twisted knee',
      'fracture', 'possible fracture', 'broken bone', 'broken finger', 'broken toe',
      'broken wrist', 'broken arm', 'injury', 'hurt', 'fall', 'fell',
      'bite', 'dog bite', 'cat bite', 'animal bite',
      'bruise', 'swollen ankle', 'swollen wrist', 'minor injury',
      'bump', 'knocked', 'bashed'
    ]
  },
  {
    pathway: 'Pregnancy (booking)',
    symptoms: 'New pregnancy, want to register',
    action: 'Self-refer Kingston Maternity online',
    contact: 'kingstonmaternity.org.uk/pregnancy/referral-form',
    keywords: [
      'new pregnancy', 'just found out pregnant', 'pregnancy booking',
      'register pregnancy', 'pregnant want to register', 'early pregnancy',
      'positive pregnancy test', 'just pregnant', 'newly pregnant',
      'want to book midwife', 'first pregnancy appointment', 'antenatal booking',
      'pregnancy registration', 'pregnant need midwife', 'found out pregnant'
    ]
  },
  {
    pathway: 'Pregnancy (>18wk urgent)',
    symptoms: 'Reduced movements, bleeding, waters, contractions, severe pain/headache',
    action: 'Maternity Helpline first',
    contact: '0208 934 2802 (24/7)',
    keywords: [
      'reduced movements', 'baby not moving', 'reduced fetal movements',
      'waters breaking', 'waters broken', 'waters leaking',
      'contractions', 'labour', 'labor', 'in labour',
      'pregnant bleeding', 'bleeding pregnant', 'antepartum haemorrhage',
      'pregnant headache', 'pregnant severe headache', 'pregnant vision problems',
      'pregnant swollen', 'pre-eclampsia', 'preeclampsia',
      'pregnant severe pain', 'pregnant abdominal pain',
      'pregnant very unwell', 'pregnant high blood pressure'
    ]
  },
  {
    pathway: 'Pregnancy (<18wk concern)',
    symptoms: 'Pain, bleeding, vomiting, unable to keep fluids',
    action: 'Duty GP / Same day',
    contact: '',
    keywords: [
      'early pregnancy pain', 'pregnant pain', 'early pregnancy bleeding',
      'pregnant bleeding early', 'pregnant vomiting', 'pregnant can\'t keep fluids',
      'morning sickness severe', 'hyperemesis', 'hyperemesis gravidarum',
      'pregnancy nausea severe', 'miscarriage', 'possible miscarriage',
      'bleeding first trimester', 'spotting pregnant', 'cramping pregnant',
      'pregnant dehydrated', 'pregnancy pain under 18 weeks'
    ]
  },
  {
    pathway: 'Sexual Health',
    symptoms: 'Contraception, STI, genital symptoms, discharge',
    action: 'Wolverton Centre (self-referral)',
    contact: '0208 974 9331',
    keywords: [
      'contraception', 'contraceptive', 'pill', 'coil', 'implant',
      'injection contraceptive', 'depo', 'patch', 'iud', 'ius', 'mirena',
      'emergency contraception', 'morning after pill', 'plan b',
      'sti', 'sti test', 'sti testing', 'std', 'sexually transmitted',
      'sexual health', 'genital symptoms', 'discharge', 'genital discharge',
      'itching genital', 'genital itching', 'genital sores', 'genital warts',
      'chlamydia', 'gonorrhoea', 'herpes', 'syphilis',
      'condom', 'unprotected sex', 'sexual health check',
      'painful sex', 'partner notification'
    ]
  },
  {
    pathway: 'Mental Health (mild-moderate)',
    symptoms: 'Low mood, anxiety, stress, ongoing symptoms',
    action: 'Kingston Talking Therapies (self-refer)',
    contact: 'swlstg.nhs.uk/kingston-talking-therapies',
    keywords: [
      'low mood', 'anxiety', 'anxious', 'stress', 'stressed',
      'depression', 'depressed', 'feeling down', 'feeling low',
      'can\'t cope', 'struggling to cope', 'overwhelmed',
      'panic attacks', 'panic', 'worried all the time', 'worrying',
      'mental health', 'mental health support', 'counselling', 'therapy',
      'talking therapy', 'cbt', 'sleep problems anxiety', 'insomnia stress',
      'burnout', 'emotional', 'tearful', 'mood swings',
      'phobia', 'ocd', 'ptsd', 'bereavement', 'grief'
    ]
  },
  {
    pathway: 'Mental Health (crisis)',
    symptoms: 'Suicidal thoughts, self-harm urges, severe distress',
    action: 'GP Triager + Crisis Line',
    contact: '0800 028 8000 / CAMHS: 0203 228 5980',
    keywords: [
      'suicidal thoughts', 'suicidal', 'want to die', 'going to kill myself',
      'self-harm', 'self harm', 'cutting self', 'harming self',
      'self-harm urges', 'severe distress', 'crisis', 'mental health crisis',
      'can\'t go on', 'end it all', 'no reason to live', 'life not worth living',
      'overdose', 'taken pills', 'voices telling', 'hearing voices',
      'psychotic', 'psychosis', 'severe agitation', 'manic',
      'not safe', 'danger to self', 'danger to others'
    ]
  },
  {
    pathway: 'Abortion',
    symptoms: 'Wants to end pregnancy, termination',
    action: 'Self-referral to provider',
    contact: 'NUPAS 0333 004 6666 / BPAS 0345 730 4030 / MSI 0345 300 8090',
    keywords: [
      'abortion', 'termination', 'terminate pregnancy', 'end pregnancy',
      'don\'t want baby', 'unwanted pregnancy', 'termination of pregnancy',
      'want to end pregnancy', 'pregnancy termination', 'not keeping baby',
      'abortion services', 'nupas', 'bpas', 'msi',
      'pregnancy options', 'don\'t want to be pregnant'
    ]
  },
  {
    pathway: 'Fit Note (new)',
    symptoms: 'First fit note, not yet seen by GP',
    action: 'Check EMIS → GP Triager if discussed, GP appointment if not',
    contact: '',
    keywords: [
      'fit note', 'sick note', 'fit note new', 'new fit note',
      'medical certificate', 'can\'t work', 'off work', 'off sick',
      'need fit note', 'need sick note', 'med3', 'med 3',
      'work certificate', 'doctor\'s note', 'doctors note',
      'statement of fitness', 'unfit for work', 'not fit for work',
      'employer needs note', 'employer wants note', 'first fit note'
    ]
  },
  {
    pathway: 'Fit Note (renewal)',
    symptoms: 'Extending existing fit note',
    action: 'Check EMIS expiry → Tier 2 if within 7 days + documented',
    contact: '',
    keywords: [
      'fit note renewal', 'renew fit note', 'extend fit note',
      'fit note extension', 'fit note expired', 'fit note expiring',
      'sick note renewal', 'renew sick note', 'extend sick note',
      'fit note running out', 'fit note ending', 'another fit note',
      'continuation fit note', 'still off work', 'still off sick',
      'same condition fit note', 'ongoing fit note', 'fit note follow up'
    ]
  }
];

export const tier2Actions = {
  timeLimits: [
    { id: 'amber', rule: 'Amber flags: action within 1 hour of receipt. If cannot action \u2192 escalate to Tier 3 immediately.' },
    { id: 'standard', rule: 'All other requests: action within 2 hours of receipt.' },
    { id: 'end-of-day', rule: 'End of day: Any request not resolved by end of working day auto-escalates to GP Triager.' },
    { id: 'out-of-hours', rule: 'Out of hours: If Tier 2 not staffed, all Tier 1 requests go directly to GP Triager / duty clinician.' }
  ],
  canDo: [
    { id: 'book-amber', action: 'Book same-day with duty GP/on-call for CLEAR amber flag matches (per Section 9B table)' },
    { id: 'book-routine', action: 'Book routine follow-up where EMIS plan is clear but Reception wasn\'t confident' },
    { id: 'admin-fitnote', action: 'Process fit note renewal with existing GP sign-off (recent GP review documented, within 7 days of expiry)' },
    { id: 'admin-results', action: 'Process results queries where GP has already commented' },
    { id: 'admin-referral', action: 'Referral chasing' },
    { id: 'admin-letters', action: 'Letters within policy' },
    { id: 'signpost-pathways', action: 'Signpost to pathways Reception missed: UTC, eye service, maternity, sexual health' },
    { id: 'selfcare-pharmacy', action: 'Apply self-care / Pharmacy First if Tier 1 missed it and all criteria met' }
  ],
  mustEscalate: [
    { id: 'multiple-problems', reason: 'Multiple overlapping problems' },
    { id: 'cancer-2ww', reason: 'Possible cancer / 2WW (NICE NG12)' },
    { id: 'medication', reason: 'ALL medication queries: dose changes, interactions, new prescriptions, side effects causing concern' },
    { id: 'clinical-interpretation', reason: 'Clinical interpretation needed: results without GP comment, symptoms that don\'t pattern-match' },
    { id: 'high-risk-new', reason: 'ALL high-risk patients with NEW symptoms (Tier 2 can only book planned care for these patients)' },
    { id: 'under-1', reason: 'ALL patients under 1 year old with any new concern' },
    { id: 'safeguarding', reason: 'ALL safeguarding concerns \u2013 flag to duty clinician and follow safeguarding policy' },
    { id: 'mental-health', reason: 'ALL mental health: suicidal with plan, self-harm with intent, psychotic symptoms, acute agitation \u2192 Tier 3 + Crisis Line' },
    { id: 'patient-requests-gp', reason: 'Patient explicitly requesting clinical advice / GP opinion' },
    { id: 'persistent', reason: 'Symptoms >2 weeks, not improving despite previous advice, "worst ever" or "never had before"' },
    { id: 'vague', reason: 'Vague or unclear presentations that don\'t match a defined protocol' },
    { id: 'declined-selfcare', reason: 'Patient declined self-care/Pharmacy First because they feel it\'s more serious' }
  ],
  handoverToTier3: [
    { id: 'tier1-info', item: 'Everything from Tier 1 handover (patient\'s words, EMIS findings, flags)' },
    { id: 'tier2-review', item: 'Your Tier 2 review: what you checked, what you could or couldn\'t match to protocol' },
    { id: 'specific-question', item: 'Specific question for GP: e.g. "Is this 2WW?" or "Medication query \u2013 patient asking about dose change"' },
    { id: 'time-sensitivity', item: 'Your assessment of time sensitivity' },
    { id: 'contact-details', item: 'Contact details and patient availability' }
  ],
  thirtySecondRule: 'If you think about it >30 seconds \u2192 escalate to Tier 3.'
};
