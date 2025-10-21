import React from "react";

function TrackList({ tracks, loading, error }) {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!tracks || tracks.length === 0) return <p>No results found.</p>;

  return (
    <ul className="track-list">
      {tracks.map((track) => (
        <li key={track.id} className="track-item">
          <img src={track.album.images[2]?.url} alt={track.album.name} />
          <div>
            <strong>{track.name}</strong>
            <p>{track.artists.map((artist) => artist.name).join(", ")}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TrackList;
