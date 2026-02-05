// lib/data.js - All triage data for the application
// Cross-checked against NHS.uk, NICE NG12 (Apr 2025), UK Sepsis Trust, UKHSA guidance
// Last reviewed: 05 February 2026

export const redFlags = [
  {
    id: 'chest-pain',
    keywords: ['chest pain', 'tight chest', 'pressure chest', 'pain arm jaw', 'heart attack'],
    description: 'Chest pain / tight chest / pressure / pain spreading to arm or jaw',
    action: 'CALL 999 NOW',
    category: 'cardiac'
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
    description: 'Worst headache of my life / sudden severe headache',
    action: 'CALL 999 NOW',
    category: 'neurological'
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
    keywords: ['back pain bladder', 'can\'t control bowels', 'numb between legs', 'saddle numbness', 'legs giving way', 'pins needles genitals', 'pins needles between legs', 'numb genitals'],
    description: 'Back pain + can\'t control bladder/bowels + numb/pins & needles between legs or genitals (cauda equina)',
    action: 'CALL 999 NOW',
    category: 'neurological'
  },
  {
    id: 'sepsis',
    keywords: ['acting confused', 'rash doesn\'t fade', 'blotchy skin', 'mottled', 'feels like dying', 'very fast breathing', 'cold hands feet', 'very high temperature', 'very low temperature', 'meningitis', 'glass test'],
    description: 'Sepsis / meningitis signs: acting confused / rash doesn\'t fade (glass test) / blotchy skin / cold hands & feet / feels like dying',
    action: 'CALL 999 NOW',
    category: 'sepsis'
  },
  {
    id: 'testicular',
    keywords: ['testicle pain', 'testicular pain', 'groin pain sudden', 'balls pain vomiting'],
    description: 'Sudden severe groin/testicle pain with vomiting',
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
    keywords: ['blood in urine', 'flank pain fever', 'back pain fever', 'male UTI', 'male urinary', 'catheter problem', 'pregnant UTI'],
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
    id: 'cancer-amber',
    category: 'Possible Cancer Red Flags',
    keywords: ['new lump', 'breast lump', 'unexplained weight loss', 'unexplained bleeding', 'change bowels 6 weeks', 'difficulty swallowing', 'blood urine', 'postmenopausal bleeding', 'hoarse voice 3 weeks', 'night sweats', 'persistent cough 3 weeks', 'persistent rectal bleeding', 'blood in poo', 'non-healing ulcer', 'sore won\'t heal', 'mole changed'],
    action: 'GP Triager (urgent referral pathway - NICE NG12, Apr 2025)',
    searchTerms: ['lump', 'weight loss', 'cancer', 'bleeding', 'swallowing', 'cough persistent']
  },
  {
    id: 'pregnancy-early-amber',
    category: 'Pregnancy < 18 weeks',
    keywords: ['pregnant pain', 'pregnant bleeding', 'pregnant can\'t keep fluids', 'early pregnancy pain', 'pregnant vomiting'],
    action: 'GP Triager / Same Day. ⚠️ If <12wks + one-sided pain + shoulder tip → 999 (ectopic - see RED flags)',
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
    action: 'GP Triager + Crisis Line: 0800 028 8000',
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
    group: 'Pregnant or recently had baby (postnatal)',
    icon: '🤰',
    conditions: ['Any infection', 'Bleeding', 'Headache', 'Tummy pain', 'Breathlessness'],
    action: 'Escalate to GP Triager',
    note: 'Planned postnatal checks can still be booked directly'
  },
  {
    id: 'immunosuppressed',
    group: 'Weakened immune system',
    icon: '💊',
    conditions: ['Chemotherapy', 'Organ transplant', 'Biologic medicines', 'Long-term steroids', 'Advanced HIV'],
    action: 'Any suspected infection, fever, or feeling unwell → GP Triager',
    note: 'Do not use Pharmacy First for infections'
  },
  {
    id: 'frail',
    group: 'Frail elderly / Care home resident',
    icon: '👴',
    conditions: ['Falls', 'New confusion', 'Infection', 'Dehydration', 'Breathlessness'],
    action: 'Lower threshold to escalate → GP Triager',
    note: 'Small changes can indicate serious illness'
  },
  {
    id: 'chronic',
    group: 'Severe chronic conditions',
    icon: '❤️',
    conditions: ['Severe asthma/COPD', 'Heart failure', 'Severe kidney disease', 'Insulin-treated diabetes'],
    action: 'Any new or worsening symptoms → GP Triager',
    note: 'Avoid delays in assessment'
  },
  {
    id: 'baby',
    group: 'Baby under 1 year old',
    icon: '👶',
    conditions: ['All medical concerns'],
    action: 'Direct to GP Triager (NOT self-care)',
    note: 'Unless RED flags → then 999'
  },
  {
    id: 'safeguarding',
    group: 'Safeguarding concerns / Learning disability / Severe mental illness',
    icon: '🛡️',
    conditions: ['Any unclear or worrying request'],
    action: 'Escalate to GP Triager',
    note: 'Follow reasonable adjustments and safeguarding policy'
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
  { id: 5, scenario: "A 35-year-old woman on chemotherapy for breast cancer calls with a temperature of 38.2°C and feeling unwell.", correctAnswer: 'gp-triager', explanation: 'Immunosuppressed patients (chemotherapy) with any signs of infection need urgent GP Triager review - do NOT use Pharmacy First.', options: [{ id: '999', text: 'Call 999' }, { id: 'gp-triager', text: 'Send to GP Triager (urgent)' }, { id: 'pharmacy-first', text: 'Pharmacy First' }, { id: 'calmcare', text: 'CalmCare self-care' }] },
  { id: 6, scenario: "A patient's notes show a task from 2 weeks ago: 'Book diabetes annual review - bloods + foot check due'. The patient calls to book this.", correctAnswer: 'direct-book', explanation: 'This is clearly planned and due in EMIS. Book directly with the chronic disease nurse - no need for GP Triager.', options: [{ id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'direct-book', text: 'Book directly (bloods + nurse review)' }, { id: 'ask-clinician', text: 'Ask a clinician first' }, { id: 'pharmacy-first', text: 'Pharmacy First' }] },
  { id: 7, scenario: "A 52-year-old man calls saying he's found a new lump in his neck. It's been there about 2 weeks and is getting bigger.", correctAnswer: 'gp-triager', explanation: 'New lump is a possible cancer red flag. Must go to GP Triager for urgent assessment - do not book routine or signpost to self-care.', options: [{ id: '999', text: 'Call 999' }, { id: 'gp-triager', text: 'Send to GP Triager (urgent)' }, { id: 'pharmacy-first', text: 'Pharmacy First' }, { id: 'routine-gp', text: 'Book routine GP appointment' }] },
  { id: 8, scenario: "A 25-year-old woman calls wanting emergency contraception after unprotected sex last night.", correctAnswer: 'signpost', explanation: 'Emergency contraception can be obtained from pharmacy (over the counter) or Wolverton Centre. No GP appointment needed.', options: [{ id: 'gp-triager', text: 'Send to GP Triager' }, { id: 'signpost', text: 'Signpost to pharmacy or Wolverton Centre' }, { id: 'book-gp', text: 'Book GP appointment' }, { id: 'utc', text: 'Send to UTC' }] }
];
