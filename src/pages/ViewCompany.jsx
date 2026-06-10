import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import Navbar from '../components/Navbar';
import '../pages/Dashboard.css';

const ViewCompany = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const compsData = await api.getCompanies();
            const foundComp = compsData.find(c => c.id === id);
            setCompany(foundComp);
        } catch (error) {
            console.error("Failed to fetch company details", error);
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
                        <button className="btn-secondary" onClick={() => navigate('/companies')}>&larr; Back</button>
                        <div>
                            <h1 className="dashboard-title">Company Details</h1>
                            <p className="dashboard-subtitle">View complete information for this company.</p>
                        </div>
                    </div>
                    
                    <div className="dashboard-section" style={{ marginTop: '2rem', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                        {loading ? (
                            <div>Loading company details...</div>
                        ) : company ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Company Name</h3>
                                    <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>{company.companyname || '-'}</p>
                                </div>
                                <div>
                                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Email Address</h3>
                                    <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>{company.companyemail || '-'}</p>
                                </div>
                                <div>
                                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Phone Number</h3>
                                    <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>{company.companyphone || '-'}</p>
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Details</h3>
                                    <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>{company.companydetails || '-'}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="empty-state">Company not found.</div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ViewCompany;
