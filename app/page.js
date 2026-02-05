'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Search, Phone, AlertTriangle, CheckCircle, Clock, ChevronRight, 
  ChevronLeft, Copy, Check, History, Home, X, AlertCircle, FileText,
  Shield, Pill, GraduationCap, Settings, Info, LogOut, Lock, User, 
  Save, Download, Upload, Plus, Trash2, Edit, RefreshCw, Eye, EyeOff,
  ExternalLink, Globe
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

// ============ UI COMPONENTS ============
const EmergencyBanner = () => (
  <div className="bg-red-600 text-white py-3 px-4 text-center font-bold sticky top-0 z-50">
    <span className="animate-pulse mr-2">🚨</span>
    EMERGENCY? Chest pain, can't breathe, collapse, stroke → 
    <a href="tel:999" className="underline ml-2 text-xl">CALL 999</a>
  </div>
);

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const bg = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
  return (
    <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 ${bg} text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2`}>
      {type === 'success' && <Check size={18} />}
      {type === 'error' && <X size={18} />}
      {message}
    </div>
  );
};

const Card = ({ children, color = 'white', border = 'gray', onClick, className = '' }) => {
  const colors = { white: 'bg-white', red: 'bg-red-50', amber: 'bg-orange-50', green: 'bg-green-50', blue: 'bg-blue-50', gray: 'bg-gray-100' };
  const borders = { gray: 'border-gray-200', red: 'border-red-500', amber: 'border-orange-500', green: 'border-green-500', blue: 'border-blue-500' };
  return (
    <div onClick={onClick} className={`${colors[color]} border-2 ${borders[border]} rounded-xl p-4 mb-3 ${onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.99] transition-all' : ''} ${className}`}>
      {children}
    </div>
  );
};

const Button = ({ children, color = 'blue', onClick, full = false, size = 'md', disabled = false, type = 'button' }) => {
  const colors = { blue: 'bg-blue-600 hover:bg-blue-700', green: 'bg-green-600 hover:bg-green-700', red: 'bg-red-600 hover:bg-red-700', amber: 'bg-orange-500 hover:bg-orange-600', gray: 'bg-gray-500 hover:bg-gray-600', white: 'bg-white text-gray-700 border hover:bg-gray-50' };
  const sizes = { sm: 'px-3 py-2 text-sm', md: 'px-5 py-3', lg: 'px-6 py-4 text-lg' };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${colors[color]} ${color !== 'white' ? 'text-white' : ''} rounded-lg font-semibold ${sizes[size]} ${full ? 'w-full' : ''} transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2`}>
      {children}
    </button>
  );
};

const Input = ({ label, type = 'text', value, onChange, placeholder, required, error }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required}
      className={`w-full px-4 py-3 rounded-lg border-2 ${error ? 'border-red-500' : 'border-gray-200'} focus:border-blue-500 focus:outline-none`} />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const TextArea = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none resize-none" />
  </div>
);

const SearchBar = ({ value, onChange, placeholder }) => (
  <div className="relative mb-4">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg" />
    {value && <button onClick={() => onChange('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"><X size={20} /></button>}
  </div>
);

const BackButton = ({ onClick }) => (
  <button onClick={onClick} className="flex items-center gap-1 text-blue-600 mb-4 py-2 hover:underline">
    <ChevronLeft size={20} /> Back
  </button>
);

const StepBadge = ({ num, color }) => {
  const colors = { red: 'bg-red-600', amber: 'bg-orange-500', green: 'bg-green-600', blue: 'bg-blue-600', gray: 'bg-gray-500' };
  return <div className={`${colors[color]} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold`}>{num}</div>;
};

const ScriptBox = ({ title, script, onCopy }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(script); setCopied(true); onCopy?.(); setTimeout(() => setCopied(false), 2000); };
  return (
    <Card color="green" border="green" className="mt-4">
      <div className="flex items-center gap-2 text-green-700 font-bold mb-2">📢 {title}</div>
      <p className="italic text-gray-700 mb-3">"{script}"</p>
      <button onClick={copy} className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-green-600 font-semibold ${copied ? 'bg-green-600 text-white' : 'bg-white text-green-600'}`}>
        {copied ? <><Check size={18} /> Copied!</> : <><Copy size={18} /> Copy Script</>}
      </button>
    </Card>
  );
};

