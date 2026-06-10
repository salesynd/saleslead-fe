import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import Navbar from '../components/Navbar';
import '../pages/Dashboard.css';

const ViewPO = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [po, setPo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const posData = await api.getPos();
            const foundPo = posData.find(p => p.id === id);
            setPo(foundPo);
        } catch (error) {
            console.error("Failed to fetch PO details", error);
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
                        <button className="btn-secondary" onClick={() => navigate('/pos')}>&larr; Back</button>
                        <div>
                            <h1 className="dashboard-title">PO Details</h1>
                            <p className="dashboard-subtitle">View complete information for this Purchase Order.</p>
                        </div>
                    </div>
                    
                    <div className="dashboard-section" style={{ marginTop: '2rem', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                        {loading ? (
                            <div>Loading PO details...</div>
                        ) : po ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>PO ID</h3>
                                    <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>PO-{po.id?.substring(0,8) || '-'}</p>
                                </div>
                                <div>
                                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Lead Name</h3>
                                    <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>{po.leadName || '-'}</p>
                                </div>
                                <div>
                                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Status</h3>
                                    <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>
                                        <span className="status-badge po">{po.status || 'Active'}</span>
                                    </p>
                                </div>
                                <div>
                                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Created At</h3>
                                    <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>{new Date(po.createdAt || Date.now()).toLocaleString()}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="empty-state">PO not found.</div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ViewPO;
