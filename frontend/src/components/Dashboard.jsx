import React, { useState, useEffect, useRef } from 'react';
import { fetchAddedCameras, setMainCamera, fetchStats, fetchEmergencyStatus, addCamera, fetchCameras } from '../api';
import ROImodal from './ROImodal';

const Dashboard = () => {
    const [cameras, setCameras] = useState([]);
    const [mainCameraId, setMainCameraId] = useState(null);
    const [stats, setStats] = useState({ known: 0, unknown: 0, suspects: 0, history: [] });
    const [emergency, setEmergency] = useState({ active: false });
    const [showRoiModal, setShowRoiModal] = useState(false);
    const [roiCameraId, setRoiCameraId] = useState(null);

    // Add Camera State
    const [showAddCameraModal, setShowAddCameraModal] = useState(false);
    const [availableCameras, setAvailableCameras] = useState([]);
    const [newCamData, setNewCamData] = useState({ id: '', label: '' });

    const openRoi = (id) => {
        setRoiCameraId(id);
        setShowRoiModal(true);
    };

    const handleOpenAddModal = async () => {
        try {
            const avail = await fetchCameras(); // Fetch available cams from backend
            setAvailableCameras(avail);
            if (avail.length > 0) {
                setNewCamData({ id: avail[0].id, label: avail[0].label });
            }
            setShowAddCameraModal(true);
        } catch (e) {
            alert("Error fetching available cameras");
        }
    };

    const handleAddCamera = async (e) => {
        e.preventDefault();
        try {
            await addCamera(parseInt(newCamData.id), newCamData.label || `Camera ${newCamData.id}`);
            setShowAddCameraModal(false);
            setNewCamData({ id: '', label: '' });
            loadCameras();
            alert("Camera Added Successfully");
        } catch (error) {
            alert("Failed to add camera. Ensure ID is unique and valid.");
        }
    };

    // Camera Loading
    useEffect(() => {
        loadCameras();
        const interval = setInterval(loadStats, 2000);
        const emergInterval = setInterval(checkEmergency, 1000);
        return () => {
            clearInterval(interval);
            clearInterval(emergInterval);
        };
    }, []);

    const loadCameras = async () => {
        try {
            const data = await fetchAddedCameras();
            setCameras(data);
            const main = data.find(c => c.main);
            if (main) {
                setMainCameraId(main.id);
            } else if (data.length > 0) {
                // Determine implicit main if none set explicitly
                setMainCameraId(data[0].id);
            }
        } catch (e) {
            console.error("Failed to load cameras", e);
        }
    };

    const loadStats = async () => {
        try {
            const data = await fetchStats();
            setStats(data);
        } catch (e) { }
    };

    const checkEmergency = async () => {
        try {
            const data = await fetchEmergencyStatus();
            setEmergency(data);
        } catch (e) { }
    };

    const handleSetMain = async (id) => {
        await setMainCamera(id);
        setMainCameraId(id);
        loadCameras(); // Refresh list to update main status
    };

    return (
        <div className="d-flex flex-column h-100">


            <div className="container-fluid p-4 mt-3 flex-grow-1">
                {/* Header / Emergency Overlay */}
                {emergency.active && (
                    <div id="emergencyOverlay" style={{ display: 'flex' }}>
                        <i className="fas fa-exclamation-triangle fa-5x mb-3"></i>
                        <h1 className="fw-bold display-3">SECURITY ALERT</h1>
                        <h2 className="text-uppercase">{emergency.threat} DETECTED</h2>
                        <div className="mt-4 p-4 border border-light rounded">
                            <h4><i className="fas fa-phone-volume me-2"></i> {emergency.message}</h4>
                            <div className="display-6 fw-bold mt-2">{emergency.phone}</div>
                            <div className="small mt-2">AUTO-DIALING EMERGENCY CONTACT...</div>
                        </div>
                    </div>
                )}

                {/* Top Spacing / Title */}
                {/* Top Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary bg-opacity-10 p-3 rounded text-primary">
                            <i className="fas fa-shield-alt fa-2x"></i>
                        </div>
                        <div>
                            <h4 className="fw-bold mb-0 text-uppercase text-white" style={{ letterSpacing: '1px' }}>Smart AutoSecure Vision</h4>
                            <div className="d-flex align-items-center gap-2 text-secondary small mt-1">
                                <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-25">LIVE DASHBOARD</span>
                                <span>Real-time surveillance & threat monitoring</span>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex gap-3 me-3 border-end border-secondary pe-3 small">
                            <a href="#" className="text-secondary text-decoration-none hover-white"><i className="fas fa-info-circle me-1"></i> About</a>
                            <a href="#" className="text-secondary text-decoration-none hover-white"><i className="fas fa-question-circle me-1"></i> Help</a>
                            <a href="/login/" className="text-secondary text-decoration-none hover-white"><i className="fas fa-sign-in-alt me-1"></i> Login</a>
                        </div>
                        <span className="badge bg-dark border border-secondary p-2">
                            <i className="fas fa-clock me-1"></i> {new Date().toLocaleTimeString()}
                        </span>
                    </div>
                </div>

                <div className="row g-4 h-100">
                    {/* Left Column: Stats (Vertical) */}
                    <div className="col-lg-2 d-flex flex-column gap-3">
                        <div className="stat-card">
                            <div>
                                <h3>{stats.known}</h3>
                                <p>Known Persons</p>
                            </div>
                            <div className="icon-box text-success bg-opacity-10 bg-success">
                                <i className="fas fa-user-check"></i>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div>
                                <h3>{stats.unknown}</h3>
                                <p>Unknown Persons</p>
                            </div>
                            <div className="icon-box text-warning bg-opacity-10 bg-warning">
                                <i className="fas fa-user-secret"></i>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div>
                                <h3>{stats.suspects}</h3>
                                <p>Suspects Detected</p>
                            </div>
                            <div className="icon-box text-danger bg-opacity-10 bg-danger">
                                <i className="fas fa-exclamation-circle"></i>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div>
                                <h3>{stats.history ? stats.history.length : 0}</h3>
                                <p>Total Events</p>
                            </div>
                            <div className="icon-box text-info bg-opacity-10 bg-info">
                                <i className="fas fa-chart-line"></i>
                            </div>
                        </div>
                    </div>

                    {/* Center Column: Live Streams */}
                    <div className="col-lg-7">
                        <div className="main-video-wrapper mb-3" style={{ height: '60vh' }}>
                            {mainCameraId !== null ? (
                                <div className="main-video h-100">
                                    <img
                                        key={mainCameraId}
                                        src={`/video_feed/${mainCameraId}/?t=${Date.now()}`}
                                        className="w-100 h-100 object-fit-cover rounded-3"
                                        alt="Main Camera"
                                    />
                                    <div className="live-badge position-absolute top-0 start-0 m-3">
                                        <span className="blink-dot"></span> LIVE FEED
                                    </div>
                                    <button
                                        className="btn btn-sm btn-dark position-absolute top-0 end-0 m-4"
                                        onClick={() => openRoi(mainCameraId)}
                                    >
                                        <i className="fas fa-crop-alt"></i> Edit ROI
                                    </button>
                                </div>
                            ) : (
                                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-secondary border border-secondary border-dashed rounded-3">
                                    <i className="fas fa-video-slash fa-3x mb-3"></i>
                                    <h5>No Main Camera Selected</h5>
                                </div>
                            )}
                        </div>

                        {/* Small Cameras Grid */}
                        <div className="row g-2">
                            {cameras.map(cam => (
                                <div className="col-md-3 col-6" key={cam.id}>
                                    <div className={`small-cam position-relative ${cam.id === mainCameraId ? 'border border-primary border-4 shadow-lg' : 'border border-secondary'}`}
                                        style={{ width: '100%', paddingTop: '100%', cursor: 'pointer', overflow: 'hidden', borderRadius: '12px' }}
                                        onClick={() => handleSetMain(cam.id)}>
                                        <img
                                            src={`/video_feed/${cam.id}/?t=${Date.now()}`}
                                            className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                                        />
                                        <div className="live-badge position-absolute top-0 start-0 m-2 badge bg-danger text-white rounded-pill shadow-sm" style={{ fontSize: '0.65rem' }}>
                                            {cam.id === mainCameraId ? 'MAIN' : 'LIVE'}
                                        </div>
                                        <div className="position-absolute bottom-0 start-0 m-1 text-white bg-dark bg-opacity-75 px-2 rounded small" style={{ fontSize: '0.7rem' }}>
                                            {cam.label}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Actions & Logs */}
                    <div className="col-lg-3 d-flex flex-column gap-3">
                        {/* Action Buttons */}
                        <div className="d-grid gap-2">
                            {/* Note: cameraModal is defined in index.html (legacy). We trigger it via data-attributes. */}
                            <button className="btn btn-primary" type="button" onClick={handleOpenAddModal}>
                                <i className="fas fa-plus-circle me-2"></i> Add Camera
                            </button>
                            <a href="/admin/" className="btn btn-outline-light">
                                <i className="fas fa-cog me-2"></i> Admin Panel
                            </a>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-card rounded-4 p-3 border border-secondary border-opacity-25 flex-grow-1" style={{ overflowY: 'auto', maxHeight: '70vh' }}>
                            <h5 className="fw-bold mb-3 border-bottom border-secondary pb-2">
                                <i className="fas fa-history text-accent me-2"></i> Recent Activity
                            </h5>
                            <div id="logList">
                                {stats.history.slice().reverse().map((item, idx) => (
                                    <div key={idx} className={`log-item ${item.relation.includes('Suspect') || item.name === 'System' ? 'suspect' : ''}`}>
                                        <img src={`/static/${item.image}`} className="avatar" onError={(e) => e.target.src = 'https://via.placeholder.com/45?text=?'} />
                                        <div className="content">
                                            <div className="fw-bold">{item.name} <span className="badge bg-secondary" style={{ fontSize: '0.6rem' }}>{item.relation}</span></div>
                                            <div className="small">{item.action}</div>
                                        </div>
                                        <div className="time">{item.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {showRoiModal && (
                    <ROImodal
                        cameraId={roiCameraId}
                        onClose={() => setShowRoiModal(false)}
                    />
                )}

                {/* Add Camera Modal */}
                {showAddCameraModal && (
                    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.8)' }}>
                        <div className="modal-dialog">
                            <form onSubmit={handleAddCamera} className="modal-content bg-card text-white border-secondary" style={{ background: '#1e293b' }}>
                                <div className="modal-header border-bottom border-secondary">
                                    <h5 className="modal-title">Add New Camera</h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddCameraModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    {availableCameras.length > 0 ? (
                                        <>
                                            <div className="mb-3">
                                                <label>Select Camera</label>
                                                <select
                                                    className="form-select bg-dark text-white border-secondary"
                                                    value={newCamData.id}
                                                    onChange={e => {
                                                        const selected = availableCameras.find(c => c.id == e.target.value);
                                                        setNewCamData({ id: e.target.value, label: selected ? selected.label : `Camera ${e.target.value}` });
                                                    }}
                                                >
                                                    {availableCameras.map(cam => (
                                                        <option key={cam.id} value={cam.id}>{cam.label} (ID: {cam.id})</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label>Label</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-dark text-white border-secondary"
                                                    placeholder="e.g. Entrance"
                                                    value={newCamData.label}
                                                    onChange={e => setNewCamData({ ...newCamData, label: e.target.value })}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="alert alert-warning">
                                            No new cameras detected. Please ensure cameras are connected.
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer border-top border-secondary">
                                    <button type="submit" className="btn btn-success w-100" disabled={availableCameras.length === 0}>Add Camera</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
