// lib/auth.js - Authentication with security hardening

const SESSION_KEY = 'triage_session';
const DATA_KEY = 'triage_custom_data';
const SETTINGS_KEY = 'triage_settings';
const USERS_KEY = 'triage_users';
const AUDIT_KEY = 'triage_audit';
const LOGIN_ATTEMPTS_KEY = 'triage_login_attempts';

// Simple hash function for client-side password obfuscation
// Note: This is NOT cryptographically secure - for true security, use server-side auth
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'triage_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verify password against hash
async function verifyPassword(password, hash) {
  // If hash is plain text (legacy), compare directly
  if (hash.length < 64) {
    return password === hash;
  }
  const newHash = await hashPassword(password);
  return newHash === hash;
}

// Roles: reception | tier2 | tier3 | partner | admin
// Groups: churchill | orchard | partner | null
// Default credentials - CHANGE THESE before deploying
// Passwords are plain text initially, will be hashed on first save
export const DEFAULT_USERS = [
  {
    id: 'admin',
    username: 'admin',
    password: 'TriageAdmin2026!',
    role: 'admin',
    group: null,
    name: 'Administrator',
    mustChangePassword: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'haythemn',
    username: 'HaythemN',
    password: 'TriageCMC2026',
    role: 'reception',
    group: 'churchill',
    name: 'Haythem N',
    mustChangePassword: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'reception',
    username: 'reception',
    password: 'Kingston2026',
    role: 'reception',
    group: 'churchill',
    name: 'Reception Staff',
    mustChangePassword: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tier2',
    username: 'tier2',
    password: 'Tier2CMC2026!',
    role: 'tier2',
    group: 'churchill',
    name: 'Patient Services Team',
    mustChangePassword: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'gptriager',
    username: 'gptriager',
    password: 'GPTriager2026!',
    role: 'tier3',
    group: 'churchill',
    name: 'GP Triager',
    mustChangePassword: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'partner',
    username: 'partner',
    password: 'Partner2026!',
    role: 'partner',
    group: 'partner',
    name: 'Partner Practice',
    mustChangePassword: false,
    createdAt: new Date().toISOString()
  }
];

export const DEFAULT_SETTINGS = {
  practiceName: 'Churchill Medical Centre & The Orchard Practice',
  practicePhone: '',
  icbArea: 'South West London ICB',
  version: '1.2.0',
  lastUpdated: '2026-02-01',
  clinicalOwner: 'Dr Sahar Jahanian',
  reviewDate: '2026-07-02',
  sessionTimeoutMinutes: 480, // 8 hours
  maxLoginAttempts: 5,
  lockoutMinutes: 15
};

// ===== Rate Limiting (per-username) =====
function getAllLoginAttempts() {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

function getLoginAttempts(username) {
  const all = getAllLoginAttempts();
  const key = (username || '').toLowerCase().trim();
  return all[key] || { count: 0, lastAttempt: null, lockedUntil: null };
}

function recordLoginAttempt(username, success) {
  if (typeof window === 'undefined') return;
  const settings = getSettings();
  const all = getAllLoginAttempts();
  const key = (username || '').toLowerCase().trim();

  if (success) {
    delete all[key];
    localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(all));
    return;
  }

  const attempts = all[key] || { count: 0, lastAttempt: null, lockedUntil: null };
  const now = new Date().toISOString();
  attempts.count += 1;
  attempts.lastAttempt = now;

  if (attempts.count >= settings.maxLoginAttempts) {
    const lockoutTime = new Date(Date.now() + settings.lockoutMinutes * 60 * 1000);
    attempts.lockedUntil = lockoutTime.toISOString();
  }

  all[key] = attempts;
  localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(all));
}

export function isLockedOut(username) {
  const attempts = getLoginAttempts(username);
  if (!attempts.lockedUntil) return false;

  const lockoutEnd = new Date(attempts.lockedUntil);
  if (new Date() > lockoutEnd) {
    // Clear expired lockout
    const all = getAllLoginAttempts();
    const key = (username || '').toLowerCase().trim();
    delete all[key];
    localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(all));
    return false;
  }

  return true;
}

