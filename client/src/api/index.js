import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:3001/api
});

/**
 * Spotify 음악을 검색합니다.
 * @param {string} query - 검색어
 * @returns {Promise<object>} - 검색 결과 Promise
 */
export const search = async (query) => {
  if (!query) return Promise.resolve({ data: { tracks: {}, artists: {}, albums: {} } });

  const [artistResponse, trackResponse] = await Promise.all([
    apiClient.get("/search", { params: { q: query, type: "artist", limit: 3 } }),
    apiClient.get("/search", { params: { q: query, type: "track", limit: 5 } }),
  ]);

  return {
    data: {
      artists: artistResponse.data.artists,
      tracks: trackResponse.data.tracks,
    },
  };
};

export const getArtistAlbums = (artistId) => {
  return apiClient.get(`/artists/${artistId}/albums`, {
    params: { limit: 4, include_groups: "album,single" },
  });
};

export const getArtistTopTracks = (artistId) => {
  return apiClient.get(`/artists/${artistId}/top-tracks`);
};

/**
 * 여러 아티스트의 정보를 ID로 가져옵니다.
 * @param {string[]} [ids] - 아티스트 ID 배열. 제공되지 않으면 서버의 기본값을 사용합니다.
 * @returns {Promise<object>}
 */
export const getSeveralArtists = (ids) =>
  apiClient.get("/artists", { params: { ids: ids?.join(",") } });

/**
 * 여러 트랙의 정보를 ID로 가져옵니다.
 * @param {string[]} [ids] - 트랙 ID 배열. 제공되지 않으면 서버의 기본값을 사용합니다.
 * @returns {Promise<object>}
 */
export const getSeveralTracks = (ids) =>
  apiClient.get("/tracks", { params: { ids: ids?.join(",") } });
