import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import Navbar from '../components/Navbar';
import { useToast } from '../context/ToastContext';
import '../pages/Dashboard.css';

const ProfilePage = () => {
    const { user, login } = useAuth(); // Need login to refresh context maybe, but we can just show toast
    const { showToast, hideToast } = useToast();
    
    const [email, setEmail] = useState(user?.email || '');
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');

    const handleUpdate = async (e) => {
        e.preventDefault();
        const loadingId = showToast('Updating profile...', 'loading', 0);
        try {
            // we assume the user object in context has an id.
            const userId = user?.id || user?.userId; // Adjust based on token structure
            if (!userId) throw new Error("User ID not found in session");

            await api.updateUser(userId, { ...user, email, name, phone });
            hideToast(loadingId);
            showToast('Profile updated successfully! Please re-login to see changes.', 'success');
        } catch (error) {
            hideToast(loadingId);
            showToast(error.message || 'Failed to update profile', 'error');
        }
    };

    return (
        <div className="dashboard-layout">
            <Navbar />
            <main className="dashboard-main">
                <div className="dashboard-content">
                    <div className="dashboard-header">
                        <div>
                            <h1 className="dashboard-title">Edit Profile</h1>
                            <p className="dashboard-subtitle">Update your personal information.</p>
                        </div>
                    </div>

                    <div className="dashboard-section form-section" style={{maxWidth: '600px'}}>
                        <form onSubmit={handleUpdate} className="custom-form">
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label className="label">Full Name</label>
                                    <input className="input-field" value={name} onChange={e => setName(e.target.value)} required />
                                </div>
                                <div className="form-group full-width">
                                    <label className="label">Email Address</label>
                                    <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                                <div className="form-group full-width">
                                    <label className="label">Phone</label>
                                    <input className="input-field" value={phone} onChange={e => setPhone(e.target.value)} />
                                </div>
                                <div className="form-group full-width">
                                    <label className="label">Role</label>
                                    <input className="input-field" value={user?.role || ''} disabled />
                                </div>
                                <div className="form-group full-width">
                                    <label className="label">Company ID</label>
                                    <input className="input-field" value={user?.companyId || ''} disabled />
                                </div>
                            </div>
                            <div className="form-actions" style={{marginTop: '2rem'}}>
                                <button type="submit" className="btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
