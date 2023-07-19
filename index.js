const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ["https://jwtbackend-6f5c.onrender.com", "http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

app.use("/", authRoutes);

mongoose
  .connect(
    "mongodb+srv://Saurabhrauthan:F6twlIsmfV18eEjc@cluster0.jdgmyku.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database Connected");
    });
  });
