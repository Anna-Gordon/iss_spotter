const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned IP:' , ip);
});

/**
https://ipvigilante.com/json/invalidiphere
https://ipvigilante.com/162.245.144.188
 */

fetchCoordsByIP('162.245.144.188', (error, data) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned IP:' , data);
});

fetchISSFlyOverTimes({ latitude: '49.27670', longitude: '-123.13000' }, (error, data) => {

  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('The fly over times as an array of objects (null if error). Example: ', data);

});

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  passTimes.forEach( (pass, index) => {
    let date = new Date(pass["risetime"]).toString()
      console.log(`Next pass at ${date} for ${pass["duration"]} seconds!`);
  });

});
