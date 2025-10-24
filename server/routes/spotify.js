import { Router } from "express";
import { spotifyProxy } from "../proxy.js";

const router = Router();

// 검색 라우트 (GET /api/search?q=...)
router.get("/search", async (req, res) => {
  try {
    const upstream = await spotifyProxy("search", req.query);
    res.status(upstream.status).json(upstream.data);
  } catch (e) {
    const status = e.response?.status || 500;
    const message = e.response?.data?.error?.message || e.message;
    res.status(status).json({ error: message });
  }
});

// 여러 아티스트 정보 가져오기 (GET /api/artists?ids=...)
router.get("/artists", async (req, res) => {
  try {
    const query = { ...req.query };
    // ids가 제공되지 않으면 .env의 기본값을 사용
    if (!query.ids) {
      query.ids = process.env.ARTIST_IDS;
    }
    const upstream = await spotifyProxy("artists", query);
    res.status(upstream.status).json(upstream.data);
  } catch (e) {
    const status = e.response?.status || 500;
    const message = e.response?.data?.error?.message || e.message;
    res.status(status).json({ error: message });
  }
});

// 여러 트랙 정보 가져오기 (GET /api/tracks?ids=...)
router.get("/tracks", async (req, res) => {
  try {
    const query = { ...req.query };
    // ids가 제공되지 않으면 .env의 기본값을 사용
    if (!query.ids) {
      query.ids = process.env.TRACK_IDS;
    }
    const upstream = await spotifyProxy("tracks", query);
    res.status(upstream.status).json(upstream.data);
  } catch (e) {
    const status = e.response?.status || 500;
    const message = e.response?.data?.error?.message || e.message;
    res.status(status).json({ error: message });
  }
});

// 아티스트의 앨범 가져오기 (GET /api/artists/:id/albums)
router.get("/artists/:id/albums", async (req, res) => {
  try {
    const { id } = req.params;
    const upstream = await spotifyProxy(`artists/${id}/albums`, req.query);
    res.status(upstream.status).json(upstream.data);
  } catch (e) {
    const status = e.response?.status || 500;
    const message = e.response?.data?.error?.message || e.message;
    res.status(status).json({ error: message });
  }
});

// 아티스트의 인기 트랙 가져오기 (GET /api/artists/:id/top-tracks)
router.get("/artists/:id/top-tracks", async (req, res) => {
  try {
    const { id } = req.params;
    const upstream = await spotifyProxy(`artists/${id}/top-tracks`, { market: "US", ...req.query });
    res.status(upstream.status).json(upstream.data);
  } catch (e) {
    const status = e.response?.status || 500;
    const message = e.response?.data?.error?.message || e.message;
    res.status(status).json({ error: message });
  }
});

export default router;
