import React, { useState } from 'react';

const SimulationSetup = () => {
  const [layout, setLayout] = useState('Both');
  const [trafficDensity, setTrafficDensity] = useState('Medium');
  const [networkType, setNetworkType] = useState('Private 5G');

  return (
    <div className="simulation-setup">
      <h2>Pre-loaded Layout</h2>
      <div className="layout-options">
        <button onClick={() => setLayout('Urban')}>🏙️ Urban</button>
        <button onClick={() => setLayout('Rural')}>🏞️ Rural</button>
        <button onClick={() => setLayout('Campus')}>🏫 Campus</button>
        <button onClick={() => setLayout('Both')}>🏢 Both</button>
      </div>

      <h3>Traffic Density</h3>
      <div className="traffic-options">
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

      <h3>Network Type</h3>
      <div className="network-options">
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

      <button onClick={() => console.log('Continue to Simulation')}>Continue to Simulation</button>
    </div>
  );
};

export default SimulationSetup; 