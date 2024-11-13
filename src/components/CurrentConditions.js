import React from 'react';

const CurrentConditions = ({ data }) => {
  const traditional = data?.traditional || {};
  const hydroponic = data?.hydroponic || {};

  return (
    <div style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
      <h2>Current Conditions</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h3>Traditional Farm</h3>
          <p>🌡 Temperature: <span style={{ color: 'orange' }}>{traditional.temperature}°C</span></p>

          <p>💧 Humidity: <span style={{ color: 'green' }}>{traditional.humidity}%</span></p>
          <p>🔬 pH: {traditional.ph}</p>

        </div>
        <div>
          <h3>Hydroponic Farm</h3>
          <p>🌡 Temperature: <span style={{ color: 'lightblue' }}> {hydroponic.temperature}°C</span></p>
          <p>💧 Humidity: <span style={{ color: 'yellow' }}>{hydroponic.humidity}%</span></p>
          <p>🔬 pH:  {hydroponic.ph}</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentConditions;
