import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import Navbar from '../components/Navbar';
import { AddLeadForm, AddUserForm, AddCompanyForm } from '../components/Forms';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            if (user?.role === 'SuperAdmin' || user?.role === 'Admin') {
                const usersData = await api.getUsers();
                setUsers(usersData.data || []);
            }
            if (user?.role === 'SuperAdmin') {
                const compsData = await api.getCompanies();
                setCompanies(compsData.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = (type) => {
        alert(`${type} added successfully!`);
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
                    
                    <div className="forms-container">
                        <div className="dashboard-section form-section">
                            <AddLeadForm onSuccess={() => handleSuccess('Lead')} onCancel={() => {}} users={users} />
                        </div>
                        
                        {(user?.role === 'SuperAdmin' || user?.role === 'Admin') && (
                            <div className="dashboard-section form-section">
                                <AddUserForm onSuccess={() => handleSuccess('User')} onCancel={() => {}} companies={companies} />
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
