import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { handleFetchReminders, handleFetchCompanyReminders, toggleCompleteReminder, handleDeleteReminder } from '../api/reminder-api';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Calendar = () => {
  const { user } = useAuth0();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAllReminders = async () => {
      if (user) {
        const personalReminders = await handleFetchReminders(user.sub);
        const companyReminders = await handleFetchCompanyReminders(user.sub);
        
        // Convert reminders to calendar events
        const personalEvents = personalReminders.map(reminder => ({
          id: reminder.id,
          title: reminder.title,
          start: new Date(reminder.date),
          end: new Date(reminder.date),
          description: reminder.description,
          completed: reminder.completed,
          type: 'personal',
          allDay: true,
          reminder: reminder // Store the original reminder data
        }));

        const companyEvents = companyReminders.map(reminder => ({
          id: reminder.id,
          title: reminder.title,
          start: new Date(reminder.date),
          end: new Date(reminder.date),
          description: reminder.description,
          completed: reminder.completed,
          type: 'company',
          allDay: true,
          reminder: reminder // Store the original reminder data
        }));

        setEvents([...personalEvents, ...companyEvents]);
      }
    };

    fetchAllReminders();
  }, [user]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCompleteToggle = async (event) => {
    try {
      await toggleCompleteReminder(event.reminder);
      setEvents(events.map(e => 
        e.id === event.id 
          ? { ...e, completed: !e.completed }
          : e
      ));
      setShowModal(false);
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  const handleDeleteEvent = async (event) => {
    try {
      await handleDeleteReminder(event.id);
      setEvents(events.filter(e => e.id !== event.id));
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  // Custom event styling
  const eventStyleGetter = (event) => {
    let backgroundColor = event.type === 'personal' ? '#8B5CF6' : '#6366F1'; // Purple for personal, Indigo for company
    
    if (event.completed) {
      backgroundColor = '#10B981'; // Green for completed
    } else if (new Date(event.start) < new Date()) {
      backgroundColor = '#EF4444'; // Red for overdue
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: event.completed ? 0.7 : 1,
        color: 'white',
        border: 'none',
        display: 'block',
        textDecoration: event.completed ? 'line-through' : 'none'
      }
    };
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h3 className="text-gray-700 text-3xl font-medium mb-4">Calendar</h3>
      
      <div className="bg-white rounded-lg shadow-md p-6" style={{ height: '700px' }}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleEventClick}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day']}
          defaultView="month"
        />
      </div>

      {/* Event Details Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">
                {selectedEvent.title}
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  selectedEvent.type === 'personal' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {selectedEvent.type}
                </span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600">{selectedEvent.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Due: {format(selectedEvent.start, 'PPP')}
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleCompleteToggle(selectedEvent)}
                className={`px-4 py-2 rounded text-white ${
                  selectedEvent.completed
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {selectedEvent.completed ? 'Completed' : 'Complete'}
              </button>
              <button
                onClick={() => handleDeleteEvent(selectedEvent)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar; 