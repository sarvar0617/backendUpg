import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import catalogRoutes from "./routes/catalog.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { adminAuth } from "./middleware/adminAuth.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get("/api/v1/health", (_req, res) => {
  res.json({
    success: true,
    message: "UPG API is running",
  });
});

app.use("/api/v1", catalogRoutes);
app.use("/api/v1/admin", adminAuth, adminRoutes);

app.use(errorHandler);

export default app;
