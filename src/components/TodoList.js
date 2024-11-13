import React from 'react';

const TodoList = () => {
  return (
    <div style={{ width: '250px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
      <h2>Todo List</h2>
      <p>Suggested actions based on current conditions</p>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li><input type="checkbox" /> Adjust irrigation based on current humidity levels</li>
        <li><input type="checkbox" /> Monitor pH levels closely in the hydroponic system</li>
        <li><input type="checkbox" /> Optimize temperature control for both farming methods</li>
        <li><input type="checkbox" /> Implement crop rotation in the traditional farm</li>
      </ul>
    </div>
  );
};

export default TodoList;
