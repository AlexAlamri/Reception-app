// lib/flowchart-content.js - Three-Tier Triage Flowchart v3.1 content for in-app reference

export const flowchartMeta = {
  version: '3.1',
  date: 'February 2026',
  appliesTo: 'Tier 1: Reception / Care Navigation | Tier 2: Experienced Non-Clinical Triagers | Tier 3: GP Triager',
  owner: 'Dr Sahar Jahanian',
  reviewDate: 'August 2026',
  practices: 'Churchill Medical Centre & The Orchard Practice'
};

export const flowchartSections = [
  {
    id: 'governance',
    number: 'G',
    title: 'Governance Principles',
    icon: '🏛️',
    content: [
      {
        type: 'text',
        text: 'Each tier operates ONLY within defined protocols. Non-clinical staff PROCESS and ROUTE \u2014 they do not DECIDE clinical urgency.'
      },
      {
        type: 'highlight',
        color: 'red',
        text: 'NON-CLINICAL STAFF DO NOT DIAGNOSE, INTERPRET RESULTS, OR DECIDE CLINICAL URGENCY'
      },
      {
        type: 'highlight',
        color: 'amber',
        text: "Use patient's EXACT words \u2022 Check EMIS FIRST \u2022 If unsure at ANY point \u2192 escalate up"
      },
      {
        type: 'highlight',
        color: 'green',
        text: 'Escalation bias: Always escalate UP, never down. A false escalation is safe; a missed escalation is not.'
      },
      {
        type: 'list',
        title: 'Time Limits & Audit',
        color: 'blue',
        items: [
          'Tier 2 must action all requests within 2 hours',
          'Amber flags within 1 hour',
          'Unresolved end-of-day \u2192 auto-escalates to GP Triager',
          'Real-time significant event flagging \u2014 Tier 2 flags any case where protocol didn\u2019t fit or confidence was low',
          'GP Triager reviews all flagged exceptions via EMIS',
          'Quarterly audits: Q1 Amber, Q2 Self-care, Q3 Cancer, Q4 High-risk',
          'Protocol review: Flag cases where protocols didn\u2019t fit. Feed into SOP updates.'
        ]
      }
    ]
  },
  {
    id: 'model-overview',
    number: 'M',
    title: 'Three-Tier Model Overview',
    icon: '🔺',
    content: [
      {
        type: 'model-overview',
        tiers: [
          {
            tier: 'TIER 1',
            who: 'Reception / Care Navigators',
            scope: 'First contact. RECOGNISE and ROUTE. Check EMIS. Signpost self-care / Pharmacy First / external pathways. Direct-book planned items. Forward ALL else to Tier 2.',
            escalatesTo: 'Tier 2 (standard) or 999/A&E (emergency)'
          },
          {
            tier: 'TIER 2',
            who: 'Experienced Non-Clinical Triagers (x2 rota)',
            scope: 'PROCESS & BOOK (not decide urgency). Match amber patterns \u2192 same-day duty GP. Process admin with GP sign-off. Book routine where EMIS plan clear. Escalate unclear/multi-problem.',
            escalatesTo: 'Tier 3 GP Triager. Must action within 2hrs.'
          },
          {
            tier: 'TIER 3',
            who: 'GP Triager (daily from 8am)',
            scope: 'All clinical decisions. eConsults. 2WW/cancer pathways. Medication decisions. Monthly audit of Tier 2. Retains clinical responsibility.',
            escalatesTo: 'Books appt / eConsult / referral / prescribing'
          }
        ]
      },
      {
        type: 'highlight',
        color: 'blue',
        text: 'TIER 1: Red flags \u2192 999 | EMIS check | Signpost / Direct book | Forward remainder \u2192'
      },
      {
        type: 'highlight',
        color: 'amber',
        text: 'TIER 2: Amber \u2192 same-day duty GP | Admin with sign-off | Escalate unclear \u2192'
      },
      {
        type: 'highlight',
        color: 'violet',
        text: 'TIER 3: eConsults | Clinical triage | 2WW | Medication | Complex cases | Audit'
      }
    ]
  },
  {
    id: 'tier1-step1',
    number: '1',
    title: 'Step 1: Emergency Red Flags',
    icon: '🚨',
    tier: 1,
    content: [
      {
        type: 'highlight',
        color: 'red',
        text: 'STOP if patient mentions ANY of these. ONE action: CALL 999 / Advise A&E NOW'
      },
      {
        type: 'red-flags-table',
        items: [
          { system: 'CARDIAC', symptom: 'Chest pain / tight chest / pressure / pain spreading to arm, neck, jaw or back', action: 'CALL 999' },
          { system: 'CARDIAC', symptom: 'Sudden tearing/ripping chest or back pain radiating between shoulder blades (aortic dissection)', action: 'CALL 999' },
          { system: 'RESPIRATORY', symptom: '"Can\'t breathe" / "Can\'t speak" / blue or grey lips / breathing very fast', action: 'CALL 999' },
          { system: 'NEUROLOGICAL', symptom: 'Stroke signs (FAST): face drooping, arm weakness, slurred speech, sudden confusion', action: 'CALL 999' },
          { system: 'NEUROLOGICAL', symptom: 'Collapsed / unconscious / fitting / seizure / not responding', action: 'CALL 999' },
          { system: 'NEUROLOGICAL', symptom: '"Worst headache of my life" / sudden severe headache +/\u2013 neck stiffness', action: 'CALL 999' },
          { system: 'NEUROLOGICAL', symptom: 'Back pain + NEW loss of bladder/bowel control or numbness between legs (cauda equina)', action: 'CALL 999' },
          { system: 'SEPSIS / MENINGITIS', symptom: 'Sepsis: acting confused, mottled/ashen skin, "feels like dying", very fast breathing, no urine 18+ hrs. Can occur WITHOUT fever', action: 'CALL 999' },
          { system: 'SEPSIS / MENINGITIS', symptom: 'Meningitis: non-blanching rash (glass test) + fever + stiff neck. Check palms, soles, mouth on darker skin', action: 'CALL 999' },
          { system: 'SEPSIS / MENINGITIS', symptom: 'Child with non-blanching rash \u2014 assume meningitis until proven otherwise', action: 'CALL 999' },
          { system: 'GI / ABDOMINAL', symptom: 'Vomiting blood / black tarry stools / heavy bleeding that won\u2019t stop', action: 'CALL 999' },
          { system: 'GI / ABDOMINAL', symptom: 'Severe sudden abdominal pain / rigid abdomen / can\u2019t move with pain', action: 'CALL 999' },
          { system: 'GI / ABDOMINAL', symptom: 'Can\u2019t pass poo or wind with severe abdominal pain (bowel obstruction)', action: 'CALL 999' },
          { system: 'VASCULAR', symptom: 'Sudden cold, white, painful leg or arm / no pulse in foot (acute limb ischaemia)', action: 'CALL 999' },
          { system: 'UROLOGICAL', symptom: 'Can\u2019t pee at all with severe pain (urinary retention)', action: 'CALL 999' },
          { system: 'UROLOGICAL', symptom: 'Sudden severe testicular/groin pain with vomiting (torsion)', action: 'CALL 999' },
          { system: 'OBSTETRIC', symptom: 'Pregnancy <12 weeks + one-sided pain + shoulder tip pain (possible ectopic)', action: 'CALL 999' },
          { system: 'ONCOLOGY', symptom: 'Known cancer + new back pain + leg weakness/numbness (MSCC)', action: 'CALL 999' },
          { system: 'EYE', symptom: 'Severe eye pain + headache + vomiting + haloes (acute glaucoma)', action: 'CALL 999' },
          { system: 'EYE', symptom: 'Chemical splash / penetrating injury / sudden vision loss with stroke signs', action: 'CALL 999' },
          { system: 'ALLERGY', symptom: 'Severe allergic reaction: face/tongue/throat swelling + breathing difficulty', action: 'CALL 999' },
          { system: 'MENTAL HEALTH', symptom: 'Suicide attempt in progress / immediate danger to self or others', action: 'CALL 999' }
        ]
      },
      {
        type: 'highlight',
        color: 'blue',
        text: 'On-site ambulance: 020 3162 7525 | Crisis Line: 0800 028 8000 (adults) / 0203 228 5980 (CAMHS <18)'
      },
      {
        type: 'flow-arrow',
        text: 'No red flags \u2192 continue to Step 2'
      }
    ]
  },
  {
    id: 'tier1-step2',
    number: '2',
    title: 'Step 2: Check EMIS (Mandatory)',
    icon: '✅',
    tier: 1,
    content: [
      {
        type: 'highlight',
        color: 'red',
        text: '\u26d4 Do NOT skip. Do NOT interpret results or tell the patient a diagnosis.'
      },
      {
        type: 'list',
        title: 'Look for (reading only):',
        color: 'blue',
        items: [
          'Recent consultation notes \u2014 is there a follow-up plan?',
          'Recall/alerts: bloods, reviews, smears, vaccines due',
          'Hospital letters / discharge summaries relevant to request',
          'Recent test results (note they EXIST \u2014 do NOT interpret)',
          'High-risk flags: pregnant, immunosuppressed, safeguarding, LD, <1yr, palliative'
        ]
      },
      {
        type: 'highlight',
        color: 'green',
        text: 'Record your EMIS findings \u2014 these travel with the request through all tiers.'
      },
      {
        type: 'flow-arrow',
        text: 'EMIS checked \u2192 continue to Step 3'
      }
    ]
  },
  {
    id: 'tier1-step3',
    number: '3',
    title: 'Step 3: New Problem or Ongoing?',
    icon: '🔄',
    tier: 1,
    content: [
      {
        type: 'text',
        text: 'Based on EMIS: has a clinician already reviewed THIS specific problem?'
      },
      {
        type: 'subsection',
        title: '\u2705 PLAN EXISTS IN EMIS (ongoing / planned / due)',
        content: [
          {
            type: 'list',
            color: 'green',
            items: [
              'Follow-up plan documented by GP \u2192 direct book per plan',
              'Recall alert (smear, annual review, bloods, vaccine, postnatal) \u2192 direct book per SOP',
              'Admin query where GP already reviewed \u2192 forward to Tier 2'
            ]
          },
          {
            type: 'highlight',
            color: 'amber',
            text: 'EXCEPTION: If patient says "worse", "not improving", "different" \u2192 treat as NEW below'
          }
        ]
      },
      {
        type: 'subsection',
        title: '\u27a1\ufe0f NO PLAN / WORSENED / NEW PROBLEM',
        content: [
          {
            type: 'list',
            color: 'blue',
            items: [
              'No record of this being assessed \u2192 continue to Step 4',
              'Previously seen but worsened/changed \u2192 continue to Step 4'
            ]
          },
          {
            type: 'highlight',
            color: 'red',
            text: '\u26d4 Do NOT book a new GP appointment for a new problem without going through the triage steps.'
          }
        ]
      },
      {
        type: 'flow-arrow',
        text: 'NEW or WORSENED \u2192 continue to Step 4'
      }
    ]
  },
  {
    id: 'tier1-step4',
    number: '4',
    title: 'Step 4: High-Risk or Vulnerable Patient?',
    icon: '🛡️',
    tier: 1,
    content: [
      {
        type: 'highlight',
        color: 'amber',
        text: 'If patient is in ANY group below \u2192 forward to Tier 2 with HIGH RISK flag. Do NOT use self-care or Pharmacy First.'
      },
      {
        type: 'risk-groups',
        items: [
          { group: 'Pregnant or postnatal (up to 6 weeks)', action: 'Forward to Tier 2 with HIGH RISK flag' },
          { group: 'Immunosuppressed (chemo, transplant, biologics, long-term steroids, advanced HIV)', action: 'Forward to Tier 2 with HIGH RISK flag' },
          { group: 'No spleen / post-splenectomy / sickle cell disease', action: 'Forward to Tier 2 with HIGH RISK flag' },
          { group: 'Frail elderly / care home resident', action: 'Forward to Tier 2 with HIGH RISK flag' },
          { group: 'Severe chronic conditions (severe asthma/COPD, heart failure, severe kidney disease, all diabetes)', action: 'Forward to Tier 2 with HIGH RISK flag' },
          { group: 'Cancer patients on active treatment', action: 'Forward to Tier 2 with HIGH RISK flag' },
          { group: 'Baby under 1 year old (any new concern \u2192 Tier 2 MUST escalate to Tier 3)', action: 'Forward to Tier 2 with HIGH RISK flag' },
          { group: 'Under 5 years old with new symptom (NICE NG143)', action: 'Forward to Tier 2 with HIGH RISK flag' },
          { group: 'Spinal cord injury', action: 'Forward to Tier 2 with HIGH RISK flag' },
          { group: 'Safeguarding concerns / Learning disability / Severe mental illness', action: 'Forward to Tier 2 with HIGH RISK flag' },
          { group: 'Recent surgery or hospitalisation (<6 weeks) \u2014 DVT/PE risk', action: 'Forward to Tier 2 with HIGH RISK flag' },
          { group: 'Language barriers / Communication difficulties', action: 'Forward to Tier 2 with HIGH RISK flag' },
          { group: 'Homeless / Rough sleepers / No fixed abode', action: 'Forward to Tier 2 with HIGH RISK flag' },
          { group: 'Substance misuse / Alcohol dependence', action: 'Forward to Tier 2 with HIGH RISK flag' }
        ]
      },
      {
        type: 'flow-arrow',
        text: 'Not high risk \u2192 continue to Step 5'
      }
    ]
  },
  {
    id: 'tier1-step5',
    number: '5',
    title: 'Step 5: Specific External Pathway?',
    icon: '🔍',
    tier: 1,
    content: [
      {
        type: 'text',
        text: 'Quick-match grid \u2014 find the pathway, take the action. If it doesn\u2019t fit \u2192 Step 6.'
      },
      {
        type: 'pathway-grid',
        items: [
          { icon: '\ud83d\udc41\ufe0f', pathway: 'Eye', symptoms: 'Red eye, painful eye, floaters, flashes, stye', action: 'CUES via local optician (self-refer)', contact: 'primaryeyecare.co.uk' },
          { icon: '\ud83d\udc41\ufe0f', pathway: 'Eye (urgent)', symptoms: 'Vision loss, shingles near eye, contact lens + pain', action: 'Royal Eye Unit', contact: '020 8934 6799' },
          { icon: '\ud83d\udc41\ufe0f', pathway: 'Eye (999)', symptoms: 'Chemical splash, penetrating injury, acute glaucoma, sudden vision loss + stroke', action: 'CALL 999 / A&E NOW', contact: '' },
          { icon: '\ud83e\udd15', pathway: 'Injury / Burn', symptoms: 'Cuts needing stitches, minor burns, sprains, possible fracture', action: 'Richmond UTC Teddington (8am\u20138pm)', contact: 'Book via NHS 111' },
          { icon: '\ud83e\udd15', pathway: 'Injury (999)', symptoms: 'Major trauma, heavy bleeding, head injury + confusion', action: 'CALL 999 / A&E NOW', contact: '' },
          { icon: '\ud83e\udd30', pathway: 'Pregnancy booking', symptoms: 'New pregnancy, need to register', action: 'Self-refer Kingston Maternity online', contact: 'kingstonmaternity.org.uk' },
          { icon: '\ud83e\udd30', pathway: 'Pregnancy >18wks', symptoms: 'Reduced movements, bleeding, waters, contractions', action: 'Maternity Helpline', contact: '0208 934 2802 (24/7)' },
          { icon: '\ud83e\udd30', pathway: 'Pregnancy <18wks', symptoms: 'Abdominal pain, bleeding, can\u2019t keep fluids', action: 'Forward to Tier 2 as AMBER', contact: 'Same-day' },
          { icon: '\ud83e\udd30', pathway: 'Pregnancy <12wks', symptoms: 'One-sided pain + shoulder tip pain (ectopic)', action: 'CALL 999 / A&E NOW', contact: '' },
          { icon: '\u2764\ufe0f', pathway: 'Sexual health', symptoms: 'Contraception, STI testing, genital symptoms', action: 'Wolverton Centre (self-refer)', contact: '0208 974 9331' },
          { icon: '\ud83e\udde0', pathway: 'Mental health', symptoms: 'Low mood, anxiety, stress (non-crisis)', action: 'Kingston Talking Therapies', contact: 'Self-refer online' },
          { icon: '\ud83e\udde0', pathway: 'Mental health (crisis)', symptoms: 'Suicidal plan, self-harm with intent, psychosis', action: 'Tier 2 \u2192 MUST escalate Tier 3 + Crisis Line', contact: '0800 028 8000' }
        ]
      },
      {
        type: 'subsection',
        title: '\ud83d\udcdd Fit Note Reference Card',
        content: [
          {
            type: 'list',
            color: 'blue',
            items: [
              'RENEWAL >7 days before expiry \u2192 advise re-contact within 3 days of expiry',
              'RENEWAL within 7 days + previously discussed + documented \u2192 forward to Tier 2',
              'NEW + previously discussed with GP or hospital letter \u2192 forward to Tier 2 (escalates to Tier 3)',
              'NEW + NOT previously discussed \u2192 forward to Tier 2 noting "new fit note, not yet seen by GP"'
            ]
          }
        ]
      },
      {
        type: 'flow-arrow',
        text: 'Doesn\u2019t fit specific pathway \u2192 continue to Step 6'
      }
    ]
  },
  {
    id: 'tier1-step6',
    number: '6',
    title: 'Step 6: Pharmacy First / Self-Care',
    icon: '💊',
    tier: 1,
    content: [
      {
        type: 'subsection',
        title: 'Pharmacy First (8 conditions)',
        content: [
          {
            type: 'conditions',
            items: [
              { name: 'Sore Throat', age: 'Age 5+' },
              { name: 'Earache', age: 'Age 1\u201317' },
              { name: 'Sinusitis', age: 'Age 12+' },
              { name: 'Infected Insect Bite', age: 'Age 1+' },
              { name: 'Impetigo', age: 'Age 1+' },
              { name: 'Shingles', age: 'Age 18+' },
              { name: 'UTI (women)', age: 'Age 16\u201364' },
              { name: 'Acute Otitis Media', age: 'Age 1\u201317' }
            ]
          }
        ]
      },
      {
        type: 'subsection',
        title: 'Self-Care Safety Gate \u2014 use ONLY if ALL true:',
        content: [
          {
            type: 'checklist',
            items: [
              'Single, minor symptom',
              'Short-lived (<7 days, not recurring)',
              'NO red/amber flags',
              'NOT high-risk patient',
              'NOT "severe / worsening / worst ever"',
              'Clearly matches ONE resource',
              'Patient agrees'
            ]
          },
          {
            type: 'highlight',
            color: 'green',
            text: 'Adults \u2192 CalmCare cards     Children <18 \u2192 Healthier Together'
          }
        ]
      },
      {
        type: 'highlight',
        color: 'blue',
        text: 'ALWAYS SAFETY-NET: "If not improving, or you\u2019re worried, contact us again. For chest pain, severe breathlessness, collapse, confusion, or heavy bleeding \u2192 call 999."'
      },
      {
        type: 'highlight',
        color: 'amber',
        text: 'If patient declines because they feel symptoms are worse \u2192 forward to Tier 2 and flag: "Patient declined self-care, feels symptoms more serious."'
      },
      {
        type: 'flow-arrow',
        text: 'Doesn\u2019t fit / patient declines / unsure \u2192 continue to Step 7'
      }
    ]
  },
  {
    id: 'tier1-step7',
    number: '7',
    title: 'Step 7: Default \u2192 Forward to Tier 2',
    icon: '📨',
    tier: 1,
    content: [
      {
        type: 'list',
        title: 'Forward if:',
        color: 'amber',
        items: [
          'Can\u2019t match to one pathway',
          'Multiple symptoms',
          '"Severe / worsening / worst ever"',
          'Symptoms >2 weeks or not improving',
          'New lump / night sweats / unexplained bleeding',
          'Patient anxious or requesting GP',
          'Self-care declined',
          'ANY uncertainty whatsoever'
        ]
      },
      {
        type: 'subsection',
        title: 'Handover MUST include:',
        content: [
          {
            type: 'checklist',
            items: [
              'Patient\u2019s EXACT words (copy/paste from ANIMA)',
              'EMIS findings: plans, alerts, risk flags',
              'NEW or ONGOING + any change words',
              'Red/amber keywords you noticed',
              'If patient declined self-care + reason',
              'Contact details and availability'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'tier2-stepA',
    number: 'A',
    title: 'Step A: Receive & Review from Tier 1',
    icon: '📥',
    tier: 2,
    content: [
      {
        type: 'text',
        text: 'Read the handover: patient\u2019s exact words, EMIS findings, NEW/ONGOING status, flags spotted. Re-check EMIS if needed. Start your 2-hour clock.'
      },
      {
        type: 'highlight',
        color: 'amber',
        text: '\u23f0 TIME LIMITS: Amber flags \u2192 1 hour | All others \u2192 2 hours | End of day \u2192 auto-escalate to GP Triager'
      }
    ]
  },
  {
    id: 'tier2-stepB',
    number: 'B',
    title: 'Step B: Check Amber Flags \u2014 Book Same-Day',
    icon: '🟠',
    tier: 2,
    content: [
      {
        type: 'text',
        text: 'If request matches an amber pattern below \u2192 book same-day with duty GP. Do NOT decide urgency \u2014 follow the protocol.'
      },
      {
        type: 'amber-table',
        items: [
          { category: 'Chest / Cardiac', buzzwords: 'Non-emergency chest symptoms, palpitations at rest, dizziness + cardiac history', action: 'Same-day duty GP', notes: 'NICE NG253' },
          { category: 'Breathing / Respiratory', buzzwords: 'Acute wheeze, stridor, sudden worsening in COPD/asthma', action: 'Same-day duty GP', notes: 'NICE NG240' },
          { category: 'Abdominal', buzzwords: 'Acute abdominal pain (not rigid), vomiting >24hrs, diarrhoea + blood', action: 'Same-day duty GP', notes: '' },
          { category: 'Urinary', buzzwords: 'Flank/back pain + fever, male UTI, pregnancy + UTI, catheter', action: 'Same-day duty GP \u2014 NOT Pharmacy First', notes: '' },
          { category: 'Head / Neurology', buzzwords: 'Sudden severe headache, new weakness/numbness, new confusion, blackout', action: 'Same-day duty GP. Stroke \u2192 999', notes: '' },
          { category: 'Skin / Infection', buzzwords: 'Rapidly spreading redness, face/eye involvement, rigors, very unwell', action: 'Same-day duty GP', notes: '' },
          { category: 'DVT', buzzwords: 'Unilateral calf/leg swelling, red/hot leg, post-surgery/flight', action: 'URGENT same-day', notes: 'NICE NG158' },
          { category: 'PE', buzzwords: 'Sharp chest pain breathing, breathless + chest pain, post-surgery/flight', action: 'URGENT same-day', notes: 'NICE NG158' },
          { category: 'Temporal Arteritis', buzzwords: 'Headache in >50 + jaw pain chewing + scalp tenderness + vision', action: 'URGENT same-day', notes: 'NICE NG244' },
          { category: 'Renal Colic', buzzwords: 'Loin-to-groin pain, severe side pain, writhing', action: 'Same-day duty GP', notes: '' },
          { category: 'Fever Under-5s', buzzwords: 'Baby/toddler high temp, floppy, not feeding. Non-blanching rash \u2192 999', action: 'Same-day duty GP', notes: 'NICE NG143' },
          { category: 'Neutropenic Sepsis', buzzwords: 'Chemo/transplant + ANY fever', action: 'URGENT \u2192 may need 999', notes: 'NICE NG151' },
          { category: 'Testicular Pain', buzzwords: 'Sore/swollen testicle. Sudden + vomiting \u2192 999', action: 'Same-day duty GP', notes: '' },
          { category: 'Women\u2019s Health', buzzwords: 'Pregnancy <18wks + pain/bleeding, reduced movements (18+), postnatal bleeding/headache', action: 'Same-day or maternity', notes: '' },
          { category: 'Mental Health', buzzwords: 'Suicidal with plan, self-harm with intent, psychotic, acute agitation', action: 'ESCALATE TIER 3 + Crisis', notes: 'Always Tier 3' },
          { category: 'Safeguarding', buzzwords: 'Domestic abuse, sexual assault, child/adult safeguarding', action: 'ESCALATE TIER 3', notes: 'Always Tier 3' },
          { category: 'Possible Cancer', buzzwords: 'New lump, unexplained weight loss/bleeding, bowel change >6wks, swallowing difficulty, PMB, non-healing ulcer', action: 'ESCALATE TIER 3 for 2WW', notes: 'NICE NG12' }
        ]
      }
    ]
  },
  {
    id: 'tier2-stepC',
    number: 'C',
    title: 'Step C: Escalation Rules \u2014 Must Go to Tier 3',
    icon: '⚠️',
    tier: 2,
    content: [
      {
        type: 'highlight',
        color: 'red',
        text: 'RULE: If you think about it >30 seconds \u2192 escalate to Tier 3'
      },
      {
        type: 'list',
        title: 'ALWAYS escalate to Tier 3 GP Triager:',
        color: 'red',
        items: [
          'Possible cancer / 2WW (NICE NG12)',
          'ANY medication decision',
          'Clinical interpretation (no GP comment)',
          'High-risk + NEW symptoms',
          'ALL under 1yr with new concern',
          'ALL safeguarding',
          'ALL mental health with active plan/self-harm',
          'Patient requesting clinical opinion',
          'Vague / unclear / doesn\u2019t match protocol'
        ]
      }
    ]
  },
  {
    id: 'tier2-stepD',
    number: 'D',
    title: 'Step D: Escalate to Tier 3 GP Triager',
    icon: '📤',
    tier: 2,
    content: [
      {
        type: 'checklist',
        title: 'Escalation handover must include:',
        items: [
          'Tier 1 handover',
          'Your review',
          'Specific question for GP',
          'Time sensitivity',
          'Contact details'
        ]
      }
    ]
  },
  {
    id: 'tier3-gp',
    number: 'T3',
    title: 'Tier 3: GP Triager',
    icon: '👨‍⚕️',
    tier: 3,
    content: [
      {
        type: 'text',
        text: 'Daily from 8am. All clinical decisions. eConsults. Monthly audit of Tier 2. Retains clinical responsibility.'
      },
      {
        type: 'subsection',
        title: 'GP Triager Receives',
        content: [
          {
            type: 'list',
            color: 'violet',
            items: [
              'eConsults submitted by patients directly',
              'Tier 2 escalations requiring clinical judgement',
              'ALL possible cancer presentations for 2WW decision',
              'ALL medication reviews, queries, and prescribing decisions',
              'ALL high-risk patients with new symptoms',
              'ALL infants under 1 year with new concerns',
              'ALL safeguarding and mental health requiring clinical assessment',
              'Complex, multi-problem, or vague presentations'
            ]
          }
        ]
      },
      {
        type: 'subsection',
        title: 'GP Triager Decides',
        content: [
          {
            type: 'list',
            color: 'blue',
            items: [
              'Urgency: emergency / same-day / urgent / routine / remote',
              'Who: GP, nurse, HCA, pharmacist, mental health practitioner, physio',
              'How: face-to-face / telephone / video / eConsult response / advice only',
              'Referral: 2WW (within 24hrs), routine, urgent specialist, community',
              'Prescribing: new medications, dose changes, repeat issues'
            ]
          }
        ]
      },
      {
        type: 'subsection',
        title: 'Oversight Duties',
        content: [
          {
            type: 'list',
            color: 'teal',
            items: [
              'Real-time: Review all cases flagged by Tier 2',
              'Monthly: 10-case sample + all flagged exceptions via EMIS',
              'Quarterly: Q1 Amber, Q2 Self-care, Q3 Cancer, Q4 High-risk',
              'Protocol review: Flag cases where protocols didn\u2019t fit. Feed into SOP updates.',
              'Competency: Annual sign-off of Tier 1 and Tier 2 staff'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'key-contacts',
    number: 'KC',
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
    number: 'D',
    title: 'Documentation',
    icon: '📄',
    content: [
      {
        type: 'highlight',
        color: 'blue',
        text: 'EVERY TIER, EVERY TIME: What was decided \u2022 Who decided \u2022 Why \u2022 Safety-net given \u2022 Where signposted/booked'
      },
      {
        type: 'list',
        title: 'Tier 1 adds:',
        color: 'green',
        items: [
          'EMIS checked (brief findings)',
          'NEW or ONGOING status',
          'Why forwarded to Tier 2'
        ]
      },
      {
        type: 'list',
        title: 'Tier 2 adds:',
        color: 'amber',
        items: [
          'Protocol applied',
          'Why could/couldn\u2019t resolve',
          'Time of receipt and action',
          'Why escalated to Tier 3'
        ]
      },
      {
        type: 'list',
        title: 'Tier 3 adds:',
        color: 'violet',
        items: [
          'Clinical triage decision',
          'Urgency',
          'Action taken',
          'Any process concerns'
        ]
      }
    ]
  },
  {
    id: 'training',
    number: 'T',
    title: 'Training & Competency',
    icon: '🎓',
    content: [
      {
        type: 'training-table',
        items: [
          {
            tier: 'Tier 1 \u2014 Reception',
            requirements: 'Care navigation induction \u2022 Red flag recognition \u2022 EMIS navigation \u2022 Pharmacy First awareness \u2022 Safeguarding Level 1 \u2022 Annual refresher + GP sign-off'
          },
          {
            tier: 'Tier 2 \u2014 Triager',
            requirements: 'All Tier 1 PLUS: Amber flag protocols (documented assessment) \u2022 Admin processing \u2022 NICE 2WW awareness \u2022 Mental health first aid \u2022 Safeguarding Level 2 \u2022 GP sign-off before operating \u2022 Quarterly thematic review'
          },
          {
            tier: 'Tier 3 \u2014 GP Triager',
            requirements: 'GMC-registered \u2022 Remote/telephone triage competent \u2022 Local pathways \u2022 Protocol review \u2022 Monthly audit + quarterly review \u2022 Significant event reporting'
          }
        ]
      }
    ]
  },
  {
    id: 'version-control',
    number: 'V',
    title: 'Version Control',
    icon: '📋',
    content: [
      {
        type: 'list',
        color: 'gray',
        items: [
          'v1.0 (Jan 2026) \u2014 Single-tier model.',
          'v2.0 (Feb 2026) \u2014 Three-tier introduction.',
          'v2.1\u20132.2 (Feb 2026) \u2014 Governance, time limits, audit, under-5 threshold, fit note renewal, Tier 2 scope refinements.',
          'v3.0 (Feb 2026) \u2014 Major update: 8 new red flags, 7 new amber flags, body-system grouping, binary Step 3, quick-match grid, exception-based audit, expanded high-risk groups, NICE NG12 cancer flags.',
          'v3.1 (Feb 2026) \u2014 Symptom Checker tool, signposting directory, tier-specific next-steps guidance, urgency classification banners, version alignment with SOP v3.1.'
        ]
      },
      {
        type: 'highlight',
        color: 'red',
        text: 'IF IN DOUBT AT ANY TIER \u2192 ESCALATE UP. NEVER DOWN.'
      },
      {
        type: 'highlight',
        color: 'blue',
        text: 'GP Triager from 8am daily \u2022 Duty/on-call clinician on site \u2022 999 for emergencies'
      },
      {
        type: 'highlight',
        color: 'green',
        text: 'A false escalation is safe. A missed escalation is not.'
      },
      {
        type: 'text',
        text: 'For detailed guidance, refer to the Three-Tier Triage SOP v3.1. This flowchart must be read alongside the full SOP.'
      }
    ]
  }
];
