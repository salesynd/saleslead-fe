import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, User, LogOut, Bell, MessageSquare, Activity } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
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

    const handleLogout = (e) => {
        e.preventDefault();
        setProfileOpen(false);
        logout();
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
                        <div className="logo-icon sm">S</div>
                        <span className="logo-text">SalesLead</span>
                    </Link>
                    
                    <div className="nav-links">
                        <div className="nav-item dropdown">
                            Leads <ChevronDown size={14} />
                            <div className="dropdown-menu">
                                <Link to="/leads">All Leads</Link>
                                <Link to="/leads?filter=my">My Leads</Link>
                            </div>
                        </div>
                        <div className="nav-item dropdown">
                            Comments <ChevronDown size={14} />
                            <div className="dropdown-menu">
                                <Link to="/comments">All Comments</Link>
                                <Link to="/comments?filter=my">My Comments</Link>
                            </div>
                        </div>
                        <div className="nav-item dropdown">
                            POs <ChevronDown size={14} />
                            <div className="dropdown-menu">
                                <Link to="/pos">All POs</Link>
                            </div>
                        </div>
                        {(user?.role === 'SuperAdmin' || user?.role === 'Admin') && (
                            <div className="nav-item dropdown">
                                Users <ChevronDown size={14} />
                                <div className="dropdown-menu">
                                    <Link to="/dashboard">Admins</Link>
                                    <Link to="/dashboard">Users</Link>
                                </div>
                            </div>
                        )}
                        {user?.role === 'SuperAdmin' && (
                            <div className="nav-item">Companies</div>
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
                                <div className="dropdown-item" onClick={() => navigateTo('/dashboard')}><User size={14}/> Profile</div>
                                <div className="dropdown-item" onClick={() => navigateTo('/insights')}><Activity size={14}/> Insights</div>
                                <div className="dropdown-item" onClick={() => navigateTo('/custom-message')}><MessageSquare size={14}/> Custom Message</div>
                                <div className="dropdown-item"><Bell size={14}/> Notifications</div>
                                <hr />
                                <div className="dropdown-item text-danger" onClick={handleLogout}>
                                    <LogOut size={14}/> Logout
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
