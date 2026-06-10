import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import Navbar from '../components/Navbar';
import { AddLeadForm, AddUserForm, AddCompanyForm } from '../components/Forms';
import InsightCards from '../components/InsightCards';
import { useToast } from '../context/ToastContext';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [roles, setRoles] = useState([]);
    const [metrics, setMetrics] = useState({});
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            let fetchedUsers = [];
            try {
                const usersData = await api.getUsers();
                if (user?.role === 'SuperAdmin') {
                    fetchedUsers = usersData;
                } else {
                    fetchedUsers = usersData.filter(u => u.companyId === user?.companyId);
                }
                setUsers(fetchedUsers);
            } catch (err) {
                console.error("Failed to fetch users", err);
            }
            
            let comps = [];
            if (user?.role === 'SuperAdmin') {
                try {
                    const compsData = await api.getCompanies();
                    comps = compsData;
                    setCompanies(comps);
                } catch (err) {}
            }

            try {
                const rolesData = await api.getRoles();
                setRoles(rolesData);
            } catch (err) {}

            // Fetch leads for metrics
            let allLeads = [];
            try {
                const leadsRes = await api.getLeads();
                allLeads = leadsRes;
            } catch(err) {}

            let allComments = [];
            if (user?.role === 'SuperAdmin') {
                try {
                    const commentsRes = await api.getComments();
                    allComments = commentsRes;
                } catch(err) {}
            }

            if (user?.role === 'SuperAdmin') {
                setMetrics({
                    totalCompanies: comps.length,
                    totalUsers: fetchedUsers.length,
                    totalLeads: allLeads.length,
                    totalComments: allComments.length
                });
            } else if (user?.role === 'Admin' || user?.role === 'User') {
                const myLeads = user?.role === 'User' ? allLeads.filter(l => l.assignedToEmailId === user?.email) : allLeads;
                setMetrics({
                    totalLeads: myLeads.length,
                    newLeads: myLeads.filter(l => l.status === 'New').length,
                    inConversation: myLeads.filter(l => l.status === 'In Conversation').length,
                    pos: myLeads.filter(l => l.status === 'PO').length
                });
            }

        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = (type) => {
        showToast(`${type} added successfully!`, 'success');
        fetchData();
    };

    return (
        <div className="dashboard-layout">
            <Navbar />
            <main className="dashboard-main">
                <div className="dashboard-content">
                    <div className="dashboard-header">
                        <div>
                            <h1 className="dashboard-title">Dashboard</h1>
                            <p className="dashboard-subtitle">Manage your data entry forms here.</p>
                        </div>
                    </div>
                    
                    <div style={{ marginBottom: '2rem' }}>
                        <InsightCards 
                            type={user?.role === 'SuperAdmin' ? 'dashboard-superadmin' : 'dashboard-admin'} 
                            metrics={metrics} 
                        />
                    </div>
                    
                    <div className="forms-container">
                        <div className="dashboard-section form-section">
                            <AddLeadForm onSuccess={() => handleSuccess('Lead')} onCancel={() => {}} users={users} currentUserEmail={user?.email} />
                        </div>
                        
                        {(user?.role === 'SuperAdmin' || user?.role === 'Admin') && (
                            <div className="dashboard-section form-section">
                                <AddUserForm onSuccess={() => handleSuccess('User')} onCancel={() => {}} companies={companies} roles={roles} currentUserRole={user?.role} currentUserCompanyId={user?.companyId} />
                            </div>
                        )}
                        
                        {user?.role === 'SuperAdmin' && (
                            <div className="dashboard-section form-section">
                                <AddCompanyForm onSuccess={() => handleSuccess('Company')} onCancel={() => {}} />
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

export default Dashboard;
