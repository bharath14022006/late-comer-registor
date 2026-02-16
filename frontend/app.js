/**
 * Late Comer Management System - Frontend Logic (app.js)
 * Unified Single Page Application
 * 
 * This file handles:
 * - State-driven UI rendering
 * - Connectivity to Java Spring Boot middleware
 * - User interactions and data management
 */

// --- 1. CONFIGURATION ---
const CONFIG = {
    API_BASE_URL: "http://localhost:8080/api",
    ENDPOINTS: {
        AUTH: "/auth",
        ENTRIES: "/entries"
    },
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    // Mock mode - set to true to use mock data without backend
    MOCK_MODE: true
};

// --- MOCK DATA ---
const MOCK_USERS = [
    { username: 'admin', password: 'admin123', role: 'ADMIN', token: 'mock-token-admin' },
    { username: 'security', password: 'security123', role: 'STAFF', token: 'mock-token-security' }
];

const MOCK_ENTRIES = [
    { id: '1', name: 'John Smith', roll_no: '21CS001', dept: 'Computer Science', year: '3rd Year', class: 'A', transport: 'College Bus', reason: 'Traffic congestion', time: '2024-01-15 08:45:00', recorded_by: 'admin' },
    { id: '2', name: 'Sarah Johnson', roll_no: '21ME002', dept: 'Mechanical', year: '2nd Year', class: 'B', transport: 'Public Bus', reason: 'Bus breakdown', time: '2024-01-15 09:10:00', recorded_by: 'admin' },
    { id: '3', name: 'Mike Davis', roll_no: '21EE003', dept: 'Electrical', year: '4th Year', class: 'A', transport: 'Private Vehicle', reason: 'Vehicle malfunction', time: '2024-01-15 08:55:00', recorded_by: 'security' },
    { id: '4', name: 'Emily Brown', roll_no: '21IT004', dept: 'Information Technology', year: '1st Year', class: 'C', transport: 'College Bus', reason: ' Overslept', time: '2024-01-14 09:05:00', recorded_by: 'admin' },
    { id: '5', name: 'David Wilson', roll_no: '21CE005', dept: 'Civil', year: '3rd Year', class: 'A', transport: 'Walking', reason: 'Health issue', time: '2024-01-14 08:30:00', recorded_by: 'security' }
];

// --- 2. GLOBAL STATE ---
let state = {
    isAuthenticated: false,
    user: null,
    view: 'LOGIN', // 'LOGIN' or 'DASHBOARD'
    loading: false,
    entries: []
};

// --- 3. UI COMPONENTS (Template Literals) ---

// 1. Login Component
const LoginUI = () => `
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="max-w-md w-full glass-card p-10 rounded-[2.5rem] shadow-2xl">
            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-100">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight">Security Portal</h1>
                <p class="text-slate-500 mt-2 font-medium">Late Comer Management System</p>
            </div>
            
            <form id="loginForm" class="space-y-5">
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Admin Username</label>
                    <input type="text" id="username" required class="form-input" placeholder="e.g. admin_security">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Secure Password</label>
                    <input type="password" id="password" required class="form-input" placeholder="••••••••">
                </div>
                <button type="submit" class="w-full btn-primary py-4 flex items-center justify-center gap-2">
                    <span id="loginBtnText">Sign In</span>
                    <div id="loginSpinner" class="spinner hidden" style="border-top-color: white;"></div>
                </button>
            </form>
            <div class="mt-8 text-center">
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enterprise Middleware Protected</p>
            </div>
        </div>
    </div>
`;

