import React, { useState, useEffect } from 'react';
import { api } from '../api';
import Navbar from '../components/Navbar';
import InsightCards from '../components/InsightCards';
import '../pages/Dashboard.css';

const CompaniesPage = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({ total: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async (query = '') => {
        try {
            setLoading(true);
            const data = await api.getCompanies(query);
            setCompanies(data);
            setMetrics({ 
                total: data.length,
                active: data.length,
                newThisMonth: data.length, // mock
                newThisYear: data.length // mock
            });
        } catch (error) {
            console.error("Failed to fetch companies", error);
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

    const searchedCompanies = companies.filter(c => 
        !appliedSearch || 
        (c.companyname && c.companyname.toLowerCase().includes(appliedSearch.toLowerCase())) ||
        (c.companyemail && c.companyemail.toLowerCase().includes(appliedSearch.toLowerCase())) ||
        (c.companyphone && String(c.companyphone).toLowerCase().includes(appliedSearch.toLowerCase()))
    );

    const totalPages = Math.ceil(searchedCompanies.length / itemsPerPage);
    const paginatedCompanies = searchedCompanies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="dashboard-layout">
            <Navbar />
            <main className="dashboard-main">
                <div className="dashboard-content">
                    <div className="dashboard-header">
                        <div>
                            <h1 className="dashboard-title">All Companies</h1>
                            <p className="dashboard-subtitle">Manage companies inside the platform.</p>
                        </div>
                    </div>
                    
                    <InsightCards type="companies" metrics={metrics} />

                    <div className="dashboard-section table-wrapper" style={{marginTop: '2rem'}}>
                        <div className="table-header-controls" style={{display: 'flex', width: '100%', alignItems: 'center', boxSizing: 'border-box', marginBottom: '1rem', padding: '1rem', borderBottom: '1px solid var(--border-color)'}}>
                            <input 
                                type="text" 
                                placeholder="Search companies by name, email, or phone... (Press Enter)" 
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
                                    <th>Company Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" className="empty-state">Loading companies...</td></tr>
                                ) : paginatedCompanies.length > 0 ? (
                                    paginatedCompanies.map((c, idx) => (
                                        <tr key={c.id || idx} onClick={() => window.location.href=`/company/${c.id}`} style={{cursor: 'pointer'}}>
                                            <td style={{fontWeight: '600'}}>{c.companyname}</td>
                                            <td>{c.companyemail || '-'}</td>
                                            <td>{c.companyphone || '-'}</td>
                                            <td>{c.companydetails || '-'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="empty-state">No companies found.</td></tr>
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

export default CompaniesPage;
