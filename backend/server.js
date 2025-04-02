import express from "express";
import dotenv from "dotenv";
import { corsMiddleware } from "./src/middlewares/corsMiddleware.js";

import adminArticleRoutes from "./src/routes/admin/article.js";
import authRoutes from "./src/routes/auth.js";
// import casherArticleRoutes from "./routes/casher/articleRoutes.js";

dotenv.config();

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware());

app.use("/api", authRoutes);

app.use("/api/admin/articles", adminArticleRoutes);
// app.use("/api/cashers", casherArticleRoutes);

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
