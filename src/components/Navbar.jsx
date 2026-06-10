import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, User, LogOut, Bell, MessageSquare, Activity, Send } from 'lucide-react';
import { api } from '../api';
import { useToast } from '../context/ToastContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifyModalOpen, setNotifyModalOpen] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState('');
    const [notifyCompanyId, setNotifyCompanyId] = useState('');
    const [companies, setCompanies] = useState([]);
    const { showToast } = useToast();
    const dropdownRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (user?.role === 'SuperAdmin') {
            api.getCompanies().then(res => {
                setCompanies(Array.isArray(res) ? res : (res.data || []));
            }).catch(() => {});
        }
    }, [user?.role]);

    const handleLogout = (e) => {
        e.preventDefault();
        setProfileOpen(false);
        logout();
    };

    const handleSendNotification = async () => {
        if (!notifyMessage) return;
        const loadingId = showToast('Sending notification...', 'loading', 0);
        try {
            await api.sendNotification({
                companyId: user?.role === 'SuperAdmin' ? notifyCompanyId : user?.companyId,
                message: notifyMessage
            });
            hideToast(loadingId);
            showToast('Notification sent successfully!', 'success');
            setNotifyModalOpen(false);
            setNotifyMessage('');
        } catch (err) {
            hideToast(loadingId);
            showToast('Failed to send notification', 'error');
        }
    };

    const navigateTo = (path) => {
        setProfileOpen(false);
        navigate(path);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-left">
                    <Link to="/dashboard" className="logo cursor-pointer" style={{ textDecoration: 'none' }}>
                        <div className="logo-icon sm">
                            {user?.role === 'SuperAdmin' ? 'S' : (user?.companyName?.charAt(0) || 'C')}
                        </div>
                        <span className="logo-text">
                            {user?.role === 'SuperAdmin' ? 'SalesLead' : (user?.companyName || `Company ${user?.companyId || ''}`)}
                        </span>
                    </Link>
                    
                    <div className="nav-links">
                        <div className="nav-item dropdown">
                            Leads <ChevronDown size={14} />
                            <div className="dropdown-menu">
                                <Link to="/leads">All Leads</Link>
                                <Link to="/leads?filter=my">My Leads</Link>
                                <Link to="/leads?filter=assigned">Assigned Leads</Link>
                                <Link to="/leads?filter=scheduled">Scheduled Leads</Link>
                            </div>
                        </div>
                        <div className="nav-item dropdown">
                            Comments <ChevronDown size={14} />
                            <div className="dropdown-menu">
                                <Link to="/comments">All Comments</Link>
                                <Link to="/comments?filter=my">My Comments</Link>
                            </div>
                        </div>
                        <Link to="/pos" className="nav-item" style={{ textDecoration: 'none' }}>POs</Link>
                        {(user?.role === 'SuperAdmin' || user?.role === 'Admin') && (
                            <Link to="/users" className="nav-item" style={{ textDecoration: 'none' }}>Users</Link>
                        )}
                        {user?.role === 'SuperAdmin' && (
                            <Link to="/companies" className="nav-item" style={{ textDecoration: 'none' }}>Companies</Link>
                        )}
                    </div>
                </div>

                <div className="navbar-right">
                    <div className="profile-dropdown-container" ref={dropdownRef}>
                        <div className="profile-dropdown" onClick={() => setProfileOpen(!profileOpen)}>
                            <User size={18} />
                            <span className="profile-name">{user?.email || 'User'}</span>
                            <ChevronDown size={14} />
                        </div>
                        
                        {profileOpen && (
                            <div className="dropdown-menu right open">
                                <div className="dropdown-item" onClick={() => navigateTo('/profile')}><User size={14}/> Profile</div>
                                <div className="dropdown-item" onClick={() => navigateTo('/insights')}><Activity size={14}/> Insights</div>
                                <div className="dropdown-item" onClick={() => navigateTo('/custom-message')}><MessageSquare size={14}/> Custom Message</div>
                                <div className="dropdown-item" onClick={() => navigateTo('/notifications')}><Bell size={14}/> Notifications</div>
                                {(user?.role === 'SuperAdmin' || user?.role === 'Admin') && (
                                    <div className="dropdown-item" onClick={() => { setProfileOpen(false); setNotifyModalOpen(true); }}><Send size={14}/> Notify Users</div>
                                )}
                                <hr />
                                <div className="dropdown-item text-danger" onClick={handleLogout}>
                                    <LogOut size={14}/> Logout
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {notifyModalOpen && (
                <div className="modal-overlay" style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
                    <div className="modal-content" style={{background: 'var(--bg-white)', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '400px'}}>
                        <h2 style={{marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold'}}>Notify Users</h2>
                        {user?.role === 'SuperAdmin' && (
                            <div className="form-group" style={{marginBottom: '1rem'}}>
                                <label className="label">Company (Optional)</label>
                                <select className="input-field" value={notifyCompanyId} onChange={e => setNotifyCompanyId(e.target.value)}>
                                    <option value="">All Companies</option>
                                    {companies.map(c => <option key={c.id} value={c.id}>{c.companyname}</option>)}
                                </select>
                            </div>
                        )}
                        <div className="form-group" style={{marginBottom: '1rem'}}>
                            <label className="label">Message *</label>
                            <textarea className="input-field" rows="4" value={notifyMessage} onChange={e => setNotifyMessage(e.target.value)} placeholder="Type your notification message here..."></textarea>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem'}}>
                            <button className="btn-secondary" onClick={() => setNotifyModalOpen(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleSendNotification} disabled={!notifyMessage}>Send</button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
