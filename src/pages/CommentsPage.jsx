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
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
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

    const fetchComments = async (query = '') => {
        try {
            setLoading(true);
            const data = await api.getComments(query);
            let allComments = data;
            
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

    const handleSearch = () => {
        setAppliedSearch(searchTerm);
        setCurrentPage(1);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const searchedComments = comments.filter(c => 
        !appliedSearch || 
        (c.leadName && c.leadName.toLowerCase().includes(appliedSearch.toLowerCase())) ||
        (c.comment && c.comment.toLowerCase().includes(appliedSearch.toLowerCase())) ||
        (c.createdByEmailId && c.createdByEmailId.toLowerCase().includes(appliedSearch.toLowerCase()))
    );

    const totalPages = Math.ceil(searchedComments.length / itemsPerPage);
    const paginatedComments = searchedComments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                        <div className="table-header-controls" style={{display: 'flex', width: '100%', alignItems: 'center', boxSizing: 'border-box', marginBottom: '1rem', padding: '1rem', borderBottom: '1px solid var(--border-color)'}}>
                            <input 
                                type="text" 
                                placeholder="Search comments by lead, text, or author... (Press Enter)" 
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
                                    <th>Lead</th>
                                    <th>Comment</th>
                                    <th>Created By</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className="empty-state">Loading...</td></tr>
                                ) : paginatedComments.length > 0 ? (
                                    paginatedComments.map((comment, idx) => (
                                        <tr key={comment.id || idx} onClick={() => window.location.href=`/lead/${comment.leadId}`} style={{cursor: 'pointer'}}>
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
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" className="empty-state">No comments found.</td></tr>
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
            <footer className="dashboard-footer">
                <p>POWERED BY RIGTEQ</p>
            </footer>
        </div>
    );
};

export default CommentsPage;
