'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, Phone, AlertTriangle, CheckCircle, Clock, ChevronRight, 
  ChevronLeft, Copy, Check, History, Home, X, AlertCircle, FileText,
  Shield, Pill, GraduationCap, Settings, Info, LogOut, Lock, User, 
  Save, Download, Upload, Plus, Trash2, Edit, RefreshCw, Eye, EyeOff,
  ExternalLink, Globe, BookOpen, ChevronDown, ChevronUp, RotateCcw,
  Zap, ArrowRight, ClipboardCheck, GitBranch
} from 'lucide-react';
import {
  redFlags as defaultRedFlags,
  amberFlags as defaultAmberFlags,
  highRiskGroups as defaultHighRiskGroups,
  pharmacyFirstConditions as defaultPharmacyFirst,
  directBookingItems as defaultDirectBooking,
  contacts as defaultContacts,
  scripts as defaultScripts,
  pathways as defaultPathways,
  trainingScenarios as defaultTraining,
  quickMatchPathways,
  trainingTopics,
  tier2Actions,
  purpleFlags,
  yellowFlags,
  greenFlags,
  stopPatterns
} from '../lib/data';
import { sopMeta, sopSections } from '../lib/sop-content';
import { flowchartMeta, flowchartSections } from '../lib/flowchart-content';
import {
  getSession, clearSession, authenticateUser, isAdmin, canAccessTier, getGroupLabel,
  getSettings, saveSettings, getCustomData, saveCustomData, clearCustomData,
  getUsers, saveUsers, exportAllData, importAllData, getAuditLog,
  DEFAULT_SETTINGS, logAction, changePassword, validatePassword,
  getSessionTimeRemaining, extendSession, isLockedOut, getLockoutRemaining,
  addUser, initializeUsers
} from '../lib/auth';

// ============ DATA HOOK ============
function useTriageData() {
  const [customData, setCustomData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setCustomData(getCustomData()); setLoaded(true); }, []);
  const get = (key, defaultVal) => customData?.[key] || defaultVal;
  const update = (key, value) => { const d = { ...customData, [key]: value }; setCustomData(d); saveCustomData(d); };
  const reset = () => { clearCustomData(); setCustomData(null); };
  return {
    loaded, update, reset, customData,
    redFlags: get('redFlags', defaultRedFlags),
    amberFlags: get('amberFlags', defaultAmberFlags),
    highRiskGroups: get('highRiskGroups', defaultHighRiskGroups),
    pharmacyFirst: get('pharmacyFirst', defaultPharmacyFirst),
    directBooking: get('directBooking', defaultDirectBooking),
    contacts: get('contacts', defaultContacts),
    scripts: get('scripts', defaultScripts),
    pathways: get('pathways', defaultPathways),
    training: get('training', defaultTraining),
  };
}

// ============ KEYWORD SCANNER HOOK ============
// Words that suggest an ONGOING problem that has CHANGED — flags Step 3
const CHANGE_WORDS = ['worse','worsening','not improving','getting worse','changed','different now','new symptom','come back','returned','recurring','still','again','not better','deteriorat','flared up','spreading','progressed','persistent','ongoing','keeps coming','never had before','worst ever'];

function useKeywordScanner(text, redFlags, amberFlags, pharmacyFirst, highRiskGroups) {
  return useMemo(() => {
    if (!text || text.length < 2) return null;
    const lower = text.toLowerCase();
    const kw = (k) => { const kl = k.toLowerCase(); return lower.includes(kl) || kl.includes(lower); };
    const red = redFlags.filter(f => f.keywords.some(k => kw(k)));
    const amber = amberFlags.filter(f => f.keywords.some(k => kw(k)) || (f.searchTerms && f.searchTerms.some(t => kw(t))));
    const pharmacy = pharmacyFirst.filter(c => (c.condition && kw(c.condition)) || (c.name && kw(c.name)) || (c.keywords && c.keywords.some(k => kw(k))));
    const risk = highRiskGroups.filter(g => {
      if (g.keywords) return g.keywords.some(k => kw(k));
      const terms = g.group.toLowerCase().split(/[\s/,]+/);
      return terms.some(t => t.length > 3 && (lower.includes(t) || t.includes(lower)));
    });
    const changeWords = CHANGE_WORDS.filter(w => lower.includes(w));
    const hasChange = changeWords.length > 0;
    const matchedPathways = quickMatchPathways.filter(p => p.keywords.some(k => kw(k)));
    const CANCER_KEYWORDS = ['lump', 'unexplained weight loss', 'weight loss unexplained', 'unexplained bleeding', 'persistent bowel change', 'difficulty swallowing', 'hoarseness', 'postmenopausal bleeding', 'night sweats', 'blood in stool', 'blood in urine', 'mole changed', 'mole growing'];
    const cancer = CANCER_KEYWORDS.filter(k => lower.includes(k) || k.includes(lower));
    // NEW: Purple flag scanning
    const purple = purpleFlags.filter(f => f.keywords.some(k => kw(k)));
    const hasPurple = purple.length > 0;
    // NEW: Yellow flag scanning
    const yellow = yellowFlags.filter(f => f.keywords.some(k => kw(k)));
    const hasYellow = yellow.length > 0;
    // NEW: Green flag scanning
    const green = greenFlags.filter(f => f.keywords.some(k => kw(k)));
    const hasGreen = green.length > 0;
    // NEW: STOP pattern scanning (HIGHEST PRIORITY)
    const stop = stopPatterns.filter(p => p.keywords.some(k => kw(k)));
    const hasStop = stop.length > 0;
    return {
      // EXISTING:
      red, hasRed: red.length > 0, amber, hasAmber: amber.length > 0, pharmacy,
      risk, hasRisk: risk.length > 0, changeWords, hasChange,
      pathways: matchedPathways, hasPathway: matchedPathways.length > 0,
      cancer, hasCancer: cancer.length > 0,
      hasAny: red.length + amber.length + pharmacy.length + risk.length + matchedPathways.length + purple.length + yellow.length + green.length + stop.length + (hasChange ? 1 : 0) > 0,
      // NEW:
      purple, hasPurple, yellow, hasYellow, green, hasGreen, stop, hasStop
    };
  }, [text, redFlags, amberFlags, pharmacyFirst, highRiskGroups]);
}

// ============ DESIGN TOKENS ============
const C = {
  red: { text: 'text-triage-red-text', bg: 'bg-triage-red-light', border: 'border-triage-red-dark', card: 'bg-triage-red-light border-l-triage-red-dark', dot: 'bg-triage-red-dark', ring: 'ring-triage-red-dark/30' },
  amber: { text: 'text-triage-amber-text', bg: 'bg-triage-amber-light', border: 'border-triage-amber-dark', card: 'bg-triage-amber-light border-l-triage-amber-dark', dot: 'bg-triage-amber-dark', ring: 'ring-triage-amber-dark/30' },
  green: { text: 'text-triage-green-text', bg: 'bg-triage-green-light', border: 'border-triage-green-dark', card: 'bg-triage-green-light border-l-triage-green-dark', dot: 'bg-triage-green-dark', ring: 'ring-triage-green-dark/30' },
  blue: { text: 'text-triage-blue-text', bg: 'bg-triage-blue-light', border: 'border-triage-blue-dark', card: 'bg-triage-blue-light border-l-triage-blue-dark', dot: 'bg-triage-blue-dark', ring: 'ring-triage-blue-dark/30' },
  teal: { text: 'text-triage-teal-text', bg: 'bg-triage-teal-light', border: 'border-triage-teal-dark', card: 'bg-triage-teal-light border-l-triage-teal-dark', dot: 'bg-triage-teal-dark', ring: 'ring-triage-teal-dark/30' },
  violet: { text: 'text-triage-purple-text', bg: 'bg-triage-purple-light', border: 'border-triage-purple-dark', card: 'bg-triage-purple-light border-l-triage-purple-dark', dot: 'bg-triage-purple-dark', ring: 'ring-triage-purple-dark/30' },
  gray: { text: 'text-triage-grey-text', bg: 'bg-triage-grey-light', border: 'border-triage-grey-dark', card: 'bg-triage-grey-light border-l-triage-grey-dark', dot: 'bg-triage-grey-dark', ring: '' },
};

// ============ ICON LOOKUPS ============
const systemIcons = {
  'Cardiac': { icon: '❤️', bg: 'bg-triage-red-light' },
  'Respiratory': { icon: '🫁', bg: 'bg-triage-blue-light' },
  'Neurological': { icon: '🧠', bg: 'bg-triage-purple-light' },
  'Sepsis/Meningitis': { icon: '🦠', bg: 'bg-triage-red-light' },
  'GI/Abdominal': { icon: '🫃', bg: 'bg-triage-yellow-light' },
  'Vascular': { icon: '🩸', bg: 'bg-triage-red-light' },
  'Urological': { icon: '💧', bg: 'bg-triage-blue-light' },
  'Obstetric': { icon: '🤰', bg: 'bg-pink-100' },
  'Oncology': { icon: '🎗️', bg: 'bg-triage-purple-light' },
  'Eye': { icon: '👁️', bg: 'bg-triage-teal-light' },
  'Allergy': { icon: '⚠️', bg: 'bg-triage-amber-light' },
  'Mental Health': { icon: '💚', bg: 'bg-triage-green-light' },
};

const pathwayIcons = {
  'Eye Emergency': { icon: '👁️', bg: 'bg-triage-teal-light' },
  'Injury / Acute Trauma': { icon: '🦴', bg: 'bg-triage-amber-light' },
  'Pregnancy >18wks': { icon: '🤰', bg: 'bg-pink-100' },
  'Sexual Health': { icon: '🩺', bg: 'bg-triage-purple-light' },
  'Mental Health (non-crisis)': { icon: '🧠', bg: 'bg-triage-green-light' },
  'Health Visiting (0–5)': { icon: '👶', bg: 'bg-triage-yellow-light' },
  'Abortion Services': { icon: '🚫', bg: 'bg-triage-purple-light' },
  'NHS 111': { icon: '📞', bg: 'bg-triage-blue-light' },
  'NHS 111 Emergency Rx': { icon: '💊', bg: 'bg-triage-amber-light' },
  'Mental Health Crisis': { icon: '🚨', bg: 'bg-triage-red-light' },
  '999 / A&E': { icon: '🚑', bg: 'bg-triage-red-light' },
  'Pharmacy First': { icon: '💊', bg: 'bg-triage-green-light' },
  'Planned / EMIS': { icon: '📋', bg: 'bg-triage-blue-light' },
};

const pharmacyIcons = {
  'Sinusitis': { icon: '🤧', bg: 'bg-triage-yellow-light' },
  'Sore Throat': { icon: '🗣️', bg: 'bg-triage-amber-light' },
  'Earache': { icon: '👂', bg: 'bg-triage-yellow-light' },
  'Infected Insect Bite': { icon: '🐛', bg: 'bg-triage-green-light' },
  'Impetigo': { icon: '🩹', bg: 'bg-triage-amber-light' },
  'Shingles': { icon: '🔥', bg: 'bg-triage-red-light' },
  'UTI': { icon: '💧', bg: 'bg-triage-blue-light' },
};

const purpleIcons = {
  'Possible cancer / 2WW (NICE NG12)': { icon: '🎗️' },
  'Mental health (CRISIS)': { icon: '🧠' },
  'Safeguarding': { icon: '🛡️' },
  'Under 1 year — ANY new concern': { icon: '👶' },
  'High-risk + NEW symptoms': { icon: '⚠️' },
  'Multiple / vague / >2 weeks / worst ever': { icon: '🔀' },
  'ALL medication decisions': { icon: '💊' },
};

const amberIcons = {
  'Breathing: new/worsening': { icon: '🫁' },
  'Abdominal: severe/acute': { icon: '🫃' },
  'Diabetes urgent': { icon: '💉' },
  'Urinary: blood/fever/male/pregnant': { icon: '💧' },
  'Neurology/Head': { icon: '🧠' },
  'Skin/Infection': { icon: '🩹' },
  'Eye problems': { icon: '👁️' },
  'DVT (NG158)': { icon: '🦵' },
  'PE (NG158)': { icon: '🫁' },
  'GCA (NG244)': { icon: '🤕' },
  'Renal Colic': { icon: '🫘' },
  'Fever <5s (NG143)': { icon: '🌡️' },
  'Neutropenic Sepsis': { icon: '🦠' },
  'Testicular Pain (non-torsion)': { icon: '⚠️' },
  "Women's Health": { icon: '🤰' },
  'Acute Back Pain + flags': { icon: '🦴' },
};

const getIcon = (map, name) => {
  if (!name) return null;
  return map[name] || null;
};

// ============ CORE UI COMPONENTS ============
const EmergencyBanner = () => (
  <div className="emergency-banner text-white py-2.5 px-4 text-center font-semibold sticky top-0 z-50 text-sm">
    <span className="animate-pulse mr-1">🚨</span>
    EMERGENCY → <a href="tel:999" className="underline ml-1 text-lg font-semibold">CALL 999</a>
    <span className="text-white/70 ml-2 text-sm hidden sm:inline">Chest pain · Can&apos;t breathe · Collapse · Stroke</span>
  </div>
);

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const styles = { success: 'bg-triage-green-dark', error: 'bg-triage-red-dark', info: 'bg-triage-blue-dark' };
  return (
    <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 ${styles[type] || styles.info} text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 animate-toast`}>
      {type === 'success' ? <Check size={18} /> : type === 'error' ? <X size={18} /> : null}
      <span className="font-semibold text-sm">{message}</span>
    </div>
  );
};

const GlassCard = ({ children, color = 'gray', onClick, className = '' }) => {
  const c = C[color] || C.gray;
  return (
    <div onClick={onClick} className={`${c.bg} border ${c.border} rounded-2xl p-4 mb-3 transition-all duration-200 shadow-sm ${onClick ? 'cursor-pointer hover:brightness-95 active:scale-[0.98]' : ''} ${className}`}>
      {children}
    </div>
  );
};

const Button = ({ children, color = 'blue', onClick, full = false, size = 'md', disabled = false, type = 'button' }) => {
  const styles = {
    blue: 'bg-triage-blue-light hover:bg-triage-blue-light text-triage-blue-text border-triage-blue-dark/30',
    green: 'bg-triage-green-light hover:bg-triage-green-light text-triage-green-text border-triage-green-dark/30',
    red: 'bg-triage-red-light hover:bg-triage-red-light text-triage-red-text border-triage-red-dark/30',
    amber: 'bg-triage-amber-light hover:bg-triage-amber-light text-triage-amber-text border-triage-amber-dark/30',
    teal: 'bg-triage-teal-light hover:bg-triage-teal-light text-triage-teal-text border-triage-teal-dark/30',
    gray: 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-200',
    solid: 'bg-triage-blue-dark hover:bg-triage-blue-dark/90 text-white border-transparent',
  };
  const sizes = { sm: 'px-3 py-2 text-sm', md: 'px-5 py-3', lg: 'px-6 py-4 text-lg' };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${styles[color]} border rounded-xl font-semibold ${sizes[size]} ${full ? 'w-full' : ''} transition-all disabled:opacity-40 active:scale-95 flex items-center justify-center gap-2`}>
      {children}
    </button>
  );
};

const Input = ({ label, type = 'text', value, onChange, placeholder, required, error, disabled, ...rest }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-500 mb-1.5">{label}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} disabled={disabled}
      className={`w-full px-4 py-3 rounded-xl bg-white border ${error ? 'border-triage-red-dark/50' : 'border-gray-200'} focus:border-triage-blue-dark/50 focus:outline-none focus:ring-2 focus:ring-triage-blue-light text-gray-800 transition-all disabled:opacity-40`} {...rest} />
    {error && <p className="text-triage-red-text text-sm mt-1">{error}</p>}
  </div>
);

const TextArea = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-500 mb-1.5">{label}</label>}
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-triage-blue-dark/50 focus:outline-none focus:ring-2 focus:ring-triage-blue-light text-gray-800 resize-none transition-all" />
  </div>
);

