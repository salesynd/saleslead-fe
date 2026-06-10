const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:8080/auth';

const extractArray = (data) => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
        for (const key in data) {
            if (Array.isArray(data[key])) return data[key];
        }
    }
    return [];
};

async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Unauthorized');
    }

    const data = await response.json();
    if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

const apiCache = {};

export const clearCache = () => {
    for (let key in apiCache) delete apiCache[key];
};

async function fetchWithAuthCached(url, options = {}) {
    if (!options.method || options.method === 'GET') {
        const fullUrl = `${url}`;
        if (apiCache[fullUrl]) {
            // Fetch in background to update cache for next time
            fetchWithAuth(url, options).then(data => { apiCache[fullUrl] = data; }).catch(()=>{});
            return apiCache[fullUrl];
        }
        const data = await fetchWithAuth(url, options);
        apiCache[fullUrl] = data;
        return data;
    } else {
        // Mutative request, clear cache
        clearCache();
        return fetchWithAuth(url, options);
    }
}

export const api = {
    login: async (email, password) => {
        console.log("Attempting login for", email);
        const response = await fetch(`${AUTH_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const rawText = await response.text();
        console.log("Raw login response from server:", rawText);
        
        let data;
        try {
            data = JSON.parse(rawText);
        } catch (e) {
            throw new Error("Server returned invalid JSON format.");
        }
        
        if (!response.ok) throw new Error(data.message || 'Login failed');
        
        // Ensure token is safely retrieved regardless of wrapping
        const actualToken = data.token || (data.data && data.data.token);
        
        if (!actualToken) {
             console.error("Token missing in parsed data:", data);
             throw new Error("Token is missing from the server response.");
        }
        
        // Return normalized format
        return {
            success: true,
            token: actualToken
        };
    },
    
    // Users
    getUsers: async (params = '') => extractArray(await fetchWithAuthCached(`/users${params}`)),
    createUser: (user) => fetchWithAuthCached('/user', { method: 'POST', body: JSON.stringify(user) }),
    updateUser: (id, user) => fetchWithAuthCached(`/users/${id}`, { method: 'PUT', body: JSON.stringify(user) }),
    
    // Leads
    getLeads: async (params = '') => extractArray(await fetchWithAuthCached(`/leads${params}`)),
    createLead: (lead) => fetchWithAuthCached('/leads', { method: 'POST', body: JSON.stringify(lead) }),
    
    // Companies
    getCompanies: async (params = '') => extractArray(await fetchWithAuthCached(`/companies${params}`)),
    createCompany: (company) => fetchWithAuthCached('/companies', { method: 'POST', body: JSON.stringify(company) }),
    
    // Roles
    getRoles: async () => extractArray(await fetchWithAuthCached('/roles')),
    
    // Comments
    getComments: async (params = '') => extractArray(await fetchWithAuthCached(`/comments${params}`)),
    
    // POs
    getPos: async (params = '') => extractArray(await fetchWithAuthCached(`/pos${params}`)),
    
    // Notifications
    sendNotification: (payload) => fetchWithAuthCached('/notifications', { method: 'POST', body: JSON.stringify(payload) })
};
