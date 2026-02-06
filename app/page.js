'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Search, Phone, AlertTriangle, CheckCircle, Clock, ChevronRight, 
  ChevronLeft, Copy, Check, History, Home, X, AlertCircle, FileText,
  Shield, Pill, GraduationCap, Settings, Info, LogOut, Lock, User, 
  Save, Download, Upload, Plus, Trash2, Edit, RefreshCw, Eye, EyeOff,
  ExternalLink, Globe, BookOpen, ChevronDown, ChevronUp
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
  trainingScenarios as defaultTraining
} from '../lib/data';
import { sopMeta, sopSections } from '../lib/sop-content';
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

  useEffect(() => {
    setCustomData(getCustomData());
    setLoaded(true);
  }, []);

  const get = (key, defaultVal) => customData?.[key] || defaultVal;
  
  const update = (key, value) => {
    const newData = { ...customData, [key]: value };
    setCustomData(newData);
    saveCustomData(newData);
  };

  const reset = () => {
    clearCustomData();
    setCustomData(null);
  };

  return {
    loaded,
    redFlags: get('redFlags', defaultRedFlags),
    amberFlags: get('amberFlags', defaultAmberFlags),
    highRiskGroups: get('highRiskGroups', defaultHighRiskGroups),
    pharmacyFirst: get('pharmacyFirst', defaultPharmacyFirst),
    directBooking: get('directBooking', defaultDirectBooking),
    contacts: get('contacts', defaultContacts),
    scripts: get('scripts', defaultScripts),
    pathways: get('pathways', defaultPathways),
    training: get('training', defaultTraining),
    update,
    reset,
    customData
  };
}

// ============ DESIGN SYSTEM ============
const C = {
  red: { text: 'text-triage-red', bg: 'bg-[rgba(255,59,92,0.06)]', border: 'border-[rgba(255,59,92,0.2)]', glow: 'glow-red', dot: 'bg-triage-red' },
  amber: { text: 'text-triage-amber', bg: 'bg-[rgba(255,159,28,0.06)]', border: 'border-[rgba(255,159,28,0.2)]', glow: 'glow-amber', dot: 'bg-triage-amber' },
  green: { text: 'text-triage-green', bg: 'bg-[rgba(34,197,94,0.06)]', border: 'border-[rgba(34,197,94,0.2)]', glow: 'glow-green', dot: 'bg-triage-green' },
  blue: { text: 'text-triage-blue', bg: 'bg-[rgba(108,142,255,0.06)]', border: 'border-[rgba(108,142,255,0.2)]', glow: 'glow-blue', dot: 'bg-triage-blue' },
  teal: { text: 'text-triage-teal', bg: 'bg-[rgba(78,205,196,0.06)]', border: 'border-[rgba(78,205,196,0.2)]', glow: 'glow-teal', dot: 'bg-triage-teal' },
  violet: { text: 'text-triage-violet', bg: 'bg-[rgba(167,139,250,0.06)]', border: 'border-[rgba(167,139,250,0.2)]', glow: 'glow-violet', dot: 'bg-triage-violet' },
  gray: { text: 'text-[rgba(255,255,255,0.6)]', bg: 'bg-[rgba(255,255,255,0.03)]', border: 'border-[rgba(255,255,255,0.08)]', glow: '', dot: 'bg-[rgba(255,255,255,0.3)]' },
};

// ============ UI COMPONENTS ============
const EmergencyBanner = () => (
  <div className="emergency-banner text-white py-3 px-4 text-center font-bold sticky top-0 z-50">
    <span className="animate-pulse mr-2">🚨</span>
    EMERGENCY? Chest pain, can't breathe, collapse, stroke → 
    <a href="tel:999" className="underline ml-2 text-xl font-black">CALL 999</a>
  </div>
);

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const styles = {
    success: 'bg-triage-green/90 text-white',
    error: 'bg-triage-red/90 text-white',
    info: 'bg-triage-blue/90 text-white'
  };
  return (
    <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 ${styles[type] || styles.info} px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-2 backdrop-blur-xl animate-toast`}>
      {type === 'success' && <Check size={18} />}
      {type === 'error' && <X size={18} />}
      <span className="font-semibold text-sm">{message}</span>
    </div>
  );
};

const GlassCard = ({ children, color = 'gray', onClick, className = '', glow = false }) => {
  const c = C[color] || C.gray;
  return (
    <div 
      onClick={onClick} 
      className={`${c.bg} border ${c.border} rounded-2xl p-4 mb-3 transition-all duration-200 ${glow ? c.glow : ''} ${onClick ? 'cursor-pointer hover:bg-[rgba(255,255,255,0.05)] active:scale-[0.98]' : ''} ${className}`}
    >
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
  <button onClick={onClick} className="flex items-center gap-1 text-triage-blue mb-4 py-2 hover:text-triage-blue/80 transition-colors font-medium">
    <ChevronLeft size={20} /> Back
  </button>
);

const StepIndicator = ({ num, color }) => {
  const c = C[color] || C.gray;
  return (
    <div className={`w-11 h-11 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center font-black text-lg ${c.text}`}>
      {num}
    </div>
  );
};

const ScriptBox = ({ title, script, onCopy }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(script); setCopied(true); onCopy?.(); setTimeout(() => setCopied(false), 2000); };
  return (
    <GlassCard color="green" className="mt-4">
      <div className="flex items-center gap-2 text-triage-green font-bold mb-2 text-sm tracking-wide">📢 {title}</div>
      <p className="text-[rgba(255,255,255,0.65)] text-sm leading-relaxed mb-3 italic">"{script}"</p>
      <button onClick={copy} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all ${copied ? 'bg-triage-green/20 border-triage-green/40 text-triage-green' : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.06)]'}`}>
        {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Script</>}
      </button>
    </GlassCard>
  );
};

const PhoneLink = ({ service, number, hours, priority = 'normal', icon, website, address }) => {
  const color = priority === 'red' ? 'red' : priority === 'amber' ? 'amber' : 'blue';
  const c = C[color];
  
  const openWebsite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = website.startsWith('http') ? website : `https://${website}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
        <button 
          onClick={openWebsite}
          className="mt-3 flex items-center gap-2 text-sm px-3 py-2.5 bg-[rgba(255,255,255,0.04)] rounded-xl border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.08)] transition-colors w-full justify-center font-medium text-[rgba(255,255,255,0.6)]"
        >
          <Globe size={16} />
          Visit Website
          <ExternalLink size={14} />
        </button>
      )}
    </GlassCard>
  );
};

// ============ USER BADGE ============
const UserBadge = ({ session, onLogout }) => (
  <div className="flex items-center justify-between glass border-b border-[rgba(255,255,255,0.06)] px-4 py-2.5">
    <div className="flex items-center gap-2 text-sm">
      <div className="w-7 h-7 rounded-lg bg-triage-blue/20 flex items-center justify-center">
        <User size={14} className="text-triage-blue" />
      </div>
      <span className="text-[rgba(255,255,255,0.6)] font-medium">{session.name}</span>
      {session.role === 'admin' && <span className="bg-triage-blue/20 text-triage-blue text-xs px-2 py-0.5 rounded-lg font-semibold">Admin</span>}
    </div>
    <button onClick={onLogout} className="flex items-center gap-1.5 text-[rgba(255,255,255,0.4)] hover:text-triage-red text-sm transition-colors font-medium"><LogOut size={14} />Logout</button>
  </div>
);

// ============ NAV BAR ============
const NavBar = ({ screen, onNav, isAdminUser }) => {
  const items = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'contacts', icon: Phone, label: 'Contacts' },
    { id: 'sop', icon: BookOpen, label: 'SOP' },
    { id: isAdminUser ? 'admin' : 'training', icon: isAdminUser ? Settings : GraduationCap, label: isAdminUser ? 'Admin' : 'Training' }
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-elevated border-t border-[rgba(255,255,255,0.06)] flex justify-around py-2 z-40">
      {items.map(i => (
        <button key={i.id} onClick={() => onNav(i.id)}
          className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${screen === i.id ? 'text-triage-blue bg-triage-blue/10' : 'text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.6)]'}`}>
          <i.icon size={22} /><span className="text-xs mt-1 font-medium">{i.label}</span>
        </button>
      ))}
    </nav>
  );
};

