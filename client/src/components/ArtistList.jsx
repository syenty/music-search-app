import React from "react";

function ArtistList({ artists, onArtistClick }) {
  if (!artists || artists.length === 0) return <p>No artists found.</p>;

  return (
    <ul className="artist-list">
      {artists.map((artist) => (
        <li key={artist.id} className="artist-item">
          <div className="artist-item-clickable" onClick={() => onArtistClick(artist.name)}>
            <img
              src={artist.images[2]?.url || artist.images[1]?.url || artist.images[0]?.url}
              alt={artist.name}
            />
            <div>
              <strong>{artist.name}</strong>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ArtistList;