export function getLockoutRemaining(username) {
  const attempts = getLoginAttempts(username);
  if (!attempts.lockedUntil) return 0;

  const lockoutEnd = new Date(attempts.lockedUntil);
  const remaining = Math.max(0, Math.ceil((lockoutEnd - new Date()) / 1000 / 60));
  return remaining;
}

// ===== Session =====
export function createSession(user) {
  if (typeof window === 'undefined') return null;
  const settings = getSettings();
  const session = {
    userId: user.id,
    username: user.username,
    role: user.role,
    group: user.group || null,
    name: user.name,
    mustChangePassword: user.mustChangePassword || false,
    loginTime: new Date().toISOString(),
    expiresAt: new Date(Date.now() + settings.sessionTimeoutMinutes * 60 * 1000).toISOString()
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSession() {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    const session = JSON.parse(stored);
    if (new Date(session.expiresAt) < new Date()) {
      clearSession();
      return null;
    }
    return session;
  } catch { return null; }
}

export function getSessionTimeRemaining() {
  const session = getSession();
  if (!session) return 0;
  const remaining = Math.max(0, Math.ceil((new Date(session.expiresAt) - new Date()) / 1000 / 60));
  return remaining;
}

export function extendSession() {
  const session = getSession();
  if (!session) return null;
  const settings = getSettings();
  session.expiresAt = new Date(Date.now() + settings.sessionTimeoutMinutes * 60 * 1000).toISOString();
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

export function clearMustChangePassword() {
  if (typeof window === 'undefined') return;
  const session = getSession();
  if (session) {
    session.mustChangePassword = false;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

export function isAdmin(session) {
  return session?.role === 'admin';
}

export function canAccessTier(session, tier) {
  if (!session) return false;
  const role = session.role;
  if (role === 'admin' || role === 'partner') return true;
  if (role === 'tier3') return true;
  if (role === 'tier2') return tier <= 2;
  if (role === 'reception' || role === 'staff') return tier <= 1;
  return false;
}

export function getGroupLabel(group) {
  if (group === 'churchill') return 'Churchill Medical Centre';
  if (group === 'orchard') return 'The Orchard Practice';
  if (group === 'partner') return 'Partner Practice';
  return '';
}

// ===== Auth =====
export async function authenticateUser(username, password) {
  const trimmedUsername = username.trim();
  if (isLockedOut(trimmedUsername)) {
    return { error: `Too many failed attempts. Try again in ${getLockoutRemaining(trimmedUsername)} minutes.` };
  }

  const users = getUsers();

  for (const user of users) {
    if (user.username.toLowerCase() === trimmedUsername.toLowerCase()) {
      const isValid = await verifyPassword(password, user.password);
      if (isValid) {
        recordLoginAttempt(trimmedUsername, true);
        logAction(`Login: ${user.name}`, user.id);
        return { session: createSession(user) };
      }
    }
  }

  recordLoginAttempt(trimmedUsername, false);
  const attempts = getLoginAttempts(trimmedUsername);
  const settings = getSettings();
  const remaining = settings.maxLoginAttempts - attempts.count;

  if (remaining > 0) {
    return { error: `Invalid username or password. ${remaining} attempts remaining.` };
  } else {
    return { error: `Too many failed attempts. Try again in ${settings.lockoutMinutes} minutes.` };
  }
}

// ===== Password Management =====
export async function changePassword(userId, currentPassword, newPassword) {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return { success: false, message: 'User not found' };
  }
  
  const user = users[userIndex];
  
  // Verify current password (skip if mustChangePassword is true - first login)
  if (!user.mustChangePassword) {
    const isValid = await verifyPassword(currentPassword, user.password);
    if (!isValid) {
      return { success: false, message: 'Current password is incorrect' };
    }
  }
  
  // Validate new password
  const validation = validatePassword(newPassword);
  if (!validation.valid) {
    return { success: false, message: validation.message };
  }
  
  // Hash and save new password
  const hashedPassword = await hashPassword(newPassword);
  users[userIndex] = {
    ...user,
    password: hashedPassword,
    mustChangePassword: false,
    passwordChangedAt: new Date().toISOString()
  };
  
  saveUsers(users);
  clearMustChangePassword();
  logAction('Password changed', userId);
  
  return { success: true, message: 'Password changed successfully' };
}

export function validatePassword(password) {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true };
}

// ===== Users =====
// Seed localStorage with hashed default passwords on first boot,
// and migrate any legacy plain-text passwords to hashes.
// This eliminates the dual-path verifyPassword ambiguity that caused
// passwords to appear to "change" between plain-text and hash modes.
export async function initializeUsers() {
  if (typeof window === 'undefined') return;

  const stored = localStorage.getItem(USERS_KEY);

  if (!stored) {
    // First boot: hash every default password and persist
    const users = await Promise.all(
      DEFAULT_USERS.map(async (u) => ({
        ...u,
        password: await hashPassword(u.password),
      }))
    );
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return;
  }

  // Existing install: migrate any remaining plain-text passwords to hashes
  try {
    const users = JSON.parse(stored);
    let needsSave = false;
    const migrated = await Promise.all(
      users.map(async (u) => {
        if (u.password && u.password.length < 64) {
          needsSave = true;
          return { ...u, password: await hashPassword(u.password) };
        }
        return u;
      })
    );
    if (needsSave) {
      localStorage.setItem(USERS_KEY, JSON.stringify(migrated));
    }
  } catch { /* corrupt data — will be handled by getUsers fallback */ }
}

export function getUsers() {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  try {
    const stored = localStorage.getItem(USERS_KEY);
    const users = stored ? JSON.parse(stored) : null;
    return users && users.length > 0 ? users : DEFAULT_USERS;
  } catch { return DEFAULT_USERS; }
}

export async function saveUsers(users) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    logAction('Users updated', getSession()?.userId);
  }
}

