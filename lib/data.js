// lib/data.js - All triage data for the application
// Cross-checked against: NHS.uk, NICE NG12 (May 2025), NICE NG253 (Jan 2025),
// NICE NG158 (Aug 2023), NICE NG240 (Mar 2024), NICE NG143, UK Sepsis Trust 7th Ed 2024,
// UKHSA guidance, BMA safe triage principles
// Last reviewed: 06 February 2026

// Organised by body system per SOP v3.1 Part B, Section 5 Red Flags table.
// Each entry: { system, symptom, keywords[], action }
// Keywords include patient-language variations for the keyword scanner.
export const redFlags = [
  // ── CARDIAC ────────────────────────────────────────────────────────────
  {
    system: 'Cardiac',
    symptom: 'Chest pain / tight chest / pressure, especially with sweating, nausea, light-headedness, or pain spreading to arm / neck / jaw / back',
    keywords: [
      'chest pain', 'tight chest', 'pressure chest', 'heavy chest', 'crushing chest',
      'pain arm jaw', 'pain spreading arm', 'pain neck jaw', 'pain left arm',
      'heart attack', 'chest tightness', 'band around chest', 'elephant on chest',
      'chest pain sweating', 'chest pain sick', 'squeezing chest', 'burning chest',
      'chest pain breathless', 'indigestion won\'t go away'
    ],
    action: 'Call 999 / Advise A&E NOW'
  },
  {
    system: 'Cardiac',
    symptom: 'Sudden tearing/ripping chest or back pain radiating between shoulder blades (aortic dissection)',
    keywords: [
      'tearing pain chest', 'tearing pain back', 'ripping pain chest', 'ripping pain back',
      'sudden severe back pain tearing', 'worst back pain radiating', 'pain between shoulder blades',
      'tearing sensation chest', 'back pain ripping', 'sharp tearing chest',
      'sudden back pain spreading', 'pain shooting to back', 'ripping sensation back'
    ],
    action: 'Call 999 / Advise A&E NOW',
    niceRef: 'NHS.uk Aortic dissection'
  },

  // ── RESPIRATORY ────────────────────────────────────────────────────────
  {
    system: 'Respiratory',
    symptom: '"Can\'t breathe" / "Can\'t speak" / blue or grey lips / breathing very fast',
    keywords: [
      'can\'t breathe', 'can\'t speak', 'blue lips', 'grey lips', 'very short breath',
      'breathing difficulty severe', 'gasping', 'fighting for breath', 'lips turning blue',
      'struggling to breathe', 'can\'t catch breath', 'breathing really fast',
      'can\'t get air in', 'suffocating', 'choking', 'turning blue',
      'can\'t talk properly breathless', 'wheezing can\'t breathe'
    ],
    action: 'Call 999 / Advise A&E NOW'
  },

  // ── NEUROLOGICAL ───────────────────────────────────────────────────────
  {
    system: 'Neurological',
    symptom: 'Stroke signs (FAST): face drooping, arm weakness, slurred speech, sudden confusion',
    keywords: [
      'face drooping', 'arm weakness', 'slurred speech', 'stroke', 'fast',
      'sudden confusion', 'face dropped', 'can\'t lift arm', 'words coming out wrong',
      'mouth drooped', 'one side face', 'speech garbled', 'talking funny',
      'can\'t move one side', 'sudden numbness one side', 'face gone lopsided',
      'dragging leg', 'sudden can\'t speak', 'vision gone one eye'
    ],
    action: 'Call 999 / Advise A&E NOW'
  },
  {
    system: 'Neurological',
    symptom: 'Collapsed / unconscious / fitting / seizure / not responding',
    keywords: [
      'collapsed', 'unconscious', 'fitting', 'seizure', 'not responding',
      'passed out won\'t wake', 'blacked out', 'convulsions', 'shaking all over',
      'eyes rolling back', 'fainted won\'t come round', 'on the floor not moving',
      'can\'t wake them', 'unresponsive', 'having a fit', 'jerking movements',
      'gone limp', 'foaming mouth'
    ],
    action: 'Call 999 / Advise A&E NOW'
  },
  {
    system: 'Neurological',
    symptom: '"Worst headache of my life" (sudden onset) +/- neck stiffness / sensitivity to light',
    keywords: [
      'worst headache', 'thunderclap', 'sudden severe headache', 'worst headache of my life',
      'headache like never before', 'worst pain in head', 'head feels like exploding',
      'sudden blinding headache', 'headache hit suddenly', 'headache came on instantly',
      'headache with stiff neck', 'headache light hurts'
    ],
    action: 'Call 999 / Advise A&E NOW'
  },
  {
    system: 'Neurological',
    symptom: 'Back pain + NEW loss of bladder/bowel control or numbness between legs (cauda equina — emergency even without all symptoms)',
    keywords: [
      'back pain bladder', 'can\'t control bowels', 'numb between legs', 'saddle numbness',
      'legs giving way', 'pins needles genitals', 'pins needles between legs',
      'numb genitals', 'back pain can\'t control bladder', 'back pain bowel control',
      'back pain wetting myself', 'back pain can\'t feel down below', 'back pain legs weak',
      'back pain numb bum', 'back pain can\'t pee', 'back pain losing control',
      'cauda equina', 'back pain numb saddle area'
    ],
    action: 'Call 999 / Advise A&E NOW',
    niceRef: 'NICE CKS Cauda Equina; National CES Guidelines 2025'
  },

  // ── SEPSIS / MENINGITIS ────────────────────────────────────────────────
  {
    system: 'Sepsis/Meningitis',
    symptom: 'Sepsis (NICE NG253): "acting confused", mottled/ashen skin, "feels like dying", very fast breathing, no urine 18+ hrs. Can occur WITHOUT fever.',
    keywords: [
      'acting confused', 'rash doesn\'t fade', 'blotchy skin', 'mottled', 'ashen skin',
      'feels like dying', 'feel like I might die', 'very fast breathing',
      'cold hands feet', 'very high temperature', 'very low temperature',
      'not passed urine 18 hours', 'no urine all day', 'skin looks grey',
      'shivering uncontrollably', 'not making sense', 'really not right',
      'never seen them this ill', 'going downhill fast', 'floppy and unwell',
      'temperature won\'t come down', 'hot and cold shaking'
    ],
    action: 'Call 999 / Advise A&E NOW',
    niceRef: 'NICE NG253 (Jan 2025); UK Sepsis Trust 7th Ed 2024'
  },
  {
    system: 'Sepsis/Meningitis',
    symptom: 'Meningitis (NICE NG240): non-blanching rash (glass test) + fever + stiff neck. On darker skin check palms, soles, conjunctivae and mouth.',
    keywords: [
      'rash doesn\'t fade glass', 'non-blanching rash', 'stiff neck fever',
      'light hurts eyes fever', 'purple rash', 'spots don\'t fade', 'meningitis',
      'glass test rash', 'rash spreading fast', 'rash won\'t go when pressed',
      'spots under skin', 'dark spots spreading', 'neck stiff can\'t look down',
      'fever neck stiff', 'rash doesn\'t disappear', 'bruise-like rash',
      'check palms soles', 'rash dark skin'
    ],
    action: 'Call 999 / Advise A&E NOW',
    niceRef: 'NICE NG240 (Mar 2024)'
  },
  {
    system: 'Sepsis/Meningitis',
    symptom: 'Child with non-blanching rash — assume meningitis until proven otherwise',
    keywords: [
      'child rash doesn\'t fade', 'baby rash glass test', 'child purple spots',
      'baby spots won\'t fade', 'child petechiae', 'toddler rash glass test',
      'child bruise-like spots', 'kid spots spreading', 'baby purple rash',
      'child spots under skin', 'baby spots don\'t disappear', 'child rash pressed glass',
      'infant spots won\'t fade', 'baby rash not fading', 'child spotty rash fever'
    ],
    action: 'Call 999 / Advise A&E NOW',
    niceRef: 'NICE NG240 (Mar 2024)'
  },

  // ── GI / ABDOMINAL ────────────────────────────────────────────────────
  {
    system: 'GI/Abdominal',
    symptom: 'Vomiting blood / black tarry stools / heavy bleeding that won\'t stop',
    keywords: [
      'vomiting blood', 'black poo', 'tarry stool', 'blood poo', 'heavy bleeding',
      'bleeding won\'t stop', 'throwing up blood', 'blood in vomit', 'coffee ground vomit',
      'dark blood in sick', 'black sticky poo', 'poo looks like tar',
      'blood pouring out', 'can\'t stop bleeding', 'bright red blood poo',
      'vomit with blood', 'passing blood', 'bleeding heavily'
    ],
    action: 'Call 999 / Advise A&E NOW'
  },
  {
    system: 'GI/Abdominal',
    symptom: 'Severe sudden abdominal pain / rigid abdomen / can\'t move with pain',
    keywords: [
      'severe tummy pain', 'can\'t move pain', 'rigid abdomen', 'worst stomach pain',
      'tummy hard as board', 'stomach agony', 'doubled over pain', 'screaming in pain tummy',
      'abdominal pain severe', 'belly rock hard', 'worst abdominal pain',
      'sudden severe stomach', 'can\'t stand up straight pain', 'tummy pain can\'t move',
      'excruciating stomach pain', 'agonising belly pain'
    ],
    action: 'Call 999 / Advise A&E NOW'
  },
  {
    system: 'GI/Abdominal',
    symptom: 'Can\'t pass poo or wind with severe abdominal pain (bowel obstruction)',
    keywords: [
      'can\'t pass poo', 'can\'t pass wind', 'can\'t fart', 'bowel obstruction',
      'not opened bowels days pain', 'tummy swollen can\'t poo', 'bloated vomiting can\'t poo',
      'stomach swelling no bowel movement', 'vomiting faecal', 'belly distended pain',
      'constipated vomiting', 'tummy blown up can\'t go', 'blocked bowel'
    ],
    action: 'Call 999 / Advise A&E NOW'
  },

  // ── VASCULAR ───────────────────────────────────────────────────────────
  {
    system: 'Vascular',
    symptom: 'Sudden cold, white, painful leg or arm / no pulse in foot (acute limb ischaemia — 6 P\'s: pain, pallor, pulselessness, paraesthesia, paralysis, perishing cold)',
    keywords: [
      'sudden cold leg', 'white leg', 'painful pale leg', 'can\'t feel leg suddenly',
      'leg gone white', 'leg gone cold', 'no pulse foot', 'arm gone white cold',
      'leg suddenly painful pale', 'foot gone numb cold', 'leg turning white',
      'pins needles leg gone cold', 'can\'t move leg cold', 'leg dead feeling',
      'blue leg sudden', 'leg cold no feeling', 'limb gone cold pale'
    ],
    action: 'Call 999 / Advise A&E NOW',
    niceRef: 'NICE NG224'
  },

  // ── UROLOGICAL ─────────────────────────────────────────────────────────
  {
    system: 'Urological',
    symptom: 'Can\'t pee at all with severe lower abdominal pain (acute urinary retention)',
    keywords: [
      'can\'t pee', 'can\'t urinate', 'can\'t pass urine', 'retention',
      'bladder full can\'t go', 'not peed all day pain', 'straining can\'t pee',
      'desperate to wee can\'t', 'lower tummy swollen can\'t pee', 'painful can\'t urinate',
      'bladder agony can\'t wee', 'urine won\'t come out', 'holding urine pain',
      'swollen belly can\'t pee', 'acute retention', 'blocked can\'t pee'
    ],
    action: 'Call 999 / Advise A&E NOW'
  },
  {
    system: 'Urological',
    symptom: 'Sudden severe testicular/groin pain with vomiting (possible torsion)',
    keywords: [
      'testicle pain', 'testicular pain', 'groin pain sudden', 'balls pain vomiting',
      'twisted testicle', 'testicle swollen painful', 'sudden pain balls',
      'groin agony vomiting', 'testicle pain being sick', 'sudden severe groin',
      'one testicle swollen', 'torsion', 'ball pain sudden',
      'testicle gone hard painful', 'groin pain can\'t walk'
    ],
    action: 'Call 999 / Advise A&E NOW'
  },

  // ── OBSTETRIC ──────────────────────────────────────────────────────────
  {
    system: 'Obstetric',
    symptom: 'Pregnancy <12 weeks + one-sided abdominal pain + shoulder tip pain + bleeding (possible ectopic)',
    keywords: [
      'pregnant pain one side', 'early pregnancy pain', 'shoulder tip pain pregnant',
      'one sided pain pregnant', 'ectopic', 'pregnant collapse', 'early pregnant bleeding pain',
      'pregnant sharp pain one side', 'positive test pain shoulder', 'pregnant dizzy bleeding',
      'pregnancy bleeding one side pain', 'pregnant faint pain', 'early pregnancy shoulder pain',
      'might be pregnant severe pain', 'missed period pain one side bleeding',
      'pregnant spotting one side pain'
    ],
    action: 'Call 999 / A&E NOW'
  },

  // ── ONCOLOGY ───────────────────────────────────────────────────────────
  {
    system: 'Oncology',
    symptom: 'Known cancer + new back pain + leg weakness/numbness + bladder/bowel issues (malignant spinal cord compression — MSCC)',
    keywords: [
      'cancer back pain legs', 'cancer leg weakness', 'known cancer can\'t walk',
      'tumour spine', 'cancer numb legs', 'cancer patient back pain',
      'cancer back pain can\'t feel legs', 'cancer wobbly legs', 'cancer can\'t stand',
      'cancer bladder problems back', 'cancer tingling legs back pain',
      'cancer back pain getting worse legs', 'spinal cord compression',
      'cancer patient legs giving way'
    ],
    action: 'Call 999 / Advise A&E NOW',
    niceRef: 'NICE CG75 (Metastatic spinal cord compression)'
  },

  // ── EYE ────────────────────────────────────────────────────────────────
  {
    system: 'Eye',
    symptom: 'Severe eye pain + headache + haloes around lights + nausea + reduced vision (acute angle-closure glaucoma)',
    keywords: [
      'severe eye pain headache', 'eye pain vomiting', 'haloes around lights',
      'eye rock hard', 'sudden eye pain one side', 'eye agony seeing haloes',
      'eye pain nausea', 'eye pain blurred halos', 'eye gone red painful vomiting',
      'sudden eye pain can\'t see properly', 'eye throbbing headache sick',
      'vision haloes eye pain', 'acute glaucoma', 'eye pressure headache vomiting',
      'rainbow circles lights eye pain'
    ],
    action: 'Call 999 / A&E or Royal Eye Unit URGENT',
    niceRef: 'NICE CKS Glaucoma'
  },
  {
    system: 'Eye',
    symptom: 'Chemical splash / penetrating injury / sudden vision loss with stroke signs',
    keywords: [
      'chemical in eye', 'bleach in eye', 'acid in eye', 'something stuck in eye deep',
      'eye punctured', 'eye penetrating', 'sudden vision loss', 'can\'t see suddenly',
      'went blind suddenly', 'object in eye bleeding', 'eye injury sharp object',
      'cleaning product in eye', 'chemical splash eye', 'eye laceration',
      'vision gone one eye suddenly', 'eye trauma'
    ],
    action: 'Call 999 / A&E NOW'
  },

  // ── ALLERGY ────────────────────────────────────────────────────────────
  {
    system: 'Allergy',
    symptom: 'Severe allergic reaction: face/tongue/throat swelling + breathing difficulty (anaphylaxis)',
    keywords: [
      'allergic reaction', 'face swelling', 'tongue swelling', 'throat closing',
      'anaphylaxis', 'can\'t swallow', 'lips swelling up', 'face puffing up',
      'throat swelling shut', 'tongue getting bigger', 'hives all over can\'t breathe',
      'allergic can\'t breathe', 'epipen', 'swelling up after eating',
      'allergic reaction struggling breathe', 'whole body rash swelling',
      'stung can\'t breathe', 'swollen face throat'
    ],
    action: 'Call 999 / Advise A&E NOW'
  },

  // ── MENTAL HEALTH ──────────────────────────────────────────────────────
  {
    system: 'Mental Health',
    symptom: 'Suicide attempt in progress or immediate danger to self/others',
    keywords: [
      'suicide attempt', 'taken overdose', 'harming self now', 'danger to others',
      'going to kill', 'trying to end it', 'swallowed pills', 'cut themselves badly',
      'standing on ledge', 'threatening harm now', 'wants to die right now',
      'hurting themselves', 'self harm bleeding', 'overdosed',
      'in danger now', 'going to jump', 'threatening to kill'
    ],
    action: 'Call 999 / Advise A&E NOW + Alert duty clinician'
  }
];

