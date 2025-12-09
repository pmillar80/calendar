const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`); // Create 24 hourly slots

const renderCalendar = () => {
  const weekDaysContainer = document.getElementById('week-days');
  const calendarContainer = document.getElementById('calendar');

  // Render days of the week
  daysOfWeek.forEach(day => {
    const dayElement = document.createElement('div');
    dayElement.classList.add('day');
    dayElement.innerText = day;
    weekDaysContainer.appendChild(dayElement);
  });

  // Render hourly slots for each day
  daysOfWeek.forEach((day, index) => {
    const dayColumn = document.createElement('div');
    dayColumn.classList.add('day-column');
    
    hours.forEach(hour => {
      const timeSlot = document.createElement('div');
      timeSlot.classList.add('time-slot');
      timeSlot.dataset.day = day;
      timeSlot.dataset.hour = hour;

      const noteArea = document.createElement('div');
      noteArea.classList.add('note-area');
      timeSlot.appendChild(noteArea);

      dayColumn.appendChild(timeSlot);
    });

    calendarContainer.appendChild(dayColumn);
  });
};

window.onload = renderCalendar;