export async function addUser(userData) {
  const users = getUsers();
  
  // Check for duplicate username
  if (users.some(u => u.username.toLowerCase() === userData.username.toLowerCase())) {
    return { success: false, message: 'Username already exists' };
  }
  
  // Validate password
  const validation = validatePassword(userData.password);
  if (!validation.valid) {
    return { success: false, message: validation.message };
  }
  
  // Hash password
  const hashedPassword = await hashPassword(userData.password);
  
  const newUser = {
    id: `user_${Date.now()}`,
    username: userData.username,
    password: hashedPassword,
    role: userData.role || 'reception',
    group: userData.group || null,
    name: userData.name,
    mustChangePassword: true,
    createdAt: new Date().toISOString()
  };
  
  await saveUsers([...users, newUser]);
  
  return { success: true, user: { ...newUser, password: '[hidden]' } };
}

// ===== Settings =====
export function getSettings() {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch { return DEFAULT_SETTINGS; }
}

export function saveSettings(settings) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      ...settings,
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
    logAction('Settings updated', getSession()?.userId);
  }
}

// ===== Custom Data =====
export function getCustomData() {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(DATA_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

export function saveCustomData(data) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DATA_KEY, JSON.stringify({
      ...data,
      lastModified: new Date().toISOString()
    }));
    logAction('Content updated', getSession()?.userId);
  }
}

export function clearCustomData() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DATA_KEY);
    logAction('Content reset to defaults', getSession()?.userId);
  }
}

// ===== Audit Log =====
export function logAction(action, userId = 'system') {
  if (typeof window === 'undefined') return;
  try {
    const logs = JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]');
    logs.unshift({
      action,
      userId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent?.substring(0, 100)
    });
    localStorage.setItem(AUDIT_KEY, JSON.stringify(logs.slice(0, 500)));
  } catch {}
}

export function getAuditLog() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]');
  } catch { return []; }
}

// ===== Export/Import =====
export function exportAllData() {
  const data = {
    exportedAt: new Date().toISOString(),
    exportedBy: getSession()?.name || 'Unknown',
    version: DEFAULT_SETTINGS.version,
    settings: getSettings(),
    users: getUsers().map(u => ({ ...u, password: '[redacted]' })), // Don't export passwords
    customData: getCustomData(),
    auditLog: getAuditLog().slice(0, 100)
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `triage-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  logAction('Data exported', getSession()?.userId);
}

export function importAllData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    
    if (data.settings) saveSettings(data.settings);
    // Don't import users - security risk
    if (data.customData) saveCustomData(data.customData);
    
    logAction('Data imported (settings + content only)', getSession()?.userId);
    return { success: true, message: 'Imported settings and content. Users not imported for security. Refresh to see changes.' };
  } catch {
    return { success: false, message: 'Invalid file format' };
  }
}
