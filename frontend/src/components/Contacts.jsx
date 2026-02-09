import React, { useState, useEffect } from 'react';
import { addContact, fetchContacts } from '../api';

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            const data = await fetchContacts();
            setContacts(data || []);
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        await addContact(formData);
        window.location.reload();
    };

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold text-danger">Emergency Response Team</h2>
                    <p className="text-secondary">Manage contacts who will be auto-dialed during security alerts.</p>
                </div>
                <button className="btn btn-danger" onClick={() => setShowAddModal(true)}>
                    <i className="fas fa-plus me-2"></i> Add Responder
                </button>
            </div>

            <div className="row g-4">
                {contacts.length > 0 ? contacts.map((c, idx) => (
                    <div className="col-md-6 col-lg-4" key={c._id || idx}>
                        <div className="contact-card h-100 position-relative group" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div className="d-flex align-items-center gap-4">
                                <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                    <i className="fas fa-user-shield fa-lg"></i>
                                </div>
                                <div className="contact-info flex-grow-1">
                                    <h5 className="mb-1 text-white fw-bold" style={{ margin: 0, fontWeight: 600 }}>{c.name}</h5>
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        <span className="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-25">{c.relation}</span>
                                    </div>
                                    <p className="text-secondary small font-monospace" style={{ margin: 0, color: '#94a3b8' }}><i className="fas fa-phone me-1"></i> {c.phone}</p>
                                </div>
                            </div>
                            <a href={`/admin/delete_contact/${c._id}/`} className="btn btn-outline-danger btn-sm" onClick={e => { if (!confirm('Delete?')) e.preventDefault() }}>
                                <i className="fas fa-trash"></i>
                            </a>
                        </div>
                    </div>
                )) : (
                    <div className="col-12 py-5 text-center">
                        <div className="mb-3 text-secondary opacity-50">
                            <i className="fas fa-users-slash fa-4x"></i>
                        </div>
                        <h5 className="text-secondary">No responders configured</h5>
                        <p class="small text-muted">Add security personnel or local authorities to auto-dial during alerts.</p>
                    </div>
                )}
            </div>

            {showAddModal && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.8)' }}>
                    <div className="modal-dialog">
                        <form onSubmit={handleSubmit} className="modal-content" style={{ background: '#1e293b', color: 'white', border: '1px solid #475569' }}>
                            <div className="modal-header border-bottom border-secondary">
                                <h5 className="modal-title">New Contact</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3"><label>Name</label><input name="name" className="form-control bg-dark text-light border-secondary" required /></div>
                                <div className="mb-3"><label>Phone</label><input name="phone" className="form-control bg-dark text-light border-secondary" required /></div>
                                <div className="mb-3"><label>Role</label><select name="relation" className="form-select bg-dark text-light border-secondary"><option>Security</option><option>Police</option><option>Owner</option></select></div>
                            </div>
                            <div className="modal-footer border-top border-secondary"><button type="submit" className="btn btn-danger w-100">Save Responder</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contacts;