export const amberFlags = [
  {
    id: 'breathing-amber',
    category: 'Breathing: new/worsening',
    buzzwords: 'Worsening breathlessness, new wheeze, asthma/COPD flare, coughing blood, fever + chest pain',
    keywords: ['worsening breathlessness', 'new breathlessness', 'wheeze', 'asthma flare', 'asthma attack', 'COPD flare', 'coughing blood', 'fever chest pain', 'breathing worse', 'short of breath'],
    action: 'Same-day duty GP',
    notes: '',
    niceRef: '',
    searchTerms: ['breathing', 'wheeze', 'asthma', 'copd', 'cough', 'chest']
  },
  {
    id: 'abdo-amber',
    category: 'Abdominal: severe/acute',
    buzzwords: 'Severe persistent pain, can\'t keep fluids down, dehydrated, persistent vomiting, severe diarrhoea',
    keywords: ['severe persistent pain', "can't keep fluids down", 'dehydrated', 'not drinking', 'persistent vomiting', 'severe diarrhoea', 'diabetes vomiting', 'severe tummy pain', 'abdominal pain acute'],
    action: 'Same-day duty GP',
    notes: '',
    niceRef: '',
    searchTerms: ['stomach', 'tummy', 'vomiting', 'diarrhoea', 'abdominal', 'gut']
  },
  {
    id: 'diabetes-amber',
    category: 'Diabetes urgent',
    buzzwords: 'Blood sugar <4 or >20, hypo, fruity breath, very thirsty + urinating, diabetes + vomiting',
    keywords: ['blood sugar low', 'blood sugar under 4', 'blood sugar over 20', 'blood sugar high', 'hypo', 'shaking sweating', 'fruity breath', 'very thirsty urinating', 'type 1 unwell', 'diabetes vomiting'],
    action: 'Same-day duty GP. NOT Pharmacy First. NOT self-care.',
    notes: '',
    niceRef: '',
    searchTerms: ['diabetes', 'sugar', 'insulin', 'diabetic']
  },
  {
    id: 'urinary-amber',
    category: 'Urinary: blood/fever/male/pregnant',
    buzzwords: 'Blood in urine, flank pain + fever, male UTI, pregnant UTI, catheter problem',
    keywords: ['blood in urine', 'flank pain fever', 'back pain fever', 'male UTI', 'male urinary', 'catheter problem', 'pregnant UTI', "can't pass urine", "bladder won't empty"],
    action: 'Same-day. NOT Pharmacy First',
    notes: 'Male urinary = Same-day GP NOT Pharmacy First',
    niceRef: '',
    searchTerms: ['urine', 'urinary', 'uti', 'bladder', 'kidney', 'waterworks']
  },
  {
    id: 'neuro-amber',
    category: 'Neurology/Head',
    buzzwords: 'Sudden severe headache, new weakness/numbness, new confusion, blackout, fainted',
    keywords: ['sudden severe headache', 'new weakness', 'new numbness', 'new confusion', 'blackout', 'fainted', 'loss of consciousness'],
    action: 'Same-day duty GP. Stroke signs → 999',
    notes: '',
    niceRef: '',
    searchTerms: ['headache', 'head', 'dizzy', 'faint', 'weakness', 'numb']
  },
  {
    id: 'skin-amber',
    category: 'Skin/Infection',
    buzzwords: 'Rapidly spreading redness, cellulitis, face infection, rigors, tracking redness, very unwell',
    keywords: ['rapidly spreading redness', 'cellulitis spreading', 'face infection', 'eye infection', 'rigors', 'shivering', 'very unwell', 'tracking redness'],
    action: 'Same-day duty GP',
    notes: '',
    niceRef: '',
    searchTerms: ['skin', 'rash', 'infection', 'cellulitis', 'red', 'swelling']
  },
  {
    id: 'eye-amber',
    category: 'Eye problems',
    buzzwords: 'Vision loss, painful red eye, shingles near eye, contact lens + pain, flashes + floaters',
    keywords: ['vision loss', 'painful red eye', 'shingles eye', 'contact lens pain', 'flashes', 'floaters', 'eye pain severe', 'sudden blurred vision'],
    action: 'CUES / Royal Eye Unit. Severe: 999',
    notes: 'Royal Eye Unit: 020 8934 6799 (Mon–Fri 8:30–4:30) / 020 8934 6404',
    niceRef: '',
    searchTerms: ['eye', 'vision', 'sight', 'blind']
  },
  {
    id: 'dvt-amber',
    category: 'DVT (NG158)',
    buzzwords: 'Unilateral leg swelling, calf pain, red hot leg, leg swollen after surgery/flight',
    keywords: ['swollen leg one side', 'calf swelling', 'red hot leg', 'leg swollen after surgery', 'leg swollen after flight', 'one leg bigger', 'calf pain swelling'],
    action: 'Same-day duty GP → SDEC via A&E. Cannot assess in practice',
    notes: 'SDEC via A&E',
    niceRef: 'NICE NG158 (Aug 2023)',
    searchTerms: ['leg swelling', 'dvt', 'blood clot', 'calf', 'swollen leg']
  },
  {
    id: 'pe-amber',
    category: 'PE (NG158)',
    buzzwords: 'Breathless + chest pain, sharp chest pain on breathing, coughing blood, pleuritic chest pain',
    keywords: ['breathless chest pain', 'sharp chest pain breathing', 'coughing blood breathless', 'chest pain after surgery', 'chest pain after flight', 'pleuritic chest pain'],
    action: 'URGENT same-day',
    notes: 'If severe breathlessness/collapse → 999',
    niceRef: 'NICE NG158 (Aug 2023)',
    searchTerms: ['chest pain breathing', 'pe', 'pulmonary', 'blood clot lung']
  },
  {
    id: 'gca-amber',
    category: 'GCA (NG244)',
    buzzwords: 'New headache >50, jaw pain chewing, scalp tenderness, temple headache, vision changes',
    keywords: ['headache over 50', 'jaw pain chewing', 'scalp tender', 'temple headache', 'vision blurry headache', 'temporal headache new'],
    action: 'URGENT. Risk: vision loss',
    notes: 'URGENT — risk of permanent vision loss if untreated',
    niceRef: 'NICE NG244; BSR GCA Guidelines',
    searchTerms: ['headache', 'temple', 'jaw', 'scalp', 'vision']
  },
  {
    id: 'renal-colic',
    category: 'Renal Colic',
    buzzwords: 'Loin to groin pain, severe side pain, can\'t lie still, writhing in pain',
    keywords: ['loin to groin pain', 'severe side pain', "can't lie still pain", 'kidney pain severe', 'renal colic', 'writhing pain'],
    action: 'Same-day duty GP',
    notes: '',
    niceRef: '',
    searchTerms: ['kidney', 'loin', 'groin pain', 'side pain', 'renal']
  },
  {
    id: 'fever-under5',
    category: 'Fever <5s (NG143)',
    buzzwords: 'Baby/child fever, high temperature, hot and floppy, not feeding',
    keywords: ['baby fever', 'toddler high temperature', 'child hot floppy', 'baby not feeding fever', 'child fever rash', 'baby temperature'],
    action: 'Same-day duty GP. Under 1yr → MUST Tier 3',
    notes: 'Non-blanching rash → 999. Under 1yr → MUST escalate to Tier 3.',
    niceRef: 'NICE NG143 (Fever in under 5s)',
    searchTerms: ['baby', 'toddler', 'child', 'fever', 'temperature', 'hot']
  },
  {
    id: 'neutropenic-sepsis',
    category: 'Neutropenic Sepsis',
    buzzwords: 'Chemo + fever, immunosuppressed + temperature, cancer treatment + unwell',
    keywords: ['chemo fever', 'chemotherapy temperature', 'cancer treatment fever', 'immunosuppressed fever', 'transplant fever'],
    action: 'URGENT duty GP — may need 999',
    notes: 'Do NOT use Pharmacy First. May need 999/A&E if unwell.',
    niceRef: 'NICE NG151 (Neutropenic sepsis)',
    searchTerms: ['chemo', 'chemotherapy', 'cancer', 'transplant', 'fever', 'immunosuppressed']
  },
  {
    id: 'testicular-amber',
    category: 'Testicular Pain (non-torsion)',
    buzzwords: 'Sore testicle, swollen testicle, testicular discomfort',
    keywords: ['testicle pain', 'testicular pain', 'sore testicle', 'swollen testicle', 'balls aching'],
    action: 'Same-day duty GP',
    notes: 'If sudden onset + vomiting → 999 (torsion — see RED flags)',
    niceRef: '',
    searchTerms: ['testicle', 'testicular', 'groin', 'balls']
  },
  {
    id: 'womens-health-amber',
    category: "Women's Health",
    buzzwords: 'Pregnant pain/bleeding, reduced movements, waters breaking, heavy menstrual bleeding + dizziness',
    keywords: ['pregnant pain', 'pregnant bleeding', "pregnant can't keep fluids", 'early pregnancy pain', 'pregnant vomiting', 'reduced movements', 'baby not moving', 'waters breaking', 'contractions', 'pregnant headache', 'pregnant vision', 'heavy period dizzy'],
    action: 'Same-day / maternity',
    notes: 'Pregnancy >18wks: Maternity Helpline 0208 934 2802. <12wks + one-sided pain + shoulder tip → 999 (ectopic)',
    niceRef: '',
    searchTerms: ['pregnant', 'pregnancy', 'maternity', 'period', 'menstrual']
  },
  {
    id: 'back-pain-amber',
    category: 'Acute Back Pain + flags',
    buzzwords: 'Acute back pain + leg weakness, new bladder/bowel symptoms, progressive neurological symptoms',
    keywords: ['acute back pain', 'back pain leg weakness', 'back pain bladder', 'back pain bowel', 'back pain numbness', 'sciatica severe', 'back pain can\'t walk'],
    action: 'Same-day duty GP',
    notes: 'If saddle numbness / bladder-bowel loss → 999 (cauda equina). Cancer + back pain + leg weakness → 999 (MSCC)',
    niceRef: '',
    searchTerms: ['back pain', 'sciatica', 'spine', 'back']
  }
];

