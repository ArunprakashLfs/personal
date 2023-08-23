import React, { useState, useEffect } from 'react';
import firebase, {db, auth} from '../Utils/firebase';

const BookingForm = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Fetch bookings from Firestore and set them in state
    const bookingsRef = db.collection('bookings');
    bookingsRef.onSnapshot(snapshot => {
      const bookingData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(bookingData);
    });
  }, []);

  useEffect(() => {
    // Calculate available time slots for the selected date
    // Here, you would implement your logic to filter booked slots
    // and determine available slots based on business rules
    const availableSlotsForDate = [];
    // ... Implement your logic here ...
    setAvailableSlots(availableSlotsForDate);
  }, [selectedDate, bookings]);

  const handleSlotClick = slotTime => {
    // Check if the user is signed in
    if (!user) {
      console.log('User not signed in');
      return;
    }

    // Check if the selected slot is available
    const isSlotAvailable = availableSlots.includes(slotTime);

    if (isSlotAvailable) {
      // Create a booking record in Firestore
      const bookingTime = new Date(selectedDate);
      bookingTime.setHours(slotTime.getHours(), slotTime.getMinutes(), 0);

      db.collection('bookings')
        .add({
          userId: user.uid,
          bookedTime: firebase.firestore.Timestamp.fromDate(bookingTime)
        })
        .then(() => {
          console.log('Booking successful');
        })
        .catch(error => {
          console.error('Error creating booking:', error);
        });
    } else {
      console.log('Selected slot is not available');
    }
  };

  return (
    <div>
      <h1>Booking Calendar</h1>
      {user ? (
        <div>
          <div>
            <h2>Select a Date</h2>
            <input
              type="date"
              value={selectedDate.toISOString().substr(0, 10)}
              onChange={e => setSelectedDate(new Date(e.target.value))}
            />
          </div>
          <div>
            <h2>Available Time Slots</h2>
            <ul>
              {availableSlots.map(slot => (
                <li
                  key={slot.getTime()}
                  onClick={() => handleSlotClick(slot)}
                  style={{ cursor: 'pointer' }}
                >
                  {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>Please sign in to book appointments.</p>
      )}
    </div>
  );
};

export default BookingForm;
