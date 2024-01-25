//"use strict"; NOT NEEDED! Modules run in strict mode by default

import { sortAscending, isNumeric } from "./utils.js";

// For keeping track of number of times each func is called
// this should be "private" to the file
// Not using, yet
const usageObj = {
  sortAsc: 0,
  sortDesc: 0,
  calcMean: 0
};

let inputField = document.querySelector("textarea");
let output = document.querySelector("#output");
let btnSortAsc = document.querySelector("#btn-sort-ascending");

const getDataFromField = () => {
  // split string into an array, and make the values numeric
  let values = inputField.value.trim().split(" ").map(n => +n);
  values = values.filter(n => isNumeric(n));
  return values;
};

const init = () => {
  // hook up UI
  inputField = document.querySelector("textarea");
  output = document.querySelector("#output");
  btnSortAsc = document.querySelector("#btn-sort-ascending");

  btnSortAsc.onclick = function(){
    let values = getDataFromField();
    if(values.length){
      values = sortAscending(values);
      output.innerHTML = values;
    }else{
      output.innerHTML = "No numberz found!";
    }
  };
};

//window.onload = init; NOT NEEDED! Modules defer by default and only load after the page has
init();



