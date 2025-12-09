// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hours = Array.from({ length: 14 }, (_, i) => `${6 + i}:00`); // Hours from 6 AM to 8 PM

let currentDate = new Date(); // Start with today's date

// Helper function to get the start of the current week (Monday)
const getStartOfWeek = (date) => {
  const day = date.getDay(),
        diff = date.getDate() - day + (day == 0 ? -6 : 1); // Adjust so Monday is the first day
  return new Date(date.setDate(diff));
}

// Helper function to format date as "Week of [Date]"
const formatWeekTitle = (date) => {
  const startOfWeek = getStartOfWeek(new Date(date));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return `Week of ${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
};

// Helper function to render the calendar
const renderCalendar = (startDate) => {
  const weekStart = getStartOfWeek(new Date(startDate));
  const weekTitle = formatWeekTitle(weekStart);

  // Update week title
  document.getElementById('current-week').innerText = `Week of: ${weekTitle}`;

  // Clear existing calendar content
  const calendarContainer = document.getElementById('calendar');
  calendarContainer.innerHTML = '';

  // Render the calendar grid
  daysOfWeek.forEach((day, index) => {
    const dayColumn = document.createElement('div');
    dayColumn.classList.add('day-column');

    const currentDay = new Date(weekStart);
    currentDay.setDate(weekStart.getDate() + index);

    // Render time slots for each day
    hours.forEach((hour) => {
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

// Navigate to the previous week
document.getElementById('prev-week-btn').addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() - 7);
  renderCalendar(currentDate);
});

// Navigate to the next week
document.getElementById('next-week-btn').addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() + 7);
  renderCalendar(currentDate);
});

// Save notes to Firestore
document.getElementById('save-btn').addEventListener('click', () => {
  const notes = [];
  document.querySelectorAll('.note-area').forEach(area => {
    notes.push(area.innerText);
  });

  db.collection('weeklyNotes').add({
    notes: notes,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  })
  .then(() => {
    alert('Notes saved!');
  })
  .catch((error) => {
    console.error('Error saving notes: ', error);
  });
});

// Load the initial calendar
window.onload = () => renderCalendar(currentDate);
