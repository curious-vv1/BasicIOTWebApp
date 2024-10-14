import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';




// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function LEDControl() {
    const [ledState, setLedState] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const ledStateRef = ref(database, 'led_state');
      const unsubscribe = onValue(ledStateRef, (snapshot) => {
        const data = snapshot.val();
        setLedState(data);
        setIsLoading(false);
      }, (error) => {
        setError("Failed to fetch LED state: " + error.message);
        setIsLoading(false);
      });
  
      // Cleanup function
      return () => unsubscribe();
    }, []);
  
    const toggleLED = async () => {
      setIsLoading(true);
      try {
        const newState = !ledState;
        await set(ref(database, 'led_state'), newState);
        setLedState(newState);
        console.log(newState);
      } catch (error) {
        setError("Failed to update LED state: " + error.message);
      } finally {
        setIsLoading(false);
      }

    };
  
    if (isLoading) {
      return <div className="text-center mt-8">Loading...</div>;
    }
  
    if (error) {
      return <div className="text-center mt-8 text-red-500">{error}</div>;
    }
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">LED Control</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="mb-4">
            LED is currently: <span className="font-bold">{ledState ? 'ON' : 'OFF'}</span>
          </p>
          <button
            onClick={toggleLED}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-white ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' :
              ledState ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isLoading ? 'Updating...' : `Turn LED ${ledState ? 'OFF' : 'ON'}`}
          </button>
        </div>
      </div>
    );
  }