import "dotenv/config";
import axios from "axios";

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

// 필수 환경 변수 확인
if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  throw new Error("SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in .env file");
}

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
export async function spotifyProxy(path, query) {
  const token = await fetchAccessToken();

  const spotifyApi = axios.create({
    baseURL: "https://api.spotify.com/v1",
    headers: { Authorization: `Bearer ${token}` },
  });

  try {
    return await spotifyApi.get(path, { params: query });
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      tokenCache = null; // 캐시 무효화
      const newToken = await fetchAccessToken();
      return await spotifyApi.get(path, {
        params: query,
        headers: { Authorization: `Bearer ${newToken}` },
      });
    }
    throw error;
  }
}
