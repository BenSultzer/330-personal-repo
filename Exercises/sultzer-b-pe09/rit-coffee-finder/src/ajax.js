// Uses Ajax to get map data
function downloadFile(url, callbackRef) {
    const xhr = new XMLHttpRequest();
    // 1. Set "onerror" handler
    xhr.onerror = (e) => console.log("error");

    // 2. Set "onload" handler
    xhr.onload = (e) => {
        const headers = e.target.getAllResponseHeaders();
        const jsonString = e.target.response;
        console.log(`headers = ${headers}`);
        console.log(`jsonString = ${jsonString}`);
        callbackRef(jsonString);
    }; // End xhr.onload

    // 3. Open the connection using the HTTP GET method
    xhr.open("GET", url);

    // 4. We could send request headers here if we wanted to
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader

    // 5. Finally, send the request
    xhr.send();
}

// Export the function for getting map data through Ajax
export { downloadFile };