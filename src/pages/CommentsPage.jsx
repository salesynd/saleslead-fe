import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import Navbar from '../components/Navbar';
import InsightCards from '../components/InsightCards';
import '../pages/Dashboard.css';

const CommentsPage = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const filter = searchParams.get('filter'); // 'my'
    
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Metrics
    const [metrics, setMetrics] = useState({
        total: 0,
        today: 0,
        convToday: 0,
        poToday: 0
    });

    useEffect(() => {
        fetchComments();
    }, [filter]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const data = await api.getComments();
            let allComments = data.data || [];
            
            if (filter === 'my') {
                allComments = allComments.filter(c => c.createdByEmailId === user?.email);
            }
            
            setComments(allComments);
            
            const today = new Date().toDateString();
            const todayComments = allComments.filter(c => new Date(c.createdAt).toDateString() === today);
            
            setMetrics({
                total: allComments.length,
                today: todayComments.length,
                convToday: todayComments.filter(c => c.status === 'In Conversation').length,
                poToday: todayComments.filter(c => c.status === 'PO').length
            });
            
        } catch (error) {
            console.error("Failed to fetch comments", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-layout">
            <Navbar />
            <main className="dashboard-main">
                <div className="dashboard-content">
                    <div className="dashboard-header">
                        <div>
                            <h1 className="dashboard-title">{filter === 'my' ? 'My Comments' : 'All Comments'}</h1>
                            <p className="dashboard-subtitle">Review interaction history across all leads.</p>
                        </div>
                    </div>
                    
                    <InsightCards type="comments" metrics={metrics} />
                    
                    <div className="dashboard-section table-wrapper" style={{marginTop: '2rem'}}>
                        <div style={{padding: '1rem', borderBottom: '1px solid var(--border-color)'}}>
                            <input 
                                type="text" 
                                placeholder="Search comments..." 
                                className="input-field"
                                style={{maxWidth: '400px'}}
                            />
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Lead</th>
                                    <th>Comment</th>
                                    <th>Created By</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className="empty-state">Loading...</td></tr>
                                ) : comments.length > 0 ? (
                                    comments.map((comment, idx) => (
                                        <tr key={comment.id || idx}>
                                            <td style={{fontWeight: '600'}}>{comment.leadName || `Lead #${comment.leadId}`}</td>
                                            <td>{comment.comment}</td>
                                            <td style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{comment.createdByEmailId}</td>
                                            <td>
                                                <span className={`status-badge ${comment.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                                                    {comment.status || 'New'}
                                                </span>
                                            </td>
                                            <td style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <button className="btn-secondary" style={{padding: '0.25rem 0.5rem'}}>View</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" className="empty-state">No comments found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <footer className="dashboard-footer">
                <p>POWERED BY RIGTEQ</p>
            </footer>
        </div>
    );
};

export default CommentsPage;
