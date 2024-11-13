import React, { useState } from 'react';
import CurrentConditions from './CurrentConditions';
import HistoryChart from './HistoryChart';
import FarmDetails from './FarmDetails';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [activityPage, setActivityPage] = useState(0);
  const activitiesPerPage = 2;

  // Placeholder data for each farm
  const placeholderData = {
    traditional: {
      temperature: 30,
      humidity: 40,
      ph: 9,
      dailyAverage: { temperature: 28, humidity: 65, ph: 6.8 },
      monthlyAverage: { temperature: 27, humidity: 68, ph: 7.1 },
      daily: [
        { date: '2023-01-01', temperature: 30, humidity: 70, ph: 6.9 },
        { date: '2023-01-02', temperature: 29, humidity: 68, ph: 7.0 },
      ],
      monthly: [
        { month: '2023-01', temperature: 28, humidity: 67, ph: 7.1 },
        { month: '2023-02', temperature: 27, humidity: 68, ph: 7.0 },
      ],
    },
    hydroponic: {
      temperature: 35,
      humidity: 30,
      ph: 6.2,
      dailyAverage: { temperature: 25, humidity: 75, ph: 6.6 },
      monthlyAverage: { temperature: 26, humidity: 76, ph: 6.7 },
      daily: [
        { date: '2023-01-01', temperature: 25, humidity: 77, ph: 6.5 },
        { date: '2023-01-02', temperature: 26, humidity: 76, ph: 6.6 },
      ],
      monthly: [
        { month: '2023-01', temperature: 25.5, humidity: 75.5, ph: 6.6 },
        { month: '2023-02', temperature: 26.0, humidity: 76.0, ph: 6.7 },
      ],
    },
  };

  // Placeholder functions for actions
  const turnOnFan = () => alert("Fan turned on for hydroponic farm!");
  const turnOnWaterPump = () => alert("Water pump turned on!");
  const adjustPH = () => alert("Adjusting pH level...");

  // Determine activities based on conditions
  const allActivities = [
    {
      condition: placeholderData.hydroponic.temperature > 25,
      message: "High temperature in hydroponic farm. Turn on the fan.",
      action: turnOnFan,
      color: "red",
    },
    {
      condition: placeholderData.traditional.humidity < 40,
      message: "Low humidity in traditional farm. Turn on water pump.",
      action: turnOnWaterPump,
      color: "rgb(204, 92, 108)",
    },
    {
      condition: placeholderData.hydroponic.humidity < 40,
      message: "Low humidity in hydroponic farm. Turn on water pump.",
      action: turnOnWaterPump,
      color: "rgb(204, 92, 108)",
    },
    {
      condition: placeholderData.traditional.ph < 6,
      message: "Low pH in traditional farm. Adjust pH levels.",
      action: adjustPH,
      color: "rgb(123, 39, 121)",
    },
    {
        condition: placeholderData.traditional.ph > 8,
        message: "High pH in traditional farm. Adjust pH levels.",
        action: adjustPH,
        color: "rgb(238, 55, 34)",
      },
  ].filter(activity => activity.condition);

  // Paginated activities
  const paginatedActivities = allActivities.slice(
    activityPage * activitiesPerPage,
    (activityPage + 1) * activitiesPerPage
  );

  const totalPages = Math.ceil(allActivities.length / activitiesPerPage);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Modern Farm Dashboard</h1>
        <div>
          <button>Settings</button>
          <button>Help</button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['Overview', 'Traditional Farm', 'Hydroponic Farm'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px',
              backgroundColor: activeTab === tab ? '#007BFF' : '#f0f0f0',
              color: activeTab === tab ? '#fff' : '#000',
              border: '1px solid #ddd',
              borderRadius: '5px',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <CurrentConditions data={placeholderData} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <h2>Activities</h2>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {paginatedActivities.length > 0 ? (
                  paginatedActivities.map((activity, index) => (
                    <div
                      key={index}
                      style={{
                        border: `2px solid ${activity.color}`,
                        borderRadius: '5px',
                        padding: '10px',
                        marginBottom: '10px',
                        color: activity.color,
                      }}
                    >
                      <p>{activity.message}</p>
                      <button
                        onClick={activity.action}
                        style={{
                          backgroundColor: activity.color,
                          color: '#fff',
                          padding: '5px 10px',
                          border: 'none',
                          borderRadius: '3px',
                        }}
                      >
                        {activity.message.split(' ').slice(-3).join(' ')}
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No activities needed at the moment.</p>
                )}
              </div>
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <button
                    onClick={() => setActivityPage(prev => Math.max(prev - 1, 0))}
                    disabled={activityPage === 0}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setActivityPage(prev => Math.min(prev + 1, totalPages - 1))}
                    disabled={activityPage === totalPages - 1}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <HistoryChart title="Temperature History" data={placeholderData.traditional.daily} />
            <HistoryChart title="Humidity History" data={placeholderData.traditional.daily} />
            <HistoryChart title="pH History" data={placeholderData.traditional.daily} />
          </div>
        </>
      )}

      {activeTab === 'Traditional Farm' && (
        <FarmDetails farmType="Traditional Farm" data={placeholderData.traditional} />
      )}

      {activeTab === 'Hydroponic Farm' && (
        <FarmDetails farmType="Hydroponic Farm" data={placeholderData.hydroponic} />
      )}
    </div>
  );
};

export default Dashboard;