// FIXED: PhoneLink now shows website buttons
const PhoneLink = ({ service, number, hours, priority = 'normal', icon, website, address }) => {
  const styles = { red: 'bg-red-50 border-red-500 text-red-700', amber: 'bg-orange-50 border-orange-500 text-orange-700', normal: 'bg-blue-50 border-blue-500 text-blue-700' };
  
  const openWebsite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = website.startsWith('http') ? website : `https://${website}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`p-4 rounded-xl border-2 mb-2 ${styles[priority]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <div className="font-semibold">{service}</div>
            <div className="text-sm opacity-75">{hours}</div>
            {address && <div className="text-xs opacity-60 mt-1">{address}</div>}
          </div>
        </div>
        <a href={`tel:${number.replace(/\s/g, '')}`} className="flex items-center gap-2 font-bold text-lg hover:underline">
          <Phone size={20} />{number}
        </a>
      </div>
      {website && (
        <button 
          onClick={openWebsite}
          className="mt-3 flex items-center gap-2 text-sm px-3 py-2 bg-white rounded-lg border hover:bg-gray-50 transition-colors w-full justify-center font-medium"
        >
          <Globe size={16} />
          Visit Website
          <ExternalLink size={14} />
        </button>
      )}
    </div>
  );
};

const UserBadge = ({ session, onLogout }) => (
  <div className="flex items-center justify-between bg-white border-b px-4 py-2">
    <div className="flex items-center gap-2 text-sm">
      <User size={16} className="text-gray-500" />
      <span className="text-gray-600">{session.name}</span>
      {session.role === 'admin' && <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">Admin</span>}
    </div>
    <button onClick={onLogout} className="flex items-center gap-1 text-gray-500 hover:text-red-600 text-sm"><LogOut size={16} />Logout</button>
  </div>
);

const NavBar = ({ screen, onNav, isAdminUser }) => {
  const items = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'contacts', icon: Phone, label: 'Contacts' },
    { id: 'history', icon: History, label: 'History' },
    { id: isAdminUser ? 'admin' : 'training', icon: isAdminUser ? Settings : GraduationCap, label: isAdminUser ? 'Admin' : 'Training' }
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-40">
      {items.map(i => (
        <button key={i.id} onClick={() => onNav(i.id)}
          className={`flex flex-col items-center py-2 px-4 rounded-lg ${screen === i.id ? 'text-blue-600 bg-blue-50' : 'text-gray-500'}`}>
          <i.icon size={24} /><span className="text-xs mt-1">{i.label}</span>
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

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setLoading(true);
    const result = await changePassword(userId, currentPassword, newPassword);
    setLoading(false);

    if (result.success) {
      toast('Password changed successfully', 'success');
      onComplete();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-white" size={32} />
          </div>
          <h2 className="text-xl font-bold">
            {isFirstLogin ? 'Set Your Password' : 'Change Password'}
          </h2>
          {isFirstLogin && (
            <p className="text-gray-500 text-sm mt-2">
              For security, please set a new password before continuing.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {!isFirstLogin && (
            <Input
              label="Current Password"
              type={showPasswords ? 'text' : 'password'}
              value={currentPassword}
              onChange={setCurrentPassword}
              placeholder="Enter current password"
              required
            />
          )}
          
          <Input
            label="New Password"
            type={showPasswords ? 'text' : 'password'}
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Enter new password"
            required
          />
          
          <Input
            label="Confirm New Password"
            type={showPasswords ? 'text' : 'password'}
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Confirm new password"
            required
          />

          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
            <input
              type="checkbox"
              id="showPw"
              checked={showPasswords}
              onChange={(e) => setShowPasswords(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="showPw">Show passwords</label>
          </div>

          <div className="bg-gray-100 p-3 rounded-lg mb-4 text-sm text-gray-600">
            <strong>Password requirements:</strong>
            <ul className="mt-1 list-disc list-inside">
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <AlertCircle size={18} />{error}
            </div>
          )}

          <div className="flex gap-3">
            {!isFirstLogin && (
              <Button type="button" color="gray" onClick={onCancel} full>
                Cancel
              </Button>
            )}
            <Button type="submit" color="blue" full disabled={loading}>
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

    if (isLockedOut()) {
      setError(`Account locked. Try again in ${getLockoutRemaining()} minutes.`);
      return;
    }

    setLoading(true);
    const result = await authenticateUser(username, password);
    setLoading(false);

    if (result.session) {
      toast(`Welcome, ${result.session.name}!`, 'success');
      onLogin(result.session);
    } else {
      setError(result.error || 'Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-white" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Reception Triage Guide</h1>
          <p className="text-gray-500 mt-1">{settings.practiceName}</p>
          <p className="text-sm text-gray-400 mt-1">Staff Login</p>
        </div>
        <form onSubmit={submit}>
          <Input label="Username" value={username} onChange={setUsername} placeholder="Enter username" required />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter password" required className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2"><AlertCircle size={18} />{error}</div>}
          <Button type="submit" color="blue" full size="lg" disabled={loading}>
            {loading ? <><RefreshCw size={20} className="animate-spin" />Signing in...</> : <><Lock size={20} />Sign In</>}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">For staff use only • v{settings.version}</p>
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
    if (!newUser.username || !newUser.password || !newUser.name) {
      setUserError('All fields are required');
      return;
    }
    const result = await addUser(newUser);
    if (result.success) {
      setUsersState(getUsers());
      setShowAddUser(false);
      setNewUser({ username: '', password: '', name: '', role: 'staff' });
      toast('User added successfully');
    } else {
      setUserError(result.message);
    }
  };

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto">
      <BackButton onClick={onBack} />
      <h1 className="text-2xl font-bold mb-2 flex items-center gap-2"><Settings />Admin Console</h1>
      <p className="text-gray-600 mb-4">Manage settings, users, and content</p>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap ${tab === t.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            <t.icon size={18} />{t.label}
          </button>
        ))}
      </div>

      {tab === 'settings' && (
        <Card>
          <h3 className="font-bold mb-4">Practice Settings</h3>
          <Input label="Practice Name" value={settings.practiceName} onChange={v => setSettingsState({ ...settings, practiceName: v })} />
          <Input label="ICB Area" value={settings.icbArea} onChange={v => setSettingsState({ ...settings, icbArea: v })} />
          <Input label="Clinical Owner" value={settings.clinicalOwner} onChange={v => setSettingsState({ ...settings, clinicalOwner: v })} />
          <Input label="Version" value={settings.version} onChange={v => setSettingsState({ ...settings, version: v })} />
          <Input label="Review Date" value={settings.reviewDate} onChange={v => setSettingsState({ ...settings, reviewDate: v })} />
          <Button onClick={handleSaveSettings} color="green"><Save size={18} />Save Settings</Button>
        </Card>
      )}

      {tab === 'users' && (
        <div className="space-y-4">
          <Card color="amber" border="amber">
            <div className="flex items-start gap-2 text-sm">
              <AlertTriangle className="text-orange-600 mt-0.5" size={20} />
              <div>
                <strong>Security:</strong> Passwords are hashed after first change. 
                Users with "must change password" will be prompted on login.
              </div>
            </div>
          </Card>

          <Button onClick={() => setShowAddUser(true)} color="blue">
            <Plus size={18} /> Add New User
          </Button>

          {showAddUser && (
            <Card color="blue" border="blue">
              <h4 className="font-bold mb-3">Add New User</h4>
              <Input label="Username" value={newUser.username} onChange={v => setNewUser({...newUser, username: v})} placeholder="e.g., sarah.jones" />
              <Input label="Display Name" value={newUser.name} onChange={v => setNewUser({...newUser, name: v})} placeholder="e.g., Sarah Jones" />
              <Input label="Initial Password" value={newUser.password} onChange={v => setNewUser({...newUser, password: v})} placeholder="Min 8 chars, 1 upper, 1 lower, 1 number" />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none">
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {userError && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">{userError}</div>}
              <div className="flex gap-2">
                <Button onClick={handleAddUser} color="green" size="sm"><Check size={16} />Add User</Button>
                <Button onClick={() => {setShowAddUser(false); setUserError('');}} color="gray" size="sm">Cancel</Button>
              </div>
            </Card>
          )}

          {users.map((u, i) => (
            <Card key={u.id}>
              <div className="flex items-center gap-2 mb-3">
                <User size={20} className="text-gray-500" />
                <span className="font-bold">{u.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>{u.role}</span>
                {u.mustChangePassword && <span className="text-xs px-2 py-0.5 rounded-full bg-orange-200 text-orange-700">Must change password</span>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Username" value={u.username} onChange={v => { const n = [...users]; n[i].username = v; setUsersState(n); }} />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input 
                    type="text" 
                    value={u.password.length > 50 ? '••••••••' : u.password} 
                    onChange={v => { const n = [...users]; n[i].password = v.target.value; n[i].mustChangePassword = true; setUsersState(n); }}
                    disabled={u.password.length > 50}
                    placeholder={u.password.length > 50 ? 'Hashed - user must reset' : 'Enter password'}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none disabled:bg-gray-100" 
                  />
                  {u.password.length > 50 && <p className="text-xs text-gray-500 mt-1">Password is hashed. User can change via login.</p>}
                </div>
              </div>
              <Input label="Display Name" value={u.name} onChange={v => { const n = [...users]; n[i].name = v; setUsersState(n); }} />
            </Card>
          ))}
          <Button onClick={handleSaveUsers} color="green" full><Save size={18} />Save Users</Button>
        </div>
      )}

      {tab === 'contacts' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">Edit contact numbers and websites. Changes save automatically.</p>
          {data.contacts.map((c, i) => (
            <Card key={c.id}>
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
                    <div className="font-semibold">{c.service}</div>
                    <div className="text-sm text-gray-500">{c.number} • {c.hours}</div>
                    {c.website && <div className="text-sm text-blue-600">{c.website}</div>}
                  </div>
                  <button onClick={() => setEditContact(i)} className="text-blue-600 p-2 rounded-lg hover:bg-blue-50"><Edit size={18} /></button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {tab === 'scripts' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">Edit the ready-to-use scripts for staff.</p>
          {Object.entries(data.scripts).map(([key, s]) => (
            <Card key={key}>
              <div className="font-semibold mb-2">{s.title}</div>
              {editScript === key ? (
                <div>
                  <TextArea value={s.script} onChange={v => updateScript(key, v)} rows={4} />
                  <Button onClick={() => setEditScript(null)} size="sm"><Check size={16} />Save</Button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 italic mb-2">"{s.script}"</p>
                  <button onClick={() => setEditScript(key)} className="text-blue-600 text-sm flex items-center gap-1 hover:underline"><Edit size={14} />Edit</button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {tab === 'backup' && (
        <div className="space-y-4">
          <Card>
            <h3 className="font-bold mb-2">Export Backup</h3>
            <p className="text-sm text-gray-600 mb-4">Download settings and content (passwords are not exported).</p>
            <Button onClick={handleExport} color="blue"><Download size={18} />Export Backup</Button>
          </Card>
          <Card>
            <h3 className="font-bold mb-2">Import Backup</h3>
            <p className="text-sm text-gray-600 mb-4">Restore settings and content from a backup file.</p>
            <label className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-blue-700">
              <Upload size={18} />Import Backup
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </Card>
          <Card color="red" border="red">
            <h3 className="font-bold mb-2">Reset to Defaults</h3>
            <p className="text-sm text-gray-600 mb-4">Remove all custom content. Cannot be undone.</p>
            <Button onClick={handleReset} color="red"><RefreshCw size={18} />Reset All</Button>
          </Card>
        </div>
      )}

      {tab === 'audit' && (
        <div>
          <h3 className="font-bold mb-4">Recent Activity (last 500 actions)</h3>
          {auditLog.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No activity logged yet</p>
          ) : (
            <div className="space-y-2">
              {auditLog.slice(0, 50).map((log, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b text-sm">
                  <div>
                    <span>{log.action}</span>
                    {log.userId && <span className="text-gray-400 ml-2">({log.userId})</span>}
                  </div>
                  <span className="text-gray-500">{new Date(log.timestamp).toLocaleString('en-GB')}</span>
                </div>
              ))}
            </div>
          )}
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
  const colors = { red: 'text-red-600', amber: 'text-orange-600', green: 'text-green-600', blue: 'text-blue-600', gray: 'text-gray-700' };
  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-1">Reception Triage Guide</h1>
      <p className="text-center text-gray-500 mb-1">{settings.practiceName}</p>
      <p className="text-center text-gray-400 text-sm mb-6">Follow steps in order</p>
      {steps.map(st => (
        <Card key={st.n} color={st.c === 'gray' ? 'gray' : st.c} border={st.c === 'gray' ? 'gray' : st.c}
          onClick={() => { onRecord(`Viewed: ${st.t}`); onNav(st.sc); }}>
          <div className="flex items-center gap-4">
            <StepBadge num={st.n} color={st.c} />
            <div className="flex-1">
              <div className={`font-bold text-lg ${colors[st.c]}`}>{st.t}</div>
              <div className="text-gray-500 text-sm">{st.s}</div>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>
        </Card>
      ))}
      <div className="flex gap-3 mt-6 flex-wrap">
        <Button color="blue" onClick={() => onNav('pathways')}>📋 Pathways</Button>
        <Button color="blue" onClick={() => onNav('scripts')}>💬 Scripts</Button>
        <Button color="gray" onClick={() => onNav('training')}>🎓 Training</Button>
      </div>
    </div>
  );
};

const RedFlagsScreen = ({ onBack, flags, onRecord }) => (
  <div className="p-4 pb-24 max-w-lg mx-auto">
    <BackButton onClick={onBack} />
    <h1 className="text-2xl font-bold text-red-600 mb-2 flex items-center gap-2"><AlertTriangle />RED FLAGS - Call 999</h1>
    <p className="text-gray-600 mb-4">If patient says ANY of these → Act immediately</p>
    {flags.map(f => (
      <Card key={f.id} color="red" border="red">
        <div className="font-medium mb-2">{f.description}</div>
        <div className="text-red-600 font-bold">→ {f.action}</div>
      </Card>
    ))}
    <a href="tel:999" onClick={() => onRecord('Called 999')}
      className="block bg-red-600 text-white text-center py-5 rounded-2xl font-bold text-2xl mt-6 shadow-lg active:scale-95">
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
      <h1 className="text-2xl font-bold text-orange-600 mb-2 flex items-center gap-2"><AlertCircle />AMBER FLAGS</h1>
      <p className="text-gray-600 mb-4">Same-day GP Triager review needed</p>
      <SearchBar value={search} onChange={setSearch} placeholder="Search symptoms..." />
      {filtered.map(f => (
        <Card key={f.id} color="amber" border="amber">
          <div className="font-bold text-orange-600 mb-2">{f.category}</div>
          <div className="flex flex-wrap gap-2 mb-3">
            {f.keywords.map((k, i) => <span key={i} className="bg-white px-2 py-1 rounded text-sm">{k}</span>)}
          </div>
          <div className="text-orange-600 font-semibold">→ {f.action}</div>
        </Card>
      ))}
    </div>
  );
};

const HighRiskScreen = ({ onBack, groups }) => (
  <div className="p-4 pb-24 max-w-lg mx-auto">
    <BackButton onClick={onBack} />
    <h1 className="text-2xl font-bold text-orange-600 mb-2 flex items-center gap-2"><Shield />HIGH-RISK PATIENTS</h1>
    <p className="text-gray-600 mb-4">Lower threshold to send to GP Triager</p>
    {groups.map(g => (
      <Card key={g.id} color="amber" border="amber">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{g.icon}</span>
          <div>
            <div className="font-bold text-lg mb-1">{g.group}</div>
            <div className="text-sm text-gray-600 mb-2">{g.action}</div>
            {g.note && <div className="text-xs text-gray-500 italic">💡 {g.note}</div>}
          </div>
        </div>
      </Card>
    ))}
  </div>
);

const EMISScreen = ({ onBack, items }) => {
  const [expanded, setExpanded] = useState(null);
  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <BackButton onClick={onBack} />
      <h1 className="text-2xl font-bold text-blue-600 mb-2 flex items-center gap-2"><FileText />CHECK EMIS FIRST</h1>
      <Card color="blue" border="blue" className="mb-6">
        <div className="font-bold mb-2">Look for:</div>
        <ul className="space-y-1 text-sm">
          <li>✓ Follow-up plan in recent notes</li>
          <li>✓ Recall alerts (annual review, monitoring)</li>
          <li>✓ Vulnerability flags</li>
          <li>✓ Recent hospital letters</li>
        </ul>
      </Card>
      <h2 className="text-xl font-bold text-green-600 mb-3 flex items-center gap-2"><CheckCircle />Direct Booking</h2>
      {items.map(it => (
        <Card key={it.id} color="green" border="green" onClick={() => setExpanded(expanded === it.id ? null : it.id)}>
          <div className="flex items-center justify-between">
            <div className="font-semibold">{it.item}</div>
            <ChevronRight className={`transition-transform ${expanded === it.id ? 'rotate-90' : ''}`} />
          </div>
          {expanded === it.id && (
            <div className="mt-3 pt-3 border-t border-green-200 text-sm space-y-2">
              <div><strong>Check:</strong> {it.emis_check}</div>
              <div><strong>Book:</strong> {it.bookWith}</div>
              <div className="text-orange-600">⚠️ {it.warning}</div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

const SignpostScreen = ({ onBack, conditions, scripts, onRecord }) => (
  <div className="p-4 pb-24 max-w-lg mx-auto">
    <BackButton onClick={onBack} />
    <h1 className="text-2xl font-bold text-green-600 mb-2 flex items-center gap-2"><Pill />PHARMACY FIRST & SELF-CARE</h1>
    <h2 className="font-bold text-lg mb-3">Pharmacy First Conditions</h2>
    <Card color="green" border="green">
      <div className="flex flex-wrap gap-2">
        {conditions.map(c => <span key={c.id} className="bg-white px-3 py-1 rounded-full text-sm flex items-center gap-1">{c.icon} {c.name}</span>)}
      </div>
    </Card>
    <ScriptBox title="SAY (Pharmacy First):" script={scripts.pharmacyFirst.script} onCopy={() => onRecord('Copied Pharmacy First script')} />
    <h2 className="font-bold text-lg mt-6 mb-3">Self-Care</h2>
    <Card color="blue" border="blue">
      <div className="font-bold mb-1">Adults: CalmCare Cards</div>
      <div className="text-sm text-gray-600">Match symptom → send card</div>
    </Card>
    <Card color="blue" border="blue">
      <div className="font-bold mb-1">Children: Healthier Together</div>
      <a href="https://healthiertogether.nhs.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">healthiertogether.nhs.uk</a>
    </Card>
    <ScriptBox title="SAY (Adults):" script={scripts.calmCare.script} onCopy={() => onRecord('Copied CalmCare script')} />
    <ScriptBox title="SAY (Children):" script={scripts.healthierTogether.script} onCopy={() => onRecord('Copied Healthier Together script')} />
  </div>
);

const NotSureScreen = ({ onBack }) => (
  <div className="p-4 pb-24 max-w-lg mx-auto">
    <BackButton onClick={onBack} />
    <h1 className="text-2xl font-bold mb-4">Not Sure?</h1>
    <Card color="blue" border="blue">
      <div className="font-bold text-lg mb-3">Send to GP Triager if:</div>
      <ul className="space-y-2">
        <li>• Multiple problems</li>
        <li>• "severe", "worsening", "very worried"</li>
        <li>• Symptoms &gt;2 weeks</li>
        <li>• Not improving despite pharmacy/self-care</li>
        <li>• New lump, night sweats, weight loss, bleeding</li>
      </ul>
    </Card>
    <div className="bg-gray-100 p-6 rounded-2xl text-center mt-6">
      <div className="text-2xl font-bold mb-2">Remember</div>
      <div className="text-lg">If unsure → GP Triager</div>
      <div className="text-gray-500 mt-2">It's always OK to ask a clinician</div>
    </div>
  </div>
);

const PathwaysScreen = ({ onBack, pathways }) => {
  const [sel, setSel] = useState(null);
  const list = Object.entries(pathways);
  if (sel) {
    const p = pathways[sel];
    return (
      <div className="p-4 pb-24 max-w-lg mx-auto">
        <BackButton onClick={() => setSel(null)} />
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">{p.icon} {p.title}</h1>
        {p.routes.map((r, i) => (
          <Card key={i} color={r.priority} border={r.priority}>
            <div className="font-bold mb-1">{r.condition}</div>
            <div className="text-sm text-gray-600 mb-2">{r.examples}</div>
            <div className={`font-semibold ${r.priority === 'red' ? 'text-red-600' : r.priority === 'amber' ? 'text-orange-600' : 'text-green-600'}`}>→ {r.action}</div>
            {r.link && <a href={`https://${r.link}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm block mt-1">{r.link}</a>}
          </Card>
        ))}
      </div>
    );
  }
  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <BackButton onClick={onBack} />
      <h1 className="text-2xl font-bold mb-4">📋 Specific Pathways</h1>
      {list.map(([k, p]) => (
        <Card key={k} onClick={() => setSel(k)}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{p.icon}</span>
            <div className="font-semibold text-lg">{p.title}</div>
            <ChevronRight className="ml-auto text-gray-400" />
          </div>
        </Card>
      ))}
    </div>
  );
};

const ContactsScreen = ({ onBack, contacts }) => {
  const [search, setSearch] = useState('');
  const filtered = contacts.filter(c => c.service.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <BackButton onClick={onBack} />
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2"><Phone />Key Contacts</h1>
      <SearchBar value={search} onChange={setSearch} placeholder="Search contacts..." />
      {filtered.map(c => <PhoneLink key={c.id} {...c} />)}
    </div>
  );
};

const ScriptsScreen = ({ onBack, scripts, onRecord }) => (
  <div className="p-4 pb-24 max-w-lg mx-auto">
    <BackButton onClick={onBack} />
    <h1 className="text-2xl font-bold mb-4">💬 Scripts</h1>
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
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2"><Search />Symptom Search</h1>
      <SearchBar value={search} onChange={setSearch} placeholder="Type symptom (e.g., chest pain)..." />
      {search.length >= 2 && !hasResults && <p className="text-center text-gray-500 mt-8">No matches. Try different words or send to GP Triager.</p>}
      {results.red.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold text-red-600 mb-2 flex items-center gap-2"><AlertTriangle size={20} />RED FLAGS</h2>
          {results.red.map(f => <Card key={f.id} color="red" border="red"><div className="font-medium">{f.description}</div><div className="text-red-600 font-bold mt-1">→ {f.action}</div></Card>)}
        </div>
      )}
      {results.amber.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold text-orange-600 mb-2 flex items-center gap-2"><AlertCircle size={20} />AMBER FLAGS</h2>
          {results.amber.map(f => <Card key={f.id} color="amber" border="amber"><div className="font-bold text-orange-600">{f.category}</div><div className="text-sm mt-1">{f.action}</div></Card>)}
        </div>
      )}
      {results.pharmacy.length > 0 && (
        <div>
          <h2 className="font-bold text-green-600 mb-2 flex items-center gap-2"><Pill size={20} />Pharmacy First</h2>
          {results.pharmacy.map(c => <Card key={c.id} color="green" border="green"><span className="text-xl mr-2">{c.icon}</span><span className="font-bold">{c.name}</span></Card>)}
        </div>
      )}
    </div>
  );
};

const HistoryScreen = ({ history, onClear }) => (
  <div className="p-4 pb-24 max-w-lg mx-auto">
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold flex items-center gap-2"><History />History</h1>
      {history.length > 0 && <button onClick={onClear} className="text-red-600 text-sm hover:underline">Clear</button>}
    </div>
    <p className="text-gray-600 text-sm mb-4">Navigation history for documentation</p>
    {history.length === 0 ? (
      <div className="text-center text-gray-500 mt-12"><Clock size={48} className="mx-auto mb-4 opacity-50" /><p>No history yet</p></div>
    ) : (
      <div className="space-y-2">
        {history.map((h, i) => <Card key={i}><div className="font-medium">{h.action}</div><div className="text-sm text-gray-500">{h.time}</div></Card>)}
      </div>
    )}
    {history.length > 0 && (
      <Button color="blue" full onClick={() => navigator.clipboard.writeText(history.map(h => `${h.time}: ${h.action}`).join('\n'))} className="mt-4">
        <Copy size={18} />Copy for Documentation
      </Button>
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
      <h1 className="text-2xl font-bold mb-2 flex items-center gap-2"><GraduationCap />Training</h1>
      <div className="flex items-center justify-between mb-4 bg-gray-100 p-3 rounded-lg">
        <span>Scenario {idx + 1}/{scenarios.length}</span>
        <span className="font-bold">Score: {score.correct}/{score.total}</span>
      </div>
      <Card color="blue" border="blue"><div className="font-bold mb-2">📋 Scenario:</div><p>{sc.scenario}</p></Card>
      <div className="mt-4 space-y-2">
        {sc.options.map(o => {
          let bg = 'bg-white border-gray-200';
          if (showResult) { if (o.id === sc.correctAnswer) bg = 'bg-green-50 border-green-500'; else if (o.id === answer) bg = 'bg-red-50 border-red-500'; }
          return <button key={o.id} onClick={() => !showResult && check(o.id)} disabled={showResult} className={`w-full p-4 rounded-xl border-2 text-left ${bg} ${!showResult ? 'hover:border-blue-500' : ''}`}>{o.text}</button>;
        })}
      </div>
      {showResult && (
        <Card color={answer === sc.correctAnswer ? 'green' : 'red'} border={answer === sc.correctAnswer ? 'green' : 'red'} className="mt-4">
          <div className="font-bold mb-2">{answer === sc.correctAnswer ? '✅ Correct!' : '❌ Not quite'}</div>
          <p className="text-sm">{sc.explanation}</p>
        </Card>
      )}
      {showResult && (
        <div className="mt-4">
          {idx < scenarios.length - 1 ? <Button color="blue" full onClick={next}>Next →</Button> : (
            <div className="text-center"><div className="text-xl font-bold mb-3">Complete! {score.correct}/{score.total}</div><Button color="green" onClick={restart}>Restart</Button></div>
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
    
    // Check if password change required
    if (currentSession?.mustChangePassword) {
      setShowPasswordChange(true);
    }
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
    if (s.mustChangePassword) {
      setShowPasswordChange(true);
    }
  };

  if (loading || !data.loaded) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><RefreshCw size={40} className="animate-spin text-blue-600" /></div>;
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
      case 'training': return <TrainingScreen onBack={() => nav('home')} scenarios={data.training} />;
      case 'admin': return isAdminUser ? <AdminConsole onBack={() => nav('home')} data={data} toast={showToast} /> : <HomeScreen onNav={nav} settings={settings} onRecord={record} />;
      default: return <HomeScreen onNav={nav} settings={settings} onRecord={record} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EmergencyBanner />
      <UserBadge session={session} onLogout={logout} />
      {renderScreen()}
      <NavBar screen={screen} onNav={nav} isAdminUser={isAdminUser} />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      {/* Password Change Modal */}
      {showPasswordChange && (
        <PasswordChangeModal
          userId={session.userId}
          isFirstLogin={session.mustChangePassword}
          onComplete={() => {
            setShowPasswordChange(false);
            setSession({ ...session, mustChangePassword: false });
          }}
          onCancel={() => {
            if (!session.mustChangePassword) {
              setShowPasswordChange(false);
            }
          }}
          toast={showToast}
        />
      )}
    </div>
  );
}