// ============ PASSWORD CHANGE MODAL ============
const PasswordChangeModal = ({ userId, isFirstLogin, onComplete, onCancel, toast }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) { setError('New passwords do not match'); return; }
    const validation = validatePassword(newPassword);
    if (!validation.valid) { setError(validation.message); return; }
    setLoading(true);
    const result = await changePassword(userId, currentPassword, newPassword);
    setLoading(false);
    if (result.success) { toast('Password changed successfully', 'success'); onComplete(); }
    else { setError(result.message); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade">
      <div className="glass-elevated rounded-3xl shadow-2xl w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-triage-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="text-triage-blue" size={32} />
          </div>
          <h2 className="text-xl font-bold text-white">{isFirstLogin ? 'Set Your Password' : 'Change Password'}</h2>
          {isFirstLogin && <p className="text-[rgba(255,255,255,0.4)] text-sm mt-2">For security, please set a new password before continuing.</p>}
        </div>
        <form onSubmit={handleSubmit}>
          {!isFirstLogin && <Input label="Current Password" type={showPasswords ? 'text' : 'password'} value={currentPassword} onChange={setCurrentPassword} placeholder="Enter current password" required />}
          <Input label="New Password" type={showPasswords ? 'text' : 'password'} value={newPassword} onChange={setNewPassword} placeholder="Enter new password" required />
          <Input label="Confirm New Password" type={showPasswords ? 'text' : 'password'} value={confirmPassword} onChange={setConfirmPassword} placeholder="Confirm new password" required />
          <div className="flex items-center gap-2 mb-4 text-sm text-[rgba(255,255,255,0.5)]">
            <input type="checkbox" id="showPw" checked={showPasswords} onChange={(e) => setShowPasswords(e.target.checked)} className="rounded accent-triage-blue" />
            <label htmlFor="showPw">Show passwords</label>
          </div>
          <div className="bg-[rgba(255,255,255,0.03)] p-3 rounded-xl mb-4 text-sm text-[rgba(255,255,255,0.5)] border border-[rgba(255,255,255,0.06)]">
            <strong className="text-[rgba(255,255,255,0.7)]">Password requirements:</strong>
            <ul className="mt-1.5 space-y-0.5 ml-4 list-disc"><li>At least 8 characters</li><li>One uppercase letter</li><li>One lowercase letter</li><li>One number</li></ul>
          </div>
          {error && <div className="bg-triage-red/10 text-triage-red px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2 border border-triage-red/20"><AlertCircle size={18} />{error}</div>}
          <div className="flex gap-3">
            {!isFirstLogin && <Button type="button" color="gray" onClick={onCancel} full>Cancel</Button>}
            <Button type="submit" color="solid" full disabled={loading}>
              {loading ? <RefreshCw size={20} className="animate-spin" /> : 'Set Password'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ LOGIN SCREEN ============
const LoginScreen = ({ onLogin, toast }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const settings = getSettings();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (isLockedOut()) { setError(`Account locked. Try again in ${getLockoutRemaining()} minutes.`); return; }
    setLoading(true);
    const result = await authenticateUser(username, password);
    setLoading(false);
    if (result.session) { toast(`Welcome, ${result.session.name}!`, 'success'); onLogin(result.session); }
    else { setError(result.error || 'Invalid username or password'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0A0A0F 0%, #0F1A2E 50%, #0A0A0F 100%)' }}>
      <div className="glass-elevated rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-slide">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-triage-blue/30 to-triage-violet/20 flex items-center justify-center mx-auto mb-4 border border-triage-blue/20">
            <Shield className="text-triage-blue" size={40} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Reception Triage Guide</h1>
          <p className="text-[rgba(255,255,255,0.4)] mt-1 font-medium">{settings.practiceName}</p>
          <p className="text-sm text-[rgba(255,255,255,0.25)] mt-1">Staff Login</p>
        </div>
        <form onSubmit={submit}>
          <Input label="Username" value={username} onChange={setUsername} placeholder="Enter username" required />
          <div className="mb-4">
            <label className="block text-sm font-medium text-[rgba(255,255,255,0.6)] mb-1.5">Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter password" required className="w-full px-4 py-3 pr-12 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] focus:border-triage-blue/50 focus:outline-none text-white transition-all" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)] hover:text-white">
                {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {error && <div className="bg-triage-red/10 text-triage-red px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2 border border-triage-red/20"><AlertCircle size={18} />{error}</div>}
          <Button type="submit" color="solid" full size="lg" disabled={loading}>
            {loading ? <><RefreshCw size={20} className="animate-spin" />Signing in...</> : <><Lock size={20} />Sign In</>}
          </Button>
        </form>
        <p className="text-center text-sm text-[rgba(255,255,255,0.2)] mt-6">For staff use only · v{settings.version}</p>
      </div>
    </div>
  );
};

// ============ ADMIN CONSOLE ============
const AdminConsole = ({ onBack, data, toast }) => {
  const [tab, setTab] = useState('settings');
  const [settings, setSettingsState] = useState(getSettings());
  const [users, setUsersState] = useState(getUsers());
  const [editContact, setEditContact] = useState(null);
  const [editScript, setEditScript] = useState(null);
  const [auditLog] = useState(getAuditLog());
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', name: '', role: 'staff' });
  const [userError, setUserError] = useState('');

  const tabs = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'users', label: 'Users', icon: User },
    { id: 'contacts', label: 'Contacts', icon: Phone },
    { id: 'scripts', label: 'Scripts', icon: FileText },
    { id: 'backup', label: 'Backup', icon: Download },
    { id: 'audit', label: 'Audit', icon: History }
  ];

  const handleSaveSettings = () => { saveSettings(settings); toast('Settings saved'); };
  const handleSaveUsers = async () => { await saveUsers(users); toast('Users saved'); };
  const handleExport = () => { exportAllData(); toast('Backup downloaded'); };
  const handleImport = e => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        const result = importAllData(ev.target.result);
        toast(result.message, result.success ? 'success' : 'error');
        if (result.success) { setSettingsState(getSettings()); setUsersState(getUsers()); }
      };
      reader.readAsText(file);
    }
  };
  const handleReset = () => {
    if (confirm('Reset ALL custom content to defaults? This cannot be undone.')) {
      data.reset();
      toast('Reset complete. Refresh to see changes.');
    }
  };
  const updateContact = (idx, field, val) => {
    const c = [...data.contacts];
    c[idx] = { ...c[idx], [field]: val };
    data.update('contacts', c);
  };
  const updateScript = (key, val) => {
    const s = { ...data.scripts, [key]: { ...data.scripts[key], script: val } };
    data.update('scripts', s);
    toast('Script saved');
  };
  const handleAddUser = async () => {
    setUserError('');
    if (!newUser.username || !newUser.password || !newUser.name) { setUserError('All fields are required'); return; }
    const result = await addUser(newUser);
    if (result.success) {
      setUsersState(getUsers());
      setShowAddUser(false);
      setNewUser({ username: '', password: '', name: '', role: 'staff' });
      toast('User added successfully');
    } else { setUserError(result.message); }
  };

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto">
      <BackButton onClick={onBack} />
      <h1 className="text-2xl font-black mb-2 flex items-center gap-2 text-white"><Settings size={24} className="text-triage-violet" />Admin Console</h1>
      <p className="text-[rgba(255,255,255,0.4)] mb-4 text-sm">Manage settings, users, and content</p>

      <div className="flex gap-1.5 overflow-x-auto pb-4 mb-4 -mx-1 px-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${tab === t.id ? 'bg-triage-violet/20 text-triage-violet border border-triage-violet/30' : 'bg-[rgba(255,255,255,0.03)] text-[rgba(255,255,255,0.4)] border border-transparent hover:text-[rgba(255,255,255,0.6)]'}`}>
            <t.icon size={16} />{t.label}
          </button>
        ))}
      </div>

      {tab === 'settings' && (
        <div className="space-y-4">
          <Input label="Practice Name" value={settings.practiceName} onChange={v => setSettingsState({...settings, practiceName: v})} />
          <Input label="ICB Area" value={settings.icbArea} onChange={v => setSettingsState({...settings, icbArea: v})} />
          <Input label="Clinical Owner" value={settings.clinicalOwner} onChange={v => setSettingsState({...settings, clinicalOwner: v})} />
          <Input label="Review Date" type="date" value={settings.reviewDate} onChange={v => setSettingsState({...settings, reviewDate: v})} />
          <Input label="Session Timeout (minutes)" type="number" value={settings.sessionTimeoutMinutes} onChange={v => setSettingsState({...settings, sessionTimeoutMinutes: parseInt(v)})} />
          <Button onClick={handleSaveSettings} color="green" full><Save size={18} />Save Settings</Button>
        </div>
      )}

      {tab === 'users' && (
        <div className="space-y-4">
          <GlassCard color="blue">
            <div className="text-sm text-[rgba(255,255,255,0.5)]">
              <strong className="text-triage-blue">Note:</strong> Users with "must change password" will be prompted on login.
            </div>
          </GlassCard>
          <Button onClick={() => setShowAddUser(true)} color="blue"><Plus size={18} /> Add New User</Button>
          {showAddUser && (
            <GlassCard color="blue">
              <h4 className="font-bold mb-3 text-white">Add New User</h4>
              <Input label="Username" value={newUser.username} onChange={v => setNewUser({...newUser, username: v})} placeholder="e.g., sarah.jones" />
              <Input label="Display Name" value={newUser.name} onChange={v => setNewUser({...newUser, name: v})} placeholder="e.g., Sarah Jones" />
              <Input label="Initial Password" value={newUser.password} onChange={v => setNewUser({...newUser, password: v})} placeholder="Min 8 chars, 1 upper, 1 lower, 1 number" />
              <div className="mb-4">
                <label className="block text-sm font-medium text-[rgba(255,255,255,0.6)] mb-1.5">Role</label>
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] focus:border-triage-blue/50 focus:outline-none text-white">
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {userError && <div className="bg-triage-red/10 text-triage-red px-4 py-2 rounded-xl mb-4 text-sm border border-triage-red/20">{userError}</div>}
              <div className="flex gap-2">
                <Button onClick={handleAddUser} color="green" size="sm"><Check size={16} />Add User</Button>
                <Button onClick={() => {setShowAddUser(false); setUserError('');}} color="gray" size="sm">Cancel</Button>
              </div>
            </GlassCard>
          )}
          {users.map((u, i) => (
            <GlassCard key={u.id}>
              <div className="flex items-center gap-2 mb-3">
                <User size={20} className="text-[rgba(255,255,255,0.4)]" />
                <span className="font-bold text-white">{u.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-lg font-semibold ${u.role === 'admin' ? 'bg-triage-blue/20 text-triage-blue' : 'bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.5)]'}`}>{u.role}</span>
                {u.mustChangePassword && <span className="text-xs px-2 py-0.5 rounded-lg bg-triage-amber/20 text-triage-amber font-semibold">Must change password</span>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Username" value={u.username} onChange={v => { const n = [...users]; n[i].username = v; setUsersState(n); }} />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[rgba(255,255,255,0.6)] mb-1.5">Password</label>
                  <input type="text" value={u.password.length > 50 ? '••••••••' : u.password}
                    onChange={v => { const n = [...users]; n[i].password = v.target.value; n[i].mustChangePassword = true; setUsersState(n); }}
                    disabled={u.password.length > 50} placeholder={u.password.length > 50 ? 'Hashed - user must reset' : 'Enter password'}
                    className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] focus:border-triage-blue/50 focus:outline-none text-white disabled:opacity-40 transition-all" />
                  {u.password.length > 50 && <p className="text-xs text-[rgba(255,255,255,0.3)] mt-1">Password is hashed. User can change via login.</p>}
                </div>
              </div>
              <Input label="Display Name" value={u.name} onChange={v => { const n = [...users]; n[i].name = v; setUsersState(n); }} />
            </GlassCard>
          ))}
          <Button onClick={handleSaveUsers} color="green" full><Save size={18} />Save Users</Button>
        </div>
      )}

      {tab === 'contacts' && (
        <div className="space-y-3">
          <p className="text-sm text-[rgba(255,255,255,0.4)] mb-4">Edit contact numbers and websites.</p>
          {data.contacts.map((c, i) => (
            <GlassCard key={c.id}>
              {editContact === i ? (
                <div className="space-y-3">
                  <Input label="Service" value={c.service} onChange={v => updateContact(i, 'service', v)} />
                  <Input label="Number" value={c.number} onChange={v => updateContact(i, 'number', v)} />
                  <Input label="Hours" value={c.hours} onChange={v => updateContact(i, 'hours', v)} />
                  <Input label="Website (optional)" value={c.website || ''} onChange={v => updateContact(i, 'website', v)} placeholder="e.g., nhs.uk" />
                  <Button onClick={() => setEditContact(null)} size="sm"><Check size={16} />Done</Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{c.service}</div>
                    <div className="text-sm text-[rgba(255,255,255,0.4)]">{c.number} · {c.hours}</div>
                    {c.website && <div className="text-sm text-triage-blue">{c.website}</div>}
                  </div>
                  <button onClick={() => setEditContact(i)} className="text-triage-blue p-2 rounded-xl hover:bg-triage-blue/10 transition-colors"><Edit size={18} /></button>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}

      {tab === 'scripts' && (
        <div className="space-y-4">
          <p className="text-sm text-[rgba(255,255,255,0.4)] mb-4">Edit the ready-to-use scripts for staff.</p>
          {Object.entries(data.scripts).map(([key, s]) => (
            <GlassCard key={key}>
              <div className="font-semibold mb-2 text-white">{s.title}</div>
              {editScript === key ? (
                <div>
                  <TextArea value={s.script} onChange={v => updateScript(key, v)} rows={4} />
                  <Button onClick={() => setEditScript(null)} size="sm"><Check size={16} />Save</Button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-[rgba(255,255,255,0.45)] italic mb-2">"{s.script}"</p>
                  <button onClick={() => setEditScript(key)} className="text-triage-blue text-sm flex items-center gap-1 hover:text-triage-blue/80 font-medium"><Edit size={14} />Edit</button>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}

      {tab === 'backup' && (
        <div className="space-y-4">
          <GlassCard>
            <h3 className="font-bold mb-2 text-white">Export Backup</h3>
            <p className="text-sm text-[rgba(255,255,255,0.4)] mb-4">Download settings and content (passwords are not exported).</p>
            <Button onClick={handleExport} color="blue"><Download size={18} />Export Backup</Button>
          </GlassCard>
          <GlassCard>
            <h3 className="font-bold mb-2 text-white">Import Backup</h3>
            <p className="text-sm text-[rgba(255,255,255,0.4)] mb-4">Restore settings and content from a backup file.</p>
            <label className="inline-flex items-center gap-2 px-5 py-3 bg-triage-blue/20 text-triage-blue border border-triage-blue/30 rounded-xl font-semibold cursor-pointer hover:bg-triage-blue/30 transition-colors">
              <Upload size={18} />Import Backup
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </GlassCard>
          <GlassCard color="red">
            <h3 className="font-bold mb-2 text-white">Reset to Defaults</h3>
            <p className="text-sm text-[rgba(255,255,255,0.4)] mb-4">Remove all custom content. Cannot be undone.</p>
            <Button onClick={handleReset} color="red"><RefreshCw size={18} />Reset All</Button>
          </GlassCard>
        </div>
      )}

      {tab === 'audit' && (
        <div>
          <h3 className="font-bold mb-4 text-white">Recent Activity</h3>
          {auditLog.length === 0 ? (
            <p className="text-[rgba(255,255,255,0.3)] text-center py-8">No activity logged yet</p>
          ) : (
            <div className="space-y-1">
              {auditLog.slice(0, 50).map((log, i) => (
                <div key={i} className="flex justify-between items-center py-2.5 border-b border-[rgba(255,255,255,0.04)] text-sm">
                  <div>
                    <span className="text-[rgba(255,255,255,0.7)]">{log.action}</span>
                    {log.userId && <span className="text-[rgba(255,255,255,0.25)] ml-2">({log.userId})</span>}
                  </div>
                  <span className="text-[rgba(255,255,255,0.3)] text-xs">{new Date(log.timestamp).toLocaleString('en-GB')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============ SOP VIEWER ============
const SOPScreen = ({ onBack }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSections = searchTerm.length >= 2 
    ? sopSections.filter(s => {
        const text = JSON.stringify(s).toLowerCase();
        return text.includes(searchTerm.toLowerCase());
      })
    : sopSections;

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const renderContentBlock = (block, idx) => {
    switch (block.type) {
      case 'text':
        return <p key={idx} className="text-[rgba(255,255,255,0.65)] text-sm leading-relaxed mb-3">{block.text}</p>;
      
      case 'highlight': {
        const color = block.color === 'red' ? 'red' : block.color === 'amber' ? 'amber' : block.color === 'green' ? 'green' : 'blue';
        const c = C[color];
        return (
          <div key={idx} className={`${c.bg} border ${c.border} rounded-xl p-3.5 mb-3`}>
            <div className="flex items-start gap-2">
              <div className={`w-2 h-2 rounded-full ${c.dot} mt-1.5 flex-shrink-0`} style={{ boxShadow: `0 0 8px currentColor` }} />
              <span className={`${c.text} font-semibold text-sm`}>{block.text}</span>
            </div>
          </div>
        );
      }
      
      case 'list': {
        const color = block.color === 'red' ? 'red' : block.color === 'amber' ? 'amber' : block.color === 'green' ? 'green' : 'blue';
        const c = C[color];
        return (
          <div key={idx} className="mb-3">
            {block.title && <div className={`${c.text} font-bold text-sm mb-2`}>{block.title}</div>}
            <div className="space-y-1.5">
              {block.items.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 pl-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${c.dot} mt-2 flex-shrink-0 opacity-60`} />
                  <span className="text-[rgba(255,255,255,0.6)] text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'steps':
        return (
          <div key={idx} className="space-y-2 mb-3">
            {block.items.map((item, i) => {
              const color = item.color === 'red' ? 'red' : item.color === 'amber' ? 'amber' : item.color === 'green' ? 'green' : item.color === 'blue' ? 'blue' : 'gray';
              const c = C[color];
              return (
                <div key={i} className={`${c.bg} border ${c.border} rounded-xl p-3`}>
                  <div className="flex items-start gap-3">
                    {item.step && <div className={`w-7 h-7 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0 font-bold text-xs ${c.text}`}>{item.step}</div>}
                    <div className="flex-1 min-w-0">
                      <div className={`${c.text} font-bold text-sm`}>{item.label}</div>
                      {item.detail && <div className="text-[rgba(255,255,255,0.4)] text-xs mt-0.5">{item.detail}</div>}
                      <div className="text-[rgba(255,255,255,0.55)] text-xs mt-1 font-medium">→ {item.action}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'table':
        return (
          <div key={idx} className="overflow-x-auto mb-3">
            <table className="w-full text-sm">
              <thead>
                <tr>{block.headers.map((h, i) => <th key={i} className="text-left text-[rgba(255,255,255,0.5)] font-semibold pb-2 pr-3 text-xs border-b border-[rgba(255,255,255,0.06)]">{h}</th>)}</tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i} className="border-b border-[rgba(255,255,255,0.03)]">
                    {row.map((cell, j) => (
                      <td key={j} className={`py-2.5 pr-3 text-xs ${j === 0 ? 'text-[rgba(255,255,255,0.8)] font-medium' : j === row.length - 1 ? 'text-triage-amber' : 'text-[rgba(255,255,255,0.5)]'}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'script':
        return (
          <div key={idx} className="bg-[rgba(34,197,94,0.04)] border border-[rgba(34,197,94,0.15)] rounded-xl p-3.5 mb-3">
            <div className="text-triage-green font-bold text-xs mb-1.5 tracking-wide">📢 {block.title}</div>
            <p className="text-[rgba(255,255,255,0.55)] text-sm italic leading-relaxed">"{block.text}"</p>
          </div>
        );

      case 'checklist': {
        const c = C[block.color] || C.green;
        return (
          <div key={idx} className="mb-3">
            {block.title && <div className={`${c.text} font-bold text-sm mb-2`}>{block.title}</div>}
            <div className="space-y-1.5">
              {block.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-[rgba(255,255,255,0.6)]">
                  <div className="w-4 h-4 rounded border border-triage-green/40 bg-triage-green/10 flex items-center justify-center flex-shrink-0">
                    <Check size={10} className="text-triage-green" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'do-dont':
        return (
          <div key={idx} className="space-y-2 mb-3">
            {block.donts.map((d, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[rgba(255,59,92,0.06)] border border-[rgba(255,59,92,0.15)] rounded-lg p-2.5">
                  <span className="text-triage-red font-semibold">✗ </span><span className="text-[rgba(255,255,255,0.5)]">{d.bad}</span>
                </div>
                {d.good && (
                  <div className="bg-[rgba(34,197,94,0.06)] border border-[rgba(34,197,94,0.15)] rounded-lg p-2.5">
                    <span className="text-triage-green font-semibold">✓ </span><span className="text-[rgba(255,255,255,0.5)]">{d.good}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'two-column':
        return (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            {[block.left, block.right].filter(Boolean).map((col, ci) => (
              <div key={ci} className="bg-[rgba(108,142,255,0.04)] border border-[rgba(108,142,255,0.12)] rounded-xl p-3.5">
                <div className="text-triage-blue font-bold text-sm mb-2">{col.title}</div>
                {col.link && <a href={col.link} target="_blank" rel="noopener noreferrer" className="text-triage-blue text-xs underline mb-2 block">{col.link}</a>}
                <div className="space-y-1">
                  {col.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[rgba(255,255,255,0.55)]">
                      <span className="text-triage-blue mt-0.5">•</span>{item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'conditions':
        return (
          <div key={idx} className="mb-3">
            {block.title && <div className="text-triage-green font-bold text-sm mb-2">{block.title}</div>}
            <div className="flex flex-wrap gap-2">
              {block.items.map((item, i) => (
                <div key={i} className="bg-[rgba(34,197,94,0.06)] border border-[rgba(34,197,94,0.15)] rounded-lg px-3 py-1.5 text-xs">
                  <span className="text-[rgba(255,255,255,0.7)] font-medium">{item.name}</span>
                  <span className="text-[rgba(255,255,255,0.35)] ml-1.5">{item.age}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'red-flags-table':
        return (
          <div key={idx} className="space-y-2 mb-3">
            {block.items.map((item, i) => (
              <div key={i} className="bg-[rgba(255,59,92,0.04)] border border-[rgba(255,59,92,0.12)] rounded-xl p-3 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-triage-red mt-1.5 flex-shrink-0" style={{ boxShadow: '0 0 8px rgba(255,59,92,0.5)' }} />
                <div>
                  <div className="text-[rgba(255,255,255,0.7)] text-sm leading-relaxed">{item.symptom}</div>
                  <div className="text-triage-red font-bold text-xs mt-1">→ {item.action}</div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'amber-table':
        return (
          <div key={idx} className="space-y-2 mb-3">
            {block.items.map((item, i) => (
              <div key={i} className="bg-[rgba(255,159,28,0.04)] border border-[rgba(255,159,28,0.12)] rounded-xl p-3">
                <div className="text-triage-amber font-bold text-xs mb-1">{item.category}</div>
                <div className="text-[rgba(255,255,255,0.55)] text-xs leading-relaxed mb-1.5">{item.buzzwords}</div>
                <div className="text-triage-amber text-xs font-medium">→ {item.action}</div>
              </div>
            ))}
          </div>
        );

      case 'risk-groups':
        return (
          <div key={idx} className="space-y-2 mb-3">
            {block.items.map((item, i) => (
              <div key={i} className="bg-[rgba(255,159,28,0.04)] border border-[rgba(255,159,28,0.12)] rounded-xl p-3">
                <div className="text-[rgba(255,255,255,0.8)] font-semibold text-sm mb-1">{item.group}</div>
                <div className="text-[rgba(255,255,255,0.5)] text-xs">{item.action}</div>
              </div>
            ))}
          </div>
        );

      case 'subsection':
        return (
          <div key={idx} className="mb-4">
            <h4 className="text-triage-blue font-bold text-sm mb-2">{block.title}</h4>
            {block.content.map((sub, si) => renderContentBlock(sub, `${idx}-${si}`))}
          </div>
        );

      case 'contact':
        return (
          <div key={idx} className="flex items-center justify-between bg-[rgba(108,142,255,0.04)] border border-[rgba(108,142,255,0.12)] rounded-lg p-2.5 mb-2">
            <div>
              <div className="text-[rgba(255,255,255,0.7)] text-sm font-medium">{block.service}</div>
              {block.hours && <div className="text-[rgba(255,255,255,0.35)] text-xs">{block.hours}</div>}
            </div>
            <a href={`tel:${block.number.replace(/\s/g, '')}`} className="text-triage-blue font-bold text-sm">{block.number}</a>
          </div>
        );

      case 'link':
        return (
          <a key={idx} href={block.url} target="_blank" rel="noopener noreferrer" className="text-triage-blue text-sm underline mb-2 block flex items-center gap-1">
            {block.text} <ExternalLink size={12} />
          </a>
        );

      case 'decision-tree':
        return (
          <div key={idx} className="mb-3">
            {block.title && <div className="text-[rgba(255,255,255,0.7)] font-bold text-sm mb-2">{block.title}</div>}
            {block.items.map((item, i) => (
              <div key={i} className="mb-3">
                <div className="text-triage-blue font-semibold text-sm mb-2">{item.question}</div>
                <div className="space-y-2 pl-3 border-l-2 border-[rgba(108,142,255,0.2)]">
                  {item.branches.map((branch, bi) => (
                    <div key={bi}>
                      <div className="text-triage-amber font-bold text-xs mb-1">{branch.label}</div>
                      <div className="space-y-1">
                        {branch.steps.map((step, si) => (
                          <div key={si} className="text-[rgba(255,255,255,0.5)] text-xs leading-relaxed flex items-start gap-2">
                            <span className="text-[rgba(255,255,255,0.2)]">→</span>{step}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'econsult-table':
        return (
          <div key={idx} className="space-y-2 mb-3">
            {block.items.map((item, i) => (
              <div key={i} className="bg-[rgba(78,205,196,0.04)] border border-[rgba(78,205,196,0.12)] rounded-xl p-3">
                <div className="text-triage-teal font-bold text-xs mb-1">{item.category}</div>
                <div className="text-[rgba(255,255,255,0.55)] text-xs mb-1.5"><span className="text-[rgba(255,255,255,0.3)]">Examples:</span> {item.examples}</div>
                <div className="text-triage-red/80 text-xs"><span className="text-[rgba(255,255,255,0.3)]">Exclude:</span> {item.exclude}</div>
              </div>
            ))}
          </div>
        );

      case 'services':
        return (
          <div key={idx} className="space-y-2 mb-3">
            {block.items.map((item, i) => (
              <div key={i} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-3">
                <div className="text-[rgba(255,255,255,0.85)] font-semibold text-sm">{item.service}</div>
                <div className="text-[rgba(255,255,255,0.45)] text-xs mt-0.5">{item.bestFor}</div>
                <div className="text-triage-blue text-xs mt-1">{item.access}</div>
                {item.notes && <div className="text-[rgba(255,255,255,0.3)] text-xs mt-0.5">{item.notes}</div>}
              </div>
            ))}
          </div>
        );

      case 'providers':
        return (
          <div key={idx} className="space-y-2 mb-3">
            {block.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-3">
                <div>
                  <div className="text-[rgba(255,255,255,0.8)] font-semibold text-sm">{item.name}</div>
                  <div className="text-[rgba(255,255,255,0.35)] text-xs">{item.locations}</div>
                </div>
                <a href={`tel:${item.number.replace(/\s/g, '')}`} className="text-triage-blue font-bold text-sm">{item.number}</a>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <h1 className="text-2xl font-black mb-1 flex items-center gap-2 text-white">
        <BookOpen size={24} className="text-triage-violet" />Triage SOP
      </h1>
      <p className="text-[rgba(255,255,255,0.4)] text-sm mb-1">
        {sopMeta.practices} · v{sopMeta.version}
      </p>
      <p className="text-[rgba(255,255,255,0.25)] text-xs mb-4">
        Owner: {sopMeta.owner} · Review: {sopMeta.reviewDate}
      </p>

      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search SOP sections..." />

      <div className="space-y-2 stagger">
        {filteredSections.map((section) => {
          const isExpanded = expandedSection === section.id;
          return (
            <div key={section.id} className="animate-fade-slide">
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all duration-200 border ${
                  isExpanded 
                    ? 'bg-[rgba(167,139,250,0.06)] border-[rgba(167,139,250,0.2)]' 
                    : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{section.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[rgba(255,255,255,0.3)] text-xs font-mono">§{section.number}</span>
                      <span className="text-white font-bold text-sm">{section.title}</span>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={18} className="text-triage-violet" /> : <ChevronDown size={18} className="text-[rgba(255,255,255,0.25)]" />}
                </div>
              </button>
              
              {isExpanded && (
                <div className="mt-1 p-4 rounded-2xl bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.04)] animate-fade-slide">
                  {section.content.map((block, idx) => renderContentBlock(block, idx))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {searchTerm.length >= 2 && filteredSections.length === 0 && (
        <div className="text-center text-[rgba(255,255,255,0.3)] mt-8 py-8">
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p>No sections match your search.</p>
        </div>
      )}
    </div>
  );
};

// ============ MAIN SCREENS ============
const HomeScreen = ({ onNav, settings, onRecord }) => {
  const steps = [
    { n: 1, c: 'red', t: 'EMERGENCY?', s: 'Check red flags first → Call 999', sc: 'redFlags' },
    { n: 2, c: 'blue', t: 'CHECK EMIS', s: 'Planned follow-up or due? → Book directly', sc: 'emis' },
    { n: 3, c: 'amber', t: 'HIGH RISK PATIENT?', s: 'Pregnant, baby, immunosuppressed, frail?', sc: 'highRisk' },
    { n: 4, c: 'amber', t: 'AMBER FLAGS?', s: 'Worsening, severe, new lump?', sc: 'amberFlags' },
    { n: 5, c: 'green', t: 'MINOR PROBLEM?', s: 'Pharmacy First or Self-Care', sc: 'signpost' },
    { n: 6, c: 'gray', t: 'NOT SURE?', s: 'Multiple problems, >2 weeks → GP Triager', sc: 'notSure' }
  ];

  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">Reception Triage Guide</h1>
        <p className="text-[rgba(255,255,255,0.4)] mt-1 font-medium">{settings.practiceName}</p>
        <p className="text-[rgba(255,255,255,0.2)] text-sm mt-1">Follow steps in order ↓</p>
      </div>
      <div className="stagger">
        {steps.map(st => {
          const c = C[st.c] || C.gray;
          return (
            <GlassCard key={st.n} color={st.c} glow onClick={() => { onRecord(`Viewed: ${st.t}`); onNav(st.sc); }} className="animate-fade-slide">
              <div className="flex items-center gap-4">
                <StepIndicator num={st.n} color={st.c} />
                <div className="flex-1">
                  <div className={`font-bold text-[15px] ${c.text}`}>{st.t}</div>
                  <div className="text-[rgba(255,255,255,0.4)] text-sm">{st.s}</div>
                </div>
                <ChevronRight size={20} className="text-[rgba(255,255,255,0.15)]" />
              </div>
            </GlassCard>
          );
        })}
      </div>
      <div className="flex gap-3 mt-6 flex-wrap">
        <Button color="blue" onClick={() => onNav('pathways')}>📋 Pathways</Button>
        <Button color="blue" onClick={() => onNav('scripts')}>💬 Scripts</Button>
        <Button color="gray" onClick={() => onNav('training')}>🎓 Training</Button>
        <Button color="gray" onClick={() => onNav('history')}>📜 History</Button>
      </div>
    </div>
  );
};

const RedFlagsScreen = ({ onBack, flags, onRecord }) => (
  <div className="p-4 pb-24 max-w-lg mx-auto">
    <BackButton onClick={onBack} />
    <h1 className="text-2xl font-black text-triage-red mb-2 flex items-center gap-2"><AlertTriangle size={24} />RED FLAGS — Call 999</h1>
    <p className="text-[rgba(255,255,255,0.4)] mb-4 text-sm">If patient says ANY of these → Act immediately</p>
    <div className="stagger">
      {flags.map(f => (
        <GlassCard key={f.id} color="red" className="animate-fade-slide">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-triage-red mt-2 flex-shrink-0" style={{ boxShadow: '0 0 8px rgba(255,59,92,0.5)' }} />
            <div>
              <div className="text-[rgba(255,255,255,0.85)] font-medium text-sm">{f.description}</div>
              <div className="text-triage-red font-bold text-sm mt-1">→ {f.action}</div>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
    <a href="tel:999" onClick={() => onRecord('Called 999')}
      className="block emergency-banner text-white text-center py-5 rounded-2xl font-black text-2xl mt-6 shadow-lg active:scale-95 transition-transform">
      📞 CALL 999
    </a>
  </div>
);

const AmberFlagsScreen = ({ onBack, flags }) => {
  const [search, setSearch] = useState('');
  const filtered = flags.filter(f => 
    f.category.toLowerCase().includes(search.toLowerCase()) ||
    f.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <BackButton onClick={onBack} />
      <h1 className="text-2xl font-black text-triage-amber mb-2 flex items-center gap-2"><AlertCircle size={24} />AMBER FLAGS</h1>
      <p className="text-[rgba(255,255,255,0.4)] mb-4 text-sm">Same-day GP Triager review needed</p>
      <SearchBar value={search} onChange={setSearch} placeholder="Search symptoms..." />
      <div className="stagger">
        {filtered.map(f => (
          <GlassCard key={f.id} color="amber" className="animate-fade-slide">
            <div className="text-triage-amber font-bold text-sm mb-2">{f.category}</div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {f.keywords.map((k, i) => <span key={i} className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] px-2 py-1 rounded-lg text-xs text-[rgba(255,255,255,0.5)]">{k}</span>)}
            </div>
            <div className="text-triage-amber font-semibold text-xs">→ {f.action}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

const HighRiskScreen = ({ onBack, groups }) => (
  <div className="p-4 pb-24 max-w-lg mx-auto">
    <BackButton onClick={onBack} />
    <h1 className="text-2xl font-black text-triage-amber mb-2 flex items-center gap-2"><Shield size={24} />HIGH-RISK PATIENTS</h1>
    <p className="text-[rgba(255,255,255,0.4)] mb-4 text-sm">Lower threshold to send to GP Triager</p>
    <div className="stagger">
      {groups.map(g => (
        <GlassCard key={g.id} color="amber" className="animate-fade-slide">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{g.icon}</span>
            <div>
              <div className="font-bold text-white text-[15px] mb-1">{g.group}</div>
              <div className="text-sm text-[rgba(255,255,255,0.5)]">{g.action}</div>
              {g.note && <div className="text-xs text-[rgba(255,255,255,0.3)] italic mt-1.5">💡 {g.note}</div>}
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  </div>
);

const EMISScreen = ({ onBack, items }) => {
  const [expanded, setExpanded] = useState(null);
  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <BackButton onClick={onBack} />
      <h1 className="text-2xl font-black text-triage-blue mb-2 flex items-center gap-2"><FileText size={24} />CHECK EMIS FIRST</h1>
      <GlassCard color="blue" className="mb-6">
        <div className="text-triage-blue font-bold text-sm mb-2">Look for:</div>
        <div className="space-y-1.5">
          {['Follow-up plan in recent notes', 'Recall alerts (annual review, monitoring)', 'Vulnerability flags', 'Recent hospital letters'].map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-[rgba(255,255,255,0.6)]">
              <Check size={14} className="text-triage-blue flex-shrink-0" />{t}
            </div>
          ))}
        </div>
      </GlassCard>
      <h2 className="font-bold text-triage-teal mb-3 flex items-center gap-2 text-lg"><CheckCircle size={20} />Direct Booking</h2>
      <div className="stagger">
        {items.map(it => (
          <GlassCard key={it.id} color="teal" onClick={() => setExpanded(expanded === it.id ? null : it.id)} className="animate-fade-slide">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-[rgba(255,255,255,0.85)] text-sm">{it.item}</div>
              <ChevronRight size={18} className={`text-[rgba(255,255,255,0.2)] transition-transform ${expanded === it.id ? 'rotate-90' : ''}`} />
            </div>
            {expanded === it.id && (
              <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.06)] text-sm space-y-2 animate-fade-slide">
                <div className="text-[rgba(255,255,255,0.5)]"><strong className="text-[rgba(255,255,255,0.7)]">Check:</strong> {it.emis_check}</div>
                <div className="text-[rgba(255,255,255,0.5)]"><strong className="text-[rgba(255,255,255,0.7)]">Book:</strong> {it.bookWith}</div>
                <div className="text-triage-amber text-xs font-medium">⚠️ {it.warning}</div>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

const SignpostScreen = ({ onBack, conditions, scripts, onRecord }) => (
  <div className="p-4 pb-24 max-w-lg mx-auto">
    <BackButton onClick={onBack} />
    <h1 className="text-2xl font-black text-triage-green mb-2 flex items-center gap-2"><Pill size={24} />PHARMACY FIRST & SELF-CARE</h1>
    <h2 className="font-bold text-[rgba(255,255,255,0.7)] text-lg mb-3">Pharmacy First Conditions</h2>
    <GlassCard color="green">
      <div className="flex flex-wrap gap-2">
        {conditions.map(c => <span key={c.id} className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] px-3 py-1.5 rounded-xl text-sm flex items-center gap-1.5 text-[rgba(255,255,255,0.7)]">{c.icon} {c.name}</span>)}
      </div>
    </GlassCard>
    <ScriptBox title="SAY (Pharmacy First):" script={scripts.pharmacyFirst.script} onCopy={() => onRecord('Copied Pharmacy First script')} />
    <h2 className="font-bold text-[rgba(255,255,255,0.7)] text-lg mt-6 mb-3">Self-Care</h2>
    <GlassCard color="blue">
      <div className="font-bold text-white mb-1">Adults: CalmCare Cards</div>
      <div className="text-sm text-[rgba(255,255,255,0.4)]">Match symptom → send card</div>
    </GlassCard>
    <GlassCard color="blue">
      <div className="font-bold text-white mb-1">Children: Healthier Together</div>
      <a href="https://healthiertogether.nhs.uk" target="_blank" rel="noopener noreferrer" className="text-triage-blue underline text-sm">healthiertogether.nhs.uk</a>
    </GlassCard>
    <ScriptBox title="SAY (Adults):" script={scripts.calmCare.script} onCopy={() => onRecord('Copied CalmCare script')} />
    <ScriptBox title="SAY (Children):" script={scripts.healthierTogether.script} onCopy={() => onRecord('Copied Healthier Together script')} />
  </div>
);

const NotSureScreen = ({ onBack }) => (
  <div className="p-4 pb-24 max-w-lg mx-auto">
    <BackButton onClick={onBack} />
    <h1 className="text-2xl font-black mb-4 text-white">Not Sure?</h1>
    <GlassCard color="blue">
      <div className="text-triage-blue font-bold text-lg mb-3">Send to GP Triager if:</div>
      <div className="space-y-2">
        {['Multiple problems', '"severe", "worsening", "very worried"', 'Symptoms >2 weeks', 'Not improving despite pharmacy/self-care', 'New lump, night sweats, weight loss, bleeding'].map((t, i) => (
          <div key={i} className="flex items-start gap-2.5 text-[rgba(255,255,255,0.65)] text-sm">
            <span className="text-triage-blue mt-0.5">•</span>{t}
          </div>
        ))}
      </div>
    </GlassCard>
    <div className="glass-elevated rounded-2xl p-8 text-center mt-6 border border-[rgba(255,255,255,0.06)]">
      <div className="text-2xl font-black text-white mb-2">Remember</div>
      <div className="text-lg text-triage-blue font-semibold">If unsure → GP Triager</div>
      <div className="text-[rgba(255,255,255,0.3)] mt-2 text-sm">It's always OK to ask a clinician</div>
    </div>
  </div>
);

const PathwaysScreen = ({ onBack, pathways }) => {
  const [sel, setSel] = useState(null);
  const list = Object.entries(pathways);
  if (sel) {
    const p = pathways[sel];
    const priorityColors = { red: 'red', amber: 'amber', green: 'green' };
    return (
      <div className="p-4 pb-24 max-w-lg mx-auto">
        <BackButton onClick={() => setSel(null)} />
        <h1 className="text-2xl font-black mb-4 flex items-center gap-2 text-white">{p.icon} {p.title}</h1>
        <div className="stagger">
          {p.routes.map((r, i) => {
            const color = priorityColors[r.priority] || 'blue';
            const c = C[color];
            return (
              <GlassCard key={i} color={color} className="animate-fade-slide">
                <div className="font-bold mb-1 text-white text-sm">{r.condition}</div>
                <div className="text-sm text-[rgba(255,255,255,0.4)] mb-2">{r.examples}</div>
                <div className={`font-semibold text-sm ${c.text}`}>→ {r.action}</div>
                {r.link && <a href={`https://${r.link}`} target="_blank" rel="noopener noreferrer" className="text-triage-blue underline text-sm block mt-1 flex items-center gap-1">{r.link} <ExternalLink size={12} /></a>}
              </GlassCard>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <BackButton onClick={onBack} />
      <h1 className="text-2xl font-black mb-4 text-white">📋 Specific Pathways</h1>
      <div className="stagger">
        {list.map(([k, p]) => (
          <GlassCard key={k} onClick={() => setSel(k)} className="animate-fade-slide">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{p.icon}</span>
              <div className="font-semibold text-white text-lg">{p.title}</div>
              <ChevronRight className="ml-auto text-[rgba(255,255,255,0.15)]" />
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

const ContactsScreen = ({ onBack, contacts }) => {
  const [search, setSearch] = useState('');
  const filtered = contacts.filter(c => c.service.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <BackButton onClick={onBack} />
      <h1 className="text-2xl font-black mb-4 flex items-center gap-2 text-white"><Phone size={24} className="text-triage-blue" />Key Contacts</h1>
      <SearchBar value={search} onChange={setSearch} placeholder="Search contacts..." />
      <div className="stagger">
        {filtered.map(c => <div key={c.id} className="animate-fade-slide"><PhoneLink {...c} /></div>)}
      </div>
    </div>
  );
};

const ScriptsScreen = ({ onBack, scripts, onRecord }) => (
  <div className="p-4 pb-24 max-w-lg mx-auto">
    <BackButton onClick={onBack} />
    <h1 className="text-2xl font-black mb-4 text-white">💬 Scripts</h1>
    {Object.entries(scripts).map(([k, s]) => <ScriptBox key={k} title={s.title} script={s.script} onCopy={() => onRecord(`Copied: ${s.title}`)} />)}
  </div>
);

const SearchScreen = ({ redFlags, amberFlags, pharmacyFirst }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState({ red: [], amber: [], pharmacy: [] });
  useEffect(() => {
    if (search.length < 2) { setResults({ red: [], amber: [], pharmacy: [] }); return; }
    const t = search.toLowerCase();
    setResults({
      red: redFlags.filter(f => f.keywords.some(k => k.toLowerCase().includes(t)) || f.description.toLowerCase().includes(t)),
      amber: amberFlags.filter(f => f.keywords.some(k => k.toLowerCase().includes(t)) || f.category.toLowerCase().includes(t)),
      pharmacy: pharmacyFirst.filter(c => c.name.toLowerCase().includes(t))
    });
  }, [search, redFlags, amberFlags, pharmacyFirst]);
  const hasResults = results.red.length || results.amber.length || results.pharmacy.length;
  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <h1 className="text-2xl font-black mb-4 flex items-center gap-2 text-white"><Search size={24} className="text-triage-blue" />Symptom Search</h1>
      <SearchBar value={search} onChange={setSearch} placeholder="Type symptom (e.g., chest pain)..." />
      {search.length >= 2 && !hasResults && <p className="text-center text-[rgba(255,255,255,0.3)] mt-8">No matches. Try different words or send to GP Triager.</p>}
      {results.red.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold text-triage-red mb-2 flex items-center gap-2"><AlertTriangle size={20} />RED FLAGS</h2>
          {results.red.map(f => <GlassCard key={f.id} color="red"><div className="text-[rgba(255,255,255,0.85)] font-medium text-sm">{f.description}</div><div className="text-triage-red font-bold mt-1 text-sm">→ {f.action}</div></GlassCard>)}
        </div>
      )}
      {results.amber.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold text-triage-amber mb-2 flex items-center gap-2"><AlertCircle size={20} />AMBER FLAGS</h2>
          {results.amber.map(f => <GlassCard key={f.id} color="amber"><div className="text-triage-amber font-bold text-sm">{f.category}</div><div className="text-sm text-[rgba(255,255,255,0.5)] mt-1">{f.action}</div></GlassCard>)}
        </div>
      )}
      {results.pharmacy.length > 0 && (
        <div>
          <h2 className="font-bold text-triage-green mb-2 flex items-center gap-2"><Pill size={20} />Pharmacy First</h2>
          {results.pharmacy.map(c => <GlassCard key={c.id} color="green"><span className="text-xl mr-2">{c.icon}</span><span className="font-bold text-white">{c.name}</span></GlassCard>)}
        </div>
      )}
    </div>
  );
};

const HistoryScreen = ({ history, onClear }) => (
  <div className="p-4 pb-24 max-w-lg mx-auto">
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-black flex items-center gap-2 text-white"><History size={24} className="text-triage-blue" />History</h1>
      {history.length > 0 && <button onClick={onClear} className="text-triage-red text-sm hover:text-triage-red/80 font-medium">Clear</button>}
    </div>
    <p className="text-[rgba(255,255,255,0.4)] text-sm mb-4">Navigation history for documentation</p>
    {history.length === 0 ? (
      <div className="text-center text-[rgba(255,255,255,0.2)] mt-12"><Clock size={48} className="mx-auto mb-4 opacity-30" /><p>No history yet</p></div>
    ) : (
      <div className="space-y-2 stagger">
        {history.map((h, i) => <GlassCard key={i} className="animate-fade-slide"><div className="text-white font-medium text-sm">{h.action}</div><div className="text-sm text-[rgba(255,255,255,0.3)]">{h.time}</div></GlassCard>)}
      </div>
    )}
    {history.length > 0 && (
      <div className="mt-4">
        <Button color="blue" full onClick={() => navigator.clipboard.writeText(history.map(h => `${h.time}: ${h.action}`).join('\n'))}>
          <Copy size={18} />Copy for Documentation
        </Button>
      </div>
    )}
  </div>
);

const TrainingScreen = ({ onBack, scenarios }) => {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const sc = scenarios[idx];
  const check = id => { setAnswer(id); setShowResult(true); if (id === sc.correctAnswer) setScore(p => ({ correct: p.correct + 1, total: p.total + 1 })); else setScore(p => ({ ...p, total: p.total + 1 })); };
  const next = () => { if (idx < scenarios.length - 1) { setIdx(idx + 1); setAnswer(null); setShowResult(false); } };
  const restart = () => { setIdx(0); setAnswer(null); setShowResult(false); setScore({ correct: 0, total: 0 }); };
  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <BackButton onClick={onBack} />
      <h1 className="text-2xl font-black mb-2 flex items-center gap-2 text-white"><GraduationCap size={24} className="text-triage-violet" />Training</h1>
      <div className="flex items-center justify-between mb-4 glass rounded-xl p-3 border border-[rgba(255,255,255,0.06)]">
        <span className="text-[rgba(255,255,255,0.5)] text-sm">Scenario {idx + 1}/{scenarios.length}</span>
        <span className="font-bold text-white text-sm">Score: {score.correct}/{score.total}</span>
      </div>
      <GlassCard color="blue">
        <div className="text-triage-blue font-bold mb-2 text-sm">📋 Scenario:</div>
        <p className="text-[rgba(255,255,255,0.75)] text-sm leading-relaxed">{sc.scenario}</p>
      </GlassCard>
      <div className="mt-4 space-y-2">
        {sc.options.map(o => {
          let style = 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)] hover:border-triage-blue/30 hover:bg-[rgba(255,255,255,0.04)]';
          if (showResult) {
            if (o.id === sc.correctAnswer) style = 'bg-[rgba(34,197,94,0.08)] border-[rgba(34,197,94,0.3)]';
            else if (o.id === answer) style = 'bg-[rgba(255,59,92,0.08)] border-[rgba(255,59,92,0.3)]';
            else style = 'bg-[rgba(255,255,255,0.01)] border-[rgba(255,255,255,0.04)] opacity-50';
          }
          return <button key={o.id} onClick={() => !showResult && check(o.id)} disabled={showResult} className={`w-full p-4 rounded-xl border text-left text-sm text-[rgba(255,255,255,0.75)] transition-all ${style}`}>{o.text}</button>;
        })}
      </div>
      {showResult && (
        <GlassCard color={answer === sc.correctAnswer ? 'green' : 'red'} className="mt-4">
          <div className="font-bold mb-2 text-white text-sm">{answer === sc.correctAnswer ? '✅ Correct!' : '❌ Not quite'}</div>
          <p className="text-sm text-[rgba(255,255,255,0.55)] leading-relaxed">{sc.explanation}</p>
        </GlassCard>
      )}
      {showResult && (
        <div className="mt-4">
          {idx < scenarios.length - 1 ? <Button color="blue" full onClick={next}>Next →</Button> : (
            <div className="text-center">
              <div className="text-xl font-black mb-3 text-white">Complete! {score.correct}/{score.total}</div>
              <Button color="green" onClick={restart}>Restart</Button>
            </div>
          )}
        </div>
      )}
    </div>
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
    const currentSession = getSession();
    setSession(currentSession);
    setSettingsLocal(getSettings());
    try { setHistory(JSON.parse(localStorage.getItem('triage_history') || '[]')); } catch {}
    setLoading(false);
    if (currentSession?.mustChangePassword) { setShowPasswordChange(true); }
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
  const login = s => { 
    setSession(s); 
    setScreen('home');
    if (s.mustChangePassword) { setShowPasswordChange(true); }
  };

  if (loading || !data.loaded) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0F' }}>
      <RefreshCw size={40} className="animate-spin text-triage-blue" />
    </div>
  );
  
  if (!session) return <><LoginScreen onLogin={login} toast={showToast} />{toast && <Toast {...toast} onClose={() => setToast(null)} />}</>;

  const isAdminUser = isAdmin(session);
  
  const renderScreen = () => {
    switch (screen) {
      case 'home': return <HomeScreen onNav={nav} settings={settings} onRecord={record} />;
      case 'redFlags': return <RedFlagsScreen onBack={() => nav('home')} flags={data.redFlags} onRecord={record} />;
      case 'amberFlags': return <AmberFlagsScreen onBack={() => nav('home')} flags={data.amberFlags} />;
      case 'highRisk': return <HighRiskScreen onBack={() => nav('home')} groups={data.highRiskGroups} />;
      case 'emis': return <EMISScreen onBack={() => nav('home')} items={data.directBooking} />;
      case 'signpost': return <SignpostScreen onBack={() => nav('home')} conditions={data.pharmacyFirst} scripts={data.scripts} onRecord={record} />;
      case 'notSure': return <NotSureScreen onBack={() => nav('home')} />;
      case 'pathways': return <PathwaysScreen onBack={() => nav('home')} pathways={data.pathways} />;
      case 'contacts': return <ContactsScreen onBack={() => nav('home')} contacts={data.contacts} />;
      case 'scripts': return <ScriptsScreen onBack={() => nav('home')} scripts={data.scripts} onRecord={record} />;
      case 'search': return <SearchScreen redFlags={data.redFlags} amberFlags={data.amberFlags} pharmacyFirst={data.pharmacyFirst} />;
      case 'history': return <HistoryScreen history={history} onClear={() => setHistory([])} />;
      case 'sop': return <SOPScreen onBack={() => nav('home')} />;
      case 'training': return <TrainingScreen onBack={() => nav('home')} scenarios={data.training} />;
      case 'admin': return isAdminUser ? <AdminConsole onBack={() => nav('home')} data={data} toast={showToast} /> : <HomeScreen onNav={nav} settings={settings} onRecord={record} />;
      default: return <HomeScreen onNav={nav} settings={settings} onRecord={record} />;
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
        <PasswordChangeModal
          userId={session.userId}
          isFirstLogin={session.mustChangePassword}
          onComplete={() => { setShowPasswordChange(false); setSession({ ...session, mustChangePassword: false }); }}
          onCancel={() => { if (!session.mustChangePassword) { setShowPasswordChange(false); } }}
          toast={showToast}
        />
      )}
    </div>
  );
}
