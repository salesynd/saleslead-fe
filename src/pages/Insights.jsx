import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import Navbar from '../components/Navbar';
import InsightCards from '../components/InsightCards';
import { BarChart, TrendingUp, CheckCircle } from 'lucide-react';
import '../pages/Dashboard.css';

const Insights = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    
    // Metrics
    const [metrics, setMetrics] = useState({
        total: 0,
        newLeads: 0,
        inConversation: 0,
        converted: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await api.getLeads();
            const allLeads = data.data || [];
            
            setMetrics({
                total: allLeads.length,
                newLeads: allLeads.filter(l => l.status === 'New').length,
                inConversation: allLeads.filter(l => l.status === 'In Conversation').length,
                converted: allLeads.filter(l => l.status === 'PO').length
            });
            
        } catch (error) {
            console.error("Failed to fetch leads for insights", error);
        } finally {
            setLoading(false);
        }
    };

    const calculatePercentage = (value, total) => {
        if (total === 0) return 0;
        return ((value / total) * 100).toFixed(1);
    };

    const convRate = calculatePercentage(metrics.converted, metrics.total);
    const activeRate = calculatePercentage(metrics.inConversation, metrics.total);

    return (
        <div className="dashboard-layout">
            <Navbar />
            <main className="dashboard-main">
                <div className="dashboard-content">
                    <div className="dashboard-header" style={{flexDirection: 'column', alignItems: 'flex-start', marginBottom: '2rem'}}>
                        <h1 className="dashboard-title">Analytics & Insights</h1>
                        <p className="dashboard-subtitle">Overview of your sales pipeline and activity.</p>
                    </div>
                    
                    <InsightCards type="leads" metrics={metrics} />
                    
                    <div className="insights-panels" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                        
                        {/* Pipeline Health */}
                        <div className="dashboard-section" style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                                <div>
                                    <h3 style={{fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)'}}>Pipeline Health</h3>
                                    <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Current lead status distribution</p>
                                </div>
                                <div style={{padding: '0.5rem', background: 'var(--bg-light)', borderRadius: 'var(--radius-md)'}}>
                                    <BarChart size={18} color="var(--text-muted)" />
                                </div>
                            </div>
                            
                            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: 'auto', paddingBottom: '1rem'}}>
                                <div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: '600'}}>
                                        <span style={{color: 'var(--text-muted)'}}>Total Leads</span>
                                        <span style={{color: 'var(--text-main)'}}>{metrics.total}</span>
                                    </div>
                                    <div style={{height: '6px', width: '100%', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden'}}>
                                        <div style={{height: '100%', width: '100%', background: 'var(--text-muted)'}}></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: '600'}}>
                                        <span style={{color: '#8b5cf6'}}>In Conversation</span>
                                        <span style={{color: 'var(--text-muted)'}}>{activeRate}% ({metrics.inConversation})</span>
                                    </div>
                                    <div style={{height: '6px', width: '100%', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden'}}>
                                        <div style={{height: '100%', width: `${activeRate}%`, background: '#8b5cf6'}}></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: '600'}}>
                                        <span style={{color: '#10b981'}}>Converted (PO)</span>
                                        <span style={{color: 'var(--text-muted)'}}>{convRate}% ({metrics.converted})</span>
                                    </div>
                                    <div style={{height: '6px', width: '100%', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden'}}>
                                        <div style={{height: '100%', width: `${convRate}%`, background: '#10b981'}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="dashboard-section" style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                                <div>
                                    <h3 style={{fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)'}}>Performance Metrics</h3>
                                    <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Key performance indicators</p>
                                </div>
                                <div style={{padding: '0.5rem', background: 'var(--bg-light)', borderRadius: 'var(--radius-md)'}}>
                                    <TrendingUp size={18} color="var(--text-muted)" />
                                </div>
                            </div>
                            
                            <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem'}}>
                                <div style={{flex: 1, background: 'var(--bg-light)', padding: '1.5rem', borderRadius: 'var(--radius-md)'}}>
                                    <div style={{fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem'}}>CONVERSION RATE</div>
                                    <div style={{fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)'}}>{convRate}%</div>
                                </div>
                                <div style={{flex: 1, background: 'var(--bg-light)', padding: '1.5rem', borderRadius: 'var(--radius-md)'}}>
                                    <div style={{fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem'}}>ACTIVE RATE</div>
                                    <div style={{fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)'}}>{activeRate}%</div>
                                </div>
                            </div>
                            
                            <div style={{marginTop: 'auto', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '1rem', alignItems: 'center'}}>
                                <div style={{background: '#3b82f6', color: 'white', padding: '0.5rem', borderRadius: 'var(--radius-md)'}}>
                                    <CheckCircle size={18} />
                                </div>
                                <div>
                                    <div style={{fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)'}}>Success Focus</div>
                                    <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Focus on converting high-intent leads to maximize sales velocity.</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <footer className="dashboard-footer">
                <p>POWERED BY RIGTEQ</p>
            </footer>
        </div>
    );
};

export default Insights;