// 2. Dashboard Component
const DashboardUI = () => `
    <nav class="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-40 no-print">
        <div class="flex items-center gap-3">
            <div class="bg-indigo-600 p-2 rounded-lg text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <span class="font-extrabold text-slate-800 tracking-tight">LateComer Management</span>
        </div>
        <div class="flex items-center gap-4">
            <div class="text-right">
                <p class="text-[10px] font-bold text-slate-400 uppercase leading-none">${state.user.role}</p>
                <p class="text-sm font-bold text-slate-700 leading-none mt-1">${state.user.username}</p>
            </div>
            <button onclick="handleLogout()" class="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
        </div>
    </nav>

    <main class="max-w-7xl mx-auto p-6 space-y-8">
        <!-- Registration Form -->
        <div class="no-print">
            <div class="glass-card rounded-[2rem] p-8 shadow-sm">
                <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <span class="w-1.5 h-5 bg-indigo-600 rounded-full"></span>
                    Student Entry Registration
                </h2>
                <form id="entryForm" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Full Name</label>
                        <input type="text" id="name" required class="form-input" placeholder="Enter student name">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Roll Number</label>
                        <input type="text" id="roll_no" required class="form-input" placeholder="e.g. 21CS001">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Department</label>
                        <select id="dept" class="form-input">
                            <option>Computer Science</option>
                            <option>Mechanical</option>
                            <option>Electrical</option>
                            <option>Civil</option>
                            <option>Information Technology</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Year</label>
                        <select id="year" class="form-input">
                            <option>1st Year</option><option>2nd Year</option>
                            <option>3rd Year</option><option>4th Year</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Section / Class</label>
                        <input type="text" id="class" required class="form-input" placeholder="e.g. A">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Transport Mode</label>
                        <select id="transport" class="form-input">
                            <option>College Bus</option><option>Public Bus</option>
                            <option>Private Vehicle</option><option>Walking</option>
                        </select>
                    </div>
                    <div class="md:col-span-2 lg:col-span-3">
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Reason for Tardiness</label>
                        <div class="flex flex-col md:flex-row gap-4">
                            <input type="text" id="reason" required class="form-input flex-grow" placeholder="Specify reason...">
                            <button type="submit" class="btn-primary flex items-center justify-center gap-2 min-w-[160px]">
                                <span>Log Entry</span>
                                <div id="entrySpinner" class="spinner hidden" style="border-top-color: white; width: 14px; height: 14px;"></div>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <!-- Entries Table -->
        <div class="glass-card rounded-[2rem] shadow-sm overflow-hidden">
            <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center no-print bg-white/50">
                <h3 class="font-bold text-slate-800">Tardiness History Log</h3>
                <div class="flex gap-2">
                    <button onclick="fetchEntries()" class="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    </button>
                    <button onclick="window.print()" class="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider">Export PDF</button>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-slate-50 text-[10px] uppercase font-black text-slate-400">
                        <tr>
                            <th class="px-8 py-4">Student Detail</th>
                            <th class="px-4 py-4">Course</th>
                            <th class="px-4 py-4">Transport</th>
                            <th class="px-4 py-4">Reason</th>
                            <th class="px-8 py-4">Logged Time</th>
                        </tr>
                    </thead>
                    <tbody id="entriesTableBody" class="divide-y divide-slate-100 bg-white">
                        <!-- Data injected by JS -->
                    </tbody>
                </table>
            </div>
        </div>
    </main>
`;

// --- 4. API SERVICES ---

/**
 * Authentication Service
 * Communicates with Java /api/auth or uses mock data
 */
async function authenticateUser(credentials) {
    // Check if mock mode is enabled
    if (CONFIG.MOCK_MODE) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check mock credentials
        const mockUser = MOCK_USERS.find(
            u => u.username === credentials.username && u.password === credentials.password
        );
        
        if (mockUser) {
            return {
                username: mockUser.username,
                role: mockUser.role,
                token: mockUser.token
            };
        }
        throw new Error('Invalid Credentials');
    }
    
    // Real backend authentication
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.AUTH}`, {
            method: 'POST',
            headers: CONFIG.HEADERS,
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Invalid Credentials');
        }

        return await response.json(); // Expected: { username: string, role: string, token: string }
    } catch (error) {
        console.error("Auth Service Error:", error);
        throw error;
    }
}

/**
 * Entry Service
 * Communicates with Java /api/entries
 */
const EntryService = {
    async getAll() {
        const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.ENTRIES}`, {
            headers: CONFIG.HEADERS
        });
        if (!response.ok) throw new Error('Failed to fetch entries');
        return await response.json();
    },

    async create(entryData) {
        const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.ENTRIES}`, {
            method: 'POST',
            headers: CONFIG.HEADERS,
            body: JSON.stringify(entryData)
        });
        if (!response.ok) throw new Error('Failed to save entry');
        return await response.json();
    }
};

// --- 5. ACTION HANDLERS ---

/**
 * Handles Login Submission
 */
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    toggleLoginLoading(true);

    try {
        const userData = await authenticateUser({ username, password });
        state.isAuthenticated = true;
        state.user = userData;
        state.view = 'DASHBOARD';
        render();
        fetchEntries();
        showToast("Access Granted. Welcome back.", "success");
    } catch (error) {
        showToast("Authentication Failed. Check credentials.", "error");
    } finally {
        toggleLoginLoading(false);
    }
}

/**
 * Handles Form Submission for new Late Entry
 */
async function handleEntrySubmit(e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('name').value,
        roll_no: document.getElementById('roll_no').value,
        dept: document.getElementById('dept').value,
        year: document.getElementById('year').value,
        class: document.getElementById('class').value,
        transport: document.getElementById('transport').value,
        reason: document.getElementById('reason').value,
        recorded_by: state.user.username
    };

    toggleEntryLoading(true);

    try {
        await EntryService.create(data);
        showToast("Entry Logged successfully.", "success");
        e.target.reset();
        fetchEntries();
    } catch (error) {
        showToast("Cloud Save Failed.", "error");
    } finally {
        toggleEntryLoading(false);
    }
}

/**
 * Loads Initial Dashboard Data
 */
async function fetchEntries() {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.ENTRIES}`);
        if (response.ok) {
            state.entries = await response.json();
            updateEntriesTable();
        }
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

