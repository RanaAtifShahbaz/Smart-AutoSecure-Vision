import React, { useState, useEffect, useRef } from 'react';
import { addPerson, registerSample, fetchPersons } from '../api';

const Admin = () => {
    const [persons, setPersons] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showLiveModal, setShowLiveModal] = useState(false);

    // Live Register State
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [samples, setSamples] = useState([]);
    const [regForm, setRegForm] = useState({ name: '', relation: 'Visitor', phone: '', address: '' });

    useEffect(() => {
        loadPersons();
    }, []);

    const loadPersons = async () => {
        try {
            const data = await fetchPersons();
            setPersons(data);
        } catch (e) { console.error("Error loading persons", e); }
    };

    const startCamera = async () => {
        try {
            const s = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(s);
            if (videoRef.current) videoRef.current.srcObject = s;
        } catch (e) {
            alert("Camera access denied!");
        }
    };

    const stopCamera = () => {
        if (stream) stream.getTracks().forEach(t => t.stop());
        setStream(null);
    };

    const captureSample = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
        const data = canvas.toDataURL('image/jpeg', 0.8);
        setSamples([...samples, data]);
    };

    const submitLive = async () => {
        if (samples.length < 1) return alert("Capture at least 1 sample");
        if (!regForm.name) return alert("Name required");

        try {
            const res = await registerSample({ ...regForm, images: samples });
            if (res.success) {
                alert("Registered Successfully!");
                window.location.reload();
            } else {
                alert("Error: " + res.message);
            }
        } catch (e) {
            alert("Error communicating with server");
        }
    };

    const submitManual = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const res = await addPerson(formData);
            if (res.success) {
                window.location.reload();
            } else {
                alert("Error: " + res.message);
            }
        } catch (e) {
            alert("Error submitting form");
        }
    };

    const simulateThreat = async () => {
        const type = prompt("Enter threat type (e.g. Knife, Handgun):", "Knife");
        if (type) {
            await fetch('/api/simulate_threat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type })
            });
            alert(`Simulated ${type} alert triggered!`);
        }
    };

    return (
        <div className="container-fluid p-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold text-primary">Database Management</h2>
                    <p className="text-secondary">Manage known faces and system configuration.</p>
                </div>
                <div>
                    <button className="btn btn-warning me-2" onClick={simulateThreat}>
                        <i className="fas fa-exclamation-triangle me-2"></i> Test Alert
                    </button>
                    <button className="btn btn-outline-success me-2" onClick={() => { setShowLiveModal(true); }}>
                        <i className="fas fa-camera me-2"></i> Live Register
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                        <i className="fas fa-upload me-2"></i> Upload Photo
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="row mb-5 g-4">
                <div className="col-md-3">
                    <div className="stat-card d-flex justify-content-between align-items-center p-4 rounded-3 border border-secondary bg-dark shadow-sm">
                        <div>
                            <h3 className="fw-bold mb-0 display-6">{persons.length}</h3>
                            <p className="text-secondary mb-0 small text-uppercase">Total Persons</p>
                        </div>
                        <div className="icon-box bg-primary bg-opacity-10 text-primary rounded p-3">
                            <i className="fas fa-users fa-2x"></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card d-flex justify-content-between align-items-center p-4 rounded-3 border border-secondary bg-dark shadow-sm">
                        <div>
                            <h3 className="fw-bold mb-0 display-6">{persons.filter(p => p.relation === 'Employee').length}</h3>
                            <p className="text-secondary mb-0 small text-uppercase">Employees</p>
                        </div>
                        <div className="icon-box bg-success bg-opacity-10 text-success rounded p-3">
                            <i className="fas fa-id-card-alt fa-2x"></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card d-flex justify-content-between align-items-center p-4 rounded-3 border border-secondary bg-dark shadow-sm">
                        <div>
                            <h3 className="fw-bold mb-0 display-6">{persons.filter(p => p.relation === 'Family').length}</h3>
                            <p className="text-secondary mb-0 small text-uppercase">Family Members</p>
                        </div>
                        <div className="icon-box bg-info bg-opacity-10 text-info rounded p-3">
                            <i className="fas fa-home fa-2x"></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card d-flex justify-content-between align-items-center p-4 rounded-3 border border-secondary bg-dark shadow-sm">
                        <div>
                            <h3 className="fw-bold mb-0 display-6">{persons.filter(p => p.relation === 'Visitor').length}</h3>
                            <p className="text-secondary mb-0 small text-uppercase">Visitors / Others</p>
                        </div>
                        <div className="icon-box bg-warning bg-opacity-10 text-warning rounded p-3">
                            <i className="fas fa-walking fa-2x"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Persons Grid */}
            <div className="row g-4">
                {persons.map(p => (
                    <div className="col-md-6 col-lg-4 col-xl-3" key={p.serial_no}>
                        <div className="card h-100" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', overflow: 'hidden' }}>
                            <div className="card-body text-center">
                                <div className="position-relative d-inline-block mb-3" style={{ height: '180px', width: '100%', overflow: 'hidden' }}>
                                    <img src={`/static/uploads/${p.photo}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = 'https://via.placeholder.com/300?text=No+Image'} />
                                    <span className="badge bg-primary position-absolute bottom-0 end-0 rounded-circle p-2 border border-dark">
                                        <i className="fas fa-check"></i>
                                    </span>
                                </div>
                                <h5 className="card-title fw-bold mb-1">{p.name}</h5>
                                <p className="text-secondary small mb-3">{p.relation}</p>

                                <div className="text-start bg-dark bg-opacity-50 p-2 rounded mb-3">
                                    <div className="d-flex align-items-center mb-1 text-secondary small">
                                        <i className="fas fa-phone me-2"></i> {p.phone}
                                    </div>
                                    <div className="d-flex align-items-center text-secondary small">
                                        <i className="fas fa-map-marker-alt me-2"></i> {p.address}
                                    </div>
                                    <div className="d-flex align-items-center text-secondary small mt-1">
                                        <i className="fas fa-clock me-2"></i> {new Date(p.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <div className="card-actions" style={{ display: 'flex', gap: '0.5rem', padding: '1rem', borderTop: '1px solid #334155' }}>
                                <button className="btn btn-sm btn-outline-light flex-grow-1">
                                    <i className="fas fa-edit"></i> Edit
                                </button>
                                <a href={`/admin/delete/${p.serial_no}/`} className="btn btn-sm btn-outline-danger" onClick={e => { if (!confirm('Delete?')) e.preventDefault() }}>
                                    <i className="fas fa-trash"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Live Modal */}
            {showLiveModal && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.8)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content bg-dark text-light border-secondary">
                            {/* ... same modal content as before ... */}
                            <div className="modal-header border-bottom border-secondary">
                                <h5 className="modal-title">Live Registration</h5>
                                <button className="btn-close btn-close-white" onClick={() => { setShowLiveModal(false); stopCamera(); }}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-7">
                                        <div className="ratio ratio-4x3 bg-black rounded mb-2 overflow-hidden border border-secondary">
                                            <video ref={videoRef} autoPlay playsInline muted></video>
                                            <img src="" style={{ display: 'none' }} onLoad={startCamera} onError={startCamera} />
                                        </div>
                                        <button className="btn btn-primary w-100" onClick={captureSample}>
                                            <i className="fas fa-camera"></i> Capture Sample
                                        </button>
                                    </div>
                                    <div className="col-md-5">
                                        <div className="mb-2"><label>Full Name</label><input className="form-control" value={regForm.name} onChange={e => setRegForm({ ...regForm, name: e.target.value })} /></div>
                                        <div className="mb-2"><label>Role</label><select className="form-select" value={regForm.relation} onChange={e => setRegForm({ ...regForm, relation: e.target.value })}><option>Family</option><option>Employee</option><option>Visitor</option><option>Suspect</option></select></div>
                                        <h6 className="mt-3">Samples ({samples.length})</h6>
                                        <div className="d-flex flex-wrap gap-2" style={{ maxHeight: '100px', overflowY: 'auto' }}>{samples.map((s, i) => <img key={i} src={s} style={{ width: '40px', height: '40px', objectFit: 'cover' }} />)}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-top border-secondary"><button className="btn btn-success w-100" onClick={submitLive}>Register</button></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.8)' }}>
                    <div className="modal-dialog">
                        <form onSubmit={submitManual} className="modal-content bg-dark text-light border-secondary">
                            <div className="modal-header border-bottom border-secondary"><h5 className="modal-title">Register New Person</h5><button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button></div>
                            <div className="modal-body">
                                <div className="mb-3"><label>Name</label><input name="name" className="form-control" required /></div>
                                <div className="mb-3"><label>Role</label><select name="relation" className="form-select"><option>Family</option><option>Employee</option><option>Visitor</option><option>Suspect</option></select></div>
                                <div className="mb-3"><label>Phone</label><input name="phone" className="form-control" required /></div>
                                <div className="mb-3"><label>Address</label><textarea name="address" className="form-control" required></textarea></div>
                                <div className="mb-3"><label>Photo</label><input type="file" name="photo" className="form-control" accept="image/*" required /></div>
                            </div>
                            <div className="modal-footer border-top border-secondary"><button type="submit" className="btn btn-primary w-100">Save Person</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
