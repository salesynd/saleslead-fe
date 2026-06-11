import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import Navbar from '../components/Navbar';
import '../pages/Dashboard.css';

const ViewCompany = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [compsData, usersData, commentsData] = await Promise.all([
                api.getCompanies(),
                api.getUsers(),
                api.getComments()
            ]);
            
            const foundComp = compsData.find(c => c.id === id);
            setCompany(foundComp);

            if (foundComp) {
                // Find all users that belong to this company
                const companyUsers = usersData.filter(u => u.companyId === id);
                const companyUserEmails = companyUsers.map(u => u.email);

                // Find all comments by any user in this company
                const compComments = commentsData.filter(c => companyUserEmails.includes(c.createdByEmailId));
                compComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setComments(compComments);
            }
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
                <div className="dashboard-content" style={{maxWidth: '900px', margin: '0 auto'}}>
                    <div className="dashboard-header" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button className="btn-secondary" onClick={() => navigate('/companies')}>&larr; Back</button>
                        <div>
                            <h1 className="dashboard-title">Company Details</h1>
                            <p className="dashboard-subtitle">View complete information for this company.</p>
                        </div>
                    </div>
                    
                    <div className="dashboard-section" style={{ marginTop: '2rem', padding: '2rem' }}>
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

                    {!loading && company && (
                        <div className="dashboard-section" style={{ marginTop: '2rem', padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Company Timeline Feed</h2>
                            {comments.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {comments.map((comment, idx) => (
                                        <div 
                                            key={idx} 
                                            onClick={() => navigate(`/lead/${comment.leadId}`)}
                                            style={{
                                                padding: '1.25rem', 
                                                border: '1px solid var(--border-color)', 
                                                borderRadius: 'var(--radius-md)',
                                                cursor: 'pointer',
                                                background: 'var(--bg-light)',
                                                transition: 'transform 0.2s, box-shadow 0.2s'
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.transform = 'none';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                <span><strong>Status updated:</strong> {comment.status || 'No Change'} by {comment.createdByEmailId}</span>
                                                <span>{new Date(comment.createdAt).toLocaleString()}</span>
                                            </div>
                                            <p style={{ fontSize: '1rem', color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>{comment.comment}</p>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: '600' }}>
                                                View associated Lead &rarr;
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-muted)' }}>No activity found for this company.</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ViewCompany;
