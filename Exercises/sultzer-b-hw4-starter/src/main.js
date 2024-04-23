// Overview: HW-4 - NYS Park Buddy - Starter
// Author: Ben Sultzer <bms3902@rit.edu>

// Import the map and JSON loading functionality
import * as map from "./map.js";
import * as ajax from "./ajax.js";

// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];
let geojson; // Stores location data for placing on the map
let favoriteIds = ["p20","p79","p180","p43"]; // The array of the ID's of the user's favorite NYS parks


// II. Functions
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
	// Go through the set of favorites and build the HTML to display the current favorites list
	const favoritesContainer = document.querySelector("#favorites-list");
	favoritesContainer.innerHTML = "";
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
}

// Searches through the GeoJSON data and retrieves the NYS park object that corresponds with the passed in ID
// "id" parameter: The ID of the NYS park to search for
// Returns: The NYS park object that corresponds to the ID
const getFeatureById = (id) => {
	// The NYS park to return if it is found
	let targetNYSPark = undefined;

	// Attempt to find the NYS park with a matching ID
	for (let i = 0; i < geojson.features.length; i++) {
		if (geojson.features[i].id == id) {
			targetNYSPark = geojson.features[i];
		}
	}

	// Return the results of the search
	return targetNYSPark;
};

// Displays the details of a NYS park in the "Info" section of the page when that NYS park is clicked
// "id" parameter: The NYS park's GeoJSON ID number
// Returns: Nothing
const showFeatureDetails = (id) => {
	console.log(`showFeatureDetails - id=${id}`);

	// Gets the feature
	const feature = getFeatureById(id);

	// Displays the NYS park's title
	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;

	// Displays the NYS park's address, phone number, and website
	document.querySelector("#details-2").innerHTML = `
		<p><b>Address: </b>${feature.properties.address}</p>
		<p><b>Phone: </b><a href="tel:+${feature.properties.phone}">${feature.properties.phone}</a></p>
		<p><b>Website: </b><a href="${feature.properties.url}">${feature.properties.url}</a></p>
	`;

	// Displays a description of the NYS park
	document.querySelector("#details-3").innerHTML = `${feature.properties.description}`;
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
};

// Start up the app
init();