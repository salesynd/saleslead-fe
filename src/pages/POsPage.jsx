import React, { useState, useEffect } from 'react';
import { api } from '../api';
import Navbar from '../components/Navbar';
import InsightCards from '../components/InsightCards';
import '../pages/Dashboard.css';

const POsPage = () => {
    const [pos, setPos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({ total: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchPOs();
    }, []);

    const fetchPOs = async (query = '') => {
        try {
            setLoading(true);
            const data = await api.getPos(query);
            setPos(data);
            setMetrics({ 
                total: data.length,
                thisWeek: data.length, // mock
                thisMonth: data.length, // mock
                thisYear: data.length // mock
            });
        } catch (error) {
            console.error("Failed to fetch POs", error);
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

    const searchedPOs = pos.filter(po => 
        !appliedSearch || 
        (po.leadName && po.leadName.toLowerCase().includes(appliedSearch.toLowerCase())) ||
        (po.id && String(po.id).toLowerCase().includes(appliedSearch.toLowerCase())) ||
        (po.status && po.status.toLowerCase().includes(appliedSearch.toLowerCase()))
    );

    const totalPages = Math.ceil(searchedPOs.length / itemsPerPage);
    const paginatedPOs = searchedPOs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="dashboard-layout">
            <Navbar />
            <main className="dashboard-main">
                <div className="dashboard-content">
                    <div className="dashboard-header">
                        <div>
                            <h1 className="dashboard-title">Purchase Orders</h1>
                            <p className="dashboard-subtitle">Track all generated POs.</p>
                        </div>
                    </div>
                    
                    <InsightCards type="pos" metrics={metrics} />

                    <div className="dashboard-section table-wrapper" style={{marginTop: '2rem'}}>
                        <div className="table-header-controls" style={{display: 'flex', width: '100%', alignItems: 'center', boxSizing: 'border-box', marginBottom: '1rem', padding: '1rem', borderBottom: '1px solid var(--border-color)'}}>
                            <input 
                                type="text" 
                                placeholder="Search POs by lead, ID, or status... (Press Enter)" 
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
                                    <th>PO ID</th>
                                    <th>Lead Name</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" className="empty-state">Loading POs...</td></tr>
                                ) : paginatedPOs.length > 0 ? (
                                    paginatedPOs.map((po, idx) => (
                                        <tr key={po.id || idx} onClick={() => window.location.href=`/po/${po.id}`} style={{cursor: 'pointer'}}>
                                            <td style={{fontWeight: '600'}}>PO-{po.id?.substring(0, 8)}</td>
                                            <td>{po.leadName || 'Unknown Lead'}</td>
                                            <td><span className="status-badge po">{po.status || 'Active'}</span></td>
                                            <td>{new Date(po.createdAt || Date.now()).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="empty-state">No POs found.</td></tr>
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
        </div>
    );
};

export default POsPage;
