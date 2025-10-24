import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import TrackList from "./components/TrackList";
import ArtistList from "./components/ArtistList";
import ArtistDetail from "./components/ArtistDetail";
import AlbumList from "./components/AlbumList";
import TopTracksList from "./components/TopTracksList"; // 새로 추가
import { search, getArtistAlbums, getArtistTopTracks } from "./api";
import "./App.css";

function App() {
  const [inputValue, setInputValue] = useState(""); // 입력창의 현재 값
  const [query, setQuery] = useState(""); // 검색을 실행할 검색어
  const [viewMode, setViewMode] = useState("default"); // 'default' or 'artistDetail'
  const [generalResults, setGeneralResults] = useState({ tracks: [], artists: [] });
  const [artistDetail, setArtistDetail] = useState({ artist: null, albums: [], topTracks: [] });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 검색어가 비어있으면 검색하지 않음
    if (!query) {
      setViewMode("default");
      setGeneralResults({ tracks: [], artists: [] });
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      setError(null);
      setViewMode("default"); // 검색 시작 시 기본 뷰로 초기화
      try {
        const response = await search(query);
        const artists = response.data.artists?.items || [];
        const tracks = response.data.tracks?.items || [];

        // 검색어와 정확히 일치하는 아티스트가 있는지 확인 (대소문자 무시)
        const exactMatchArtist = artists.find(
          (artist) => artist.name.toLowerCase() === query.toLowerCase()
        );

        if (exactMatchArtist) {
          // 아티스트 상세 뷰로 전환
          setViewMode("artistDetail");
          const [albumsRes, topTracksRes] = await Promise.all([
            getArtistAlbums(exactMatchArtist.id),
            getArtistTopTracks(exactMatchArtist.id),
          ]);
          setArtistDetail({
            artist: exactMatchArtist,
            albums: albumsRes.data.items || [],
            topTracks: topTracksRes.data.tracks || [],
          });
        } else {
          // 일반 검색 결과 표시
          setGeneralResults({ artists, tracks });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]); // query가 변경될 때마다 실행

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // 폼 제출 시 페이지가 새로고침되는 것을 방지
    setQuery(inputValue); // 입력된 값으로 검색 실행
  };

  // 아티스트 리스트 아이템 클릭 시 검색 실행
  const handleArtistClick = (artistName) => {
    setInputValue(artistName);
    setQuery(artistName);
  };

  const handleHomeClick = () => {
    setInputValue("");
    setQuery("");
    setArtistDetail({ artist: null, albums: [], topTracks: [] }); // Explicitly clear artist detail
    setError(null); // Clear any existing error
  };

  return (
    <div className="App">
      <h1 onClick={handleHomeClick}>Spotify Music Search</h1>
      <form onSubmit={handleSearchSubmit} className="search-form">
        <SearchBar value={inputValue} onChange={setInputValue} />
        <button type="submit">🔍</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {/* 일반 검색 결과 뷰 */}
      {!loading && !error && viewMode === "default" && query && (
        <div className="results-grid">
          <section className="results-column">
            <h2>Artists</h2>
            <ArtistList artists={generalResults.artists} onArtistClick={handleArtistClick} />
          </section>
          <section className="results-column">
            <h2>Tracks</h2>
            <TrackList tracks={generalResults.tracks} />
          </section>
        </div>
      )}

      {/* 아티스트 상세 뷰 */}
      {!loading && !error && viewMode === "artistDetail" && (
        <div className="artist-detail-view">
          {/* 상단 섹션: 아티스트 정보 + 앨범 리스트 */}
          <div className="top-section results-grid">
            <section className="results-column">
              <h2 className="section-title">Artist</h2>
              <ArtistDetail artist={artistDetail.artist} />
            </section>
            <section className="results-column">
              <h2 className="section-title">Albums</h2>
              <AlbumList albums={artistDetail.albums} />
            </section>
          </div>
          {/* 하단 섹션: 인기 트랙 */}
          <section className="bottom-section">
            <h2 className="section-title">Top Tracks</h2>
            <TopTracksList tracks={artistDetail.topTracks} />
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
