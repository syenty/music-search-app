import "dotenv/config";
import express from "express";
import cors from "cors";
import spotifyRoutes from "./routes/spotify.js";

const app = express();
const PORT = process.env.PORT || 3001;

// CORS 설정
app.use(cors({ origin: "http://localhost:5173" })); // 클라이언트 주소 허용

app.use(express.json());

// 모든 /api 요청을 spotifyRoutes로 전달
app.use("/api", spotifyRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
