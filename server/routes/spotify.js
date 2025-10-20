import { Router } from "express";

const router = Router();

// 예: 음악 검색 라우트
// GET /api/spotify/search?q=...
router.get("/search", async (req, res) => {
  // TODO: Spotify API 토큰을 받고, 실제 검색 API를 호출하는 로직 구현
  const { q } = req.query;
  res.json({ message: `Searching for: ${q}` });
});

export default router;
