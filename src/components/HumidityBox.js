import React, { useState } from "react";

const HumidityBox = () => {
  const [activeTab, setActiveTab] = useState("hourly");

  const renderGraphPlaceholder = () => (
    <div className="graph-placeholder">Graph for {activeTab}</div>
  );

  const renderWarning = () => (
    <div className="warning">Warning: Humidity out of range!</div>
  );

  return (
    <div className="box">
      <div className="box-header">Humidity</div>
      <div className="tabs">
        <div className={`tab ${activeTab === "hourly" ? "active" : ""}`} onClick={() => setActiveTab("hourly")}>Hourly</div>
        <div className={`tab ${activeTab === "daily" ? "active" : ""}`} onClick={() => setActiveTab("daily")}>Daily</div>
        <div className={`tab ${activeTab === "monthly" ? "active" : ""}`} onClick={() => setActiveTab("monthly")}>Monthly</div>
      </div>
      {renderGraphPlaceholder()}
      {renderWarning()}
    </div>
  );
};

export default HumidityBox;
