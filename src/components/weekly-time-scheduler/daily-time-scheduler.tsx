import { Fragment, useEffect, useRef, useState } from 'react';
import './daily-time-scheduler.scss'
import times from './times';

export type Times = [number, number][];
type Props = {
  label: string | false; // false hides the label
  value?: Times;
  onChange?: (times: Times) => void; 
}


export default function DailyScheduler(props: Props) {
  const scheduleRef = useRef<HTMLDivElement>(null);
  const clientXRef = useRef<number>(0);

  const [showGhost, setShowGhost] = useState(false);
  const [ghostTime, setGhostTime] = useState('');
  const [ghostPosition, setGhostPosition] = useState<number>(1200);

  // on load we want to "snap" values to 30 minute increments,
  // and the second value of the tuple must be at least 30
  // minutes after the first
  // useEffect(()=>{ 
  //   if(!props.value) return
  //   var changed = false;
  //   const snappedValues = props.value.map(times=>{
  //     var [first, second] = times;
  //     // snap the values
  //     return [first, second];
  //   }) as Times

  //   if(changed) props.onChange?.apply(null, [snappedValues]);

  // }, [props.value, props.onChange])

  // workaround for firefox which does not provide the right clientX value when dragging
  useEffect(()=>{
    const getClientX = (event: DragEvent) => {
      clientXRef.current = event.clientX;
    };
    window.addEventListener('dragstart', getClientX);
    window.addEventListener('dragover', getClientX);
    return ()=>{
      window.removeEventListener('dragover', getClientX);
      window.removeEventListener('dragstart', getClientX);
    }
  }, []);


  const label = props.label ? <>
    <div className="label">
      <span>{props.label}</span>
    </div>
    <div className="spacer"></div>
  </> : <></>

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if(!scheduleRef.current) return;
    const [time, quantizedLeft] = getTimeAtCursor(scheduleRef.current, e.clientX);
    setGhostPosition(quantizedLeft);
    setGhostTime(time);
  }

  const handleScheduleClick: React.MouseEventHandler<HTMLDivElement> = e => {
    if(!scheduleRef.current) return;
    const [time, quantizedLeft] = getTimeAtCursor(scheduleRef.current, e.clientX);

  }

  return (
    <div className="daily-scheduler">
      {label}
      <div ref={scheduleRef} className="schedule"
        onClick={handleScheduleClick}  
        onMouseMove={handleMouseMove} 
        onMouseOver={()=>setShowGhost(true)} 
        onMouseOut={()=>setShowGhost(false)}
      >
        <DotLine />
        { showGhost && <Ghost position={ghostPosition} label={ghostTime} />   }
        {
          props.value?.map((times, i)=>{
            const [first, second] = times;
            
            // there are n = 48 possible positions for a marker
            // one dot at each half hour point
            const n1 = first / 30;
            const n2 = second / 30;

            // each dot is 25 pixels from the next
            const left = n1 * 25;
            const right = n2 * 25;

            const barlabel = getTimeAtN(n1)[0] + " - " + getTimeAtN(n2)[0];
            const handleDragStart: React.DragEventHandler<HTMLDivElement> = e => {
              var canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              if(context) context.clearRect(0, 0, canvas.width, canvas.height);

              e.dataTransfer.setDragImage(canvas, -99999, -99999);
            }

            const handleLeftMarkerDrag: React.DragEventHandler<HTMLDivElement> = e => {
              // setShowGhost(false);
              
              if(!scheduleRef.current || !props.value) return;
              const [time, quantizedLeft] = getTimeAtCursor(scheduleRef.current, clientXRef.current);
              if(!time) return;

              if(quantizedLeft > right - 25) return;

              setGhostPosition(quantizedLeft);
              setGhostTime(time);

              // value is in minutes
              const newTimeValue = parseDaytime(time) / (1000 * 60);
              
              const copy = props.value.concat([]);
              copy.splice(i, 1, [newTimeValue, second]);
              props.onChange?.apply(null, [copy]);

            }
            const handleRightMarkerDrag: React.DragEventHandler<HTMLDivElement> = e => {
              // setShowGhost(false);
              
              if(!scheduleRef.current || !props.value) return;
              const [time, quantizedLeft] = getTimeAtCursor(scheduleRef.current, clientXRef.current);
              if(!time) return;
              
              if(quantizedLeft < left + 25) return;

              setGhostPosition(quantizedLeft);
              setGhostTime(time);

              // value is in minutes
              const newTimeValue = quantizedLeft === 1200 ? 1440 : (parseDaytime(time) / (1000 * 60));
              
              const copy = props.value.concat([]);
              copy.splice(i, 1, [first, newTimeValue]);
              props.onChange?.apply(null, [copy]);
            }

            return <div key={i} >
              <Marker position={left} onDragStart={handleDragStart} onDrag={handleLeftMarkerDrag} />
              <Bar left={left} right={right} label={barlabel} />
              <Marker position={right} onDragStart={handleDragStart} onDrag={handleRightMarkerDrag}/>
            </div>
          })
        }
      </div>
    </div>
  )
}

