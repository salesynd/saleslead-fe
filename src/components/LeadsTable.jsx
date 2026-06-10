import React from 'react';
import './LeadsTable.css';

const LeadsTable = ({ leads }) => {
    return (
        <div className="table-container">
            <div className="table-header-controls">
                <input 
                    type="text" 
                    placeholder="Search leads..." 
                    className="input-field search-input" 
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
                        {leads.length > 0 ? leads.map((lead, idx) => (
                            <tr key={lead.id || idx}>
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
            
            <div className="table-pagination">
                <button className="btn-page">&larr;</button>
                <button className="btn-page active">1</button>
                <button className="btn-page">2</button>
                <button className="btn-page">&rarr;</button>
            </div>
        </div>
    );
};

export default LeadsTable;
