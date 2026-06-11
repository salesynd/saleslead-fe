import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import Navbar from '../components/Navbar';
import { useToast } from '../context/ToastContext';
import { Edit2, Save, X, Eye, EyeOff } from 'lucide-react';
import '../pages/Dashboard.css';

const ProfilePage = () => {
    const { user } = useAuth();
    const { showToast, hideToast } = useToast();
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        password: ''
    });
    const [originalData, setOriginalData] = useState({...formData});
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user) {
            const initialData = {
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                password: ''
            };
            setFormData(initialData);
            setOriginalData(initialData);
        }
    }, [user]);

    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

    const handleCancel = () => {
        setFormData(originalData);
        setIsEditing(false);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!hasChanges) return;

        const loadingId = showToast('Updating profile...', 'loading', 0);
        try {
            const userId = user?.id || user?.userId;
            if (!userId) throw new Error("User ID not found in session");

            const updatePayload = { ...user, ...formData };
            if (!formData.password) {
                delete updatePayload.password;
            }

            await api.updateUser(userId, updatePayload);
            hideToast(loadingId);
            showToast('Profile updated successfully! Please re-login to see changes.', 'success');
            setOriginalData({...formData, password: ''});
            setFormData(prev => ({...prev, password: ''}));
            setIsEditing(false);
        } catch (error) {
            hideToast(loadingId);
            showToast(error.message || 'Failed to update profile', 'error');
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className="dashboard-layout">
            <Navbar />
            <main className="dashboard-main">
                <div className="dashboard-content" style={{maxWidth: '800px', margin: '0 auto'}}>
                    <div className="dashboard-section" style={{padding: '3rem 2rem', position: 'relative'}}>
                        
                        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '-2rem'}}>
                            {!isEditing ? (
                                <button className="btn-secondary" onClick={() => setIsEditing(true)} style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                    <Edit2 size={16} /> Edit Profile
                                </button>
                            ) : (
                                <div style={{display: 'flex', gap: '1rem'}}>
                                    <button className="btn-secondary" onClick={handleCancel} style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                        <X size={16} /> Cancel
                                    </button>
                                    <button className="btn-primary" onClick={handleUpdate} disabled={!hasChanges} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: hasChanges ? 1 : 0.5}}>
                                        <Save size={16} /> Save Changes
                                    </button>
                                </div>
                            )}
                        </div>

                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem'}}>
                            <div style={{
                                width: '100px', height: '100px', borderRadius: '50%', 
                                background: 'var(--primary-gradient)', color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem',
                                boxShadow: 'var(--shadow-md)'
                            }}>
                                {getInitials(formData.name || user?.email)}
                            </div>
                            <h2 style={{fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.25rem'}}>{formData.name || 'User Profile'}</h2>
                            <p style={{color: 'var(--text-muted)'}}>{user?.role || 'User'} • {user?.email}</p>
                        </div>

                        <form className="custom-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label className="label">Full Name</label>
                                    <input 
                                        className="input-field" 
                                        value={formData.name} 
                                        onChange={e => setFormData({...formData, name: e.target.value})} 
                                        readOnly={!isEditing}
                                        style={{ backgroundColor: !isEditing ? 'var(--bg-light)' : 'var(--bg-white)' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="label">Email Address</label>
                                    <input 
                                        type="email" 
                                        className="input-field" 
                                        value={formData.email} 
                                        onChange={e => setFormData({...formData, email: e.target.value})} 
                                        readOnly={!isEditing}
                                        style={{ backgroundColor: !isEditing ? 'var(--bg-light)' : 'var(--bg-white)' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="label">Phone Number</label>
                                    <input 
                                        className="input-field" 
                                        value={formData.phone} 
                                        onChange={e => setFormData({...formData, phone: e.target.value})} 
                                        readOnly={!isEditing}
                                        style={{ backgroundColor: !isEditing ? 'var(--bg-light)' : 'var(--bg-white)' }}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label className="label">Address</label>
                                    <input 
                                        className="input-field" 
                                        value={formData.address} 
                                        onChange={e => setFormData({...formData, address: e.target.value})} 
                                        readOnly={!isEditing}
                                        style={{ backgroundColor: !isEditing ? 'var(--bg-light)' : 'var(--bg-white)' }}
                                    />
                                </div>
                                {isEditing && (
                                    <div className="form-group full-width" style={{ position: 'relative' }}>
                                        <label className="label">New Password (leave blank to keep current)</label>
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            className="input-field" 
                                            value={formData.password} 
                                            onChange={e => setFormData({...formData, password: e.target.value})}
                                            placeholder="Enter new password to change..."
                                            style={{ paddingRight: '2.5rem' }}
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setShowPassword(!showPassword)} 
                                            style={{ position: 'absolute', right: '0.75rem', top: '2.1rem', color: 'var(--text-muted)' }}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
