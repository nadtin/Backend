const axios = require("axios");
const HttpError = require("../models/http-error");

const API_KEY = "AIzaSyC0EPIFAZfzkvttRx3foMingEhIKOlX_zw";

async function getCoordsForAddress(address) {
  //If no API key available, use the below dummy return
  // return {
  //     lat: 27.1751448,
  //     lng: 78.0395673,
  //   };

  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAddress;
