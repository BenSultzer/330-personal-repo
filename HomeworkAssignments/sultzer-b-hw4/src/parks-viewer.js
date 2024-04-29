// Import Firebase functions from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, set, increment, push, onValue } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Stores whether or not each park already exists in the database
const isInDatabase = {
    "p79": false,
    "p20": false,
    "p180": false,
    "p35": false,
    "p118": false,
    "p142": false,
    "p62": false,
    "p84": false,
    "p43": false,
    "p200": false,
    "p112": false
};

// Acts as a look-up table for park names based on their IDs
const parks = {
    "p79": "Letchworth State Park",
    "p20": "Hamlin Beach State Park",
    "p180": "Brookhaven State Park",
    "p35": "Allan H. Treman State Marine Park",
    "p118": "Stony Brook State Park",
    "p142": "Watkins Glen State Park",
    "p62": "Taughannock Falls State Park",
    "p84": "Selkirk Shores State Park",
    "p43": "Chimney Bluffs State Park",
    "p200": "Shirley Chisholm State Park",
    "p112": "Saratoga Spa State Park"
};

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

// Get the database for use in getting references
const db = getDatabase();

// Writes the number of likes for the given park to the database at node "parks/parkName"
// "parkName" parameter: The name of the park to write data for (and the name of the location
// within the "parks/" node to store the data)
// "parkID" parameter: The ID of the park being written to the database
// "buttonClicked" parameter: Indicates if the "Add To Favorites" button or "Remove From Favorites" button was clicked
// (if the park is already in the database, increment its likes if the "Add To Favorites" button was clicked and decrement
// the park's likes if the "Remove From Favorites" button was clicked)
// Returns: Nothing
const writeParkData = (parkID, buttonClicked) => {
    if (!isInDatabase[parkID]) {
        set(ref(db, "parks/" + parkID), {
            likes: 1
        });
    } else {
        // Increment the park's likes in the database if the "Add To Favorites" button was clicked
        if (buttonClicked == "add") {
            set(ref(db, "parks/" + parkID), {
                likes: increment(1)
            });
            // Decrement the park's likes in the database if the "Remove From Favorites" button was clicked
        } else {
            set(ref(db, "parks/" + parkID), {
                likes: increment(-1)
            });
        }
    }
};

// Allows external code to indicate to the Firebase functionality if the current park is already in the 
// database
// "key" parameter: The ID of current park
// "value" parameter: The Boolean corresponding to whether or not the current park is in the database
// Returns: Nothing
const setIsInDatabase = (key, value) => {
    isInDatabase[key] = value;
}

// Displays parks and their likes in the favorite-parks-viewer page and removes them from the database
// if their likes reach 0
// "snapshot" parameter: The current state of the data at the "parks/" location sent by the onValue Firebase function
// Returns: Nothing
const likesChanged = (snapshot) => {
    // The list of parks and their likes as a string
    let parkLikes = "";

    snapshot.forEach(park => {
        // Get the key and data of the current park
        const childKey = park.key;
        const childData = park.val();

        // Build the ordered list element for each park with likes greater than 0
        if (childData.likes != 0) {
            parkLikes += `<li><strong>${parks[childKey]} (${childKey})</strong> - Likes: ${childData.likes}</li>`;
        // If the number of likes for the current park in the database is zero, remove it from the database by clearing its entry
        } else {
            set(ref(db, "parks/" + childKey), {});
        }
        
        // Log out the park key and data that was retrieved
        console.log(childKey, childData);
    });

    // Display the park likes data
    document.querySelector("#park-pop-list").innerHTML = parkLikes;
};

// Observe changes in the amount of likes for each park (see likesChanged above)
const parksRef = ref(db, "parks"); // Get a reference to the whole "parks/" location
onValue(parksRef, likesChanged);

// Export the park data-writing function
export { writeParkData, setIsInDatabase };