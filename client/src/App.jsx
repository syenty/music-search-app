import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import TrackList from "./components/TrackList";
import { searchTracks } from "./api";
import "./App.css";

function App() {
  const [inputValue, setInputValue] = useState(""); // 입력창의 현재 값
  const [query, setQuery] = useState(""); // 검색을 실행할 검색어
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

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // 폼 제출 시 페이지가 새로고침되는 것을 방지
    setQuery(inputValue); // 입력된 값으로 검색 실행
  };

  return (
    <div className="App">
      <h1>Spotify Music Search</h1>
      <form onSubmit={handleSearchSubmit} className="search-form">
        <SearchBar value={inputValue} onChange={setInputValue} />
        <button type="submit">🔍</button>
      </form>
      <TrackList tracks={tracks} loading={loading} error={error} />
    </div>
  );
}

export default App;
