// lib/data.js - All triage data for the application
// Cross-checked against: NHS.uk, NICE NG12 (May 2025), NICE NG253 (Jan 2025),
// NICE NG158 (Aug 2023), NICE NG240 (Mar 2024), NICE NG143, UK Sepsis Trust 7th Ed 2024,
// UKHSA guidance, BMA safe triage principles
// Last reviewed: 06 February 2026

// Organised by body system, matching SOP Section 9A exactly.
// Schema: { system: string, symptom: string, keywords: string[], action: string }
export const redFlags = [
  // ── CARDIAC ──────────────────────────────────────────────────────────
  {
    system: 'Cardiac',
    symptom: 'Chest pain / tight chest / pressure, especially with sweating, nausea, light-headedness, or pain spreading to arm / neck / jaw / back',
    keywords: [
      'chest pain', 'tight chest', 'pressure chest', 'pain arm jaw', 'heart attack',
      'crushing chest', 'heavy chest', 'chest tightness', 'pain in my chest',
      'band around chest', 'chest feels heavy', 'squeezing chest', 'pain down arm',
      'pain in jaw', 'pain in neck', 'sweating chest pain', 'chest pain sweating',
      'chest pain sick', 'chest pain nausea', 'chest pain dizzy', 'angina'
    ],
    action: 'CALL 999 NOW'
  },
  {
    system: 'Cardiac',
    symptom: 'Sudden tearing/ripping chest or back pain radiating between shoulder blades (aortic dissection)',
    keywords: [
      'tearing pain chest', 'tearing pain back', 'ripping pain chest', 'ripping pain back',
      'sudden severe back pain tearing', 'worst back pain radiating', 'pain between shoulder blades',
      'tearing sensation chest', 'ripping sensation back', 'sharp tearing back pain',
      'aortic dissection', 'back pain radiating'
    ],
    action: 'CALL 999 NOW'
  },

  // ── RESPIRATORY ──────────────────────────────────────────────────────
  {
    system: 'Respiratory',
    symptom: '"Can\'t breathe" / "Can\'t speak" / blue or grey lips / breathing very fast',
    keywords: [
      'can\'t breathe', 'can\'t speak', 'blue lips', 'grey lips', 'very short breath',
      'breathing difficulty severe', 'gasping', 'struggling to breathe', 'lips turning blue',
      'lips gone grey', 'choking', 'can\'t get air', 'breathing really fast',
      'can\'t catch breath', 'suffocating', 'can barely breathe', 'turning blue',
      'not breathing properly', 'fighting for breath'
    ],
    action: 'CALL 999 NOW'
  },

  // ── NEUROLOGICAL ─────────────────────────────────────────────────────
  {
    system: 'Neurological',
    symptom: 'Stroke signs (FAST): face drooping, arm weakness, slurred speech, sudden confusion',
    keywords: [
      'face drooping', 'arm weakness', 'slurred speech', 'stroke', 'sudden confusion',
      'face dropped', 'one side face', 'mouth drooping', 'can\'t lift arm', 'speech funny',
      'words jumbled', 'can\'t speak properly', 'face looks different', 'sudden weakness one side',
      'fast test', 'talking funny', 'confused suddenly', 'sudden numbness one side'
    ],
    action: 'CALL 999 NOW'
  },
  {
    system: 'Neurological',
    symptom: 'Collapsed / unconscious / fitting / seizure / not responding',
    keywords: [
      'collapsed', 'unconscious', 'fitting', 'seizure', 'not responding',
      'passed out won\'t wake', 'fainted won\'t come round', 'convulsing', 'shaking uncontrollably',
      'eyes rolling', 'gone floppy', 'blacked out', 'can\'t wake', 'not waking up',
      'on the floor', 'jerking', 'having a fit', 'knocked out'
    ],
    action: 'CALL 999 NOW'
  },
  {
    system: 'Neurological',
    symptom: '"Worst headache of my life" (sudden onset) +/\u2013 neck stiffness / sensitivity to light',
    keywords: [
      'worst headache', 'thunderclap', 'sudden severe headache', 'worst headache of my life',
      'worst headache ever', 'headache like never before', 'sudden blinding headache',
      'headache came on suddenly', 'explosion in my head', 'hit by a bat headache',
      'stiff neck headache', 'light hurts headache'
    ],
    action: 'CALL 999 NOW'
  },
  {
    system: 'Neurological',
    symptom: 'Back pain + NEW loss of bladder/bowel control or numbness between legs (cauda equina)',
    keywords: [
      'back pain bladder', 'can\'t control bowels', 'numb between legs', 'saddle numbness',
      'legs giving way', 'pins needles genitals', 'pins needles between legs', 'numb genitals',
      'back pain can\'t control bladder', 'back pain bowel control', 'can\'t feel between legs',
      'wetting myself back pain', 'soiling myself back pain', 'numb bum', 'can\'t feel down below',
      'cauda equina', 'back pain can\'t hold urine', 'back pain legs weak',
      'numb saddle area', 'tingling private parts'
    ],
    action: 'CALL 999 NOW'
  },

  // ── SEPSIS / MENINGITIS ──────────────────────────────────────────────
  {
    system: 'Sepsis/Meningitis',
    symptom: 'Sepsis (NICE NG253): "acting confused", mottled/ashen skin, "feels like dying", very fast breathing, no urine 18+ hrs. Can occur WITHOUT fever.',
    keywords: [
      'acting confused', 'rash doesn\'t fade', 'blotchy skin', 'mottled', 'ashen skin',
      'feels like dying', 'feel like I might die', 'very fast breathing', 'cold hands feet',
      'very high temperature', 'very low temperature', 'not passed urine 18 hours',
      'no urine all day', 'shivering uncontrollably', 'skin looks grey', 'skin looks mottled',
      'feels really cold', 'hot and cold', 'never felt this ill', 'sepsis',
      'breathing really fast', 'not making sense', 'talking nonsense'
    ],
    action: 'CALL 999 NOW'
  },
  {
    system: 'Sepsis/Meningitis',
    symptom: 'Meningitis (NICE NG240): non-blanching rash (glass test) + fever + stiff neck. Check palms, soles, mouth on darker skin.',
    keywords: [
      'rash doesn\'t fade glass', 'non-blanching rash', 'stiff neck fever', 'light hurts eyes fever',
      'purple rash', 'spots don\'t fade', 'meningitis', 'glass test rash', 'rash spreading fast',
      'rash won\'t go away with glass', 'spots under skin', 'purple spots', 'red spots fever',
      'neck stiff fever', 'rash dark spots', 'petechiae', 'bruise-like rash',
      'rash on palms', 'rash on soles', 'spots in mouth fever'
    ],
    action: 'CALL 999 NOW'
  },
  {
    system: 'Sepsis/Meningitis',
    symptom: 'Child with non-blanching rash \u2013 assume meningitis until proven otherwise',
    keywords: [
      'child rash doesn\'t fade', 'baby rash glass test', 'child purple spots',
      'baby spots won\'t fade', 'child petechiae', 'toddler rash glass test',
      'kid rash won\'t fade', 'child spots don\'t disappear', 'baby purple spots',
      'child bruise-like spots', 'toddler spots won\'t fade', 'child rash glass',
      'baby non-blanching', 'child red spots won\'t fade'
    ],
    action: 'CALL 999 NOW'
  },

  // ── GI / ABDOMINAL ──────────────────────────────────────────────────
  {
    system: 'GI/Abdominal',
    symptom: 'Vomiting blood / black tarry stools / heavy bleeding that won\'t stop',
    keywords: [
      'vomiting blood', 'black poo', 'tarry stool', 'blood poo', 'heavy bleeding',
      'bleeding won\'t stop', 'blood in sick', 'throwing up blood', 'black tarry poo',
      'coffee ground vomit', 'dark blood in poo', 'blood pouring', 'soaking through pads',
      'bleeding through bandage', 'can\'t stop bleeding', 'blood coming out',
      'bright red blood rectum', 'melaena', 'haematemesis'
    ],
    action: 'CALL 999 NOW'
  },
  {
    system: 'GI/Abdominal',
    symptom: 'Severe sudden abdominal pain / rigid abdomen / can\'t move with pain',
    keywords: [
      'severe tummy pain', 'can\'t move pain', 'rigid abdomen', 'worst stomach pain',
      'stomach hard as board', 'belly rock hard', 'worst tummy pain',
      'doubled over pain', 'screaming in pain tummy', 'sudden severe stomach pain',
      'abdominal pain can\'t move', 'severe belly pain', 'agonising tummy pain'
    ],
    action: 'CALL 999 NOW'
  },
  {
    system: 'GI/Abdominal',
    symptom: 'Can\'t pass poo or wind with severe abdominal pain (bowel obstruction)',
    keywords: [
      'can\'t pass poo', 'can\'t pass wind', 'can\'t fart', 'bowel obstruction',
      'not passed poo days pain', 'tummy swollen can\'t poo', 'stomach bloated can\'t fart',
      'being sick can\'t poo', 'vomiting can\'t poo', 'belly swelling can\'t pass wind',
      'blocked bowel', 'nothing coming out pain'
    ],
    action: 'CALL 999 NOW'
  },

  // ── VASCULAR ─────────────────────────────────────────────────────────
  {
    system: 'Vascular',
    symptom: 'Sudden cold, white, painful leg or arm / no pulse in foot (acute limb ischaemia) (NICE NG224)',
    keywords: [
      'sudden cold leg', 'white leg', 'painful pale leg', 'can\'t feel leg suddenly',
      'leg gone white', 'leg gone cold', 'no pulse foot', 'leg suddenly pale',
      'arm gone cold', 'arm gone white', 'foot gone numb suddenly', 'leg turned blue',
      'can\'t move leg suddenly', 'pins needles leg suddenly', 'leg dead feeling',
      'no feeling in foot', 'leg cold and painful', 'limb ischaemia'
    ],
    action: 'CALL 999 NOW'
  },

  // ── UROLOGICAL ───────────────────────────────────────────────────────
  {
    system: 'Urological',
    symptom: 'Can\'t pee at all with severe pain (urinary retention)',
    keywords: [
      'can\'t pee', 'can\'t urinate', 'can\'t pass urine', 'retention',
      'haven\'t peed all day', 'bladder feels full can\'t go', 'can\'t wee',
      'not passed water', 'bladder blocked', 'urinary retention',
      'straining can\'t pee', 'desperate to pee can\'t', 'bursting can\'t urinate',
      'no urine coming out', 'can\'t empty bladder pain'
    ],
    action: 'CALL 999 NOW'
  },
  {
    system: 'Urological',
    symptom: 'Sudden severe testicular/groin pain with vomiting (torsion)',
    keywords: [
      'testicle pain', 'testicular pain', 'groin pain sudden', 'balls pain vomiting',
      'twisted testicle', 'swollen testicle sudden', 'testicle pain vomiting',
      'balls agony', 'severe groin pain', 'testicle swollen red', 'ball pain sudden',
      'testicular torsion', 'pain in my balls being sick', 'groin pain being sick'
    ],
    action: 'CALL 999 NOW'
  },

  // ── OBSTETRIC ────────────────────────────────────────────────────────
  {
    system: 'Obstetric',
    symptom: 'Pregnancy <12 weeks + one-sided abdominal pain + shoulder tip pain (possible ectopic)',
    keywords: [
      'pregnant pain one side', 'early pregnancy pain', 'shoulder tip pain pregnant',
      'one sided pain pregnant', 'ectopic', 'pregnant collapse',
      'pregnant sharp pain one side', 'early pregnant bleeding pain', 'pregnant shoulder pain',
      'pregnant dizzy pain', 'pregnant fainted pain', 'ectopic pregnancy',
      'pain one side early pregnancy', 'shoulder tip pregnant', 'pregnant and collapsed'
    ],
    action: 'CALL 999 / A&E NOW'
  },

  // ── ONCOLOGY ─────────────────────────────────────────────────────────
  {
    system: 'Oncology',
    symptom: 'Known cancer + new back pain + leg weakness/numbness (MSCC \u2013 malignant spinal cord compression) (NICE CG75)',
    keywords: [
      'cancer back pain legs', 'cancer leg weakness', 'known cancer can\'t walk',
      'tumour spine', 'cancer numb legs', 'cancer patient back pain',
      'cancer and legs giving way', 'cancer and can\'t feel legs', 'cancer spine pain',
      'cancer back pain bladder', 'spinal cord compression', 'mscc',
      'cancer patient can\'t walk', 'cancer legs not working', 'cancer patient numb legs'
    ],
    action: 'CALL 999 NOW'
  },

  // ── EYE ──────────────────────────────────────────────────────────────
  {
    system: 'Eye',
    symptom: 'Severe eye pain + headache + vomiting + haloes around lights (acute angle-closure glaucoma)',
    keywords: [
      'severe eye pain headache', 'eye pain vomiting', 'haloes around lights',
      'eye rock hard', 'sudden eye pain one side', 'eye pain and sick',
      'rainbow rings lights', 'eye pain with haloes', 'blurred vision eye pain vomiting',
      'eye throbbing headache', 'acute glaucoma', 'eye pain nausea',
      'eye gone red painful vomiting', 'seeing halos eye pain'
    ],
    action: 'CALL 999 / A&E or Royal Eye Unit URGENT'
  },
  {
    system: 'Eye',
    symptom: 'Chemical splash / penetrating injury / sudden vision loss with stroke signs',
    keywords: [
      'chemical in eye', 'bleach in eye', 'acid in eye', 'something in eye bleeding',
      'eye punctured', 'eye stabbed', 'object stuck in eye', 'sudden blind',
      'can\'t see suddenly', 'vision gone', 'lost vision suddenly', 'eye injury bleeding',
      'chemical splash eye', 'penetrating eye injury', 'sudden vision loss stroke'
    ],
    action: 'CALL 999 / A&E NOW'
  },

  // ── ALLERGY ──────────────────────────────────────────────────────────
  {
    system: 'Allergy',
    symptom: 'Severe allergic reaction: face/tongue/throat swelling + breathing difficulty',
    keywords: [
      'allergic reaction', 'face swelling', 'tongue swelling', 'throat closing',
      'anaphylaxis', 'can\'t swallow', 'lips swelling', 'throat swelling',
      'tongue huge', 'face puffed up', 'throat tight', 'epipen', 'adrenaline pen',
      'hives can\'t breathe', 'all over rash can\'t breathe', 'swelling up',
      'allergic reaction breathing', 'mouth swelling'
    ],
    action: 'CALL 999 NOW'
  },

  // ── MENTAL HEALTH ────────────────────────────────────────────────────
  {
    system: 'Mental Health',
    symptom: 'Suicide attempt in progress or immediate danger to self/others',
    keywords: [
      'suicide attempt', 'taken overdose', 'harming self now', 'danger to others',
      'going to kill', 'overdose now', 'hurting themselves now', 'jumping off',
      'trying to end it', 'wants to die now', 'cutting themselves now',
      'threatening to kill', 'harming others', 'violent now', 'self-harm in progress',
      'suicide in progress', 'taken all pills', 'swallowed pills'
    ],
    action: 'CALL 999 + Alert Clinician'
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
  { id: 11, scenario: "A parent calls about their 2-year-old who has a high temperature, is floppy, and has some spots on their tummy that don't fade when pressed with a glass.", correctAnswer: '999', explanation: 'Child with fever + non-blanching rash (glass test positive) = suspected meningitis/meningococcal disease (NICE NG240). CALL 999 IMMEDIATELY.', options: [{ id: '999', text: 'Call 999 NOW' }, { id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'utc', text: 'Send to UTC' }, { id: 'healthier-together', text: 'Healthier Together' }] },
  { id: 12, scenario: "A 55-year-old woman with breast cancer on chemotherapy calls saying she has new severe back pain and her legs feel weak and tingly since yesterday.", correctAnswer: '999', explanation: 'Known cancer + new back pain + leg weakness/tingling = possible malignant spinal cord compression (MSCC). This is an emergency - CALL 999. Delay risks permanent paralysis.', options: [{ id: '999', text: 'Call 999 NOW' }, { id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'book-gp', text: 'Book routine GP' }, { id: 'calmcare', text: 'CalmCare for back pain' }] }
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
