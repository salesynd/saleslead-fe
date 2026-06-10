import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [showPlans, setShowPlans] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="login-container">
            {/* Left 60% Branding */}
            <div className="login-branding">
                <div className="branding-content">
                    <div className="logo">
                        <div className="logo-icon">S</div>
                        <span className="logo-text">SalesLead</span>
                    </div>
                    
                    <h1 className="hero-title">
                        Empowering Your<br/>
                        <span>Sales Velocity.</span>
                    </h1>
                    <p className="hero-subtitle">
                        The intelligent ecosystem for high-volume lead<br/>
                        management and real-time conversion.
                    </p>

                    <button className="explore-plans-btn" onClick={() => setShowPlans(true)}>
                        Explore Plans
                    </button>
                </div>
            </div>

            {/* Right 40% Form */}
            <div className="login-form-section">
                <div className="login-form-wrapper">
                    <h2 className="login-title">Log In</h2>
                    <p className="login-subtitle">Access your performance dashboard and active leads.</p>

                    <div className="card login-card">
                        {error && <div className="error-message">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="label">Email</label>
                                <input 
                                    type="email" 
                                    className="input-field" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    required 
                                />
                            </div>
                            
                            <div className="form-group password-group">
                                <label className="label">Password</label>
                                <div className="password-input-wrapper">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        className="input-field" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required 
                                    />
                                    <button 
                                        type="button" 
                                        className="eye-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary w-full">
                                Log in
                            </button>
                        </form>
                    </div>
                    
                    <div className="login-footer-text">
                        POWERED BY RIGTEQ TECHNOLOGIES
                    </div>
                </div>
            </div>

            {/* Plans Modal */}
            {showPlans && (
                <div className="modal-overlay" onClick={() => setShowPlans(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2 className="modal-title">Choose Your Plan</h2>
                        <div className="plans-grid">
                            <div className="plan-card">
                                <h3>Monthly Pro</h3>
                                <div className="plan-price">$24.99<span>/mo</span></div>
                                <ul className="plan-features">
                                    <li>Unlimited Leads</li>
                                    <li>Advanced Insights</li>
                                    <li>Priority Support</li>
                                </ul>
                                <button className="btn-primary w-full">Select Plan</button>
                            </div>
                            <div className="plan-card premium">
                                <h3>Lifetime Elite</h3>
                                <div className="plan-price">$99.99<span>/once</span></div>
                                <ul className="plan-features">
                                    <li>Everything in Pro</li>
                                    <li>Custom Branding</li>
                                    <li>Dedicated Manager</li>
                                </ul>
                                <button className="btn-primary w-full">Select Plan</button>
                            </div>
                        </div>
                        <button className="modal-close" onClick={() => setShowPlans(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
