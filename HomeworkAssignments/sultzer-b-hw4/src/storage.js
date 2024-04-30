// Overview: HW-4
// Author: Ben Sultzer <bms3902@rit.edu>

// A private (to this module) unique name to store the app data under
// If you put this on banjo, change `abc1234` to your banjo account name
const storeName = "bms3902-park-favorites";

// Loads in a string from localStorage
// Parameters: None
// Returns: A JSON object representing the items in localStorage.
// Returns an empty object if the original string is empty 
// or otherwise not "parseable"
const loadJSONFromLocalStorage = () => {
  // Try to get the localStorage data
  const string = localStorage.getItem(storeName);

  // Try to extract the JSON
  let json;
  try{
    json = JSON.parse(string);
    if(!json) throw new Error();
  // Print an error to the console if there is a problem
  }catch(error){
    console.log("Nothing to load from localStorage!");
    json = {};
  }

  // Return the result
  return json;
};

// Stores data in localStorage in key-value pairs contained in a JSON
// object
// "key" parameter: The JSON key of the value to be stored
// "value" parameter: The value to store
// Returns: Nothing
export const writeToLocalStorage = (key, value) => {
  console.log(`Calling writeToLocalStorage(${key},${value})`);

  // Get the localStorage JSON, store the new value, then write the JSON back to localStorage
  const json = loadJSONFromLocalStorage();
  json[key] = value;
  localStorage.setItem(storeName, JSON.stringify(json));
};

// Loads a value from the localStorage JSON object at the given key
// "key" parameter: The key of the value to retrieve
// Returns: The value at the given key
export const readFromLocalStorage = (key) => {
  // Get the localStorage JSON and return the value at the given key
  const json = loadJSONFromLocalStorage();
  console.log(`Calling readFromLocalStorage(${key}) with value=${json[key]}`);
  return json[key];
}
