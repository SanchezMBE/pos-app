import express from "express";
import { PORT } from "./config.js";
import { corsMiddleware } from "./src/middlewares/corsMiddleware.js";
import cookieParser from "cookie-parser";

import authRoutes from "./src/routes/auth.js";
import adminArticleRoutes from "./src/routes/admin/article.js";
import adminCategoryRoutes from "./src/routes/admin/category.js";
import adminSaleRoutes from "./src/routes/admin/sale.js";
import adminProfileRoutes from "./src/routes/admin/profile.js";
import adminUserRoutes from "./src/routes/admin/user.js";

import cashierArticleRoutes from "./src/routes/cashier/article.js";
import cashierSaleRoutes from "./src/routes/cashier/sale.js";

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
app.use("/api/admin/profile", adminProfileRoutes);
app.use("/api/admin/users", adminUserRoutes);

app.use("/api/cashier/articles", cashierArticleRoutes);
app.use("/api/cashier/sales", cashierSaleRoutes);

const port = PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
