import express from "express";
import mongoose from "mongoose";
import dotenv, { config } from "dotenv";
import userRoute from "./routes/user.route.js";
import gigRoute from "./routes/gig.route.js";
import orderRoute from "./routes/order.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";
import reviewRoute from "./routes/review.route.js";
import authRoute from "./routes/auth.route.js";
import adminRoute from "./routes/amin.route.js"
import jobRoute from "./routes/job.route.js"
import bidRouter from "./routes/bid.route.js"
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config()

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log(`Connected to mongoDB! ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
};

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/admin",adminRoute)
app.use("/api/jobs",jobRoute)
app.use("/api/bids",bidRouter)

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).send(errorMessage);
});

app.listen(process.env.PORT, () => {
  connect();
  console.log("Backend server is running!");
});