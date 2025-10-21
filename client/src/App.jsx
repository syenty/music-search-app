import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import TrackList from "./components/TrackList";
import { searchTracks } from "./api";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 검색어가 비어있으면 검색하지 않음
    if (!query) {
      setTracks([]);
      return;
    }

    const search = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await searchTracks(query);
        setTracks(response.data.tracks.items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [query]); // query가 변경될 때마다 실행

  return (
    <div className="App">
      <h1>Spotify Music Search</h1>
      <SearchBar onSearch={setQuery} />
      <TrackList tracks={tracks} loading={loading} error={error} />
    </div>
  );
}

export default App;