export const highRiskGroups = [
  {
    id: 'pregnant',
    group: 'Pregnant',
    icon: '🤰',
    keywords: ['pregnant', 'pregnancy', 'postnatal', 'postpartum', 'expecting', 'weeks pregnant', 'trimester'],
    conditions: ['Any infection', 'Bleeding', 'Headache', 'Tummy pain', 'Breathlessness'],
    action: 'Forward to Tier 2 with HIGH RISK flag. Do NOT use self-care or Pharmacy First.',
    note: 'Planned postnatal checks can still be booked directly. Higher sepsis risk (NICE NG253).',
    niceRef: 'NICE NG253'
  },
  {
    id: 'immunosuppressed',
    group: 'Immunosuppressed (chemo/transplant/biologics/steroids)',
    icon: '💊',
    keywords: ['immunosuppressed', 'chemotherapy', 'chemo', 'transplant', 'biologics', 'steroids', 'methotrexate', 'azathioprine', 'HIV'],
    conditions: ['Chemotherapy / radiotherapy / targeted therapy', 'Organ transplant', 'Biologic medicines', 'Long-term steroids', 'Advanced HIV'],
    action: 'Forward to Tier 2 with HIGH RISK flag. Do NOT use self-care or Pharmacy First.',
    note: 'Do NOT use Pharmacy First for infections. Fever in chemo patients = potential neutropenic sepsis.',
    niceRef: 'NICE NG151; NICE NG253'
  },
  {
    id: 'under-1',
    group: 'Under 1yr',
    icon: '👶',
    keywords: ['baby', 'infant', 'newborn', 'weeks old', 'months old', 'under 1', 'under one'],
    conditions: ['All medical concerns'],
    action: 'Forward to Tier 2 with HIGH RISK flag. Do NOT use self-care or Pharmacy First.',
    note: 'ANY new concern → Tier 2 MUST escalate Tier 3. RED flags → 999.',
    niceRef: 'NICE NG253; NICE NG143'
  },
  {
    id: 'under-5',
    group: 'Under 5 with new symptoms',
    icon: '🧒',
    keywords: ['toddler', 'child', 'under 5', 'preschool', 'years old', '2 year', '3 year', '4 year'],
    conditions: ['New fever', 'New rash', 'New symptoms', 'Not feeding', 'Lethargic'],
    action: 'Forward to Tier 2 with HIGH RISK flag. Do NOT use self-care or Pharmacy First.',
    note: 'Non-blanching rash → 999. Use NICE NG143 traffic light assessment.',
    niceRef: 'NICE NG143'
  },
  {
    id: 'frail',
    group: 'Frail/elderly',
    icon: '👴',
    keywords: ['frail', 'elderly', 'care home', 'nursing home', 'housebound', 'mobility aids', 'falls'],
    conditions: ['Falls', 'New confusion', 'Infection', 'Dehydration', 'Breathlessness', 'Reduced oral intake'],
    action: 'Forward to Tier 2 with HIGH RISK flag. Do NOT use self-care or Pharmacy First.',
    note: 'Small changes can indicate serious illness. Higher sepsis risk (NICE NG253).',
    niceRef: 'NICE NG253'
  },
  {
    id: 'cancer-active',
    group: 'Active cancer',
    icon: '🎗️',
    keywords: ['cancer', 'tumour', 'oncology', 'radiotherapy', 'cancer treatment', 'malignant'],
    conditions: ['Any fever or infection', 'New pain', 'New back pain (MSCC risk)', 'Breathlessness', 'Bleeding'],
    action: 'Forward to Tier 2 with HIGH RISK flag. Do NOT use self-care or Pharmacy First.',
    note: 'Any fever may be neutropenic sepsis. New back pain + leg symptoms = 999 (MSCC).',
    niceRef: 'NICE NG151; NICE CG75'
  },
  {
    id: 'asplenic',
    group: 'No spleen (asplenic/hyposplenic)',
    icon: '🩸',
    keywords: ['no spleen', 'splenectomy', 'asplenic', 'hyposplenic'],
    conditions: ['Any fever', 'Feeling unwell', 'Any suspected infection'],
    action: 'Forward to Tier 2 with HIGH RISK flag. Do NOT use self-care or Pharmacy First.',
    note: 'These patients can deteriorate extremely rapidly with infection. Overwhelming sepsis risk.',
    niceRef: 'NICE NG253; UK Sepsis Trust'
  },
  {
    id: 'recent-surgery',
    group: 'Recent surgery <6wks',
    icon: '🏥',
    keywords: ['surgery', 'operation', 'post-op', 'after surgery', 'hospitalised', 'discharged'],
    conditions: ['Leg swelling/pain (DVT risk)', 'Breathlessness/chest pain (PE risk)', 'Wound infection', 'Fever'],
    action: 'Forward to Tier 2 with HIGH RISK flag. Do NOT use self-care or Pharmacy First.',
    note: 'Post-operative patients at higher risk of DVT/PE and surgical site infection.',
    niceRef: 'NICE NG158; NICE NG125'
  },
  {
    id: 'learning-disability',
    group: 'Learning disability',
    icon: '🛡️',
    keywords: ['learning disability', 'learning difficulties', 'downs syndrome', 'autistic', 'special needs'],
    conditions: ['Any unclear or worrying request', 'Communication difficulties'],
    action: 'Forward to Tier 2 with HIGH RISK flag. Do NOT use self-care or Pharmacy First.',
    note: 'Follow reasonable adjustments. Communication difficulties increase risk of missed deterioration.',
    niceRef: 'NICE NG253'
  },
  {
    id: 'smi',
    group: 'Serious mental illness (SMI)',
    icon: '🧠',
    keywords: ['schizophrenia', 'bipolar', 'psychosis', 'serious mental illness', 'SMI', 'sectioned', 'CPN'],
    conditions: ['Any physical health concern', 'Medication issues', 'Acute distress'],
    action: 'Forward to Tier 2 with HIGH RISK flag. Do NOT use self-care or Pharmacy First.',
    note: 'Physical health complaints may be undertreated. Diagnostic overshadowing risk.',
    niceRef: ''
  },
  {
    id: 'homeless',
    group: 'Homeless/no fixed abode',
    icon: '🏠',
    keywords: ['homeless', 'rough sleeper', 'no fixed abode', 'NFA', 'hostel', 'sofa surfing', 'shelter'],
    conditions: ['Infection', 'Wounds', 'Chest symptoms', 'Mental health'],
    action: 'Forward to Tier 2 with HIGH RISK flag. Do NOT use self-care or Pharmacy First.',
    note: 'May present late, have limited self-care resources, and higher infection risk.',
    niceRef: ''
  },
  {
    id: 'substance-misuse',
    group: 'Substance misuse/alcohol dependence',
    icon: '⚠️',
    keywords: ['alcohol', 'drugs', 'substance misuse', 'addiction', 'heroin', 'methadone', 'drinking', 'alcoholic'],
    conditions: ['Confusion', 'Seizures', 'Abdominal pain', 'Chest pain', 'Infection'],
    action: 'Forward to Tier 2 with HIGH RISK flag. Do NOT use self-care or Pharmacy First.',
    note: 'Atypical presentations common. Do not assume symptoms are substance-related.',
    niceRef: ''
  },
  {
    id: 'sickle-cell',
    group: 'Sickle cell/thalassaemia',
    icon: '🩸',
    keywords: ['sickle cell', 'sickle', 'thalassaemia', 'thalassemia', 'sickle crisis'],
    conditions: ['Pain crisis', 'Fever', 'Chest symptoms', 'Feeling unwell'],
    action: 'Forward to Tier 2 with HIGH RISK flag. Do NOT use self-care or Pharmacy First.',
    note: 'Can deteriorate rapidly. Pain crisis + fever = urgent. Higher sepsis risk.',
    niceRef: 'NICE NG253'
  }
];

