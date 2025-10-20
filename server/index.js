import "dotenv/config";
import express from "express";
import cors from "cors";
import spotifyRoutes from "./routes/spotify.js";

const app = express();
const PORT = process.env.PORT || 3001;

// CORS 설정
app.use(cors({ origin: "http://localhost:5173" })); // 클라이언트 주소 허용

app.use(express.json());

// 기본 라우트
app.get("/", (req, res) => {
  res.send("Proxy Server is running!");
});

// API 프록시 라우트
app.use("/api/spotify", spotifyRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
