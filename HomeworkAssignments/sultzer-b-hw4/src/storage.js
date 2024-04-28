// A private (to this module) unique name to store the app data under
// If you put this on banjo, change `abc1234` to your banjo account name
const storeName = "bms3902-park-favorites";

// Loads in a string from localStorage
// Parameters: None
// Returns: A JSON object representing the items in localStorage.
// Returns an empty object if the original string is empty 
// or otherwise not "parseable"
const loadJSONFromLocalStorage = () => {
  const string = localStorage.getItem(storeName);
  let json;
  try{
    json = JSON.parse(string);
    if(!json) throw new Error("json is null!");
  }catch(error){
    console.log(`ERROR: ${error} with string: ${string}`);
    json = {};
  }
  return json;
};

// Stores data in localStorage in key-value pairs contained in a JSON
// object
// "key" parameter: The JSON key of the value to be stored
// "value" parameter: The value to store
// Returns: Nothing
export const writeToLocalStorage = (key, value) => {
  console.log(`Calling writeToLocalStorage(${key},${value})`);
  const json = loadJSONFromLocalStorage();
  json[key] = value;
  localStorage.setItem(storeName, JSON.stringify(json));
};

// Loads a value from the localStorage JSON object at the given key
// "key" parameter: The key of the value to retrieve
// Returns: The value at the given key
export const readFromLocalStorage = (key) => {
  const json = loadJSONFromLocalStorage();
  console.log(`Calling readFromLocalStorage(${key}) with value=${json[key]}`);
  return json[key];
}
