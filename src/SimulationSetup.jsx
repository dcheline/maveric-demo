import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SimulationSetup = () => {
  const [layout, setLayout] = useState('Both');
  const [trafficDensity, setTrafficDensity] = useState('Medium');
  const [networkType, setNetworkType] = useState('Private 5G');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log('File uploaded:', file);
    setShowModal(false);
  };

  const handleLayoutClick = (selectedLayout) => {
    setLayout(selectedLayout);
  };

  return (
    <div className="simulation-setup">
      <h1>Maveric Demo</h1>
      <h2>Environment Setup / Layout Selection</h2>
      <div className="layout-options">
          <button className={layout === 'Urban' ? 'selected' : ''} onClick={() => handleLayoutClick('Urban')}>
          <span style={{ fontSize: '2em' }}>🏙️</span> Urban
          </button>
          <button className={layout === 'Rural' ? 'selected' : ''} onClick={() => handleLayoutClick('Rural')}>
          <span style={{ fontSize: '2em' }}>🏞️</span> Rural
          </button>
          <button className={layout === 'Campus' ? 'selected' : ''} onClick={() => handleLayoutClick('Campus')}>
          <span style={{ fontSize: '2em' }}>🏫</span> Campus
          </button>
          <button className={layout === 'Both' ? 'selected' : ''} onClick={() => handleLayoutClick('Both')}>
          <span style={{ fontSize: '2em' }}>🏢</span> Both
          </button>
          <button className={layout === 'House' ? 'selected' : ''} onClick={() => handleLayoutClick('House')}>
          <span style={{ fontSize: '2em' }}>🏠</span> House
          </button>
          <button className={layout === 'Office' ? 'selected' : ''} onClick={() => handleLayoutClick('Office')}>
          <span style={{ fontSize: '2em' }}>🏬</span> Office
          </button>
          <button className="btn-load-layout" onClick={() => setShowModal(true)} style={{ width: '315%' }}>Load your layout
          </button>
      </div>
      <div className="options-container">
        <div className="options-column">
          <h3>Traffic Density</h3>
          <label>
            <input
              type="radio"
              value="Low"
              checked={trafficDensity === 'Low'}
              onChange={() => setTrafficDensity('Low')}
            />
            Low
          </label>
          <label>
            <input
              type="radio"
              value="Medium"
              checked={trafficDensity === 'Medium'}
              onChange={() => setTrafficDensity('Medium')}
            />
            Medium
          </label>
          <label>
            <input
              type="radio"
              value="High"
              checked={trafficDensity === 'High'}
              onChange={() => setTrafficDensity('High')}
            />
            High
          </label>
        </div>

        <div className="options-column">
          <h3>Network Type</h3>
          <label>
            <input
              type="radio"
              value="Wi-Fi"
              checked={networkType === 'Wi-Fi'}
              onChange={() => setNetworkType('Wi-Fi')}
            />
            Wi-Fi
          </label>
          <label>
            <input
              type="radio"
              value="Private 5G"
              checked={networkType === 'Private 5G'}
              onChange={() => setNetworkType('Private 5G')}
            />
            Private 5G
          </label>
          <label>
            <input
              type="radio"
              value="Both"
              checked={networkType === 'Both'}
              onChange={() => setNetworkType('Both')}
            />
            Both
          </label>
        </div>
      </div>

      <div className="button-container">
        <button className="btn btn-primary" onClick={() => navigate('/digital-twin')}>Digital Twin Simulation</button>
        <button className="btn btn-mobility" onClick={() => navigate('/mro-simulation')}>Mobility Simulation</button>
        <button className="btn btn-results" onClick={() => navigate('/results')}>Results</button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Upload Layout</h3>
            <input type="file" onChange={handleFileUpload} />
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

      <div className="footer">
        © 2025 Maveric Demo
      </div>
    </div>
  );
};

export default SimulationSetup; 