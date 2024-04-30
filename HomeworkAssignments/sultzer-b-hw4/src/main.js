// Overview: HW-4
// Author: Ben Sultzer <bms3902@rit.edu>

// Import the map, JSON loading, localStorage, and Firebase functionality
import * as map from "./map.js";
import * as ajax from "./ajax.js";
import * as storage from "./storage.js";
import * as database from "./parks-viewer.js";

// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];
let geojson; // Stores location data for placing on the map
let favoriteIds = []; // The array of the ID's of the user's favorite NYS parks
let currentParkID; // Stores the ID of the park last selected by the user
let markerWasClicked = false; // Tracks whether or not a marker was clicked to differentiate between clicking a marker
					  		  // and the empty space of the map (for hiding NYS park data when a marker leaves focus)

// II. Functions
// Checks to see if the currently selected NYS park is in the favorites list
// "id" parameter: The ID of the NYS park to check
// Returns: A Boolean corresponding to whether or not the currently selected NYS park
// is in the favorites list
const parkInFavList = (id) => {
	// Go through the list of favorites
	for (let i = 0; i < favoriteIds.length; i++) {
		if (favoriteIds[i] == id) {
			// Indicate the currently selected NYS park was found
			return true;
		}
	}

	// Indicate the currently selected NYS park was not found
	return false;
};

// Removes a favorite NYS park from the user's list of favorites
// "id" parameter: The ID of the NYS park to remove
// Returns: Nothing
const deleteFavorite = (id) => {
	// Copy over the current list of favorite NYS parks and skip the element with an ID
	// that corresponds to the NYS park to remove
	let tempFavoriteIds = [];
	for (let i = 0; i < favoriteIds.length; i++) {
		if (favoriteIds[i] != id) {
			tempFavoriteIds.push(favoriteIds[i]);
		}
	}

	// Copy the new list back to the original
	favoriteIds = tempFavoriteIds;

	// Rebuild the HTML list of favorites
	refreshFavorites();

	// Enable the "Add To Favorites" button and disable the "Remove From Favorites" button
	document.querySelector("#add-to-fav").disabled = false;
	document.querySelector("#remove-from-fav").disabled = true;

	// Write the new list of favorited NYS parks to local storage with the un-favorited park removed
	storage.writeToLocalStorage("favorites", favoriteIds);

	// Remove one like from the entry in the database of the current NYS park, or delete the entry entirely if the number of likes reaches 0
	// (handled in database module)
	database.writeParkData(currentParkID, "remove");
};

// Adds a NYS park to the user's list of favorites
// "id" parameter: The ID of the NYS park to add
// Returns: Nothing
const addToFavorites = (id) => {
	// Get the current NYS park
	const park = getFeatureById(id);

	// If the NYS park is a new favorite, add it to the list
	favoriteIds.push(id);

	// Rebuild the HTML list of favorites
	refreshFavorites();

	// Disable the "Add To Favorites" button and enable the "Remove From Favorites" button
	document.querySelector("#add-to-fav").disabled = true;
	document.querySelector("#remove-from-fav").disabled = false;

	// Add the favorited NYS park to local storage
	storage.writeToLocalStorage("favorites", favoriteIds);

	// Indicate that the current park has been added to the favorites list
	database.setIsInDatabase(currentParkID, true);

	// Write one like to the entry in the database of the current NYS park, or create a new entry
	database.writeParkData(currentParkID, "add");	
};

// Creates a new favorites list element to add to the list
// "id" parameter: The ID of the NYS park for which to create the element
// Returns: The new favorites list element
const createFavoriteElement = (id) => {
	// Create the favorites list element
	const feature = getFeatureById(id);
	const a = document.createElement("a");

	// Fill out its members
	a.className = "panel-block";
	a.id = feature.id;
	a.onclick = () => {
		showFeatureDetails(a.id);
		map.setZoomLevel(6);
		map.flyTo(feature.geometry.coordinates);
	};
	a.innerHTML = `
		<span class="panel-icon">
			<i class="fas fa-map-pin"></i>
		</span>
		${feature.properties.title}
	`;

	// Return the result
	return a;
};

// Makes sure the user's favorite NYS parks appear in the Favorites panel
// Parameters: None
// Returns: Nothing
const refreshFavorites = () => {
	// Get the favorites list element
	const favoritesContainer = document.querySelector("#favorites-list");

	// Clear the favorites list element
	favoritesContainer.innerHTML = "";

	// Go through the set of favorites and build the HTML to display the current favorites list
	for (const id of favoriteIds) {
		favoritesContainer.appendChild(createFavoriteElement(id));
	};
};

