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
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersData, compsData, commentsData] = await Promise.all([
                api.getUsers(),
                api.getCompanies(),
                api.getComments()
            ]);
            
            const foundUser = usersData.find(u => u.id === id);
            setUserDet(foundUser);
            
            if (foundUser && foundUser.companyId) {
                const comp = compsData.find(c => c.id === foundUser.companyId);
                setCompanyName(comp ? comp.companyname : 'Unknown');
            } else {
                setCompanyName('-');
            }

            if (foundUser) {
                const userComments = commentsData.filter(c => c.createdByEmailId === foundUser.email);
                // Sort comments descending by date
                userComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setComments(userComments);
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
                <div className="dashboard-content" style={{maxWidth: '900px', margin: '0 auto'}}>
                    <div className="dashboard-header" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button className="btn-secondary" onClick={() => navigate('/users')}>&larr; Back</button>
                        <div>
                            <h1 className="dashboard-title">User Details</h1>
                            <p className="dashboard-subtitle">View complete information for this user.</p>
                        </div>
                    </div>
                    
                    <div className="dashboard-section" style={{ marginTop: '2rem', padding: '2rem' }}>
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

                    {!loading && userDet && (
                        <div className="dashboard-section" style={{ marginTop: '2rem', padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>User Timeline Feed</h2>
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
                                                <span><strong>Status updated:</strong> {comment.status || 'No Change'}</span>
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
                                <p style={{ color: 'var(--text-muted)' }}>No activity found for this user.</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ViewUser;
