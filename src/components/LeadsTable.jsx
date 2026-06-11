import React, { useState } from 'react';
import './LeadsTable.css';

const LeadsTable = ({ leads, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    const itemsPerPage = 10;

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setAppliedSearch(searchTerm);
            setCurrentPage(1);
        }
    };

    const searchedLeads = leads.filter(l => 
        !appliedSearch || 
        (l.leadName && l.leadName.toLowerCase().includes(appliedSearch.toLowerCase())) ||
        (l.email && l.email.toLowerCase().includes(appliedSearch.toLowerCase())) ||
        (l.phone && String(l.phone).toLowerCase().includes(appliedSearch.toLowerCase()))
    );

    const totalPages = Math.ceil(searchedLeads.length / itemsPerPage);
    const paginatedLeads = searchedLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return (
        <div className="table-container">
            <div className="table-header-controls" style={{display: 'flex', width: '100%', boxSizing: 'border-box', marginBottom: '1rem', padding: '1rem', borderBottom: '1px solid var(--border-color)'}}>
                <input 
                    type="text" 
                    placeholder="Search leads by name, email, or phone... (Press Enter)" 
                    className="input-field search-input" 
                    style={{width: '100%', boxSizing: 'border-box'}}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Lead Name</th>
                            <th>Status</th>
                            <th>Phone</th>
                            <th>Assigned To</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="empty-state">Loading leads...</td>
                            </tr>
                        ) : paginatedLeads.length > 0 ? paginatedLeads.map((lead, idx) => (
                            <tr key={lead.id || idx} onClick={() => window.location.href=`/lead/${lead.id}`} style={{cursor: 'pointer'}}>
                                <td>
                                    <div className="lead-name">{lead.leadName}</div>
                                    <div className="lead-id">ID: {lead.id}</div>
                                    <div className="lead-email">{lead.email}</div>
                                </td>
                                <td>
                                    <span className={`status-badge ${lead.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                                        {lead.status || 'New'}
                                    </span>
                                </td>
                                <td>{lead.phone}</td>
                                <td>{lead.assignedToEmailId || 'Unassigned'}</td>
                                <td className="lead-details">
                                    {lead.note ? (
                                        <div className="lead-note" title={lead.note}>
                                            {lead.note.substring(0, 50)}...
                                        </div>
                                    ) : (
                                        '-'
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="empty-state">No leads found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
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
    );
};

export default LeadsTable;
