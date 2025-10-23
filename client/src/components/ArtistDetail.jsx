import React from "react";

function ArtistDetail({ artist }) {
  if (!artist) return null;

  const genres = artist.genres?.slice(0, 3).join(", ");

  return (
    <div className="artist-detail-card">
      <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
        <img src={artist.images[1]?.url || artist.images[0]?.url} alt={artist.name} />
        <h2>{artist.name}</h2>
        {genres && <p className="genres">{genres}</p>}
        <p className="followers">{artist.followers.total.toLocaleString()} followers</p>
      </a>
    </div>
  );
}

export default ArtistDetail;
