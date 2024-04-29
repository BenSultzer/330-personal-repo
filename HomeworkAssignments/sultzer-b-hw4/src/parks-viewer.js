// Import Firebase functions from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, set, increment, push, onValue } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase web app configuration
const firebaseConfig = {
    apiKey: "AIzaSyDFVhTEqKBCZyiEO39WCZfnaGGtWicjUpg",
    authDomain: "hw-4-6dc07.firebaseapp.com",
    projectId: "hw-4-6dc07",
    storageBucket: "hw-4-6dc07.appspot.com",
    messagingSenderId: "288266161356",
    appId: "1:288266161356:web:521bc794731f5f31db4669"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Writes the number of likes for the given park to the database at node "parks/parkName"
// "parkName" parameter: The name of the park to write data for (and the name of the location
// within the "parks/" node to store the data)
// "likes" parameter: The number of times the given park has been favorited (the data to store in the
// database)
// "isInDatabase" parameter: A Boolean indicating whether or not the given park is already in the database
// Returns: Nothing
const writeParkData = (parkName, likes, isInDatabase) => {
    const db = getDatabase();
    if (!isInDatabase) {
        set(ref(db, "parks/" + parkName), {
            likes: likes
        });
    } else {
        set(ref(db, "parks/" + parkName), {
            likes: increment(1)
        });
    }
};

// Export the park data-writing function
export { writeParkData };