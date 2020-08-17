const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

/* connection to the DB */

mongoose.connect(
  `mongodb+srv://userAdmin:Zertodata1!@cluster0-v9e6h.azure.mongodb.net/<dbname>?retryWrites=true&w=majority`,
  //`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0-v9e6h.azure.mongodb.net/guides?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected!");
});

// import routes

const guidesRoutes = require("./api/routes/guides");
const userRoutes = require("./api/routes/users");

app.get('/', (req,res) => {
  res.send("server-side");
})
app.use("/guides", guidesRoutes);
app.use("/users", userRoutes);

app.use("/uploads", express.static("uploads"));

//Middleware
app.use((res, req, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // ACA to all;
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  //OPTION SEND B4 : PUT, POST, GET
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//Middleware for eror404
app.use((req, res, next) => {
  const error = new Error("Eror, Not found.");
  error.status = 404;
  next(404);
});

//Middleware for global errors
app.use((req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
