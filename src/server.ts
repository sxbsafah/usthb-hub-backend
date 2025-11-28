import express from "express";
import config from "@/config/index";
import cors from "cors";
import rateLimit from "express-rate-limit";
import router from "@/routes/index";
import helmet from "helmet";
import { connectToDatabase, disconnectFromDatabase } from "./lib/mongoose";


const app = express();

app.use(rateLimit({
  windowMs: 60000,
  limit: 60,
  legacyHeaders: false,
  standardHeaders: true,
  message: {
    error: "Too many requests, please try again later.",
  }
}))


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || config.NODE_ENV === "development" || config.WHITELIST_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Cors Error: ${origin} is not allowed by CORS`), false)
    }
  }
}));

app.use(helmet());

app.use(express.json());

app.use(router);

(async () => {
  try {
    app.listen(config.PORT, async () => {
      await connectToDatabase();
      console.log(`Server is running on http://localhost:${config.PORT}`);
    })
  } catch (err) {
    console.log("Failed starting the server ", err);
    process.exit(1);
  }
})()


const handleServerShutDown = async () => {
  try {
    await disconnectFromDatabase();
    console.log("Shutting down server...");
    process.exit(0);
  } catch (err) {
    console.error("Error during server shutdown:", err);
    process.exit(1);
  }
}


process.on("SIGTERM", handleServerShutDown);
process.on("SIGINT", handleServerShutDown);

