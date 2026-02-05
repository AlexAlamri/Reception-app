// lib/sop-content.js - Triage Care Navigation SOP content for in-app reference

export const sopMeta = {
  version: '1.0',
  date: '02 January 2026',
  appliesTo: 'Reception / Care Navigation team',
  owner: 'Dr Sahar Jahanian',
  reviewDate: '02 July 2026',
  practices: 'Churchill Medical Centre & The Orchard Practice'
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
        text: 'This SOP supports a model where a GP (or other clinician) reviews all medical requests needing an appointment and decides urgency (the GP triager).'
      },
      {
        type: 'highlight',
        color: 'blue',
        text: 'Every day there will be a Clinical GP Triager from 8am as well as duty/on call clinician on site for emergencies.'
      },
      {
        type: 'text',
        text: 'Daily GP Triager has 2 roles: 1) Triage urgency of appointments and clinical requests 2) eConsult/Remote Consulting'
      },
      {
        type: 'list',
        title: 'Reception / care navigation staff SHOULD:',
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
        title: 'Reception / care navigation staff should NOT:',
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
    id: 'golden-rules',
    number: '2',
    title: 'Golden Rules',
    icon: '⭐',
    content: [
      {
        type: 'list',
        title: 'Always follow these rules:',
        color: 'amber',
        items: [
          "Use the patient's own words. Do not translate into medical terms.",
          'If the request mentions a red-flag word, stop and escalate (see Section 8).',
          'Check EMIS notes, problems and alerts first (Section 4).',
          'If it is clearly due/planned: book it. Do not ask for a triage form (Section 5).',
          'If it is suitable for Pharmacy First or self-care: signpost and safety-net (Sections 6-7).'
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
    number: '3',
    title: 'Quick Flow To-Do\'s for Requests',
    icon: '🔄',
    content: [
      {
        type: 'highlight',
        color: 'red',
        text: 'Reception NEVER decides the diagnosis. If UNCLEAR → GP Triager'
      },
      {
        type: 'steps',
        items: [
          { step: '1', label: 'Emergency NOW?', detail: 'Life-threatening symptoms (chest pain, stroke signs, severe breathlessness, collapse)', action: 'Call 999 / advise A&E / escalate to duty GP', color: 'red' },
          { step: '2', label: 'Clearly planned follow-up / monitoring due?', detail: 'Alert in EMIS or written plan in notes', action: 'Check EMIS → Book directly (no triage form). Add brief note.', color: 'blue' },
          { step: '', label: 'Clinical advice/queries/admin requiring clinician but not acutely unwell?', detail: '', action: 'GP Triager via eConsult Pathway', color: 'blue' },
          { step: '3', label: 'High Risk / Vulnerable patient?', detail: 'Check EMIS flags', action: 'If YES → Send direct to GP Triager/duty GP. If amber flag → flag urgently. If NO → Check amber flags.', color: 'amber' },
          { step: '4', label: 'Minor illness, short history, self-limiting, no red flags?', detail: '', action: 'Adult → CalmCare Card. Child → Healthier Together. Use Pharmacy First if eligible.', color: 'green' },
          { step: '', label: 'Self-care/Pharmacy First declined?', detail: '', action: 'GP Triager via eConsult if eligible', color: 'green' },
          { step: '5', label: 'Eye problem', detail: '', action: 'Signpost to SWL CUES via local optician or Royal Eye Unit. If severe → escalate.', color: 'blue' },
          { step: '6', label: 'Minor injury / wound / burn', detail: '', action: 'Signpost to Richmond UTC (Teddington) via NHS 111 or walk-in. If severe → 999/A&E.', color: 'blue' },
          { step: '', label: 'Pregnancy & Sexual Health', detail: 'If >18 weeks pregnant', action: 'Maternity Helpline (24/7)/DAU: 0208 934 2802. Sexual Health → Wolverton: 0208 974 9331', color: 'blue' },
          { step: '8', label: 'Fit Notes/MED3', detail: '', action: 'If suitable/eligible → GP Triager via eConsult. If NOT suitable/due review → GP Appt 1st.', color: 'blue' },
          { step: '9', label: 'Anything else', detail: 'Multiple problems, "severe/worsening/very worried", symptoms >2 weeks, not improving despite pharmacy, new lump/night sweats/unexplained bleeding/weight loss', action: 'SEND TO GP TRIAGE', color: 'gray' }
        ]
      }
    ]
  },
  {
    id: 'emis-checking',
    number: '4',
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
          'Recent test results that already answer the question (do not interpret results - just note they exist/relay existing clinician comment)'
        ]
      },
      {
        type: 'list',
        title: 'When you forward to the GP triager, include:',
        color: 'green',
        items: [
          "The patient's request in their own words (copy/paste if possible)",
          'Any relevant existing plan you found',
          'Any relevant vulnerability / risk flags you can see',
          'How to contact the patient and when they are available'
        ]
      }
    ]
  },
  {
    id: 'direct-booking',
    number: '5',
    title: 'Direct Booking',
    icon: '📅',
    content: [
      {
        type: 'table',
        headers: ['Item', 'Check in EMIS', 'Book with / Timeframe', 'Warning'],
        rows: [
          ['Follow-up already planned', 'Most recent consultation notes / task / SMS plan', 'Book with clinician stated, use timeframe stated', 'If unclear who/when → GP Triager'],
          ['Blood tests due', 'Recall/alert + last monitoring date + clinician plan', 'Phlebotomy / HCA slot', 'If patient says very unwell → escalate'],
          ['ECG due / requested', 'Clear plan in notes or hospital letter; not already booked', 'ECG appointment (HCA/nurse)', 'If chest pain NOW → 999'],
          ['Annual / chronic disease review', 'Recall alerts (diabetes, asthma, COPD, BP, CKD, CHD, stroke)', 'Nurse/HCA chronic disease review + pre-review bloods if needed', 'If flare-up or red flags → GP Triager'],
          ['Diabetes annual review package', 'Diabetes recall alert + bloods and foot check due', 'Bloods + review per local pathway', 'If BM <4 or >20, confusion, fruity breath, vomiting → escalate'],
          ['Postnatal check', 'Delivery date / postnatal recall, not already completed', 'Postnatal check per local policy', 'Heavy bleeding, severe headache, chest pain, breathlessness → Section 8'],
          ['Immunisations / vaccines due', 'Immunisation record + recall flags', 'Vaccination clinic', 'Vaccine side effects → CalmCare unless red flags'],
          ['Cervical screening / smear due', 'Cervical screening recall status', 'Nurse/HCA trained for smears', 'Post-coital bleeding, PMB, or lump → GP Triager'],
          ['Planned dressing / suture removal', 'Documented plan from clinician/UTC/hospital', 'Treatment room nurse', 'NEW wounds needing assessment → UTC']
        ]
      },
      {
        type: 'highlight',
        color: 'amber',
        text: 'If the patient is asking for a NEW medical problem (not planned/due), do not directly book a GP appointment — Send to the GP triager.'
      }
    ]
  },
  {
    id: 'pharmacy-first',
    number: '6',
    title: 'Community Pharmacy + Pharmacy First',
    icon: '💊',
    content: [
      {
        type: 'text',
        text: 'Community pharmacies can help with many minor illnesses, medicines advice, and some urgent prescriptions. In Kingston (SWL ICB), the NHS Pharmacy First service also lets pharmacists assess and treat certain conditions under agreed clinical pathways.'
      },
      {
        type: 'list',
        title: 'Use Pharmacy First when:',
        color: 'green',
        items: [
          'The request is clearly one of the Pharmacy First conditions below',
          'No red flags are mentioned',
          'The patient is not in a high-risk group (Section 9)',
          'The patient agrees to be directed/referred'
        ]
      },
      {
        type: 'highlight',
        color: 'amber',
        text: 'If any doubt, or the request is too vague to safely signpost, send to the GP triager.'
      },
      {
        type: 'script',
        title: 'Pharmacy First Script',
        text: '"We can refer you to your local Pharmacy First Service for further assessment & treatment, including prescription-only treatment such as antibiotics and antivirals, without waiting for a GP."'
      },
      {
        type: 'conditions',
        title: 'Pharmacy First Conditions (Kingston/SWL):',
        items: [
          { name: 'Earache', age: '1yr – 17yrs+' },
          { name: 'Impetigo', age: '1yr+' },
          { name: 'Infected insect bite', age: '1yr+' },
          { name: 'Shingles', age: '18yr+' },
          { name: 'Sinusitis', age: '12yr+' },
          { name: 'Sore throat', age: '5yr+' },
          { name: 'UTI women', age: '16-64yr' }
        ]
      }
    ]
  },
  {
    id: 'self-care',
    number: '7',
    title: 'Self-Care: CalmCare / Healthier Together',
    icon: '🏠',
    content: [
      {
        type: 'checklist',
        title: 'Use ONLY if ALL true:',
        color: 'green',
        items: [
          'Minor SINGLE symptom',
          'Short-lived (<7 days)',
          'NO red/amber flags',
          'NOT high-risk',
          'NOT "severe/worsening"',
          "You're confident",
          'Patient agrees'
        ]
      },
      {
        type: 'two-column',
        left: {
          title: 'Adults: CalmCare Cards',
          items: [
            'Pick the closest matching card from CalmCare A-Z',
            'Send card link (or printout) to patient',
            'Add record: "CalmCare advice given + safety net provided"',
            'Always include safety-net line'
          ]
        },
        right: {
          title: 'Children: Healthier Together',
          link: 'https://www.healthiertogether.nhs.uk/',
          items: [
            'Choose right age section (1-4 yrs, 5-11 yrs, Young person)',
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
      }
    ]
  },
  {
    id: 'red-flags',
    number: '8A',
    title: 'RED: ESCALATE — Call 999 / Advise A&E Now',
    icon: '🚨',
    content: [
      {
        type: 'highlight',
        color: 'red',
        text: 'Reception do not triage. This section is only about spotting words/phrases already present in the request and recognizing escalation.'
      },
      {
        type: 'red-flags-table',
        items: [
          { symptom: 'Chest pain / tight chest / pressure, especially with sweating, nausea, light-headedness, or pain spreading to arm/neck/jaw/back', action: 'Call 999 / advise A&E now' },
          { symptom: 'Stroke signs (FAST): face drooping, arm weakness, slurred speech, sudden confusion', action: 'Call 999 / advise A&E now' },
          { symptom: 'Severe breathing difficulty: "can\'t breathe", "can\'t speak", blue/grey lips, breathing very fast', action: 'Call 999 / advise A&E now' },
          { symptom: 'Sepsis-type words: "acting confused", "slurred speech", "blue/grey/pale/blotchy skin", "rash that doesn\'t fade", "very fast breathing", "I feel like I might die", "can\'t move at all"', action: 'Call 999 / advise A&E now' },
          { symptom: 'Collapse, drowsy, unconscious, seizure/fitting', action: 'Call 999 / advise A&E now' },
          { symptom: 'Severe allergic reaction: swelling of face/tongue/throat, difficulty breathing, widespread hives with breathing symptoms', action: 'Call 999 / advise A&E now' },
          { symptom: 'Vomiting blood, black/tarry stools, heavy bleeding that won\'t stop', action: 'Call 999 / advise A&E now' },
          { symptom: 'Sudden onset headache "worst headache of my life" +/- neck stiffness/sensitivity to light', action: 'Call 999 / advise A&E now' },
          { symptom: 'Severe sudden abdominal pain, or "can\'t pee", or "can\'t pass poo/fart" with severe pain', action: 'Call 999 / advise A&E now' },
          { symptom: 'Back pain with new loss of bladder/bowel control or numbness between legs (saddle area)', action: 'Call 999 / advise A&E now' },
          { symptom: 'Sudden onset testicular/groin pain with vomiting', action: 'Call 999 / advise A&E now' },
          { symptom: 'Pregnancy <12 weeks + one-sided pain + shoulder tip pain (possible ectopic)', action: 'Call 999 / A&E now' },
          { symptom: 'Suicide attempt in progress or immediate danger to self/others', action: 'Call 999 / advise A&E now' }
        ]
      }
    ]
  },
  {
    id: 'amber-flags',
    number: '8B',
    title: 'AMBER: Urgent Same-Day Clinician Review',
    icon: '🟠',
    content: [
      {
        type: 'amber-table',
        items: [
          { category: 'Breathing / cough', buzzwords: 'New or worsening breathlessness, wheeze, asthma/COPD flare-up, coughing blood, fever with chest pain', action: 'Send to duty clinician / GP triager for same-day review' },
          { category: 'Abdominal / GI', buzzwords: 'Severe persistent pain, dehydration, unable to keep fluids down, persistent vomiting, severe diarrhoea, diabetes + vomiting', action: 'Send to duty clinician / GP triager for same-day review' },
          { category: 'Diabetes', buzzwords: 'Blood sugar <4 with symptoms (shaking, sweating, confusion) or >20. Persistent vomiting with diabetes (DKA risk). New confusion, "fruity breath", "very thirsty and urinating a lot". Known Type 1 feeling very unwell', action: 'Send to duty clinician / GP triager for same-day review' },
          { category: 'Urinary', buzzwords: 'Blood in urine, flank/back pain, fever, male urinary symptoms, catheter, pregnancy', action: 'Send to duty clinician / GP triager for same-day review' },
          { category: 'Neurology / headache', buzzwords: 'Sudden severe headache, new weakness/numbness, new confusion, blackout/fainting. If stroke signs → 999', action: 'Send to duty clinician / GP triager (if stroke → 999)' },
          { category: 'Skin / infection', buzzwords: 'Rapidly spreading redness, face/eye involvement, very unwell, rigors/shivering', action: 'Send to duty clinician / GP triager' },
          { category: 'Eye', buzzwords: 'Painful red eye, sudden loss of vision, flashes/floaters, injury/chemical splash', action: 'CUES / Royal Eye Unit. If severe → 999/A&E' },
          { category: "Women's health", buzzwords: 'Pregnant (<18 weeks) + pain/bleeding +/- shoulder tip pain, pregnant (<18 weeks) + vomiting (can\'t keep fluids), reduced fetal movements (18+ weeks), postnatal heavy bleeding, severe headache postnatal', action: 'Maternity triage. If severe → 999' },
          { category: 'Possible cancer red flags', buzzwords: 'New lump, unexplained weight loss, persistent unexplained rectal bleeding, persistent change in bowel habit (>6 weeks), swallowing difficulty, blood in urine, postmenopausal bleeding, voice hoarseness >3 weeks, persistent cough >3 weeks', action: 'Send to GP triager (do not book routine without clinician review)' },
          { category: 'Safeguarding', buzzwords: 'Domestic abuse, sexual assault, child/adult safeguarding concern/alert', action: 'Escalate to duty clinician + follow safeguarding policy' },
          { category: 'Mental health', buzzwords: 'Active suicidal thoughts with plan ("I am going to..."), recent self-harm with intent to die, psychotic symptoms causing distress (hearing voices telling them to harm), acute severe agitation or distress', action: 'Escalate to duty clinician. Crisis Line: 0800 028 8000. CAMHS: 0203 228 5980' }
        ]
      }
    ]
  },
  {
    id: 'high-risk',
    number: '9',
    title: 'High-Risk + Vulnerable Patients',
    icon: '🛡️',
    content: [
      {
        type: 'highlight',
        color: 'amber',
        text: 'If a patient is in one of these groups, do not rely on self-care or Pharmacy First if the request sounds infectious, severe, or unusual. Send to the GP triager unless it is a clearly planned/due appointment.'
      },
      {
        type: 'risk-groups',
        items: [
          { group: 'Pregnant or recently pregnant (postnatal)', action: 'Escalate medical symptoms (especially infection, bleeding, headache, abdominal pain, breathlessness). Planned postnatal checks can be booked directly.' },
          { group: 'Weakened immune system (chemotherapy, organ transplant, biologic/immunosuppressive medicines, long-term steroids, advanced HIV)', action: 'Escalate any suspected infection, shingles, widespread rash, fever, or feeling very unwell.' },
          { group: 'Frail older adults / care home residents', action: 'Lower threshold to escalate for falls, confusion, infection, dehydration, breathlessness.' },
          { group: 'Severe long-term conditions (severe asthma/COPD, heart failure, severe kidney disease, insulin-treated diabetes)', action: 'Escalate new/worsening symptoms; avoid delays.' },
          { group: 'Known safeguarding concerns, severe mental illness, learning disability/autism with communication difficulty', action: 'Escalate unclear or worrying requests and follow local safeguarding / reasonable adjustments.' },
          { group: 'Under 1 year of age', action: 'Direct to GP Triager UNLESS RED FLAGS → then 999' }
        ]
      }
    ]
  },
  {
    id: 'utc',
    number: '10',
    title: 'Injuries, Burns, Wounds: UTC — Teddington',
    icon: '🩹',
    content: [
      {
        type: 'highlight',
        color: 'blue',
        text: 'Teddington Memorial Hospital, Hampton Road, Teddington TW11 0JL. Open 8am-8pm, 7 days. Book via NHS 111 or walk-in.'
      },
      {
        type: 'list',
        title: 'UTC can treat (adults & children):',
        color: 'green',
        items: [
          'Upper respiratory tract infections, coughs, colds, earache, sore throats, asthma exacerbations, flu-like symptoms',
          'Minor skin & tissue infections: rashes, insect bites, impetigo, minor cellulitis, abscesses, wound infections',
          'GI symptoms + UTIs: diarrhoea, vomiting, constipation, abdominal pain, oral thrush',
          'Minor injuries to head, limbs — bumps/bruising or possible fractures',
          'Eye conditions: conjunctivitis, chalazion, styes',
          'Wounds including burns/scalds and lacerations +/- requiring stitching',
          'Other: fever, headache, crying baby, baby not feeding, colic, foreign bodies (ear/nose), fainting, nose bleeds, emergency contraception'
        ]
      },
      {
        type: 'highlight',
        color: 'red',
        text: 'Do NOT direct to UTC if the request suggests a life-threatening emergency (Section 8A). Use 999/A&E.'
      }
    ]
  },
  {
    id: 'eye',
    number: '11',
    title: 'Eye Problems',
    icon: '👁️',
    content: [
      {
        type: 'subsection',
        title: '11A. Primary Care Eye Service (MECS) — Self-Referral',
        content: [
          { type: 'text', text: 'Appropriate for many urgent eye problems: red eye, painful eye, sudden onset irritation, suspected foreign body, flashes/floaters, eyelid lumps/styes.' },
          { type: 'text', text: 'Patient can self-refer by contacting a participating local optician.' },
          { type: 'link', text: 'Primary Eye Care MECS', url: 'https://primaryeyecare.co.uk/services/minor-eye-conditions-service/' }
        ]
      },
      {
        type: 'subsection',
        title: '11B. Kingston Hospital — The Royal Eye Unit',
        content: [
          { type: 'text', text: 'Appointment only (no walk-in). For: new/worsening visual disturbance, vision loss, suspected shingles around forehead/face/eye, floaters/flashes, painful red eye +/- light sensitivity, painful red eye in contact lens wearer.' },
          { type: 'contact', service: 'Urgent eye problems', number: '020 8934 6799', hours: 'Mon-Fri 8:30am-4:30pm (last appt 4pm)' },
          { type: 'contact', service: 'Main number', number: '020 8934 6404', hours: 'Mon-Fri 9am-5pm' },
          { type: 'text', text: 'Out of hours: advise NHS 111 or A&E in an emergency.' }
        ]
      },
      {
        type: 'subsection',
        title: '11C. RED Eye Red Flags (999 / A&E)',
        content: [
          { type: 'list', color: 'red', items: ['Chemical splash to the eye', 'Sudden loss of vision with other neurological symptoms (stroke symptoms)', 'Penetrating injury or severe trauma', 'Any eye problem with severe collapse/breathing difficulty'] }
        ]
      }
    ]
  },
  {
    id: 'womens-health',
    number: '12',
    title: "Women's Health, Contraception & Pregnancy",
    icon: '🤰',
    content: [
      {
        type: 'subsection',
        title: '12A. Wolverton Centre (Sexual Health & Contraception) — Self-Referral',
        content: [
          { type: 'text', text: 'Contraception (pills, patches, injections, implants, coils, emergency contraception), genital symptoms (discharge, itching, painful sex, sores, pelvic pain where STI is a concern), STI testing and treatment.' },
          { type: 'contact', service: 'Wolverton Centre', number: '0208 974 9331' },
          { type: 'link', text: 'Sexual Health Kingston', url: 'https://www.sexualhealthkingston.co.uk/' },
          { type: 'highlight', color: 'amber', text: 'If severe pelvic pain, fainting/collapse, or heavy bleeding → escalate to clinician/999' }
        ]
      },
      {
        type: 'subsection',
        title: '12B. Antenatal (Pregnancy) — Self-Referral to Kingston Hospital',
        content: [
          { type: 'link', text: 'Kingston Maternity self-referral form', url: 'https://www.kingstonmaternity.org.uk/pregnancy/referral-form' },
          { type: 'highlight', color: 'blue', text: 'OVER 18 weeks → Contact Maternity Triage / DAU: 0208 934 2802' },
          { type: 'highlight', color: 'amber', text: 'UNDER 18 weeks with abdominal pain/bleeding/vomiting (can\'t keep fluids) or shoulder tip pain → Duty / Same day' },
          { type: 'highlight', color: 'red', text: 'UNDER 12 weeks + one-sided abdominal pain + shoulder tip pain → 999/A&E for possible ectopic pregnancy' }
        ]
      },
      {
        type: 'subsection',
        title: '12C. Maternity Triage / DAU: When to Use',
        content: [
          { type: 'text', text: 'More than 18 weeks pregnant with: reduced fetal movements, bleeding, waters breaking, contractions/labour, severe abdominal pain, severe headache/visual changes, or feeling very unwell.' },
          { type: 'contact', service: 'Maternity Helpline (24/7)', number: '0208 934 2802' },
          { type: 'contact', service: 'Day Assessment Unit (DAU)', number: '020 8934 1234 ext 4034', hours: '8:30am-7:30pm (call first, no walk-in)' }
        ]
      },
      {
        type: 'subsection',
        title: '12D. Termination of Pregnancy (Abortion) — Self-Referral',
        content: [
          { type: 'script', title: 'Script', text: '"If you are pregnant and do not wish to continue with the pregnancy you can refer yourself for NHS funded (free) abortion care. If you are registered with a GP practice in any London borough or Surrey you can contact any of the following providers."' },
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
    number: '13',
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
                  'If YES → GP Triager to issue via eConsult',
                  'Check EMIS: Is there a relevant discharge summary / OOH or hospital letter?',
                  'If YES → GP Triager to issue via eConsult',
                  'If NO for both → Check red flags first, then will need GP Appt 1st (if unsure re: urgency → GP Triager)'
                ]
              },
              {
                label: 'RENEWAL',
                steps: [
                  'Check last associated GP review in EMIS — due follow-up/review?',
                  'If follow-up due: Check no red flags, book GP follow-up as per EMIS plan if no changes. If worsening → escalate to GP triager',
                  'If no follow-up required and renewal only → GP Triager to issue via eConsult'
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
    number: '14',
    title: 'eConsults / Remote Consults',
    icon: '💻',
    content: [
      {
        type: 'text',
        text: 'Remote/online consulting via GP Triager is appropriate when the episode of care does not need face-to-face contact, with explicit safety-netting and a clear route to escalation.'
      },
      {
        type: 'list',
        title: 'Hard stops — do NOT use eConsult if:',
        color: 'red',
        items: [
          'Any RED FLAG words and NOT been clinically reviewed',
          'Any AMBER flags that have NOT been clinically reviewed needing same-day review',
          'UNWELL high-risk/vulnerable patients (OK if clinical admin/query/advice/fit note in WELL patient)',
          "Requests that are: multiple problems, 'severe/worsening/very worried', recurrent, >2 weeks and not improving, or not clearly matchable to a single pathway"
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
    id: 'service-directory',
    number: '15',
    title: 'Service Directory',
    icon: '📖',
    content: [
      {
        type: 'services',
        items: [
          { service: 'Community pharmacy / NHS Pharmacy First', bestFor: 'Minor illness, medicines advice, Pharmacy First pathways', access: 'Walk in or call a pharmacy', notes: 'If red flags or high-risk group → GP triager' },
          { service: 'NHS 111', bestFor: 'Urgent advice when not a 999 emergency', access: 'Phone 111 or NHS 111 online', notes: 'Good safety-net option' },
          { service: 'Richmond UTC (Teddington)', bestFor: 'Urgent injuries/illness not life-threatening', access: 'Book via NHS 111 or walk in. 8am-8pm daily', notes: 'Use 999/A&E for life-threatening emergencies' },
          { service: 'Primary Care Eye Service (CUES/MECS)', bestFor: 'Many urgent eye problems', access: 'Self-refer via participating optician', notes: 'Quicker than GP for eye assessments' },
          { service: 'Kingston Royal Eye Unit', bestFor: 'Urgent eye problems needing hospital', access: 'Appointment only. Urgent clinic Mon-Fri', notes: 'Out of hours → NHS 111 or A&E' },
          { service: 'Wolverton Centre', bestFor: 'Contraception incl coils/implants, STI testing, genital symptoms', access: 'Self-refer. 0208 974 9331', notes: 'If severe pain/collapse/heavy bleeding → 999' },
          { service: 'Kingston maternity services', bestFor: 'Antenatal booking and urgent pregnancy concerns', access: 'Self-referral online. Helpline 24/7 for >18 weeks', notes: '0208 934 2802' },
          { service: 'Abortion providers (BPAS / MSI / NUPAS)', bestFor: 'Termination of pregnancy (NHS-funded)', access: 'Self-refer directly', notes: 'If heavy bleeding/severe pain → 999/A&E' },
          { service: 'Kingston Talking Therapies', bestFor: 'Anxiety, low mood, stress', access: 'Self-referral online', notes: 'If immediate danger/self-harm → 999/crisis', url: 'https://swlstg.nhs.uk/kingston-talking-therapies' },
          { service: 'Stop smoking support', bestFor: 'Help to stop smoking/vaping', access: 'Self-refer / direct book in-house service', notes: '' }
        ]
      }
    ]
  },
  {
    id: 'documentation',
    number: '16',
    title: 'Documentation',
    icon: '✍️',
    content: [
      {
        type: 'list',
        title: 'Record EVERY time:',
        color: 'blue',
        items: [
          'What you booked OR where you signposted/referred the patient (specific resource name)',
          'Which resource you sent: CalmCare card title or Healthier Together page title/link',
          'That you checked EMIS notes/alerts (briefly)',
          'Any safety-net advice given (especially if signposting/self-care)',
          "If escalated: who you sent it to (GP triager/duty clinician) and why (use patient's words)"
        ]
      },
      {
        type: 'highlight',
        color: 'green',
        text: "Tip: copy/paste the patient's exact wording into the message to the GP triager. This reduces risk and avoids misinterpretation."
      }
    ]
  }
];
