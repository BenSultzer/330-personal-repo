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


// II. Functions
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
}

// Searches through the GeoJSON data and retrieves the POI object that corresponds with the passed in ID
// "id" parameter: The ID of the POI to search for
// Returns: The POI object that corresponds to the ID
const getFeatureById = (id) => {
	// The POI to return when it is found
	let targetPOI = undefined;

	// Attempt to find the POI with the correct ID
	for (let i = 0; i < geojson.features.length; i++) {
		if (geojson.features[i].id == id) {
			targetPOI = geojson.features[i];
		}
	}

	// Return the results of the search
	return targetPOI;
};

// Displays the details of a Point of Interest (POI) in the "Info" section of the page when that POI is clicked
// "id" parameter: The POI's GeoJSON ID number
// Returns: Nothing
const showFeatureDetails = (id) => {
	console.log(`showFeatureDetails - id=${id}`);
	const feature = getFeatureById(id);
	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;
	document.querySelector("#details-2").innerHTML = `
		<b>Address: </b>${feature.properties.address}<br>
		<b>Phone: </b><a href="tel:+${feature.properties.phone}">${feature.properties.phone}</a><br>
		<b>Website: </b><a href="${feature.properties.url}">${feature.properties.url}</a>
	`;
};

// Sets up the map, loads GeoJSON data, and prepares the UI
// Parameters: None
// Returns: Nothing
const init = () => {
	map.initMap(lnglatNYS);
	ajax.downloadFile("data/parks.geojson", (str) => {
		geojson = JSON.parse(str);
		console.log(geojson);
		map.addMarkersToMap(geojson, showFeatureDetails);
		setupUI();
	});
};

// Start up the app
init();