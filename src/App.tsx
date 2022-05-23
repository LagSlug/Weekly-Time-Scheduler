import React from 'react';
import './App.css';
import WeeklyTimeScheduler, { Value } from './components/weekly-time-scheduler';

import Controller from './components/weekly-time-scheduler/controller';

function App() {
  
  const [value, setValue] = React.useState<Value>({
    monday: [[30, 180], [210, 240], [ 270, 300]],
    tuesday: [[30, 180], [240, 450]],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [[30, 180], [300, 900]]
  });  

  return (
    <div className="App">
      <header className="App-header">
        <h2>Weekly Time Scheduler</h2>
      </header>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
        <Controller value={value} onChange={setValue}>
          <WeeklyTimeScheduler />
        </Controller>

      </div>
    </div>
  );
}

export default App;

