import { getDay } from "date-fns";
import { parse, parseISO, format } from "date-fns";
import startOfWeek from "date-fns/startOfWeek";
import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import "./App1.css";
import Navbar from "./components/Navbar";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function App({ userId }) {
  const [newEvent, setNewEvent] = useState({
    title: "",
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    color: "",
  });
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userEventsCollection = collection(db, "events");
      const querySnapshot = await getDocs(
        query(userEventsCollection, where("userId", "==", userId))
      );
      const fetchedEvents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllEvents(fetchedEvents);
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);
  function handleAddEvent() {
    const { title, startDate, startTime, endDate, endTime, color } = newEvent;
  
    // Check if any of the date or time values are null
    if (!startDate || !startTime || !endDate || !endTime) {
      console.error("Invalid date or time values");
      return;
    }
  
    // Combine the date and time values into valid date objects
    const startDateTime = new Date(startDate);
    startDateTime.setHours(startTime.getHours());
    startDateTime.setMinutes(startTime.getMinutes());
  
    const endDateTime = new Date(endDate);
    endDateTime.setHours(endTime.getHours());
    endDateTime.setMinutes(endTime.getMinutes());
  
    const newEventObject = {
      title,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      color,
      userId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };
  
    addDoc(collection(db, "events"), newEventObject)
      .then(() => {
        // Update the allEvents state with the new event
        setAllEvents([...allEvents, newEventObject]);
  
        // Reset the newEvent state
        setNewEvent({
          title: "",
          startDate: null,
          startTime: null,
          endDate: null,
          endTime: null,
          color: "",
        });
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }
  
  
  

  return (
    <div className="App">
      <React.Fragment>
        <Navbar />
      </React.Fragment>
      <h1 style={{ textAlign: "left", marginLeft: "450px" }}>
        Welcome - {userId}
      </h1>

      <div className="calendar-container">
        <div className="calendar">
          <Calendar
            localizer={localizer}
            events={allEvents}
            startAccessor={(event) => new Date(event.start)}
            endAccessor={(event) => new Date(event.end)}
            style={{ height: 500 }}
            eventPropGetter={(event) => ({
              className: event.className,
              style: {
                backgroundColor: event.color,
              },
            })}
          />
        </div>
        <div className="new-event">
          <h2>Add New Event</h2>
          <div>
  <input
    type="text"
    placeholder="Add Title"
    style={{ width: "20%", marginRight: "10px" }}
    value={newEvent.title}
    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
  />
<div>
  <DatePicker
    placeholderText="Start Date"
    selected={newEvent.startDate}
    onChange={(date) => setNewEvent({ ...newEvent, startDate: date })}
  />
  <DatePicker
    placeholderText="Start Time"
    selected={newEvent.startTime}
    onChange={(time) => {
      const newTime = new Date();
      newTime.setHours(time.getHours());
      newTime.setMinutes(time.getMinutes());
      setNewEvent({ ...newEvent, startTime: newTime });
    }}
    showTimeSelect
    showTimeSelectOnly
    timeIntervals={15}
    timeCaption="Time"
    dateFormat="h:mm aa"
  />
</div>
<div>
  <DatePicker
    placeholderText="End Date"
    selected={newEvent.endDate}
    onChange={(date) => setNewEvent({ ...newEvent, endDate: date })}
  />
  <DatePicker
    placeholderText="End Time"
    selected={newEvent.endTime}
    onChange={(time) => {
      const newTime = new Date();
      newTime.setHours(time.getHours());
      newTime.setMinutes(time.getMinutes());
      setNewEvent({ ...newEvent, endTime: newTime });
    }}
    showTimeSelect
    showTimeSelectOnly
    timeIntervals={15}
    timeCaption="Time"
    dateFormat="h:mm aa"
  />
</div>

  <div>
    <label>Event type:</label>
    <select
      value={newEvent.color}
      onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
    >
      <option value="">Event type</option>
      <option value="#B94747">Important</option>
      <option value="#44BC44">Personal</option>
      <option value="#6656D3">Class related</option>
    </select>
  </div>
  <button style={{ marginTop: "10px" }} onClick={handleAddEvent}>
    Add Event
  </button>
</div>

    </div>
  </div>
  <div className="events-list">
    <h2>Events</h2>
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Start Date</th>
          <th>End Date</th>
        </tr>
      </thead>
      <tbody>
        {allEvents.map((event) => {
          let formattedStart = "";
          let formattedEnd = "";

          try {
            const parsedStart = parseISO(event.start);
            const parsedEnd = parseISO(event.end);
            formattedStart = format(parsedStart, "yyyy-MM-dd HH:mm");
            formattedEnd = format(parsedEnd, "yyyy-MM-dd HH:mm");
          } catch (error) {
            console.error("Error parsing time:", error);
          }

          return (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>
                {formattedStart ? formattedStart : "Invalid start time"}
              </td>
              <td>{formattedEnd ? formattedEnd : "Invalid end time"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>
);
}

export default App;
              
