/**
 * Late Comer Management System - Frontend Logic (app.js)
 * * This file handles the state-driven UI, connectivity to the 
 * Java Spring Boot middleware, and user interactions.
 */

// --- 1. CONFIGURATION ---
const API_CONFIG = {
    BASE_URL: "http://localhost:8080/api",
    ENDPOINTS: {
        AUTH: "/auth",
        ENTRIES: "/entries"
    },
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// --- 2. GLOBAL STATE ---
let appState = {
    user: null,
    isAuthenticated: false,
    view: 'LOGIN', // 'LOGIN' or 'DASHBOARD'
    entries: [],
    isFetching: false,
    isSubmitting: false
};

// --- 3. CORE API SERVICES (Connectivity to Java) ---

/**
 * Authentication Service
 * Communicates with Java /api/auth
 */
async function authenticateUser(credentials) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH}`, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
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
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ENTRIES}`, {
            headers: API_CONFIG.HEADERS
        });
        if (!response.ok) throw new Error('Failed to fetch entries');
        return await response.json();
    },

    async create(entryData) {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ENTRIES}`, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify(entryData)
        });
        if (!response.ok) throw new Error('Failed to save entry');
        return await response.json();
    }
};

// --- 4. ACTION HANDLERS ---

/**
 * Handles Login Submission
 */
async function handleLogin(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    updateState({ isFetching: true });

    try {
        const userData = await authenticateUser({ username, password });
        updateState({
            user: userData,
            isAuthenticated: true,
            view: 'DASHBOARD',
            isFetching: false
        });
        showNotification("Success", "Authenticated successfully", "success");
        loadDashboardData();
    } catch (error) {
        updateState({ isFetching: false });
        showNotification("Login Failed", error.message, "error");
    }
}

/**
 * Handles Form Submission for new Late Entry
 */
async function handleEntrySubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const entryData = Object.fromEntries(formData.entries());
    
    // Add metadata
    entryData.recorded_by = appState.user.username;
    entryData.time = new Date().toLocaleString(); // Usually backend handles this, but available for frontend log

    updateState({ isSubmitting: true });

    try {
        await EntryService.create(entryData);
        event.target.reset();
        showNotification("Success", "Entry recorded in SeaTable", "success");
        await loadDashboardData(); // Refresh list
    } catch (error) {
        showNotification("Error", "Middleware error or SeaTable offline", "error");
    } finally {
        updateState({ isSubmitting: false });
    }
}

/**
 * Loads Initial Dashboard Data
 */
async function loadDashboardData() {
    updateState({ isFetching: true });
    try {
        const data = await EntryService.getAll();
        updateState({ entries: data, isFetching: false });
    } catch (error) {
        updateState({ isFetching: false });
        console.error("Data Load Error:", error);
    }
}

/**
 * Log Out logic
 */
function handleLogout() {
    updateState({
        user: null,
        isAuthenticated: false,
        view: 'LOGIN',
        entries: []
    });
    localStorage.removeItem('session_token'); // If using tokens
}

// --- 5. UI UTILITIES ---

/**
 * State Management Helper
 * Updates global state and triggers re-render
 */
function updateState(newState) {
    appState = { ...appState, ...newState };
    // Event dispatch for re-rendering if logic is separated
    const renderEvent = new CustomEvent('stateUpdate');
    window.dispatchEvent(renderEvent);
}

/**
 * Displays feedback to user
 */
function showNotification(title, message, type) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;

    toastMsg.innerHTML = `<strong>${title}:</strong> ${message}`;
    toast.className = `fixed bottom-5 right-5 px-6 py-3 rounded-2xl shadow-2xl transition-all duration-300 z-[100] transform translate-y-0 opacity-100 ${
        type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
    }`;

    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 4000);
}

// --- 6. INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    console.log("Late Comer Management System Initialized");
    
    // Check for existing session if necessary
    // ... logic ...
});

// Listener for rendering (Used by index.html script or separate renderer)
window.addEventListener('stateUpdate', () => {
    // This is where index.html calls its render() function
    if (typeof render === 'function') render();
});