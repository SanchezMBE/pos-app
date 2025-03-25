import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import adminArticleRoutes from "./src/routes/admin/article.js";
// import casherArticleRoutes from "./routes/casher/articleRoutes.js";

dotenv.config();

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = ["http://localhost:5173"];

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  }),
);

app.use("/api/admin/articles", adminArticleRoutes);
// app.use("/api/cashers", casherArticleRoutes);

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
