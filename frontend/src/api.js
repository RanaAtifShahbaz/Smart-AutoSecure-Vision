export const API_BASE = ''; // Relative path since embedded

export const fetchCameras = async () => {
    const res = await fetch(`${API_BASE}/cameras/`);
    return res.json();
};

export const fetchAddedCameras = async () => {
    const res = await fetch(`${API_BASE}/api/added_cameras/`);
    return res.json();
};

export const addCamera = async (id, label) => {
    const res = await fetch(`${API_BASE}/add_camera/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, label })
    });
    return res.json();
};

export const setMainCamera = async (id) => {
    await fetch(`${API_BASE}/set_main/${id}/`);
};

export const setRoi = async (payload) => {
    await fetch(`${API_BASE}/api/set_roi/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
};

export const fetchStats = async () => {
    const res = await fetch(`${API_BASE}/api/stats/`);
    return res.json();
};

export const fetchEmergencyStatus = async () => {
    const res = await fetch(`${API_BASE}/api/emergency_status/`);
    return res.json();
};

export const simulateThreat = async (type) => {
    await fetch(`${API_BASE}/api/simulate_threat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
    });
};

export const registerSample = async (payload) => {
    const res = await fetch(`${API_BASE}/admin/register_samples/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return res.json();
};

export const addPerson = async (formData) => {
    const res = await fetch(`${API_BASE}/admin/add/`, {
        method: 'POST',
        body: formData
    });
    return res.json();
};

export const addContact = async (formData) => {
    const res = await fetch(`${API_BASE}/admin/add_contact/`, {
        method: 'POST',
        body: formData
    });
    return res;
};

// New API functions
export const fetchPersons = async () => {
    const res = await fetch(`${API_BASE}/api/persons/`);
    return res.json();
};

export const fetchContacts = async () => {
    const res = await fetch(`${API_BASE}/api/contacts/`);
    return res.json();
};

export const fetchLogs = async () => {
    const res = await fetch(`${API_BASE}/api/logs/`);
    return res.json();
};
