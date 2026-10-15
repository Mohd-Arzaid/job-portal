import express from "express";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
const app = express();

import "dotenv/config";

const PORT = process.env.PORT || 3000;

// middleware
// middleware is a function that executes between request and response , it can inspect the request , modify it and pass the control to the next handler function if needed using next()

// express.json parse the incoming request using JSON payload and makes the parsed data availabe in req.body
app.use(express.json());

// cookie-parser middleware

// cookie-parser reads the cookies sent by the client
// and makes them accessible through req.cookies
app.use(cookieParser());

import userRoute from "./routes/user.route.js";

// API's
app.use("/api/v1/user", userRoute);

app.listen(PORT, () => {
  connectDb();
  console.log(`Server is running on PORT ${PORT}`);
});
