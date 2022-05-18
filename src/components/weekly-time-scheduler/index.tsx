import { useState } from "react"
import DailyTimeScheduler, { OnClick, OnChange, ClickInfo as DTSClickInto } from "./daily-time-scheduler"
import './weekly-time-scheduler.scss'

// localizer dates are used to call toLocaleDateString, 
// to obtain the weekday in a localized context
const LocalizerDates = {
  Monday: new Date(2022, 7, 1),
  Tuesday: new Date(2022, 7, 2),
  Wednesday: new Date(2022, 7, 3),
  Thursday: new Date(2022, 7, 4),
  Friday: new Date(2022, 7, 5),
  Saturday: new Date(2022, 7, 6),
  Sunday: new Date(2022, 7, 7)
}

function getLocaleDayName(dayName: keyof typeof LocalizerDates) {
  return LocalizerDates[dayName].toLocaleDateString(undefined, { weekday: 'long' })
}

const today = new Date();
today.setHours(23);
today.setMinutes(30);
const today10MinsFromNow = new Date()
today10MinsFromNow.setTime(today.getTime() + (1000 * 60 * 10))

export type Value = {
  monday: [number, number][];
  tuesday: [number, number][];
  wednesday: [number, number][];
  thursday: [number, number][];
  friday: [number, number][];
  saturday: [number, number][];
  sunday: [number, number][];
}
export type ClickInfo = {
  day: Lowercase<keyof typeof LocalizerDates>
} & DTSClickInto;

export type Props = {
  value: Value
  onChange?: (value: Value) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>, info: ClickInfo) => void;
}

export default function WeeklyTimeScheduler(props: Props) {

  const handleChange = (day: Lowercase<keyof typeof LocalizerDates>) => {

    return function(times) {
      if(!props.value) return;
      const clone = Object.assign({}, props.value);
      clone[day] = times;
      props.onChange?.apply(null, [clone]);
    } as OnChange
  }

  const handleClick = (day: Lowercase<keyof typeof LocalizerDates>) => {
    return function(e, info) {
      if(props.onClick) props.onClick(e, { day, ...info });
    } as OnClick
  }

  return (
    <div className="weekly-scheduler">
      <div>
        <div className="header">
          <div className="spacer"></div>
          <div className="times">
            <div className="time-12-am">12 AM</div>
            <div className="time-4-am">4 AM</div>
            <div className="time-8-am">8 AM</div>
            <div className="time-12-pm">12 PM</div>
            <div className="time-4-pm">4 PM</div>
            <div className="time-8-pm">8 PM</div>
            <div className="time-12-am-last">12 AM</div>
          </div>
        </div>
      </div>
      <DailyTimeScheduler label={getLocaleDayName("Monday")} value={props.value?.monday} onChange={handleChange('monday')} onClick={handleClick('monday')}/>
      <DailyTimeScheduler label={getLocaleDayName("Tuesday")} value={props.value?.tuesday} onChange={handleChange('tuesday')} onClick={handleClick('tuesday')} />
      <DailyTimeScheduler label={getLocaleDayName("Wednesday")} value={props.value?.wednesday} onChange={handleChange('wednesday')} onClick={handleClick('wednesday')} />
      <DailyTimeScheduler label={getLocaleDayName("Thursday")} value={props.value?.thursday} onChange={handleChange('thursday')} onClick={handleClick('thursday')} />
      <DailyTimeScheduler label={getLocaleDayName("Friday")} value={props.value?.friday} onChange={handleChange('friday')} onClick={handleClick('friday')} />
      <DailyTimeScheduler label={getLocaleDayName("Saturday")} value={props.value?.saturday} onChange={handleChange('saturday')} onClick={handleClick('saturday')} />
      <DailyTimeScheduler label={getLocaleDayName("Sunday")} value={props.value?.sunday} onChange={handleChange('sunday')} onClick={handleClick('sunday')} />
    </div>
  )
}