import { useMemo, useEffect, useState } from "react";
import { loadXHR } from "./ajax";
import { readFromLocalStorage, writeToLocalStorage } from "./storage";
import './App.css'
import Footer from "./Footer";

// app "globals" and utils
const baseurl = "https://www.amiiboapi.com/api/amiibo/?name=";

// call searchAmiibo() with "mario" and our callback function
// searchAmiibo("kirby", parseAmiiboResult);

const App = () => {
  const savedTerm = useMemo(() => readFromLocalStorage("term") || "", []);
  const [term, setTerm] = useState(savedTerm);
  const [results, setResults] = useState([]);
  useEffect(() => {
    writeToLocalStorage("term", term);
  }, [term]);

  const parseAmiiboResult = xhr => {
    // get the `.responseText` string
    const string = xhr.responseText;

    // declare a json variable
    let json;

    // try to parse the string into a json object
    try {
      json = JSON.parse(string);
    } catch (error) {
      console.error(error);
    }

    // log out number of results (length of `json.amiibo`)
    console.log(`Number of results=${json.amiibo.length}`);

    // loop through `json.amiibo` and log out the character name
    for (const amiibo of json.amiibo) {
      console.log(amiibo.character);
    }

    setResults(json.amiibo);
  };

  const searchAmiibo = (name, callback) => {
    loadXHR(`${baseurl}${name}`, callback);
  };

  return <>
    <header>
      <h1>Amiibo Finder</h1>
    </header>
    <hr />
    <main>
      <button onClick={() => { searchAmiibo(term, parseAmiiboResult) }}>Search</button>
      <label>
        Name:
        <input value={term} onChange={e => setTerm(e.target.value.trim())} />
      </label>
      {results.map(amiibo => (
        <span key={amiibo.head + amiibo.tail} style={{ color: "green" }}>
          <h4>{amiibo.name}</h4>
          <img
            width="100"
            alt={amiibo.character}
            src={amiibo.image}
          />
        </span>
      ))}
    </main>
    <hr />
    <Footer
      name="Ben Sultzer"
      year={new Date().getFullYear()}
    />
  </>;
};

export default App;