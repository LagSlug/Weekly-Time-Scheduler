import React from 'react';
import { Value, ClickInfo, Props as WTSProps } from '.';
import { hasIntersection as hasIntersectionFn } from './utility';

type Props = React.PropsWithChildren<{
  value?: Value;
  onChange?: (value: Value) => void;
}>;

export default function Controller({ children, value: propsValue, onChange }: Props) {
  const [menuPosition, setMenuPosition] = React.useState({
    top: 0,
    left: 0
  });
  const [value, setValue] = React.useState<Value>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  });

  // watch propsValue and update internal value
  React.useEffect(()=>{ 
    if(propsValue && propsValue !== value) setValue(propsValue);
  }, [propsValue, value, setValue])

  const [showMenu, setShowMenu] = React.useState(false);
  const [showRemoveButton, setShowRemoveButton] = React.useState(false);
  const [showAddButton, setShowAddButton] = React.useState(false);

  const [info, setInfo] = React.useState<ClickInfo>();

  React.useEffect(()=>{
    setShowMenu(false);
  }, [value])

  const handleChange = (value: Value) => {
    var hasIntersection = false;

    // check if there is an intersection of spans within a day
    Object.keys(value).forEach(key=>{
      const spans = value[key as keyof Value];
      if(hasIntersectionFn(spans)) hasIntersection = true;
    })
    if(!hasIntersection) {
      setValue(value);
      if(onChange) onChange(value)
    }
  }

  const handleClick: WTSProps['onClick'] = (e, info) => {
    if(propsValue && !onChange) return;

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

  const childrenWithProps = React.Children.map(children, child=>{
    if(React.isValidElement(child)) {
      return React.cloneElement(child, {
        value: propsValue || value, 
        onChange: handleChange, onClick: handleClick
      })
    }
    return child;
  })

  return (
    <>
      {childrenWithProps}
      { showMenu && <div style={{ position: 'absolute', zIndex: 2, ...menuPosition}}>
          { showAddButton && <button onClick={handleAddSpan}>Add Segment</button> }
          { showRemoveButton && <button onClick={handleRemoveSpan}>Remove Segment</button> }
          <button onClick={()=>setShowMenu(false)}>X</button>
        </div>}
    </>
  )
}