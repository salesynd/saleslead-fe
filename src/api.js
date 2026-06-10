const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:8080/auth';

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
    if (!response.ok || !data.success) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
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
    getUsers: (params = '') => fetchWithAuth(`/users${params}`),
    createUser: (user) => fetchWithAuth('/user', { method: 'POST', body: JSON.stringify(user) }),
    
    // Leads
    getLeads: (params = '') => fetchWithAuth(`/leads${params}`),
    createLead: (lead) => fetchWithAuth('/leads', { method: 'POST', body: JSON.stringify(lead) }),
    
    // Companies
    getCompanies: (params = '') => fetchWithAuth(`/companies${params}`),
    createCompany: (company) => fetchWithAuth('/companies', { method: 'POST', body: JSON.stringify(company) }),
    
    // Comments
    getComments: (params = '') => fetchWithAuth(`/comments${params}`),
    
    // POs
    getPos: (params = '') => fetchWithAuth(`/pos${params}`),
};
