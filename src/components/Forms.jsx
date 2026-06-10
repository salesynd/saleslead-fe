import React, { useState } from 'react';
import { api } from '../api';
import { useToast } from '../context/ToastContext';
import './Forms.css';

export const AddLeadForm = ({ onSuccess, onCancel, users, currentUserEmail }) => {
    const [formData, setFormData] = useState({
        leadName: '', phone: '', email: '', secondaryPhone: '', 
        location: '', status: 'New', assignedToEmailId: '', note: ''
    });

    const { showToast, hideToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingId = showToast('Creating lead...', 'loading', 0);
        try {
            await api.createLead({ ...formData, createdByEmailId: currentUserEmail });
            hideToast(loadingId);
            onSuccess();
        } catch (error) {
            hideToast(loadingId);
            console.error("Failed to create lead", error);
            showToast("Failed to create lead", 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="custom-form">
            <h2 className="form-title">Add New Lead</h2>
            <div className="form-grid">
                <div className="form-group">
                    <label className="label">Full Name *</label>
                    <input className="input-field" required value={formData.leadName} onChange={e => setFormData({...formData, leadName: e.target.value})} />
                </div>
                <div className="form-group">
                    <label className="label">Email</label>
                    <input type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-group">
                    <label className="label">Phone *</label>
                    <input className="input-field" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="form-group">
                    <label className="label">Secondary Phone</label>
                    <input className="input-field" value={formData.secondaryPhone} onChange={e => setFormData({...formData, secondaryPhone: e.target.value})} />
                </div>
                <div className="form-group full-width">
                    <label className="label">Location</label>
                    <input className="input-field" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
                <div className="form-group">
                    <label className="label">Status</label>
                    <select className="input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option>New</option>
                        <option>Not Interested</option>
                        <option>In Conversation</option>
                        <option>Scheduled</option>
                        <option>DNP</option>
                        <option>Out of Reach</option>
                        <option>Wrong Details</option>
                        <option>PO</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="label">Assigned To</label>
                    <select className="input-field" value={formData.assignedToEmailId} onChange={e => setFormData({...formData, assignedToEmailId: e.target.value})}>
                        <option value="">Select User...</option>
                        {users?.map(u => <option key={u.email} value={u.email}>{u.email}</option>)}
                    </select>
                </div>
                <div className="form-group full-width">
                    <label className="label">Note</label>
                    <textarea className="input-field" rows="3" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})}></textarea>
                </div>
            </div>
            <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn-primary">Create Lead</button>
            </div>
        </form>
    );
};

export const AddUserForm = ({ onSuccess, onCancel, companies, roles, currentUserRole, currentUserCompanyId }) => {
    const [formData, setFormData] = useState({
        name: '', phone: '', email: '', password: '', 
        address: '', gender: 'Male', roleId: '', companyId: currentUserRole === 'Admin' ? currentUserCompanyId : ''
    });

    React.useEffect(() => {
        if (roles && roles.length > 0 && !formData.roleId) {
            const userRole = roles.find(r => r.roleName === 'User');
            if (userRole) {
                setFormData(prev => ({ ...prev, roleId: userRole.roleId }));
            }
        }
    }, [roles]);

    const { showToast, hideToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingId = showToast('Creating user...', 'loading', 0);
        try {
            await api.createUser(formData);
            hideToast(loadingId);
            onSuccess();
        } catch (error) {
            hideToast(loadingId);
            console.error("Failed to create user", error);
            showToast("Failed to create user", 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="custom-form">
            <h2 className="form-title">Add New User</h2>
            <div className="form-grid">
                <div className="form-group">
                    <label className="label">Full Name *</label>
                    <input className="input-field" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                    <label className="label">Email *</label>
                    <input type="email" className="input-field" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-group">
                    <label className="label">Phone *</label>
                    <input className="input-field" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="form-group">
                    <label className="label">Password *</label>
                    <input type="password" className="input-field" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <div className="form-group full-width">
                    <label className="label">Address</label>
                    <input className="input-field" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
                <div className="form-group">
                    <label className="label">Gender</label>
                    <select className="input-field" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>
                {currentUserRole !== 'Admin' && roles && roles.length > 0 && (
                    <div className="form-group">
                        <label className="label">Role</label>
                        <select className="input-field" value={formData.roleId} onChange={e => setFormData({...formData, roleId: e.target.value})}>
                            {roles.filter(r => r.roleName !== 'SuperAdmin').map(r => (
                                <option key={r.roleId} value={r.roleId}>{r.roleName}</option>
                            ))}
                        </select>
                    </div>
                )}
                {companies && currentUserRole !== 'Admin' && (
                    <div className="form-group full-width">
                        <label className="label">Company</label>
                        <select className="input-field" value={formData.companyId} onChange={e => setFormData({...formData, companyId: e.target.value})}>
                            <option value="">Select Company...</option>
                            {companies.map(c => <option key={c.id} value={c.id}>{c.companyname}</option>)}
                        </select>
                    </div>
                )}
            </div>
            <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn-primary">Create User</button>
            </div>
        </form>
    );
};

export const AddCompanyForm = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        companyname: '', companyemail: '', companyphone: '', companydetails: ''
    });

    const { showToast, hideToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingId = showToast('Creating company...', 'loading', 0);
        try {
            await api.createCompany(formData);
            hideToast(loadingId);
            onSuccess();
        } catch (error) {
            hideToast(loadingId);
            console.error("Failed to create company", error);
            showToast("Failed to create company", 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="custom-form">
            <h2 className="form-title">Add New Company</h2>
            <div className="form-grid">
                <div className="form-group">
                    <label className="label">Company Name *</label>
                    <input className="input-field" required value={formData.companyname} onChange={e => setFormData({...formData, companyname: e.target.value})} />
                </div>
                <div className="form-group">
                    <label className="label">Company Email</label>
                    <input type="email" className="input-field" value={formData.companyemail} onChange={e => setFormData({...formData, companyemail: e.target.value})} />
                </div>
                <div className="form-group full-width">
                    <label className="label">Company Phone</label>
                    <input className="input-field" value={formData.companyphone} onChange={e => setFormData({...formData, companyphone: e.target.value})} />
                </div>
                <div className="form-group full-width">
                    <label className="label">Details</label>
                    <textarea className="input-field" rows="3" value={formData.companydetails} onChange={e => setFormData({...formData, companydetails: e.target.value})}></textarea>
                </div>
            </div>
            <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn-primary">Create Company</button>
            </div>
        </form>
    );
};
