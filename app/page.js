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
  trainingTopics
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
    const kw = (k) => { const kl = k.toLowerCase(); return lower.includes(kl) || kl.includes(lower); };
    const red = redFlags.filter(f => f.keywords.some(k => kw(k)));
    const amber = amberFlags.filter(f => f.keywords.some(k => kw(k)) || (f.searchTerms && f.searchTerms.some(t => kw(t))));
    const pharmacy = pharmacyFirst.filter(c => kw(c.name));
    const risk = highRiskGroups.filter(g => {
      const terms = g.group.toLowerCase().split(/[\s/,]+/);
      return terms.some(t => t.length > 3 && (lower.includes(t) || t.includes(lower)));
    });
    const changeWords = CHANGE_WORDS.filter(w => lower.includes(w));
    const hasChange = changeWords.length > 0;
    const matchedPathways = quickMatchPathways.filter(p => p.keywords.some(k => kw(k)));
    const CANCER_KEYWORDS = ['lump', 'unexplained weight loss', 'weight loss unexplained', 'unexplained bleeding', 'persistent bowel change', 'difficulty swallowing', 'hoarseness', 'postmenopausal bleeding', 'night sweats', 'blood in stool', 'blood in urine', 'mole changed', 'mole growing'];
    const cancer = CANCER_KEYWORDS.filter(k => lower.includes(k) || k.includes(lower));
    return { red, amber, pharmacy, risk, changeWords, hasChange, pathways: matchedPathways, cancer, hasPathway: matchedPathways.length > 0, hasCancer: cancer.length > 0, hasAny: red.length + amber.length + pharmacy.length + risk.length + matchedPathways.length + (hasChange ? 1 : 0) > 0 };
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
    <div id={`flow-step-${num}`} className={`mb-2 rounded-2xl border transition-all duration-200 ${completed ? 'opacity-50' : ''} ${expanded ? `${c.bg} ${c.border}` : 'bg-[rgba(255,255,255,0.015)] border-[rgba(255,255,255,0.05)]'}`}>
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
  const [expandedSystems, setExpandedSystems] = useState({});
  const [isClinicalAdmin, setIsClinicalAdmin] = useState(false);
  const [newOngoing, setNewOngoing] = useState(null);
  const [pathwaySearch, setPathwaySearch] = useState('');
  const [quickAction, setQuickAction] = useState(null);
  const [handoverContact, setHandoverContact] = useState('');
  const [handoverAvailability, setHandoverAvailability] = useState('');
  const [selfCareOffered, setSelfCareOffered] = useState('');
  const [selfCareReason, setSelfCareReason] = useState('');

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
    setExpandedSystems({}); setIsClinicalAdmin(false); setNewOngoing(null);
    setPathwaySearch(''); setQuickAction(null);
    setHandoverContact(''); setHandoverAvailability('');
    setSelfCareOffered(''); setSelfCareReason('');
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
            {settings.practiceName} · SOP v3.1 · Work through steps in order ↓
          </p>
        </div>
        {(outcome || completedSteps.size > 0) && (
          <button onClick={resetFlow} className="flex items-center gap-1.5 px-3 py-2 bg-triage-blue/20 border border-triage-blue/30 rounded-xl text-triage-blue text-xs font-bold hover:bg-triage-blue/30 transition-all">
            <RotateCcw size={14} />New
          </button>
        )}
      </div>

      {/* ---- KEYWORD SCANNER ---- */}
      <div className="sticky top-0 z-20 bg-[#0A0A0F]/95 backdrop-blur-md pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-[rgba(255,255,255,0.25)]" size={16} />
          <textarea value={scanText} onChange={e => setScanText(e.target.value)} autoFocus={true}
            placeholder="Paste patient's words from ANIMA here to scan for flags..."
            rows={2} className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] focus:border-triage-blue/40 focus:outline-none text-white text-sm resize-none leading-relaxed" />
          {scanText && <button onClick={() => setScanText('')} className="absolute right-3 top-3 text-[rgba(255,255,255,0.25)] hover:text-white"><X size={16} /></button>}
        </div>
        {scanResults && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {scanResults.red.length > 0 && <button onClick={() => toggle(1)} className="bg-triage-red/15 border border-triage-red/30 text-triage-red px-2.5 py-1 rounded-full text-[11px] font-bold animate-pulse">🚨 {scanResults.red.length} RED FLAG{scanResults.red.length > 1 ? 'S' : ''}</button>}
            {scanResults.hasCancer && <button onClick={() => toggle(5)} className="bg-triage-red/15 border border-triage-red/30 text-triage-red px-2.5 py-1 rounded-full text-[11px] font-bold">🎗️ CANCER?</button>}
            {scanResults.risk.length > 0 && <button onClick={() => toggle(4)} className="bg-triage-amber/15 border border-triage-amber/30 text-triage-amber px-2.5 py-1 rounded-full text-[11px] font-bold">🛡️ HIGH RISK</button>}
            {scanResults.amber.length > 0 && <button onClick={() => toggle(5)} className="bg-triage-amber/15 border border-triage-amber/30 text-triage-amber px-2.5 py-1 rounded-full text-[11px] font-bold">⚠️ {scanResults.amber.length} AMBER</button>}
            {scanResults.pharmacy.length > 0 && <button onClick={() => toggle(7)} className="bg-triage-green/15 border border-triage-green/30 text-triage-green px-2.5 py-1 rounded-full text-[11px] font-bold">💊 Pharmacy</button>}
            {scanResults.hasChange && <button onClick={() => toggle(3)} className="bg-triage-teal/15 border border-triage-teal/30 text-triage-teal px-2.5 py-1 rounded-full text-[11px] font-bold">🔄 CHANGE</button>}
            {scanResults.hasPathway && <button onClick={() => toggle(6)} className="bg-triage-blue/15 border border-triage-blue/30 text-triage-blue px-2.5 py-1 rounded-full text-[11px] font-bold">🔍 PATHWAY</button>}
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
            {scanResults.red.map((f, i) => <div key={i} className="text-white text-sm mb-1 flex items-start gap-2"><span className="text-triage-red mt-0.5">•</span><span>{f.symptom} — <span className="text-triage-red font-semibold">{f.action}</span></span></div>)}
          </div>
        )}
        <div className="text-[rgba(255,255,255,0.4)] text-xs mb-2 font-semibold">STOP if patient mentions ANY:</div>
        <div className="space-y-1 mb-4 max-h-64 overflow-y-auto pr-1">
          {(() => {
            const grouped = {};
            data.redFlags.forEach(f => { if (!grouped[f.system]) grouped[f.system] = []; grouped[f.system].push(f); });
            const matchedSystems = scanResults?.red.length > 0 ? new Set(scanResults.red.map(f => f.system)) : new Set();
            return Object.entries(grouped).map(([system, flags]) => {
              const isMatched = matchedSystems.has(system);
              const isOpen = expandedSystems[system] ?? isMatched;
              return (
                <div key={system} className={`rounded-lg border ${isMatched ? 'border-triage-red/30 bg-triage-red/5' : 'border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]'}`}>
                  <button onClick={() => setExpandedSystems(prev => ({ ...prev, [system]: !isOpen }))}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-left">
                    <span className={`text-[11px] font-bold tracking-wide ${isMatched ? 'text-triage-red' : 'text-[rgba(255,255,255,0.5)]'}`}>
                      {isMatched && '🚨 '}{system.toUpperCase()} ({flags.length})
                    </span>
                    {isOpen ? <ChevronUp size={12} className="text-[rgba(255,255,255,0.3)]" /> : <ChevronDown size={12} className="text-[rgba(255,255,255,0.3)]" />}
                  </button>
                  {isOpen && (
                    <div className="px-2.5 pb-2 space-y-1">
                      {flags.map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-triage-red mt-1.5 flex-shrink-0" />
                          <span className="text-[rgba(255,255,255,0.55)] text-[11px] leading-relaxed">{f.symptom}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>
        <div className="flex gap-2 mb-2">
          <a href="tel:999" className="flex-1 bg-triage-red/20 border border-triage-red/30 text-triage-red rounded-xl py-3 text-center font-bold text-sm active:scale-95 transition-transform flex items-center justify-center gap-2">
            <Phone size={16} />CALL 999
          </a>
          <button onClick={() => selectOutcome('→ 999 / A&E / Duty clinician alerted', 'red')} className="flex-1 bg-triage-red/10 border border-triage-red/20 text-triage-red rounded-xl py-3 text-center font-semibold text-xs">
            A&E + Alert Duty
          </button>
        </div>
        <div className="text-[rgba(255,255,255,0.3)] text-[10px] text-center mb-3">On-site ambulance: 020 3162 7525 | Crisis: 0800 028 8000 | CAMHS: 0203 228 5980</div>
        <button onClick={() => advanceToNext(1)} className="w-full text-center text-xs text-[rgba(255,255,255,0.4)] hover:text-triage-blue py-2 border-t border-[rgba(255,255,255,0.04)]">
          No red flags → Continue to Step 2 ↓
        </button>
      </FlowStep>

      {/* ═══════════════════════════════════════════════════
          STEP 2: CHECK EMIS
          ═══════════════════════════════════════════════════ */}
      <FlowStep num={2} color="blue" title="✅ CHECK EMIS (mandatory)" subtitle="Look for plans, alerts, flags, letters, results"
        expanded={expandedStep === 2} onToggle={() => toggle(2)} completed={completedSteps.has(2)}>

        {/* Clinical Admin Toggle */}
        <div className="mb-3">
          <button onClick={() => setIsClinicalAdmin(!isClinicalAdmin)}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${isClinicalAdmin ? 'bg-triage-violet/10 border-triage-violet/30 text-triage-violet' : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.5)] hover:border-[rgba(255,255,255,0.2)]'}`}>
            <span>📋 Is this CLINICAL ADMIN? (bloods/ECG/smear/results/referral)</span>
            <ChevronDown size={14} className={`transition-transform ${isClinicalAdmin ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {isClinicalAdmin ? (
          <div className="space-y-2 mb-3 animate-fade-slide">
            <div className="bg-triage-green/6 border border-triage-green/15 rounded-xl p-3">
              <div className="text-triage-green font-bold text-xs mb-1">Plan/letter/recall exists in EMIS</div>
              <div className="text-[rgba(255,255,255,0.4)] text-[11px] mb-2">→ Book direct</div>
              <button onClick={() => selectOutcome('→ Clinical admin: direct booked per EMIS plan' + (emisFindings ? '. EMIS: ' + emisFindings : ''), 'green')}
                className="bg-triage-green/15 border border-triage-green/25 text-triage-green rounded-lg py-1.5 px-3 text-[11px] font-semibold">✅ Book direct</button>
            </div>
            <div className="bg-triage-blue/6 border border-triage-blue/15 rounded-xl p-3">
              <div className="text-triage-blue font-bold text-xs mb-1">Chasing hospital results</div>
              <div className="text-[rgba(255,255,255,0.4)] text-[11px] mb-2">→ Direct back to hospital / CHECK & CONFIRM referral date</div>
              <button onClick={() => selectOutcome('→ Clinical admin: directed to hospital for results/referral date' + (emisFindings ? '. EMIS: ' + emisFindings : ''), 'blue')}
                className="bg-triage-blue/15 border border-triage-blue/25 text-triage-blue rounded-lg py-1.5 px-3 text-[11px] font-semibold">📋 Action this</button>
            </div>
            <div className="bg-triage-amber/6 border border-triage-amber/15 rounded-xl p-3">
              <div className="text-triage-amber font-bold text-xs mb-1">Chasing GP results</div>
              <div className="text-[rgba(255,255,255,0.4)] text-[11px] mb-2">→ Relay clinician comment. If NOT commented &gt;7 working days → EMIS Task</div>
              <button onClick={() => selectOutcome('→ Clinical admin: GP results — relayed comment or raised EMIS task (>7 days)' + (emisFindings ? '. EMIS: ' + emisFindings : ''), 'amber')}
                className="bg-triage-amber/15 border border-triage-amber/25 text-triage-amber rounded-lg py-1.5 px-3 text-[11px] font-semibold">📋 Action this</button>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </FlowStep>

      {/* ═══════════════════════════════════════════════════
          STEP 3: NEW OR ONGOING?  (CRUCIAL NEW STEP)
          ═══════════════════════════════════════════════════ */}
      <FlowStep num={3} color="teal" title="🔄 NEW or ONGOING?" subtitle="Based on EMIS: has a clinician already reviewed THIS specific issue?"
        expanded={expandedStep === 3} onToggle={() => toggle(3)} completed={completedSteps.has(3)}
        badge={scanResults?.hasChange ? 'CHANGE?' : null} badgeColor="amber">

        {/* Two large choice buttons */}
        <div className="flex gap-3 mb-3">
          <button onClick={() => setNewOngoing('plan-exists')}
            className={`flex-1 p-4 rounded-xl border text-left transition-all ${newOngoing === 'plan-exists' ? 'border-triage-green/50 bg-triage-green/10' : 'border-triage-green/30 bg-triage-green/6 hover:bg-triage-green/10'}`}>
            <div className="text-triage-green font-bold text-sm mb-0.5">✅ PLAN EXISTS</div>
            <div className="text-triage-green/80 text-[11px] font-medium">(ongoing/planned/due)</div>
            <div className="text-[rgba(255,255,255,0.35)] text-[10px] mt-2 leading-relaxed">Follow-up → direct book per plan | Recall → book per SOP | Admin (GP reviewed) → Tier 2</div>
          </button>
          <button onClick={() => { setNewOngoing('no-plan'); advanceToNext(3); }}
            className={`flex-1 p-4 rounded-xl border text-left transition-all border-triage-blue/30 bg-triage-blue/6 hover:bg-triage-blue/10 ${scanResults?.hasChange ? 'ring-2 ring-triage-blue/40 animate-pulse' : ''}`}>
            <div className="text-triage-blue font-bold text-sm mb-0.5">➡️ NO PLAN / WORSENED / NEW</div>
            <div className="text-[rgba(255,255,255,0.35)] text-[10px] mt-2 leading-relaxed">No record of assessment → continue | Worsened → continue</div>
          </button>
        </div>

        {/* Sub-options when PLAN EXISTS is selected */}
        {newOngoing === 'plan-exists' && (
          <div className="flex gap-2 mb-3 animate-fade-slide">
            <button onClick={() => selectOutcome('→ Direct booked (ongoing — plan in EMIS)' + (emisFindings ? '. EMIS: ' + emisFindings : ''), 'teal')}
              className="flex-1 bg-triage-green/15 border border-triage-green/25 text-triage-green rounded-xl py-2.5 text-xs font-semibold text-center">
              ✅ Direct book
            </button>
            <button onClick={() => selectOutcome('→ Forward to Tier 2 (ongoing — plan in EMIS)' + (emisFindings ? '. EMIS: ' + emisFindings : ''), 'blue')}
              className="flex-1 bg-triage-blue/15 border border-triage-blue/25 text-triage-blue rounded-xl py-2.5 text-xs font-semibold text-center">
              📨 Forward to Tier 2
            </button>
          </div>
        )}

        {/* Warning texts */}
        <div className="text-triage-amber text-[11px] font-medium mt-2">⚠️ If patient says &apos;worse&apos;, &apos;not improving&apos;, or &apos;different&apos; → treat as NEW</div>
        <div className="text-triage-red text-[11px] font-semibold mt-1">⛔ Do NOT book a new GP appointment for a new problem without triage steps</div>
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
        expanded={expandedStep === 6} onToggle={() => toggle(6)} completed={completedSteps.has(6)}
        badge={scanResults?.hasPathway ? 'MATCH' : null} badgeColor="blue">

        {/* Scanner-matched pathways banner */}
        {scanResults?.pathways?.length > 0 && (
          <div className="bg-triage-blue/8 border border-triage-blue/20 rounded-xl p-2.5 mb-3">
            <div className="text-triage-blue font-bold text-xs mb-1">🔍 SCANNER MATCHED {scanResults.pathways.length} PATHWAY{scanResults.pathways.length > 1 ? 'S' : ''}:</div>
            <div className="flex flex-wrap gap-1">
              {scanResults.pathways.map(p => <span key={p.id} className="bg-triage-blue/20 px-2 py-0.5 rounded text-[11px] text-triage-blue font-medium">{p.pathway}</span>)}
            </div>
          </div>
        )}

        {/* Local search */}
        <input
          type="text" value={pathwaySearch} onChange={e => setPathwaySearch(e.target.value)}
          placeholder="Search pathways..."
          className="w-full px-3 py-2 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] focus:border-triage-blue/40 focus:outline-none text-white text-xs mb-3 placeholder:text-[rgba(255,255,255,0.25)]"
        />

        {/* Pathway grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          {(() => {
            const searchLower = pathwaySearch.toLowerCase();
            const matchedIds = new Set((scanResults?.pathways || []).map(p => p.id));
            const filtered = quickMatchPathways.filter(p =>
              !searchLower || p.pathway.toLowerCase().includes(searchLower) ||
              p.symptoms.toLowerCase().includes(searchLower) ||
              p.action.toLowerCase().includes(searchLower) ||
              p.keywords.some(k => k.toLowerCase().includes(searchLower))
            );
            // Sort: scanner-matched first, then 999 items, then rest
            const sorted = [...filtered].sort((a, b) => {
              const aMatch = matchedIds.has(a.id) ? 0 : 1;
              const bMatch = matchedIds.has(b.id) ? 0 : 1;
              if (aMatch !== bMatch) return aMatch - bMatch;
              return 0;
            });
            return sorted.map(p => {
              const isMatched = matchedIds.has(p.id);
              const is999 = p.action.includes('999');
              const borderClass = isMatched ? 'border-triage-blue/40 bg-triage-blue/8' : is999 ? 'border-triage-red/30 bg-triage-red/5' : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]';
              return (
                <div key={p.id} className={`rounded-xl border p-2.5 transition-all hover:border-[rgba(255,255,255,0.15)] ${borderClass}`}>
                  <div className="flex items-start justify-between gap-1">
                    <div className={`font-bold text-xs ${is999 ? 'text-triage-red' : isMatched ? 'text-triage-blue' : 'text-[rgba(255,255,255,0.8)]'}`}>{p.pathway}</div>
                    {isMatched && <span className="text-[9px] bg-triage-blue/20 text-triage-blue px-1.5 py-0.5 rounded font-bold flex-shrink-0">MATCH</span>}
                  </div>
                  <div className="text-[rgba(255,255,255,0.4)] text-[10px] mt-0.5 leading-relaxed">{p.symptoms}</div>
                  <div className={`text-[11px] font-semibold mt-1.5 ${is999 ? 'text-triage-red' : 'text-[rgba(255,255,255,0.6)]'}`}>→ {p.action}</div>
                  {p.contact && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-triage-blue text-[10px]">{p.contact}</span>
                      <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(p.contact); showToast('Copied: ' + p.contact); }}
                        className="text-[rgba(255,255,255,0.3)] hover:text-triage-blue transition-colors"><Copy size={10} /></button>
                    </div>
                  )}
                  <button onClick={() => selectOutcome(`→ Signposted: ${p.pathway} — ${p.action}${p.contact ? ' (' + p.contact + ')' : ''}`, is999 ? 'red' : 'blue')}
                    className={`w-full rounded-lg py-1.5 text-[10px] font-semibold text-center mt-2 ${is999 ? 'bg-triage-red/15 border border-triage-red/25 text-triage-red' : 'bg-triage-blue/10 border border-triage-blue/20 text-triage-blue'}`}>
                    ✅ Signposted
                  </button>
                </div>
              );
            });
          })()}
        </div>

        <button onClick={() => advanceToNext(6)} className="w-full text-center text-xs text-[rgba(255,255,255,0.4)] hover:text-triage-blue py-2 border-t border-[rgba(255,255,255,0.04)]">
          Doesn&apos;t fit a specific pathway → Step 7 ↓
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
      <FlowStep num={8} color="violet" title="➡️ DEFAULT: FORWARD TO TIER 2" subtitle="Anything else, unclear, multiple symptoms, or patient anxious"
        expanded={expandedStep === 8} onToggle={() => toggle(8)} completed={completedSteps.has(8)}>

        <div className="text-[rgba(255,255,255,0.45)] text-[11px] mb-3">
          Forward if: multiple problems, severe/worsening, &gt;2 weeks, new lump/night sweats/unexplained bleeding, patient anxious, any uncertainty.
        </div>

        {/* Structured handover form */}
        <div className="space-y-2.5 mb-3">
          <div>
            <div className="text-[rgba(255,255,255,0.5)] text-[10px] font-bold mb-1">PATIENT&apos;S EXACT WORDS:</div>
            <textarea value={scanText} onChange={e => setScanText(e.target.value)}
              placeholder="Paste ANIMA text / patient's words here..."
              rows={2} className="w-full px-3 py-2 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] focus:border-triage-violet/40 focus:outline-none text-white text-xs resize-none" />
          </div>
          <div>
            <div className="text-[rgba(255,255,255,0.5)] text-[10px] font-bold mb-1">EMIS FINDINGS:</div>
            <textarea value={emisFindings} onChange={e => setEmisFindings(e.target.value)}
              placeholder="Alerts, recent notes, risk flags, letters..."
              rows={2} className="w-full px-3 py-2 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] focus:border-triage-violet/40 focus:outline-none text-white text-xs resize-none" />
          </div>
          <div>
            <div className="text-[rgba(255,255,255,0.5)] text-[10px] font-bold mb-1">NEW or ONGOING:</div>
            <div className={`px-3 py-2 rounded-xl border text-xs ${newOngoing ? 'bg-triage-teal/8 border-triage-teal/20 text-triage-teal' : 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.4)]'}`}>
              {newOngoing === 'plan-exists' ? '✅ ONGOING — plan exists in EMIS' : newOngoing === 'no-plan' ? '➡️ NEW / no plan / worsened' : 'Not yet determined (set in Step 3)'}
            </div>
          </div>
          <div>
            <div className="text-[rgba(255,255,255,0.5)] text-[10px] font-bold mb-1">FLAGS IDENTIFIED:</div>
            <div className="px-3 py-2 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-xs min-h-[32px]">
              {scanResults?.red.length > 0 && <span className="text-triage-red">Red: {scanResults.red.map(r => r.symptom).join(', ')}. </span>}
              {scanResults?.amber.length > 0 && <span className="text-triage-amber">Amber: {scanResults.amber.map(a => a.category).join(', ')}. </span>}
              {scanResults?.hasCancer && <span className="text-triage-red">Cancer keywords: {scanResults.cancer.join(', ')}. </span>}
              {scanResults?.hasChange && <span className="text-triage-amber">Change: {scanResults.changeWords.join(', ')}. </span>}
              {scanResults?.risk.length > 0 && <span className="text-triage-amber">High-risk: {scanResults.risk.map(r => r.group).join(', ')}. </span>}
              {!scanResults?.hasAny && <span className="text-[rgba(255,255,255,0.3)]">None detected — enter patient text above</span>}
            </div>
          </div>
          <div>
            <div className="text-[rgba(255,255,255,0.5)] text-[10px] font-bold mb-1">SELF-CARE OFFERED:</div>
            <div className="flex gap-2">
              <button onClick={() => setSelfCareOffered('yes')}
                className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold ${selfCareOffered === 'yes' ? 'bg-triage-green/15 border-triage-green/30 text-triage-green' : 'border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.4)]'}`}>
                Yes
              </button>
              <button onClick={() => setSelfCareOffered('no')}
                className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold ${selfCareOffered === 'no' ? 'bg-triage-amber/15 border-triage-amber/30 text-triage-amber' : 'border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.4)]'}`}>
                No
              </button>
            </div>
            {selfCareOffered === 'no' && (
              <input type="text" value={selfCareReason} onChange={e => setSelfCareReason(e.target.value)}
                placeholder="Reason (e.g. high-risk, patient declined, multiple symptoms)"
                className="w-full mt-1.5 px-3 py-1.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] focus:border-triage-violet/40 focus:outline-none text-white text-[11px]" />
            )}
          </div>
          <div>
            <div className="text-[rgba(255,255,255,0.5)] text-[10px] font-bold mb-1">CONTACT DETAILS:</div>
            <input type="text" value={handoverContact} onChange={e => setHandoverContact(e.target.value)}
              placeholder="Phone number / callback number"
              className="w-full px-3 py-1.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] focus:border-triage-violet/40 focus:outline-none text-white text-xs" />
          </div>
          <div>
            <div className="text-[rgba(255,255,255,0.5)] text-[10px] font-bold mb-1">PATIENT AVAILABILITY:</div>
            <input type="text" value={handoverAvailability} onChange={e => setHandoverAvailability(e.target.value)}
              placeholder="e.g. Available all day / mornings only / after 2pm"
              className="w-full px-3 py-1.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] focus:border-triage-violet/40 focus:outline-none text-white text-xs" />
          </div>
        </div>

        {/* Copy Handover + Send buttons */}
        <div className="flex gap-2 mb-3">
          <button onClick={() => {
            const flagParts = [];
            if (scanResults?.red.length) flagParts.push('Red: ' + scanResults.red.map(r => r.symptom).join(', '));
            if (scanResults?.amber.length) flagParts.push('Amber: ' + scanResults.amber.map(a => a.category).join(', '));
            if (scanResults?.hasCancer) flagParts.push('Cancer keywords: ' + scanResults.cancer.join(', '));
            if (scanResults?.hasChange) flagParts.push('Change: ' + scanResults.changeWords.join(', '));
            if (scanResults?.risk.length) flagParts.push('High-risk: ' + scanResults.risk.map(r => r.group).join(', '));
            const msg = [
              'HANDOVER TO TIER 2',
              `Patient says: "${scanText}"`,
              emisFindings ? `EMIS: ${emisFindings}` : '',
              `NEW/ONGOING: ${newOngoing === 'plan-exists' ? 'ONGOING — plan exists' : newOngoing === 'no-plan' ? 'NEW / no plan / worsened' : 'Not determined'}`,
              flagParts.length ? `Flags: ${flagParts.join('; ')}` : 'Flags: None detected',
              `Self-care: ${selfCareOffered === 'yes' ? 'Yes — offered' : selfCareOffered === 'no' ? 'No — ' + (selfCareReason || 'reason not specified') : 'Not recorded'}`,
              handoverContact ? `Contact: ${handoverContact}` : '',
              handoverAvailability ? `Availability: ${handoverAvailability}` : '',
              `Time: ${new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
            ].filter(Boolean).join('\n');
            navigator.clipboard.writeText(msg);
            showToast('Handover copied to clipboard');
          }}
            className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.7)] rounded-xl py-2.5 text-center font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[rgba(255,255,255,0.06)]">
            <Copy size={14} />📋 Copy Handover
          </button>
          <button onClick={() => selectOutcome('→ Forwarded to Tier 2 / GP Triager' + (emisFindings ? '. EMIS: ' + emisFindings : ''), 'violet')}
            className="flex-1 bg-triage-violet/15 border border-triage-violet/25 text-triage-violet rounded-xl py-2.5 text-center font-semibold text-xs flex items-center justify-center gap-2">
            📨 Send to Tier 2
          </button>
        </div>

        <button onClick={resetFlow}
          className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.5)] rounded-xl py-2.5 text-center font-semibold text-xs hover:bg-[rgba(255,255,255,0.06)]">
          Done — Start New Triage
        </button>
      </FlowStep>

      {/* ---- IF IN DOUBT BANNER ---- */}
      <div className="bg-[rgba(108,142,255,0.04)] border border-[rgba(108,142,255,0.12)] rounded-2xl p-4 text-center mt-2 mb-2">
        <div className="text-triage-blue font-black text-sm">⚠️ IF IN DOUBT → ASK A CLINICIAN</div>
        <div className="text-[rgba(255,255,255,0.3)] text-xs mt-1">GP Triager from 8am · Duty clinician on site</div>
      </div>

      {/* ---- DOCUMENTATION REMINDER (shows after outcome selected) ---- */}
      {outcome && (
        <div className="bg-triage-violet/5 border border-triage-violet/15 rounded-2xl p-3 mb-2 animate-fade-slide">
          <div className="text-triage-violet font-bold text-xs mb-1.5">📝 DOCUMENT IN EMIS:</div>
          <div className="text-[rgba(255,255,255,0.45)] text-[11px] space-y-0.5">
            <div>• What was decided & who decided</div>
            <div>• Why — patient&apos;s words + your rationale</div>
            <div>• Safety-net advice given</div>
            <div>• Where signposted / referred</div>
            <div>• EMIS findings noted</div>
            <div>• NEW or ONGOING status</div>
            <div>• Resource sent (CalmCare / Healthier Together)</div>
          </div>
        </div>
      )}

      {/* ---- VERSION TEXT ---- */}
      <div className="text-center text-[rgba(255,255,255,0.15)] text-[10px] py-2 mb-2">
        SOP v3.1 | Flowchart v3.1 | Feb 2026 | Dr Sahar Jahanian
      </div>

      {/* ---- QUICK ACTION BAR (fixed bottom) ---- */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#0A0A0F]/95 backdrop-blur-md border-t border-[rgba(255,255,255,0.06)] p-2">
        <div className="flex gap-2 max-w-lg mx-auto">
          <button onClick={() => setQuickAction(quickAction === '999' ? null : '999')}
            className="flex-1 bg-triage-red/20 border border-triage-red/30 text-triage-red rounded-xl py-2 text-[11px] font-bold text-center">
            🚨 999
          </button>
          <button onClick={() => setQuickAction(quickAction === 'crisis' ? null : 'crisis')}
            className="flex-1 bg-triage-amber/20 border border-triage-amber/30 text-triage-amber rounded-xl py-2 text-[11px] font-bold text-center">
            📞 Crisis
          </button>
          <button onClick={() => { setExpandedStep(8); setTimeout(() => document.getElementById('flow-step-8')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100); }}
            className="flex-1 bg-triage-blue/20 border border-triage-blue/30 text-triage-blue rounded-xl py-2 text-[11px] font-bold text-center">
            ➡️ Tier 2
          </button>
          <button onClick={() => {
            const parts = [];
            if (scanText) parts.push(`Patient: "${scanText}"`);
            if (emisFindings) parts.push(`EMIS: ${emisFindings}`);
            if (scanResults?.red.length) parts.push(`Red flags: ${scanResults.red.map(r => r.symptom).join(', ')}`);
            if (scanResults?.amber.length) parts.push(`Amber: ${scanResults.amber.map(a => a.category).join(', ')}`);
            if (scanResults?.risk.length) parts.push(`High-risk: ${scanResults.risk.map(r => r.group).join(', ')}`);
            if (scanResults?.hasChange) parts.push(`Change words: ${scanResults.changeWords.join(', ')}`);
            if (parts.length) { navigator.clipboard.writeText(parts.join('\n')); showToast('Copied to clipboard'); }
            else showToast('Nothing to copy yet');
          }}
            className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.6)] rounded-xl py-2 text-[11px] font-bold text-center">
            📋 Copy
          </button>
        </div>
        {quickAction === '999' && (
          <div className="max-w-lg mx-auto mt-2 bg-triage-red/10 border border-triage-red/25 rounded-xl p-2.5 animate-fade-slide">
            <div className="text-triage-red font-bold text-xs">Call 999. Inform duty clinician.</div>
            <div className="text-[rgba(255,255,255,0.5)] text-[11px] mt-0.5">On-site ambulance: <strong className="text-white">020 3162 7525</strong></div>
          </div>
        )}
        {quickAction === 'crisis' && (
          <div className="max-w-lg mx-auto mt-2 bg-triage-amber/10 border border-triage-amber/25 rounded-xl p-2.5 animate-fade-slide">
            <div className="text-triage-amber font-bold text-xs">Crisis Lines</div>
            <div className="text-[rgba(255,255,255,0.5)] text-[11px] mt-0.5">Adults: <strong className="text-white">0800 028 8000</strong> | CAMHS &lt;18: <strong className="text-white">0203 228 5980</strong></div>
          </div>
        )}
      </div>

      {/* ---- OUTCOME BAR (sticky bottom) ---- */}
      {outcome && (
        <div className="fixed bottom-14 left-0 right-0 z-40 p-3">
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

// ============ SYMPTOM CHECKER ============
const SymptomChecker = ({ data, showToast }) => {
  const [text, setText] = useState('');
  const scanResults = useKeywordScanner(text, data.redFlags, data.amberFlags, data.pharmacyFirst, data.highRiskGroups);

  const hasInput = text.length >= 2;
  const isRed = scanResults?.red.length > 0 || scanResults?.hasCancer;
  const isAmber = scanResults?.amber.length > 0 || scanResults?.risk.length > 0;
  const isGreen = scanResults?.pharmacy.length > 0;
  const hasPathway = scanResults?.hasPathway;
  const urgency = isRed ? 'red' : isAmber ? 'amber' : (isGreen || hasPathway) ? 'green' : null;

  const buildSummary = () => {
    const p = [`SYMPTOM CHECK — ${new Date().toLocaleString('en-GB')}`, `Patient says: "${text}"`, ''];
    if (scanResults?.red.length) { p.push('RED FLAGS:'); scanResults.red.forEach(r => p.push(`  [${r.system}] ${r.symptom} → ${r.action}`)); p.push(''); }
    if (scanResults?.hasCancer) { p.push('CANCER KEYWORDS: ' + scanResults.cancer.join(', ')); p.push('  → GP Triager for urgent 2WW (NICE NG12)'); p.push(''); }
    if (scanResults?.amber.length) { p.push('AMBER FLAGS:'); scanResults.amber.forEach(a => p.push(`  ${a.category} → ${a.action}`)); p.push(''); }
    if (scanResults?.risk.length) { p.push('HIGH RISK:'); scanResults.risk.forEach(r => p.push(`  ${r.group} → ${r.action}`)); p.push(''); }
    if (scanResults?.pathways?.length) { p.push('PATHWAY MATCH:'); scanResults.pathways.forEach(pw => p.push(`  ${pw.pathway}: ${pw.action}${pw.contact ? ' (' + pw.contact + ')' : ''}`)); p.push(''); }
    if (scanResults?.pharmacy.length) { p.push('PHARMACY FIRST:'); scanResults.pharmacy.forEach(ph => p.push(`  ${ph.name} (${ph.ageRange})`)); p.push(''); }
    if (scanResults?.hasChange) { p.push('CHANGE/WORSENING: ' + scanResults.changeWords.join(', ')); p.push(''); }
    if (hasInput && !scanResults?.hasAny) p.push('No flags detected.');
    return p.join('\n');
  };

  return (
    <div className="p-3 sm:p-4 pb-24 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-3">
        <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
          <ClipboardCheck size={20} className="text-triage-blue" />Symptom Checker
        </h1>
        <p className="text-[10px] text-[rgba(255,255,255,0.3)] mt-0.5">
          Paste the patient&apos;s words below · Scans for red/amber flags · Shows next steps &amp; signposting
        </p>
      </div>

      {/* Input */}
      <div className="sticky top-0 z-20 bg-[#0A0A0F]/95 backdrop-blur-md pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-[rgba(255,255,255,0.25)]" size={16} />
          <textarea value={text} onChange={e => setText(e.target.value)} autoFocus
            placeholder="Type or paste the patient's words here to check symptoms..."
            rows={3} className="w-full pl-9 pr-9 py-3 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] focus:border-triage-blue/40 focus:outline-none text-white text-sm resize-none leading-relaxed placeholder:text-[rgba(255,255,255,0.25)]" />
          {text && <button onClick={() => setText('')} className="absolute right-3 top-3 text-[rgba(255,255,255,0.3)] hover:text-white"><X size={16} /></button>}
        </div>
      </div>

      {/* Urgency Banner */}
      {hasInput && urgency && (
        <div className={`mb-4 rounded-2xl p-4 border animate-fade-slide ${urgency === 'red' ? 'bg-triage-red/10 border-triage-red/30' : urgency === 'amber' ? 'bg-triage-amber/10 border-triage-amber/30' : 'bg-triage-green/10 border-triage-green/30'}`}>
          <div className={`font-black text-sm ${urgency === 'red' ? 'text-triage-red' : urgency === 'amber' ? 'text-triage-amber' : 'text-triage-green'}`}>
            {urgency === 'red' && '🚨 RED FLAG — CALL 999 / A&E NOW'}
            {urgency === 'amber' && '⚠️ AMBER — Same-Day GP Triager'}
            {urgency === 'green' && '✅ PATHWAY / PHARMACY FIRST MATCH'}
          </div>
          <div className="text-[rgba(255,255,255,0.5)] text-xs mt-1">
            {urgency === 'red' && 'Stop — do not continue triage. Call 999 and alert duty clinician on site.'}
            {urgency === 'amber' && 'Forward to Tier 2 with flags. Tier 2 books same-day duty GP within 1 hour.'}
            {urgency === 'green' && 'Signpost to matched pathway or Pharmacy First. Always safety-net the patient.'}
          </div>
          {urgency === 'red' && (
            <div className="flex gap-2 mt-3">
              <a href="tel:999" className="flex items-center gap-2 bg-triage-red/20 border border-triage-red/30 text-triage-red rounded-xl px-4 py-2 font-bold text-sm active:scale-95 transition-transform"><Phone size={16} />CALL 999</a>
              <a href="tel:02031627525" className="flex items-center gap-2 bg-triage-red/10 border border-triage-red/20 text-triage-red/80 rounded-xl px-3 py-2 font-semibold text-xs">On-site Ambulance</a>
            </div>
          )}
        </div>
      )}

      {/* No results */}
      {hasInput && !scanResults?.hasAny && (
        <div className="text-center py-8">
          <div className="w-14 h-14 bg-triage-green/10 rounded-2xl flex items-center justify-center mx-auto mb-3"><CheckCircle size={28} className="text-triage-green" /></div>
          <div className="text-triage-green font-bold text-sm mb-1">No flags detected</div>
          <div className="text-[rgba(255,255,255,0.4)] text-xs leading-relaxed max-w-xs mx-auto">
            Consider: Self-care (CalmCare / Healthier Together) or Pharmacy First if eligible.<br />
            If the patient seems unwell or you&apos;re uncertain → always escalate.
          </div>
        </div>
      )}

      {/* RED FLAGS */}
      {scanResults?.red.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2"><AlertTriangle size={16} className="text-triage-red" /><h2 className="font-black text-triage-red text-sm">RED FLAGS — Call 999</h2></div>
          {scanResults.red.map((f, i) => (
            <GlassCard key={`red-${f.system}-${i}`} color="red" className="!p-3 !mb-2">
              <div className="text-triage-red/70 font-bold text-[10px] uppercase tracking-wider mb-0.5">{f.system}</div>
              <div className="text-[rgba(255,255,255,0.85)] text-sm">{f.symptom}</div>
              <div className="text-triage-red font-bold text-xs mt-1.5">→ {f.action}</div>
              {f.niceRef && <div className="text-[rgba(255,255,255,0.25)] text-[10px] mt-1">{f.niceRef}</div>}
            </GlassCard>
          ))}
          <div className="bg-triage-blue/6 border border-triage-blue/15 rounded-xl p-2.5 mt-1">
            <div className="text-[rgba(255,255,255,0.4)] text-[10px]">On-site ambulance: <strong className="text-white">020 3162 7525</strong> · Crisis: <strong className="text-white">0800 028 8000</strong> · CAMHS: <strong className="text-white">0203 228 5980</strong></div>
          </div>
        </div>
      )}

      {/* CANCER KEYWORDS */}
      {scanResults?.hasCancer && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2"><span className="text-sm">🎗️</span><h2 className="font-black text-triage-red text-sm">POSSIBLE CANCER — 2WW Pathway</h2></div>
          <GlassCard color="red" className="!p-3">
            <div className="text-[rgba(255,255,255,0.7)] text-sm mb-1">Matched: <strong className="text-triage-red">{scanResults.cancer.join(', ')}</strong></div>
            <div className="text-triage-red font-bold text-xs">→ ESCALATE to GP Triager (Tier 3) for urgent 2WW referral (NICE NG12)</div>
            <div className="text-[rgba(255,255,255,0.3)] text-[10px] mt-1">Do NOT book routine. Do NOT use self-care.</div>
          </GlassCard>
        </div>
      )}

      {/* AMBER FLAGS */}
      {scanResults?.amber.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2"><AlertCircle size={16} className="text-triage-amber" /><h2 className="font-black text-triage-amber text-sm">AMBER FLAGS — Same-Day GP</h2></div>
          {scanResults.amber.map(f => (
            <GlassCard key={f.id} color="amber" className="!p-3 !mb-2">
              <div className="text-triage-amber font-bold text-xs">{f.category}</div>
              <div className="text-[rgba(255,255,255,0.5)] text-xs mt-0.5">→ {f.action}</div>
              {f.niceRef && <div className="text-[rgba(255,255,255,0.25)] text-[10px] mt-1">{f.niceRef}</div>}
            </GlassCard>
          ))}
        </div>
      )}

      {/* HIGH RISK GROUPS */}
      {scanResults?.risk.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2"><Shield size={16} className="text-triage-amber" /><h2 className="font-black text-triage-amber text-sm">HIGH RISK GROUP</h2></div>
          {scanResults.risk.map(g => (
            <GlassCard key={g.id} color="amber" className="!p-3 !mb-2">
              <div className="flex items-start gap-2.5">
                <span className="text-lg flex-shrink-0">{g.icon}</span>
                <div>
                  <div className="text-[rgba(255,255,255,0.85)] font-semibold text-sm">{g.group}</div>
                  <div className="text-triage-amber text-xs mt-0.5">→ {g.action}</div>
                  {g.note && <div className="text-[rgba(255,255,255,0.35)] text-[10px] mt-1">{g.note}</div>}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* PATHWAY MATCHES (Signposting) */}
      {scanResults?.pathways?.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2"><ExternalLink size={16} className="text-triage-blue" /><h2 className="font-black text-triage-blue text-sm">SIGNPOST TO PATHWAY</h2></div>
          {scanResults.pathways.map(pw => {
            const is999 = pw.action.includes('999');
            const isPhone = pw.contact && (pw.contact.match(/^\d/) || pw.contact === '999');
            return (
              <GlassCard key={pw.id} color={is999 ? 'red' : 'blue'} className="!p-3 !mb-2">
                <div className={`font-bold text-xs ${is999 ? 'text-triage-red' : 'text-triage-blue'}`}>{pw.pathway}</div>
                <div className="text-[rgba(255,255,255,0.5)] text-[11px] mt-0.5">{pw.symptoms}</div>
                <div className={`font-semibold text-xs mt-1.5 ${is999 ? 'text-triage-red' : 'text-[rgba(255,255,255,0.7)]'}`}>→ {pw.action}</div>
                {pw.contact && (
                  <div className="mt-2">
                    {isPhone ? (
                      <a href={`tel:${pw.contact.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-1.5 bg-triage-blue/10 border border-triage-blue/20 text-triage-blue rounded-lg px-3 py-1.5 text-[11px] font-semibold">
                        <Phone size={12} />{pw.contact}
                      </a>
                    ) : pw.contact !== 'Same-day' && (
                      <button onClick={() => window.open(pw.contact.startsWith('http') ? pw.contact : `https://${pw.contact}`, '_blank')}
                        className="inline-flex items-center gap-1.5 bg-triage-blue/10 border border-triage-blue/20 text-triage-blue rounded-lg px-3 py-1.5 text-[11px] font-semibold">
                        <Globe size={12} />{pw.contact} <ExternalLink size={10} />
                      </button>
                    )}
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* PHARMACY FIRST */}
      {scanResults?.pharmacy.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2"><Pill size={16} className="text-triage-green" /><h2 className="font-black text-triage-green text-sm">PHARMACY FIRST</h2></div>
          {scanResults.pharmacy.map(c => (
            <GlassCard key={c.id} color="green" className="!p-3 !mb-2">
              <div className="flex items-center gap-2"><span className="text-lg">{c.icon}</span><span className="font-bold text-white text-sm">{c.name}</span><span className="text-[rgba(255,255,255,0.3)] text-xs">({c.ageRange})</span></div>
              {c.exclusions && <div className="text-[rgba(255,255,255,0.35)] text-[10px] mt-1.5">Exclude if: {c.exclusions.join(' · ')}</div>}
            </GlassCard>
          ))}
          <div className="bg-triage-green/6 border border-triage-green/15 rounded-xl p-3 mt-1">
            <div className="text-triage-green font-bold text-[11px] mb-1">📢 SAY TO PATIENT:</div>
            <p className="text-[rgba(255,255,255,0.55)] text-xs italic leading-relaxed">&ldquo;{data.scripts.pharmacyFirst.script}&rdquo;</p>
            <CopyBtn text={data.scripts.pharmacyFirst.script} label="Copy Script" />
          </div>
        </div>
      )}

      {/* CHANGE/WORSENING */}
      {scanResults?.hasChange && (
        <GlassCard color="teal" className="!p-3 mb-4">
          <div className="text-triage-teal font-bold text-xs mb-1">🔄 CHANGE / WORSENING DETECTED</div>
          <div className="text-[rgba(255,255,255,0.5)] text-xs">Words found: <strong className="text-triage-teal">{scanResults.changeWords.join(', ')}</strong></div>
          <div className="text-[rgba(255,255,255,0.4)] text-[11px] mt-1">→ Treat as NEW problem. Do not use self-care. Forward to Tier 2.</div>
        </GlassCard>
      )}

      {/* NEXT STEPS (Tier Guidance) */}
      {hasInput && scanResults?.hasAny && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2"><ArrowRight size={16} className="text-triage-violet" /><h2 className="font-black text-triage-violet text-sm">WHAT TO DO NEXT</h2></div>
          <div className="space-y-2">
            <div className="bg-triage-green/4 border border-triage-green/12 rounded-xl p-3">
              <div className="text-triage-green font-bold text-xs mb-1">TIER 1 — Reception</div>
              <div className="text-[rgba(255,255,255,0.5)] text-xs leading-relaxed">
                {isRed ? 'STOP. Call 999 / advise A&E. Alert duty clinician on site. Do NOT continue triage.'
                  : scanResults?.risk.length > 0 ? 'Forward to Tier 2 with HIGH RISK flag. Do NOT use self-care or Pharmacy First.'
                  : isAmber ? 'Forward to Tier 2 with amber flag details. Include EMIS findings and patient words.'
                  : hasPathway ? 'Signpost to matched pathway. Give patient the contact details above. Safety-net.'
                  : isGreen ? 'Refer to Pharmacy First or send CalmCare/Healthier Together advice. Safety-net.'
                  : 'Forward to Tier 2 if unsure. Include patient words and EMIS findings.'}
              </div>
            </div>
            {!isRed && (
              <div className="bg-triage-amber/4 border border-triage-amber/12 rounded-xl p-3">
                <div className="text-triage-amber font-bold text-xs mb-1">TIER 2 — Triager</div>
                <div className="text-[rgba(255,255,255,0.5)] text-xs leading-relaxed">
                  {scanResults?.hasCancer ? 'ESCALATE to Tier 3. Possible 2WW — do not book routine.'
                    : scanResults?.risk.length > 0 ? 'ESCALATE to Tier 3. High-risk patient with new symptoms.'
                    : isAmber ? 'Book same-day with duty GP. Action within 1 hour for amber flags, 2 hours otherwise.'
                    : 'Check if pathway or self-care was missed. If not clear → escalate to Tier 3 within 2 hours.'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* COPY SUMMARY */}
      {hasInput && scanResults?.hasAny && (
        <button onClick={() => { navigator.clipboard.writeText(buildSummary()); showToast('Summary copied for EMIS'); }}
          className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.7)] rounded-xl py-3 text-center font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[rgba(255,255,255,0.06)] mb-4 active:scale-[0.98] transition-all">
          <Copy size={14} />Copy Summary for EMIS
        </button>
      )}

      {/* QUICK CONTACTS (shown when no input) */}
      {!hasInput && (
        <div className="mt-2">
          <div className="text-[rgba(255,255,255,0.4)] text-xs font-bold mb-2">QUICK CONTACTS</div>
          <div className="grid grid-cols-2 gap-2">
            <a href="tel:999" className="bg-triage-red/10 border border-triage-red/20 rounded-xl p-3 text-center active:scale-95 transition-transform">
              <div className="text-triage-red font-bold text-lg">999</div>
              <div className="text-[rgba(255,255,255,0.3)] text-[10px]">Emergency</div>
            </a>
            <a href="tel:08000288000" className="bg-triage-amber/10 border border-triage-amber/20 rounded-xl p-3 text-center active:scale-95 transition-transform">
              <div className="text-triage-amber font-bold text-xs">0800 028 8000</div>
              <div className="text-[rgba(255,255,255,0.3)] text-[10px]">Crisis Line (24/7)</div>
            </a>
            <a href="tel:02089342802" className="bg-triage-blue/10 border border-triage-blue/20 rounded-xl p-3 text-center active:scale-95 transition-transform">
              <div className="text-triage-blue font-bold text-xs">0208 934 2802</div>
              <div className="text-[rgba(255,255,255,0.3)] text-[10px]">Maternity &gt;18wk</div>
            </a>
            <a href="tel:02089346799" className="bg-triage-blue/10 border border-triage-blue/20 rounded-xl p-3 text-center active:scale-95 transition-transform">
              <div className="text-triage-blue font-bold text-xs">020 8934 6799</div>
              <div className="text-[rgba(255,255,255,0.3)] text-[10px]">Eye Unit (Urgent)</div>
            </a>
          </div>

          {/* Signposting Directory */}
          <div className="text-[rgba(255,255,255,0.4)] text-xs font-bold mb-2 mt-4">SIGNPOSTING DIRECTORY</div>
          <div className="space-y-1.5">
            {[
              { label: 'Eye — CUES/MECS', contact: 'primaryeyecare.co.uk', type: 'web', desc: 'Self-refer to local optician' },
              { label: 'Injury/Burn — UTC', contact: 'NHS 111', type: 'text', desc: 'Richmond UTC Teddington, 8am–8pm' },
              { label: 'Pregnancy booking', contact: 'kingstonmaternity.org.uk/pregnancy/referral-form', type: 'web', desc: 'Self-refer online' },
              { label: 'Maternity >18wk', contact: '0208 934 2802', type: 'phone', desc: '24/7 helpline' },
              { label: 'Sexual Health', contact: '0208 974 9331', type: 'phone', desc: 'Wolverton Centre, self-referral' },
              { label: 'Mental Health', contact: 'swlstg.nhs.uk/kingston-talking-therapies', type: 'web', desc: 'Kingston Talking Therapies, self-refer' },
              { label: 'Pharmacy First', contact: '', type: 'text', desc: 'Sore throat · Earache · Sinusitis · Insect bite · Impetigo · Shingles · UTI (women) · Otitis media' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-2.5">
                <div className="min-w-0 flex-1">
                  <div className="text-[rgba(255,255,255,0.7)] text-xs font-semibold">{s.label}</div>
                  <div className="text-[rgba(255,255,255,0.3)] text-[10px] truncate">{s.desc}</div>
                </div>
                {s.type === 'phone' && (
                  <a href={`tel:${s.contact.replace(/\s/g, '')}`} className="text-triage-blue text-xs font-semibold flex items-center gap-1 ml-2 flex-shrink-0"><Phone size={10} />{s.contact}</a>
                )}
                {s.type === 'web' && (
                  <button onClick={() => window.open(s.contact.startsWith('http') ? s.contact : `https://${s.contact}`, '_blank')}
                    className="text-triage-blue text-[10px] font-semibold flex items-center gap-1 ml-2 flex-shrink-0"><Globe size={10} />Visit</button>
                )}
              </div>
            ))}
          </div>

          <div className="text-center text-[rgba(255,255,255,0.15)] text-[10px] mt-4">
            SOP v3.1 · {sopMeta.practices} · Type above to check symptoms
          </div>
        </div>
      )}

      {/* SAFETY NET (always visible when results shown) */}
      {hasInput && (
        <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-3 mt-2 mb-2">
          <div className="text-[rgba(255,255,255,0.4)] text-[11px]">
            <strong className="text-[rgba(255,255,255,0.6)]">Always safety-net:</strong> &ldquo;If not improving, or you develop chest pain, severe breathlessness, collapse, confusion, or heavy bleeding — call 999.&rdquo;
          </div>
          <div className="text-[rgba(255,255,255,0.25)] text-[10px] mt-1">
            If unsure at any point → ask a clinician · SOP v3.1 · {sopMeta.practices}
          </div>
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
      <div className="text-center text-[rgba(255,255,255,0.4)] mt-8">No scenarios for this topic.</div>
    </div>
  );

  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <BackButton onClick={onBack} />
      <h1 className="text-lg font-black mb-2 flex items-center gap-2 text-white"><GraduationCap size={20} className="text-triage-violet" />Training</h1>

      {/* Progress bar */}
      <div className="glass rounded-xl p-3 border border-[rgba(255,255,255,0.06)] mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[rgba(255,255,255,0.6)] text-xs font-semibold">{completedCount}/{totalCount} completed ({pct}%)</span>
          <button onClick={resetProgress} className="text-[rgba(255,255,255,0.3)] text-[10px] hover:text-triage-red">Reset Progress</button>
        </div>
        <div className="w-full h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
          <div className="h-full bg-triage-green/60 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Topic navigation */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {topicButtons.map(t => {
          const count = t.ids ? scenarios.filter(s => t.ids.includes(s.id)).length : scenarios.length;
          const isActive = selectedTopic === t.key;
          return (
            <button key={t.label} onClick={() => { setSelectedTopic(t.key); setIdx(0); setAnswer(null); setShowResult(false); setFollowUpPart(1); }}
              className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold transition-all ${isActive ? 'bg-triage-violet/15 border-triage-violet/30 text-triage-violet' : 'border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.4)] hover:border-[rgba(255,255,255,0.15)]'}`}>
              {t.label} <span className="text-[rgba(255,255,255,0.25)] ml-0.5">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Scenario counter + score */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[rgba(255,255,255,0.5)] text-sm">{idx + 1}/{filtered.length}{hasFollowUp && <span className="text-triage-teal ml-1.5 text-[10px] font-bold">Part {followUpPart}/{totalParts}</span>}</span>
        <div className="flex items-center gap-2">
          {progress.includes(sc.id) && <span className="text-triage-green text-[10px] font-bold">✅ Done</span>}
          <span className="font-bold text-white text-sm">Score: {score.correct}/{score.total}</span>
        </div>
      </div>

      {/* Scenario card */}
      <GlassCard color="blue">
        <div className="text-triage-blue font-bold mb-2 text-xs">
          📋 ANIMA REQUEST:{hasFollowUp && <span className="text-triage-teal ml-2">{followUpPart === 1 ? 'Initial call' : 'Follow-up'}</span>}
        </div>
        <p className="text-[rgba(255,255,255,0.75)] text-sm leading-relaxed">{currentPart.scenario}</p>
      </GlassCard>

      {/* Options */}
      <div className="mt-3 space-y-2">
        {currentPart.options.map(o => {
          let style = 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)] hover:border-triage-blue/30';
          if (showResult) {
            if (o.id === currentPart.correctAnswer) style = 'bg-[rgba(34,197,94,0.08)] border-[rgba(34,197,94,0.3)]';
            else if (o.id === answer) style = 'bg-[rgba(255,59,92,0.08)] border-[rgba(255,59,92,0.3)]';
            else style = 'opacity-40';
          }
          return <button key={o.id} onClick={() => !showResult && check(o.id)} disabled={showResult} className={`w-full p-3.5 rounded-xl border text-left text-sm text-[rgba(255,255,255,0.75)] transition-all ${style}`}>{o.text}</button>;
        })}
      </div>

      {/* Result */}
      {showResult && (
        <>
          <GlassCard color={answer === currentPart.correctAnswer ? 'green' : 'red'} className="mt-3">
            <div className="font-bold mb-1 text-white text-sm">{answer === currentPart.correctAnswer ? '✅ Correct!' : '❌ Not quite'}</div>
            <p className="text-sm text-[rgba(255,255,255,0.55)]">{currentPart.explanation}</p>
          </GlassCard>
          <div className="mt-3">
            {/* If correct on part 1 with followUp, show "Continue to Part 2" */}
            {hasFollowUp && followUpPart === 1 && answer === currentPart.correctAnswer ? (
              <Button color="teal" full onClick={next}>Continue to Part 2 →</Button>
            ) : hasFollowUp && followUpPart === 1 && answer !== currentPart.correctAnswer ? (
              <div className="text-center text-[rgba(255,255,255,0.35)] text-xs mb-2">Get Part 1 correct to unlock the follow-up scenario.
                {idx < filtered.length - 1 && <div className="mt-2"><Button color="blue" full onClick={() => { setIdx(idx + 1); setAnswer(null); setShowResult(false); setFollowUpPart(1); }}>Skip to Next →</Button></div>}
              </div>
            ) : idx < filtered.length - 1 ? (
              <Button color="blue" full onClick={next}>Next →</Button>
            ) : (
              <div className="text-center">
                <div className="text-xl font-black mb-3 text-white">{score.correct}/{score.total}</div>
                <Button color="green" onClick={restart}>Restart Topic</Button>
              </div>
            )}
          </div>
        </>
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
      case 'version-history': return <div key={idx} className="space-y-2 mb-3">{block.items.map((item, i) => <div key={i} className="bg-[rgba(167,139,250,0.04)] border border-[rgba(167,139,250,0.12)] rounded-xl p-3"><div className="flex items-center gap-2 mb-1"><span className="text-triage-violet font-bold text-sm">{item.version}</span><span className="text-[rgba(255,255,255,0.3)] text-xs">{item.date}</span><span className="text-[rgba(255,255,255,0.25)] text-xs">{item.author}</span></div><div className="text-[rgba(255,255,255,0.55)] text-xs">{item.changes}</div></div>)}</div>;
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
    { id: 'home', icon: Zap, label: 'Triage' },
    { id: 'check', icon: ClipboardCheck, label: 'Check' },
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
      case 'check': return <SymptomChecker data={data} showToast={showToast} />;
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
