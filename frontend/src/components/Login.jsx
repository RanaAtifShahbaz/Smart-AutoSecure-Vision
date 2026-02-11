import React, { useState } from 'react';
import { apiLogin, apiRegister } from '../api';

const Login = ({ onLoginSuccess }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [msg, setMsg] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg({ type: '', text: '' });

        try {
            if (isRegister) {
                const res = await apiRegister(formData.name, formData.email, formData.password);
                if (res.success) {
                    setMsg({ type: 'success', text: res.message });
                    setTimeout(() => setIsRegister(false), 2000); // Switch to login
                } else {
                    setMsg({ type: 'danger', text: res.message });
                }
            } else {
                const res = await apiLogin(formData.email, formData.password);
                if (res.success) {
                    setMsg({ type: 'success', text: 'Login Successful!' });
                    if (onLoginSuccess) onLoginSuccess(res.user);
                } else {
                    setMsg({ type: 'danger', text: res.message });
                }
            }
        } catch (e) {
            setMsg({ type: 'danger', text: "Connection Error" });
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <div className="card bg-dark text-white border-secondary p-4" style={{ width: '400px' }}>
                <div className="card-body">
                    <h3 className="card-title text-center mb-4 text-primary">
                        <i className="fas fa-user-shield me-2"></i>
                        {isRegister ? 'Register' : 'Login'}
                    </h3>

                    {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

                    <form onSubmit={handleSubmit}>
                        {isRegister && (
                            <div className="mb-3">
                                <label>Name</label>
                                <input
                                    type="text"
                                    className="form-control bg-dark border-secondary text-white"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        )}
                        <div className="mb-3">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control bg-dark border-secondary text-white"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control bg-dark border-secondary text-white"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                            {isRegister ? 'Create Account' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-3 text-center">
                        <button
                            className="btn btn-link text-decoration-none text-secondary"
                            onClick={() => setIsRegister(!isRegister)}
                        >
                            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
