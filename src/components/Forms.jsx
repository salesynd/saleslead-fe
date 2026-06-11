import React, { useState, useRef } from 'react';
import { api } from '../api';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, Upload, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import './Forms.css';

export const AddLeadForm = ({ onSuccess, onCancel, users, currentUserEmail }) => {
    const [formData, setFormData] = useState({
        leadName: '', phone: '', email: '', secondaryPhone: '', 
        location: '', status: 'New', assignedToEmailId: '', note: ''
    });

    const { showToast, hideToast } = useToast();
    const fileInputRef = useRef(null);

    React.useEffect(() => {
        // Auto-assign to logged-in user if they are a regular user
        const user = users?.find(u => u.email === currentUserEmail);
        if (user && user.roleId !== 1 && user.roleId !== 2) { // assuming 1=SuperAdmin, 2=Admin, others=User
            // Wait, we don't have roleId info directly here easily without role map. 
            // Better to just set it to currentUserEmail if not admin.
            // Let's just set default to currentUserEmail and they can change if they want, or force it.
            setFormData(prev => ({...prev, assignedToEmailId: currentUserEmail}));
        }
    }, [users, currentUserEmail]);

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

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                if (data.length === 0) {
                    showToast("Uploaded file is empty", 'error');
                    return;
                }

                const loadingId = showToast(`Uploading ${data.length} leads...`, 'loading', 0);
                
                let successCount = 0;
                for (let row of data) {
                    try {
                        const newLead = {
                            leadName: row['Full Name'] || '',
                            email: row['Email'] || '',
                            phone: row['Phone']?.toString() || '',
                            secondaryPhone: row['Secondary Phone']?.toString() || '',
                            location: row['Location'] || '',
                            status: 'New',
                            assignedToEmailId: formData.assignedToEmailId || currentUserEmail,
                            note: row['Note'] || '',
                            createdByEmailId: currentUserEmail
                        };
                        if (newLead.leadName && newLead.phone) {
                            await api.createLead(newLead);
                            successCount++;
                        }
                    } catch (err) {
                        console.error("Failed to upload lead row", err);
                    }
                }
                
                hideToast(loadingId);
                showToast(`Successfully uploaded ${successCount} leads`, 'success');
                onSuccess();
            } catch (error) {
                console.error("Error parsing file", error);
                showToast("Failed to parse Excel file", 'error');
            }
        };
        reader.readAsBinaryString(file);
    };

    const downloadSample = () => {
        const ws = XLSX.utils.json_to_sheet([
            { "Full Name": "John Doe", "Email": "john@example.com", "Phone": "1234567890", "Secondary Phone": "0987654321", "Location": "New York", "Note": "Sample note" }
        ]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Leads");
        XLSX.writeFile(wb, "Leads_Sample.xlsx");
    };

    return (
        <form onSubmit={handleSubmit} className="custom-form">
            <div className="form-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="form-title" style={{ marginBottom: 0 }}>Add New Lead</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="button" className="btn-secondary" onClick={downloadSample} title="Download Sample">
                        <Download size={16} /> Sample
                    </button>
                    <button type="button" className="btn-primary" onClick={() => fileInputRef.current?.click()}>
                        <Upload size={16} /> Excel Upload
                    </button>
                    <input type="file" accept=".xlsx, .xls, .csv" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
                </div>
            </div>
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
    const [showPassword, setShowPassword] = useState(false);

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
                <div className="form-group" style={{ position: 'relative' }}>
                    <label className="label">Password *</label>
                    <input type={showPassword ? "text" : "password"} className="input-field" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ paddingRight: '2.5rem' }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '2.1rem', color: 'var(--text-muted)' }}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
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

export const AddPOForm = ({ onSuccess, onCancel, leads }) => {
    const [formData, setFormData] = useState({
        lead_id: '', amount_received: '', amount_remaining: '', release_date: '', note: ''
    });

    const { showToast, hideToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingId = showToast('Creating PO...', 'loading', 0);
        try {
            await api.createPO(formData); // Assuming api.createPO exists
            hideToast(loadingId);
            onSuccess();
        } catch (error) {
            hideToast(loadingId);
            console.error("Failed to create PO", error);
            showToast("Failed to create PO", 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="custom-form">
            <h2 className="form-title">Add New PO</h2>
            <div className="form-grid">
                <div className="form-group full-width">
                    <label className="label">Lead *</label>
                    <select className="input-field" required value={formData.lead_id} onChange={e => setFormData({...formData, lead_id: e.target.value})}>
                        <option value="">Select Lead...</option>
                        {leads?.map(l => <option key={l.id} value={l.id}>{l.leadName} ({l.phone})</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label className="label">Amount Received *</label>
                    <input type="number" className="input-field" required value={formData.amount_received} onChange={e => setFormData({...formData, amount_received: e.target.value})} />
                </div>
                <div className="form-group">
                    <label className="label">Amount Remaining *</label>
                    <input type="number" className="input-field" required value={formData.amount_remaining} onChange={e => setFormData({...formData, amount_remaining: e.target.value})} />
                </div>
                <div className="form-group">
                    <label className="label">Release Date *</label>
                    <input type="date" className="input-field" required value={formData.release_date} onChange={e => setFormData({...formData, release_date: e.target.value})} />
                </div>
                <div className="form-group full-width">
                    <label className="label">Note</label>
                    <textarea className="input-field" rows="3" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})}></textarea>
                </div>
            </div>
            <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn-primary">Create PO</button>
            </div>
        </form>
    );
};
