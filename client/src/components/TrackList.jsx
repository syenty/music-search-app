import React from "react";

function TrackList({ tracks }) {
  if (!tracks || tracks.length === 0) return <p>No tracks found.</p>;

  return (
    <ul className="track-list">
      {tracks.map((track) => (
        <li key={track.id} className="track-item">
          <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
            <img src={track.album.images[2]?.url} alt={track.album.name} />
            <div>
              <strong>{track.name}</strong>
              <p>{track.artists.map((artist) => artist.name).join(", ")}</p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default TrackList;
