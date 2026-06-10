import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import Navbar from '../components/Navbar';
import '../pages/Dashboard.css';

const ViewUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userDet, setUserDet] = useState(null);
    const [companyName, setCompanyName] = useState('Loading...');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersData, compsData] = await Promise.all([
                api.getUsers(),
                api.getCompanies()
            ]);
            
            const foundUser = usersData.find(u => u.id === id);
            setUserDet(foundUser);
            
            if (foundUser && foundUser.companyId) {
                const comp = compsData.find(c => c.id === foundUser.companyId);
                setCompanyName(comp ? comp.companyname : 'Unknown');
            } else {
                setCompanyName('-');
            }
        } catch (error) {
            console.error("Failed to fetch user details", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-layout">
            <Navbar />
            <main className="dashboard-main">
                <div className="dashboard-content">
                    <div className="dashboard-header" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button className="btn-secondary" onClick={() => navigate('/users')}>&larr; Back</button>
                        <div>
                            <h1 className="dashboard-title">User Details</h1>
                            <p className="dashboard-subtitle">View complete information for this user.</p>
                        </div>
                    </div>
                    
                    <div className="dashboard-section" style={{ marginTop: '2rem', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                        {loading ? (
                            <div>Loading user details...</div>
                        ) : userDet ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Full Name</h3>
                                    <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>{userDet.name || '-'}</p>
                                </div>
                                <div>
                                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Email Address</h3>
                                    <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>{userDet.email || '-'}</p>
                                </div>
                                <div>
                                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Phone Number</h3>
                                    <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>{userDet.phone || '-'}</p>
                                </div>
                                <div>
                                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Role</h3>
                                    <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>
                                        <span className={`status-badge ${userDet.roleId === 1 ? 'status-admin' : 'status-user'}`}>
                                            {userDet.roleId === 1 ? 'Admin' : 'User'}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Company</h3>
                                    <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>{companyName}</p>
                                </div>
                                <div>
                                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Address</h3>
                                    <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>{userDet.address || '-'}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="empty-state">User not found.</div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ViewUser;
