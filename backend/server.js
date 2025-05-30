import express from "express";
import { PORT } from "./config.js";
import { corsMiddleware } from "./src/middlewares/corsMiddleware.js";
import cookieParser from "cookie-parser";

import authRoutes from "./src/routes/auth.js";
import adminArticleRoutes from "./src/routes/admin/article.js";
import adminCategoryRoutes from "./src/routes/admin/category.js";
import adminSaleRoutes from "./src/routes/admin/sale.js";
// import casherArticleRoutes from "./routes/casher/articleRoutes.js";

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(corsMiddleware());

app.use("/api/auth", authRoutes);

app.use("/api/admin/articles", adminArticleRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/admin/sales", adminSaleRoutes);
// app.use("/api/cashers", casherArticleRoutes);

const port = PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
