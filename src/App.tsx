import React from 'react';
import './App.css';
import WeeklyTimeScheduler, { Value } from './components/weekly-time-scheduler';
import { hasIntersection as hasIntersectionFn } from './components/weekly-time-scheduler/utility';

function App() {
  const [value, setValue] = React.useState<Value>({
    monday: [[30, 180], [210, 240]],
    tuesday: [[30, 180], [210, 450]],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [[30, 180], [210, 900]]
  });

  const handleChange = (value: Value) => {
    var hasIntersection = false;

    // check if there is an intersection of spans within a day
    Object.keys(value).forEach(key=>{
      const spans = value[key as keyof Value];
      if(hasIntersectionFn(spans)) hasIntersection = true;
    })
    if(!hasIntersection) setValue(value);
  }
  return (
    <div className="App">
      <header className="App-header">
        Weekly Time Scheduler
      </header>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <WeeklyTimeScheduler value={value} onChange={handleChange} />
      </div>
    </div>
  );
}

export default App;

