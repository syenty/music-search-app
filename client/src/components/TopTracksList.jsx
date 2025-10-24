import React from "react";

function TopTracksList({ tracks }) {
  if (!tracks || tracks.length === 0) return <p>No top tracks found.</p>;

  // 밀리초를 '분:초' 형식으로 변환하는 함수
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <ul className="track-list top-tracks-list">
      {tracks.map((track, index) => (
        <li key={track.id} className="track-item">
          <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
            <span className="track-rank">{index + 1}</span>
            <img src={track.album.images[2]?.url} alt={track.album.name} />
            <strong className="track-name">{track.name}</strong>
            <span className="track-duration">{formatDuration(track.duration_ms)}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default TopTracksList;