/**
 * Log Out logic
 */
function handleLogout() {
    state.isAuthenticated = false;
    state.user = null;
    state.view = 'LOGIN';
    state.entries = [];
    render();
}

// --- 6. UI UTILITIES ---

/**
 * Main Render Loop
 */
function render() {
    const root = document.getElementById('app-root');
    if (!root) return;
    
    if (state.view === 'LOGIN') {
        root.innerHTML = LoginUI();
        attachLoginListener();
    } else {
        root.innerHTML = DashboardUI();
        attachDashboardListeners();
        updateEntriesTable();
    }
}

/**
 * Updates the entries table with current state data
 */
function updateEntriesTable() {
    const body = document.getElementById('entriesTableBody');
    if (!body) return;
    
    if (state.entries.length === 0) {
        body.innerHTML = `<tr><td colspan="5" class="py-12 text-center text-slate-400 italic">No tardiness records found in the system.</td></tr>`;
        return;
    }

    body.innerHTML = state.entries.map(e => `
        <tr class="hover:bg-slate-50 transition-colors">
            <td class="px-8 py-4">
                <div class="font-bold text-slate-800">${e.name}</div>
                <div class="text-[10px] font-mono text-slate-400 font-medium">${e.roll_no}</div>
            </td>
            <td class="px-4 py-4">
                <div class="text-xs font-bold text-slate-600">${e.dept}</div>
                <div class="text-[10px] text-slate-400 uppercase font-bold">${e.year} • Sec ${e.class}</div>
            </td>
            <td class="px-4 py-4">
                <span class="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider">${e.transport}</span>
            </td>
            <td class="px-4 py-4 text-xs text-slate-600 italic">"${e.reason}"</td>
            <td class="px-8 py-4">
                <div class="text-[10px] font-mono font-bold text-slate-500">${e.time || 'Today'}</div>
                <div class="text-[9px] text-indigo-400 font-black uppercase mt-1">Logged by: ${e.recorded_by}</div>
            </td>
        </tr>
    `).join('');
}

/**
 * Attaches login form listener
 */
function attachLoginListener() {
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
}

/**
 * Attaches dashboard form listeners
 */
function attachDashboardListeners() {
    document.getElementById('entryForm')?.addEventListener('submit', handleEntrySubmit);
}

/**
 * Toggle login loading state
 */
function toggleLoginLoading(isLoading) {
    const btn = document.getElementById('loginBtnText');
    const spinner = document.getElementById('loginSpinner');
    if (!btn || !spinner) return;
    btn.classList.toggle('hidden', isLoading);
    spinner.classList.toggle('hidden', !isLoading);
}

/**
 * Toggle entry submission loading state
 */
function toggleEntryLoading(isLoading) {
    const spinner = document.getElementById('entrySpinner');
    if (spinner) spinner.classList.toggle('hidden', !isLoading);
}

/**
 * Displays feedback to user via toast notification
 */
function showToast(msg, type = 'info') {
    const toast = document.getElementById('toast');
    const message = document.getElementById('toast-message');
    if (!toast || !message) return;
    
    message.innerText = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// --- 7. INITIALIZATION ---

/**
 * Initialize the application
 */
function init() {
    console.log("Late Comer Management System Initialized");
    render();
}

// Launch app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
