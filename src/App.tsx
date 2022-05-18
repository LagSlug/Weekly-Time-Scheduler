import React from 'react';
import './App.css';
import WeeklyTimeScheduler, { Value, Props, ClickInfo } from './components/weekly-time-scheduler';
import { hasIntersection as hasIntersectionFn } from './components/weekly-time-scheduler/utility';
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";

function App() {
  const [menuPosition, setMenuPosition] = React.useState({
    top: 0,
    left: 0
  });

  const [showMenu, setShowMenu] = React.useState(false);
  const [showRemoveButton, setShowRemoveButton] = React.useState(false);
  const [showAddButton, setShowAddButton] = React.useState(false);

  const [info, setInfo] = React.useState<ClickInfo>();

  const [value, setValue] = React.useState<Value>({
    monday: [[30, 180], [210, 240], [ 270, 300]],
    tuesday: [[30, 180], [240, 450]],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [[30, 180], [300, 900]]
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

  const handleClick: Props['onClick'] = (e, info) => {
    setMenuPosition({
      left: e.clientX,
      top: e.clientY
    })

    setInfo(info);
    setShowMenu(false);

    if(info.span) {
      // show remove segment button
      setShowRemoveButton(true);
      setShowAddButton(false);
    }
    else {
      // show add segment button if the newly created segment does not intersect with existing
      // segments
      const newSpan = [info.minutes, info.minutes + 30] as [number, number];
      const spans = value[info.day].concat([newSpan]);
      if(hasIntersectionFn(spans)) return;

      setShowRemoveButton(false);
      setShowAddButton(true);
    }

    setShowMenu(true);
  }

  const handleRemoveSpan = () => {
    if(!info) return;
    const clone = Object.assign({}, value);
    clone[info.day].splice(info.spanIndex, 1);
    setValue(clone);
    setShowMenu(false);
  }

  const handleAddSpan = () => {
    if(!info) return;
    const span = [info.minutes, info.minutes + 30] as [number, number];
    const clone = Object.assign({}, value);
    
    clone[info.day].push(span);
    clone[info.day] = clone[info.day].sort((a, b)=>{
      if(a[0] > b[0]) return 1;
      return -1;
    });

    setValue(clone);
    setShowMenu(false);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Weekly Time Scheduler</h2>
      </header>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
        <WeeklyTimeScheduler value={value} onChange={handleChange} onClick={handleClick} />
        
        { showMenu && <div style={{ position: 'absolute', zIndex: 2, ...menuPosition}}>
          { showAddButton && <button onClick={handleAddSpan}>Add Segment</button> }
          { showRemoveButton && <button onClick={handleRemoveSpan}>Remove Segment</button> }
          <button onClick={()=>setShowMenu(false)}>X</button>
        </div>}

      </div>
    </div>
  );
}

export default App;

