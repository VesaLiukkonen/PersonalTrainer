import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function MyCalendar(props) {
  return (
    <div>
      <Calendar
        localizer={localizer}
        events={props.events}
        startAccessor={props.events.start}
        endAccessor={props.events.end}
        views={['month', 'week', 'day']}
        style={{ width: '100vh', height: '85vh' }}
      />
    </div>
  );
};