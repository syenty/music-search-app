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
