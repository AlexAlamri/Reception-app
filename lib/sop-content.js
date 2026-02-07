// lib/sop-content.js - Three-Tier Triage Care Navigation SOP content for in-app reference

export const sopMeta = {
  version: '3.0',
  date: 'February 2026',
  appliesTo: 'Tier 1: Reception / Care Navigation | Tier 2: Experienced Non-Clinical Triagers | Tier 3: GP Triager',
  owner: 'Dr Sahar Jahanian',
  reviewDate: 'August 2026',
  practices: 'Churchill Medical Centre & The Orchard Practice',
  supersedes: 'v2.0 (06 February 2026) – three-tier introduction'
};

export const sopSections = [
  {
    id: 'purpose',
    number: '1',
    title: 'Purpose & Boundaries',
    icon: '📋',
    content: [
      {
        type: 'text',
        text: 'This SOP supports a three-tier model where reception staff recognise and route, experienced non-clinical triagers process and book protocol-clear items, and a GP (or other clinician) reviews all requests requiring clinical judgement (the GP triager).'
      },
      {
        type: 'highlight',
        color: 'red',
        text: 'NON-CLINICAL STAFF DO NOT DIAGNOSE, INTERPRET RESULTS, OR DECIDE CLINICAL URGENCY'
      },
      {
        type: 'highlight',
        color: 'amber',
        text: "Use patient's EXACT words \u2022 Check EMIS FIRST \u2022 If unsure at ANY point \u2192 escalate UP"
      },
      {
        type: 'highlight',
        color: 'green',
        text: 'A false escalation is safe. A missed escalation is not.'
      },
      {
        type: 'highlight',
        color: 'blue',
        text: 'Every day there will be a Clinical GP Triager from 8am as well as duty/on call clinician on site for emergencies.'
      },
      {
        type: 'list',
        title: 'Tier 1 Reception / Care Navigation Staff SHOULD:',
        color: 'green',
        items: [
          'Check the record for existing plans and alerts before actioning a request',
          'Book clearly planned follow-ups, EMIS alerts and due monitoring directly',
          'Signpost to Pharmacy First, community pharmacy, self-care cards and local self-referral services when appropriate',
          'Escalate any concerning words or high-risk patients to the duty clinician / GP triager',
          'Use common sense: if unsure, ask a clinician'
        ]
      },
      {
        type: 'list',
        title: 'Tier 1 Reception / Care Navigation Staff should NOT:',
        color: 'red',
        items: [
          'Ask detailed clinical questions to decide urgency',
          'Tell a patient their diagnosis',
          'Interpret test results',
          'Advise on prescription medicines or antibiotic need',
          'Delay emergency care'
        ]
      }
    ]
  },
  {
    id: 'governance',
    number: '2',
    title: 'Governance Principles & Clinical Safety',
    icon: '🏛️',
    content: [
      {
        type: 'highlight',
        color: 'red',
        text: 'Each tier operates ONLY within defined protocols. Non-clinical staff PROCESS and ROUTE \u2014 they do not DECIDE clinical urgency.'
      },
      {
        type: 'list',
        title: 'Core Principles:',
        color: 'blue',
        items: [
          'Scope of practice: Each tier operates ONLY within defined protocols. Non-clinical staff PROCESS and ROUTE \u2014 they do not DECIDE clinical urgency.',
          'Escalation bias: Always escalate UP, never down. A false escalation is safe; a missed escalation is not.',
          'Time limits: Tier 2 must action all requests within 2 hours. Amber flags within 1 hour. Unresolved end-of-day \u2192 auto-escalates to GP Triager.'
        ]
      },
      {
        type: 'subsection',
        title: 'Audit & Oversight (Exception-Based Model)',
        content: [
          {
            type: 'list',
            color: 'blue',
            items: [
              "Real-time significant event flagging \u2014 Tier 2 flags any case where protocol didn't fit or confidence was low. GP Triager reviews promptly.",
              'Monthly structured audit \u2014 10-case fixed sample + all flagged exceptions. CQC-defensible under Regulation 17.',
              'Quarterly thematic review \u2014 Q1: Amber bookings. Q2: Self-care/Pharmacy First. Q3: Cancer pathways. Q4: High-risk handling.',
              'Digital logging \u2014 Tier 2 documents who/what/why/safety-net in EMIS at point of action. Monthly audit via EMIS search.'
            ]
          }
        ]
      },
      {
        type: 'model-overview',
        tiers: [
          { tier: 'TIER 1', who: 'Reception / Care Navigators', scope: 'Recognise red flags \u2192 999. Check EMIS. Signpost self-care / Pharmacy First / external pathways. Direct-book planned items. Forward ALL else to Tier 2.', escalatesTo: 'Tier 2 (standard) or 999/A&E (emergency)' },
          { tier: 'TIER 2', who: 'Experienced Non-Clinical Triagers (x2 rota)', scope: 'PROCESS & BOOK (not decide urgency). Match amber patterns \u2192 same-day duty GP. Process admin with GP sign-off. Book routine where EMIS plan clear. Escalate unclear/multi-problem.', escalatesTo: 'Tier 3 GP Triager. Must action within 2hrs.' },
          { tier: 'TIER 3', who: 'GP Triager (daily from 8am)', scope: 'All clinical decisions. eConsults. 2WW/cancer pathways. Medication decisions. Monthly audit of Tier 2. Retains clinical responsibility.', escalatesTo: 'Books appt / eConsult / referral / prescribing' }
        ]
      }
    ]
  },
  {
    id: 'golden-rules',
    number: '3',
    title: 'Golden Rules',
    icon: '\u2B50',
    content: [
      {
        type: 'list',
        title: 'Always follow these rules:',
        color: 'amber',
        items: [
          "Use the patient's own words. Do not translate into medical terms.",
          'If the request mentions a red-flag word, stop and escalate (see Section 9).',
          'Check EMIS notes, problems and alerts first (Section 5).',
          'If it is clearly due / planned: book it. Do not ask for a triage form (Section 6).',
          'If it is suitable for Pharmacy First or self-care: signpost and safety-net (Sections 7\u20138).'
        ]
      },
      {
        type: 'highlight',
        color: 'amber',
        text: 'If you feel unsure at any point: ask a clinician.'
      }
    ]
  },
  {
    id: 'quick-flow',
    number: '4',
    title: 'Quick Flow: Tier 1 Reception Steps',
    icon: '🔄',
    content: [
      {
        type: 'highlight',
        color: 'red',
        text: 'GOVERNANCE NOTE: Tier 1 staff recognise specific words/phrases only. They do not assess symptoms, compare to previous presentations, or judge severity. This is administrative pattern-matching, not clinical triage.'
      },
      {
        type: 'steps',
        items: [
          { step: '1', label: 'EMERGENCY NOW?', detail: 'Life-threatening symptoms (chest pain, stroke signs, severe breathlessness, collapse, sepsis words, suicide attempt in progress).', action: 'Section 9A: Call 999 / advise A&E now / escalate to duty GP.', color: 'red' },
          { step: '2', label: 'CHECK EMIS (MANDATORY)', detail: 'Look for existing plans, recalls, alerts, vulnerability flags, recent letters.', action: 'Record findings. These travel with the request through all tiers.', color: 'blue' },
          { step: '3', label: 'NEW PROBLEM OR ONGOING?', detail: 'Based on EMIS: has a clinician already reviewed THIS specific problem? PLAN EXISTS \u2192 direct book per plan. WORSENED/CHANGED \u2192 treat as NEW.', action: 'If plan exists \u2192 book per plan (Section 6). If no plan/worsened/new \u2192 continue.', color: 'blue' },
          { step: '4', label: 'HIGH-RISK OR VULNERABLE PATIENT?', detail: 'Check Section 10. If YES \u2192 forward to Tier 2 with HIGH RISK flag. Do NOT use self-care or Pharmacy First.', action: 'If high risk \u2192 forward to Tier 2 with flag. If not \u2192 continue.', color: 'amber' },
          { step: '5', label: 'SPECIFIC EXTERNAL PATHWAY?', detail: 'Eye, injury, pregnancy, sexual health, mental health, fit note.', action: 'Use the quick-match grid (Section 5A). If it fits \u2192 take the action. If not \u2192 continue.', color: 'blue' },
          { step: '6', label: 'PHARMACY FIRST / SELF-CARE?', detail: 'Minor illness, single symptom, short history, no flags.', action: 'Pharmacy First (Section 7) if eligible. Self-care (Section 8): Adult \u2192 CalmCare | Child \u2192 Healthier Together. If declined \u2192 forward to Tier 2.', color: 'green' },
          { step: '7', label: 'DEFAULT \u2192 FORWARD TO TIER 2', detail: 'Anything else: multiple problems, severe/worsening, >2 weeks, not improving, new lump / night sweats / unexplained bleeding / weight loss, patient anxious, any uncertainty.', action: "Forward with: patient's EXACT words, EMIS findings, NEW/ONGOING status, flags noticed, if self-care declined + reason, contact details.", color: 'gray' }
        ]
      }
    ]
  },
  {
    id: 'emis-checking',
    number: '5',
    title: 'EMIS Checking',
    icon: '🖥️',
    content: [
      {
        type: 'highlight',
        color: 'blue',
        text: 'This is mandatory. It prevents duplicated work and keeps patients safe.'
      },
      {
        type: 'list',
        title: 'Look for:',
        color: 'blue',
        items: [
          "A clear follow-up plan in the most recent consultation (e.g. 'book bloods in 1 week' or 'review in 4 weeks')",
          'EMIS recalls and alerts (annual reviews, medication monitoring, immunisations)',
          'Major vulnerability/high risk flags (pregnancy, learning disability, safeguarding, palliative care, severe frailty, immunosuppression)',
          'Recent hospital letters / discharge summaries relevant to the request',
          'Recent test results that already answer the question (do not interpret results \u2014 just note they exist/relay existing clinician comment)'
        ]
      },
      {
        type: 'list',
        title: 'When you forward to Tier 2 / GP triager, include:',
        color: 'green',
        items: [
          "The patient's request in their own words (copy/paste if possible)",
          'Any relevant existing plan you found',
          'Any relevant vulnerability / risk flags you can see',
          'NEW or ONGOING status + any change/worsening words',
          'How to contact the patient and when they are available'
        ]
      }
    ]
  },
  {
    id: 'pathway-grid',
    number: '5A',
    title: 'Quick-Match Pathway Grid',
    icon: '🗺️',
    content: [
      {
        type: 'text',
        text: "Find the pathway, take the action. If it doesn't fit \u2192 continue to Step 6 (Pharmacy First / Self-Care)."
      },
      {
        type: 'pathway-grid',
        items: [
          { icon: '\uD83D\uDC41\uFE0F', pathway: 'Eye', symptoms: 'Red eye, painful eye, floaters, flashes, stye', action: 'CUES via local optician (self-refer)', contact: 'primaryeyecare.co.uk' },
          { icon: '\uD83D\uDC41\uFE0F', pathway: 'Eye (urgent)', symptoms: 'Vision loss, shingles near eye, contact lens + pain', action: 'Royal Eye Unit', contact: '020 8934 6799' },
          { icon: '\uD83D\uDC41\uFE0F', pathway: 'Eye (999)', symptoms: 'Chemical splash, penetrating injury, acute glaucoma, sudden vision loss + stroke', action: 'CALL 999 / A&E NOW', contact: '' },
          { icon: '🤕', pathway: 'Injury/Burn', symptoms: 'Cuts needing stitches, minor burns, sprains, possible fracture', action: 'Richmond UTC Teddington (8am\u20138pm)', contact: 'Book via NHS 111' },
          { icon: '🤕', pathway: 'Injury (999)', symptoms: 'Major trauma, heavy bleeding, head injury + confusion', action: 'CALL 999 / A&E NOW', contact: '' },
          { icon: '🤰', pathway: 'Pregnancy booking', symptoms: 'New pregnancy, need to register', action: 'Self-refer Kingston Maternity online', contact: 'kingstonmaternity.org.uk' },
          { icon: '🤰', pathway: 'Pregnancy >18wks', symptoms: 'Reduced movements, bleeding, waters, contractions', action: 'Maternity Helpline', contact: '0208 934 2802 (24/7)' },
          { icon: '🤰', pathway: 'Pregnancy <18wks', symptoms: "Abdominal pain, bleeding, can't keep fluids", action: 'Forward to Tier 2 as AMBER', contact: 'Same-day' },
          { icon: '🤰', pathway: 'Pregnancy <12wks', symptoms: 'One-sided pain + shoulder tip pain (ectopic)', action: 'CALL 999 / A&E NOW', contact: '' },
          { icon: '\u2764\uFE0F', pathway: 'Sexual health', symptoms: 'Contraception, STI testing, genital symptoms', action: 'Wolverton Centre (self-refer)', contact: '0208 974 9331' },
          { icon: '🧠', pathway: 'Mental health', symptoms: 'Low mood, anxiety, stress (non-crisis)', action: 'Kingston Talking Therapies', contact: 'Self-refer online' },
          { icon: '🧠', pathway: 'Mental health (crisis)', symptoms: 'Suicidal plan, self-harm with intent, psychosis', action: 'Tier 2 \u2192 MUST escalate Tier 3 + Crisis Line', contact: '0800 028 8000' },
          { icon: '📝', pathway: 'Fit note (renewal)', symptoms: 'Renewal >7 days before expiry', action: 'Advise re-contact within 3 days of expiry', contact: '' },
          { icon: '📝', pathway: 'Fit note (renewal within 7 days)', symptoms: 'Renewal within 7 days + previously discussed + documented', action: 'Forward to Tier 2', contact: '' },
          { icon: '📝', pathway: 'Fit note (new + discussed)', symptoms: 'New + previously discussed with GP or hospital letter', action: 'Forward to Tier 2 (escalates to Tier 3)', contact: '' },
          { icon: '📝', pathway: 'Fit note (new + not discussed)', symptoms: 'New + NOT previously discussed', action: 'Forward to Tier 2 noting "new fit note, not yet seen by GP"', contact: '' }
        ]
      }
    ]
  },
  {
    id: 'direct-booking',
    number: '6',
    title: 'Direct Booking',
    icon: '📅',
    content: [
      {
        type: 'table',
        headers: ['Item', 'Check in EMIS', 'Book with / Timeframe', 'Warning'],
        rows: [
          ['Follow-up already planned', 'Most recent consultation notes / task / SMS plan', 'Book with clinician stated, use timeframe stated', 'If unclear who/when \u2192 send to Tier 2'],
          ['Blood tests due', 'Recall/alert + last monitoring date + clinician plan', 'Phlebotomy / HCA slot', 'If patient says very unwell \u2192 escalate'],
          ['ECG due / requested', 'Clear plan in notes or hospital letter; not already booked', 'ECG appointment (HCA/nurse)', 'If chest pain NOW \u2192 999'],
          ['Annual / chronic disease review', 'Recall alerts (diabetes, asthma, COPD, BP, CKD, CHD, stroke)', 'Nurse/HCA chronic disease review + pre-review bloods if needed', 'If flare-up or red flags \u2192 GP Triager'],
          ['Diabetes annual review package', 'Diabetes recall alert + bloods and foot check due', 'Bloods + review per local pathway', 'If BM <4 or >20, confusion, fruity breath, vomiting \u2192 escalate'],
          ['Postnatal check', 'Delivery date / postnatal recall, not already completed', 'Postnatal check per local policy', 'Heavy bleeding, severe headache, chest pain, breathlessness \u2192 Section 9'],
          ['Immunisations / vaccines due', 'Immunisation record + recall flags', 'Vaccination clinic', 'Vaccine side effects \u2192 CalmCare unless red flags'],
          ['Cervical screening / smear due', 'Cervical screening recall status', 'Nurse/HCA trained for smears', 'Post-coital bleeding, PMB, or lump \u2192 GP Triager'],
          ['Planned dressing / suture removal', 'Documented plan from clinician/UTC/hospital', 'Treatment room nurse', 'NEW wounds needing assessment \u2192 UTC']
        ]
      },
      {
        type: 'highlight',
        color: 'amber',
        text: 'If the patient is asking for a NEW medical problem (not planned/due), do not directly book a GP appointment. Forward to Tier 2 / GP triager.'
      }
    ]
  },
  {
    id: 'pharmacy-first',
    number: '7',
    title: 'Community Pharmacy + Pharmacy First',
    icon: '💊',
    content: [
      {
        type: 'text',
        text: 'Community pharmacies can help with many minor illnesses, medicines advice, and some urgent prescriptions. In Kingston (SWL ICB), the NHS Pharmacy First service also lets pharmacists assess and treat certain conditions under agreed clinical pathways.'
      },
      {
        type: 'list',
        title: 'Two options:',
        color: 'blue',
        items: [
          'Signposting: you tell the patient they can go to a pharmacy and the patient chooses where/when.',
          'Referral: your practice sends a digital referral to a participating pharmacy (local policy).'
        ]
      },
      {
        type: 'list',
        title: 'Use Pharmacy First when:',
        color: 'green',
        items: [
          'The request is clearly one of the Pharmacy First conditions below',
          'No red flags are mentioned',
          'The patient is not in a high-risk group (Section 10)',
          'The patient agrees to be directed/referred'
        ]
      },
      {
        type: 'highlight',
        color: 'amber',
        text: 'If any doubt, or the request is too vague to safely signpost, send to Tier 2 / GP triager.'
      },
      {
        type: 'script',
        title: 'Pharmacy First Script',
        text: '"We can refer you to your local Pharmacy First Service for further assessment & treatment, including prescription-only treatment such as antibiotics and antivirals, without waiting for a GP."'
      },
      {
        type: 'conditions',
        title: 'Pharmacy First Conditions (8 NHS England Pathways):',
        items: [
          { name: 'Sore throat', age: '5yr+' },
          { name: 'Earache', age: '1\u201317yr' },
          { name: 'Sinusitis', age: '12yr+' },
          { name: 'Infected insect bite', age: '1yr+' },
          { name: 'Impetigo', age: '1yr+' },
          { name: 'Shingles', age: '18yr+' },
          { name: 'UTI (women)', age: '16\u201364yr' },
          { name: 'Acute Otitis Media', age: '1\u201317yr' }
        ]
      }
    ]
  },
  {
    id: 'self-care',
    number: '8',
    title: 'Self-Care: CalmCare / Healthier Together',
    icon: '🏠',
    content: [
      {
        type: 'checklist',
        title: 'Use ONLY if ALL true:',
        color: 'green',
        items: [
          'Minor SINGLE symptom',
          'Short-lived (<7 days, not recurring)',
          'NO red/amber flags',
          'NOT high-risk patient',
          'NOT "severe / worsening / worst ever"',
          'Clearly matches ONE resource',
          'Patient agrees'
        ]
      },
      {
        type: 'two-column',
        left: {
          title: 'Adults: CalmCare Cards',
          items: [
            'Pick the closest matching card from CalmCare A\u2013Z',
            'Send card link (or printout) to patient',
            'Add record: "CalmCare advice given + safety net provided"',
            'Always include safety-net line'
          ]
        },
        right: {
          title: 'Children: Healthier Together',
          link: 'https://www.healthiertogether.nhs.uk/',
          items: [
            'Choose right age section (1\u20134 yrs, 5\u201311 yrs, Young person)',
            'Search symptom, open closest matching page',
            'Share link via link/QR/text/Accurx',
            'Ask patient to follow advice including Red/Amber guidance'
          ]
        }
      },
      {
        type: 'do-dont',
        donts: [
          { bad: '"It\'s minor."', good: '"This is the quickest safe first step."' },
          { bad: '"Just look at this link."', good: '"This advice tells you exactly when to seek help."' },
          { bad: '"We don\'t do appointments for that."', good: '"If it doesn\'t fit, or you\'re worse, we can escalate to the GP triager."' },
          { bad: '"You don\'t need a GP."', good: '' }
        ]
      },
      {
        type: 'script',
        title: 'CalmCare Script (Adults)',
        text: '"Thanks for explaining. We have an NHS-aligned self-care card for adults called CalmCare. I\'ll send you the most relevant one now. It tells you what to do today and when you should get medical help. If it doesn\'t feel right for your situation, or you\'re not improving, contact us again and we\'ll pass it to the GP triager. If you develop chest pain, severe breathlessness, collapse, confusion, or heavy bleeding, call 999."'
      },
      {
        type: 'script',
        title: 'Healthier Together Script (Children)',
        text: '"Thanks. Because this is for a child/young person, we use the NHS Healthier Together advice. I\'ll send you the link for the right symptom and age. Please follow the advice on the page, including the Red/Amber guidance. If you\'re worried or they\'re getting worse, please let us know if appropriate within the advice or use NHS 111, and call 999 for emergencies."'
      },
      {
        type: 'highlight',
        color: 'amber',
        text: 'If patient declines BECAUSE they feel symptoms are worse than you think \u2192 this is a safety signal. Forward to Tier 2 and flag: "Patient declined self-care, feels symptoms are more serious."'
      },
      {
        type: 'highlight',
        color: 'red',
        text: 'ALWAYS SAFETY-NET: "If not improving, or you\'re worried, contact us again. For chest pain, severe breathlessness, collapse, confusion, or heavy bleeding \u2192 call 999."'
      }
    ]
  },
  {
    id: 'red-flags',
    number: '9A',
    title: 'RED: ESCALATE \u2014 Call 999 / Advise A&E Now',
    icon: '🚨',
    content: [
      {
        type: 'highlight',
        color: 'red',
        text: 'Reception do not triage. This section is only about spotting words/phrases already present in the request and recognising the need for escalation. STOP if patient mentions ANY of these. ONE action: CALL 999 / Advise A&E NOW.'
      },
      {
        type: 'red-flags-table',
        items: [
          { system: 'CARDIAC', symptom: 'Chest pain / tight chest / pressure, especially with sweating, nausea, light-headedness, or pain spreading to arm / neck / jaw / back', action: 'Call 999 / advise A&E now' },
          { system: 'CARDIAC', symptom: 'Sudden tearing/ripping chest or back pain radiating between shoulder blades (aortic dissection)', action: 'Call 999 / advise A&E now' },
          { system: 'RESPIRATORY', symptom: '"Can\'t breathe" / "Can\'t speak" / blue or grey lips / breathing very fast', action: 'Call 999 / advise A&E now' },
          { system: 'RESPIRATORY', symptom: 'Severe allergic reaction: swelling of face/tongue/throat, difficulty breathing, widespread hives with breathing symptoms', action: 'Call 999 / advise A&E now' },
          { system: 'NEUROLOGICAL', symptom: 'Stroke signs (FAST): face drooping, arm weakness, slurred speech, sudden confusion', action: 'Call 999 / advise A&E now' },
          { system: 'NEUROLOGICAL', symptom: 'Collapsed / unconscious / fitting / seizure / not responding', action: 'Call 999 / advise A&E now' },
          { system: 'NEUROLOGICAL', symptom: '"Worst headache of my life" (sudden onset) +/\u2013 neck stiffness / sensitivity to light', action: 'Call 999 / advise A&E now' },
          { system: 'NEUROLOGICAL', symptom: 'Back pain + NEW loss of bladder/bowel control or numbness between legs (cauda equina)', action: 'Call 999 / advise A&E now' },
          { system: 'SEPSIS / MENINGITIS', symptom: 'Sepsis (NICE NG253): "acting confused", mottled/ashen skin, "feels like dying", very fast breathing, no urine 18+ hrs. Can occur WITHOUT fever.', action: 'Call 999 / advise A&E now' },
          { system: 'SEPSIS / MENINGITIS', symptom: 'Meningitis (NICE NG240): non-blanching rash (glass test) + fever + stiff neck. Check palms, soles, mouth on darker skin.', action: 'Call 999 / advise A&E now' },
          { system: 'SEPSIS / MENINGITIS', symptom: 'Child with non-blanching rash \u2013 assume meningitis until proven otherwise.', action: 'Call 999 / advise A&E now' },
          { system: 'GI / ABDOMINAL', symptom: "Vomiting blood / black tarry stools / heavy bleeding that won't stop", action: 'Call 999 / advise A&E now' },
          { system: 'GI / ABDOMINAL', symptom: "Severe sudden abdominal pain / rigid abdomen / can't move with pain", action: 'Call 999 / advise A&E now' },
          { system: 'GI / ABDOMINAL', symptom: "Can't pass poo or wind with severe abdominal pain (bowel obstruction)", action: 'Call 999 / advise A&E now' },
          { system: 'VASCULAR', symptom: 'Sudden cold, white, painful leg or arm / no pulse in foot (acute limb ischaemia) (NICE NG224)', action: 'Call 999 / advise A&E now' },
          { system: 'UROLOGICAL', symptom: "Can't pee at all with severe pain (urinary retention)", action: 'Call 999 / advise A&E now' },
          { system: 'UROLOGICAL', symptom: 'Sudden severe testicular/groin pain with vomiting (torsion)', action: 'Call 999 / advise A&E now' },
          { system: 'OBSTETRIC', symptom: 'Pregnancy <12 weeks + one-sided pain + shoulder tip pain (possible ectopic)', action: 'Call 999 / A&E now' },
          { system: 'ONCOLOGY', symptom: 'Known cancer + new back pain + leg weakness/numbness (MSCC) (NICE CG75)', action: 'Call 999 / advise A&E now' },
          { system: 'EYE', symptom: 'Severe eye pain + headache + vomiting + haloes around lights (acute angle-closure glaucoma)', action: 'Call 999 / A&E or Royal Eye Unit URGENT' },
          { system: 'EYE', symptom: 'Chemical splash / penetrating injury / sudden vision loss with stroke signs', action: 'Call 999 / A&E now' },
          { system: 'ALLERGY', symptom: 'Severe allergic reaction: face/tongue/throat swelling + breathing difficulty', action: 'Call 999 / advise A&E now' },
          { system: 'MENTAL HEALTH', symptom: 'Suicide attempt in progress or immediate danger to self/others', action: 'Call 999 / advise A&E now. Alert duty clinician.' }
        ]
      },
      {
        type: 'highlight',
        color: 'blue',
        text: 'Crisis contacts: Mental health crisis line: 0800 028 8000 (adults) | CAMHS crisis (<18yrs): 0203 228 5980 | On-site ambulance: 020 3162 7525'
      }
    ]
  },
  {
    id: 'amber-flags',
    number: '9B',
    title: 'AMBER: Urgent Same-Day Clinician Review',
    icon: '🟠',
    content: [
      {
        type: 'highlight',
        color: 'amber',
        text: 'Tier 1 recognises amber buzzwords and forwards to Tier 2. Tier 2 books same-day with duty GP for clear amber matches. Mental health with active plan, safeguarding, and possible cancer ALWAYS go to Tier 3.'
      },
      {
        type: 'amber-table',
        items: [
          { category: 'Breathing / Cough', buzzwords: 'New/worsening breathlessness, wheeze, asthma/COPD flare, coughing blood, fever + chest pain', action: 'Same-day duty GP', notes: '' },
          { category: 'Abdominal / GI', buzzwords: "Severe persistent pain, can't keep fluids, persistent vomiting, severe diarrhoea, diabetes + vomiting", action: 'Same-day duty GP', notes: '' },
          { category: 'Diabetes urgent', buzzwords: 'BM <4 or >20, shaking/sweating/confusion, fruity breath, persistent vomiting, Type 1 unwell', action: 'Same-day duty GP', notes: '' },
          { category: 'Urinary', buzzwords: 'Blood in urine, flank/back pain + fever, male urinary symptoms, catheter problem, pregnancy + UTI symptoms', action: 'Same-day duty GP. NOT Pharmacy First.', notes: '' },
          { category: 'Neurology / Headache', buzzwords: 'Sudden severe headache, new weakness/numbness, new confusion, blackout/fainting. If stroke signs \u2192 999', action: 'Same-day duty GP. Stroke \u2192 999.', notes: '' },
          { category: 'Skin / Infection', buzzwords: 'Rapidly spreading redness, face/eye involvement, rigors, very unwell, tracking redness', action: 'Same-day duty GP', notes: '' },
          { category: 'Eye problems', buzzwords: 'Painful red eye, sudden loss of vision, flashes/floaters, injury/chemical splash', action: 'CUES / Royal Eye Unit. If severe \u2192 999/A&E', notes: '' },
          { category: 'DVT (NICE NG158)', buzzwords: 'Unilateral calf/leg swelling, red/hot leg, post-surgery/flight', action: 'URGENT same-day', notes: 'NICE NG158' },
          { category: 'PE (NICE NG158)', buzzwords: 'Sharp chest pain breathing, breathless + chest pain, post-surgery/flight', action: 'URGENT same-day', notes: 'NICE NG158' },
          { category: 'Temporal Arteritis', buzzwords: 'Headache in >50 + jaw pain chewing + scalp tenderness + vision', action: 'URGENT same-day. Risk of permanent vision loss.', notes: 'NICE NG244' },
          { category: 'Renal Colic', buzzwords: "Loin-to-groin pain, severe side pain, writhing/can't lie still", action: 'Same-day duty GP', notes: '' },
          { category: 'Fever Under-5s (NICE NG143)', buzzwords: 'Baby/toddler high temp, floppy, not feeding. Non-blanching rash \u2192 999', action: 'Same-day duty GP. Non-blanching rash \u2192 999.', notes: 'NICE NG143' },
          { category: 'Neutropenic Sepsis (NICE NG151)', buzzwords: 'Chemo/transplant + ANY fever', action: 'URGENT \u2192 may need 999. Do NOT use Pharmacy First.', notes: 'NICE NG151' },
          { category: 'Testicular Pain', buzzwords: 'Sore/swollen testicle. Sudden + vomiting \u2192 999', action: 'Same-day duty GP. Sudden + vomiting \u2192 999.', notes: '' },
          { category: "Women's Health", buzzwords: "Pregnancy <18wks + pain/bleeding, reduced movements (18+), postnatal bleeding/headache", action: 'Same-day or maternity triage. If severe: 999.', notes: '' },
          { category: 'Possible Cancer (NICE NG12)', buzzwords: 'New lump, unexplained weight loss/bleeding, bowel change >6wks, swallowing difficulty, PMB, voice hoarseness >3wks, night sweats, non-healing ulcer, mole changes, persistent bloating (women >50)', action: 'ESCALATE TIER 3 (2WW). Do not book routine without clinician review.', notes: 'NICE NG12' },
          { category: 'Safeguarding', buzzwords: 'Domestic abuse, sexual assault, child/adult safeguarding concern/alert', action: 'ESCALATE TIER 3 + duty clinician. Follow safeguarding policy.', notes: 'Always Tier 3' },
          { category: 'Mental Health', buzzwords: 'Suicidal with plan, self-harm with intent, psychotic, acute agitation', action: 'ESCALATE TIER 3 + Crisis Line. 0800 028 8000. CAMHS: 0203 228 5980', notes: 'Always Tier 3' }
        ]
      }
    ]
  },
  {
    id: 'high-risk',
    number: '10',
    title: 'High-Risk + Vulnerable Patients',
    icon: '🛡️',
    content: [
      {
        type: 'highlight',
        color: 'amber',
        text: 'If a patient is in one of these groups, do not rely on self-care or Pharmacy First if the request sounds infectious, severe, or unusual. Send to Tier 2 (who will escalate to GP triager for new symptoms) unless it is a clearly planned/due appointment.'
      },
      {
        type: 'risk-groups',
        items: [
          { group: 'Pregnant or recently pregnant (postnatal \u2013 up to 6 weeks)', action: 'Escalate medical symptoms (especially infection, bleeding, headache, abdominal pain, breathlessness). Planned postnatal checks can be booked directly.' },
          { group: 'Weakened immune system (chemotherapy, organ transplant, biologic/immunosuppressive medicines, long-term steroids, advanced HIV)', action: 'Escalate any suspected infection, shingles, widespread rash, fever, or feeling very unwell. Any fever in chemo patient = potential neutropenic sepsis (NICE NG151).' },
          { group: 'Frail older adults / care home residents', action: 'Lower threshold to escalate for falls, confusion, infection, dehydration, breathlessness. Higher sepsis risk (NICE NG253).' },
          { group: 'Severe long-term conditions (severe asthma/COPD, heart failure, severe kidney disease, ALL diabetes, liver disease)', action: 'Escalate new/worsening symptoms; avoid delays. All diabetes types are a sepsis risk factor (NICE NG253).' },
          { group: 'Known safeguarding concerns, severe mental illness, learning disability/autism with communication difficulty', action: 'Escalate unclear or worrying requests and follow local safeguarding / reasonable adjustments. Communication difficulties increase risk of missed sepsis (NICE NG253).' },
          { group: 'Under 1 year of age', action: 'Direct to Tier 2 who MUST escalate to GP Triager (Tier 3). Unless RED flags \u2192 999.' },
          { group: 'Under 5 years with NEW symptom', action: 'Forward to Tier 2 with HIGH RISK flag. Do NOT use self-care for under 5s with new symptoms (NICE NG143).' },
          { group: 'No spleen (post-splenectomy) / sickle cell disease', action: 'Any fever or suspected infection \u2192 URGENT escalation. Overwhelming sepsis risk (NICE NG253).' },
          { group: 'Cancer patients on active treatment', action: 'Any fever may be neutropenic sepsis (NICE NG151). New back pain + leg symptoms = possible MSCC \u2192 999 (NICE CG75). Escalate all new symptoms.' },
          { group: 'Spinal cord injury', action: 'Higher sepsis risk (NICE NG253). Any fever, feeling unwell, urinary symptoms, skin changes \u2192 escalate.' },
          { group: 'Recent surgery or hospitalisation (<6 weeks)', action: 'Higher risk of DVT/PE and surgical site infection (NICE NG158). Leg swelling, breathlessness, chest pain, wound infection \u2192 escalate.' },
          { group: 'Language barriers / Communication difficulties', action: 'Use interpreter services. Communication difficulties increase risk of missed serious illness (NICE NG253). Ensure safety-netting is understood.' },
          { group: 'Homeless / Rough sleepers / No fixed abode', action: 'Lower threshold to escalate. Higher infection and sepsis risk. Ensure follow-up plan is realistic.' },
          { group: 'Substance misuse / Alcohol dependence', action: 'Lower threshold to escalate. Higher infection and sepsis risk. Ensure follow-up plan is realistic.' }
        ]
      }
    ]
  },
  {
    id: 'utc',
    number: '11',
    title: 'Injuries, Burns, Wounds: UTC \u2014 Teddington',
    icon: '🩹',
    content: [
      {
        type: 'highlight',
        color: 'blue',
        text: 'Teddington Memorial Hospital, Hampton Road, Teddington TW11 0JL. Open 8am\u20138pm, 7 days. Book via NHS 111 or walk-in. X-ray available during set hours.'
      },
      {
        type: 'list',
        title: 'UTC can treat (adults & children):',
        color: 'green',
        items: [
          'Upper respiratory tract infections, coughs, colds, earache, sore throats, asthma exacerbations, flu-like symptoms',
          'Minor skin & tissue infections: rashes, insect bites, impetigo, minor cellulitis, abscesses, wound infections',
          'GI symptoms + UTIs: diarrhoea, vomiting, constipation, abdominal pain, oral thrush',
          'Minor injuries to head, limbs \u2014 bumps/bruising or possible fractures',
          'Eye conditions: conjunctivitis, chalazion, styes',
          'Wounds including burns/scalds and lacerations +/\u2013 requiring stitching',
          'Other: fever, headache, crying baby, baby not feeding, colic, foreign bodies (ear/nose), fainting, nose bleeds, emergency contraception'
        ]
      },
      {
        type: 'highlight',
        color: 'red',
        text: 'Do NOT direct to UTC if the request suggests a life-threatening emergency (Section 9A). Use 999/A&E.'
      }
    ]
  },
  {
    id: 'eye',
    number: '12',
    title: 'Eye Problems',
    icon: '\uD83D\uDC41\uFE0F',
    content: [
      {
        type: 'text',
        text: 'Reception can safely signpost most urgent eye problems to the local urgent community eye service (MECS) run by optometrists \u2014 NOT just a high-street eye test.'
      },
      {
        type: 'subsection',
        title: '12A. Primary Care Eye Service (MECS) \u2014 Self-Referral',
        content: [
          { type: 'text', text: 'Appropriate for many urgent eye problems: red eye, painful eye, sudden onset irritation, suspected foreign body, flashes/floaters, eyelid lumps/styes.' },
          { type: 'text', text: 'Patient can self-refer by contacting a participating local optician.' },
          { type: 'link', text: 'Primary Eye Care MECS', url: 'https://primaryeyecare.co.uk/services/minor-eye-conditions-service/' }
        ]
      },
      {
        type: 'subsection',
        title: '12B. Kingston Hospital \u2014 The Royal Eye Unit',
        content: [
          { type: 'text', text: 'Appointment only (no walk-in). For: new/worsening visual disturbance, vision loss, suspected shingles around forehead/face/eye, floaters/flashes, painful red eye +/\u2013 light sensitivity, painful red eye in contact lens wearer.' },
          { type: 'contact', service: 'Urgent eye problems', number: '020 8934 6799', hours: 'Mon\u2013Fri 8:30am\u20134:30pm (last appt 4pm)' },
          { type: 'contact', service: 'Main number', number: '020 8934 6404', hours: 'Mon\u2013Fri 9am\u20135pm' },
          { type: 'text', text: 'Out of hours: advise NHS 111 or A&E in an emergency.' }
        ]
      },
      {
        type: 'subsection',
        title: '12C. RED Eye Red Flags (999 / A&E)',
        content: [
          { type: 'list', color: 'red', items: [
            'Chemical splash to the eye',
            'Sudden loss of vision with other neurological symptoms (stroke symptoms)',
            'Penetrating injury or severe trauma',
            'Any eye problem with severe collapse/breathing difficulty',
            'Acute angle-closure glaucoma: severe eye pain + headache + vomiting + haloes + blurred vision + red eye \u2192 999/A&E or Royal Eye Unit URGENT'
          ] }
        ]
      }
    ]
  },
  {
    id: 'womens-health',
    number: '13',
    title: "Women's Health, Contraception & Pregnancy",
    icon: '🤰',
    content: [
      {
        type: 'subsection',
        title: '13A. Wolverton Centre (Sexual Health & Contraception) \u2014 Self-Referral',
        content: [
          { type: 'text', text: 'Contraception (pills, patches, injections, implants, coils, emergency contraception), genital symptoms (discharge, itching, painful sex, sores, pelvic pain where STI is a concern), STI testing and treatment.' },
          { type: 'contact', service: 'Wolverton Centre', number: '0208 974 9331' },
          { type: 'link', text: 'Sexual Health Kingston', url: 'https://www.sexualhealthkingston.co.uk/' },
          { type: 'highlight', color: 'amber', text: 'If severe pelvic pain, fainting/collapse, or heavy bleeding \u2192 escalate to clinician/999' }
        ]
      },
      {
        type: 'subsection',
        title: '13B. Antenatal (Pregnancy) \u2014 Self-Referral to Kingston Hospital',
        content: [
          { type: 'link', text: 'Kingston Maternity self-referral form', url: 'https://www.kingstonmaternity.org.uk/pregnancy/referral-form' },
          { type: 'highlight', color: 'blue', text: 'OVER 18 weeks \u2192 Contact Maternity Triage / DAU: 0208 934 2802' },
          { type: 'highlight', color: 'amber', text: "UNDER 18 weeks with abdominal pain/bleeding/vomiting (can't keep fluids) or shoulder tip pain \u2192 Duty / Same day" },
          { type: 'highlight', color: 'red', text: 'UNDER 12 weeks + one-sided abdominal pain + shoulder tip pain \u2192 999/A&E for possible ectopic pregnancy' }
        ]
      },
      {
        type: 'subsection',
        title: '13C. Maternity Triage / DAU: When to Use',
        content: [
          { type: 'text', text: 'More than 18 weeks pregnant with: reduced fetal movements, bleeding, waters breaking, contractions/labour, severe abdominal pain, severe headache/visual changes, or feeling very unwell.' },
          { type: 'contact', service: 'Maternity Helpline (24/7)', number: '0208 934 2802' },
          { type: 'contact', service: 'Day Assessment Unit (DAU)', number: '020 8934 1234 ext 4034', hours: '8:30am\u20137:30pm (call first, no walk-in)' }
        ]
      },
      {
        type: 'subsection',
        title: '13D. Termination of Pregnancy (Abortion) \u2014 Self-Referral',
        content: [
          { type: 'script', title: 'Script', text: '"If you are pregnant and do not wish to continue with the pregnancy you can refer yourself for NHS-funded (free) abortion care. If you are registered with a GP practice in any London borough or Surrey you can contact any of the following providers."' },
          { type: 'providers', items: [
            { name: 'NUPAS', number: '0333 004 6666', url: 'https://www.nupas.co.uk/', locations: 'Surbiton, Fulham, Battersea, West Twickenham' },
            { name: 'BPAS', number: '0345 730 4030', url: 'https://www.bpas.org/', locations: 'Richmond, Clapham' },
            { name: 'MSI Reproductive Choices', number: '0345 300 8090', url: 'https://www.msichoices.org.uk/abortion/', locations: 'Wimbledon, Feltham, Ealing, Hammersmith, Brixton' }
          ]}
        ]
      }
    ]
  },
  {
    id: 'fit-notes',
    number: '14',
    title: 'Fit Notes / Med3',
    icon: '📝',
    content: [
      {
        type: 'decision-tree',
        title: 'Fit Note Decision Tree',
        items: [
          {
            question: 'New or Renewal?',
            branches: [
              {
                label: 'NEW',
                steps: [
                  'Check EMIS: Has the issue been discussed with a GP?',
                  'If YES \u2192 GP Triager to issue via eConsult',
                  'Check EMIS: Is there a relevant discharge summary / OOH or hospital letter?',
                  'If YES \u2192 GP Triager to issue via eConsult',
                  'If NO for both \u2192 Check red flags first, then will need GP Appt 1st. If unsure re urgency \u2192 forward to Tier 2 noting "new fit note, not yet seen by GP"'
                ]
              },
              {
                label: 'RENEWAL',
                steps: [
                  'Check EMIS for existing fit note and expiry date.',
                  'If renewal requested >7 days before expiry \u2192 advise patient to re-contact within 3 days of expiry date.',
                  'If renewal within 7 days + previously discussed + documented \u2192 forward to Tier 2 for processing (GP Triager to issue via eConsult).',
                  'If worsening \u2192 escalate to GP triager.',
                  'If follow-up due \u2192 check no red flags and book GP follow-up as per EMIS plan if no changes.'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'econsult',
    number: '15',
    title: 'eConsults / Remote Consults',
    icon: '💻',
    content: [
      {
        type: 'text',
        text: 'Remote/online consulting via GP Triager is appropriate when the episode of care does not need face-to-face contact, with explicit safety-netting and a clear route to escalation.'
      },
      {
        type: 'list',
        title: 'Hard stops \u2014 do NOT use eConsult if:',
        color: 'red',
        items: [
          'Any RED FLAG words that have NOT been clinically reviewed \u2192 Section 9A',
          'Any AMBER flags that have NOT been clinically reviewed needing same-day review',
          'UNWELL high-risk/vulnerable patients (OK for clinical admin/query/advice/fit note in WELL patient)',
          "Multiple problems, 'severe/worsening/very worried', recurrent, >2 weeks and not improving",
          'Post-operative concerns (risk of DVT/PE, wound infection) \u2013 NICE NG158',
          'Suspected DVT or PE (requires urgent clinical assessment and Wells score) \u2013 NICE NG158',
          'Any child under 1 year (all concerns need clinical assessment) \u2013 NICE NG143',
          'Suspected fractures (requires examination and possibly imaging) \u2192 UTC or A&E',
          'New neurological symptoms (may indicate stroke, cord compression, emergency). Stroke signs \u2192 999'
        ]
      },
      {
        type: 'econsult-table',
        items: [
          { category: 'Administrative with clinical sign-off', examples: 'Fit note where already discussed, simple queries, confirmation letters, ADHD/ASD adult referrals, private referrals, NHS referrals if clearly discussed', exclude: 'New illness requiring first assessment, workplace forms needing long reports, safeguarding concerns' },
          { category: 'Medication reviews/queries (non-urgent)', examples: 'Acne review, stable repeat medication queries, side-effect questions without red flags, contraception pill review when stable', exclude: 'Chest pain, breathlessness, swelling, severe rash, jaundice, fainting, pregnancy concerns, mental health crisis' },
          { category: 'Results and follow-up queries', examples: "'Can you explain my blood test?', 'do I need repeat bloods?', chasing hospital correspondence", exclude: 'Abnormal result flagged by clinician needing urgent action, new severe symptoms' },
          { category: 'Minor illness (self-care declined)', examples: 'Cold/flu, mild sore throat, mild sinus, hay fever, mild gastro, constipation, heartburn, mild eczema, cold sore, thrush, conjunctivitis <2yrs', exclude: 'Any red/amber words, high-risk groups, not settling after previous remote contact' },
          { category: 'Skin problems (photos help)', examples: 'Acne, eczema, suspected fungal rash, mild cellulitis query, insect bites, shingles query', exclude: 'Rapidly spreading redness, facial/eye involvement, fever/rigors, immunosuppressed, severe pain, eye symptoms' },
          { category: 'MSK without trauma or red flags', examples: 'Back strain, tendon pain, sprains with ability to weight bear, known OA flare, carpal tunnel, plantar fasciitis', exclude: 'Trauma with deformity, inability to weight bear, suspected fracture, new weakness/numbness, bladder/bowel symptoms, suspected DVT' }
        ]
      }
    ]
  },
  {
    id: 'tier2-workflow',
    number: '16',
    title: 'Tier 2: Non-Clinical Triager Workflow',
    icon: '⚙️',
    content: [
      {
        type: 'highlight',
        color: 'blue',
        text: 'Tier 2 PROCESSES and BOOKS what is protocol-clear. Do NOT decide clinical urgency. Escalate to Tier 3 within 2 hours.'
      },
      {
        type: 'subsection',
        title: '16.1 Time Limits (Patient Safety Requirement)',
        content: [
          {
            type: 'list',
            color: 'red',
            items: [
              'Amber flags: action within 1 hour of receipt. If cannot action \u2192 escalate to Tier 3 immediately.',
              'All other requests: action within 2 hours of receipt.',
              'End of day: Any request not resolved by end of working day auto-escalates to GP Triager.',
              'Out of hours: If Tier 2 not staffed, all Tier 1 requests go directly to GP Triager / duty clinician.'
            ]
          }
        ]
      },
      {
        type: 'subsection',
        title: '16.2 Tier 2 CAN Do (Protocol-Driven Actions Only)',
        content: [
          {
            type: 'list',
            color: 'green',
            items: [
              'Book same-day with duty GP/on-call for CLEAR amber flag matches (per Section 9B table)',
              'Book routine follow-up where EMIS plan is clear but Reception wasn\'t confident',
              'Process admin with existing GP sign-off: fit note renewal (recent GP review documented, within 7 days of expiry), results queries (GP has already commented), referral chasing, letters within policy',
              'Signpost to pathways Reception missed: UTC, eye service, maternity, sexual health',
              'Apply self-care / Pharmacy First if Tier 1 missed it and all criteria met'
            ]
          }
        ]
      },
      {
        type: 'subsection',
        title: '16.3 Tier 2 MUST Escalate to Tier 3',
        content: [
          {
            type: 'list',
            color: 'red',
            items: [
              'Multiple overlapping problems',
              'Possible cancer / 2WW (NICE NG12)',
              'ALL medication queries: dose changes, interactions, new prescriptions, side effects causing concern',
              'Clinical interpretation needed: results without GP comment, symptoms that don\'t pattern-match',
              'ALL high-risk patients with NEW symptoms (Tier 2 can only book planned care for these patients)',
              'ALL patients under 1 year old with any new concern',
              'ALL safeguarding concerns \u2013 flag to duty clinician and follow safeguarding policy',
              'ALL mental health: suicidal with plan, self-harm with intent, psychotic symptoms, acute agitation \u2192 Tier 3 + Crisis Line',
              'Patient explicitly requesting clinical advice / GP opinion',
              'Symptoms >2 weeks, not improving despite previous advice, "worst ever" or "never had before"',
              "Vague or unclear presentations that don't match a defined protocol",
              'Patient declined self-care/Pharmacy First because they feel it\'s more serious'
            ]
          },
          {
            type: 'highlight',
            color: 'amber',
            text: 'RULE: If you think about it >30 seconds \u2192 escalate to Tier 3.'
          }
        ]
      },
      {
        type: 'subsection',
        title: '16.4 Tier 2 Handover to Tier 3',
        content: [
          {
            type: 'list',
            color: 'blue',
            items: [
              "Everything from Tier 1 handover (patient's words, EMIS findings, flags)",
              "Your Tier 2 review: what you checked, what you could or couldn't match to protocol",
              'Specific question for GP: e.g. "Is this 2WW?" or "Medication query \u2013 patient asking about dose change"',
              'Your assessment of time sensitivity',
              'Contact details and patient availability'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'tier3-gp-triager',
    number: '17',
    title: 'Tier 3: GP Triager',
    icon: '👨\u200D\u2695\uFE0F',
    content: [
      {
        type: 'highlight',
        color: 'blue',
        text: 'Daily from 8am. All clinical decisions. eConsults. Monthly audit of Tier 2. Retains clinical responsibility for triage model.'
      },
      {
        type: 'subsection',
        title: '17.1 GP Triager Receives',
        content: [
          {
            type: 'list',
            color: 'blue',
            items: [
              'eConsults submitted by patients directly',
              'Tier 2 escalations requiring clinical judgement',
              'ALL possible cancer presentations for 2WW decision (NICE NG12: 14-day target)',
              'ALL medication reviews, queries, and prescribing decisions',
              'ALL high-risk patients with new symptoms escalated by Tier 2',
              'ALL infants under 1 year with new concerns',
              'ALL safeguarding concerns requiring clinical input',
              'ALL mental health presentations requiring clinical assessment',
              'Complex, multi-problem, or vague presentations',
              'Anything Tier 2 is unsure about'
            ]
          }
        ]
      },
      {
        type: 'subsection',
        title: '17.2 GP Triager Decides',
        content: [
          {
            type: 'list',
            color: 'green',
            items: [
              'Urgency: emergency / same-day / urgent / routine / can be managed remotely',
              'Who: which clinician (GP, nurse, HCA, pharmacist, mental health practitioner, physio)',
              'How: face-to-face / telephone / video / eConsult response / advice only',
              'Referral: 2WW (within 24hrs of decision), routine, urgent specialist, community services',
              'Prescribing: new medications, dose changes, repeat issues'
            ]
          }
        ]
      },
      {
        type: 'subsection',
        title: '17.3 Oversight Duties',
        content: [
          {
            type: 'list',
            color: 'blue',
            items: [
              'Real-time: Review all cases flagged by Tier 2',
              'Monthly: 10-case sample + all flagged exceptions via EMIS',
              'Quarterly: Q1 Amber, Q2 Self-care, Q3 Cancer, Q4 High-risk',
              "Protocol review: Flag cases where protocols didn't fit. Feed into SOP updates.",
              'Competency: Annual sign-off of Tier 1 and Tier 2 staff competency. Identify training needs.',
              'Significant events: Any patient safety concern arising from triage process \u2192 significant event analysis per practice protocol.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'service-directory',
    number: '18',
    title: 'Service Directory',
    icon: '📖',
    content: [
      {
        type: 'services',
        items: [
          { service: 'Community pharmacy / NHS Pharmacy First', bestFor: 'Minor illness, medicines advice, Pharmacy First pathways', access: 'Walk in or call a pharmacy', notes: 'If red flags or high-risk group \u2192 GP triager' },
          { service: 'NHS 111', bestFor: 'Urgent advice when not a 999 emergency', access: 'Phone 111 or NHS 111 online', notes: 'Good safety-net option' },
          { service: 'Richmond UTC (Teddington)', bestFor: 'Urgent injuries/illness not life-threatening', access: 'Book via NHS 111 or walk in. 8am\u20138pm daily', notes: 'Use 999/A&E for life-threatening emergencies' },
          { service: 'Primary Care Eye Service (CUES/MECS)', bestFor: 'Many urgent eye problems', access: 'Self-refer via participating optician', notes: 'Quicker than GP for eye assessments' },
          { service: 'Kingston Royal Eye Unit', bestFor: 'Urgent eye problems needing hospital', access: 'Appointment only. Urgent clinic Mon\u2013Fri', notes: 'Out of hours \u2192 NHS 111 or A&E' },
          { service: 'Wolverton Centre', bestFor: 'Contraception incl coils/implants, STI testing, genital symptoms', access: 'Self-refer. 0208 974 9331', notes: 'If severe pain/collapse/heavy bleeding \u2192 999' },
          { service: 'Kingston maternity services', bestFor: 'Antenatal booking and urgent pregnancy concerns', access: 'Self-referral online. Helpline 24/7 for >18 weeks', notes: '0208 934 2802' },
          { service: 'Abortion providers (BPAS / MSI / NUPAS)', bestFor: 'Termination of pregnancy (NHS-funded)', access: 'Self-refer directly', notes: 'If heavy bleeding/severe pain \u2192 999/A&E' },
          { service: 'Kingston Talking Therapies', bestFor: 'Anxiety, low mood, stress', access: 'Self-referral online', notes: 'If immediate danger/self-harm \u2192 999/crisis', url: 'https://swlstg.nhs.uk/kingston-talking-therapies' },
          { service: 'Stop smoking support', bestFor: 'Help to stop smoking/vaping', access: 'Self-refer / direct book in-house service', notes: '' }
        ]
      }
    ]
  },
  {
    id: 'key-contacts',
    number: '19',
    title: 'Key Contacts',
    icon: '📞',
    content: [
      {
        type: 'contacts-table',
        items: [
          { service: 'Emergency Services', contact: '999', hours: '24/7' },
          { service: 'On-site Ambulance (LAS)', contact: '020 3162 7525', hours: '24/7' },
          { service: 'Crisis Line (adults)', contact: '0800 028 8000', hours: '24/7' },
          { service: 'CAMHS Crisis (<18)', contact: '0203 228 5980', hours: '24/7' },
          { service: 'NHS 111', contact: '111 or online', hours: '24/7' },
          { service: 'Richmond UTC (Teddington)', contact: 'Book via NHS 111 or walk in', hours: '8am\u20138pm daily' },
          { service: 'Royal Eye Unit (urgent)', contact: '020 8934 6799', hours: 'Mon\u2013Fri 8:30\u20134:30' },
          { service: 'Royal Eye Unit (main)', contact: '020 8934 6404', hours: 'Mon\u2013Fri 9\u20135' },
          { service: 'Maternity Helpline >18wks', contact: '0208 934 2802', hours: '24/7' },
          { service: 'Maternity DAU', contact: '020 8934 1234 ext 4034', hours: '8:30am\u20137:30pm' },
          { service: 'Wolverton (sexual health)', contact: '0208 974 9331', hours: 'See website' },
          { service: 'Kingston Talking Therapies', contact: 'Self-refer online', hours: '' },
          { service: 'NUPAS (Abortion)', contact: '0333 004 6666', hours: 'See website' },
          { service: 'BPAS (Abortion)', contact: '0345 730 4030', hours: 'See website' },
          { service: 'MSI (Abortion)', contact: '0345 300 8090', hours: 'See website' }
        ]
      }
    ]
  },
  {
    id: 'documentation',
    number: '20',
    title: 'Documentation',
    icon: '✍️',
    content: [
      {
        type: 'highlight',
        color: 'blue',
        text: 'EVERY TIER, EVERY TIME: What was decided \u2022 Who decided \u2022 Why \u2022 Safety-net given \u2022 Where signposted/booked'
      },
      {
        type: 'list',
        title: 'All Tiers record:',
        color: 'blue',
        items: [
          'What was decided',
          'Who decided it',
          "Why (patient's words + rationale)",
          'Safety-net advice given',
          'Where signposted/booked (specific resource name)'
        ]
      },
      {
        type: 'list',
        title: 'Tier 1 adds:',
        color: 'green',
        items: [
          'EMIS checked (brief findings noted)',
          'NEW or ONGOING status',
          'Why forwarded to Tier 2',
          'Which resource sent: CalmCare card title or Healthier Together page title/link'
        ]
      },
      {
        type: 'list',
        title: 'Tier 2 adds:',
        color: 'amber',
        items: [
          'What protocol was applied',
          "Why you could/couldn't resolve",
          'Time of receipt and action',
          'Why escalated to Tier 3 (if applicable)'
        ]
      },
      {
        type: 'list',
        title: 'Tier 3 adds:',
        color: 'blue',
        items: [
          'Clinical triage decision',
          'Urgency assigned',
          'Action taken',
          'Any concerns about Tier 1/2 process'
        ]
      },
      {
        type: 'highlight',
        color: 'green',
        text: "Tip: copy/paste the patient's exact wording into the message to the GP triager. This reduces risk and avoids misinterpretation."
      }
    ]
  },
  {
    id: 'training',
    number: '21',
    title: 'Training & Competency',
    icon: '🎓',
    content: [
      {
        type: 'training-table',
        items: [
          { tier: 'Tier 1 \u2013 Reception', requirements: 'Care navigation induction (NHS England framework). Red flag word-list recognition training. EMIS record navigation. Pharmacy First awareness. Safeguarding awareness Level 1. Annual refresher + competency sign-off by GP clinical lead.' },
          { tier: 'Tier 2 \u2013 Non-Clinical Triager', requirements: 'All Tier 1 requirements PLUS: Amber flag protocol training (documented assessment). Admin processing protocols (fit notes, results, referrals). NICE 2WW awareness (NG12). Mental health first aid. Safeguarding Level 2. Signed off by GP clinical lead BEFORE operating at this tier. Quarterly thematic review participation.' },
          { tier: 'Tier 3 \u2013 GP Triager', requirements: 'GMC-registered clinician. Competent in remote/telephone triage. Familiar with all local pathways. Responsibility for Tier 1/2 protocol review. Monthly audit + quarterly thematic review. Significant event reporting.' }
        ]
      }
    ]
  }
];
