import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import Navbar from '../components/Navbar';
import InsightCards from '../components/InsightCards';
import LeadsTable from '../components/LeadsTable';
import '../pages/Dashboard.css';

const LeadsPage = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const filter = searchParams.get('filter'); // e.g., 'my'
    
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Metrics
    const [metrics, setMetrics] = useState({
        total: 0,
        newLeads: 0,
        inConversation: 0,
        converted: 0
    });

    useEffect(() => {
        fetchLeads();
    }, [filter]);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const data = await api.getLeads();
            let allLeads = data.data || [];
            
            if (filter === 'my') {
                allLeads = allLeads.filter(l => l.assignedToEmailId === user?.email);
            }
            
            setLeads(allLeads);
            
            // Calculate metrics
            setMetrics({
                total: allLeads.length,
                newLeads: allLeads.filter(l => l.status === 'New').length,
                inConversation: allLeads.filter(l => l.status === 'In Conversation').length,
                converted: allLeads.filter(l => l.status === 'PO').length
            });
            
        } catch (error) {
            console.error("Failed to fetch leads", error);
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
                            <h1 className="dashboard-title">{filter === 'my' ? 'My Leads' : 'All Leads'}</h1>
                            <p className="dashboard-subtitle">Manage and track all sales leads.</p>
                        </div>
                    </div>
                    
                    <InsightCards type="leads" metrics={metrics} />
                    
                    <div className="dashboard-section">
                        {loading ? <div className="loading-state">Loading data...</div> : <LeadsTable leads={leads} />}
                    </div>
                </div>
            </main>
            <footer className="dashboard-footer">
                <p>POWERED BY RIGTEQ</p>
            </footer>
        </div>
    );
};

export default LeadsPage;
