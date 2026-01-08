import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import { PORT, FRONTEND_URL } from "./config/env.js";
import connectToDB from "./database/mongodb.js";
import submissionRouter from "./routes/submission.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes"
});

app.use(helmet());
app.use(mongoSanitize());
app.use(limiter);
const allowedOrigins = [FRONTEND_URL, 'https://ntcogk-submissions.vercel.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/v1/submissions", submissionRouter);

app.get("/", (req, res)=>{
  res.send({
    title: "The NTCOGK Backend API",
    body: "Welcome to the NTCOGK backend API!"
  })
});

app.use(errorMiddleware);

app.listen(PORT, async ()=>{
  console.log(`The NTCOGK backend API is running on http://localhost:${PORT}`);
  await connectToDB();
});

export default app;