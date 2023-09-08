const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const HttpError = require("./models/http-error");
const usersRoutes = require("./routes/users-routes");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not be found", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error has occured!" });
});

mongoose
  .connect(
    "mongodb+srv://nadtin:mLPyRA83gIRtCZeU@cluster0.4ayxkvc.mongodb.net/places?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
    console.log("Connected to MongoDB Atlas and the backend server is up!");
  })
  .catch((err) => {
    console.log(err);
  });
