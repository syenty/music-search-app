import React from "react";

function ArtistList({ artists }) {
  if (!artists || artists.length === 0) return <p>No artists found.</p>;

  return (
    <ul className="artist-list">
      {artists.map((artist) => (
        <li key={artist.id} className="artist-item">
          <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
            <img
              src={artist.images[2]?.url || artist.images[1]?.url || artist.images[0]?.url}
              alt={artist.name}
            />
            <div>
              <strong>{artist.name}</strong>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default ArtistList;
