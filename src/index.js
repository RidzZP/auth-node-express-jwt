const express = require("express");
const app = express();
require("dotenv").config();
const cookieparser = require("cookie-parser");
const cors = require("cors");

const db = require("./config/database");
const userRoute = require("./routes/userRoute");

const port = process.env.PORT || 3000;

try {
  db.authenticate();
  console.log("Database Connected");
} catch (error) {
  console.log(error);
}

app.use(cors());
app.use(cookieparser());
app.use(express.json());

app.use("/users", userRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