// Hooks up the various UI elements of the NY State Park Buddy app
// Parameters: None
// Returns: Nothing
const setupUI = () => {
	// Button for setting map to NYS at Zoom 5.2
	document.querySelector("#btn-1").onclick = () => {
		map.setZoomLevel(5.2);
		map.setPitchAndBearing(0, 0);
		map.flyTo(lnglatNYS);
	};

	// Button for setting map to NYS in an isometric view
	document.querySelector("#btn-2").onclick = () => {
		map.setZoomLevel(5.5);
		map.setPitchAndBearing(45, 0);
		map.flyTo(lnglatNYS);
	};

	// Button for setting map to the USA at Zoom 3
	document.querySelector("#btn-3").onclick = () => {
		map.setZoomLevel(3);
		map.setPitchAndBearing(0, 0);
		map.flyTo(lnglatUSA);
	};

	// Initialize the favorites list
	refreshFavorites();
};

// Searches through the GeoJSON data and retrieves the NYS park object that corresponds with the passed in ID
// "id" parameter: The ID of the NYS park to search for
// Returns: The NYS park object that corresponds to the ID
const getFeatureById = (id) => {
	// The NYS park to return if a match is found
	let targetNYSPark = undefined;

	// Attempt to find the NYS park with a matching ID
	for (let i = 0; i < geojson.features.length; i++) {
		if (geojson.features[i].id == id) {
			targetNYSPark = geojson.features[i]; // The matching NYS park has been found
		}
	}

	// Return the results of the search
	return targetNYSPark;
};

// Displays the details of a NYS park in the "Info" section of the page when that NYS park is clicked
// "id" parameter: The NYS park's GeoJSON ID number
// Returns: Nothing
const showFeatureDetails = (id) => {
	// Indicate that a marker was clicked
	markerWasClicked = true;

	console.log(`showFeatureDetails - id=${id}`);

	// Store the currently selected NYS park
	currentParkID = id;

	// Gets the NYS park feature
	const feature = getFeatureById(id);

	// Displays the NYS park's title
	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;

	// Displays the NYS park's address, phone number, and website. Also, display the "Add To Favorites" and "Remove From Favorites" buttons for this
	// NYS park
	document.querySelector("#details-2").innerHTML = `
		<p><b>Address: </b>${feature.properties.address}</p>
		<p><b>Phone: </b><a href="tel:+${feature.properties.phone}">${feature.properties.phone}</a></p>
		<p><b>Website: </b><a href="${feature.properties.url}">${feature.properties.url}</a></p>
		<button id="add-to-fav" class="button has-background-success has-text-primary-invert mt-1">Add To Favorites</button><button id="remove-from-fav" class="button has-background-danger has-text-danger-invert ml-1 mt-1">Remove From Favorites</button>
	`;

	// "Add To Favorites" button
	document.querySelector("#add-to-fav").onclick = () => {
		addToFavorites(currentParkID);
	}

	// "Remove From Favorites" button
	document.querySelector("#remove-from-fav").onclick = () => {
		deleteFavorite(currentParkID);
	}

	// Displays a description of the NYS park
	document.querySelector("#details-3").innerHTML = `${feature.properties.description}`;

	// Set the "disabled" property of the "Add To Favorites" and "Remove From Favorites" buttons so their disabled states persist across selections
	// of parks from the map or from the favorites list (showFeatureDetails() is called for both types of selections)
	if (parkInFavList(currentParkID)) {
		document.querySelector("#add-to-fav").disabled = true;
		document.querySelector("#remove-from-fav").disabled = false;
	} else {
		document.querySelector("#add-to-fav").disabled = false;
		document.querySelector("#remove-from-fav").disabled = true;
	}
};

// Sets up the map, loads GeoJSON data, and prepares the UI
// Parameters: None
// Returns: Nothing
const init = () => {
	// Create the map
	map.initMap(lnglatNYS);

	// Get the GeoJSON data
	ajax.downloadFile("data/parks.geojson", (str) => {
		geojson = JSON.parse(str);
		console.log(geojson);
		map.addMarkersToMap(geojson, showFeatureDetails); // Set up the map
		setupUI(); // Set up the app's UI
	});

	// Load in potential favorites from localStorage
	let parkLocalStorageData = storage.readFromLocalStorage("favorites");

	// Only assign the park data from localStorage to the favorite IDs array if favorite park IDs data exists in localStorage
	if (parkLocalStorageData != undefined) {
		favoriteIds = parkLocalStorageData;
	}

	// Set up an event handler so that when the map is clicked anywhere that isn't a marker, data for the currently selected
	// NYS park disappears
	document.querySelector("#map").onclick = () => {
		if (!markerWasClicked) {
			document.querySelector("#details-1").innerHTML = "Info";
			document.querySelector("#details-2").innerHTML = "Click on a park to learn about it.";
			document.querySelector("#details-3").innerHTML = "???";
		}

		// Marker "click" event handler executes first, so sets click tracker to true, then this event handler receives that value.
		// Setting the tracker value to false after clicking in either case ensures marker clicks are treated as unique and all
		// other clicks are treated as regular map clicks
		markerWasClicked = false;
	};
};

// Start up the app
init();