const SearchBar = ({ value, onChange, placeholder }) => (
  <div className="relative mb-4">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white border border-gray-200 focus:border-triage-blue-dark/40 focus:outline-none focus:ring-2 focus:ring-triage-blue-light text-gray-800 text-lg transition-all" />
    {value && <button onClick={() => onChange('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"><X size={20} /></button>}
  </div>
);

const BackButton = ({ onClick }) => (
  <button onClick={onClick} className="flex items-center gap-1 text-triage-blue-text mb-4 py-2 hover:text-triage-blue-dark transition-colors font-medium text-sm">
    <ChevronLeft size={18} /> Back
  </button>
);

const CopyBtn = ({ text, label = 'Copy', onCopy }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); onCopy?.(); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={copy} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-semibold transition-all mt-2 ${copied ? 'bg-triage-green-light border-triage-green-dark/40 text-triage-green-text' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}>
      {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> {label}</>}
    </button>
  );
};

const PhoneLink = ({ service, number, hours, priority = 'normal', icon, website, address }) => {
  const color = priority === 'red' ? 'red' : priority === 'amber' ? 'amber' : 'blue';
  const c = C[color];
  return (
    <GlassCard color={color}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <div className="font-semibold text-gray-800">{service}</div>
            <div className="text-sm text-gray-400">{hours}</div>
            {address && <div className="text-sm text-gray-400 mt-1">{address}</div>}
          </div>
        </div>
        <a href={`tel:${number.replace(/\s/g, '')}`} className={`flex items-center gap-2 font-bold text-lg ${c.text} hover:opacity-80`}>
          <Phone size={20} />{number}
        </a>
      </div>
      {website && (
        <button onClick={(e) => { e.stopPropagation(); window.open(website.startsWith('http') ? website : `https://${website}`, '_blank'); }}
          className="mt-3 flex items-center gap-2 text-sm px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors w-full justify-center font-medium text-gray-500">
          <Globe size={16} />Visit Website<ExternalLink size={14} />
        </button>
      )}
    </GlassCard>
  );
};

// ============ AUTH COMPONENTS ============
const ROLE_LABELS = { reception: 'Reception', tier2: 'Tier 2', tier3: 'GP Triager', partner: 'Partner', admin: 'Admin', staff: 'Reception' };

const UserBadge = ({ session, onLogout }) => (
  <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-2 shadow-sm">
    <div className="flex items-center gap-2 text-sm min-w-0">
      <div className="w-6 h-6 rounded-lg bg-triage-blue-light flex items-center justify-center flex-shrink-0"><User size={12} className="text-triage-blue-text" /></div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500 font-medium text-sm truncate">{session.name}</span>
          <span className="bg-triage-blue-light text-triage-blue-text text-sm px-1.5 py-0.5 rounded font-semibold flex-shrink-0">{ROLE_LABELS[session.role] || session.role}</span>
        </div>
        {session.group && <div className="text-sm text-gray-400 truncate">{getGroupLabel(session.group)}</div>}
      </div>
    </div>
    <button onClick={onLogout} className="flex items-center gap-1 text-gray-400 hover:text-triage-red-text text-sm transition-colors flex-shrink-0"><LogOut size={12} />Logout</button>
  </div>
);

const PasswordChangeModal = ({ userId, isFirstLogin, onComplete, onCancel, toast }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    const v = validatePassword(newPassword); if (!v.valid) { setError(v.message); return; }
    setLoading(true);
    const r = await changePassword(userId, currentPassword, newPassword);
    setLoading(false);
    if (r.success) { toast('Password changed', 'success'); onComplete(); } else { setError(r.message); }
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fade">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-triage-blue-light rounded-2xl flex items-center justify-center mx-auto mb-4"><Lock className="text-triage-blue-text" size={32} /></div>
          <h2 className="text-xl font-bold text-gray-800">{isFirstLogin ? 'Set Your Password' : 'Change Password'}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          {!isFirstLogin && <Input label="Current Password" type={showPasswords ? 'text' : 'password'} value={currentPassword} onChange={setCurrentPassword} required />}
          <Input label="New Password" type={showPasswords ? 'text' : 'password'} value={newPassword} onChange={setNewPassword} required />
          <Input label="Confirm Password" type={showPasswords ? 'text' : 'password'} value={confirmPassword} onChange={setConfirmPassword} required />
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
            <input type="checkbox" checked={showPasswords} onChange={(e) => setShowPasswords(e.target.checked)} className="rounded accent-triage-blue-dark" /><label>Show passwords</label>
          </div>
          {error && <div className="bg-triage-red-light text-triage-red-text px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2 border border-triage-red-dark/20"><AlertCircle size={18} />{error}</div>}
          <div className="flex gap-3">
            {!isFirstLogin && <Button type="button" color="gray" onClick={onCancel} full>Cancel</Button>}
            <Button type="submit" color="solid" full disabled={loading}>{loading ? <RefreshCw size={20} className="animate-spin" /> : 'Set Password'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LoginScreen = ({ onLogin, toast }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const settings = getSettings();
  const submit = async (e) => {
    e.preventDefault(); setError('');
    if (isLockedOut(username.trim())) { setError(`Account locked. Try again in ${getLockoutRemaining(username.trim())} minutes.`); return; }
    setLoading(true);
    const r = await authenticateUser(username.trim(), password);
    setLoading(false);
    if (r.session) { toast(`Welcome, ${r.session.name}!`, 'success'); onLogin(r.session); }
    else { setError(r.error || 'Invalid credentials'); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F8F7F4' }}>
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-8 animate-fade-slide">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-triage-blue-light flex items-center justify-center mx-auto mb-4 border border-triage-blue-dark/20"><Shield className="text-triage-blue-text" size={40} /></div>
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Care Navigator</h1>
          <p className="text-gray-500 mt-1.5 font-medium">{settings.practiceName}</p>
        </div>
        <form onSubmit={submit}>
          <Input label="Username" value={username} onChange={setUsername} placeholder="Enter username" required autoCapitalize="none" autoCorrect="off" spellCheck={false} autoComplete="username" />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required
                autoCapitalize="none" autoCorrect="off" spellCheck={false} autoComplete="current-password"
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white border border-gray-200 focus:border-triage-blue-dark/50 focus:outline-none focus:ring-2 focus:ring-triage-blue-light text-gray-800 transition-all" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{showPw ? <EyeOff size={20} /> : <Eye size={20} />}</button>
            </div>
          </div>
          {error && <div className="bg-triage-red-light text-triage-red-text px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2 border border-triage-red-dark/20"><AlertCircle size={18} />{error}</div>}
          <Button type="submit" color="solid" full size="lg" disabled={loading}>{loading ? <><RefreshCw size={20} className="animate-spin" />Signing in...</> : <><Lock size={20} />Sign In</>}</Button>
        </form>
        <p className="text-center text-gray-400 text-sm mt-6">Partner Practice? Use your shared login.</p>
      </div>
    </div>
  );
};

// ============ FLOW STEP (ACCORDION) ============
const FlowStep = ({ num, color, title, subtitle, expanded, onToggle, badge, badgeColor, children, completed, locked, lockedMsg }) => {
  const c = C[color] || C.gray;
  const bc = C[badgeColor] || C[color] || C.gray;
  return (
    <div id={`flow-step-${num}`} className={`mb-3 rounded-2xl border transition-all duration-300 ${completed ? 'opacity-50' : ''} ${locked ? 'opacity-50 pointer-events-none' : ''} ${expanded ? `${c.bg} ${c.border}` : 'bg-white border-gray-100 shadow-sm'}`}>
      <button onClick={locked ? undefined : onToggle} className="w-full text-left p-4 sm:p-5 flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${completed ? 'bg-triage-green-light border border-triage-green-dark/30 text-triage-green-text' : locked ? 'bg-gray-100 border border-gray-200 text-gray-400' : `${c.bg} border ${c.border} ${c.text}`}`}>
          {completed ? <Check size={16} /> : locked ? <Lock size={14} /> : num}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-base leading-tight ${expanded ? c.text : locked ? 'text-gray-400' : 'text-gray-700'}`}>{locked ? `🔒 ${title}` : title}</div>
          {!expanded && <div className="text-gray-400 text-sm mt-1 truncate">{locked && lockedMsg ? lockedMsg : subtitle}</div>}
        </div>
        {badge && !completed && !locked && (
          <span className={`${bc.bg} border ${bc.border} ${bc.text} px-2.5 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${badgeColor === 'red' ? 'animate-pulse' : ''}`}>
            {badge}
          </span>
        )}
        {!locked && (expanded ? <ChevronUp size={18} className={c.text} /> : <ChevronDown size={18} className="text-gray-300" />)}
      </button>
      {expanded && !locked && <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-gray-100 animate-fade-slide transition-all duration-300">{children}</div>}
    </div>
  );
};

// ============ STOP ALERT OVERLAY ============
const StopAlertOverlay = ({ stopMatches, patientWords, onAcknowledge }) => {
  if (!stopMatches || stopMatches.length === 0) return null;
  const match = stopMatches[0];
  return (
    <div className="fixed inset-0 z-[60] bg-red-600 flex flex-col items-center justify-center p-6 text-center" onClick={e => e.stopPropagation()}>
      <div className="text-6xl mb-6 animate-pulse">🚨</div>
      <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">STOP — CALL 999 NOW</h1>
      <div className="text-xl font-bold text-red-100 mb-6 uppercase">{match.system}</div>
      {patientWords && (
        <div className="bg-red-700/60 border border-red-400/30 rounded-2xl p-4 mb-5 max-w-md w-full">
          <div className="text-red-200 text-sm font-bold mb-1.5">Patient&apos;s exact words:</div>
          <div className="text-white text-sm italic">&ldquo;{patientWords}&rdquo;</div>
        </div>
      )}
      <div className="bg-red-700/40 border border-red-400/20 rounded-2xl p-4 mb-8 max-w-md w-full">
        <div className="text-red-200 text-sm font-bold mb-1.5">Matched keywords:</div>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {match.keywords.filter(k => patientWords?.toLowerCase().includes(k.toLowerCase())).map((k, i) => (
            <span key={i} className="bg-red-500/60 text-white px-2.5 py-1 rounded-full text-sm font-medium">{k}</span>
          ))}
        </div>
      </div>
      <a href="tel:999" className="block w-full max-w-md bg-white text-red-700 font-black text-lg py-4 rounded-xl mb-4 hover:bg-red-50 transition-all text-center shadow-lg">
        📞 CALL 999 — On-site ambulance: 020 3162 7525
      </a>
      <button
        onClick={onAcknowledge}
        className="w-full max-w-md bg-transparent border-2 border-white/40 text-white/80 text-sm py-3 rounded-xl hover:bg-white/10 transition-all font-medium"
      >
        ✓ Checked — proceed to red flags
      </button>
    </div>
  );
};

// Outcome action button used inside steps
const OutcomeBtn = ({ label, color = 'blue', icon, onClick }) => {
  const c = C[color] || C.blue;
  return (
    <button onClick={onClick} className={`w-full ${c.bg} border ${c.border} ${c.text} rounded-xl py-2.5 px-3 text-center font-semibold text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all`}>
      {icon}{label}
    </button>
  );
};

// ============ MAIN DECISION FLOW ============
const DecisionFlow = ({ data, settings, onRecord, showToast }) => {
  const [scanText, setScanText] = useState('');
  const [expandedStep, setExpandedStep] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [expandedPathway, setExpandedPathway] = useState(null);
  const [selfCareChecks, setSelfCareChecks] = useState(new Array(7).fill(false));
  const [emisChecks, setEmisChecks] = useState(new Array(5).fill(false));
  const [emisFindings, setEmisFindings] = useState(''); // free-text note of what they found
  const [expandedSystems, setExpandedSystems] = useState({});
  const [isClinicalAdmin, setIsClinicalAdmin] = useState(false);
  const [newOngoing, setNewOngoing] = useState(null);
  const [pathwaySearch, setPathwaySearch] = useState('');
  const [quickAction, setQuickAction] = useState(null);
  const [handoverContact, setHandoverContact] = useState('');
  const [handoverAvailability, setHandoverAvailability] = useState('');
  const [selfCareOffered, setSelfCareOffered] = useState('');
  const [selfCareReason, setSelfCareReason] = useState('');
  const [stopAcknowledged, setStopAcknowledged] = useState(false);
  const [lastStopKey, setLastStopKey] = useState('');

  const scanResults = useKeywordScanner(scanText, data.redFlags, data.amberFlags, data.pharmacyFirst, data.highRiskGroups);

  // Re-show STOP overlay if new stop pattern detected
  useEffect(() => {
    if (scanResults?.hasStop) {
      const newKey = scanResults.stop.map(s => s.system).join(',');
      if (newKey !== lastStopKey) {
        setStopAcknowledged(false);
        setLastStopKey(newKey);
      }
    }
  }, [scanResults?.hasStop, scanResults?.stop, lastStopKey]);

  const toggle = (step) => setExpandedStep(expandedStep === step ? null : step);
  
  const selectOutcome = (text, color) => {
    setOutcome({ text, color, time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) });
    onRecord(text);
  };

  const markStepDone = (step) => {
    setCompletedSteps(prev => { const n = new Set(prev); n.add(step); return n; });
  };

  const advanceToNext = (currentStep) => {
    markStepDone(currentStep);
    const nextStep = currentStep + 1;
    if (nextStep <= 5) {
      setExpandedStep(nextStep);
    }
  };

  const resetFlow = () => {
    setScanText(''); setExpandedStep(null); setOutcome(null);
    setCompletedSteps(new Set()); setExpandedBooking(null);
    setExpandedPathway(null); setSelfCareChecks(new Array(7).fill(false));
    setEmisChecks(new Array(5).fill(false)); setEmisFindings('');
    setExpandedSystems({}); setIsClinicalAdmin(false); setNewOngoing(null);
    setPathwaySearch(''); setQuickAction(null);
    setHandoverContact(''); setHandoverAvailability('');
    setSelfCareOffered(''); setSelfCareReason('');
    setStopAcknowledged(false); setLastStopKey('');
    window.scrollTo(0, 0);
  };

  const allSelfCareChecked = selfCareChecks.every(Boolean);

  return (
    <div className="p-3 sm:p-4 pb-36 max-w-lg mx-auto">
      {/* ---- STOP ALERT OVERLAY ---- */}
      {scanResults?.hasStop && !stopAcknowledged && (
        <StopAlertOverlay
          stopMatches={scanResults.stop}
          patientWords={scanText}
          onAcknowledge={() => setStopAcknowledged(true)}
        />
      )}

      {/* ---- HEADER ---- */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Process ANIMA Request</h1>
          <p className="text-sm text-gray-400 mt-1">
            {settings.practiceName} · SOP v3.5 · Work through steps in order ↓
          </p>
        </div>
        {(outcome || completedSteps.size > 0) && (
          <button onClick={resetFlow} className="flex items-center gap-1.5 px-3 py-2 bg-triage-blue-light border border-triage-blue-dark/25 rounded-xl text-triage-blue-text text-sm font-bold hover:bg-triage-blue-light transition-all">
            <RotateCcw size={14} />New
          </button>
        )}
      </div>

      {/* ---- STICKY PATIENT WORDS BANNER + KEYWORD SCANNER ---- */}
      <div className="sticky top-0 z-20 bg-white/95 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-300" size={16} />
          <textarea value={scanText} onChange={e => setScanText(e.target.value)} autoFocus={true}
            placeholder="Paste patient's words from ANIMA here to scan for flags..."
            rows={2} className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-triage-blue-dark/30 focus:outline-none text-gray-800 text-sm resize-none leading-relaxed" />
          {scanText && <button onClick={() => setScanText('')} className="absolute right-3 top-3 text-gray-300 hover:text-gray-700"><X size={16} /></button>}
        </div>
        {scanResults && (
          <div className="flex gap-2 mt-2.5 flex-wrap">
            {scanResults.hasStop && <span className="bg-red-100 border border-red-300 text-red-700 px-3 py-1.5 rounded-full text-sm font-semibold animate-pulse">🚨 STOP — 999</span>}
            {scanResults.hasRed && <button onClick={() => toggle(1)} className="bg-triage-red-light border border-triage-red-dark/25 text-triage-red-text px-3 py-1.5 rounded-full text-sm font-semibold animate-pulse">🔴 Red flags</button>}
            {scanResults.hasAmber && <button onClick={() => toggle(5)} className="bg-triage-amber-light border border-triage-amber-dark/25 text-triage-amber-text px-3 py-1.5 rounded-full text-sm font-semibold">🟠 Amber</button>}
            {scanResults.hasPurple && <span className="bg-triage-purple-light border border-triage-purple-dark/25 text-triage-purple-text px-3 py-1.5 rounded-full text-sm font-semibold">🟣 Purple</span>}
            {scanResults.hasYellow && <span className="bg-triage-yellow-light border border-triage-yellow-dark/25 text-triage-yellow-text px-3 py-1.5 rounded-full text-sm font-semibold">🟡 Yellow</span>}
            {scanResults.hasGreen && <span className="bg-triage-green-light border border-triage-green-dark/25 text-triage-green-text px-3 py-1.5 rounded-full text-sm font-semibold">🟢 Green</span>}
            {scanResults.hasRisk && <span className="bg-triage-teal-light border border-triage-teal-dark/25 text-triage-teal-text px-3 py-1.5 rounded-full text-sm font-semibold">⚠️ High risk</span>}
            {scanResults.hasCancer && <span className="bg-triage-red-light border border-triage-red-dark/25 text-triage-red-text px-3 py-1.5 rounded-full text-sm font-semibold">🎗️ Cancer?</span>}
            {scanResults.hasChange && <span className="bg-triage-teal-light border border-triage-teal-dark/25 text-triage-teal-text px-3 py-1.5 rounded-full text-sm font-semibold">📈 Worsening</span>}
            {scanResults.pharmacy.length > 0 && <button onClick={() => toggle(4)} className="bg-triage-green-light border border-triage-green-dark/25 text-triage-green-text px-3 py-1.5 rounded-full text-sm font-semibold">💊 Pharmacy</button>}
            {scanResults.hasPathway && <button onClick={() => toggle(2)} className="bg-triage-blue-light border border-triage-blue-dark/25 text-triage-blue-text px-3 py-1.5 rounded-full text-sm font-semibold">🔍 Pathway</button>}
            {!scanResults.hasAny && <span className="text-gray-400 text-sm py-1">No keyword matches — work through steps below</span>}
          </div>
        )}
      </div>

      {/* ---- STEP PROGRESS INDICATOR ---- */}
      <div className="flex items-center mb-4 px-2">
        {[1, 2, 3, 4, 5].flatMap((step, i) => {
          const items = [];
          if (i > 0) items.push(
            <div key={`line-${step}`} className={`h-0.5 flex-1 transition-all duration-300 ${completedSteps.has(step - 1) ? 'bg-triage-green-dark/30' : 'bg-gray-200'}`} />
          );
          items.push(
            <div key={`step-${step}`} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-300 ${
              completedSteps.has(step) ? 'bg-triage-green-light border border-triage-green-dark/30 text-triage-green-text' :
              expandedStep === step ? 'bg-triage-blue-dark text-white shadow-md' :
              'bg-gray-200 text-gray-400'
            }`}>
              {completedSteps.has(step) ? '✓' : step}
            </div>
          );
          return items;
        })}
      </div>

      {/* ---- GOLDEN RULE ---- */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-4 py-3 mb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <Info size={16} className="text-triage-blue-text flex-shrink-0" />
          <span className="text-sm text-gray-600 font-semibold">Golden Rules — Tier 1</span>
        </div>
        <div className="text-sm text-gray-400 leading-relaxed">
          Use patient&apos;s <strong className="text-gray-500">exact words</strong> ·
          Check <strong className="text-gray-500">EMIS first</strong> ·
          You do <strong className="text-triage-red-text">NOT diagnose</strong> or decide urgency ·
          Do <strong className="text-triage-red-text">NOT ask clinical questions</strong> ·
          If unsure → <strong className="text-triage-blue-text">escalate UP</strong> ·
          A false escalation is safe. A missed escalation is not.
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          STEP 1: EMERGENCY RED FLAGS (v3.5)
          ═══════════════════════════════════════════════════ */}
      <FlowStep num={1} color="red" title="🚨 EMERGENCY RED FLAGS" subtitle="Does the patient have ANY of these symptoms RIGHT NOW?"
        expanded={expandedStep === 1} onToggle={() => toggle(1)} completed={completedSteps.has(1)}
        badge={scanResults?.hasRed || scanResults?.hasStop ? 'ALERT' : null} badgeColor="red">

        {/* Scanner-first alert card */}
        {(scanResults?.hasStop || scanResults?.hasRed) && (
          <div className="mb-3 bg-triage-red-light border-l-4 border-l-triage-red-dark border border-triage-red-dark/20 rounded-xl p-3">
            <div className="text-triage-red-text font-bold text-sm mb-1.5">⚠️ {scanResults.hasStop ? scanResults.stop[0].system.toUpperCase() : scanResults.red[0].system.toUpperCase()}</div>
            <div className="text-gray-800 font-bold text-sm mb-2">{scanResults.hasStop ? 'CALL 999 NOW' : scanResults.red[0].action}</div>
            <div className="flex flex-wrap gap-1 mb-2">
              {(scanResults.hasStop ? scanResults.stop[0].keywords : scanResults.red[0].keywords).filter(k => scanText.toLowerCase().includes(k.toLowerCase())).map((k, i) => (
                <span key={i} className="bg-triage-red-light text-triage-red-text px-2 py-0.5 rounded text-sm">{k}</span>
              ))}
            </div>
            <div className="text-gray-400 text-sm">On-site ambulance: 020 3162 7525 | Crisis: 0800 028 8000 | CAMHS: 0203 228 5980</div>
          </div>
        )}

        {/* Empty state for no scanner matches */}
        {scanText && scanResults && !scanResults.hasRed && !scanResults.hasStop && (
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-3 text-center">
            <span className="text-xl">✨</span>
            <div className="text-gray-400 text-sm mt-1">No red flags matched — continue to the next step</div>
          </div>
        )}

        {/* Collapsed accordion by body system */}
        <div className="text-gray-500 text-sm mb-3 font-semibold">Body systems — click to expand:</div>
        <div className="space-y-2 mb-4 max-h-72 overflow-y-auto pr-1">
          {(() => {
            const grouped = {};
            data.redFlags.forEach(f => { if (!grouped[f.system]) grouped[f.system] = []; grouped[f.system].push(f); });
            const matchedSystems = scanResults?.hasRed ? new Set(scanResults.red.map(f => f.system)) : new Set();
            const entries = Object.entries(grouped);
            entries.sort((a, b) => { const am = matchedSystems.has(a[0]) ? 0 : 1; const bm = matchedSystems.has(b[0]) ? 0 : 1; return am - bm; });
            return entries.map(([system, flags]) => {
              const isMatched = matchedSystems.has(system);
              const isOpen = expandedSystems[system] ?? isMatched;
              return (
                <div key={system} className={`rounded-xl border ${isMatched ? 'border-l-4 border-l-triage-red-dark border-triage-red-dark/30 bg-triage-red-light' : 'border-gray-100 bg-white shadow-sm'}`}>
                  <button onClick={() => setExpandedSystems(prev => ({ ...prev, [system]: !isOpen }))}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-gray-50/50 transition-colors rounded-xl">
                    {(() => { const si = systemIcons[system]; return si ? (
                      <div className={`w-10 h-10 rounded-full ${si.bg} flex items-center justify-center text-xl flex-shrink-0`}>{si.icon}</div>
                    ) : null; })()}
                    <span className={`flex-1 text-sm font-semibold ${isMatched ? 'text-triage-red-text' : 'text-gray-600'}`}>
                      {isMatched && '🚨 '}{system} ({flags.length} flag{flags.length > 1 ? 's' : ''})
                    </span>
                    {isOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-3.5 pb-3 space-y-1.5">
                      {flags.map((f, i) => (
                        <div key={i} className="flex items-start gap-2.5 pl-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-triage-red-dark mt-2 flex-shrink-0" />
                          <span className="text-gray-500 text-sm leading-relaxed">Patient says: {f.keywords.slice(0, 5).join(', ')} — <strong className="text-triage-red-text">{f.action}</strong></span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>
        <div className="flex gap-3 mb-3">
          <a href="tel:999" className="flex-1 bg-triage-red-light border border-triage-red-dark/30 text-triage-red-text rounded-xl py-3.5 text-center font-bold text-sm active:scale-95 transition-transform flex items-center justify-center gap-2">
            <Phone size={16} />CALL 999
          </a>
          <button onClick={() => { selectOutcome('→ Patient declined 999 — duty GP booked, noted "declined 999"', 'red'); }} className="flex-1 bg-white border border-triage-red-dark/20 text-triage-red-text rounded-xl py-3.5 text-center font-semibold text-sm hover:bg-triage-red-light/50 transition-colors">
            Patient declined 999
          </button>
        </div>
        <div className="text-gray-400 text-sm text-center mb-3">On-site ambulance: 020 3162 7525 | Crisis: 0800 028 8000 | CAMHS: 0203 228 5980</div>
        <button onClick={() => advanceToNext(1)} className="w-full text-center text-sm text-gray-400 hover:text-triage-green-text py-3 border-t border-gray-100 transition-all hover:scale-[1.02]">
          ✓ No red flags identified — continue ↓
        </button>
      </FlowStep>

      {/* ═══════════════════════════════════════════════════
          STEP 2: SIGNPOST TO EXTERNAL SERVICE (v3.5)
          ═══════════════════════════════════════════════════ */}
      <FlowStep num={2} color="blue" title="🔀 Signpost to External Service" subtitle="Does this belong to a specific external pathway?"
        expanded={expandedStep === 2} onToggle={() => toggle(2)} completed={completedSteps.has(2)}
        locked={!completedSteps.has(1)} lockedMsg="Complete Step 1 first"
        badge={scanResults?.hasPathway ? 'MATCH' : null} badgeColor="blue">

        {/* Signposting pathway grid */}
        {scanResults?.pathways?.length > 0 && (
          <div className="bg-triage-blue-light border border-triage-blue-dark/20 rounded-xl p-2.5 mb-3">
            <div className="text-triage-blue-text font-bold text-sm mb-1">🔍 Scanner matched:</div>
            <div className="flex flex-wrap gap-1">
              {scanResults.pathways.map(p => <span key={p.id} className="bg-triage-blue-light px-2 py-0.5 rounded text-sm text-triage-blue-text font-medium">{p.pathway}</span>)}
            </div>
          </div>
        )}

        {/* Empty state for no pathway matches */}
        {scanText && scanResults && !scanResults.hasPathway && (
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-3 text-center">
            <span className="text-xl">✨</span>
            <div className="text-gray-400 text-sm mt-1">No pathway matched — review options below or continue</div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {[
            { icon: '👁️', name: 'Eye Emergency', contact: '020 8934 6799', hours: 'Mon–Fri 8:30–4:30', detail: 'CUES / Royal Eye Unit' },
            { icon: '🦴', name: 'Injury / Acute Trauma', contact: 'via NHS 111', hours: '8am–8pm daily', detail: 'Richmond UTC' },
            { icon: '🤰', name: 'Pregnancy >18wks', contact: '0208 934 2802', hours: '24/7', detail: 'Maternity Helpline' },
            { icon: '🩺', name: 'Sexual Health', contact: '0208 974 9331', hours: 'Self-refer', detail: 'Wolverton Centre' },
            { icon: '🧠', name: 'Mental Health (non-crisis)', contact: 'swlstg.nhs.uk', hours: 'Self-refer', detail: 'Kingston Talking Therapies', warn: '⚠️ Must send Talking Therapies info and book GP 1–3 days. Do not signpost alone.' },
            { icon: '👶', name: 'Health Visiting (0–5)', contact: '020 8339 8000', hours: 'Mon–Fri 9–5', detail: 'HV Service. Well Baby Clinics Tue/Wed/Thu.' },
            { icon: '🚫', name: 'Abortion Services', contact: 'NUPAS: 0333 004 6666', hours: 'See provider', detail: 'BPAS: 0345 730 4030 / MSI: 0345 300 8090' },
            { icon: '📞', name: 'NHS 111', contact: '111', hours: '24/7', detail: 'If unsure, out of hours, or need non-999 urgent advice' },
            { icon: '💊', name: 'NHS 111 Emergency Rx', contact: '111.nhs.uk/emergency-prescription', hours: '24/7', detail: 'Ran out of essential medication outside GP hours' },
            { icon: '🧠', name: 'Mental Health Crisis', contact: '0800 028 8000', hours: '24/7', detail: 'CAMHS <18: 0203 228 5980' },
            { icon: '🚑', name: '999 / A&E', contact: '999', hours: '24/7', detail: 'If in doubt — 999' },
            { icon: '🏥', name: 'Pharmacy First', contact: '', hours: '', detail: '→ See Step 4', isLink: true, linkStep: 4 },
            { icon: '📋', name: 'Planned / EMIS', contact: '', hours: '', detail: '→ See Step 3', isLink: true, linkStep: 3 },
          ].map((p, i) => {
            const is999 = p.contact === '999';
            return (
              <div key={i} className={`rounded-2xl border p-3.5 ${is999 ? 'border-triage-red-dark/20 bg-triage-red-light' : 'border-gray-100 bg-white shadow-sm'} hover:shadow-md transition-shadow`}>
                <div className="flex items-start gap-3">
                  {(() => { const pi = pathwayIcons[p.name]; return (
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${pi ? pi.bg : is999 ? 'bg-triage-red-light' : 'bg-triage-blue-light'}`}>{pi ? pi.icon : p.icon}</div>
                  ); })()}
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-sm ${is999 ? 'text-triage-red-text' : 'text-gray-700'}`}>{p.name}</div>
                    <div className="text-gray-400 text-sm mt-0.5">{p.detail}</div>
                    {p.hours && <div className="text-gray-400 text-sm">{p.hours}</div>}
                  </div>
                </div>
                {p.warn && <div className="text-triage-amber-text text-sm font-semibold mt-2 bg-triage-amber-light rounded-lg p-2">{p.warn}</div>}
                {p.contact && !p.isLink && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-triage-blue-text text-sm font-medium">{p.contact}</span>
                    <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(p.contact); showToast('Copied: ' + p.contact); }}
                      className="text-gray-400 hover:text-triage-blue-text"><Copy size={12} /></button>
                  </div>
                )}
                {p.isLink && <button onClick={() => toggle(p.linkStep)} className="text-triage-blue-text text-sm mt-2 underline font-medium">{p.detail}</button>}
              </div>
            );
          })}
        </div>

        <button onClick={() => advanceToNext(2)} className="w-full text-center text-sm text-gray-400 hover:text-triage-green-text py-3 border-t border-gray-100 transition-all hover:scale-[1.02]">
          ✓ No external pathway — continue ↓
        </button>
      </FlowStep>

      {/* ═══════════════════════════════════════════════════
          STEP 3: PLANNED ITEMS — CHECK EMIS (v3.5)
          ═══════════════════════════════════════════════════ */}
      <FlowStep num={3} color="teal" title="📋 Planned Items — Check EMIS" subtitle="Is there an existing plan, recall, or clinical admin item in EMIS?"
        expanded={expandedStep === 3} onToggle={() => toggle(3)} completed={completedSteps.has(3)}
        locked={!completedSteps.has(2)} lockedMsg="Complete Step 2 first"
        badge={scanResults?.hasChange ? 'CHANGE?' : null} badgeColor="amber">

        {/* Direct booking checklist */}
        <div className="bg-triage-blue-light border border-triage-blue-dark/15 rounded-xl p-3 mb-3">
          <div className="text-triage-blue-text font-bold text-sm mb-2">Direct booking checklist:</div>
          {[
            'Follow-up appointment (GP said "come back in X weeks")',
            'Blood tests due (chronic disease / medication monitoring)',
            'ECG planned',
            'Annual / chronic disease review',
            'Postnatal check',
            'Immunisations / vaccinations',
            'Cervical screening',
            'Dressing / suture removal',
          ].map((item, i) => (
            <label key={i} className="flex items-center gap-2.5 py-1 cursor-pointer group">
              <div onClick={() => { const n = [...emisChecks]; n[i] = !n[i]; setEmisChecks(n); }}
                className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${emisChecks[i] ? 'bg-triage-blue-light border-triage-blue-dark/40' : 'border-gray-200 group-hover:border-gray-300'}`}>
                {emisChecks[i] && <Check size={12} className="text-triage-blue-text" />}
              </div>
              <span className={`text-sm ${emisChecks[i] ? 'text-gray-600' : 'text-gray-400'}`}>{item}</span>
            </label>
          ))}
          {emisChecks.some(Boolean) && (
            <div className="mt-2 bg-triage-green-light border border-triage-green-dark/20 rounded-lg p-2 text-triage-green-text text-sm font-semibold">
              ✅ Direct-book per EMIS plan. No triage needed.
            </div>
          )}
        </div>

        {/* Fit Note Quick Reference */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-3">
          <div className="text-gray-500 font-bold text-sm mb-1">📝 Fit note quick reference:</div>
          <div className="text-gray-400 text-sm space-y-1">
            <div>• Straightforward renewal (recent review + within 7 days + documented) → Process admin → session GP</div>
            <div>• NEW / worsening / not previously seen → Tier 3 GP Triager</div>
          </div>
        </div>

        {/* Repeat Medication Quick Reference */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-3">
          <div className="text-gray-500 font-bold text-sm mb-1">💊 Repeat medication:</div>
          <div className="text-gray-400 text-sm space-y-1">
            <div>• Routine repeat (no change) → Admin team</div>
            <div>• Dose change / new med / side effect / interaction → <span className="text-triage-purple-text font-semibold">Tier 3 GP Triager (PURPLE)</span></div>
            <div>• Ran out of essential med (insulin, anticoag, AED) → <span className="text-triage-red-text font-semibold">URGENT Tier 3 or NHS 111 emergency supply</span></div>
          </div>
        </div>

        {/* EMIS findings text area */}
        <div className="mb-3">
          <div className="text-gray-500 text-sm font-bold mb-1.5">📝 EMIS findings (travels with the request):</div>
          <textarea value={emisFindings} onChange={e => setEmisFindings(e.target.value)}
            placeholder="e.g. 'Diabetes recall due. Last seen GP 3 weeks ago re: back pain. No alerts.'"
            rows={2} className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:border-triage-teal-dark/30 focus:outline-none text-gray-800 text-sm resize-none" />
        </div>

        {/* NEW/ONGOING decision */}
        <div className="flex gap-3 mb-3">
          <button onClick={() => { setNewOngoing('plan-exists'); selectOutcome('→ Direct booked per EMIS plan' + (emisFindings ? '. EMIS: ' + emisFindings : ''), 'green'); }}
            className="flex-1 p-3 rounded-xl border border-triage-green-dark/25 bg-triage-green-light hover:bg-triage-green-light text-left transition-all">
            <div className="text-triage-green-text font-bold text-sm">✅ Plan exists</div>
            <div className="text-gray-400 text-sm mt-1">Direct book per plan</div>
          </button>
          <button onClick={() => { setNewOngoing('no-plan'); advanceToNext(3); }}
            className={`flex-1 p-3 rounded-xl border border-triage-blue-dark/25 bg-triage-blue-light hover:bg-triage-blue-light text-left transition-all ${scanResults?.hasChange ? 'ring-2 ring-triage-blue/40' : ''}`}>
            <div className="text-triage-blue-text font-bold text-sm">➡️ No plan / New / Worsened</div>
            <div className="text-gray-400 text-sm mt-1">Continue to next step</div>
          </button>
        </div>
        <div className="text-triage-amber-text text-sm font-medium">⚠️ If patient says &apos;worse&apos;, &apos;not improving&apos;, or &apos;different&apos; → treat as NEW</div>
      </FlowStep>

      {/* ═══════════════════════════════════════════════════
          STEP 4: PHARMACY FIRST / SELF-CARE (v3.5)
          ═══════════════════════════════════════════════════ */}
      <FlowStep num={4} color="green" title="💊 Pharmacy First / Self-care" subtitle="Can this be managed by the pharmacy or at home?"
        expanded={expandedStep === 4} onToggle={() => toggle(4)} completed={completedSteps.has(4)}
        badge={scanResults?.pharmacy.length > 0 ? 'MATCH' : null} badgeColor="green">

        {/* Empty state for no pharmacy matches */}
        {scanText && scanResults && scanResults.pharmacy.length === 0 && (
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-3 text-center">
            <span className="text-xl">✨</span>
            <div className="text-gray-400 text-sm mt-1">No Pharmacy First conditions matched — review options below</div>
          </div>
        )}

        {/* Critical exclusion warnings */}
        <div className="bg-triage-red-light border border-triage-red-dark/15 rounded-xl p-2.5 mb-3 space-y-1">
          <div className="text-triage-red-text text-sm font-bold">⚠️ UTI: WOMEN 16–64 ONLY. Male → GP. Pregnant → GP.</div>
          <div className="text-triage-red-text text-sm font-bold">⚠️ NEVER Pharmacy First for: Under 1s, immunosuppressed, or any high-risk group with doubt</div>
        </div>

        {/* Pharmacy First conditions table */}
        <div className="text-gray-500 font-bold text-sm mb-2">Pharmacy First — 7 conditions:</div>
        <div className="space-y-1.5 mb-3 max-h-56 overflow-y-auto pr-1">
          {data.pharmacyFirst.map(c => {
            const pi = getIcon(pharmacyIcons, c.condition || c.name);
            return (
            <div key={c.id} className={`rounded-xl border p-2.5 ${scanResults?.pharmacy.some(p => p.id === c.id) ? 'border-l-4 border-l-triage-green-dark border-triage-green-dark/20 bg-triage-green-light' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                {pi && <div className={`w-12 h-12 rounded-full ${pi.bg} flex items-center justify-center text-2xl flex-shrink-0`}>{pi.icon}</div>}
                <div className="flex-1 flex items-center justify-between">
                  <div className="text-gray-700 font-bold text-sm">{!pi && c.icon} {c.condition || c.name}</div>
                  <span className="text-triage-blue-text text-sm font-semibold">{c.ageRange}</span>
                </div>
              </div>
              <div className="text-triage-red-text text-sm mt-1">Exclusions: {c.exclusions.join(' | ')}</div>
            </div>
          ); })}
        </div>

        {/* Self-Care criteria */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-3">
          <div className="text-gray-500 font-bold text-sm mb-1">Self-care criteria:</div>
          <div className="text-gray-400 text-sm">Mild symptoms, &lt;48 hours, no red/amber flags, not high-risk</div>
        </div>

        {/* Safety Net */}
        <div className="bg-triage-amber-light border border-triage-amber/12 rounded-xl p-2.5 mb-3">
          <div className="text-triage-amber-text font-bold text-sm mb-0.5">🛟 Safety-net script:</div>
          <div className="text-gray-400 text-sm">&ldquo;{data.scripts.safetyNet.script}&rdquo;</div>
          <CopyBtn text={data.scripts.safetyNet.script} label="Copy Safety Net" onCopy={() => onRecord('Copied safety net')} />
        </div>

        <div className="flex gap-2 mb-2">
          <button onClick={() => { setSelfCareOffered('pharmacy'); selectOutcome('→ Pharmacy First referral', 'green'); }}
            className="flex-1 bg-triage-green-light border border-triage-green-dark/20 text-triage-green-text rounded-xl py-3 text-center font-semibold text-sm hover:brightness-95 transition-all">
            ✓ Offered Pharmacy First
          </button>
          <button onClick={() => { setSelfCareOffered('selfcare'); selectOutcome('→ Self-Care offered', 'green'); }}
            className="flex-1 bg-triage-green-light border border-triage-green-dark/20 text-triage-green-text rounded-xl py-3 text-center font-semibold text-sm hover:brightness-95 transition-all">
            ✓ Self-care offered
          </button>
        </div>
        <button onClick={() => { setSelfCareOffered('declined'); advanceToNext(4); }} className="w-full text-center text-sm text-gray-400 hover:text-triage-blue-text py-3 border-t border-gray-100 transition-all hover:scale-[1.02]">
          Patient declined — continue to Step 5 ↓
        </button>
      </FlowStep>

      {/* ═══════════════════════════════════════════════════
          STEP 5: FORWARD TO TIER 2 (v3.5)
          ═══════════════════════════════════════════════════ */}
      <FlowStep num={5} color="violet" title="➡️ Forward to Tier 2" subtitle="Forward ALL remaining requests to the Patient Services Team"
        expanded={expandedStep === 5} onToggle={() => toggle(5)} completed={completedSteps.has(5)}>

        <div className="text-gray-500 text-sm mb-3 font-semibold">Forward to Tier 2 if ANY apply:</div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-3">
          <div className="text-gray-400 text-sm space-y-0.5">
            {['Multiple overlapping problems', 'Severe or worsening symptoms', 'Symptoms >2 weeks not improving',
              'New lump / night sweats / unexplained bleeding / weight loss (cancer flags)',
              'Patient anxious, unhappy, or requesting GP', 'Patient declined Pharmacy First / self-care',
              'Any uncertainty whatsoever', "Doesn't fit any of the steps above"
            ].map((t, i) => <div key={i}>• {t}</div>)}
          </div>
        </div>

        {/* TIER 1 → TIER 2 HANDOVER FORM */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-4">
          <div className="text-triage-purple-text font-semibold text-base mb-3">📋 Tier 1 → Tier 2 Handover</div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-500 font-semibold">Patient&apos;s exact words:</span>
              <div className="text-gray-800 mt-0.5">{scanText || '(not entered)'}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-gray-500 font-semibold">EMIS checked:</span> <span className="text-gray-800">{emisChecks.some(Boolean) ? 'Yes' : 'No'}</span></div>
              <div><span className="text-gray-500 font-semibold">New/Ongoing:</span> <span className="text-gray-800">{newOngoing === 'plan-exists' ? 'Ongoing' : newOngoing === 'no-plan' ? 'New' : '—'}</span></div>
            </div>
            {emisFindings && <div><span className="text-gray-500 font-semibold">EMIS findings:</span> <span className="text-gray-800">{emisFindings}</span></div>}
            <div><span className="text-gray-500 font-semibold">High risk:</span> <span className="text-gray-800">{scanResults?.hasRisk ? 'Yes — ' + scanResults.risk.map(r => r.group).join(', ') : 'No'}</span></div>
            <div><span className="text-gray-500 font-semibold">Red flags checked:</span> <span className="text-gray-800">{completedSteps.has(1) ? 'Yes' : 'No'}</span></div>
            <div><span className="text-gray-500 font-semibold">Pharmacy First offered:</span> <span className="text-gray-800">{selfCareOffered === 'pharmacy' ? 'Yes' : selfCareOffered === 'selfcare' ? 'Self-care' : selfCareOffered === 'declined' ? 'Declined' : 'No'}</span></div>
            <div>
              <span className="text-gray-500 font-semibold">Flags identified:</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {scanResults?.hasRed && <span className="bg-triage-red-light text-triage-red-text px-2 py-0.5 rounded-full text-sm font-medium">Red</span>}
                {scanResults?.hasAmber && <span className="bg-triage-amber-light text-triage-amber-text px-2 py-0.5 rounded-full text-sm font-medium">Amber</span>}
                {scanResults?.hasPurple && <span className="bg-triage-purple-light text-triage-purple-text px-2 py-0.5 rounded-full text-sm font-medium">Purple</span>}
                {scanResults?.hasYellow && <span className="bg-triage-yellow-light text-triage-yellow-text px-2 py-0.5 rounded-full text-sm font-medium">Yellow</span>}
                {scanResults?.hasGreen && <span className="bg-triage-green-light text-triage-green-text px-2 py-0.5 rounded-full text-sm font-medium">Green</span>}
                {scanResults?.hasCancer && <span className="bg-triage-red-light text-triage-red-text px-2 py-0.5 rounded-full text-sm font-medium">Cancer?</span>}
                {scanResults?.hasRisk && <span className="bg-triage-teal-light text-triage-teal-text px-2 py-0.5 rounded-full text-sm font-medium">High risk</span>}
                {!scanResults?.hasAny && <span className="text-gray-400">None detected</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Copy Handover button */}
        <button onClick={() => {
          const flagParts = [];
          if (scanResults?.hasRed) flagParts.push('Red: ' + scanResults.red.map(r => r.system).join(', '));
          if (scanResults?.hasAmber) flagParts.push('Amber: ' + scanResults.amber.map(a => a.category).join(', '));
          if (scanResults?.hasPurple) flagParts.push('Purple: ' + scanResults.purple.map(p => p.category).join(', '));
          if (scanResults?.hasYellow) flagParts.push('Yellow: ' + scanResults.yellow.map(y => y.category).join(', '));
          if (scanResults?.hasGreen) flagParts.push('Green: ' + scanResults.green.map(g => g.category).join(', '));
          if (scanResults?.hasCancer) flagParts.push('Cancer keywords: ' + scanResults.cancer.join(', '));
          if (scanResults?.hasRisk) flagParts.push('High-risk: ' + scanResults.risk.map(r => r.group).join(', '));
          const ts = new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
          const msg = [
            'TIER 1 → TIER 2 HANDOVER',
            `Date/Time: ${ts}`,
            `Patient's words: ${scanText || '(not entered)'}`,
            `EMIS checked: ${emisChecks.some(Boolean) ? 'Yes' : 'No'} | Findings: ${emisFindings || '—'}`,
            `NEW / ONGOING: ${newOngoing === 'plan-exists' ? 'ONGOING' : newOngoing === 'no-plan' ? 'NEW' : '—'}`,
            `High risk: ${scanResults?.hasRisk ? 'Yes — ' + scanResults.risk.map(r => r.group).join(', ') : 'No'}`,
            `Red flags checked: ${completedSteps.has(1) ? 'Yes' : 'No'}`,
            `Signposting attempted: ${completedSteps.has(2) ? 'Yes' : 'No'}`,
            `Pharmacy First offered: ${selfCareOffered === 'pharmacy' ? 'Yes' : selfCareOffered === 'selfcare' ? 'Self-care offered' : selfCareOffered === 'declined' ? 'Declined' : 'No'}`,
            flagParts.length ? `Flags: ${flagParts.join('; ')}` : 'Flags: None detected',
          ].join('\n');
          navigator.clipboard.writeText(msg);
          showToast('Handover copied to clipboard');
        }}
          className="w-full bg-triage-purple-light border border-triage-purple-dark/20 text-triage-purple-text rounded-xl py-3.5 text-center font-semibold text-sm flex items-center justify-center gap-2 hover:brightness-95 transition-all mb-4">
          <Copy size={16} />📋 Copy handover to clipboard
        </button>

        <button onClick={resetFlow}
          className="w-full bg-triage-blue-light border border-triage-blue-dark/20 text-triage-blue-text rounded-xl py-3 text-center font-semibold text-sm hover:brightness-95 transition-all">
          🔄 Start new triage
        </button>
      </FlowStep>

      {/* ---- IF IN DOUBT BANNER ---- */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 text-center mt-3 mb-3">
        <div className="text-triage-blue-text font-semibold text-base">⚠️ If in doubt → ask a clinician</div>
        <div className="text-gray-400 text-sm mt-1">GP Triager from 8am · Duty clinician on site</div>
      </div>

      {/* ---- VERSION TEXT ---- */}
      <div className="text-center text-gray-300 text-sm py-2 mb-2">
        SOP v3.5 | Tier 1 Flowchart v4.0 | Feb 2026 | Dr Sahar Jahanian
      </div>

      {/* ---- QUICK ACTION BAR (fixed bottom) ---- */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white shadow-md border-t border-gray-100 p-2.5">
        <div className="flex gap-2.5 max-w-lg mx-auto">
          <button onClick={() => setQuickAction(quickAction === '999' ? null : '999')}
            className="flex-1 bg-triage-red-light border border-triage-red-dark/20 text-triage-red-text rounded-xl py-2.5 text-sm font-semibold text-center hover:brightness-95 transition-all">
            🚨 999
          </button>
          <button onClick={() => setQuickAction(quickAction === 'crisis' ? null : 'crisis')}
            className="flex-1 bg-triage-amber-light border border-triage-amber-dark/20 text-triage-amber-text rounded-xl py-2.5 text-sm font-semibold text-center hover:brightness-95 transition-all">
            📞 Crisis
          </button>
          <button onClick={() => { setExpandedStep(5); setTimeout(() => document.getElementById('flow-step-5')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100); }}
            className="flex-1 bg-triage-blue-light border border-triage-blue-dark/20 text-triage-blue-text rounded-xl py-2.5 text-sm font-semibold text-center hover:brightness-95 transition-all">
            ➡️ Tier 2
          </button>
          <button onClick={() => {
            const parts = [];
            if (scanText) parts.push(`Patient: "${scanText}"`);
            if (emisFindings) parts.push(`EMIS: ${emisFindings}`);
            if (scanResults?.stop?.length) parts.push(`🚨 STOP: ${scanResults.stop.map(s => s.system).join(', ')}`);
            if (scanResults?.red?.length) parts.push(`Red flags: ${scanResults.red.map(r => r.symptom).join(', ')}`);
            if (scanResults?.amber?.length) parts.push(`Amber: ${scanResults.amber.map(a => a.category).join(', ')}`);
            if (scanResults?.purple?.length) parts.push(`Purple: ${scanResults.purple.map(p => p.category).join(', ')}`);
            if (scanResults?.yellow?.length) parts.push(`Yellow: ${scanResults.yellow.map(y => y.category).join(', ')}`);
            if (scanResults?.green?.length) parts.push(`Green: ${scanResults.green.map(g => g.category).join(', ')}`);
            if (scanResults?.risk?.length) parts.push(`High-risk: ${scanResults.risk.map(r => r.group).join(', ')}`);
            if (scanResults?.hasChange) parts.push(`Change words: ${scanResults.changeWords.join(', ')}`);
            if (parts.length) { navigator.clipboard.writeText(parts.join('\n')); showToast('Copied to clipboard'); }
            else showToast('Nothing to copy yet');
          }}
            className="flex-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl py-2.5 text-sm font-semibold text-center hover:bg-gray-100 transition-all">
            📋 Copy
          </button>
        </div>
        {quickAction === '999' && (
          <div className="max-w-lg mx-auto mt-2.5 bg-triage-red-light border border-triage-red-dark/20 rounded-xl p-3 animate-fade-slide">
            <div className="text-triage-red-text font-semibold text-sm">Call 999. Inform duty clinician.</div>
            <div className="text-gray-500 text-sm mt-0.5">On-site ambulance: <strong className="text-gray-800">020 3162 7525</strong></div>
          </div>
        )}
        {quickAction === 'crisis' && (
          <div className="max-w-lg mx-auto mt-2.5 bg-triage-amber-light border border-triage-amber-dark/20 rounded-xl p-3 animate-fade-slide">
            <div className="text-triage-amber-text font-semibold text-sm">Crisis lines</div>
            <div className="text-gray-500 text-sm mt-0.5">Adults: <strong className="text-gray-800">0800 028 8000</strong> | CAMHS &lt;18: <strong className="text-gray-800">0203 228 5980</strong></div>
          </div>
        )}
      </div>

      {/* ---- OUTCOME BAR (sticky bottom) ---- */}
      {outcome && (
        <div className="fixed bottom-14 left-0 right-0 z-40 p-3">
          <div className={`max-w-lg mx-auto ${C[outcome.color]?.bg || C.blue.bg} border ${C[outcome.color]?.border || C.blue.border} rounded-2xl p-3 backdrop-blur-xl shadow-2xl`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <CheckCircle size={18} className={C[outcome.color]?.text || 'text-triage-blue-text'} />
                <div className="min-w-0">
                  <div className={`font-bold text-sm ${C[outcome.color]?.text || 'text-triage-blue-text'} truncate`}>{outcome.text}</div>
                  <div className="text-gray-400 text-sm">{outcome.time} · Document in EMIS</div>
                </div>
              </div>
              <div className="flex gap-1.5 flex-shrink-0 ml-2">
                <CopyBtn text={`${outcome.time} - ${outcome.text}`} label="Copy" onCopy={() => showToast('Copied for EMIS')} />
                <button onClick={resetFlow} className="px-2.5 py-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-100">
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============ SEARCH SCREEN ============
const SearchScreen = ({ data }) => {
  const [search, setSearch] = useState('');
  const results = useKeywordScanner(search, data.redFlags, data.amberFlags, data.pharmacyFirst, data.highRiskGroups);
  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <h1 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800"><Search size={20} className="text-triage-blue-text" />Quick Lookup</h1>
      <SearchBar value={search} onChange={setSearch} placeholder="Type symptom or keyword..." />
      {search.length >= 2 && !results?.hasAny && <p className="text-center text-gray-400 mt-8 text-sm">No matches. If unsure → GP Triager.</p>}
      {results?.red.length > 0 && (
        <div className="mb-4"><h2 className="font-bold text-triage-red-text mb-2 text-sm flex items-center gap-2"><AlertTriangle size={16} />RED FLAGS — Call 999</h2>
          {results.red.map((f, i) => <GlassCard key={`${f.system}-${i}`} color="red" className="!p-3 !mb-2"><div className="text-gray-700 text-sm">{f.symptom}</div><div className="text-triage-red-text font-bold text-sm mt-1">→ {f.action}</div></GlassCard>)}
        </div>
      )}
      {results?.amber.length > 0 && (
        <div className="mb-4"><h2 className="font-bold text-triage-amber-text mb-2 text-sm flex items-center gap-2"><AlertCircle size={16} />AMBER — Same-Day</h2>
          {results.amber.map(f => <GlassCard key={f.id} color="amber" className="!p-3 !mb-2"><div className="text-triage-amber-text font-bold text-sm">{f.category}</div><div className="flex flex-wrap gap-1 mt-1">{f.keywords.slice(0, 6).map((k, i) => <span key={i} className="bg-gray-50 px-1.5 py-0.5 rounded text-sm text-gray-400">{k}</span>)}</div><div className="text-triage-amber-text text-sm font-medium mt-1.5">→ {f.action}</div></GlassCard>)}
        </div>
      )}
      {results?.pharmacy.length > 0 && (
        <div className="mb-4"><h2 className="font-bold text-triage-green-text mb-2 text-sm flex items-center gap-2"><Pill size={16} />Pharmacy First</h2>
          {results.pharmacy.map(c => <GlassCard key={c.id} color="green" className="!p-3 !mb-2"><span className="text-lg mr-2">{c.icon}</span><span className="font-bold text-gray-800 text-sm">{c.name}</span><span className="text-gray-400 text-sm ml-2">({c.ageRange})</span></GlassCard>)}
        </div>
      )}
      {results?.risk.length > 0 && (
        <div className="mb-4"><h2 className="font-bold text-triage-amber-text mb-2 text-sm flex items-center gap-2"><Shield size={16} />High-Risk</h2>
          {results.risk.map(g => <GlassCard key={g.id} color="amber" className="!p-3 !mb-2"><div className="flex items-center gap-2"><span className="text-lg">{g.icon}</span><span className="text-gray-800 font-semibold text-sm">{g.group}</span></div><div className="text-gray-400 text-sm mt-1">{g.action}</div></GlassCard>)}
        </div>
      )}
    </div>
  );
};

// ============ CONTACTS SCREEN ============
const ContactsScreen = ({ contacts }) => {
  const [search, setSearch] = useState('');
  const filtered = contacts.filter(c => c.service.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <h1 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800"><Phone size={20} className="text-triage-blue-text" />Key Contacts</h1>
      <SearchBar value={search} onChange={setSearch} placeholder="Search contacts..." />
      {filtered.map(c => <div key={c.id}><PhoneLink {...c} /></div>)}
    </div>
  );
};

// ============ TRAINING SCREEN ============
const TrainingScreen = ({ onBack, scenarios }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [followUpPart, setFollowUpPart] = useState(1); // 1 = main, 2 = followUp
  const [progress, setProgress] = useState(() => {
    try { const d = JSON.parse(localStorage.getItem('triage_training_progress')); return d?.completedScenarios || []; }
    catch { return []; }
  });

  const saveProgress = (completedIds) => {
    setProgress(completedIds);
    localStorage.setItem('triage_training_progress', JSON.stringify({ completedScenarios: completedIds, lastActivity: new Date().toISOString() }));
  };

  const topicButtons = [
    { key: null, label: '📋 All', ids: null },
    { key: 'Red Flag Recognition', label: '🚨 Red Flags', ids: trainingTopics['Red Flag Recognition'] },
    { key: 'EMIS & Direct Booking', label: '✅ EMIS & Booking', ids: trainingTopics['EMIS & Direct Booking'] },
    { key: 'Pharmacy First & Self-Care', label: '💊 Pharmacy First', ids: trainingTopics['Pharmacy First & Self-Care'] },
    { key: 'High-Risk Patients', label: '🛡️ High-Risk', ids: trainingTopics['High-Risk Patients'] },
    { key: 'Pathways & Signposting', label: '🔍 Pathways', ids: trainingTopics['Pathways & Signposting'] },
    { key: 'Amber Flags & GP Triager', label: '⚠️ Amber & GP', ids: trainingTopics['Amber Flags & GP Triager'] },
  ];

  const filtered = selectedTopic
    ? scenarios.filter(s => trainingTopics[selectedTopic]?.includes(s.id))
    : scenarios;
  const sc = filtered[idx];

  // Determine which part of the scenario to show
  const currentPart = (followUpPart === 2 && sc?.followUp) ? sc.followUp : sc;
  const hasFollowUp = sc?.followUp != null;
  const totalParts = hasFollowUp ? 2 : 1;

  const check = id => {
    setAnswer(id);
    setShowResult(true);
    const isCorrect = id === currentPart.correctAnswer;
    setScore(p => isCorrect ? { correct: p.correct + 1, total: p.total + 1 } : { ...p, total: p.total + 1 });
    // Save progress only when correct on final part
    if (isCorrect) {
      const isFinalPart = !hasFollowUp || followUpPart === 2;
      if (isFinalPart && !progress.includes(sc.id)) {
        saveProgress([...progress, sc.id]);
      }
    }
  };

  const next = () => {
    if (showResult && hasFollowUp && followUpPart === 1 && answer === currentPart.correctAnswer) {
      // Move to follow-up part
      setFollowUpPart(2);
      setAnswer(null);
      setShowResult(false);
    } else if (idx < filtered.length - 1) {
      setIdx(idx + 1);
      setAnswer(null);
      setShowResult(false);
      setFollowUpPart(1);
    }
  };

  const restart = () => {
    setIdx(0); setAnswer(null); setShowResult(false);
    setScore({ correct: 0, total: 0 }); setFollowUpPart(1);
  };

  const resetProgress = () => {
    saveProgress([]);
    restart();
  };

  const completedCount = progress.length;
  const totalCount = scenarios.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (!sc) return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <BackButton onClick={onBack} />
      <div className="text-center text-gray-400 mt-8">No scenarios for this topic.</div>
    </div>
  );

  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <BackButton onClick={onBack} />
      <h1 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800"><GraduationCap size={20} className="text-triage-purple-text" />Training</h1>

      {/* Progress bar */}
      <div className="bg-white shadow-sm rounded-xl p-3 border border-gray-200 mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-gray-500 text-sm font-semibold">{completedCount}/{totalCount} completed ({pct}%)</span>
          <button onClick={resetProgress} className="text-gray-400 text-sm hover:text-triage-red-text">Reset Progress</button>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-triage-green-light0 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Topic navigation */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {topicButtons.map(t => {
          const count = t.ids ? scenarios.filter(s => t.ids.includes(s.id)).length : scenarios.length;
          const isActive = selectedTopic === t.key;
          return (
            <button key={t.label} onClick={() => { setSelectedTopic(t.key); setIdx(0); setAnswer(null); setShowResult(false); setFollowUpPart(1); }}
              className={`px-2.5 py-1.5 rounded-lg border text-sm font-semibold transition-all ${isActive ? 'bg-triage-purple-light border-triage-purple-dark/30 text-triage-purple-text' : 'border-gray-200 text-gray-400 hover:border-gray-200'}`}>
              {t.label} <span className="text-gray-300 ml-0.5">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Scenario counter + score */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-500 text-sm">{idx + 1}/{filtered.length}{hasFollowUp && <span className="text-triage-teal-text ml-1.5 text-sm font-bold">Part {followUpPart}/{totalParts}</span>}</span>
        <div className="flex items-center gap-2">
          {progress.includes(sc.id) && <span className="text-triage-green-text text-sm font-bold">✅ Done</span>}
          <span className="font-bold text-gray-800 text-sm">Score: {score.correct}/{score.total}</span>
        </div>
      </div>

      {/* Scenario card */}
      <GlassCard color="blue">
        <div className="text-triage-blue-text font-bold mb-2 text-sm">
          📋 ANIMA REQUEST:{hasFollowUp && <span className="text-triage-teal-text ml-2">{followUpPart === 1 ? 'Initial call' : 'Follow-up'}</span>}
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{currentPart.scenario}</p>
      </GlassCard>

      {/* Options */}
      <div className="mt-3 space-y-2">
        {currentPart.options.map(o => {
          let style = 'bg-gray-50 border-gray-200 hover:border-triage-blue-dark/25';
          if (showResult) {
            if (o.id === currentPart.correctAnswer) style = 'bg-triage-green-light border-triage-green-dark/40';
            else if (o.id === answer) style = 'bg-triage-red-light border-triage-red-dark/40';
            else style = 'opacity-40';
          }
          return <button key={o.id} onClick={() => !showResult && check(o.id)} disabled={showResult} className={`w-full p-3.5 rounded-xl border text-left text-sm text-gray-600 transition-all ${style}`}>{o.text}</button>;
        })}
      </div>

      {/* Result */}
      {showResult && (
        <>
          <GlassCard color={answer === currentPart.correctAnswer ? 'green' : 'red'} className="mt-3">
            <div className="font-bold mb-1 text-gray-800 text-sm">{answer === currentPart.correctAnswer ? '✅ Correct!' : '❌ Not quite'}</div>
            <p className="text-sm text-gray-500">{currentPart.explanation}</p>
          </GlassCard>
          <div className="mt-3">
            {/* If correct on part 1 with followUp, show "Continue to Part 2" */}
            {hasFollowUp && followUpPart === 1 && answer === currentPart.correctAnswer ? (
              <Button color="teal" full onClick={next}>Continue to Part 2 →</Button>
            ) : hasFollowUp && followUpPart === 1 && answer !== currentPart.correctAnswer ? (
              <div className="text-center text-gray-400 text-sm mb-2">Get Part 1 correct to unlock the follow-up scenario.
                {idx < filtered.length - 1 && <div className="mt-2"><Button color="blue" full onClick={() => { setIdx(idx + 1); setAnswer(null); setShowResult(false); setFollowUpPart(1); }}>Skip to Next →</Button></div>}
              </div>
            ) : idx < filtered.length - 1 ? (
              <Button color="blue" full onClick={next}>Next →</Button>
            ) : (
              <div className="text-center">
                <div className="text-xl font-semibold mb-3 text-gray-800">{score.correct}/{score.total}</div>
                <Button color="green" onClick={restart}>Restart Topic</Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// ============ TIER 2 WORKFLOW ============
const Tier2Workflow = ({ data, showToast }) => {
  const [t2Step, setT2Step] = useState(null);
  const [t2CompletedSteps, setT2CompletedSteps] = useState(new Set());
  const [handoverPaste, setHandoverPaste] = useState('');
  const [t2PatientWords, setT2PatientWords] = useState('');
  const [purpleGate, setPurpleGate] = useState(null); // null | 'clear' | 'purple'
  const [amberGate, setAmberGate] = useState(null);
  const [yellowGate, setYellowGate] = useState(null);
  const [greenGate, setGreenGate] = useState(null);
  const [amberSearch, setAmberSearch] = useState('');
  const [yellowEconsult, setYellowEconsult] = useState(null);
  const [greenEconsult, setGreenEconsult] = useState(null);
  // Tier 2→3 handover form
  const [t2Notes, setT2Notes] = useState('');
  const [gpQuestion, setGpQuestion] = useState('');
  const [timeSensitivity, setTimeSensitivity] = useState('SAME-DAY');
  const [confidence, setConfidence] = useState('MEDIUM');
  const [econsultTriedFailed, setEconsultTriedFailed] = useState(false);

  const scan = useKeywordScanner(t2PatientWords, data.redFlags, data.amberFlags, data.pharmacyFirst, data.highRiskGroups);

  const t2Toggle = (step) => setT2Step(t2Step === step ? null : step);
  const t2MarkDone = (step) => setT2CompletedSteps(prev => { const n = new Set(prev); n.add(step); return n; });
  const t2Advance = (cur) => { t2MarkDone(cur); if (cur + 1 <= 6) setT2Step(cur + 1); };

  const resetT2 = () => {
    setT2Step(null); setT2CompletedSteps(new Set()); setHandoverPaste(''); setT2PatientWords('');
    setPurpleGate(null); setAmberGate(null); setYellowGate(null); setGreenGate(null);
    setAmberSearch(''); setYellowEconsult(null); setGreenEconsult(null);
    setT2Notes(''); setGpQuestion(''); setTimeSensitivity('SAME-DAY'); setConfidence('MEDIUM');
    setEconsultTriedFailed(false); window.scrollTo(0, 0);
  };

  const buildHandover = () => {
    const ts = new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    return `TIER 2 → TIER 3 HANDOVER\nDate/Time: ${ts}\nTier 1 handover: ${handoverPaste || 'N/A'}\nTier 2 review: ${t2Notes || 'N/A'}\nPurple: ${purpleGate === 'purple' ? 'YES — matched' : 'Checked — clear'} | Amber: ${amberGate === 'amber' ? 'YES — matched' : amberGate === 'clear' ? 'Checked — clear' : 'Not reached'}\nYellow: ${yellowGate === 'yellow' ? 'YES — matched' : yellowGate === 'clear' ? 'Checked — clear' : 'Not reached'} | Green: ${greenGate === 'green' ? 'YES — matched' : greenGate === 'clear' ? 'Checked — clear' : 'Not reached'}\neConsult tried & failed: ${econsultTriedFailed ? 'Yes' : 'No'}\nQuestion for GP: ${gpQuestion || 'N/A'}\nTime sensitivity: ${timeSensitivity}\nConfidence: ${confidence}`;
  };

  const filteredAmber = amberSearch
    ? data.amberFlags.filter(f => JSON.stringify(f).toLowerCase().includes(amberSearch.toLowerCase()))
    : data.amberFlags;

  return (
    <div className="p-3 sm:p-4 pb-36 max-w-lg mx-auto">
      {/* TIER 2 HEADER */}
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-gray-800">Tier 2 — Patient Services Team</h1>
        <p className="text-sm text-triage-amber-text font-semibold mt-1.5">You process and book — you do not decide clinical urgency</p>
        <p className="text-sm text-gray-400 mt-1">Match the pattern → take the action. If &gt;60 seconds → escalate to Tier 3.</p>
        {(t2CompletedSteps.size > 0) && (
          <button onClick={resetT2} className="mt-3 flex items-center gap-1.5 px-4 py-2.5 bg-triage-blue-light border border-triage-blue-dark/20 rounded-xl text-triage-blue-text text-sm font-semibold hover:brightness-95 transition-all">
            <RotateCcw size={14} />New triage
          </button>
        )}
      </div>

      {/* ---- STEP PROGRESS INDICATOR (TIER 2) ---- */}
      <div className="flex items-center mb-4 px-2">
        {[1, 2, 3, 4, 5, 6].flatMap((step, i) => {
          const items = [];
          if (i > 0) items.push(
            <div key={`t2line-${step}`} className={`h-0.5 flex-1 transition-all duration-300 ${t2CompletedSteps.has(step - 1) ? 'bg-triage-green-dark/30' : 'bg-gray-200'}`} />
          );
          items.push(
            <div key={`t2step-${step}`} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-300 ${
              t2CompletedSteps.has(step) ? 'bg-triage-green-light border border-triage-green-dark/30 text-triage-green-text' :
              t2Step === step ? 'bg-triage-blue-dark text-white shadow-md' :
              'bg-gray-200 text-gray-400'
            }`}>
              {t2CompletedSteps.has(step) ? '✓' : step}
            </div>
          );
          return items;
        })}
      </div>

      {/* TIME LIMITS BAR */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-triage-amber-light border border-triage-amber-dark/20 rounded-2xl p-3 text-center shadow-sm">
          <div className="text-triage-amber-text font-semibold text-sm">Amber</div>
          <div className="text-sm text-gray-500">within 1 hour</div>
        </div>
        <div className="bg-triage-yellow-light border border-triage-yellow-dark/20 rounded-2xl p-3 text-center shadow-sm">
          <div className="text-triage-yellow-text font-semibold text-sm">Yellow + Green</div>
          <div className="text-sm text-gray-500">within 2 hours</div>
        </div>
        <div className="bg-triage-red-light border border-triage-red-dark/20 rounded-2xl p-3 text-center shadow-sm">
          <div className="text-triage-red-text font-semibold text-sm">End of day</div>
          <div className="text-sm text-gray-500">auto-escalate</div>
        </div>
      </div>

      {/* ═══ T2 STEP 1: RECEIVE & REVIEW ═══ */}
      <FlowStep num={1} color="blue" title="📋 Receive & Review" subtitle="Read the Tier 1 handover and enter patient words"
        expanded={t2Step === 1} onToggle={() => t2Toggle(1)} completed={t2CompletedSteps.has(1)}>
        <div className="space-y-3">
          <TextArea label="Paste Tier 1 Handover" value={handoverPaste} onChange={setHandoverPaste} placeholder="Paste the Tier 1 handover from clipboard..." rows={4} />
          {handoverPaste && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
              <div className="text-sm text-triage-blue-text font-bold mb-1">Handover received</div>
              <pre className="text-sm text-gray-500 whitespace-pre-wrap font-sans">{handoverPaste}</pre>
            </div>
          )}
          <TextArea label="Patient's Words (for scanner)" value={t2PatientWords} onChange={setT2PatientWords} placeholder="Enter patient's words for keyword scanning..." rows={2} />
          {scan && (
            <div className="flex gap-2 flex-wrap">
              {scan.hasStop && <span className="bg-red-100 border border-red-300 text-red-700 px-3 py-1.5 rounded-full text-sm font-semibold animate-pulse">🚨 STOP</span>}
              {scan.hasRed && <span className="bg-triage-red-light border border-triage-red-dark/25 text-triage-red-text px-3 py-1.5 rounded-full text-sm font-semibold">🔴 Red</span>}
              {scan.hasAmber && <span className="bg-triage-amber-light border border-triage-amber-dark/25 text-triage-amber-text px-3 py-1.5 rounded-full text-sm font-semibold">🟠 Amber</span>}
              {scan.hasPurple && <span className="bg-triage-purple-light border border-triage-purple-dark/25 text-triage-purple-text px-3 py-1.5 rounded-full text-sm font-semibold">🟣 Purple</span>}
              {scan.hasYellow && <span className="bg-triage-yellow-light border border-triage-yellow-dark/25 text-triage-yellow-text px-3 py-1.5 rounded-full text-sm font-semibold">🟡 Yellow</span>}
              {scan.hasGreen && <span className="bg-triage-green-light border border-triage-green-dark/25 text-triage-green-text px-3 py-1.5 rounded-full text-sm font-semibold">🟢 Green</span>}
              {scan.hasRisk && <span className="bg-triage-teal-light border border-triage-teal-dark/25 text-triage-teal-text px-3 py-1.5 rounded-full text-sm font-semibold">⚠️ High risk</span>}
            </div>
          )}
          <div className="bg-triage-amber-light border border-triage-amber-dark/20 rounded-xl p-2.5">
            <div className="text-sm text-triage-amber-text font-bold">AMBER = within 1 hour | All others = within 2 hours</div>
            <div className="text-sm text-gray-400 mt-1">PROCESS and BOOK protocol-clear. Do NOT decide clinical urgency.</div>
          </div>
          <button onClick={() => t2Advance(1)} className="w-full py-3 bg-triage-blue-light border border-triage-blue-dark/20 text-triage-blue-text rounded-xl font-semibold text-sm hover:brightness-95 hover:scale-[1.02] transition-all">
            Continue to Purple Check →
          </button>
        </div>
      </FlowStep>

      {/* ═══ T2 STEP 2: PURPLE GATE ═══ */}
      <FlowStep num={2} color="violet" title="🟣 Purple Check — Must Escalate to Tier 3" subtitle="Check this list FIRST before matching amber/yellow/green"
        expanded={t2Step === 2} onToggle={() => t2Toggle(2)} completed={t2CompletedSteps.has(2)}
        locked={!t2CompletedSteps.has(1)} lockedMsg="Complete Step 1 first">
        <div className="space-y-3">
          <div className="bg-triage-purple-light border border-triage-purple-dark/35 rounded-xl p-2.5">
            <div className="text-triage-purple-text text-sm font-bold">If ANY purple trigger applies → Tier 3 REGARDLESS — even if it also matches yellow or green.</div>
          </div>
          {/* Empty state for no purple matches */}
          {t2PatientWords && scan && !scan.hasPurple && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-3 text-center">
              <span className="text-xl">✨</span>
              <div className="text-gray-400 text-sm mt-1">No purple flags matched — review list below to confirm</div>
            </div>
          )}
          <div className="space-y-2">
            {purpleFlags.map((pf, i) => {
              const matched = scan?.purple?.some(p => p.category === pf.category);
              const pi = getIcon(purpleIcons, pf.category);
              return (
                <div key={i} className={`border-l-4 ${matched ? 'border-triage-purple-dark bg-triage-purple-light' : 'border-gray-200 bg-gray-50'} rounded-r-xl p-2.5`}>
                  <div className={`flex items-center gap-3 font-bold text-sm ${matched ? 'text-triage-purple-text' : 'text-gray-600'}`}>
                    {pi && <div className="w-10 h-10 rounded-full bg-triage-purple-light flex items-center justify-center text-xl flex-shrink-0">{pi.icon}</div>}
                    {pf.category}
                  </div>
                  <div className="text-sm text-gray-400 mt-0.5">{pf.triggers.join(' · ')}</div>
                  <div className="text-sm text-triage-purple-text/70 mt-0.5">{pf.action}</div>
                </div>
              );
            })}
          </div>
          {purpleGate === null && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button onClick={() => { setPurpleGate('clear'); t2Advance(2); }}
                className="py-3.5 bg-triage-green-light border border-triage-green-dark/20 text-triage-green-text rounded-xl font-semibold text-sm hover:brightness-95 hover:scale-[1.02] transition-all">
                No purple triggers — continue
              </button>
              <button onClick={() => { setPurpleGate('purple'); t2MarkDone(2); setT2Step(6); }}
                className="py-3.5 bg-triage-purple-light border border-triage-purple-dark/25 text-triage-purple-text rounded-xl font-semibold text-sm animate-pulse hover:scale-[1.02] transition-transform">
                Purple identified — escalate
              </button>
            </div>
          )}
          {purpleGate && (
            <div className={`text-center py-3 rounded-xl text-sm font-semibold ${purpleGate === 'clear' ? 'bg-triage-green-light text-triage-green-text' : 'bg-triage-purple-light text-triage-purple-text'}`}>
              {purpleGate === 'clear' ? '✓ No purple — proceeding to amber check' : '🟣 Purple identified — escalating to Tier 3'}
            </div>
          )}
        </div>
      </FlowStep>

      {/* ═══ T2 STEP 3: AMBER CHECK ═══ */}
      <FlowStep num={3} color="amber" title="🟠 Amber Check — Book Same-day" subtitle="Same-day duty GP (action within 1 hour)"
        expanded={t2Step === 3} onToggle={() => t2Toggle(3)} completed={t2CompletedSteps.has(3)}
        locked={!t2CompletedSteps.has(2) || purpleGate === 'purple'} lockedMsg={purpleGate === 'purple' ? 'Purple identified — skip to escalation' : 'Complete Step 2 first'}>
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-300" size={14} />
            <input type="text" value={amberSearch} onChange={e => setAmberSearch(e.target.value)}
              placeholder="Filter amber categories..." className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:border-triage-amber/40 focus:outline-none text-gray-800 text-sm" />
          </div>
          {/* Empty state for no amber matches */}
          {t2PatientWords && scan && !scan.hasAmber && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-3 text-center">
              <span className="text-xl">✨</span>
              <div className="text-gray-400 text-sm mt-1">No amber flags matched — review list below to confirm</div>
            </div>
          )}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filteredAmber.map((af, i) => {
              const matched = scan?.amber?.some(a => a.category === af.category);
              const ai = getIcon(amberIcons, af.category);
              return (
                <div key={i} className={`border-l-4 ${matched ? 'border-triage-amber bg-triage-amber-light' : 'border-gray-200 bg-gray-50'} rounded-r-xl p-2.5`}>
                  <div className={`flex items-center gap-3 font-bold text-sm ${matched ? 'text-triage-amber-text' : 'text-gray-600'}`}>
                    {ai && <div className="w-10 h-10 rounded-full bg-triage-amber-light flex items-center justify-center text-xl flex-shrink-0">{ai.icon}</div>}
                    {af.category}
                  </div>
                  <div className="text-sm text-gray-400 mt-0.5">{af.buzzwords ? af.buzzwords.join(', ') : af.keywords.join(', ')}</div>
                  <div className="text-sm text-triage-amber-dark/70 mt-0.5">{af.action}</div>
                  {af.notes && <div className="text-sm text-gray-400 mt-0.5 italic">{af.notes}</div>}
                </div>
              );
            })}
          </div>
          {amberGate === null && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button onClick={() => { setAmberGate('clear'); t2Advance(3); }}
                className="py-3 bg-triage-blue-light border border-triage-blue-dark/20 text-triage-blue-text rounded-xl font-semibold text-sm hover:brightness-95 hover:scale-[1.02] transition-all">
                No amber match — continue
              </button>
              <button onClick={() => { setAmberGate('amber'); t2MarkDone(3); showToast('Amber matched — book same-day duty GP'); }}
                className="py-3 bg-triage-amber-light border border-triage-amber-dark/20 text-triage-amber-text rounded-xl font-semibold text-sm hover:brightness-95 hover:scale-[1.02] transition-all">
                Amber matched — booking same-day
              </button>
            </div>
          )}
          {amberGate && (
            <div className={`text-center py-2 rounded-xl text-sm font-bold ${amberGate === 'clear' ? 'bg-triage-blue-light text-triage-blue-text' : 'bg-triage-amber-light text-triage-amber-text'}`}>
              {amberGate === 'clear' ? '✓ No amber — proceeding to yellow check' : '🟠 Amber matched — book same-day duty GP within 1 hour'}
            </div>
          )}
        </div>
      </FlowStep>

      {/* ═══ T2 STEP 4: YELLOW CHECK ═══ */}
      <FlowStep num={4} color="amber" title="🟡 Yellow Check — Book 1–3 Days" subtitle="Book within 1-3 days (action within 2 hours)"
        expanded={t2Step === 4} onToggle={() => t2Toggle(4)} completed={t2CompletedSteps.has(4)}
        locked={!t2CompletedSteps.has(3) || purpleGate === 'purple'} lockedMsg="Complete Step 3 first">
        <div className="space-y-3">
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {yellowFlags.map((yf, i) => {
              const matched = scan?.yellow?.some(y => y.category === yf.category);
              return (
                <div key={i} className={`border-l-4 ${matched ? 'border-triage-yellow-dark bg-triage-yellow-light' : 'border-gray-200 bg-gray-50'} rounded-r-xl p-2.5`}>
                  <div className={`font-bold text-sm ${matched ? 'text-triage-yellow-text' : 'text-gray-600'}`}>
                    {yf.category}
                    {yf.econsult && <span className="ml-2 text-sm bg-triage-blue-light text-triage-blue-text px-1.5 py-0.5 rounded">eConsult?</span>}
                  </div>
                  <div className="text-sm text-gray-400 mt-0.5">{yf.presentation || yf.triggers?.join(' · ')}</div>
                  {yf.escalateIf && <div className="text-sm text-triage-red-dark/70 mt-0.5">Escalate if: {yf.escalateIf}</div>}
                </div>
              );
            })}
          </div>
          {/* Mental Health reminder */}
          <div className="bg-triage-purple-light border border-triage-purple-dark/30 rounded-xl p-2.5">
            <div className="text-triage-purple-text text-sm font-bold">Mental health (non-crisis)</div>
            <div className="text-sm text-gray-500 mt-1">Send Kingston Talking Therapies self-referral info (swlstg.nhs.uk) AND book GP review within 1-3 days. Do NOT just signpost.</div>
          </div>
          {/* eConsult check */}
          {yellowEconsult === null && (
            <div className="bg-triage-blue-light border border-triage-blue-dark/20 rounded-xl p-2.5">
              <div className="text-triage-blue-text text-sm font-bold mb-2">eConsult check</div>
              <div className="text-sm text-gray-400 mb-2">Has this condition already been managed via eConsult?</div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setYellowEconsult('tried')} className="py-2 bg-triage-amber-light border border-triage-amber-dark/20 text-triage-amber-text rounded-xl text-sm font-semibold hover:brightness-95 transition-all">Yes — tried before → face-to-face</button>
                <button onClick={() => setYellowEconsult('no')} className="py-2 bg-triage-blue-light border border-triage-blue-dark/20 text-triage-blue-text rounded-xl text-sm font-semibold hover:brightness-95 transition-all">No — may suggest eConsult</button>
              </div>
            </div>
          )}
          {yellowEconsult && (
            <div className={`text-center py-2 rounded-xl text-sm font-bold ${yellowEconsult === 'tried' ? 'bg-triage-amber-light text-triage-amber-text' : 'bg-triage-blue-light text-triage-blue-text'}`}>
              {yellowEconsult === 'tried' ? '→ Book face-to-face (eConsult already tried)' : '→ eConsult may be appropriate'}
            </div>
          )}
          {/* Purple safety net */}
          <div className="bg-triage-purple-light border border-triage-purple-dark/25 rounded-xl p-2">
            <div className="text-triage-purple-text text-sm font-bold">PURPLE SAFETY NET: If ANY purple trigger applies → ESCALATE regardless of yellow match</div>
          </div>
          {yellowGate === null && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button onClick={() => { setYellowGate('clear'); t2Advance(4); }}
                className="py-3 bg-triage-blue-light border border-triage-blue-dark/20 text-triage-blue-text rounded-xl font-semibold text-sm hover:brightness-95 hover:scale-[1.02] transition-all">
                No yellow match — continue
              </button>
              <button onClick={() => { setYellowGate('yellow'); t2MarkDone(4); showToast('Yellow matched — book 1-3 days'); }}
                className="py-3 bg-triage-yellow-light border border-triage-yellow-dark/35 text-triage-yellow-text rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform">
                Yellow matched — booking 1-3 days
              </button>
            </div>
          )}
          {yellowGate && (
            <div className={`text-center py-2 rounded-xl text-sm font-bold ${yellowGate === 'clear' ? 'bg-triage-blue-light text-triage-blue-text' : 'bg-triage-yellow-light text-triage-yellow-text'}`}>
              {yellowGate === 'clear' ? '✓ No yellow — proceeding to green check' : '🟡 Yellow matched — book within 1-3 days'}
            </div>
          )}
        </div>
      </FlowStep>

      {/* ═══ T2 STEP 5: GREEN CHECK ═══ */}
      <FlowStep num={5} color="green" title="🟢 Green Check — Book 1 Week" subtitle="Book within 1 week (action within 2 hours)"
        expanded={t2Step === 5} onToggle={() => t2Toggle(5)} completed={t2CompletedSteps.has(5)}
        locked={!t2CompletedSteps.has(4) || purpleGate === 'purple'} lockedMsg="Complete Step 4 first">
        <div className="space-y-3">
          {/* Tried and failed rule */}
          <div className="bg-triage-amber-light border border-triage-amber-dark/20 rounded-xl p-2.5">
            <div className="text-triage-amber-text text-sm font-bold">The "tried and failed" rule</div>
            <div className="text-sm text-gray-500 mt-1">If patient already managed via eConsult for THIS condition and it did not work → book face-to-face, NOT another eConsult.</div>
            <div className="mt-2 space-y-1">
              <div className="text-sm text-gray-400">• Mild eczema: eConsult Rx tried + rash persists → face-to-face</div>
              <div className="text-sm text-gray-400">• Acne: topical Rx via eConsult + no improvement → face-to-face</div>
              <div className="text-sm text-gray-400">• Non-crisis MH: Talking Therapies + eConsult tried, still struggling → face-to-face</div>
            </div>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {greenFlags.map((gf, i) => {
              const matched = scan?.green?.some(g => g.category === gf.category);
              return (
                <div key={i} className={`border-l-4 ${matched ? 'border-triage-green bg-triage-green-light' : 'border-gray-200 bg-gray-50'} rounded-r-xl p-2.5`}>
                  <div className={`font-bold text-sm ${matched ? 'text-triage-green-text' : 'text-gray-600'}`}>
                    {gf.category}
                    {gf.econsult && <span className="ml-2 text-sm bg-triage-blue-light text-triage-blue-text px-1.5 py-0.5 rounded">eConsult?</span>}
                  </div>
                  <div className="text-sm text-gray-400 mt-0.5">{gf.presentation || gf.triggers?.join(' · ')}</div>
                  {gf.escalateIf && <div className="text-sm text-triage-red-dark/70 mt-0.5">Escalate if: {gf.escalateIf}</div>}
                </div>
              );
            })}
          </div>
          {/* eConsult check */}
          {greenEconsult === null && (
            <div className="bg-triage-blue-light border border-triage-blue-dark/20 rounded-xl p-2.5">
              <div className="text-triage-blue-text text-sm font-bold mb-2">eConsult check</div>
              <div className="text-sm text-gray-400 mb-2">Has this condition already been managed via eConsult?</div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { setGreenEconsult('tried'); setEconsultTriedFailed(true); }} className="py-2 bg-triage-amber-light border border-triage-amber-dark/20 text-triage-amber-text rounded-xl text-sm font-semibold hover:brightness-95 transition-all">Yes — tried before → face-to-face</button>
                <button onClick={() => setGreenEconsult('no')} className="py-2 bg-triage-blue-light border border-triage-blue-dark/20 text-triage-blue-text rounded-xl text-sm font-semibold hover:brightness-95 transition-all">No — may suggest eConsult</button>
              </div>
            </div>
          )}
          {greenEconsult && (
            <div className={`text-center py-2 rounded-xl text-sm font-bold ${greenEconsult === 'tried' ? 'bg-triage-amber-light text-triage-amber-text' : 'bg-triage-blue-light text-triage-blue-text'}`}>
              {greenEconsult === 'tried' ? '→ Book face-to-face (eConsult tried & failed)' : '→ eConsult may be appropriate'}
            </div>
          )}
          {/* Purple safety net */}
          <div className="bg-triage-purple-light border border-triage-purple-dark/25 rounded-xl p-2">
            <div className="text-triage-purple-text text-sm font-bold">PURPLE SAFETY NET: If ANY purple trigger applies → ESCALATE regardless of green match</div>
          </div>
          {greenGate === null && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button onClick={() => { setGreenGate('clear'); t2Advance(5); }}
                className="py-3 bg-triage-blue-light border border-triage-blue-dark/20 text-triage-blue-text rounded-xl font-semibold text-sm hover:brightness-95 hover:scale-[1.02] transition-all">
                No green match — continue
              </button>
              <button onClick={() => { setGreenGate('green'); t2MarkDone(5); showToast('Green matched — book within 1 week'); }}
                className="py-3 bg-triage-green-light border border-triage-green-dark/20 text-triage-green-text rounded-xl font-semibold text-sm hover:brightness-95 hover:scale-[1.02] transition-all">
                Green matched — booking 1 week
              </button>
            </div>
          )}
          {greenGate && (
            <div className={`text-center py-2 rounded-xl text-sm font-bold ${greenGate === 'clear' ? 'bg-triage-blue-light text-triage-blue-text' : 'bg-triage-green-light text-triage-green-text'}`}>
              {greenGate === 'clear' ? '✓ No green — proceeding to decision point' : '🟢 Green matched — book within 1 week'}
            </div>
          )}
        </div>
      </FlowStep>

      {/* ═══ T2 STEP 6: DECISION POINT + eCONSULT DISTRIBUTION ═══ */}
      <FlowStep num={6} color="blue" title="⚖️ Decision Point + eConsult Distribution" subtitle="Final decision — can you process, or must you escalate?"
        expanded={t2Step === 6} onToggle={() => t2Toggle(6)} completed={t2CompletedSteps.has(6)}
        locked={!t2CompletedSteps.has(5) && !t2CompletedSteps.has(2)} lockedMsg="Complete previous steps first">
        <div className="space-y-3">
          {/* Two-panel layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* CAN DO panel */}
            <div className="border-l-4 border-triage-green bg-triage-green-light rounded-r-xl p-3">
              <div className="text-triage-green-text font-bold text-sm mb-2">Tier 2 can process</div>
              <ul className="space-y-1">
                {tier2Actions.canDo.map((item, i) => (
                  <li key={i} className="text-sm text-gray-500 flex items-start gap-1.5">
                    <CheckCircle size={10} className="text-triage-green-text flex-shrink-0 mt-0.5" />{item}
                  </li>
                ))}
              </ul>
            </div>
            {/* MUST ESCALATE panel */}
            <div className="border-l-4 border-triage-red bg-triage-red-light rounded-r-xl p-3">
              <div className="text-triage-red-text font-bold text-sm mb-2">Must escalate to Tier 3</div>
              <ul className="space-y-1">
                {tier2Actions.mustEscalate.map((item, i) => (
                  <li key={i} className="text-sm text-gray-500 flex items-start gap-1.5">
                    <AlertTriangle size={10} className="text-triage-red-text flex-shrink-0 mt-0.5" />{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 60-SECOND RULE */}
          <div className="bg-triage-red-light border-2 border-triage-red-dark/30 rounded-2xl p-5 text-center">
            <div className="text-triage-red-text font-bold text-lg">60-SECOND RULE</div>
            <div className="text-gray-500 text-sm mt-1.5">If you&apos;ve been thinking about this for &gt;60 seconds → escalate to Tier 3</div>
          </div>

          {/* eCONSULT DISTRIBUTION */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
            <div className="text-triage-blue-text font-semibold text-sm mb-3">eConsult distribution (daily task)</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-triage-green-text text-sm font-bold mb-1">Admin → Session GP</div>
                <div className="text-sm text-gray-400 space-y-0.5">
                  <div>• Fit note renewal</div>
                  <div>• Results with GP comment</div>
                  <div>• ADHD/ASD referrals</div>
                  <div>• Investigation requests</div>
                  <div>• Private referrals</div>
                  <div>• Admin with sign-off</div>
                </div>
              </div>
              <div>
                <div className="text-triage-red-text text-sm font-bold mb-1">Clinical → GP Triager</div>
                <div className="text-sm text-gray-400 space-y-0.5">
                  <div>• Clinical queries</div>
                  <div>• Medication decisions</div>
                  <div>• Abnormal results (no plan)</div>
                  <div>• Complex / multi-problem</div>
                  <div>• Hidden clinical content</div>
                  <div>• Anything unclear</div>
                </div>
              </div>
            </div>
          </div>

          {/* TIER 2→3 HANDOVER FORM */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
            <div className="text-triage-purple-text font-semibold text-base mb-3">Tier 2 → Tier 3 Handover Form</div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-xl p-2.5">
                  <span className="text-gray-400">Purple: </span>
                  <span className={purpleGate === 'purple' ? 'text-triage-purple-text font-semibold' : 'text-gray-500'}>{purpleGate === 'purple' ? 'Yes' : purpleGate === 'clear' ? 'Clear' : '—'}</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5">
                  <span className="text-gray-400">Amber: </span>
                  <span className={amberGate === 'amber' ? 'text-triage-amber-text font-semibold' : 'text-gray-500'}>{amberGate === 'amber' ? 'Yes' : amberGate === 'clear' ? 'Clear' : '—'}</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5">
                  <span className="text-gray-400">Yellow: </span>
                  <span className={yellowGate === 'yellow' ? 'text-triage-yellow-text font-semibold' : 'text-gray-500'}>{yellowGate === 'yellow' ? 'Yes' : yellowGate === 'clear' ? 'Clear' : '—'}</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5">
                  <span className="text-gray-400">Green: </span>
                  <span className={greenGate === 'green' ? 'text-triage-green-text font-semibold' : 'text-gray-500'}>{greenGate === 'green' ? 'Yes' : greenGate === 'clear' ? 'Clear' : '—'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={econsultTriedFailed} onChange={e => setEconsultTriedFailed(e.target.checked)} className="rounded" />
                <label className="text-sm text-gray-500">eConsult tried and failed</label>
              </div>
              <TextArea label="Tier 2 Review Notes" value={t2Notes} onChange={setT2Notes} placeholder="Your review notes..." rows={2} />
              <TextArea label="Specific Question for GP (REQUIRED)" value={gpQuestion} onChange={setGpQuestion} placeholder="What specific question do you need the GP to answer?" rows={2} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Time Sensitivity</label>
                  <select value={timeSensitivity} onChange={e => setTimeSensitivity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm">
                    <option value="URGENT">URGENT</option>
                    <option value="SAME-DAY">SAME-DAY</option>
                    <option value="ROUTINE">ROUTINE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Confidence Level</label>
                  <select value={confidence} onChange={e => setConfidence(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm">
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>
              <CopyBtn text={buildHandover()} label="Copy Handover to Clipboard" onCopy={() => showToast('Tier 2→3 handover copied')} />
            </div>
          </div>

          <button onClick={resetT2} className="w-full py-3 bg-triage-blue-light border border-triage-blue-dark/20 text-triage-blue-text rounded-xl font-semibold text-sm hover:brightness-95 transition-all mt-3">
            <RotateCcw size={14} className="inline mr-2" />Start New Triage
          </button>
        </div>
      </FlowStep>

      {/* VERSION TEXT */}
      <div className="text-center text-sm text-gray-300 mt-4 mb-20">
        SOP v3.5 | Tier 2 Flowchart v4.0 | Feb 2026 | Dr Sahar Jahanian
      </div>
    </div>
  );
};

// ============ SOP VIEWER ============
const SOPScreen = () => {
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');
  const filtered = search.length >= 2 ? sopSections.filter(s => JSON.stringify(s).toLowerCase().includes(search.toLowerCase())) : sopSections;

  const renderBlock = (block, idx) => {
    const c = C[block.color] || C.blue;
    switch (block.type) {
      case 'text': return <p key={idx} className="text-gray-600 text-sm leading-relaxed mb-3">{block.text}</p>;
      case 'highlight': return <div key={idx} className={`${c.bg} border ${c.border} rounded-xl p-3 mb-3 flex items-start gap-2`}><div className={`w-2 h-2 rounded-full ${c.dot} mt-1.5 flex-shrink-0`} /><span className={`${c.text} font-semibold text-sm`}>{block.text}</span></div>;
      case 'list': return <div key={idx} className="mb-3">{block.title && <div className={`${c.text} font-bold text-sm mb-2`}>{block.title}</div>}<div className="space-y-1.5">{block.items.map((item, i) => <div key={i} className="flex items-start gap-2.5 pl-1"><div className={`w-1.5 h-1.5 rounded-full ${c.dot} mt-2 flex-shrink-0 opacity-60`} /><span className="text-gray-500 text-sm">{item}</span></div>)}</div></div>;
      case 'steps': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => { const ic = C[item.color] || C.gray; return <div key={i} className={`${ic.bg} border ${ic.border} rounded-xl p-3`}><div className="flex items-start gap-3">{item.step && <div className={`w-7 h-7 rounded-lg ${ic.bg} border ${ic.border} flex items-center justify-center flex-shrink-0 font-bold text-sm ${ic.text}`}>{item.step}</div>}<div className="flex-1"><div className={`${ic.text} font-bold text-sm`}>{item.label}</div>{item.detail && <div className="text-gray-400 text-sm mt-0.5">{item.detail}</div>}<div className="text-gray-500 text-sm mt-1">→ {item.action}</div></div></div></div>; })}</div>;
      case 'table': return <div key={idx} className="overflow-x-auto mb-3"><table className="w-full text-sm"><thead><tr>{block.headers.map((h, i) => <th key={i} className="text-left text-gray-500 font-semibold pb-2 pr-3 text-sm border-b border-gray-200">{h}</th>)}</tr></thead><tbody>{block.rows.map((row, i) => <tr key={i} className="border-b border-gray-100">{row.map((cell, j) => <td key={j} className="py-2.5 pr-3 text-sm text-gray-500">{cell}</td>)}</tr>)}</tbody></table></div>;
      case 'script': return <div key={idx} className="bg-triage-green-light border border-triage-green-dark/25 rounded-xl p-3.5 mb-3"><div className="text-triage-green-text font-bold text-sm mb-1.5">📢 {block.title}</div><p className="text-gray-500 text-sm italic">"{block.text}"</p></div>;
      case 'checklist': return <div key={idx} className="mb-3">{block.title && <div className={`${c.text} font-bold text-sm mb-2`}>{block.title}</div>}<div className="space-y-1.5">{block.items.map((item, i) => <div key={i} className="flex items-center gap-2 text-sm text-gray-500"><div className="w-4 h-4 rounded border border-triage-green/40 bg-triage-green-light flex items-center justify-center flex-shrink-0"><Check size={10} className="text-triage-green-text" /></div>{item}</div>)}</div></div>;
      case 'do-dont': return <div key={idx} className="space-y-2 mb-3">{block.donts.map((d, i) => <div key={i} className="grid grid-cols-2 gap-2 text-sm"><div className="bg-triage-red-light border border-triage-red-dark/25 rounded-lg p-2.5"><span className="text-triage-red-text font-semibold">✗ </span><span className="text-gray-500">{d.bad}</span></div>{d.good && <div className="bg-triage-green-light border border-triage-green-dark/25 rounded-lg p-2.5"><span className="text-triage-green-text font-semibold">✓ </span><span className="text-gray-500">{d.good}</span></div>}</div>)}</div>;
      case 'two-column': return <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">{[block.left, block.right].filter(Boolean).map((col, ci) => <div key={ci} className="bg-triage-blue-light border border-triage-blue-dark/20 rounded-xl p-3.5"><div className="text-triage-blue-text font-bold text-sm mb-2">{col.title}</div>{col.link && <a href={col.link} target="_blank" rel="noopener noreferrer" className="text-triage-blue-text text-sm underline mb-2 block">{col.link}</a>}<div className="space-y-1">{col.items.map((item, i) => <div key={i} className="flex items-start gap-2 text-sm text-gray-500"><span className="text-triage-blue-text mt-0.5">•</span>{item}</div>)}</div></div>)}</div>;
      case 'conditions': return <div key={idx} className="mb-3">{block.title && <div className="text-triage-green-text font-bold text-sm mb-2">{block.title}</div>}<div className="flex flex-wrap gap-2">{block.items.map((item, i) => <div key={i} className="bg-triage-green-light border border-triage-green-dark/25 rounded-lg px-3 py-1.5 text-sm"><span className="text-gray-600 font-medium">{item.name}</span><span className="text-gray-400 ml-1.5">{item.age}</span></div>)}</div></div>;
      case 'red-flags-table': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-triage-red-light border border-triage-red-dark/20 rounded-xl p-3 flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-triage-red-dark mt-1.5 flex-shrink-0" /><div>{item.system && <div className="text-triage-red-dark/70 font-bold text-sm uppercase tracking-wider mb-0.5">{item.system}</div>}<div className="text-gray-600 text-sm">{item.symptom}</div><div className="text-triage-red-text font-bold text-sm mt-1">→ {item.action}</div></div></div>)}</div>;
      case 'amber-table': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-triage-amber-light border border-triage-amber-dark/20 rounded-xl p-3"><div className="flex items-center gap-2 mb-1"><span className="text-triage-amber-text font-bold text-sm">{item.category}</span>{item.notes && <span className="text-triage-amber-dark/60 text-sm font-medium">{item.notes}</span>}</div><div className="text-gray-500 text-sm mb-1.5">{item.buzzwords}</div><div className="text-triage-amber-text text-sm font-medium">→ {item.action}</div></div>)}</div>;
      case 'risk-groups': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-triage-amber-light border border-triage-amber-dark/20 rounded-xl p-3"><div className="text-gray-700 font-semibold text-sm mb-1">{item.group}</div><div className="text-gray-500 text-sm">{item.action}</div></div>)}</div>;
      case 'subsection': return <div key={idx} className="mb-4"><h4 className="text-triage-blue-text font-bold text-sm mb-2">{block.title}</h4>{block.content.map((sub, si) => renderBlock(sub, `${idx}-${si}`))}</div>;
      case 'contact': return <div key={idx} className="flex items-center justify-between bg-triage-blue-light border border-triage-blue-dark/20 rounded-lg p-2.5 mb-2"><div><div className="text-gray-600 text-sm font-medium">{block.service}</div>{block.hours && <div className="text-gray-400 text-sm">{block.hours}</div>}</div><a href={`tel:${block.number.replace(/\s/g, '')}`} className="text-triage-blue-text font-bold text-sm">{block.number}</a></div>;
      case 'link': return <a key={idx} href={block.url} target="_blank" rel="noopener noreferrer" className="text-triage-blue-text text-sm underline mb-2 block flex items-center gap-1">{block.text} <ExternalLink size={12} /></a>;
      case 'decision-tree': return <div key={idx} className="mb-3">{block.title && <div className="text-gray-600 font-bold text-sm mb-2">{block.title}</div>}{block.items.map((item, i) => <div key={i} className="mb-3"><div className="text-triage-blue-text font-semibold text-sm mb-2">{item.question}</div><div className="space-y-2 pl-3 border-l-2 border-triage-blue-dark/30">{item.branches.map((branch, bi) => <div key={bi}><div className="text-triage-amber-text font-bold text-sm mb-1">{branch.label}</div><div className="space-y-1">{branch.steps.map((step, si) => <div key={si} className="text-gray-500 text-sm flex items-start gap-2"><span className="text-gray-300">→</span>{step}</div>)}</div></div>)}</div></div>)}</div>;
      case 'econsult-table': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-triage-teal-light border border-triage-teal-dark/20 rounded-xl p-3"><div className="text-triage-teal-text font-bold text-sm mb-1">{item.category}</div><div className="text-gray-500 text-sm mb-1.5"><span className="text-gray-400">OK:</span> {item.examples}</div><div className="text-triage-red-dark/80 text-sm"><span className="text-gray-400">Exclude:</span> {item.exclude}</div></div>)}</div>;
      case 'services': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-3"><div className="text-gray-700 font-semibold text-sm">{item.service}</div><div className="text-gray-400 text-sm mt-0.5">{item.bestFor}</div><div className="text-triage-blue-text text-sm mt-1">{item.access}</div></div>)}</div>;
      case 'providers': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-3"><div><div className="text-gray-700 font-semibold text-sm">{item.name}</div><div className="text-gray-400 text-sm">{item.locations}</div></div><a href={`tel:${item.number.replace(/\s/g, '')}`} className="text-triage-blue-text font-bold text-sm">{item.number}</a></div>)}</div>;
      case 'model-overview': return <div key={idx} className="overflow-x-auto mb-3"><table className="w-full text-sm"><thead><tr>{['Tier','Who','Scope','Escalates To'].map((h, i) => <th key={i} className="text-left text-gray-500 font-semibold pb-2 pr-3 text-sm border-b border-gray-200">{h}</th>)}</tr></thead><tbody>{block.tiers.map((t, i) => <tr key={i} className="border-b border-gray-100"><td className="py-2.5 pr-3 text-sm font-bold text-triage-blue-text">{t.tier}</td><td className="py-2.5 pr-3 text-sm text-gray-500">{t.who}</td><td className="py-2.5 pr-3 text-sm text-gray-500">{t.scope}</td><td className="py-2.5 pr-3 text-sm text-gray-500">{t.escalatesTo}</td></tr>)}</tbody></table></div>;
      case 'pathway-grid': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-triage-blue-light border border-triage-blue-dark/20 rounded-xl p-3"><div className="flex items-center gap-2 mb-1"><span>{item.icon}</span><span className="text-gray-700 font-semibold text-sm">{item.pathway}</span></div><div className="text-gray-500 text-sm mb-1.5">{item.symptoms}</div><div className="text-triage-blue-text text-sm font-medium">→ {item.action}</div>{item.contact && <div className="text-gray-400 text-sm mt-0.5">{item.contact}</div>}</div>)}</div>;
      case 'contacts-table': return <div key={idx} className="space-y-1.5 mb-3">{block.items.map((item, i) => <div key={i} className="flex items-center justify-between bg-triage-blue-light border border-triage-blue-dark/20 rounded-lg p-2.5"><div><div className="text-gray-600 text-sm font-medium">{item.service}</div>{item.hours && <div className="text-gray-400 text-sm">{item.hours}</div>}</div><div className="text-triage-blue-text font-bold text-sm">{item.contact}</div></div>)}</div>;
      case 'training-table': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-triage-blue-light border border-triage-blue-dark/20 rounded-xl p-3"><div className="text-triage-blue-text font-bold text-sm mb-1">{item.tier}</div><div className="text-gray-500 text-sm">{item.requirements}</div></div>)}</div>;
      case 'version-history': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-triage-purple-light border border-triage-purple-dark/20 rounded-xl p-3"><div className="flex items-center gap-2 mb-1"><span className="text-triage-purple-text font-bold text-sm">{item.version}</span><span className="text-gray-400 text-sm">{item.date}</span><span className="text-gray-300 text-sm">{item.author}</span></div><div className="text-gray-500 text-sm">{item.changes}</div></div>)}</div>;
      default: return null;
    }
  };

  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <h1 className="text-lg font-semibold mb-1 flex items-center gap-2 text-gray-800"><BookOpen size={20} className="text-triage-purple-text" />Triage SOP</h1>
      <p className="text-gray-400 text-sm mb-3">{sopMeta.practices} · v{sopMeta.version} · {sopMeta.owner}</p>
      <SearchBar value={search} onChange={setSearch} placeholder="Search SOP..." />
      <div className="space-y-2">
        {filtered.map(s => (
          <div key={s.id}>
            <button onClick={() => setExpanded(expanded === s.id ? null : s.id)}
              className={`w-full text-left p-3.5 rounded-2xl transition-all border ${expanded === s.id ? 'bg-triage-purple-light border-triage-purple-dark/30' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <span className="text-lg">{s.icon}</span>
                <div className="flex-1"><span className="text-gray-400 text-sm font-mono mr-2">§{s.number}</span><span className="text-gray-800 font-bold text-sm">{s.title}</span></div>
                {expanded === s.id ? <ChevronUp size={16} className="text-triage-purple-text" /> : <ChevronDown size={16} className="text-gray-300" />}
              </div>
            </button>
            {expanded === s.id && <div className="mt-1 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 animate-fade-slide">{s.content.map((b, i) => renderBlock(b, i))}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

// ============ FLOWCHART VIEWER ============
const FlowchartScreen = () => {
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState(null);
  const filtered = flowchartSections.filter(s => {
    if (tierFilter !== null && s.tier !== undefined && s.tier !== tierFilter) return false;
    if (search.length >= 2) return JSON.stringify(s).toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const tierColors = {
    1: { bg: 'bg-triage-green-light', border: 'border-triage-green-dark/25', text: 'text-triage-green-text', label: 'Tier 1' },
    2: { bg: 'bg-triage-amber-light', border: 'border-triage-amber-dark/25', text: 'text-triage-amber-text', label: 'Tier 2' },
    3: { bg: 'bg-triage-purple-light', border: 'border-triage-purple-dark/30', text: 'text-triage-purple-text', label: 'Tier 3' },
  };

  const renderBlock = (block, idx) => {
    const c = C[block.color] || C.blue;
    switch (block.type) {
      case 'text': return <p key={idx} className="text-gray-600 text-sm leading-relaxed mb-3">{block.text}</p>;
      case 'highlight': return <div key={idx} className={`${c.bg} border ${c.border} rounded-xl p-3 mb-3 flex items-start gap-2`}><div className={`w-2 h-2 rounded-full ${c.dot} mt-1.5 flex-shrink-0`} /><span className={`${c.text} font-semibold text-sm`}>{block.text}</span></div>;
      case 'list': return <div key={idx} className="mb-3">{block.title && <div className={`${c.text} font-bold text-sm mb-2`}>{block.title}</div>}<div className="space-y-1.5">{block.items.map((item, i) => <div key={i} className="flex items-start gap-2.5 pl-1"><div className={`w-1.5 h-1.5 rounded-full ${c.dot} mt-2 flex-shrink-0 opacity-60`} /><span className="text-gray-500 text-sm">{item}</span></div>)}</div></div>;
      case 'checklist': return <div key={idx} className="mb-3">{block.title && <div className={`${c.text} font-bold text-sm mb-2`}>{block.title}</div>}<div className="space-y-1.5">{block.items.map((item, i) => <div key={i} className="flex items-center gap-2 text-sm text-gray-500"><div className="w-4 h-4 rounded border border-triage-green/40 bg-triage-green-light flex items-center justify-center flex-shrink-0"><Check size={10} className="text-triage-green-text" /></div>{item}</div>)}</div></div>;
      case 'subsection': return <div key={idx} className="mb-4"><h4 className="text-triage-blue-text font-bold text-sm mb-2">{block.title}</h4>{block.content.map((sub, si) => renderBlock(sub, `${idx}-${si}`))}</div>;
      case 'red-flags-table': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-triage-red-light border border-triage-red-dark/20 rounded-xl p-3 flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-triage-red-dark mt-1.5 flex-shrink-0" /><div>{item.system && <div className="text-triage-red-dark/70 font-bold text-sm uppercase tracking-wider mb-0.5">{item.system}</div>}<div className="text-gray-600 text-sm">{item.symptom}</div><div className="text-triage-red-text font-bold text-sm mt-1">{'\u2192'} {item.action}</div></div></div>)}</div>;
      case 'amber-table': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-triage-amber-light border border-triage-amber-dark/20 rounded-xl p-3"><div className="flex items-center gap-2 mb-1"><span className="text-triage-amber-text font-bold text-sm">{item.category}</span>{item.notes && <span className="text-triage-amber-dark/60 text-sm font-medium">{item.notes}</span>}</div><div className="text-gray-500 text-sm mb-1.5">{item.buzzwords}</div><div className="text-triage-amber-text text-sm font-medium">{'\u2192'} {item.action}</div></div>)}</div>;
      case 'risk-groups': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-triage-amber-light border border-triage-amber-dark/20 rounded-xl p-3"><div className="text-gray-700 font-semibold text-sm mb-1">{item.group}</div><div className="text-gray-500 text-sm">{item.action}</div></div>)}</div>;
      case 'model-overview': return <div key={idx} className="overflow-x-auto mb-3"><table className="w-full text-sm"><thead><tr>{['Tier','Who','Scope','Escalates To'].map((h, i) => <th key={i} className="text-left text-gray-500 font-semibold pb-2 pr-3 text-sm border-b border-gray-200">{h}</th>)}</tr></thead><tbody>{block.tiers.map((t, i) => <tr key={i} className="border-b border-gray-100"><td className="py-2.5 pr-3 text-sm font-bold text-triage-blue-text">{t.tier}</td><td className="py-2.5 pr-3 text-sm text-gray-500">{t.who}</td><td className="py-2.5 pr-3 text-sm text-gray-500">{t.scope}</td><td className="py-2.5 pr-3 text-sm text-gray-500">{t.escalatesTo}</td></tr>)}</tbody></table></div>;
      case 'pathway-grid': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-triage-blue-light border border-triage-blue-dark/20 rounded-xl p-3"><div className="flex items-center gap-2 mb-1"><span>{item.icon}</span><span className="text-gray-700 font-semibold text-sm">{item.pathway}</span></div><div className="text-gray-500 text-sm mb-1.5">{item.symptoms}</div><div className="text-triage-blue-text text-sm font-medium">{'\u2192'} {item.action}</div>{item.contact && <div className="text-gray-400 text-sm mt-0.5">{item.contact}</div>}</div>)}</div>;
      case 'contacts-table': return <div key={idx} className="space-y-1.5 mb-3">{block.items.map((item, i) => <div key={i} className="flex items-center justify-between bg-triage-blue-light border border-triage-blue-dark/20 rounded-lg p-2.5"><div><div className="text-gray-600 text-sm font-medium">{item.service}</div>{item.hours && <div className="text-gray-400 text-sm">{item.hours}</div>}</div><div className="text-triage-blue-text font-bold text-sm">{item.contact}</div></div>)}</div>;
      case 'training-table': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-triage-blue-light border border-triage-blue-dark/20 rounded-xl p-3"><div className="text-triage-blue-text font-bold text-sm mb-1">{item.tier}</div><div className="text-gray-500 text-sm">{item.requirements}</div></div>)}</div>;
      case 'conditions': return <div key={idx} className="mb-3">{block.title && <div className="text-triage-green-text font-bold text-sm mb-2">{block.title}</div>}<div className="flex flex-wrap gap-2">{block.items.map((item, i) => <div key={i} className="bg-triage-green-light border border-triage-green-dark/25 rounded-lg px-3 py-1.5 text-sm"><span className="text-gray-600 font-medium">{item.name}</span><span className="text-gray-400 ml-1.5">{item.age}</span></div>)}</div></div>;
      case 'flow-arrow': return <div key={idx} className="flex items-center justify-center gap-2 py-3 mb-3"><div className="h-px flex-1 bg-gradient-to-r from-transparent via-triage-blue-dark/30 to-transparent" /><div className="flex items-center gap-1.5 bg-triage-blue-light border border-triage-blue-dark/30 rounded-full px-4 py-1.5"><ArrowRight size={14} className="text-triage-blue-text" /><span className="text-triage-blue-text text-sm font-semibold">{block.text}</span></div><div className="h-px flex-1 bg-gradient-to-r from-transparent via-triage-blue-dark/30 to-transparent" /></div>;
      default: return null;
    }
  };

  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <h1 className="text-lg font-semibold mb-1 flex items-center gap-2 text-gray-800"><GitBranch size={20} className="text-triage-teal-text" />Triage Flowchart</h1>
      <p className="text-gray-400 text-sm mb-3">{flowchartMeta.practices} · v{flowchartMeta.version} · {flowchartMeta.owner}</p>
      <SearchBar value={search} onChange={setSearch} placeholder="Search flowchart..." />
      <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 -mx-1 px-1">
        <button onClick={() => setTierFilter(null)} className={`px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${tierFilter === null ? 'bg-triage-blue-light text-triage-blue-text border border-triage-blue-dark/25' : 'bg-gray-50 text-gray-400 border border-transparent'}`}>All</button>
        {[1, 2, 3].map(t => <button key={t} onClick={() => setTierFilter(tierFilter === t ? null : t)} className={`px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${tierFilter === t ? `${tierColors[t].bg} ${tierColors[t].text} border ${tierColors[t].border}` : 'bg-gray-50 text-gray-400 border border-transparent'}`}>{tierColors[t].label}</button>)}
      </div>
      <div className="space-y-2">
        {filtered.map(s => {
          const tc = s.tier ? tierColors[s.tier] : null;
          return (
            <div key={s.id}>
              <button onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                className={`w-full text-left p-3.5 rounded-2xl transition-all border ${expanded === s.id ? 'bg-triage-teal-light border-triage-teal-dark/30' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{s.icon}</span>
                  <div className="flex-1">
                    <span className="text-gray-400 text-sm font-mono mr-2">{s.number}</span>
                    <span className="text-gray-800 font-bold text-sm">{s.title}</span>
                    {tc && <span className={`ml-2 text-sm px-1.5 py-0.5 rounded ${tc.bg} ${tc.text} font-semibold`}>{tc.label}</span>}
                  </div>
                  {expanded === s.id ? <ChevronUp size={16} className="text-triage-teal-text" /> : <ChevronDown size={16} className="text-gray-300" />}
                </div>
              </button>
              {expanded === s.id && <div className="mt-1 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 animate-fade-slide">{s.content.map((b, i) => renderBlock(b, i))}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============ ADMIN CONSOLE ============
const AdminConsole = ({ onBack, data, toast }) => {
  const [tab, setTab] = useState('settings');
  const [settings, setS] = useState(getSettings());
  const [users, setU] = useState(getUsers());
  const [editContact, setEC] = useState(null);
  const [editScript, setES] = useState(null);
  const [auditLog] = useState(getAuditLog());
  const [showAddUser, setSAU] = useState(false);
  const [newUser, setNU] = useState({ username: '', password: '', name: '', role: 'staff' });
  const [userErr, setUE] = useState('');
  const tabs = [{ id: 'settings', label: 'Settings', icon: Settings },{ id: 'users', label: 'Users', icon: User },{ id: 'contacts', label: 'Contacts', icon: Phone },{ id: 'scripts', label: 'Scripts', icon: FileText },{ id: 'backup', label: 'Backup', icon: Download },{ id: 'audit', label: 'Audit', icon: History }];

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto">
      <BackButton onClick={onBack} />
      <h1 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800"><Settings size={20} className="text-triage-purple-text" />Admin</h1>
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-3 -mx-1 px-1">
        {tabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${tab === t.id ? 'bg-triage-purple-light text-triage-purple-text border border-triage-purple-dark/30' : 'bg-gray-50 text-gray-400 border border-transparent'}`}><t.icon size={14} />{t.label}</button>)}
      </div>

      {tab === 'settings' && (<div className="space-y-4"><Input label="Practice Name" value={settings.practiceName} onChange={v => setS({...settings, practiceName: v})} /><Input label="ICB Area" value={settings.icbArea} onChange={v => setS({...settings, icbArea: v})} /><Input label="Clinical Owner" value={settings.clinicalOwner} onChange={v => setS({...settings, clinicalOwner: v})} /><Input label="Review Date" type="date" value={settings.reviewDate} onChange={v => setS({...settings, reviewDate: v})} /><Input label="Session Timeout (min)" type="number" value={settings.sessionTimeoutMinutes} onChange={v => setS({...settings, sessionTimeoutMinutes: parseInt(v)})} /><Button onClick={() => { saveSettings(settings); toast('Settings saved'); }} color="green" full><Save size={18} />Save</Button></div>)}

      {tab === 'users' && (<div className="space-y-4">
        <Button onClick={() => setSAU(true)} color="blue"><Plus size={16} />Add User</Button>
        {showAddUser && <GlassCard color="blue"><Input label="Username" value={newUser.username} onChange={v => setNU({...newUser, username: v})} /><Input label="Name" value={newUser.name} onChange={v => setNU({...newUser, name: v})} /><Input label="Password" value={newUser.password} onChange={v => setNU({...newUser, password: v})} />{userErr && <div className="bg-triage-red-light text-triage-red-text px-3 py-2 rounded-xl mb-3 text-sm border border-triage-red-dark/20">{userErr}</div>}<div className="flex gap-2"><Button onClick={async () => { setUE(''); if (!newUser.username || !newUser.password || !newUser.name) { setUE('All fields required'); return; } const r = await addUser(newUser); if (r.success) { setU(getUsers()); setSAU(false); setNU({ username: '', password: '', name: '', role: 'staff' }); toast('User added'); } else { setUE(r.message); } }} color="green" size="sm"><Check size={14} />Add</Button><Button onClick={() => setSAU(false)} color="gray" size="sm">Cancel</Button></div></GlassCard>}
        {users.map((u, i) => <GlassCard key={u.id}><div className="flex items-center gap-2 mb-2"><User size={16} className="text-gray-400" /><span className="font-bold text-gray-800 text-sm">{u.name}</span><span className={`text-sm px-1.5 py-0.5 rounded font-semibold ${u.role === 'admin' ? 'bg-triage-blue-light text-triage-blue-text' : 'bg-gray-100 text-gray-500'}`}>{u.role}</span></div><Input label="Username" value={u.username} onChange={v => setU(users.map((x, j) => j === i ? { ...x, username: v } : x))} /><Input label="Name" value={u.name} onChange={v => setU(users.map((x, j) => j === i ? { ...x, name: v } : x))} /></GlassCard>)}
        <Button onClick={async () => { await saveUsers(users); toast('Users saved'); }} color="green" full><Save size={16} />Save Users</Button>
      </div>)}

      {tab === 'contacts' && (<div className="space-y-3">{data.contacts.map((c, i) => <GlassCard key={c.id}>{editContact === i ? <div className="space-y-3"><Input label="Service" value={c.service} onChange={v => { const cc = [...data.contacts]; cc[i] = { ...cc[i], service: v }; data.update('contacts', cc); }} /><Input label="Number" value={c.number} onChange={v => { const cc = [...data.contacts]; cc[i] = { ...cc[i], number: v }; data.update('contacts', cc); }} /><Input label="Hours" value={c.hours} onChange={v => { const cc = [...data.contacts]; cc[i] = { ...cc[i], hours: v }; data.update('contacts', cc); }} /><Button onClick={() => setEC(null)} size="sm"><Check size={14} />Done</Button></div> : <div className="flex items-center justify-between"><div><div className="font-semibold text-gray-800 text-sm">{c.service}</div><div className="text-sm text-gray-400">{c.number}</div></div><button onClick={() => setEC(i)} className="text-triage-blue-text p-2 rounded-xl hover:bg-triage-blue-light"><Edit size={16} /></button></div>}</GlassCard>)}</div>)}

      {tab === 'scripts' && (<div className="space-y-4">{Object.entries(data.scripts).map(([key, s]) => <GlassCard key={key}><div className="font-semibold mb-2 text-gray-800 text-sm">{s.title}</div>{editScript === key ? <div><TextArea value={s.script} onChange={v => { data.update('scripts', { ...data.scripts, [key]: { ...data.scripts[key], script: v } }); toast('Script saved'); }} rows={4} /><Button onClick={() => setES(null)} size="sm"><Check size={14} />Done</Button></div> : <div><p className="text-sm text-gray-400 italic mb-2">"{s.script.substring(0, 100)}..."</p><button onClick={() => setES(key)} className="text-triage-blue-text text-sm flex items-center gap-1"><Edit size={14} />Edit</button></div>}</GlassCard>)}</div>)}

      {tab === 'backup' && (<div className="space-y-4"><GlassCard><h3 className="font-bold mb-2 text-gray-800 text-sm">Export</h3><Button onClick={() => { exportAllData(); toast('Backup downloaded'); }} color="blue" size="sm"><Download size={16} />Export</Button></GlassCard><GlassCard><h3 className="font-bold mb-2 text-gray-800 text-sm">Import</h3><label className="inline-flex items-center gap-2 px-4 py-2.5 bg-triage-blue-light text-triage-blue-text border border-triage-blue-dark/25 rounded-xl font-semibold cursor-pointer text-sm"><Upload size={16} />Import<input type="file" accept=".json" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => { const res = importAllData(ev.target.result); toast(res.message, res.success ? 'success' : 'error'); if (res.success) { setS(getSettings()); setU(getUsers()); } }; r.readAsText(f); } }} className="hidden" /></label></GlassCard><GlassCard color="red"><h3 className="font-bold mb-2 text-gray-800 text-sm">Reset</h3><Button onClick={() => { if (confirm('Reset ALL custom content?')) { data.reset(); toast('Reset complete'); } }} color="red" size="sm"><RefreshCw size={16} />Reset All</Button></GlassCard></div>)}

      {tab === 'audit' && (<div>{auditLog.length === 0 ? <p className="text-gray-400 text-center py-8">No activity</p> : <div className="space-y-1">{auditLog.slice(0, 50).map((l, i) => <div key={i} className="flex justify-between py-2 border-b border-gray-100 text-sm"><span className="text-gray-600">{l.action}</span><span className="text-gray-400 text-sm">{new Date(l.timestamp).toLocaleString('en-GB')}</span></div>)}</div>}</div>)}
    </div>
  );
};

// ============ NAV BAR ============
const NavBar = ({ screen, onNav, isAdminUser, currentTier, onTierChange, session }) => {
  const showTier2 = session && canAccessTier(session, 2);
  const items = [
    { id: 'home', icon: Zap, label: currentTier === 2 ? 'Tier 2' : 'Process' },
    { id: 'search', icon: Search, label: 'Lookup' },
    { id: 'contacts', icon: Phone, label: 'Contacts' },
    { id: 'sop', icon: BookOpen, label: 'SOP' },
    { id: 'flowchart', icon: GitBranch, label: 'Flowchart' },
    { id: isAdminUser ? 'admin' : 'training', icon: isAdminUser ? Settings : GraduationCap, label: isAdminUser ? 'Admin' : 'Training' }
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-100 z-40">
      {/* Tier toggle — only show if user can access Tier 2 */}
      {showTier2 && (
        <div className="flex justify-center gap-2 px-4 pt-2 pb-1">
          <button onClick={() => onTierChange(1)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${currentTier === 1 ? 'bg-triage-blue-light text-triage-blue-text border border-triage-blue-dark/20 shadow-sm' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-50'}`}>
            Tier 1 — Reception
          </button>
          <button onClick={() => onTierChange(2)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${currentTier === 2 ? 'bg-triage-purple-light text-triage-purple-text border border-triage-purple-dark/20 shadow-sm' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-50'}`}>
            Tier 2 — Triager
          </button>
        </div>
      )}
      <div className="flex justify-around py-2 px-2">
        {items.map(i => (
          <button key={i.id} onClick={() => onNav(i.id)}
            className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all ${screen === i.id ? 'text-triage-blue-text bg-triage-blue-light' : 'text-gray-400 hover:text-gray-500'}`}>
            <i.icon size={20} /><span className="text-sm mt-1 font-medium">{i.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

// ============ MAIN APP ============
export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('home');
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null);
  const [settings, setSettingsLocal] = useState(DEFAULT_SETTINGS);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentTier, setCurrentTier] = useState(1);
  const data = useTriageData();

  useEffect(() => {
    const init = async () => {
      await initializeUsers();
      const s = getSession(); setSession(s); setSettingsLocal(getSettings());
      try { setHistory(JSON.parse(localStorage.getItem('triage_history') || '[]')); } catch {}
      setLoading(false);
      if (s?.mustChangePassword) setShowPasswordChange(true);
    };
    init();
  }, []);

  useEffect(() => { if (history.length) localStorage.setItem('triage_history', JSON.stringify(history)); }, [history]);

  const record = action => {
    const entry = { action, time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) };
    setHistory(h => [entry, ...h.slice(0, 49)]);
    logAction(action, session?.userId);
  };

  const showToast = (msg, type = 'success') => setToast({ message: msg, type });
  const nav = s => { setScreen(s); window.scrollTo(0, 0); };
  const logout = () => { clearSession(); setSession(null); setScreen('home'); showToast('Logged out'); };
  const login = s => { setSession(s); setScreen('home'); if (s.mustChangePassword) setShowPasswordChange(true); };

  if (loading || !data.loaded) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F7F4' }}><RefreshCw size={40} className="animate-spin text-triage-blue-text" /></div>;
  if (!session) return <><LoginScreen onLogin={login} toast={showToast} />{toast && <Toast {...toast} onClose={() => setToast(null)} />}</>;

  const isAdminUser = isAdmin(session);

  const renderScreen = () => {
    switch (screen) {
      case 'home': return currentTier === 2
        ? <Tier2Workflow data={data} showToast={showToast} />
        : <DecisionFlow data={data} settings={settings} onRecord={record} showToast={showToast} />;
      case 'search': return <SearchScreen data={data} />;
      case 'contacts': return <ContactsScreen contacts={data.contacts} />;
      case 'sop': return <SOPScreen />;
      case 'flowchart': return <FlowchartScreen />;
      case 'training': return <TrainingScreen onBack={() => nav('home')} scenarios={data.training} />;
      case 'admin': return isAdminUser ? <AdminConsole onBack={() => nav('home')} data={data} toast={showToast} /> : <DecisionFlow data={data} settings={settings} onRecord={record} showToast={showToast} />;
      default: return currentTier === 2
        ? <Tier2Workflow data={data} showToast={showToast} />
        : <DecisionFlow data={data} settings={settings} onRecord={record} showToast={showToast} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#F8F7F4' }}>
      <EmergencyBanner />
      <UserBadge session={session} onLogout={logout} />
      {renderScreen()}
      <NavBar screen={screen} onNav={nav} isAdminUser={isAdminUser} currentTier={currentTier} onTierChange={(t) => { setCurrentTier(t); setScreen('home'); }} session={session} />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {showPasswordChange && (
        <PasswordChangeModal userId={session.userId} isFirstLogin={session.mustChangePassword}
          onComplete={() => { setShowPasswordChange(false); setSession({ ...session, mustChangePassword: false }); }}
          onCancel={() => { if (!session.mustChangePassword) setShowPasswordChange(false); }} toast={showToast} />
      )}
    </div>
  );
}
