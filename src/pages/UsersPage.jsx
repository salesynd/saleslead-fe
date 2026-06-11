import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import Navbar from '../components/Navbar';
import InsightCards from '../components/InsightCards';
import '../pages/Dashboard.css';

const UsersPage = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState({});
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({ total: 0, admins: 0, commentsToday: 0, commentsThisMonth: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async (query = '') => {
        try {
            setLoading(true);
            const [usersData, compsData, commentsData] = await Promise.all([
                api.getUsers(query),
                api.getCompanies(),
                api.getComments()
            ]);
            
            const compsMap = {};
            compsData.forEach(c => { compsMap[c.id] = c.companyname; });
            setCompanies(compsMap);
            
            const filteredUsers = usersData.filter(u => u.email !== user?.email);
            setUsers(filteredUsers);
            
            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];
            const thisMonthStr = todayStr.substring(0, 7);

            const commentsToday = commentsData.filter(c => c.createdTime && c.createdTime.startsWith(todayStr)).length;
            const commentsThisMonth = commentsData.filter(c => c.createdTime && c.createdTime.startsWith(thisMonthStr)).length;

            setMetrics({
                total: filteredUsers.length,
                admins: filteredUsers.filter(u => u.roleId === 1).length,
                commentsToday,
                commentsThisMonth
            });
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setAppliedSearch(searchTerm);
        setCurrentPage(1);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const searchedUsers = users.filter(u => 
        !appliedSearch || 
        (u.name && u.name.toLowerCase().includes(appliedSearch.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(appliedSearch.toLowerCase())) ||
        (u.phone && String(u.phone).toLowerCase().includes(appliedSearch.toLowerCase()))
    );

    const totalPages = Math.ceil(searchedUsers.length / itemsPerPage);
    const paginatedUsers = searchedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="dashboard-layout">
            <Navbar />
            <main className="dashboard-main">
                <div className="dashboard-content">
                    <div className="dashboard-header">
                        <div>
                            <h1 className="dashboard-title">All Users</h1>
                            <p className="dashboard-subtitle">Manage users and admins in the system.</p>
                        </div>
                    </div>
                    
                    <InsightCards type="users" metrics={metrics} />

                    <div className="dashboard-section table-wrapper" style={{marginTop: '2rem'}}>
                        <div className="table-header-controls" style={{display: 'flex', width: '100%', alignItems: 'center', boxSizing: 'border-box', marginBottom: '1rem', padding: '1rem', borderBottom: '1px solid var(--border-color)'}}>
                            <input 
                                type="text" 
                                placeholder="Search users by name, email, or phone... (Press Enter)" 
                                className="input-field search-input" 
                                style={{width: '100%', boxSizing: 'border-box'}}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Company</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="empty-state">Loading users...</td></tr>
                                ) : paginatedUsers.length > 0 ? (
                                    paginatedUsers.map((u, idx) => (
                                        <tr key={u.id || idx} onClick={() => window.location.href=`/user/${u.id}`} style={{cursor: 'pointer'}}>
                                            <td style={{fontWeight: '600'}}>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>{u.phone}</td>
                                            <td>
                                                <span className={`status-badge ${u.roleId === 1 ? 'status-admin' : 'status-user'}`}>
                                                    {u.roleId === 1 ? 'Admin' : 'User'}
                                                </span>
                                            </td>
                                            <td>{companies[u.companyId] || 'RigTeq'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" className="empty-state">No users found.</td></tr>
                                )}
                            </tbody>
                        </table>
                        
                        {totalPages > 1 && (
                            <div className="table-pagination" style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem'}}>
                                <button className="btn-page" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>&larr;</button>
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button key={i} className={`btn-page ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>
                                        {i + 1}
                                    </button>
                                ))}
                                <button className="btn-page" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>&rarr;</button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UsersPage;
