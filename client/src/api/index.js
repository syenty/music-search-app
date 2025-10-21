import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:3001/api
});

/**
 * Spotify 음악을 검색합니다.
 * @param {string} query - 검색어
 * @returns {Promise<object>} - 검색 결과 Promise
 */
export const searchTracks = (query) => {
  if (!query) return Promise.resolve({ tracks: { items: [] } });

  return apiClient.get("/search", { params: { q: query, type: "track", limit: 20 } });
};
