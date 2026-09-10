import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import GaugeChart from 'react-gauge-chart';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'chart.js/auto';
import 'leaflet/dist/leaflet.css';

const REGION_COORDS = {
    'Pune Substation': [18.5204, 73.8567],
    'Bilaspur Feeder': [22.0797, 82.1409],
    'Jaipur Dist-Line': [26.9124, 75.7873],
    'Central Hub': [21.1458, 79.0882]
};

const SafeNetQDashboard = () => {
    const [devices, setDevices] = useState({});
    const [selectedId, setSelectedId] = useState('DEV-01');
    const [view, setView] = useState('geo');
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    // Node Manager State
    const [newDevId, setNewDevId] = useState('');
    const [newDevLoc, setNewDevLoc] = useState('Pune Substation');
    const [newDevLat, setNewDevLat] = useState(REGION_COORDS['Pune Substation'][0]);
    const [newDevLng, setNewDevLng] = useState(REGION_COORDS['Pune Substation'][1]);

    useEffect(() => {
        const initialDevices = {};
        const regions = Object.keys(REGION_COORDS);

        for (let i = 1; i <= 40; i++) {
            const id = `DEV-${i.toString().padStart(2, '0')}`;
            const loc = regions[i % 4];
            const lat = REGION_COORDS[loc][0] + (Math.random() * 0.2 - 0.1);
            const lng = REGION_COORDS[loc][1] + (Math.random() * 0.2 - 0.1);

            initialDevices[id] = {
                v_rms: 0, i_rms: 0, i_peak: 0, thd: 0, crest: 0,
                status: 'Normal', history: [], location: loc, lat: lat, lng: lng
            };
        }
        setDevices(initialDevices);

        const interval = setInterval(() => {
            setDevices(prev => {
                const next = { ...prev };
                Object.keys(next).forEach(id => {
                    const v = 230 + (Math.random() * 4 - 2);
                    const i = 5 + (Math.random() * 1.5 - 0.75);
                    const isFault = Math.random() > 0.98;
                    const newPoint = { time: new Date().toLocaleTimeString(), v, i };

                    next[id] = {
                        ...prev[id],
                        v_rms: v.toFixed(2), i_rms: i.toFixed(2), i_peak: (i * 1.414).toFixed(2), thd: (2.1 + Math.random()).toFixed(2),
                        status: isFault ? 'FAULT' : 'Normal',
                        history: [...(prev[id].history || []), newPoint].slice(-15)
                    };
                });
                return next;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleLocDropdownChange = (e) => {
        const loc = e.target.value;
        setNewDevLoc(loc);
        setNewDevLat(REGION_COORDS[loc][0]);
        setNewDevLng(REGION_COORDS[loc][1]);
    };

    const handleAddDevice = (e) => {
        e.preventDefault();
        if (!newDevId) return;
        const id = newDevId.toUpperCase();

        setDevices(prev => ({
            ...prev,
            [id]: {
                v_rms: 0, i_rms: 0, i_peak: 0, thd: 0, crest: 0,
                status: 'Normal', history: [],
                location: newDevLoc, lat: parseFloat(newDevLat), lng: parseFloat(newDevLng)
            }
        }));
        setNewDevId('');
    };

    const handleDeleteDevice = (idToRemove) => {
        setDevices(prev => {
            const { [idToRemove]: removedKey, ...rest } = prev;
            return rest;
        });
        if (selectedId === idToRemove) {
            setSelectedId(Object.keys(devices).filter(id => id !== idToRemove)[0] || '');
            setView('manage');
        }
    };

    const createIcon = (status) => {
        const color = status === 'FAULT' ? '#dc3545' : '#28a745'; // Red for fault, Green for normal
        return L.divIcon({
            className: 'custom-icon',
            html: `<div style="width: 16px; height: 16px; background-color: ${color}; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid #fff;"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
    };

    const activeDev = devices[selectedId] || {};

    const generate5MinHistory = () => {
        if (!activeDev.v_rms) return [];
        const baseV = parseFloat(activeDev.v_rms);
        const baseI = parseFloat(activeDev.i_rms);
        return Array.from({ length: 8 }).map((_, i) => {
            const date = new Date(Date.now() - i * 5 * 60000);
            return {
                time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                v: (baseV + (Math.random() * 3 - 1.5)).toFixed(2),
                i: (baseI + (Math.random() * 0.5 - 0.25)).toFixed(2),
                thd: (2.1 + Math.random() * 0.3).toFixed(2)
            };
        });
    };

    // Light Theme Styles
    const containerStyle = { display: 'flex', backgroundColor: '#f4f7f6', minHeight: '100vh', color: '#333', fontFamily: 'sans-serif' };
    const sidebarStyle = { width: isMenuOpen ? '250px' : '50px', transition: 'width 0.3s', backgroundColor: '#ffffff', borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column' };
    const panelStyle = { backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', color: '#333', border: '1px solid #e0e0e0' };
    const screenStyle = { backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '15px', fontFamily: "'Courier New', Courier, monospace", color: '#333', border: '1px solid #dee2e6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
    const btnStyle = (active) => ({ width: '100%', padding: '10px', background: active ? '#e9ecef' : 'transparent', color: '#333', border: 'none', textAlign: 'left', cursor: 'pointer', borderRadius: '4px', marginBottom: '5px', fontWeight: active ? 'bold' : 'normal' });
    const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', backgroundColor: '#fff', color: '#333', border: '1px solid #ced4da', borderRadius: '4px', boxSizing: 'border-box' };

    return (
        <div style={containerStyle}>
            <div style={sidebarStyle}>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ padding: '15px', background: '#f8f9fa', color: '#333', border: 'none', borderBottom: '1px solid #e0e0e0', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }}>
                    {isMenuOpen ? '◀ CLOSE' : '▶'}
                </button>

                {isMenuOpen && (
                    <div style={{ padding: '15px', overflowY: 'auto', flex: 1 }}>
                        <h4 style={{ color: '#6c757d', marginBottom: '10px', fontSize: '12px', textTransform: 'uppercase' }}>Navigation</h4>
                        <button onClick={() => setView('analog')} style={btnStyle(view === 'analog')}>🎛️ Hardware View</button>
                        <button onClick={() => setView('geo')} style={btnStyle(view === 'geo')}>🗺️ Geo-Network</button>
                        <button onClick={() => setView('compare')} style={btnStyle(view === 'compare')}>📊 System Matrix</button>
                        <button onClick={() => setView('manage')} style={btnStyle(view === 'manage')}>⚙️ Node Manager</button>
                    </div>
                )}
            </div>

            <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, color: '#333', letterSpacing: '1px' }}>SafeNetQ <span style={{ color: '#888', fontWeight: 'normal', fontSize: '16px' }}>// OPERATOR: ADMIN</span></h2>
                </div>

                {/* Analog Hardware View */}
                {view === 'analog' && activeDev && (
                    <div style={panelStyle}>
                        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#0056b3' }}>UNIT: {selectedId} | LOC: {activeDev.location}</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                            <div style={screenStyle}>
                                <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>V(RMS)</div>
                                <div style={{ width: '100%', maxWidth: '180px' }}><GaugeChart id="g-v" nrOfLevels={30} colors={["#28a745", "#ffc107", "#dc3545"]} arcWidth={0.3} percent={activeDev.v_rms / 300} textColor="#333" formatTextValue={() => activeDev.v_rms + ' V'} /></div>
                            </div>
                            <div style={screenStyle}>
                                <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>I(RMS)</div>
                                <div style={{ width: '100%', maxWidth: '180px' }}><GaugeChart id="g-i" nrOfLevels={20} colors={["#28a745", "#dc3545"]} arcWidth={0.3} percent={activeDev.i_rms / 15} textColor="#333" formatTextValue={() => activeDev.i_rms + ' A'} /></div>
                            </div>
                            <div style={screenStyle}>
                                <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>I(PEAK)</div>
                                <div style={{ width: '100%', maxWidth: '180px' }}><GaugeChart id="g-p" nrOfLevels={20} colors={["#17a2b8", "#dc3545"]} arcWidth={0.3} percent={activeDev.i_peak / 20} textColor="#333" formatTextValue={() => activeDev.i_peak + ' A'} /></div>
                            </div>
                            <div style={screenStyle}>
                                <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>THD(%)</div>
                                <div style={{ width: '100%', maxWidth: '180px' }}><GaugeChart id="g-t" nrOfLevels={15} colors={["#28a745", "#ffc107", "#dc3545"]} arcWidth={0.3} percent={activeDev.thd / 10} textColor="#333" formatTextValue={() => activeDev.thd + ' %'} /></div>
                            </div>
                            <div style={{ ...screenStyle, backgroundColor: activeDev.status === 'FAULT' ? '#f8d7da' : '#d4edda', borderColor: activeDev.status === 'FAULT' ? '#f5c6cb' : '#c3e6cb' }}>
                                <small style={{ color: '#333', fontWeight: 'bold' }}>STATE</small>
                                <span style={{ fontSize: '24px', marginTop: '10px', color: activeDev.status === 'FAULT' ? '#721c24' : '#155724', fontWeight: 'bold' }}>{activeDev.status}</span>
                            </div>
                        </div>

                        <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '15px', border: '1px solid #dee2e6', height: '300px', marginBottom: '30px' }}>
                            <Line data={{ labels: activeDev.history?.map(h => h.time) || [], datasets: [{ label: 'Voltage (V)', data: activeDev.history?.map(h => h.v) || [], borderColor: '#0056b3', tension: 0.1, pointRadius: 0, borderWidth: 2 }] }} options={{ animation: false, maintainAspectRatio: false, scales: { x: { display: false } } }} />
                        </div>

                        <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '15px', border: '1px solid #dee2e6' }}>
                            <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>Historical Log (5-Minute Intervals)</h4>
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', color: '#333' }}>
                                <thead><tr style={{ borderBottom: '2px solid #dee2e6', backgroundColor: '#f8f9fa' }}><th style={{ padding: '10px' }}>TIMESTAMP</th><th style={{ padding: '10px' }}>V(RMS)</th><th style={{ padding: '10px' }}>I(RMS)</th><th style={{ padding: '10px' }}>THD(%)</th></tr></thead>
                                <tbody>{generate5MinHistory().map((log, index) => (<tr key={index} style={{ borderBottom: '1px solid #e9ecef' }}><td style={{ padding: '10px', fontWeight: 'bold', color: '#6c757d' }}>{log.time}</td><td style={{ padding: '10px' }}>{log.v} V</td><td style={{ padding: '10px' }}>{log.i} A</td><td style={{ padding: '10px' }}>{log.thd} %</td></tr>))}</tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Node Manager */}
                {view === 'manage' && (
                    <div style={panelStyle}>
                        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#333' }}>NODE MANAGEMENT</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                            <div style={{ border: '1px solid #dee2e6', padding: '20px', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
                                <h4 style={{ marginTop: 0, color: '#0056b3' }}>➕ Provision New Node</h4>
                                <form onSubmit={handleAddDevice}>
                                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Device ID</label>
                                    <input type="text" placeholder="e.g. DEV-41" value={newDevId} onChange={e => setNewDevId(e.target.value)} style={inputStyle} />

                                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Region</label>
                                    <select value={newDevLoc} onChange={handleLocDropdownChange} style={inputStyle}>
                                        <option value="Pune Substation">Pune Substation</option>
                                        <option value="Bilaspur Feeder">Bilaspur Feeder</option>
                                        <option value="Jaipur Dist-Line">Jaipur Dist-Line</option>
                                        <option value="Central Hub">Central Hub</option>
                                    </select>

                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Latitude</label>
                                            <input type="number" step="any" value={newDevLat} onChange={e => setNewDevLat(e.target.value)} style={inputStyle} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Longitude</label>
                                            <input type="number" step="any" value={newDevLng} onChange={e => setNewDevLng(e.target.value)} style={inputStyle} />
                                        </div>
                                    </div>

                                    <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#0056b3', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>DEPLOY DEVICE</button>
                                </form>
                            </div>
                            <div style={{ border: '1px solid #dee2e6', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', maxHeight: '460px', overflowY: 'auto' }}>
                                <h4 style={{ marginTop: 0, color: '#dc3545' }}>❌ Terminate Nodes</h4>
                                <table style={{ width: '100%', textAlign: 'left', color: '#333', borderCollapse: 'collapse' }}>
                                    <tbody>{Object.keys(devices).map(id => (<tr key={id} style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '12px', fontWeight: 'bold' }}>{id}</td><td style={{ padding: '12px', color: '#666' }}>{devices[id].location}</td><td style={{ textAlign: 'right', padding: '12px' }}><button onClick={() => handleDeleteDevice(id)} style={{ padding: '6px 12px', backgroundColor: '#fff', color: '#dc3545', border: '1px solid #dc3545', borderRadius: '4px', cursor: 'pointer' }}>Terminate</button></td></tr>))}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Geo-Spatial Map View */}
                {view === 'geo' && (
                    <div style={panelStyle}>
                        <h3 style={{ marginBottom: '15px', color: '#333' }}>LIVE GEOGRAPHICAL NETWORK</h3>
                        <div style={{ height: '600px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #dee2e6' }}>
                            <MapContainer center={[22.5, 78]} zoom={5} style={{ height: '100%', width: '100%' }}>
                                {/* Using a light themed map tile layer */}
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                {Object.entries(devices).map(([id, data]) => (
                                    <Marker key={id} position={[data.lat, data.lng]} icon={createIcon(data.status)}>
                                        <Popup>
                                            <div style={{ color: '#333', fontFamily: 'sans-serif' }}>
                                                <strong>{id}</strong> - {data.location}<br />
                                                Status: <span style={{ color: data.status === 'FAULT' ? '#dc3545' : '#28a745', fontWeight: 'bold' }}>{data.status}</span><br />
                                                V(RMS): {data.v_rms} V<br />
                                                I(RMS): {data.i_rms} A
                                            </div>
                                            <button onClick={() => { setSelectedId(id); setView('analog'); }} style={{ marginTop: '10px', width: '100%', padding: '6px', backgroundColor: '#0056b3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>View Hardware</button>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    </div>
                )}

                {/* System Matrix */}
                {view === 'compare' && (
                    <div style={panelStyle}>
                        <h3 style={{ marginBottom: '15px', color: '#333' }}>SYSTEM MATRIX</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', color: '#333' }}>
                                <thead><tr style={{ borderBottom: '2px solid #dee2e6', backgroundColor: '#f8f9fa' }}><th style={{ padding: '12px' }}>ID</th><th style={{ padding: '12px' }}>LOCATION</th><th style={{ padding: '12px' }}>STATE</th><th style={{ padding: '12px' }}>V(RMS)</th><th style={{ padding: '12px' }}>I(RMS)</th></tr></thead>
                                <tbody>{Object.entries(devices).map(([id, data]) => (<tr key={id} style={{ borderBottom: '1px solid #e9ecef', backgroundColor: data.status === 'FAULT' ? '#f8d7da' : '#fff' }}><td style={{ padding: '12px', fontWeight: 'bold' }}>{id}</td><td style={{ padding: '12px' }}>{data.location}</td><td style={{ padding: '12px', color: data.status === 'FAULT' ? '#dc3545' : '#28a745', fontWeight: 'bold' }}>{data.status}</td><td style={{ padding: '12px' }}>{data.v_rms}</td><td style={{ padding: '12px' }}>{data.i_rms}</td></tr>))}</tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SafeNetQDashboard;