function DotLine() {
  return (
    <div className="dot-line">
      <div className="dot dot-left"></div>      
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>

      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>

      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>


      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      <div className="dot dot-middle"></div>
      
      <div className="dot dot-right"></div>
      
    </div>
  )
}

function Ghost({ position, label }: { position: number, label: string }) {
  return (
    <div className="ghost" style={{ left: position }}>
      <div className="circle"></div>
      <div className="label noselect">{label}</div>
    </div>
  )
}

export type MarkerProps = {
  position: number;
  label?: string;
  onDragStart?: React.DragEventHandler<HTMLDivElement>;
  onDrag?: React.DragEventHandler<HTMLDivElement>;
}

function Marker({ position, label, onDrag, onDragStart }: MarkerProps) {
  return (
    <div className="marker" style={{ left: position }} draggable onDrag={onDrag} onDragStart={onDragStart}>
      <div className="circle"></div>
      <div className="label noselect">{label}</div>
    </div>
  )
}

function Bar({ left, right, label }: { left: number, right: number, label?: string }) {

  const width = right - left;
  return (
    <div className="bar" style={{ left, width }}>
      <div className="label noselect" style={{ width: width + 26 }}>{label}</div>
    </div>
  )
}

function roundDate(date: Date) {
  var coeff = 1000 * 60 * 30;
  return new Date(Math.round(date.getTime() / coeff) * coeff)
}

function getTimeAtN(n: number): [string, number] {
  return [times[n], n * 25]
}

function getTimeAtCursor(schedule: HTMLDivElement, clientX: number): [string, number] {
  const rect = schedule.getBoundingClientRect();
  const left = clientX - rect.left;
  var n = Math.round(left / 25);

  // don't allow n to be less than zero
  n = n < 0 ? 0 : n;

  const quantizedLeft = n * 25;
  const time = times[n];

  return [time, quantizedLeft]
}

//https://stackoverflow.com/a/48581881
function parseDaytime(time: string): number {
  if(!time) return 0;
  let [hours, minutes] = time.substring(0, time.length - 2).split(":").map(Number);
  minutes = minutes || 0;
  if (time.includes("PM") && hours !== 12) hours += 12;
  if (time.includes("AM") && hours === 12) hours = 0;
  return 1000/*ms*/ * 60/*s*/ * (hours * 60 + minutes);
}

// function getMillisecondFromTime(time: string): number {
//   // get numbe of milliseconds from time e.g. "12 AM" = 0ms, and "12:30 AM" = 1800000ms
//   const milliseconds = parseDaytime(time);
                

//   // for some reason first.setTime(milliseconds) doesn't work, so this is the
//   // workaround I used
//   return (new Date(2000, 0, 1, 0, 0, 0, 0).getTime() + milliseconds)
// }