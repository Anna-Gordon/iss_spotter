/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');
const fetchMyIP = function(callback) {

  request('https://api.ipify.org/?format=json', (error, response, body) => {
    
    if (error) {
      return callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      body = JSON.parse(body);
      return callback(null, body.ip);
    }


  });
};

const fetchCoordsByIP = function(ip, callback) {

  request(`https://ipvigilante.com/${ip}`, (error, response, body) => {
    let coords = {};
    
    if (error) {
      return callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      let dataObj = JSON.parse(body);
      body = JSON.parse(body);
      coords.latitude = dataObj.data.latitude;
      coords.longitude = dataObj.data.longitude;
      return callback(null, coords);
    }

  });

};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {

  let lat = coords.latitude;
  let lon = coords.longitude;

  let url = `http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`;
  request(url, (error, response, body) => {
    
    if (error) {
      callback(error, null);
      return;
    }
    
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};


const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error){
      callback(error, null);
      return;
    }

      fetchCoordsByIP(ip, (error, coords) => {
        if (error){
          callback(error, null);
          return;
        }

          fetchISSFlyOverTimes(coords, (error, passes) => {
            if (error){
              callback(error, null);
              return;
            } else {
              callback(null, passes);  
            }         
          });
 
      });
  
  });
}

module.exports = { nextISSTimesForMyLocation };
// fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, 