export const pharmacyFirstConditions = [
  {
    id: 'sinusitis',
    condition: 'Sinusitis',
    icon: '👃',
    ageRange: '<10 days, no high-risk',
    keywords: ['sinusitis', 'sinus', 'blocked nose', 'facial pain', 'sinus pressure'],
    exclusions: ['Periorbital swelling', 'Very unwell', 'Immunosuppressed', 'High-risk group'],
    action: 'Pharmacy First',
    notes: '<10 days, no high-risk'
  },
  {
    id: 'sore-throat',
    condition: 'Sore Throat',
    icon: '🗣️',
    ageRange: 'Age 5+',
    keywords: ['sore throat', 'throat pain', 'tonsils', 'swollen throat'],
    exclusions: ['Quinsy signs', 'Peritonsillar abscess', "Can't swallow fluids", 'Very unwell'],
    action: 'Pharmacy First',
    notes: 'No quinsy signs. Hoarseness >3wks → Tier 3 (cancer)'
  },
  {
    id: 'earache',
    condition: 'Earache',
    icon: '👂',
    ageRange: 'Age 1–17 ONLY',
    keywords: ['earache', 'ear pain', 'ear infection', 'otitis'],
    exclusions: ['<1 → GP', '>17 → GP', 'Temp >39°C → GP', 'Discharge', 'Mastoid swelling'],
    action: 'Pharmacy First',
    notes: 'Age 1–17 ONLY. <1 → GP. >17 → GP. Temp >39°C → GP.'
  },
  {
    id: 'insect-bite',
    condition: 'Infected Insect Bite',
    icon: '🐜',
    ageRange: 'Age 1+',
    keywords: ['insect bite', 'bug bite', 'bite infected', 'swollen bite'],
    exclusions: ['<1 → GP', 'Pregnant <16 → GP', 'Rapidly spreading', 'Very unwell', 'Facial bite with swelling'],
    action: 'Pharmacy First',
    notes: 'Age 1+. <1 → GP. Pregnant <16 → GP.'
  },
  {
    id: 'impetigo',
    condition: 'Impetigo',
    icon: '🩹',
    ageRange: 'Age 1+',
    keywords: ['impetigo', 'crusty sores', 'golden crusts', 'blisters skin'],
    exclusions: ['<1 → GP', 'Widespread → GP', 'Immunocompromised → GP', 'Near eyes'],
    action: 'Pharmacy First',
    notes: 'Age 1+. <1 → GP. Widespread → GP. Immunocompromised → GP.'
  },
  {
    id: 'shingles',
    condition: 'Shingles',
    icon: '⚡',
    ageRange: 'Age 18+ ONLY',
    keywords: ['shingles', 'shingles rash', 'herpes zoster', 'blistering rash one side'],
    exclusions: ['Near eye → SAME-DAY GP', 'Immunocompromised → GP', '<18 → GP', 'Very unwell'],
    action: 'Pharmacy First',
    notes: 'Age 18+ ONLY. Near eye → SAME-DAY GP. Immunocompromised → GP.'
  },
  {
    id: 'uti-women',
    condition: 'UTI',
    icon: '🚽',
    ageRange: 'WOMEN 16–64 ONLY',
    keywords: ['uti', 'urine infection', 'water infection', 'burning wee', 'cystitis'],
    exclusions: ['Male → GP', 'Pregnant → GP', '<16 → GP', '>64 → GP', 'Recurrent → GP', 'Catheter', 'Kidney pain', 'Fever'],
    action: 'Pharmacy First',
    notes: 'WOMEN 16–64 ONLY. Male → GP. Pregnant → GP. <16 → GP. >64 → GP. Recurrent → GP.'
  }
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
  { id: 'msi', service: 'MSI (Abortion)', number: '0345 300 8090', hours: 'See website', priority: 'normal', description: 'NHS-funded abortion services', icon: '🏥' },
  { id: 'health-visiting', service: 'Health Visiting Service', number: '020 8339 8000', hours: 'Mon–Fri 9–5', priority: 'normal', description: 'Children 0–5. Well Baby Clinics Tue/Wed/Thu. Feeding, growth, development, immunisations, parental wellbeing.', email: 'hvadminhub@yourhealthcare.org', icon: '👶' },
  { id: 'nhs111-emergency-rx', service: 'NHS 111 Emergency Prescriptions', number: '111', hours: '24/7', priority: 'normal', description: 'Ran out of essential medication (insulin, anticoag, AED) outside GP hours', website: '111.nhs.uk/emergency-prescription', icon: '💊' }
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
    script: "If your symptoms are not improving or you are worried, please contact us again. For chest pain, severe breathlessness, collapse, confusion, or heavy bleeding — call 999 immediately."
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
  { id: 11, scenario: "A man calls about his 76-year-old wife who has had chest pain since 3am. He says she's had this before and doesn't want to go to hospital.", correctAnswer: '999', explanation: "Chest pain since 3am = RED flag regardless of history. Call 999. If she declines, escalate to Tier 2 & Duty GP with comment 'declined 999/A&E'. Never delay emergency care because a patient is reluctant.", options: [{ id: '999', text: 'Call 999' }, { id: 'gp-sameday', text: 'Book same-day GP' }, { id: 'nhs111', text: 'Advise NHS 111' }, { id: 'gp-triager', text: 'Send to GP Triager' }], followUp: { scenario: "Bill says his wife has had this before and is very reluctant to go to hospital. She wants to see a doctor instead. What do you do?", correctAnswer: 'escalate-declined', explanation: "Even though she declines 999, chest pain is still a RED flag. Escalate to Tier 2 & Duty GP noting 'patient declined 999/A&E'. The duty GP will decide next steps.", options: [{ id: 'accept', text: 'Accept her decision and book GP' }, { id: 'escalate-declined', text: 'Escalate to Tier 2 & Duty GP noting declined 999' }, { id: 'nhs111', text: 'Tell her to call NHS 111' }, { id: 'calmcare', text: 'Send CalmCare card' }] } },
  { id: 12, scenario: "Mrs B has asthma and doesn't usually bother the GP. She phones because she woke up very short of breath, is struggling, frightened, and asking to see a doctor immediately.", correctAnswer: '999', explanation: "This is unusual for her asthma. She is struggling, frightened, and can barely talk — listen for broken speech. These are RED flags for severe breathing difficulty. Call 999 immediately.", options: [{ id: '999', text: 'Call 999' }, { id: 'gp-sameday', text: 'Book same-day GP' }, { id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'calmcare', text: 'CalmCare asthma card' }], followUp: { scenario: "Mrs B becomes increasingly distressed and says she doesn't want an ambulance, just the doctor. What do you do?", correctAnswer: '999-anyway', explanation: "Call 999 regardless. Severe breathing difficulty is life-threatening. Inform the duty GP on site. You cannot let a RED flag go unescalated even if the patient objects.", options: [{ id: 'accept-gp', text: 'Accept and book urgent GP' }, { id: '999-anyway', text: 'Call 999 anyway and inform duty GP' }, { id: 'gp-triager', text: 'Transfer to GP Triager' }, { id: 'nhs111', text: 'Advise NHS 111' }] } },
  { id: 13, scenario: "Patient calls: 'My husband has had the worst headache of his life, it came on suddenly 20 minutes ago, and his neck feels stiff.'", correctAnswer: '999', explanation: "Sudden worst-ever headache + neck stiffness = possible subarachnoid haemorrhage. RED flag. Call 999 immediately.", options: [{ id: '999', text: 'Call 999' }, { id: 'gp-sameday', text: 'Book same-day GP' }, { id: 'calmcare', text: 'CalmCare headache card' }, { id: 'paracetamol', text: 'Advise paracetamol and call back' }] },
  { id: 14, scenario: "Parent calls about their 3-year-old with a temperature and a rash that doesn't fade when they press a glass on it.", correctAnswer: '999', explanation: "Non-blanching rash in a child = possible meningitis/sepsis. RED flag. Call 999 immediately. Under 5 is also a high-risk group.", options: [{ id: '999', text: 'Call 999' }, { id: 'gp-sameday', text: 'Book same-day GP' }, { id: 'healthier-together', text: 'Healthier Together' }, { id: 'pharmacy-first', text: 'Pharmacy First' }] },
  { id: 15, scenario: "Patient says: 'I need my blood test done, the doctor told me to come back in 2 weeks for bloods.'", correctAnswer: 'direct-book', explanation: "Check EMIS — this is a planned follow-up with a documented plan. Direct-book with phlebotomy/HCA. No triage needed.", options: [{ id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'direct-book', text: 'Direct-book bloods' }, { id: 'econsult', text: 'Ask them to submit eConsult' }, { id: 'pharmacy-first', text: 'Pharmacy First' }] },
  { id: 16, scenario: "Patient: 'I've had this cough for 3 weeks now and I've noticed some blood when I cough.'", correctAnswer: 'gp-triager', explanation: "Coughing blood = amber flag. >3 weeks + haemoptysis = possible cancer red flag (NICE NG12). Must go to GP Triager for 2WW assessment.", options: [{ id: '999', text: 'Call 999' }, { id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'pharmacy-first', text: 'Pharmacy First' }, { id: 'calmcare', text: 'CalmCare cough card' }] },
  { id: 17, scenario: "Patient: 'I need a repeat of my contraceptive pill prescription.'", correctAnswer: 'external-pathway', explanation: "Contraception → Wolverton Centre (self-referral) or practice contraception clinic. This is a Quick-Match Pathway, not a GP appointment.", options: [{ id: 'gp-appt', text: 'Book GP appointment' }, { id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'external-pathway', text: 'Direct to Wolverton Centre' }, { id: 'pharmacy-first', text: 'Pharmacy First' }] },
  { id: 18, scenario: "Parent calls: 'My 5-year-old has had earache for 2 days, no fever, otherwise well.'", correctAnswer: 'pharmacy-first', explanation: "Earache age 1-17 = Acute Otitis Media pathway. Pharmacy First eligible. No red flags, no high-risk factors, short duration.", options: [{ id: '999', text: 'Call 999' }, { id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'pharmacy-first', text: 'Pharmacy First' }, { id: 'healthier-together', text: 'Healthier Together' }] },
  { id: 19, scenario: "Patient on chemotherapy calls: 'I've got a sore throat and I'm feeling shivery and unwell.'", correctAnswer: 'gp-triager', explanation: "Patient on chemotherapy = immunosuppressed = HIGH RISK group. Sore throat + shivering = possible neutropenic sepsis. Do NOT use Pharmacy First. Forward to Tier 2 with HIGH RISK flag → immediate escalation to Tier 3/Duty GP.", options: [{ id: 'pharmacy-first', text: 'Pharmacy First' }, { id: 'calmcare', text: 'CalmCare sore throat' }, { id: 'gp-triager', text: 'Send to GP Triager (HIGH RISK)' }, { id: 'gp-routine', text: 'Book routine GP' }] },
  { id: 20, scenario: "Patient: 'I can't pee at all and my stomach is really painful and swollen.'", correctAnswer: '999', explanation: "Cannot pass urine + severe abdominal pain = acute urinary retention. This is a RED flag in SOP v3.1 (moved from amber). Call 999 / advise A&E now.", options: [{ id: '999', text: 'Call 999' }, { id: 'gp-sameday', text: 'Book same-day GP' }, { id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'drink-water', text: 'Advise drink more water' }] }
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

// ── Quick-Match Pathway Grid (SOP v3.1 Section 5A) ──────────────────────
// Flat array for the pathway grid. Each entry has keywords for scanner matching.
export const quickMatchPathways = [
  { id: 'eye-routine', pathway: 'Eye', symptoms: 'Red eye, painful eye, floaters, flashes, stye', action: 'CUES via local optician (self-refer)', contact: 'primaryeyecare.co.uk', keywords: ['red eye', 'painful eye', 'floaters', 'flashes', 'stye', 'eye irritation', 'something in eye'] },
  { id: 'eye-urgent', pathway: 'Eye (urgent)', symptoms: 'Vision loss, shingles near eye, contact lens + pain', action: 'Royal Eye Unit', contact: '020 8934 6799', keywords: ['vision loss', 'shingles eye', 'contact lens pain', 'blurred vision sudden'] },
  { id: 'eye-999', pathway: 'Eye (999)', symptoms: 'Chemical splash, penetrating injury, acute glaucoma, sudden vision loss + stroke', action: 'CALL 999 / A&E NOW', contact: '999', keywords: ['chemical eye', 'eye injury', 'eye trauma', 'glaucoma severe'] },
  { id: 'injury', pathway: 'Injury/Burn', symptoms: 'Cuts needing stitches, minor burns, sprains, possible fracture', action: 'Richmond UTC Teddington', contact: 'Book via NHS 111', keywords: ['cut', 'stitches', 'burn', 'sprain', 'fracture', 'broken', 'wound', 'injury', 'twisted', 'fell'] },
  { id: 'pregnancy-booking', pathway: 'Pregnancy (booking)', symptoms: 'New pregnancy, want to register', action: 'Self-refer Kingston Maternity online', contact: 'kingstonmaternity.org.uk/pregnancy/referral-form', keywords: ['pregnant', 'new pregnancy', 'pregnancy booking', 'register pregnancy', 'just found out pregnant'] },
  { id: 'pregnancy-urgent', pathway: 'Pregnancy (>18wk urgent)', symptoms: 'Reduced movements, bleeding, waters, contractions, severe pain/headache', action: 'Maternity Helpline first', contact: '0208 934 2802 (24/7)', keywords: ['reduced movements', 'baby not moving', 'waters broken', 'contractions', 'bleeding pregnant', 'pregnancy pain'] },
  { id: 'pregnancy-early', pathway: 'Pregnancy (<18wk concern)', symptoms: 'Pain, bleeding, vomiting, unable to keep fluids', action: 'Duty GP / Same day', contact: '', keywords: ['early pregnancy pain', 'pregnancy bleeding', 'morning sickness severe', 'cant keep fluids pregnant'] },
  { id: 'sexual-health', pathway: 'Sexual Health', symptoms: 'Contraception, STI, genital symptoms, discharge', action: 'Wolverton Centre (self-referral)', contact: '0208 974 9331', keywords: ['contraception', 'pill', 'coil', 'sti', 'std', 'discharge', 'genital', 'sexual health', 'condom', 'implant'] },
  { id: 'mh-mild', pathway: 'Mental Health (mild-moderate)', symptoms: 'Low mood, anxiety, stress, ongoing symptoms', action: 'Kingston Talking Therapies (self-refer)', contact: 'swlstg.nhs.uk/kingston-talking-therapies', keywords: ['low mood', 'anxiety', 'stress', 'depression', 'worried', 'cant sleep', 'panic'] },
  { id: 'mh-crisis', pathway: 'Mental Health (crisis)', symptoms: 'Suicidal thoughts, self-harm urges, severe distress', action: 'GP Triager + Crisis Line', contact: '0800 028 8000 / CAMHS: 0203 228 5980', keywords: ['suicidal', 'self harm', 'want to die', 'crisis', 'cant go on', 'ending it'] },
  { id: 'abortion', pathway: 'Abortion', symptoms: 'Wants to end pregnancy, termination', action: 'Self-referral to provider', contact: 'NUPAS 0333 004 6666 / BPAS 0345 730 4030 / MSI 0345 300 8090', keywords: ['abortion', 'termination', 'end pregnancy', 'dont want baby'] },
  { id: 'fitnote-new', pathway: 'Fit Note (new)', symptoms: 'First fit note, not yet seen by GP', action: 'Check EMIS → GP Triager if discussed, GP appointment if not', contact: '', keywords: ['fit note', 'sick note', 'med3', 'off work', 'need note for work'] },
  { id: 'fitnote-renewal', pathway: 'Fit Note (renewal)', symptoms: 'Extending existing fit note', action: 'Check EMIS expiry → Tier 2 if within 7 days + documented', contact: '', keywords: ['renew fit note', 'extend sick note', 'fit note expiring', 'need another fit note'] }
];

// ── Tier 2 Actions (SOP v3.1 Section 16) ─────────────────────────────────
export const tier2Actions = {
  canDo: [
    'Book duty GP for patients who declined 999/A&E (noting "declined 999")',
    'Book same-day with duty GP for CLEAR amber flag matches',
    'Book routine follow-up where EMIS plan is clear but Reception was not confident',
    'Process admin with existing GP sign-off (fit note renewal, results queries commented by GP, investigation requests, private referrals, ADHD/ASD adult referrals, DN referrals)',
    'Signpost to pathways Reception missed (UTC, eye, maternity, sexual health, Pharmacy First)',
    'Self-care / Pharmacy First if Tier 1 missed and criteria met',
    'Process ANIMA non-RAG queue items',
    'Distribute admin eConsults to session GPs'
  ],
  mustEscalate: [
    'Anything you are unsure about',
    'Multiple overlapping problems',
    'Possible cancer / 2WW decisions',
    'ALL medication queries',
    'ALL high-risk patients with NEW symptoms',
    'ALL patients under 1 year',
    'ALL safeguarding concerns',
    'ALL mental health: suicidal with plan, self-harm, psychotic, agitated',
    'Symptoms >2 weeks not improving',
    'Patient declined self-care because they feel it is more serious'
  ],
  timeLimits: {
    amber: 'Action within 1 hour',
    allOther: 'Action within 2 hours',
    endOfDay: 'Anything not resolved auto-escalates to GP Triager'
  }
};

// ── Training Topics — scenario grouping by theme ─────────────────────────
export const trainingTopics = {
  'Red Flag Recognition': [1, 3, 11, 12, 13, 14, 20],
  'EMIS & Direct Booking': [4, 15],
  'Pharmacy First & Self-Care': [5, 6, 18],
  'High-Risk Patients': [2, 8, 19],
  'Pathways & Signposting': [9, 10, 17],
  'Amber Flags & GP Triager': [7, 16],
  'Patient Declines': [11]
};

// ── PURPLE FLAGS (SOP v3.5 Section 6B) ────────────────────────────────
// These ALWAYS go to Tier 3 GP Triager. Tier 2 CANNOT book these.
export const purpleFlags = [
  {
    category: 'Possible cancer / 2WW (NICE NG12)',
    triggers: [
      'New lump (inc breast)', 'Unexplained weight loss', 'Persistent unexplained bleeding',
      'Bowel change >6wks', 'Swallowing difficulty', 'PMB (post-menopausal bleeding)',
      'Hoarseness >3wks', 'Night sweats', 'Persistent cough >3wks', 'Mole changes',
      'Unexplained fatigue', 'Iron deficiency anaemia', 'Persistent bloating (women >50)',
      'Nipple changes', 'Lymphadenopathy >3wks', 'Persistent bone pain'
    ],
    keywords: [
      'lump', 'weight loss', 'unexplained bleeding', 'bowel change', 'swallowing',
      'post-menopausal bleeding', 'PMB', 'hoarse', 'night sweats', 'persistent cough',
      'mole', 'fatigue', 'anaemia', 'bloating', 'nipple', 'lymph node', 'bone pain',
      '2ww', 'cancer'
    ],
    action: 'GP Triager. Do NOT book routine. Possible 2WW referral.',
    notes: ''
  },
  {
    category: 'Mental health (CRISIS)',
    triggers: [
      'Active suicidal thoughts + plan', 'Recent self-harm + intent',
      'Psychotic symptoms', 'Acute severe agitation'
    ],
    keywords: [
      'suicidal', 'kill myself', 'end my life', 'self-harm', 'cutting', 'overdose',
      'psychosis', 'hearing voices', 'paranoid', 'agitated', 'sectioned'
    ],
    action: 'Duty clinician + GP Triager. Crisis: 0800 028 8000 | CAMHS (<18): 0203 228 5980',
    notes: ''
  },
  {
    category: 'Safeguarding',
    triggers: [
      'Domestic abuse', 'Sexual assault',
      'Child/adult safeguarding concern or alert'
    ],
    keywords: [
      'domestic abuse', 'hit me', 'violent partner', 'sexual assault', 'rape',
      'safeguarding', 'child protection', 'neglect', 'abuse'
    ],
    action: 'Duty clinician. Follow safeguarding policy.',
    notes: ''
  },
  {
    category: 'Under 1 year — ANY new concern',
    triggers: ['Any new symptom or parental concern in infant under 1'],
    keywords: ['baby', 'infant', 'newborn', 'weeks old', 'months old', 'under 1'],
    action: 'Tier 3 GP Triager. RED flags → 999.',
    notes: ''
  },
  {
    category: 'High-risk + NEW symptoms',
    triggers: ['Any patient in high-risk group with NEW symptoms not covered by existing plan'],
    keywords: [
      'high risk', 'immunosuppressed', 'transplant', 'cancer patient', 'no spleen', 'pregnant', 'frail'
    ],
    action: 'Tier 3 GP Triager with HIGH RISK flag.',
    notes: ''
  },
  {
    category: 'Multiple / vague / >2 weeks / worst ever',
    triggers: [
      'Multiple overlapping symptoms', 'Vague presentations',
      'Symptoms >2 weeks not improving', '"Worst ever" or "never had before"'
    ],
    keywords: [
      'multiple', 'several things', 'lots of problems', 'vague', 'not sure', 'worse',
      'not improving', 'two weeks', '2 weeks', 'worst ever', 'never had before',
      'getting worse'
    ],
    action: 'Tier 3 GP Triager. Do NOT decide timing.',
    notes: ''
  },
  {
    category: 'ALL medication decisions',
    triggers: [
      'Dose changes', 'Interactions', 'New prescriptions', 'Acute medication requests',
      'Concerning side effects', 'Medication switches'
    ],
    keywords: [
      'medication', 'dose', 'side effect', 'prescription', 'tablets', 'medicine change',
      'drug interaction', 'ran out'
    ],
    action: 'Tier 3 GP Triager. Routine repeats (no change) = admin team.',
    notes: 'Ran out of essential med (insulin, anticoag, AED) = URGENT Tier 3 or NHS 111 emergency supply.'
  }
];

// ── YELLOW FLAGS (SOP v3.5 Section 6C) ────────────────────────────────
// Book within 1–3 days.
export const yellowFlags = [
  {
    category: 'Worsening chronic condition',
    presentation: 'Known condition with mild worsening but NOT acute flare',
    keywords: ['asthma worse', 'eczema worse', 'BP worse', 'condition worse', 'flare', 'deteriorating'],
    escalateIf: 'Acute flare → amber. >2wks / not improving → PURPLE',
    eConsultSuitable: true,
    eConsultNotes: 'If NEW deterioration. If previously tried eConsult + failed → f2f.',
    action: 'Book GP within 1–3 days'
  },
  {
    category: 'UTI not Pharmacy First eligible',
    presentation: 'UTI but male, <16, >64, pregnant, or recurrent',
    keywords: ['uti', 'urine infection', 'burning wee', 'male uti', 'pregnant uti', 'recurrent uti'],
    escalateIf: 'Blood / fever / flank pain → amber. Catheter → amber',
    eConsultSuitable: true,
    eConsultNotes: 'For uncomplicated. Recurrent → f2f.',
    action: 'Book GP within 1–3 days'
  },
  {
    category: 'ENT: not responding to self-care (<2wks)',
    presentation: 'Sore throat, earache, sinus not settling <2 weeks',
    keywords: ['sore throat', 'earache', 'sinus', 'blocked nose', 'not clearing'],
    escalateIf: '>2 weeks, breathing/swallowing difficulty → amber/red',
    eConsultSuitable: true,
    eConsultNotes: 'If single symptom <2wks.',
    action: 'Book GP within 1–3 days'
  },
  {
    category: 'New rash / skin lesion (non-concerning)',
    presentation: 'New rash, skin change without red/amber features',
    keywords: ['rash', 'skin', 'spots', 'lesion', 'itchy'],
    escalateIf: 'Spreading redness, fever → amber. Mole change → PURPLE',
    eConsultSuitable: true,
    eConsultNotes: 'Patient can attach photo.',
    action: 'Book GP within 1–3 days'
  },
  {
    category: 'MSK: injury / new joint pain (non-severe)',
    presentation: 'New joint pain, minor sprain, muscle strain not settling',
    keywords: ['joint pain', 'sprain', 'strain', 'twisted', 'swollen joint', 'knee', 'shoulder', 'ankle'],
    escalateIf: "Can't weight bear / deformity → UTC. New weakness → amber",
    eConsultSuitable: true,
    eConsultNotes: 'For non-acute.',
    action: 'Book GP within 1–3 days'
  },
  {
    category: 'Post-op concern (non-urgent, <6wks)',
    presentation: 'Minor post-op query: mild wound concern, expected recovery',
    keywords: ['post-op', 'after surgery', 'wound', 'operation', 'stitches'],
    escalateIf: 'Leg swelling, SOB, wound infection + fever → amber',
    eConsultSuitable: true,
    eConsultNotes: 'If minor query.',
    action: 'Book GP within 1–3 days'
  },
  {
    category: 'Bowel habit change (<6wks, no cancer flags)',
    presentation: 'Change in bowel habit <6 weeks, no NG12 flags',
    keywords: ['bowel change', 'constipated', 'diarrhoea', 'loose stools', 'bowel habit'],
    escalateIf: '>6 weeks or ANY cancer flag → PURPLE. Blood → amber',
    eConsultSuitable: true,
    eConsultNotes: 'If <6wks no flags.',
    action: 'Book GP within 1–3 days'
  },
  {
    category: 'Persistent headache (non-red-flag)',
    presentation: 'Headache persisting but NOT sudden/worst-ever/>50+jaw',
    keywords: ['headache', 'head pain', 'migraine', 'headaches'],
    escalateIf: 'Sudden/severe → 999. >50 + jaw → amber GCA',
    eConsultSuitable: true,
    eConsultNotes: 'If non-acute.',
    action: 'Book GP within 1–3 days'
  },
  {
    category: 'Mental health: non-crisis',
    presentation: 'Low mood, anxiety, stress — tried self-help, not improving',
    keywords: [
      'low mood', 'depressed', 'anxiety', 'anxious', 'stressed', "can't cope",
      'mental health', 'panic attacks'
    ],
    escalateIf: 'Active plan / self-harm / psychosis → PURPLE',
    eConsultSuitable: true,
    eConsultNotes: 'For non-crisis.',
    action: 'Book GP within 1–3 days',
    notes: 'IMPORTANT: Send Kingston Talking Therapies self-referral info (swlstg.nhs.uk) AND book GP review within 1–3 days. Do NOT just signpost.'
  }
];

// ── GREEN FLAGS (SOP v3.5 Section 6D) ─────────────────────────────────
// Book within 1 week.
export const greenFlags = [
  {
    category: 'Mild eczema / dermatitis (new)',
    presentation: 'New eczema, dry itchy skin, mild dermatitis',
    keywords: ['eczema', 'dermatitis', 'dry skin', 'itchy skin'],
    escalateIf: 'Spreading redness, fever → amber. Immunosuppressed → amber',
    eConsultSuitable: true,
    eConsultNotes: 'If NEW + untried.',
    triedAndFailed: 'eConsult Rx tried + rash persists → f2f',
    action: 'Book GP within 1 week'
  },
  {
    category: 'Acne (new or worsening)',
    presentation: 'New acne, spots, worsening acne',
    keywords: ['acne', 'spots', 'pimples', 'breakout'],
    escalateIf: 'Severe cystic / scarring / psychological impact → Tier 3',
    eConsultSuitable: true,
    eConsultNotes: 'With photos.',
    triedAndFailed: 'Topical Rx via eConsult + no improvement → f2f',
    action: 'Book GP within 1 week'
  },
  {
    category: 'Psoriasis (mild)',
    presentation: 'Known/new mild psoriasis, small patches',
    keywords: ['psoriasis', 'scaly patches', 'plaques'],
    escalateIf: 'Widespread / joint pain / nail changes → Tier 3',
    eConsultSuitable: true,
    eConsultNotes: 'With photos.',
    triedAndFailed: 'Previous eConsult Rx failed → f2f',
    action: 'Book GP within 1 week'
  },
  {
    category: 'Ear wax / hearing / tinnitus',
    presentation: 'Blocked ear, hearing change, tinnitus (gradual)',
    keywords: ['ear wax', 'blocked ear', 'hearing', 'tinnitus', 'ringing', 'deaf'],
    escalateIf: 'Ear pain + fever → PF or amber. Sudden hearing loss → amber',
    eConsultSuitable: true,
    eConsultNotes: 'For wax / gradual hearing change.',
    triedAndFailed: '',
    action: 'Book GP within 1 week'
  },
  {
    category: 'MSK: ongoing pain (non-acute)',
    presentation: 'Ongoing joint/muscle pain, non-acute, functional',
    keywords: ['knee pain', 'back pain', 'shoulder pain', 'joint stiff', 'muscle pain', 'aching'],
    escalateIf: "New weakness/numbness → amber. Can't weight bear → UTC",
    eConsultSuitable: true,
    eConsultNotes: 'For non-acute MSK.',
    triedAndFailed: 'Physio/eConsult tried + no improvement → f2f',
    action: 'Book GP within 1 week'
  },
  {
    category: "Women's health: menstrual / contraception / menopause",
    presentation: 'Menstrual concerns, contraception review, menopause',
    keywords: ['period', 'menstrual', 'contraception', 'pill', 'coil', 'menopause', 'hot flushes', 'HRT'],
    escalateIf: 'Heavy bleeding + dizziness → amber. PMB → PURPLE',
    eConsultSuitable: true,
    eConsultNotes: 'For contraception review, HRT, menstrual queries.',
    triedAndFailed: 'Failed treatment / complex → f2f',
    action: 'Book GP within 1 week'
  },
  {
    category: 'Urinary: frequency / mild incontinence',
    presentation: 'Urinary frequency, mild stress incontinence, nocturia',
    keywords: ['urinary frequency', 'incontinence', 'leaking', 'nocturia', 'bladder'],
    escalateIf: 'Blood / fever / flank pain → amber. Male urinary → same-day GP',
    eConsultSuitable: true,
    eConsultNotes: 'For non-urgent urinary.',
    triedAndFailed: '',
    action: 'Book GP within 1 week'
  },
  {
    category: 'GI: reflux / indigestion (mild)',
    presentation: 'Heartburn, mild indigestion, acid reflux',
    keywords: ['heartburn', 'indigestion', 'acid reflux', 'acid taste', 'reflux'],
    escalateIf: 'Dysphagia / weight loss / vomiting blood → amber/PURPLE. >55 new onset → Tier 3',
    eConsultSuitable: true,
    eConsultNotes: 'If NEW.',
    triedAndFailed: 'OTC/eConsult tried + persistent → f2f',
    action: 'Book GP within 1 week'
  },
  {
    category: 'Fatigue (persistent, no alarm)',
    presentation: 'Tired all the time, low energy, persistent fatigue',
    keywords: ['tired', 'fatigue', 'exhausted', 'no energy', 'tired all the time'],
    escalateIf: 'Weight loss / night sweats / bleeding → PURPLE. Severe SOB → amber',
    eConsultSuitable: true,
    eConsultNotes: 'Tier 3 may order bloods via eConsult.',
    triedAndFailed: '',
    action: 'Book GP within 1 week'
  },
  {
    category: 'Verruca / wart / skin tag / minor cosmetic',
    presentation: 'Wart, verruca, skin tag, minor cosmetic skin concern',
    keywords: ['verruca', 'wart', 'skin tag', 'mole removal'],
    escalateIf: 'Changing mole → PURPLE. Non-healing ulcer → PURPLE',
    eConsultSuitable: true,
    eConsultNotes: 'With photos.',
    triedAndFailed: 'OTC tried + failed → f2f',
    action: 'Book GP within 1 week'
  },
  {
    category: 'Child: behavioural / developmental concern',
    presentation: 'Parental concern about behaviour, development, speech',
    keywords: ['behaviour', 'development', 'speech delay', 'not talking', 'not sleeping', 'autism', 'ADHD'],
    escalateIf: 'Acute behavioural change + fever/confusion → amber. Safeguarding → PURPLE. Under 1yr → PURPLE',
    eConsultSuitable: true,
    eConsultNotes: 'For initial query.',
    triedAndFailed: 'Previously raised + no progress → f2f',
    action: 'Book GP within 1 week'
  },
  {
    category: 'Hayfever / allergic rhinitis (mild)',
    presentation: 'Seasonal allergies, runny/itchy nose/eyes, sneezing',
    keywords: ['hayfever', 'hay fever', 'allergic rhinitis', 'sneezing', 'itchy eyes', 'runny nose'],
    escalateIf: 'Wheeze, breathing difficulty → amber. Face swelling → 999',
    eConsultSuitable: true,
    eConsultNotes: 'If OTC tried + inadequate.',
    triedAndFailed: 'OTC + eConsult Rx tried + still struggling → f2f',
    action: 'Book GP within 1 week'
  }
];

// ── STOP PATTERNS (SOP v3.5 Section 5) ────────────────────────────────
// These trigger a full-screen 999 alert.
export const stopPatterns = [
  {
    pattern: 'Chest pain / tightness / pressure',
    keywords: ['chest pain', 'chest tight', 'tight chest', 'crushing', 'heavy chest', 'squeezing', 'pressure in chest', 'elephant on chest', 'band around chest'],
    system: 'Cardiac'
  },
  {
    pattern: "Can't breathe / can't speak / blue lips",
    keywords: ["can't breathe", 'cant breathe', 'struggling to breathe', "can't speak", 'blue lips', 'grey lips'],
    system: 'Respiratory'
  },
  {
    pattern: 'Face droop / arm weakness / slurred speech',
    keywords: ['face droop', 'face dropped', 'arm weak', 'arm numb', 'slurred speech', "can't talk properly"],
    system: 'Stroke'
  },
  {
    pattern: 'Collapsed / unconscious / fitting',
    keywords: ['collapsed', 'unconscious', 'fitting', 'seizure', "won't wake up", 'passed out', 'not responsive'],
    system: 'Neurological'
  },
  {
    pattern: 'Worst headache of my life',
    keywords: ['worst headache', 'thunderclap', 'worst head pain', 'never had headache like'],
    system: 'Neurological'
  },
  {
    pattern: 'Vomiting blood / black tarry stools',
    keywords: ['vomiting blood', 'blood in vomit', 'black stools', 'tarry stools', 'melaena', 'coffee ground vomit'],
    system: 'GI'
  },
  {
    pattern: "Heavy bleeding won't stop",
    keywords: ["bleeding won't stop", 'heavy bleeding', 'soaking through', "can't stop bleeding"],
    system: 'Haemorrhage'
  },
  {
    pattern: "Can't pee + severe pain",
    keywords: ["can't pee", 'cant pee', "can't urinate", 'cant urinate', "can't pass urine", 'bladder pain'],
    system: 'Urological'
  },
  {
    pattern: 'Sudden testicular pain + vomiting',
    keywords: ['testicular pain', 'testicle pain', 'ball pain'],
    system: 'Urological'
  },
  {
    pattern: 'One-sided abdominal pain + shoulder tip (pregnancy)',
    keywords: ['pregnant pain', 'pregnancy pain', 'shoulder tip pain', 'one sided pain pregnant'],
    system: 'Obstetric'
  },
  {
    pattern: 'Non-blanching rash + fever',
    keywords: ['non-blanching rash', "rash won't fade", "rash doesn't fade", 'glass test', 'meningitis'],
    system: 'Sepsis'
  },
  {
    pattern: 'Chemical splash to eye',
    keywords: ['chemical eye', 'chemical splash', 'bleach in eye', 'acid in eye'],
    system: 'Eye'
  },
  {
    pattern: 'Face/tongue/throat swelling + breathing difficulty',
    keywords: ['tongue swelling', 'throat closing', 'face swelling', 'throat swollen', 'anaphylaxis', 'allergic reaction'],
    system: 'Allergy'
  },
  {
    pattern: 'Suicide attempt in progress',
    keywords: ['taken something', 'overdose', 'hurting myself', 'killing myself now', 'just taken', 'swallowed pills'],
    system: 'Mental Health'
  },
  {
    pattern: 'Saddle numbness / bladder-bowel loss + back pain',
    keywords: ['saddle numbness', "can't feel between legs", 'lost bladder control', 'lost bowel control', 'cauda equina'],
    system: 'Neurological'
  },
  {
    pattern: 'Sudden cold/pale/painful limb, no pulse',
    keywords: ['leg cold', 'leg white', 'leg pale', 'no pulse in leg', 'foot cold'],
    system: 'Vascular'
  },
  {
    pattern: 'Cancer + new back pain + leg weakness',
    keywords: ['cancer back pain', 'cancer leg weakness', 'cancer spine'],
    system: 'Oncology'
  }
];
