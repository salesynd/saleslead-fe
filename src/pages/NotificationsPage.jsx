import React from 'react';
import Navbar from '../components/Navbar';
import '../pages/Dashboard.css';

const NotificationsPage = () => {
    return (
        <div className="dashboard-layout">
            <Navbar />
            <main className="dashboard-main">
                <div className="dashboard-content">
                    <div className="dashboard-header">
                        <div>
                            <h1 className="dashboard-title">Notifications</h1>
                            <p className="dashboard-subtitle">Stay updated with the latest activities.</p>
                        </div>
                    </div>
                    
                    <div className="dashboard-section">
                        <div className="empty-state" style={{padding: '3rem 0'}}>
                            <p>No new notifications at this time.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NotificationsPage;
