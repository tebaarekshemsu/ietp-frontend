import React from 'react';

const Tab = ({ tabs, onTabClick }) => {
  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      {tabs.map((tab, index) => (
        <button
          key={index}
          style={{ padding: '10px 20px', borderRadius: '5px', border: '1px solid #ccc' }}
          onClick={() => onTabClick(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tab;
