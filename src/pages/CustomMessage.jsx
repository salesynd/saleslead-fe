import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../pages/Dashboard.css';

const CustomMessage = () => {
    const [message, setMessage] = useState("Hello Sir/Ma'am, thank you for your interest in Rigteq Software Solutions. We help businesses with professional Websites, Custom Software, ERP & Growth Solutions. Please share your requirement once, and I'll suggest the best option with pricing.");

    const handleSave = () => {
        // Save logic to backend or local storage
        alert("Custom message saved successfully!");
    };

    return (
        <div className="dashboard-layout">
            <Navbar />
            <main className="dashboard-main">
                <div className="dashboard-content" style={{maxWidth: '800px', margin: '0 auto'}}>
                    <div className="dashboard-header" style={{flexDirection: 'column', alignItems: 'flex-start', marginBottom: '2rem'}}>
                        <h1 className="dashboard-title">Custom Message</h1>
                        <p className="dashboard-subtitle">Manage your custom WhatsApp message.</p>
                    </div>
                    
                    <div className="dashboard-section">
                        <div style={{marginBottom: '1rem'}}>
                            <h3 style={{fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.25rem'}}>Custom WhatsApp Message</h3>
                            <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>
                                This message will be sent when you click the WhatsApp button on a lead. If left empty, the default message will be used: "Hello [Lead Name], [User Name] here from [Company Name]."
                            </p>
                        </div>
                        
                        <textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{
                                width: '100%',
                                minHeight: '120px',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-light)',
                                fontSize: '0.875rem',
                                color: 'var(--text-main)',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                marginBottom: '1.5rem'
                            }}
                        />
                        
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Click save to update your changes.</span>
                            <button className="btn-primary" onClick={handleSave}>
                                <i className="lucide-save" style={{marginRight: '0.5rem'}}></i> Save Changes
                            </button>
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

export default CustomMessage;
