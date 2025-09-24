import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Проксируем все /api запросы
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://109.73.206.144:6969",
    changeOrigin: true,
    secure: false,
  })
);

// Раздаём статические файлы из dist
app.use(express.static(path.join(__dirname, "dist")));

// Для Vue SPA — всегда index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
