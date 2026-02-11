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
  quickMatchPathways
} from '../lib/data';
import { sopMeta, sopSections } from '../lib/sop-content';
import { flowchartMeta, flowchartSections } from '../lib/flowchart-content';
import {
  getSession, clearSession, authenticateUser, isAdmin,
  getSettings, saveSettings, getCustomData, saveCustomData, clearCustomData,
  getUsers, saveUsers, exportAllData, importAllData, getAuditLog,
  DEFAULT_SETTINGS, logAction, changePassword, validatePassword,
  getSessionTimeRemaining, extendSession, isLockedOut, getLockoutRemaining,
  addUser
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
    const red = redFlags.filter(f => f.keywords.some(k => lower.includes(k.toLowerCase())));
    const amber = amberFlags.filter(f => f.keywords.some(k => lower.includes(k.toLowerCase())));
    const pharmacy = pharmacyFirst.filter(c => lower.includes(c.name.toLowerCase()));
    const risk = highRiskGroups.filter(g => {
      const terms = g.group.toLowerCase().split(/[\s/,]+/);
      return terms.some(t => t.length > 3 && lower.includes(t));
    });
    const changeWords = CHANGE_WORDS.filter(w => lower.includes(w));
    const hasChange = changeWords.length > 0;
    const matchedPathways = quickMatchPathways.filter(p => p.keywords.some(k => lower.includes(k.toLowerCase())));
    const CANCER_KEYWORDS = ['lump', 'unexplained weight loss', 'weight loss unexplained', 'unexplained bleeding', 'persistent bowel change', 'difficulty swallowing', 'hoarseness', 'postmenopausal bleeding', 'night sweats', 'blood in stool', 'blood in urine', 'mole changed', 'mole growing'];
    const cancer = CANCER_KEYWORDS.filter(k => lower.includes(k));
    return { red, amber, pharmacy, risk, changeWords, hasChange, pathways: matchedPathways, cancer, hasPathway: matchedPathways.length > 0, hasCancer: cancer.length > 0, hasAny: red.length + amber.length + pharmacy.length + risk.length + (hasChange ? 1 : 0) > 0 };
  }, [text, redFlags, amberFlags, pharmacyFirst, highRiskGroups]);
}

// ============ DESIGN TOKENS ============
const C = {
  red: { text: 'text-triage-red', bg: 'bg-[rgba(255,59,92,0.06)]', border: 'border-[rgba(255,59,92,0.2)]', glow: 'glow-red', dot: 'bg-triage-red', ring: 'ring-triage-red/30' },
  amber: { text: 'text-triage-amber', bg: 'bg-[rgba(255,159,28,0.06)]', border: 'border-[rgba(255,159,28,0.2)]', glow: 'glow-amber', dot: 'bg-triage-amber', ring: 'ring-triage-amber/30' },
  green: { text: 'text-triage-green', bg: 'bg-[rgba(34,197,94,0.06)]', border: 'border-[rgba(34,197,94,0.2)]', glow: 'glow-green', dot: 'bg-triage-green', ring: 'ring-triage-green/30' },
  blue: { text: 'text-triage-blue', bg: 'bg-[rgba(108,142,255,0.06)]', border: 'border-[rgba(108,142,255,0.2)]', glow: 'glow-blue', dot: 'bg-triage-blue', ring: 'ring-triage-blue/30' },
  teal: { text: 'text-triage-teal', bg: 'bg-[rgba(78,205,196,0.06)]', border: 'border-[rgba(78,205,196,0.2)]', glow: 'glow-teal', dot: 'bg-triage-teal', ring: 'ring-triage-teal/30' },
  violet: { text: 'text-triage-violet', bg: 'bg-[rgba(167,139,250,0.06)]', border: 'border-[rgba(167,139,250,0.2)]', glow: 'glow-violet', dot: 'bg-triage-violet', ring: 'ring-triage-violet/30' },
  gray: { text: 'text-[rgba(255,255,255,0.6)]', bg: 'bg-[rgba(255,255,255,0.03)]', border: 'border-[rgba(255,255,255,0.08)]', glow: '', dot: 'bg-[rgba(255,255,255,0.3)]', ring: '' },
};

// ============ CORE UI COMPONENTS ============
const EmergencyBanner = () => (
  <div className="emergency-banner text-white py-2 px-4 text-center font-bold sticky top-0 z-50 text-sm">
    <span className="animate-pulse mr-1">🚨</span>
    EMERGENCY → <a href="tel:999" className="underline ml-1 text-lg font-black">CALL 999</a>
    <span className="text-white/60 ml-2 text-xs hidden sm:inline">Chest pain · Can't breathe · Collapse · Stroke</span>
  </div>
);

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const styles = { success: 'bg-triage-green/90', error: 'bg-triage-red/90', info: 'bg-triage-blue/90' };
  return (
    <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 ${styles[type] || styles.info} text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-2 backdrop-blur-xl animate-toast`}>
      {type === 'success' ? <Check size={18} /> : type === 'error' ? <X size={18} /> : null}
      <span className="font-semibold text-sm">{message}</span>
    </div>
  );
};

const GlassCard = ({ children, color = 'gray', onClick, className = '', glow = false }) => {
  const c = C[color] || C.gray;
  return (
    <div onClick={onClick} className={`${c.bg} border ${c.border} rounded-2xl p-4 mb-3 transition-all duration-200 ${glow ? c.glow : ''} ${onClick ? 'cursor-pointer hover:bg-[rgba(255,255,255,0.05)] active:scale-[0.98]' : ''} ${className}`}>
      {children}
    </div>
  );
};

const Button = ({ children, color = 'blue', onClick, full = false, size = 'md', disabled = false, type = 'button' }) => {
  const styles = {
    blue: 'bg-triage-blue/20 hover:bg-triage-blue/30 text-triage-blue border-triage-blue/30',
    green: 'bg-triage-green/20 hover:bg-triage-green/30 text-triage-green border-triage-green/30',
    red: 'bg-triage-red/20 hover:bg-triage-red/30 text-triage-red border-triage-red/30',
    amber: 'bg-triage-amber/20 hover:bg-triage-amber/30 text-triage-amber border-triage-amber/30',
    gray: 'bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.7)] border-[rgba(255,255,255,0.1)]',
    solid: 'bg-triage-blue hover:bg-triage-blue/90 text-white border-transparent',
  };
  const sizes = { sm: 'px-3 py-2 text-sm', md: 'px-5 py-3', lg: 'px-6 py-4 text-lg' };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${styles[color]} border rounded-xl font-semibold ${sizes[size]} ${full ? 'w-full' : ''} transition-all disabled:opacity-40 active:scale-95 flex items-center justify-center gap-2`}>
      {children}
    </button>
  );
};

const Input = ({ label, type = 'text', value, onChange, placeholder, required, error, disabled }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-[rgba(255,255,255,0.6)] mb-1.5">{label}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} disabled={disabled}
      className={`w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border ${error ? 'border-triage-red/50' : 'border-[rgba(255,255,255,0.08)]'} focus:border-triage-blue/50 focus:outline-none focus:bg-[rgba(255,255,255,0.06)] text-white transition-all disabled:opacity-40`} />
    {error && <p className="text-triage-red text-sm mt-1">{error}</p>}
  </div>
);

const TextArea = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-[rgba(255,255,255,0.6)] mb-1.5">{label}</label>}
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] focus:border-triage-blue/50 focus:outline-none text-white resize-none transition-all" />
  </div>
);

const SearchBar = ({ value, onChange, placeholder }) => (
  <div className="relative mb-4">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)]" size={20} />
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] focus:border-triage-blue/40 focus:outline-none text-white text-lg transition-all" />
    {value && <button onClick={() => onChange('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)] hover:text-white"><X size={20} /></button>}
  </div>
);

const BackButton = ({ onClick }) => (
  <button onClick={onClick} className="flex items-center gap-1 text-triage-blue mb-4 py-2 hover:text-triage-blue/80 transition-colors font-medium text-sm">
    <ChevronLeft size={18} /> Back
  </button>
);

const CopyBtn = ({ text, label = 'Copy', onCopy }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); onCopy?.(); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={copy} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all mt-2 ${copied ? 'bg-triage-green/20 border-triage-green/40 text-triage-green' : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.06)]'}`}>
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
            <div className="font-semibold text-white">{service}</div>
            <div className="text-sm text-[rgba(255,255,255,0.4)]">{hours}</div>
            {address && <div className="text-xs text-[rgba(255,255,255,0.3)] mt-1">{address}</div>}
          </div>
        </div>
        <a href={`tel:${number.replace(/\s/g, '')}`} className={`flex items-center gap-2 font-bold text-lg ${c.text} hover:opacity-80`}>
          <Phone size={20} />{number}
        </a>
      </div>
      {website && (
        <button onClick={(e) => { e.stopPropagation(); window.open(website.startsWith('http') ? website : `https://${website}`, '_blank'); }}
          className="mt-3 flex items-center gap-2 text-sm px-3 py-2.5 bg-[rgba(255,255,255,0.04)] rounded-xl border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.08)] transition-colors w-full justify-center font-medium text-[rgba(255,255,255,0.6)]">
          <Globe size={16} />Visit Website<ExternalLink size={14} />
        </button>
      )}
    </GlassCard>
  );
};

// ============ AUTH COMPONENTS ============
const UserBadge = ({ session, onLogout }) => (
  <div className="flex items-center justify-between glass border-b border-[rgba(255,255,255,0.06)] px-4 py-2">
    <div className="flex items-center gap-2 text-sm">
      <div className="w-6 h-6 rounded-lg bg-triage-blue/20 flex items-center justify-center"><User size={12} className="text-triage-blue" /></div>
      <span className="text-[rgba(255,255,255,0.5)] font-medium text-xs">{session.name}</span>
      {session.role === 'admin' && <span className="bg-triage-blue/20 text-triage-blue text-[10px] px-1.5 py-0.5 rounded font-semibold">Admin</span>}
    </div>
    <button onClick={onLogout} className="flex items-center gap-1 text-[rgba(255,255,255,0.3)] hover:text-triage-red text-xs transition-colors"><LogOut size={12} />Logout</button>
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade">
      <div className="glass-elevated rounded-3xl shadow-2xl w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-triage-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-4"><Lock className="text-triage-blue" size={32} /></div>
          <h2 className="text-xl font-bold text-white">{isFirstLogin ? 'Set Your Password' : 'Change Password'}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          {!isFirstLogin && <Input label="Current Password" type={showPasswords ? 'text' : 'password'} value={currentPassword} onChange={setCurrentPassword} required />}
          <Input label="New Password" type={showPasswords ? 'text' : 'password'} value={newPassword} onChange={setNewPassword} required />
          <Input label="Confirm Password" type={showPasswords ? 'text' : 'password'} value={confirmPassword} onChange={setConfirmPassword} required />
          <div className="flex items-center gap-2 mb-4 text-sm text-[rgba(255,255,255,0.5)]">
            <input type="checkbox" checked={showPasswords} onChange={(e) => setShowPasswords(e.target.checked)} className="rounded accent-triage-blue" /><label>Show passwords</label>
          </div>
          {error && <div className="bg-triage-red/10 text-triage-red px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2 border border-triage-red/20"><AlertCircle size={18} />{error}</div>}
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
    if (isLockedOut()) { setError(`Account locked. Try again in ${getLockoutRemaining()} minutes.`); return; }
    setLoading(true);
    const r = await authenticateUser(username, password);
    setLoading(false);
    if (r.session) { toast(`Welcome, ${r.session.name}!`, 'success'); onLogin(r.session); }
    else { setError(r.error || 'Invalid credentials'); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0A0A0F 0%, #0F1A2E 50%, #0A0A0F 100%)' }}>
      <div className="glass-elevated rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-slide">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-triage-blue/30 to-triage-violet/20 flex items-center justify-center mx-auto mb-4 border border-triage-blue/20"><Shield className="text-triage-blue" size={40} /></div>
          <h1 className="text-2xl font-black text-white tracking-tight">Care Navigator</h1>
          <p className="text-[rgba(255,255,255,0.4)] mt-1 font-medium">{settings.practiceName}</p>
        </div>
        <form onSubmit={submit}>
          <Input label="Username" value={username} onChange={setUsername} placeholder="Enter username" required />
          <div className="mb-4">
            <label className="block text-sm font-medium text-[rgba(255,255,255,0.6)] mb-1.5">Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required
                className="w-full px-4 py-3 pr-12 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] focus:border-triage-blue/50 focus:outline-none text-white transition-all" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)]">{showPw ? <EyeOff size={20} /> : <Eye size={20} />}</button>
            </div>
          </div>
          {error && <div className="bg-triage-red/10 text-triage-red px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2 border border-triage-red/20"><AlertCircle size={18} />{error}</div>}
          <Button type="submit" color="solid" full size="lg" disabled={loading}>{loading ? <><RefreshCw size={20} className="animate-spin" />Signing in...</> : <><Lock size={20} />Sign In</>}</Button>
        </form>
      </div>
    </div>
  );
};

