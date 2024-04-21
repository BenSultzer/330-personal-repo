// Overview: HW-4 - NYS Park Buddy - Starter
// Author: Ben Sultzer <bms3902@rit.edu>

// I. Variables & constants
// Key needed to access Mapbox
const accessToken = "pk.eyJ1IjoiY2F0b2dyYXBoZXIiLCJhIjoiY2x1ZzFucGE5MjdkdTJrbWZqaWI1ODNveSJ9.U2o3E6ioE1zRpGEmwF5-9Q";
// Map object
let map;

// An example of how our GeoJSON is formatted
// This will be replaced by the GeoJSON loaded from parks.geojson
let geojson = {
	type: "FeatureCollection",
	features: [{
		"type": "Feature",
		"id": "p79",
		"properties": {
			"title": "Letchworth State Park",
			"description": "Letchworth State Park, renowned as the \"Grand Canyon of the East,\".",
			"url": "https://parks.ny.gov/parks/letchworth",
			"address": "1 Letchworth State Park, Castile, NY 14427",
			"phone": "(585) 493-3600"
		},
		"geometry": {
			"coordinates": [
				-78.051170,
				42.570148
			],
			"type": "Point"
		}
	}]
};

// II. "private" - will not be exported
// Sets up the Mapbox instance
// "center" parameter: Location to focus on when the map is created
// Returns: Nothing
const initMap = (center) => {
	// Get the access token
	mapboxgl.accessToken = accessToken;

	// Create the map
	map = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/mapbox/light-v11",
		center: center,
		zoom: 5.2
	});

	// Add a zoom-in and zoom-out control (Plus/minus sign buttons)
	map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));
};

// Adds a marker to the map on a "Point of Interest" (POI)
// "feature" parameter: Contains info about the POI
// "className" parameter: The HTML class name for POIs (for CSS formatting)
// "clickHandler" parameter: Function to call if the marker is clicked
// Returns: Nothing
const addMarker = (feature, className, clickHandler) => {
	// A. Create a map marker using feature (i.e. "Park") data
	// - the marker is a <div>
	// - <div> className will be "poi" - see default-styles.css to see the details
	// - note that we give the <div> the id of the "feature"
	const el = document.createElement("div");
	el.className = className;
	el.id = feature.id;

	// B. This the HTML for the Popup
	const html = `
		<b>${feature.properties.title}</b>
		<p>${feature.properties.address}</p>
		<p><b>Phone: </b>${feature.properties.phone}</p>
	`;

	// C. Make the marker, add a popup, and add to map
	// https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker
	// https://docs.mapbox.com/mapbox-gl-js/api/markers/#popup
	const marker = new mapboxgl.Marker(el)
		.setLngLat(feature.geometry.coordinates)
		.setPopup(new mapboxgl.Popup({ offset: 10 })
			.setHTML(html))
		.addTo(map);

	// D. Call this method when marker is clicked on
	el.addEventListener("click", () => clickHandler(marker._element.id));
};


// III. "public" - will be exported


const flyTo = (center = [0, 0]) => {
	//https://docs.mapbox.com/mapbox-gl-js/api/#map#flyto
	map.flyTo({ center: center });
};

const setZoomLevel = (value = 0) => {
	// https://docs.mapbox.com/help/glossary/zoom-level/
	map.setZoom(value);
};

const setPitchAndBearing = (pitch = 0, bearing = 0) => {
	// https://docs.mapbox.com/mapbox-gl-js/example/live-update-feature/
	// https://docs.mapbox.com/mapbox-gl-js/example/set-perspective/
	map.setPitch(pitch);
	map.setBearing(bearing);
};

export { initMap, flyTo, setZoomLevel, setPitchAndBearing };