import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import Navbar from '../components/Navbar';
import { Phone, Edit, Trash2, ChevronLeft, MapPin, User as UserIcon } from 'lucide-react';
import './LeadDetail.css';

const LeadDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [newStatus, setNewStatus] = useState('New');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const leadData = await api.getLeads(`?id=${id}`);
            // Assuming API returns an array even for one, or just an object
            setLead(Array.isArray(leadData.data) ? leadData.data[0] : leadData.data);
            
            const commentsData = await api.getComments(`?leadId=${id}`);
            setComments(commentsData.data || []);
            if(leadData.data && leadData.data[0]) {
                setNewStatus(leadData.data[0].status || 'New');
            }
        } catch (error) {
            console.error("Failed to fetch lead details", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostComment = async () => {
        if (!newComment.trim()) return;
        try {
            await api.createComment({
                leadId: id,
                comment: newComment,
                status: newStatus
            });
            setNewComment('');
            fetchData();
        } catch (err) {
            console.error("Failed to post comment", err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!lead) return <div>Lead not found.</div>;

    return (
        <div className="dashboard-layout">
            <Navbar />
            <main className="dashboard-main">
                <div className="dashboard-content lead-detail-content">
                    <button className="back-btn" onClick={() => navigate('/leads')}>
                        <ChevronLeft size={16} /> Back to Leads
                    </button>
                    
                    <div className="lead-card">
                        <div className="lead-header">
                            <div>
                                <div className="lead-title-row">
                                    <h1 className="lead-title">{lead.leadName}</h1>
                                    <span className={`status-badge ${lead.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                                        {lead.status}
                                    </span>
                                </div>
                                <div className="lead-subtitle">{lead.email}</div>
                            </div>
                            <div className="lead-actions">
                                <button className="btn-outline"><Phone size={14}/> Call</button>
                                <button className="btn-whatsapp">WhatsApp</button>
                                <button className="btn-outline"><UserIcon size={14}/> Assign to Me</button>
                                <button className="btn-outline"><Edit size={14}/> Edit</button>
                                <button className="btn-danger-outline"><Trash2 size={14}/> Delete</button>
                            </div>
                        </div>
                        
                        <div className="lead-info-grid">
                            <div className="info-item">
                                <label>Phone</label>
                                <div>{lead.phone}</div>
                            </div>
                            <div className="info-item">
                                <label>Location</label>
                                <div><MapPin size={14}/> {lead.location || 'Unknown'}</div>
                            </div>
                            <div className="info-item">
                                <label>Owner</label>
                                <div><UserIcon size={14}/> {lead.assignedToEmailId || 'Unassigned'}</div>
                            </div>
                        </div>
                        
                        <div className="info-item note-section">
                            <label>Note</label>
                            <div className="note-box">
                                {lead.note || 'No notes available.'}
                            </div>
                        </div>
                        
                        <div className="lead-meta">
                            <span>Created: {new Date(lead.createdAt).toLocaleString()}</span>
                            <span>Last Edited: {new Date(lead.updatedAt).toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <h2 className="section-title">Comments & Timeline</h2>
                    <div className="comments-section">
                        <div className="comment-composer">
                            <textarea 
                                placeholder="Add a comment or update..." 
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                            />
                            <div className="composer-actions">
                                <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                                    <option>New</option>
                                    <option>Not Interested</option>
                                    <option>In Conversation</option>
                                    <option>Scheduled</option>
                                    <option>DNP</option>
                                    <option>PO</option>
                                </select>
                                <button className="btn-primary" onClick={handlePostComment}>Post</button>
                            </div>
                        </div>
                        
                        <div className="comments-list">
                            {comments.map((comment, idx) => (
                                <div key={idx} className="comment-card">
                                    <div className="comment-header">
                                        <div className="comment-author">
                                            <strong>{comment.createdByEmailId || 'Unknown'}</strong> 
                                            <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
                                        </div>
                                        <div className="comment-status">
                                            Changed status to: <strong>{comment.status || 'No Change'}</strong>
                                            <button className="icon-btn"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                    <div className="comment-body">
                                        {comment.comment}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LeadDetail;
