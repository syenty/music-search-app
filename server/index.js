import "dotenv/config";
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3001;
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

// 필수 환경 변수 확인
if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  throw new Error("SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in .env file");
}

// CORS 설정
app.use(cors({ origin: "http://localhost:5173" })); // 클라이언트 주소 허용

app.use(express.json());

let tokenCache = { accessToken: "", expiresAt: 0 };
let inflightPromise = null;

async function fetchAccessToken() {
  // 이미 유효하면 재사용
  const now = Date.now() / 1000;
  if (tokenCache && tokenCache.expiresAt - 60 > now) {
    return tokenCache.accessToken;
  }
  // 동시에 여러 요청이 들어와도 1번만 발급
  if (inflightPromise) return inflightPromise;

  // 요청 시작: Promise를 inflightPromise에 할당
  inflightPromise = new Promise(async (resolve, reject) => {
    try {
      const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        { grant_type: "client_credentials" },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${auth}`,
          },
        }
      );
      const { access_token, expires_in } = response.data;
      tokenCache = {
        accessToken: access_token,
        expiresAt: Math.floor(Date.now() / 1000) + expires_in, // now + 3600
      };
      resolve(tokenCache.accessToken);
    } catch (error) {
      reject(error);
    } finally {
      // 성공/실패와 관계없이 inflightPromise를 초기화
      inflightPromise = null;
    }
  });

  return inflightPromise;
}

// Spotify로 프록시하는 공통 핸들러
async function spotifyProxy(path, query) {
  const token = await fetchAccessToken();

  const spotifyApi = axios.create({
    baseURL: "https://api.spotify.com/v1",
    headers: { Authorization: `Bearer ${token}` },
  });

  let response = await spotifyApi.get(path, { params: query });

  // 만료 오차/경쟁 등으로 401/403이 오면 1회만 재발급 후 재시도
  // axios는 4xx, 5xx 응답 시 에러를 throw하므로 catch 블록에서 처리합니다.
  if (response.status === 401 || response.status === 403) {
    tokenCache = null; // 무효화
    const newToken = await fetchAccessToken();
    // 새 토큰으로 재시도
    response = await spotifyApi.get(path, {
      params: query,
      headers: { Authorization: `Bearer ${newToken}` },
    });
  }
  return response;
}

// 예: /api/search?q=yoasobi&type=track,artist&limit=5
app.get("/api/search", async (req, res) => {
  try {
    const upstream = await spotifyProxy("search", req.query);
    // axios는 응답 본문을 data 속성에 담아줍니다.
    res.status(upstream.status).json(upstream.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