// ============ FLOW STEP (ACCORDION) ============
const FlowStep = ({ num, color, title, subtitle, expanded, onToggle, badge, badgeColor, children, completed }) => {
  const c = C[color] || C.gray;
  const bc = C[badgeColor] || C[color] || C.gray;
  return (
    <div className={`mb-2 rounded-2xl border transition-all duration-200 ${completed ? 'opacity-50' : ''} ${expanded ? `${c.bg} ${c.border}` : 'bg-[rgba(255,255,255,0.015)] border-[rgba(255,255,255,0.05)]'}`}>
      <button onClick={onToggle} className="w-full text-left p-3 sm:p-4 flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${completed ? 'bg-triage-green/15 border border-triage-green/30 text-triage-green' : `${c.bg} border ${c.border} ${c.text}`}`}>
          {completed ? <Check size={16} /> : num}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-bold text-sm leading-tight ${expanded ? c.text : 'text-[rgba(255,255,255,0.7)]'}`}>{title}</div>
          {!expanded && <div className="text-[rgba(255,255,255,0.35)] text-xs mt-0.5 truncate">{subtitle}</div>}
        </div>
        {badge && !completed && (
          <span className={`${bc.bg} border ${bc.border} ${bc.text} px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${badgeColor === 'red' ? 'animate-pulse' : ''}`}>
            {badge}
          </span>
        )}
        {expanded ? <ChevronUp size={16} className={c.text} /> : <ChevronDown size={16} className="text-[rgba(255,255,255,0.2)]" />}
      </button>
      {expanded && <div className="px-3 sm:px-4 pb-4 pt-1 border-t border-[rgba(255,255,255,0.04)] animate-fade-slide">{children}</div>}
    </div>
  );
};

// Outcome action button used inside steps
const OutcomeBtn = ({ label, color = 'blue', icon, onClick }) => {
  const c = C[color] || C.blue;
  return (
    <button onClick={onClick} className={`w-full ${c.bg} border ${c.border} ${c.text} rounded-xl py-2.5 px-3 text-center font-semibold text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all`}>
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

  const scanResults = useKeywordScanner(scanText, data.redFlags, data.amberFlags, data.pharmacyFirst, data.highRiskGroups);

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
    if (nextStep <= 8) {
      setExpandedStep(nextStep);
    }
  };

  const resetFlow = () => {
    setScanText(''); setExpandedStep(null); setOutcome(null); 
    setCompletedSteps(new Set()); setExpandedBooking(null);
    setExpandedPathway(null); setSelfCareChecks(new Array(7).fill(false));
    setEmisChecks(new Array(5).fill(false)); setEmisFindings('');
    window.scrollTo(0, 0);
  };

  const allSelfCareChecked = selfCareChecks.every(Boolean);

  return (
    <div className="p-3 sm:p-4 pb-36 max-w-lg mx-auto">
      {/* ---- HEADER ---- */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-lg font-black text-white tracking-tight">Process ANIMA Request</h1>
          <p className="text-[10px] text-[rgba(255,255,255,0.3)] mt-0.5">
            {settings.practiceName} · SOP v1.0 · Work through steps in order ↓
          </p>
        </div>
        {(outcome || completedSteps.size > 0) && (
          <button onClick={resetFlow} className="flex items-center gap-1.5 px-3 py-2 bg-triage-blue/20 border border-triage-blue/30 rounded-xl text-triage-blue text-xs font-bold hover:bg-triage-blue/30 transition-all">
            <RotateCcw size={14} />New
          </button>
        )}
      </div>

      {/* ---- KEYWORD SCANNER ---- */}
      <div className="mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-[rgba(255,255,255,0.25)]" size={16} />
          <textarea value={scanText} onChange={e => setScanText(e.target.value)}
            placeholder="Paste patient's words from ANIMA here to scan for flags..."
            rows={2} className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] focus:border-triage-blue/40 focus:outline-none text-white text-sm resize-none leading-relaxed" />
          {scanText && <button onClick={() => setScanText('')} className="absolute right-3 top-3 text-[rgba(255,255,255,0.25)] hover:text-white"><X size={16} /></button>}
        </div>
        {scanResults && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {scanResults.red.length > 0 && <button onClick={() => toggle(1)} className="bg-triage-red/15 border border-triage-red/30 text-triage-red px-2.5 py-1 rounded-full text-[11px] font-bold animate-pulse">🚨 {scanResults.red.length} RED FLAG{scanResults.red.length > 1 ? 'S' : ''}</button>}
            {scanResults.risk.length > 0 && <button onClick={() => toggle(4)} className="bg-triage-amber/15 border border-triage-amber/30 text-triage-amber px-2.5 py-1 rounded-full text-[11px] font-bold">🛡️ HIGH RISK</button>}
            {scanResults.amber.length > 0 && <button onClick={() => toggle(5)} className="bg-triage-amber/15 border border-triage-amber/30 text-triage-amber px-2.5 py-1 rounded-full text-[11px] font-bold">⚠️ {scanResults.amber.length} AMBER</button>}
            {scanResults.pharmacy.length > 0 && <button onClick={() => toggle(7)} className="bg-triage-green/15 border border-triage-green/30 text-triage-green px-2.5 py-1 rounded-full text-[11px] font-bold">💊 Pharmacy</button>}
            {scanResults.hasChange && <button onClick={() => toggle(3)} className="bg-triage-teal/15 border border-triage-teal/30 text-triage-teal px-2.5 py-1 rounded-full text-[11px] font-bold">🔄 ONGOING?</button>}
            {!scanResults.hasAny && <span className="text-[rgba(255,255,255,0.25)] text-xs py-1">No keyword matches — work through steps below</span>}
          </div>
        )}
      </div>

      {/* ---- GOLDEN RULE ---- */}
      <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl px-3 py-2 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Info size={14} className="text-triage-blue flex-shrink-0" />
          <span className="text-[11px] text-[rgba(255,255,255,0.5)] font-bold">GOLDEN RULES</span>
        </div>
        <div className="text-[11px] text-[rgba(255,255,255,0.35)] leading-relaxed">
          Use patient's <strong className="text-[rgba(255,255,255,0.55)]">exact words</strong> · 
          Check <strong className="text-[rgba(255,255,255,0.55)]">EMIS first</strong> · 
          You do <strong className="text-triage-red">NOT diagnose</strong> or decide urgency · 
          Do <strong className="text-triage-red">NOT ask clinical questions</strong> · 
          If unsure → <strong className="text-triage-blue">ask a clinician</strong>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          STEP 1: RED FLAGS
          ═══════════════════════════════════════════════════ */}
      <FlowStep num={1} color="red" title="🚨 EMERGENCY RED FLAGS?" subtitle="Life-threatening → Call 999 / A&E"
        expanded={expandedStep === 1} onToggle={() => toggle(1)} completed={completedSteps.has(1)}
        badge={scanResults?.red.length > 0 ? `${scanResults.red.length} MATCH` : null} badgeColor="red">
        
        {scanResults?.red.length > 0 && (
          <div className="mb-3 bg-triage-red/10 border border-triage-red/25 rounded-xl p-3">
            <div className="text-triage-red font-bold text-xs mb-1.5">⚡ MATCHED IN PATIENT'S WORDS:</div>
            {scanResults.red.map(f => <div key={f.id} className="text-white text-sm mb-1 flex items-start gap-2"><span className="text-triage-red mt-0.5">•</span>{f.description}</div>)}
          </div>
        )}
        <div className="text-[rgba(255,255,255,0.4)] text-xs mb-2 font-semibold">STOP if patient mentions ANY:</div>
        <div className="space-y-1.5 mb-4 max-h-48 overflow-y-auto pr-1">
          {data.redFlags.map(f => (
            <div key={f.id} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-triage-red mt-1.5 flex-shrink-0" />
              <span className="text-[rgba(255,255,255,0.55)] text-xs leading-relaxed">{f.description}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mb-2">
          <a href="tel:999" className="flex-1 bg-triage-red/20 border border-triage-red/30 text-triage-red rounded-xl py-3 text-center font-bold text-sm active:scale-95 transition-transform flex items-center justify-center gap-2">
            <Phone size={16} />CALL 999
          </a>
          <button onClick={() => selectOutcome('→ 999 / A&E / Duty clinician alerted', 'red')} className="flex-1 bg-triage-red/10 border border-triage-red/20 text-triage-red rounded-xl py-3 text-center font-semibold text-xs">
            A&E + Alert Duty
          </button>
        </div>
        <div className="text-[rgba(255,255,255,0.3)] text-[10px] text-center mb-3">On-site ambulance: 020 3162 7525 · Crisis: 0800 028 8000</div>
        <button onClick={() => advanceToNext(1)} className="w-full text-center text-xs text-[rgba(255,255,255,0.4)] hover:text-triage-blue py-2 border-t border-[rgba(255,255,255,0.04)]">
          No red flags → Continue to Step 2 ↓
        </button>
      </FlowStep>

      {/* ═══════════════════════════════════════════════════
          STEP 2: CHECK EMIS
          ═══════════════════════════════════════════════════ */}
      <FlowStep num={2} color="blue" title="✅ CHECK EMIS (mandatory)" subtitle="Look for plans, alerts, flags, letters, results"
        expanded={expandedStep === 2} onToggle={() => toggle(2)} completed={completedSteps.has(2)}>
        
        <div className="bg-triage-red/5 border border-triage-red/15 rounded-xl p-2.5 mb-3">
          <div className="text-triage-red text-[11px] font-semibold">⛔ Do NOT skip this step. Do NOT interpret results or tell the patient a diagnosis.</div>
        </div>

        <div className="bg-triage-blue/6 border border-triage-blue/15 rounded-xl p-3 mb-3">
          <div className="text-triage-blue font-bold text-xs mb-2">CONFIRM YOU CHECKED:</div>
          {[
            'Recent consultation notes — is there a follow-up plan?',
            'Recall alerts — bloods, annual review, smear, vaccines due?',
            'High-risk flags — pregnant, immunosuppressed, safeguarding, LD, <1yr?',
            'Hospital letters / discharge summaries relevant to this request?',
            'Recent test results (note they exist — do NOT interpret)',
          ].map((t, i) => (
            <label key={i} className="flex items-center gap-2.5 py-1 cursor-pointer group">
              <div onClick={() => { const n = [...emisChecks]; n[i] = !n[i]; setEmisChecks(n); }}
                className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${emisChecks[i] ? 'bg-triage-blue/30 border-triage-blue/50' : 'border-[rgba(255,255,255,0.15)] group-hover:border-[rgba(255,255,255,0.25)]'}`}>
                {emisChecks[i] && <Check size={12} className="text-triage-blue" />}
              </div>
              <span className={`text-xs ${emisChecks[i] ? 'text-[rgba(255,255,255,0.7)]' : 'text-[rgba(255,255,255,0.4)]'}`}>{t}</span>
            </label>
          ))}
        </div>

        <div className="mb-3">
          <div className="text-[rgba(255,255,255,0.5)] text-xs font-bold mb-1.5">📝 KEY EMIS FINDINGS (brief note):</div>
          <textarea value={emisFindings} onChange={e => setEmisFindings(e.target.value)}
            placeholder="e.g. 'Diabetes recall due. Last seen GP 3 weeks ago re: back pain. No alerts.'"
            rows={2} className="w-full px-3 py-2 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] focus:border-triage-blue/40 focus:outline-none text-white text-xs resize-none" />
          <div className="text-[rgba(255,255,255,0.25)] text-[10px] mt-1">This will be included if you forward to GP Triager</div>
        </div>

        <button onClick={() => advanceToNext(2)} 
          disabled={!emisChecks.some(Boolean)}
          className={`w-full rounded-xl py-2.5 text-center font-semibold text-xs flex items-center justify-center gap-2 transition-all ${emisChecks.some(Boolean) ? 'bg-triage-blue/15 border border-triage-blue/25 text-triage-blue' : 'bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.2)] cursor-not-allowed'}`}>
          <Check size={14} />EMIS Checked → Continue to Step 3
        </button>
      </FlowStep>

      {/* ═══════════════════════════════════════════════════
          STEP 3: NEW OR ONGOING?  (CRUCIAL NEW STEP)
          ═══════════════════════════════════════════════════ */}
      <FlowStep num={3} color="teal" title="🔄 NEW problem or ONGOING?" subtitle="Has a GP already reviewed THIS specific issue?"
        expanded={expandedStep === 3} onToggle={() => toggle(3)} completed={completedSteps.has(3)}
        badge={scanResults?.hasChange ? 'CHANGE?' : null} badgeColor="amber">
        
        <div className="text-[rgba(255,255,255,0.5)] text-xs mb-2">
          Based on EMIS: <strong className="text-[rgba(255,255,255,0.7)]">has a clinician already reviewed THIS specific problem?</strong>
        </div>
        
        <div className="bg-triage-red/5 border border-triage-red/15 rounded-xl p-2.5 mb-3">
          <div className="text-triage-red text-[11px] font-semibold">⛔ Do NOT book a new GP appointment for a NEW problem without going through the GP Triager.</div>
        </div>

        {scanResults?.hasChange && (
          <div className="mb-3 bg-triage-amber/10 border border-triage-amber/25 rounded-xl p-3">
            <div className="text-triage-amber font-bold text-xs mb-1">⚡ CHANGE WORDS DETECTED:</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {scanResults.changeWords.map((w, i) => <span key={i} className="bg-triage-amber/20 px-2 py-0.5 rounded text-[11px] text-triage-amber font-medium">"{w}"</span>)}
            </div>
            <div className="text-[rgba(255,255,255,0.45)] text-[11px] mt-1.5">Patient may be describing a worsening or recurring issue — check EMIS carefully.</div>
          </div>
        )}

        {/* Option A: ONGOING + plan exists → Direct book */}
        <div className="bg-triage-teal/6 border border-triage-teal/15 rounded-xl p-3 mb-2">
          <div className="text-triage-teal font-bold text-xs mb-1">A) ONGOING — clear plan or due item in EMIS</div>
          <div className="text-[rgba(255,255,255,0.45)] text-xs mb-2">
            GP has reviewed this before. EMIS shows a clear follow-up plan, recall alert, or documented next step.
            Patient is <strong className="text-[rgba(255,255,255,0.6)]">not worse</strong> — just needs what was planned.
          </div>
          <div className="flex gap-2">
            <button onClick={() => { selectOutcome('→ Direct booked (ongoing — plan in EMIS)' + (emisFindings ? '. EMIS: ' + emisFindings : ''), 'teal'); }}
              className="flex-1 bg-triage-teal/15 border border-triage-teal/25 text-triage-teal rounded-lg py-2 text-[11px] font-semibold text-center">
              ✅ Follow plan / Direct book
            </button>
            <button onClick={() => { selectOutcome('→ Clinical admin/query → GP Triager via eConsult (ongoing)' + (emisFindings ? '. EMIS: ' + emisFindings : ''), 'blue'); }}
              className="flex-1 bg-triage-blue/15 border border-triage-blue/25 text-triage-blue rounded-lg py-2 text-[11px] font-semibold text-center">
              📨 Admin/query → eConsult
            </button>
          </div>
        </div>

        {/* Option B: ONGOING + worsened → check amber flags then GP Triager */}
        <div className="bg-triage-amber/6 border border-triage-amber/15 rounded-xl p-3 mb-2">
          <div className="text-triage-amber font-bold text-xs mb-1">B) ONGOING — but WORSENED or CHANGED</div>
          <div className="text-[rgba(255,255,255,0.45)] text-xs mb-1">
            Patient has been seen, but now says: <strong className="text-[rgba(255,255,255,0.6)]">"worse"</strong>, <strong className="text-[rgba(255,255,255,0.6)]">"not improving"</strong>, <strong className="text-[rgba(255,255,255,0.6)]">"different"</strong>, <strong className="text-[rgba(255,255,255,0.6)]">"come back"</strong>, or <strong className="text-[rgba(255,255,255,0.6)]">new symptoms on top</strong>.
          </div>
          <div className="text-[rgba(255,255,255,0.35)] text-[10px] mb-2 italic">
            Still check Steps 4 & 5 (high-risk / amber flags) before sending — worsened symptoms may now be urgent.
          </div>
          <button onClick={() => { markStepDone(3); setExpandedStep(4); }}
            className="w-full bg-triage-amber/15 border border-triage-amber/25 text-triage-amber rounded-lg py-2 text-[11px] font-semibold text-center">
            ⚠️ Worsened → Check Steps 4 & 5 first ↓
          </button>
        </div>

        {/* Option C: Planned/due item found (even if NEW request) */}
        <div className="bg-triage-green/6 border border-triage-green/15 rounded-xl p-3 mb-2">
          <div className="text-triage-green font-bold text-xs mb-1">C) PLANNED or DUE item found in EMIS</div>
          <div className="text-[rgba(255,255,255,0.45)] text-xs mb-2">
            Patient is asking for something EMIS shows is due: smear recall, annual review, bloods, vaccine, dressing change, postnatal check.
          </div>
          <button onClick={() => { setExpandedBooking('show-all'); }}
            className="w-full bg-triage-green/10 border border-triage-green/20 text-triage-green rounded-lg py-2 text-[11px] font-semibold text-center">
            📋 View direct booking reference ↓
          </button>
        </div>

        {/* Option D: NEW problem */}
        <div className="bg-triage-violet/6 border border-triage-violet/15 rounded-xl p-3 mb-2">
          <div className="text-triage-violet font-bold text-xs mb-1">D) NEW — not previously reviewed by a GP</div>
          <div className="text-[rgba(255,255,255,0.45)] text-xs mb-2">
            No record of this specific issue being assessed. Continue through Steps 4–8 to find the right pathway.
          </div>
          <button onClick={() => advanceToNext(3)}
            className="w-full bg-triage-violet/15 border border-triage-violet/25 text-triage-violet rounded-lg py-2 text-[11px] font-semibold text-center">
            NEW problem → Continue Step 4 ↓
          </button>
        </div>

        {/* Direct booking reference (expandable) */}
        {expandedBooking && (
          <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.06)] animate-fade-slide">
            <div className="text-[rgba(255,255,255,0.45)] text-xs font-bold mb-2">DIRECT BOOKING REFERENCE:</div>
            <div className="space-y-1.5">
              {data.directBooking.map(it => (
                <div key={it.id}>
                  <button onClick={() => setExpandedBooking(expandedBooking === it.id ? 'show-all' : it.id)}
                    className={`w-full text-left p-2 rounded-lg border text-xs transition-all ${expandedBooking === it.id ? 'bg-triage-teal/8 border-triage-teal/20' : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.1)]'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[rgba(255,255,255,0.7)] font-medium">{it.item}</span>
                      <ChevronRight size={14} className={`text-[rgba(255,255,255,0.2)] transition-transform ${expandedBooking === it.id ? 'rotate-90' : ''}`} />
                    </div>
                  </button>
                  {expandedBooking === it.id && (
                    <div className="ml-3 mt-1 mb-1 pl-3 border-l-2 border-triage-teal/20 text-xs space-y-1 animate-fade-slide">
                      <div className="text-[rgba(255,255,255,0.5)]"><strong className="text-[rgba(255,255,255,0.7)]">Check:</strong> {it.emis_check}</div>
                      <div className="text-[rgba(255,255,255,0.5)]"><strong className="text-[rgba(255,255,255,0.7)]">Book:</strong> {it.bookWith}</div>
                      <div className="text-triage-amber text-[11px] font-medium">⚠️ {it.warning}</div>
                      <button onClick={() => selectOutcome(`→ Direct booked: ${it.item}` + (emisFindings ? '. EMIS: ' + emisFindings : ''), 'teal')}
                        className="mt-1 bg-triage-teal/15 border border-triage-teal/25 text-triage-teal rounded-lg py-1.5 px-3 text-[11px] font-semibold">
                        ✅ Booked this
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </FlowStep>

      {/* ═══════════════════════════════════════════════════
          STEP 4: HIGH-RISK PATIENT?
          ═══════════════════════════════════════════════════ */}
      <FlowStep num={4} color="amber" title="🛡️ HIGH-RISK PATIENT?" subtitle="Check EMIS flags → lower threshold to escalate"
        expanded={expandedStep === 4} onToggle={() => toggle(4)} completed={completedSteps.has(4)}
        badge={scanResults?.risk.length > 0 ? 'FLAGGED' : null} badgeColor="amber">
        
        <div className="text-[rgba(255,255,255,0.4)] text-xs mb-2">
          If patient is in ANY of these groups → <strong className="text-triage-amber">send directly to GP Triager</strong> (do NOT use self-care/Pharmacy First):
        </div>
        <div className="space-y-1.5 mb-3">
          {data.highRiskGroups.map(g => (
            <div key={g.id} className={`flex items-start gap-2.5 p-2 rounded-xl border text-xs ${scanResults?.risk.some(r => r.id === g.id) ? 'bg-triage-amber/10 border-triage-amber/25' : 'bg-[rgba(255,255,255,0.015)] border-[rgba(255,255,255,0.04)]'}`}>
              <span className="text-lg flex-shrink-0">{g.icon}</span>
              <div>
                <div className="text-[rgba(255,255,255,0.75)] font-semibold">{g.group}</div>
                <div className="text-[rgba(255,255,255,0.4)] mt-0.5">{g.action}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => selectOutcome('→ GP Triager / Duty GP (high-risk patient)', 'amber')}
            className="flex-1 bg-triage-amber/15 border border-triage-amber/25 text-triage-amber rounded-xl py-2.5 text-center font-semibold text-xs">
            → GP Triager (High Risk)
          </button>
          <button onClick={() => advanceToNext(4)} className="flex-1 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.5)] rounded-xl py-2.5 text-center font-semibold text-xs hover:text-white">
            Not high risk → Step 5
          </button>
        </div>
      </FlowStep>

      {/* ═══════════════════════════════════════════════════
          STEP 5: AMBER FLAGS
          ═══════════════════════════════════════════════════ */}
      <FlowStep num={5} color="amber" title="⚠️ AMBER FLAGS — Urgent Same-Day?" subtitle="Worsening, severe, or new concerning symptoms"
        expanded={expandedStep === 5} onToggle={() => toggle(5)} completed={completedSteps.has(5)}
        badge={scanResults?.amber.length > 0 ? `${scanResults.amber.length} MATCH` : null} badgeColor="amber">
        
        {scanResults?.amber.length > 0 && (
          <div className="mb-3 bg-triage-amber/10 border border-triage-amber/25 rounded-xl p-3">
            <div className="text-triage-amber font-bold text-xs mb-1.5">⚡ MATCHED IN PATIENT'S WORDS:</div>
            {scanResults.amber.map(f => (
              <div key={f.id} className="text-white text-sm mb-1 flex items-start gap-2">
                <span className="text-triage-amber mt-0.5">•</span>
                <span><strong className="text-triage-amber">{f.category}:</strong> {f.keywords.slice(0, 4).join(', ')}</span>
              </div>
            ))}
          </div>
        )}
        <div className="space-y-1.5 mb-3 max-h-56 overflow-y-auto pr-1">
          {data.amberFlags.map(f => (
            <div key={f.id} className="bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.04)] rounded-xl p-2.5">
              <div className="text-triage-amber font-bold text-[11px] mb-1">{f.category}</div>
              <div className="flex flex-wrap gap-1">
                {f.keywords.map((k, i) => <span key={i} className="bg-[rgba(255,255,255,0.04)] px-1.5 py-0.5 rounded text-[10px] text-[rgba(255,255,255,0.45)]">{k}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => selectOutcome('→ Duty GP / GP Triager SAME-DAY (amber flag)', 'amber')}
            className="flex-1 bg-triage-amber/15 border border-triage-amber/25 text-triage-amber rounded-xl py-2.5 text-center font-semibold text-xs">
            → Same-Day GP Triager
          </button>
          <button onClick={() => advanceToNext(5)} className="flex-1 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.5)] rounded-xl py-2.5 text-center font-semibold text-xs hover:text-white">
            No amber flags → Step 6
          </button>
        </div>
      </FlowStep>

      {/* ═══════════════════════════════════════════════════
          STEP 6: SPECIFIC PATHWAYS
          ═══════════════════════════════════════════════════ */}
      <FlowStep num={6} color="blue" title="📋 SPECIFIC PATHWAY?" subtitle="Eye · Injury · Pregnancy · Sexual Health · Fit Note · Mental Health"
        expanded={expandedStep === 6} onToggle={() => toggle(6)} completed={completedSteps.has(6)}>
        
        <div className="text-[rgba(255,255,255,0.4)] text-xs mb-3">Does the request fit one of these? Tap to expand:</div>
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {[
            { key: 'eye', icon: '👁️', label: 'Eye' },
            { key: 'injury', icon: '🤕', label: 'Injury/Burn' },
            { key: 'pregnancy', icon: '🤰', label: 'Pregnancy' },
            { key: 'sexualHealth', icon: '❤️', label: 'Sexual Health' },
            { key: 'fitNote', icon: '📝', label: 'Fit Note' },
            { key: 'mentalHealth', icon: '🧠', label: 'Mental Health' },
          ].map(pw => (
            <button key={pw.key} onClick={() => setExpandedPathway(expandedPathway === pw.key ? null : pw.key)}
              className={`p-2.5 rounded-xl border text-center transition-all ${expandedPathway === pw.key ? 'bg-triage-blue/10 border-triage-blue/25' : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)]'}`}>
              <div className="text-xl mb-0.5">{pw.icon}</div>
              <div className="text-[10px] text-[rgba(255,255,255,0.6)] font-medium">{pw.label}</div>
            </button>
          ))}
        </div>

        {expandedPathway && data.pathways[expandedPathway] && (
          <div className="animate-fade-slide mb-3">
            <div className="text-triage-blue font-bold text-sm mb-2">{data.pathways[expandedPathway].icon} {data.pathways[expandedPathway].title}</div>
            {data.pathways[expandedPathway].routes.map((r, i) => {
              const pc = r.priority === 'red' ? 'red' : r.priority === 'amber' ? 'amber' : 'green';
              const pcc = C[pc];
              return (
                <div key={i} className={`${pcc.bg} border ${pcc.border} rounded-xl p-2.5 mb-1.5`}>
                  <div className="text-white text-xs font-semibold">{r.condition}</div>
                  {r.examples && <div className="text-[rgba(255,255,255,0.4)] text-[11px] mt-0.5">{r.examples}</div>}
                  <div className={`${pcc.text} text-[11px] font-semibold mt-1`}>→ {r.action}</div>
                  {r.link && <a href={`https://${r.link}`} target="_blank" rel="noopener noreferrer" className="text-triage-blue text-[11px] underline flex items-center gap-1 mt-0.5">{r.link} <ExternalLink size={10} /></a>}
                </div>
              );
            })}
            <button onClick={() => selectOutcome(`→ Signposted: ${data.pathways[expandedPathway].title}`, 'blue')}
              className="w-full bg-triage-blue/10 border border-triage-blue/20 text-triage-blue rounded-xl py-2 text-center font-semibold text-xs mt-2">
              ✅ Signposted to {data.pathways[expandedPathway].title}
            </button>
          </div>
        )}

        <button onClick={() => advanceToNext(6)} className="w-full text-center text-xs text-[rgba(255,255,255,0.4)] hover:text-triage-blue py-2 border-t border-[rgba(255,255,255,0.04)]">
          Doesn't fit a specific pathway → Step 7 ↓
        </button>
      </FlowStep>

      {/* ═══════════════════════════════════════════════════
          STEP 7: PHARMACY FIRST / SELF-CARE
          ═══════════════════════════════════════════════════ */}
      <FlowStep num={7} color="green" title="💊 PHARMACY FIRST / SELF-CARE?" subtitle="Minor, single, short-lived, patient agrees"
        expanded={expandedStep === 7} onToggle={() => toggle(7)} completed={completedSteps.has(7)}
        badge={scanResults?.pharmacy.length > 0 ? `${scanResults.pharmacy.length} MATCH` : null} badgeColor="green">
        
        {/* Eligibility checklist - GATE */}
        <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-3 mb-3">
          <div className="text-[rgba(255,255,255,0.5)] font-bold text-xs mb-1">✅ SAFETY GATE — use ONLY if ALL true:</div>
          <div className="text-[rgba(255,255,255,0.25)] text-[10px] mb-2 italic">This is not a clinical decision — it's a safety checklist to confirm basic eligibility</div>
          {[
            'Minor SINGLE symptom (not multiple problems)',
            'Short-lived (< 7 days) and NOT recurring or > 2 weeks',
            'NO red or amber flags identified in Steps 1 & 5',
            'NOT a high-risk patient from Step 4',
            'Patient does NOT say "severe", "worsening", or "worst ever"',
            "You can clearly match it to ONE self-care resource",
            'Patient agrees to self-care / pharmacy route',
          ].map((item, i) => (
            <label key={i} className="flex items-center gap-2.5 py-1 cursor-pointer group">
              <div onClick={() => { const n = [...selfCareChecks]; n[i] = !n[i]; setSelfCareChecks(n); }}
                className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${selfCareChecks[i] ? 'bg-triage-green/30 border-triage-green/50' : 'border-[rgba(255,255,255,0.15)] group-hover:border-[rgba(255,255,255,0.25)]'}`}>
                {selfCareChecks[i] && <Check size={12} className="text-triage-green" />}
              </div>
              <span className={`text-xs ${selfCareChecks[i] ? 'text-[rgba(255,255,255,0.7)]' : 'text-[rgba(255,255,255,0.4)]'}`}>{item}</span>
            </label>
          ))}
        </div>

        {allSelfCareChecked ? (
          <div className="animate-fade-slide">
            {/* Pharmacy First Conditions */}
            <div className="text-triage-green font-bold text-xs mb-2">PHARMACY FIRST (can prescribe incl. antibiotics):</div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {data.pharmacyFirst.map(c => (
                <span key={c.id} className={`bg-[rgba(34,197,94,0.06)] border border-[rgba(34,197,94,0.15)] px-2.5 py-1 rounded-lg text-xs text-[rgba(255,255,255,0.65)] ${scanResults?.pharmacy.some(p => p.id === c.id) ? 'ring-1 ring-triage-green/50 bg-triage-green/15' : ''}`}>
                  {c.icon} {c.name} <span className="text-[rgba(255,255,255,0.3)]">({c.ageRange})</span>
                </span>
              ))}
            </div>

            {/* Pharmacy script */}
            <div className="bg-triage-green/6 border border-triage-green/15 rounded-xl p-3 mb-3">
              <div className="text-triage-green font-bold text-[11px] mb-1">📢 SAY TO PATIENT:</div>
              <p className="text-[rgba(255,255,255,0.55)] text-xs italic leading-relaxed">"{data.scripts.pharmacyFirst.script}"</p>
              <CopyBtn text={data.scripts.pharmacyFirst.script} label="Copy Script" onCopy={() => onRecord('Copied Pharmacy First script')} />
            </div>

            {/* Self-Care */}
            <div className="text-[rgba(255,255,255,0.5)] font-bold text-xs mb-2">SELF-CARE RESOURCES:</div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-triage-blue/6 border border-triage-blue/15 rounded-xl p-2.5">
                <div className="text-white font-bold text-xs mb-0.5">Adults</div>
                <div className="text-[rgba(255,255,255,0.4)] text-[11px] mb-1">CalmCare A-Z Cards</div>
                <CopyBtn text={data.scripts.calmCare.script} label="Copy Script" onCopy={() => onRecord('Copied CalmCare script')} />
              </div>
              <div className="bg-triage-blue/6 border border-triage-blue/15 rounded-xl p-2.5">
                <div className="text-white font-bold text-xs mb-0.5">Children &lt;18</div>
                <a href="https://healthiertogether.nhs.uk" target="_blank" rel="noopener noreferrer" className="text-triage-blue text-[11px] underline">healthiertogether.nhs.uk ↗</a>
                <CopyBtn text={data.scripts.healthierTogether.script} label="Copy Script" onCopy={() => onRecord('Copied HT script')} />
              </div>
            </div>

            {/* DO / DON'T reminders */}
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-2.5 mb-3">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-triage-red/5 border border-triage-red/10 rounded-lg p-2">
                  <div className="text-triage-red font-bold mb-0.5">✗ Don't say:</div>
                  <div className="text-[rgba(255,255,255,0.4)]">"It's minor" / "You don't need a GP"</div>
                </div>
                <div className="bg-triage-green/5 border border-triage-green/10 rounded-lg p-2">
                  <div className="text-triage-green font-bold mb-0.5">✓ Do say:</div>
                  <div className="text-[rgba(255,255,255,0.4)]">"This is the quickest safe first step"</div>
                </div>
              </div>
            </div>

            {/* Safety Net */}
            <div className="bg-triage-amber/5 border border-triage-amber/12 rounded-xl p-2.5 mb-3">
              <div className="text-triage-amber font-bold text-[11px] mb-0.5">🛟 ALWAYS SAFETY NET:</div>
              <div className="text-[rgba(255,255,255,0.45)] text-[11px]">"If not improving, or you develop chest pain, severe breathlessness, collapse, confusion, or heavy bleeding — call 999. Otherwise contact us again and we'll escalate to the GP triager."</div>
              <CopyBtn text={data.scripts.safetyNet.script} label="Copy Safety Net" onCopy={() => onRecord('Copied safety net')} />
            </div>

            <div className="flex gap-2">
              <button onClick={() => selectOutcome('→ Pharmacy First referral', 'green')}
                className="flex-1 bg-triage-green/15 border border-triage-green/25 text-triage-green rounded-xl py-2.5 text-center font-semibold text-xs">
                💊 Pharmacy First
              </button>
              <button onClick={() => selectOutcome('→ Self-Care (CalmCare / Healthier Together)', 'green')}
                className="flex-1 bg-triage-green/15 border border-triage-green/25 text-triage-green rounded-xl py-2.5 text-center font-semibold text-xs">
                📋 Self-Care Sent
              </button>
            </div>
          </div>
        ) : (
          <div className="text-[rgba(255,255,255,0.3)] text-xs text-center py-2">
            Tick all boxes to unlock Pharmacy First / Self-Care options.
            <br /><span className="text-[rgba(255,255,255,0.2)]">If not all true → continue to Step 8 (GP Triager)</span>
          </div>
        )}

        <button onClick={() => advanceToNext(7)} className="w-full text-center text-xs text-[rgba(255,255,255,0.4)] hover:text-triage-blue py-2 border-t border-[rgba(255,255,255,0.04)] mt-2">
          Doesn't fit / patient declines → Step 8 ↓
        </button>
      </FlowStep>

      {/* ═══════════════════════════════════════════════════
          STEP 8: DEFAULT → GP TRIAGER
          ═══════════════════════════════════════════════════ */}
      <FlowStep num={8} color="violet" title="📨 DEFAULT → GP TRIAGER" subtitle="Anything else, unclear, multiple symptoms, or patient anxious"
        expanded={expandedStep === 8} onToggle={() => toggle(8)} completed={completedSteps.has(8)}>
        
        <div className="text-[rgba(255,255,255,0.4)] text-xs mb-3">Send to GP Triager if the request reaches this step, OR if ANY of these apply:</div>
        <div className="space-y-1 mb-3">
          {[
            'Can\'t confidently match to ONE pathway above',
            'Multiple symptoms or problems',
            'Patient says "severe", "worsening", "worst ever", "very worried"',
            'Symptoms > 2 weeks or not improving despite pharmacy/self-care',
            'New lump, night sweats, unexplained weight loss, unexplained bleeding',
            'Patient is anxious, distressed, or specifically requesting a GP',
            'Self-care / Pharmacy First declined by patient',
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-[rgba(255,255,255,0.55)]">
              <span className="text-triage-violet mt-0.5">•</span>{t}
            </div>
          ))}
        </div>

        <div className="bg-triage-violet/8 border border-triage-violet/15 rounded-xl p-3 mb-3">
          <div className="text-triage-violet font-bold text-xs mb-1.5">INCLUDE WITH YOUR TRIAGE MESSAGE:</div>
          <div className="space-y-1 text-[rgba(255,255,255,0.5)] text-xs">
            <div>✓ Patient's <strong className="text-[rgba(255,255,255,0.7)]">EXACT words</strong> (copy/paste from ANIMA)</div>
            <div>✓ <strong className="text-[rgba(255,255,255,0.7)]">EMIS findings</strong> — alerts, recent notes, risk flags</div>
            <div>✓ Whether this is <strong className="text-[rgba(255,255,255,0.7)]">NEW or ONGOING</strong> and any changes</div>
            <div>✓ Any <strong className="text-[rgba(255,255,255,0.7)]">red/amber keywords</strong> you spotted</div>
            <div>✓ <strong className="text-[rgba(255,255,255,0.7)]">Contact details</strong> and availability</div>
          </div>
        </div>

        <button onClick={() => selectOutcome('→ GP Triager (via eConsult / triage message)' + (emisFindings ? '. EMIS: ' + emisFindings : ''), 'violet')}
          className="w-full bg-triage-violet/15 border border-triage-violet/25 text-triage-violet rounded-xl py-2.5 text-center font-semibold text-xs flex items-center justify-center gap-2">
          📨 Send to GP Triager
        </button>

        {/* Build triage message helper */}
        <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.06)]">
          <div className="text-[rgba(255,255,255,0.4)] text-xs font-bold mb-1.5">📋 QUICK TRIAGE MESSAGE BUILDER:</div>
          <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-2.5">
            <div className="text-[rgba(255,255,255,0.5)] text-[11px] space-y-1 font-mono">
              {scanText && <div><span className="text-triage-violet">Patient says:</span> "{scanText.substring(0, 200)}{scanText.length > 200 ? '...' : ''}"</div>}
              {emisFindings && <div><span className="text-triage-blue">EMIS:</span> {emisFindings}</div>}
              {scanResults?.red.length > 0 && <div><span className="text-triage-red">Red flags:</span> {scanResults.red.map(r => r.id).join(', ')}</div>}
              {scanResults?.amber.length > 0 && <div><span className="text-triage-amber">Amber flags:</span> {scanResults.amber.map(a => a.category).join(', ')}</div>}
              {scanResults?.hasChange && <div><span className="text-triage-amber">Change words:</span> {scanResults.changeWords.join(', ')}</div>}
              {!scanText && !emisFindings && <div className="text-[rgba(255,255,255,0.25)] italic">Paste ANIMA text and add EMIS findings above to auto-build</div>}
            </div>
            {(scanText || emisFindings) && (
              <CopyBtn 
                text={`Patient says: "${scanText}"\n${emisFindings ? 'EMIS: ' + emisFindings + '\n' : ''}${scanResults?.red.length ? 'Red flags: ' + scanResults.red.map(r => r.id).join(', ') + '\n' : ''}${scanResults?.amber.length ? 'Amber flags: ' + scanResults.amber.map(a => a.category).join(', ') + '\n' : ''}${scanResults?.hasChange ? 'Change noted: ' + scanResults.changeWords.join(', ') : ''}`} 
                label="Copy Triage Message" 
                onCopy={() => showToast('Triage message copied')} 
              />
            )}
          </div>
        </div>
      </FlowStep>

      {/* ---- IF IN DOUBT BANNER ---- */}
      <div className="bg-[rgba(108,142,255,0.04)] border border-[rgba(108,142,255,0.12)] rounded-2xl p-4 text-center mt-2 mb-2">
        <div className="text-triage-blue font-black text-sm">⚠️ IF IN DOUBT → ASK A CLINICIAN</div>
        <div className="text-[rgba(255,255,255,0.3)] text-xs mt-1">GP Triager from 8am · Duty clinician on site</div>
      </div>

      {/* ---- OUTCOME BAR (sticky bottom) ---- */}
      {outcome && (
        <div className="fixed bottom-16 left-0 right-0 z-30 p-3">
          <div className={`max-w-lg mx-auto ${C[outcome.color]?.bg || C.blue.bg} border ${C[outcome.color]?.border || C.blue.border} rounded-2xl p-3 backdrop-blur-xl shadow-2xl`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <CheckCircle size={18} className={C[outcome.color]?.text || 'text-triage-blue'} />
                <div className="min-w-0">
                  <div className={`font-bold text-sm ${C[outcome.color]?.text || 'text-triage-blue'} truncate`}>{outcome.text}</div>
                  <div className="text-[rgba(255,255,255,0.3)] text-[10px]">{outcome.time} · Document in EMIS</div>
                </div>
              </div>
              <div className="flex gap-1.5 flex-shrink-0 ml-2">
                <CopyBtn text={`${outcome.time} - ${outcome.text}`} label="Copy" onCopy={() => showToast('Copied for EMIS')} />
                <button onClick={resetFlow} className="px-2.5 py-2 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.6)] text-xs font-semibold hover:bg-[rgba(255,255,255,0.1)]">
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
      <h1 className="text-lg font-black mb-3 flex items-center gap-2 text-white"><Search size={20} className="text-triage-blue" />Quick Lookup</h1>
      <SearchBar value={search} onChange={setSearch} placeholder="Type symptom or keyword..." />
      {search.length >= 2 && !results?.hasAny && <p className="text-center text-[rgba(255,255,255,0.3)] mt-8 text-sm">No matches. If unsure → GP Triager.</p>}
      {results?.red.length > 0 && (
        <div className="mb-4"><h2 className="font-bold text-triage-red mb-2 text-sm flex items-center gap-2"><AlertTriangle size={16} />RED FLAGS — Call 999</h2>
          {results.red.map(f => <GlassCard key={f.id} color="red" className="!p-3 !mb-2"><div className="text-[rgba(255,255,255,0.85)] text-sm">{f.description}</div><div className="text-triage-red font-bold text-xs mt-1">→ {f.action}</div></GlassCard>)}
        </div>
      )}
      {results?.amber.length > 0 && (
        <div className="mb-4"><h2 className="font-bold text-triage-amber mb-2 text-sm flex items-center gap-2"><AlertCircle size={16} />AMBER — Same-Day</h2>
          {results.amber.map(f => <GlassCard key={f.id} color="amber" className="!p-3 !mb-2"><div className="text-triage-amber font-bold text-xs">{f.category}</div><div className="flex flex-wrap gap-1 mt-1">{f.keywords.slice(0, 6).map((k, i) => <span key={i} className="bg-[rgba(255,255,255,0.04)] px-1.5 py-0.5 rounded text-[10px] text-[rgba(255,255,255,0.4)]">{k}</span>)}</div><div className="text-triage-amber text-xs font-medium mt-1.5">→ {f.action}</div></GlassCard>)}
        </div>
      )}
      {results?.pharmacy.length > 0 && (
        <div className="mb-4"><h2 className="font-bold text-triage-green mb-2 text-sm flex items-center gap-2"><Pill size={16} />Pharmacy First</h2>
          {results.pharmacy.map(c => <GlassCard key={c.id} color="green" className="!p-3 !mb-2"><span className="text-lg mr-2">{c.icon}</span><span className="font-bold text-white text-sm">{c.name}</span><span className="text-[rgba(255,255,255,0.3)] text-xs ml-2">({c.ageRange})</span></GlassCard>)}
        </div>
      )}
      {results?.risk.length > 0 && (
        <div className="mb-4"><h2 className="font-bold text-triage-amber mb-2 text-sm flex items-center gap-2"><Shield size={16} />High-Risk</h2>
          {results.risk.map(g => <GlassCard key={g.id} color="amber" className="!p-3 !mb-2"><div className="flex items-center gap-2"><span className="text-lg">{g.icon}</span><span className="text-white font-semibold text-sm">{g.group}</span></div><div className="text-[rgba(255,255,255,0.4)] text-xs mt-1">{g.action}</div></GlassCard>)}
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
      <h1 className="text-lg font-black mb-3 flex items-center gap-2 text-white"><Phone size={20} className="text-triage-blue" />Key Contacts</h1>
      <SearchBar value={search} onChange={setSearch} placeholder="Search contacts..." />
      {filtered.map(c => <div key={c.id}><PhoneLink {...c} /></div>)}
    </div>
  );
};

// ============ TRAINING SCREEN ============
const TrainingScreen = ({ onBack, scenarios }) => {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const sc = scenarios[idx];
  const check = id => { setAnswer(id); setShowResult(true); setScore(p => id === sc.correctAnswer ? { correct: p.correct + 1, total: p.total + 1 } : { ...p, total: p.total + 1 }); };
  const next = () => { if (idx < scenarios.length - 1) { setIdx(idx + 1); setAnswer(null); setShowResult(false); } };
  const restart = () => { setIdx(0); setAnswer(null); setShowResult(false); setScore({ correct: 0, total: 0 }); };
  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <BackButton onClick={onBack} />
      <h1 className="text-lg font-black mb-2 flex items-center gap-2 text-white"><GraduationCap size={20} className="text-triage-violet" />Training</h1>
      <div className="flex items-center justify-between mb-4 glass rounded-xl p-3 border border-[rgba(255,255,255,0.06)]">
        <span className="text-[rgba(255,255,255,0.5)] text-sm">{idx + 1}/{scenarios.length}</span>
        <span className="font-bold text-white text-sm">Score: {score.correct}/{score.total}</span>
      </div>
      <GlassCard color="blue"><div className="text-triage-blue font-bold mb-2 text-xs">📋 ANIMA REQUEST:</div><p className="text-[rgba(255,255,255,0.75)] text-sm leading-relaxed">{sc.scenario}</p></GlassCard>
      <div className="mt-3 space-y-2">
        {sc.options.map(o => {
          let style = 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)] hover:border-triage-blue/30';
          if (showResult) { if (o.id === sc.correctAnswer) style = 'bg-[rgba(34,197,94,0.08)] border-[rgba(34,197,94,0.3)]'; else if (o.id === answer) style = 'bg-[rgba(255,59,92,0.08)] border-[rgba(255,59,92,0.3)]'; else style = 'opacity-40'; }
          return <button key={o.id} onClick={() => !showResult && check(o.id)} disabled={showResult} className={`w-full p-3.5 rounded-xl border text-left text-sm text-[rgba(255,255,255,0.75)] transition-all ${style}`}>{o.text}</button>;
        })}
      </div>
      {showResult && (
        <><GlassCard color={answer === sc.correctAnswer ? 'green' : 'red'} className="mt-3">
          <div className="font-bold mb-1 text-white text-sm">{answer === sc.correctAnswer ? '✅ Correct!' : '❌ Not quite'}</div>
          <p className="text-sm text-[rgba(255,255,255,0.55)]">{sc.explanation}</p>
        </GlassCard>
        <div className="mt-3">{idx < scenarios.length - 1 ? <Button color="blue" full onClick={next}>Next →</Button> : <div className="text-center"><div className="text-xl font-black mb-3 text-white">{score.correct}/{score.total}</div><Button color="green" onClick={restart}>Restart</Button></div>}</div></>
      )}
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
      case 'text': return <p key={idx} className="text-[rgba(255,255,255,0.65)] text-sm leading-relaxed mb-3">{block.text}</p>;
      case 'highlight': return <div key={idx} className={`${c.bg} border ${c.border} rounded-xl p-3 mb-3 flex items-start gap-2`}><div className={`w-2 h-2 rounded-full ${c.dot} mt-1.5 flex-shrink-0`} /><span className={`${c.text} font-semibold text-sm`}>{block.text}</span></div>;
      case 'list': return <div key={idx} className="mb-3">{block.title && <div className={`${c.text} font-bold text-sm mb-2`}>{block.title}</div>}<div className="space-y-1.5">{block.items.map((item, i) => <div key={i} className="flex items-start gap-2.5 pl-1"><div className={`w-1.5 h-1.5 rounded-full ${c.dot} mt-2 flex-shrink-0 opacity-60`} /><span className="text-[rgba(255,255,255,0.6)] text-sm">{item}</span></div>)}</div></div>;
      case 'steps': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => { const ic = C[item.color] || C.gray; return <div key={i} className={`${ic.bg} border ${ic.border} rounded-xl p-3`}><div className="flex items-start gap-3">{item.step && <div className={`w-7 h-7 rounded-lg ${ic.bg} border ${ic.border} flex items-center justify-center flex-shrink-0 font-bold text-xs ${ic.text}`}>{item.step}</div>}<div className="flex-1"><div className={`${ic.text} font-bold text-sm`}>{item.label}</div>{item.detail && <div className="text-[rgba(255,255,255,0.4)] text-xs mt-0.5">{item.detail}</div>}<div className="text-[rgba(255,255,255,0.55)] text-xs mt-1">→ {item.action}</div></div></div></div>; })}</div>;
      case 'table': return <div key={idx} className="overflow-x-auto mb-3"><table className="w-full text-sm"><thead><tr>{block.headers.map((h, i) => <th key={i} className="text-left text-[rgba(255,255,255,0.5)] font-semibold pb-2 pr-3 text-xs border-b border-[rgba(255,255,255,0.06)]">{h}</th>)}</tr></thead><tbody>{block.rows.map((row, i) => <tr key={i} className="border-b border-[rgba(255,255,255,0.03)]">{row.map((cell, j) => <td key={j} className="py-2.5 pr-3 text-xs text-[rgba(255,255,255,0.6)]">{cell}</td>)}</tr>)}</tbody></table></div>;
      case 'script': return <div key={idx} className="bg-[rgba(34,197,94,0.04)] border border-[rgba(34,197,94,0.15)] rounded-xl p-3.5 mb-3"><div className="text-triage-green font-bold text-xs mb-1.5">📢 {block.title}</div><p className="text-[rgba(255,255,255,0.55)] text-sm italic">"{block.text}"</p></div>;
      case 'checklist': return <div key={idx} className="mb-3">{block.title && <div className={`${c.text} font-bold text-sm mb-2`}>{block.title}</div>}<div className="space-y-1.5">{block.items.map((item, i) => <div key={i} className="flex items-center gap-2 text-sm text-[rgba(255,255,255,0.6)]"><div className="w-4 h-4 rounded border border-triage-green/40 bg-triage-green/10 flex items-center justify-center flex-shrink-0"><Check size={10} className="text-triage-green" /></div>{item}</div>)}</div></div>;
      case 'do-dont': return <div key={idx} className="space-y-2 mb-3">{block.donts.map((d, i) => <div key={i} className="grid grid-cols-2 gap-2 text-xs"><div className="bg-[rgba(255,59,92,0.06)] border border-[rgba(255,59,92,0.15)] rounded-lg p-2.5"><span className="text-triage-red font-semibold">✗ </span><span className="text-[rgba(255,255,255,0.5)]">{d.bad}</span></div>{d.good && <div className="bg-[rgba(34,197,94,0.06)] border border-[rgba(34,197,94,0.15)] rounded-lg p-2.5"><span className="text-triage-green font-semibold">✓ </span><span className="text-[rgba(255,255,255,0.5)]">{d.good}</span></div>}</div>)}</div>;
      case 'two-column': return <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">{[block.left, block.right].filter(Boolean).map((col, ci) => <div key={ci} className="bg-[rgba(108,142,255,0.04)] border border-[rgba(108,142,255,0.12)] rounded-xl p-3.5"><div className="text-triage-blue font-bold text-sm mb-2">{col.title}</div>{col.link && <a href={col.link} target="_blank" rel="noopener noreferrer" className="text-triage-blue text-xs underline mb-2 block">{col.link}</a>}<div className="space-y-1">{col.items.map((item, i) => <div key={i} className="flex items-start gap-2 text-xs text-[rgba(255,255,255,0.55)]"><span className="text-triage-blue mt-0.5">•</span>{item}</div>)}</div></div>)}</div>;
      case 'conditions': return <div key={idx} className="mb-3">{block.title && <div className="text-triage-green font-bold text-sm mb-2">{block.title}</div>}<div className="flex flex-wrap gap-2">{block.items.map((item, i) => <div key={i} className="bg-[rgba(34,197,94,0.06)] border border-[rgba(34,197,94,0.15)] rounded-lg px-3 py-1.5 text-xs"><span className="text-[rgba(255,255,255,0.7)] font-medium">{item.name}</span><span className="text-[rgba(255,255,255,0.35)] ml-1.5">{item.age}</span></div>)}</div></div>;
      case 'red-flags-table': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-[rgba(255,59,92,0.04)] border border-[rgba(255,59,92,0.12)] rounded-xl p-3 flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-triage-red mt-1.5 flex-shrink-0" /><div>{item.system && <div className="text-triage-red/70 font-bold text-[10px] uppercase tracking-wider mb-0.5">{item.system}</div>}<div className="text-[rgba(255,255,255,0.7)] text-sm">{item.symptom}</div><div className="text-triage-red font-bold text-xs mt-1">→ {item.action}</div></div></div>)}</div>;
      case 'amber-table': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-[rgba(255,159,28,0.04)] border border-[rgba(255,159,28,0.12)] rounded-xl p-3"><div className="flex items-center gap-2 mb-1"><span className="text-triage-amber font-bold text-xs">{item.category}</span>{item.notes && <span className="text-[rgba(255,159,28,0.5)] text-[10px] font-medium">{item.notes}</span>}</div><div className="text-[rgba(255,255,255,0.55)] text-xs mb-1.5">{item.buzzwords}</div><div className="text-triage-amber text-xs font-medium">→ {item.action}</div></div>)}</div>;
      case 'risk-groups': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-[rgba(255,159,28,0.04)] border border-[rgba(255,159,28,0.12)] rounded-xl p-3"><div className="text-[rgba(255,255,255,0.8)] font-semibold text-sm mb-1">{item.group}</div><div className="text-[rgba(255,255,255,0.5)] text-xs">{item.action}</div></div>)}</div>;
      case 'subsection': return <div key={idx} className="mb-4"><h4 className="text-triage-blue font-bold text-sm mb-2">{block.title}</h4>{block.content.map((sub, si) => renderBlock(sub, `${idx}-${si}`))}</div>;
      case 'contact': return <div key={idx} className="flex items-center justify-between bg-[rgba(108,142,255,0.04)] border border-[rgba(108,142,255,0.12)] rounded-lg p-2.5 mb-2"><div><div className="text-[rgba(255,255,255,0.7)] text-sm font-medium">{block.service}</div>{block.hours && <div className="text-[rgba(255,255,255,0.35)] text-xs">{block.hours}</div>}</div><a href={`tel:${block.number.replace(/\s/g, '')}`} className="text-triage-blue font-bold text-sm">{block.number}</a></div>;
      case 'link': return <a key={idx} href={block.url} target="_blank" rel="noopener noreferrer" className="text-triage-blue text-sm underline mb-2 block flex items-center gap-1">{block.text} <ExternalLink size={12} /></a>;
      case 'decision-tree': return <div key={idx} className="mb-3">{block.title && <div className="text-[rgba(255,255,255,0.7)] font-bold text-sm mb-2">{block.title}</div>}{block.items.map((item, i) => <div key={i} className="mb-3"><div className="text-triage-blue font-semibold text-sm mb-2">{item.question}</div><div className="space-y-2 pl-3 border-l-2 border-[rgba(108,142,255,0.2)]">{item.branches.map((branch, bi) => <div key={bi}><div className="text-triage-amber font-bold text-xs mb-1">{branch.label}</div><div className="space-y-1">{branch.steps.map((step, si) => <div key={si} className="text-[rgba(255,255,255,0.5)] text-xs flex items-start gap-2"><span className="text-[rgba(255,255,255,0.2)]">→</span>{step}</div>)}</div></div>)}</div></div>)}</div>;
      case 'econsult-table': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-[rgba(78,205,196,0.04)] border border-[rgba(78,205,196,0.12)] rounded-xl p-3"><div className="text-triage-teal font-bold text-xs mb-1">{item.category}</div><div className="text-[rgba(255,255,255,0.55)] text-xs mb-1.5"><span className="text-[rgba(255,255,255,0.3)]">OK:</span> {item.examples}</div><div className="text-triage-red/80 text-xs"><span className="text-[rgba(255,255,255,0.3)]">Exclude:</span> {item.exclude}</div></div>)}</div>;
      case 'services': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-3"><div className="text-[rgba(255,255,255,0.85)] font-semibold text-sm">{item.service}</div><div className="text-[rgba(255,255,255,0.45)] text-xs mt-0.5">{item.bestFor}</div><div className="text-triage-blue text-xs mt-1">{item.access}</div></div>)}</div>;
      case 'providers': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="flex items-center justify-between bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-3"><div><div className="text-[rgba(255,255,255,0.8)] font-semibold text-sm">{item.name}</div><div className="text-[rgba(255,255,255,0.35)] text-xs">{item.locations}</div></div><a href={`tel:${item.number.replace(/\s/g, '')}`} className="text-triage-blue font-bold text-sm">{item.number}</a></div>)}</div>;
      case 'model-overview': return <div key={idx} className="overflow-x-auto mb-3"><table className="w-full text-sm"><thead><tr>{['Tier','Who','Scope','Escalates To'].map((h, i) => <th key={i} className="text-left text-[rgba(255,255,255,0.5)] font-semibold pb-2 pr-3 text-xs border-b border-[rgba(255,255,255,0.06)]">{h}</th>)}</tr></thead><tbody>{block.tiers.map((t, i) => <tr key={i} className="border-b border-[rgba(255,255,255,0.03)]"><td className="py-2.5 pr-3 text-xs font-bold text-triage-blue">{t.tier}</td><td className="py-2.5 pr-3 text-xs text-[rgba(255,255,255,0.6)]">{t.who}</td><td className="py-2.5 pr-3 text-xs text-[rgba(255,255,255,0.6)]">{t.scope}</td><td className="py-2.5 pr-3 text-xs text-[rgba(255,255,255,0.6)]">{t.escalatesTo}</td></tr>)}</tbody></table></div>;
      case 'pathway-grid': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-[rgba(108,142,255,0.04)] border border-[rgba(108,142,255,0.12)] rounded-xl p-3"><div className="flex items-center gap-2 mb-1"><span>{item.icon}</span><span className="text-[rgba(255,255,255,0.85)] font-semibold text-sm">{item.pathway}</span></div><div className="text-[rgba(255,255,255,0.5)] text-xs mb-1.5">{item.symptoms}</div><div className="text-triage-blue text-xs font-medium">→ {item.action}</div>{item.contact && <div className="text-[rgba(255,255,255,0.35)] text-xs mt-0.5">{item.contact}</div>}</div>)}</div>;
      case 'contacts-table': return <div key={idx} className="space-y-1.5 mb-3">{block.items.map((item, i) => <div key={i} className="flex items-center justify-between bg-[rgba(108,142,255,0.04)] border border-[rgba(108,142,255,0.12)] rounded-lg p-2.5"><div><div className="text-[rgba(255,255,255,0.7)] text-sm font-medium">{item.service}</div>{item.hours && <div className="text-[rgba(255,255,255,0.35)] text-xs">{item.hours}</div>}</div><div className="text-triage-blue font-bold text-sm">{item.contact}</div></div>)}</div>;
      case 'training-table': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-[rgba(108,142,255,0.04)] border border-[rgba(108,142,255,0.12)] rounded-xl p-3"><div className="text-triage-blue font-bold text-sm mb-1">{item.tier}</div><div className="text-[rgba(255,255,255,0.55)] text-xs">{item.requirements}</div></div>)}</div>;
      default: return null;
    }
  };

  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <h1 className="text-lg font-black mb-1 flex items-center gap-2 text-white"><BookOpen size={20} className="text-triage-violet" />Triage SOP</h1>
      <p className="text-[rgba(255,255,255,0.3)] text-xs mb-3">{sopMeta.practices} · v{sopMeta.version} · {sopMeta.owner}</p>
      <SearchBar value={search} onChange={setSearch} placeholder="Search SOP..." />
      <div className="space-y-2">
        {filtered.map(s => (
          <div key={s.id}>
            <button onClick={() => setExpanded(expanded === s.id ? null : s.id)}
              className={`w-full text-left p-3.5 rounded-2xl transition-all border ${expanded === s.id ? 'bg-[rgba(167,139,250,0.06)] border-[rgba(167,139,250,0.2)]' : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)]'}`}>
              <div className="flex items-center gap-3">
                <span className="text-lg">{s.icon}</span>
                <div className="flex-1"><span className="text-[rgba(255,255,255,0.3)] text-xs font-mono mr-2">§{s.number}</span><span className="text-white font-bold text-sm">{s.title}</span></div>
                {expanded === s.id ? <ChevronUp size={16} className="text-triage-violet" /> : <ChevronDown size={16} className="text-[rgba(255,255,255,0.25)]" />}
              </div>
            </button>
            {expanded === s.id && <div className="mt-1 p-4 rounded-2xl bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.04)] animate-fade-slide">{s.content.map((b, i) => renderBlock(b, i))}</div>}
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
    1: { bg: 'bg-triage-green/10', border: 'border-triage-green/30', text: 'text-triage-green', label: 'Tier 1' },
    2: { bg: 'bg-triage-amber/10', border: 'border-triage-amber/30', text: 'text-triage-amber', label: 'Tier 2' },
    3: { bg: 'bg-triage-violet/10', border: 'border-triage-violet/30', text: 'text-triage-violet', label: 'Tier 3' },
  };

  const renderBlock = (block, idx) => {
    const c = C[block.color] || C.blue;
    switch (block.type) {
      case 'text': return <p key={idx} className="text-[rgba(255,255,255,0.65)] text-sm leading-relaxed mb-3">{block.text}</p>;
      case 'highlight': return <div key={idx} className={`${c.bg} border ${c.border} rounded-xl p-3 mb-3 flex items-start gap-2`}><div className={`w-2 h-2 rounded-full ${c.dot} mt-1.5 flex-shrink-0`} /><span className={`${c.text} font-semibold text-sm`}>{block.text}</span></div>;
      case 'list': return <div key={idx} className="mb-3">{block.title && <div className={`${c.text} font-bold text-sm mb-2`}>{block.title}</div>}<div className="space-y-1.5">{block.items.map((item, i) => <div key={i} className="flex items-start gap-2.5 pl-1"><div className={`w-1.5 h-1.5 rounded-full ${c.dot} mt-2 flex-shrink-0 opacity-60`} /><span className="text-[rgba(255,255,255,0.6)] text-sm">{item}</span></div>)}</div></div>;
      case 'checklist': return <div key={idx} className="mb-3">{block.title && <div className={`${c.text} font-bold text-sm mb-2`}>{block.title}</div>}<div className="space-y-1.5">{block.items.map((item, i) => <div key={i} className="flex items-center gap-2 text-sm text-[rgba(255,255,255,0.6)]"><div className="w-4 h-4 rounded border border-triage-green/40 bg-triage-green/10 flex items-center justify-center flex-shrink-0"><Check size={10} className="text-triage-green" /></div>{item}</div>)}</div></div>;
      case 'subsection': return <div key={idx} className="mb-4"><h4 className="text-triage-blue font-bold text-sm mb-2">{block.title}</h4>{block.content.map((sub, si) => renderBlock(sub, `${idx}-${si}`))}</div>;
      case 'red-flags-table': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-[rgba(255,59,92,0.04)] border border-[rgba(255,59,92,0.12)] rounded-xl p-3 flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-triage-red mt-1.5 flex-shrink-0" /><div>{item.system && <div className="text-triage-red/70 font-bold text-[10px] uppercase tracking-wider mb-0.5">{item.system}</div>}<div className="text-[rgba(255,255,255,0.7)] text-sm">{item.symptom}</div><div className="text-triage-red font-bold text-xs mt-1">{'\u2192'} {item.action}</div></div></div>)}</div>;
      case 'amber-table': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-[rgba(255,159,28,0.04)] border border-[rgba(255,159,28,0.12)] rounded-xl p-3"><div className="flex items-center gap-2 mb-1"><span className="text-triage-amber font-bold text-xs">{item.category}</span>{item.notes && <span className="text-[rgba(255,159,28,0.5)] text-[10px] font-medium">{item.notes}</span>}</div><div className="text-[rgba(255,255,255,0.55)] text-xs mb-1.5">{item.buzzwords}</div><div className="text-triage-amber text-xs font-medium">{'\u2192'} {item.action}</div></div>)}</div>;
      case 'risk-groups': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-[rgba(255,159,28,0.04)] border border-[rgba(255,159,28,0.12)] rounded-xl p-3"><div className="text-[rgba(255,255,255,0.8)] font-semibold text-sm mb-1">{item.group}</div><div className="text-[rgba(255,255,255,0.5)] text-xs">{item.action}</div></div>)}</div>;
      case 'model-overview': return <div key={idx} className="overflow-x-auto mb-3"><table className="w-full text-sm"><thead><tr>{['Tier','Who','Scope','Escalates To'].map((h, i) => <th key={i} className="text-left text-[rgba(255,255,255,0.5)] font-semibold pb-2 pr-3 text-xs border-b border-[rgba(255,255,255,0.06)]">{h}</th>)}</tr></thead><tbody>{block.tiers.map((t, i) => <tr key={i} className="border-b border-[rgba(255,255,255,0.03)]"><td className="py-2.5 pr-3 text-xs font-bold text-triage-blue">{t.tier}</td><td className="py-2.5 pr-3 text-xs text-[rgba(255,255,255,0.6)]">{t.who}</td><td className="py-2.5 pr-3 text-xs text-[rgba(255,255,255,0.6)]">{t.scope}</td><td className="py-2.5 pr-3 text-xs text-[rgba(255,255,255,0.6)]">{t.escalatesTo}</td></tr>)}</tbody></table></div>;
      case 'pathway-grid': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-[rgba(108,142,255,0.04)] border border-[rgba(108,142,255,0.12)] rounded-xl p-3"><div className="flex items-center gap-2 mb-1"><span>{item.icon}</span><span className="text-[rgba(255,255,255,0.85)] font-semibold text-sm">{item.pathway}</span></div><div className="text-[rgba(255,255,255,0.5)] text-xs mb-1.5">{item.symptoms}</div><div className="text-triage-blue text-xs font-medium">{'\u2192'} {item.action}</div>{item.contact && <div className="text-[rgba(255,255,255,0.35)] text-xs mt-0.5">{item.contact}</div>}</div>)}</div>;
      case 'contacts-table': return <div key={idx} className="space-y-1.5 mb-3">{block.items.map((item, i) => <div key={i} className="flex items-center justify-between bg-[rgba(108,142,255,0.04)] border border-[rgba(108,142,255,0.12)] rounded-lg p-2.5"><div><div className="text-[rgba(255,255,255,0.7)] text-sm font-medium">{item.service}</div>{item.hours && <div className="text-[rgba(255,255,255,0.35)] text-xs">{item.hours}</div>}</div><div className="text-triage-blue font-bold text-sm">{item.contact}</div></div>)}</div>;
      case 'training-table': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-[rgba(108,142,255,0.04)] border border-[rgba(108,142,255,0.12)] rounded-xl p-3"><div className="text-triage-blue font-bold text-sm mb-1">{item.tier}</div><div className="text-[rgba(255,255,255,0.55)] text-xs">{item.requirements}</div></div>)}</div>;
      case 'conditions': return <div key={idx} className="mb-3">{block.title && <div className="text-triage-green font-bold text-sm mb-2">{block.title}</div>}<div className="flex flex-wrap gap-2">{block.items.map((item, i) => <div key={i} className="bg-[rgba(34,197,94,0.06)] border border-[rgba(34,197,94,0.15)] rounded-lg px-3 py-1.5 text-xs"><span className="text-[rgba(255,255,255,0.7)] font-medium">{item.name}</span><span className="text-[rgba(255,255,255,0.35)] ml-1.5">{item.age}</span></div>)}</div></div>;
      case 'flow-arrow': return <div key={idx} className="flex items-center justify-center gap-2 py-3 mb-3"><div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(108,142,255,0.3)] to-transparent" /><div className="flex items-center gap-1.5 bg-[rgba(108,142,255,0.08)] border border-[rgba(108,142,255,0.2)] rounded-full px-4 py-1.5"><ArrowRight size={14} className="text-triage-blue" /><span className="text-triage-blue text-xs font-semibold">{block.text}</span></div><div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(108,142,255,0.3)] to-transparent" /></div>;
      default: return null;
    }
  };

  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <h1 className="text-lg font-black mb-1 flex items-center gap-2 text-white"><GitBranch size={20} className="text-triage-teal" />Triage Flowchart</h1>
      <p className="text-[rgba(255,255,255,0.3)] text-xs mb-3">{flowchartMeta.practices} · v{flowchartMeta.version} · {flowchartMeta.owner}</p>
      <SearchBar value={search} onChange={setSearch} placeholder="Search flowchart..." />
      <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 -mx-1 px-1">
        <button onClick={() => setTierFilter(null)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${tierFilter === null ? 'bg-triage-blue/20 text-triage-blue border border-triage-blue/30' : 'bg-[rgba(255,255,255,0.03)] text-[rgba(255,255,255,0.4)] border border-transparent'}`}>All</button>
        {[1, 2, 3].map(t => <button key={t} onClick={() => setTierFilter(tierFilter === t ? null : t)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${tierFilter === t ? `${tierColors[t].bg} ${tierColors[t].text} border ${tierColors[t].border}` : 'bg-[rgba(255,255,255,0.03)] text-[rgba(255,255,255,0.4)] border border-transparent'}`}>{tierColors[t].label}</button>)}
      </div>
      <div className="space-y-2">
        {filtered.map(s => {
          const tc = s.tier ? tierColors[s.tier] : null;
          return (
            <div key={s.id}>
              <button onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                className={`w-full text-left p-3.5 rounded-2xl transition-all border ${expanded === s.id ? 'bg-[rgba(78,205,196,0.06)] border-[rgba(78,205,196,0.2)]' : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)]'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{s.icon}</span>
                  <div className="flex-1">
                    <span className="text-[rgba(255,255,255,0.3)] text-xs font-mono mr-2">{s.number}</span>
                    <span className="text-white font-bold text-sm">{s.title}</span>
                    {tc && <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${tc.bg} ${tc.text} font-semibold`}>{tc.label}</span>}
                  </div>
                  {expanded === s.id ? <ChevronUp size={16} className="text-triage-teal" /> : <ChevronDown size={16} className="text-[rgba(255,255,255,0.25)]" />}
                </div>
              </button>
              {expanded === s.id && <div className="mt-1 p-4 rounded-2xl bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.04)] animate-fade-slide">{s.content.map((b, i) => renderBlock(b, i))}</div>}
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
      <h1 className="text-lg font-black mb-2 flex items-center gap-2 text-white"><Settings size={20} className="text-triage-violet" />Admin</h1>
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-3 -mx-1 px-1">
        {tabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${tab === t.id ? 'bg-triage-violet/20 text-triage-violet border border-triage-violet/30' : 'bg-[rgba(255,255,255,0.03)] text-[rgba(255,255,255,0.4)] border border-transparent'}`}><t.icon size={14} />{t.label}</button>)}
      </div>

      {tab === 'settings' && (<div className="space-y-4"><Input label="Practice Name" value={settings.practiceName} onChange={v => setS({...settings, practiceName: v})} /><Input label="ICB Area" value={settings.icbArea} onChange={v => setS({...settings, icbArea: v})} /><Input label="Clinical Owner" value={settings.clinicalOwner} onChange={v => setS({...settings, clinicalOwner: v})} /><Input label="Review Date" type="date" value={settings.reviewDate} onChange={v => setS({...settings, reviewDate: v})} /><Input label="Session Timeout (min)" type="number" value={settings.sessionTimeoutMinutes} onChange={v => setS({...settings, sessionTimeoutMinutes: parseInt(v)})} /><Button onClick={() => { saveSettings(settings); toast('Settings saved'); }} color="green" full><Save size={18} />Save</Button></div>)}

      {tab === 'users' && (<div className="space-y-4">
        <Button onClick={() => setSAU(true)} color="blue"><Plus size={16} />Add User</Button>
        {showAddUser && <GlassCard color="blue"><Input label="Username" value={newUser.username} onChange={v => setNU({...newUser, username: v})} /><Input label="Name" value={newUser.name} onChange={v => setNU({...newUser, name: v})} /><Input label="Password" value={newUser.password} onChange={v => setNU({...newUser, password: v})} />{userErr && <div className="bg-triage-red/10 text-triage-red px-3 py-2 rounded-xl mb-3 text-sm border border-triage-red/20">{userErr}</div>}<div className="flex gap-2"><Button onClick={async () => { setUE(''); if (!newUser.username || !newUser.password || !newUser.name) { setUE('All fields required'); return; } const r = await addUser(newUser); if (r.success) { setU(getUsers()); setSAU(false); setNU({ username: '', password: '', name: '', role: 'staff' }); toast('User added'); } else { setUE(r.message); } }} color="green" size="sm"><Check size={14} />Add</Button><Button onClick={() => setSAU(false)} color="gray" size="sm">Cancel</Button></div></GlassCard>}
        {users.map((u, i) => <GlassCard key={u.id}><div className="flex items-center gap-2 mb-2"><User size={16} className="text-[rgba(255,255,255,0.4)]" /><span className="font-bold text-white text-sm">{u.name}</span><span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${u.role === 'admin' ? 'bg-triage-blue/20 text-triage-blue' : 'bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.5)]'}`}>{u.role}</span></div><Input label="Username" value={u.username} onChange={v => { const n = [...users]; n[i].username = v; setU(n); }} /><Input label="Name" value={u.name} onChange={v => { const n = [...users]; n[i].name = v; setU(n); }} /></GlassCard>)}
        <Button onClick={async () => { await saveUsers(users); toast('Users saved'); }} color="green" full><Save size={16} />Save Users</Button>
      </div>)}

      {tab === 'contacts' && (<div className="space-y-3">{data.contacts.map((c, i) => <GlassCard key={c.id}>{editContact === i ? <div className="space-y-3"><Input label="Service" value={c.service} onChange={v => { const cc = [...data.contacts]; cc[i] = { ...cc[i], service: v }; data.update('contacts', cc); }} /><Input label="Number" value={c.number} onChange={v => { const cc = [...data.contacts]; cc[i] = { ...cc[i], number: v }; data.update('contacts', cc); }} /><Input label="Hours" value={c.hours} onChange={v => { const cc = [...data.contacts]; cc[i] = { ...cc[i], hours: v }; data.update('contacts', cc); }} /><Button onClick={() => setEC(null)} size="sm"><Check size={14} />Done</Button></div> : <div className="flex items-center justify-between"><div><div className="font-semibold text-white text-sm">{c.service}</div><div className="text-xs text-[rgba(255,255,255,0.4)]">{c.number}</div></div><button onClick={() => setEC(i)} className="text-triage-blue p-2 rounded-xl hover:bg-triage-blue/10"><Edit size={16} /></button></div>}</GlassCard>)}</div>)}

      {tab === 'scripts' && (<div className="space-y-4">{Object.entries(data.scripts).map(([key, s]) => <GlassCard key={key}><div className="font-semibold mb-2 text-white text-sm">{s.title}</div>{editScript === key ? <div><TextArea value={s.script} onChange={v => { data.update('scripts', { ...data.scripts, [key]: { ...data.scripts[key], script: v } }); toast('Script saved'); }} rows={4} /><Button onClick={() => setES(null)} size="sm"><Check size={14} />Done</Button></div> : <div><p className="text-sm text-[rgba(255,255,255,0.45)] italic mb-2">"{s.script.substring(0, 100)}..."</p><button onClick={() => setES(key)} className="text-triage-blue text-sm flex items-center gap-1"><Edit size={14} />Edit</button></div>}</GlassCard>)}</div>)}

      {tab === 'backup' && (<div className="space-y-4"><GlassCard><h3 className="font-bold mb-2 text-white text-sm">Export</h3><Button onClick={() => { exportAllData(); toast('Backup downloaded'); }} color="blue" size="sm"><Download size={16} />Export</Button></GlassCard><GlassCard><h3 className="font-bold mb-2 text-white text-sm">Import</h3><label className="inline-flex items-center gap-2 px-4 py-2.5 bg-triage-blue/20 text-triage-blue border border-triage-blue/30 rounded-xl font-semibold cursor-pointer text-sm"><Upload size={16} />Import<input type="file" accept=".json" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => { const res = importAllData(ev.target.result); toast(res.message, res.success ? 'success' : 'error'); if (res.success) { setS(getSettings()); setU(getUsers()); } }; r.readAsText(f); } }} className="hidden" /></label></GlassCard><GlassCard color="red"><h3 className="font-bold mb-2 text-white text-sm">Reset</h3><Button onClick={() => { if (confirm('Reset ALL custom content?')) { data.reset(); toast('Reset complete'); } }} color="red" size="sm"><RefreshCw size={16} />Reset All</Button></GlassCard></div>)}

      {tab === 'audit' && (<div>{auditLog.length === 0 ? <p className="text-[rgba(255,255,255,0.3)] text-center py-8">No activity</p> : <div className="space-y-1">{auditLog.slice(0, 50).map((l, i) => <div key={i} className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.04)] text-sm"><span className="text-[rgba(255,255,255,0.7)]">{l.action}</span><span className="text-[rgba(255,255,255,0.3)] text-xs">{new Date(l.timestamp).toLocaleString('en-GB')}</span></div>)}</div>}</div>)}
    </div>
  );
};

// ============ NAV BAR ============
const NavBar = ({ screen, onNav, isAdminUser }) => {
  const items = [
    { id: 'home', icon: Zap, label: 'Process' },
    { id: 'search', icon: Search, label: 'Lookup' },
    { id: 'contacts', icon: Phone, label: 'Contacts' },
    { id: 'sop', icon: BookOpen, label: 'SOP' },
    { id: 'flowchart', icon: GitBranch, label: 'Flowchart' },
    { id: isAdminUser ? 'admin' : 'training', icon: isAdminUser ? Settings : GraduationCap, label: isAdminUser ? 'Admin' : 'Training' }
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-elevated border-t border-[rgba(255,255,255,0.06)] flex justify-around py-2 z-40">
      {items.map(i => (
        <button key={i.id} onClick={() => onNav(i.id)}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${screen === i.id ? 'text-triage-blue bg-triage-blue/10' : 'text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.6)]'}`}>
          <i.icon size={20} /><span className="text-[10px] mt-0.5 font-medium">{i.label}</span>
        </button>
      ))}
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
  const data = useTriageData();

  useEffect(() => {
    const s = getSession(); setSession(s); setSettingsLocal(getSettings());
    try { setHistory(JSON.parse(localStorage.getItem('triage_history') || '[]')); } catch {}
    setLoading(false);
    if (s?.mustChangePassword) setShowPasswordChange(true);
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

  if (loading || !data.loaded) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0F' }}><RefreshCw size={40} className="animate-spin text-triage-blue" /></div>;
  if (!session) return <><LoginScreen onLogin={login} toast={showToast} />{toast && <Toast {...toast} onClose={() => setToast(null)} />}</>;

  const isAdminUser = isAdmin(session);

  const renderScreen = () => {
    switch (screen) {
      case 'home': return <DecisionFlow data={data} settings={settings} onRecord={record} showToast={showToast} />;
      case 'search': return <SearchScreen data={data} />;
      case 'contacts': return <ContactsScreen contacts={data.contacts} />;
      case 'sop': return <SOPScreen />;
      case 'flowchart': return <FlowchartScreen />;
      case 'training': return <TrainingScreen onBack={() => nav('home')} scenarios={data.training} />;
      case 'admin': return isAdminUser ? <AdminConsole onBack={() => nav('home')} data={data} toast={showToast} /> : <DecisionFlow data={data} settings={settings} onRecord={record} showToast={showToast} />;
      default: return <DecisionFlow data={data} settings={settings} onRecord={record} showToast={showToast} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0F' }}>
      <EmergencyBanner />
      <UserBadge session={session} onLogout={logout} />
      {renderScreen()}
      <NavBar screen={screen} onNav={nav} isAdminUser={isAdminUser} />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {showPasswordChange && (
        <PasswordChangeModal userId={session.userId} isFirstLogin={session.mustChangePassword}
          onComplete={() => { setShowPasswordChange(false); setSession({ ...session, mustChangePassword: false }); }}
          onCancel={() => { if (!session.mustChangePassword) setShowPasswordChange(false); }} toast={showToast} />
      )}
    </div>
  );
}
