import React from "react";

function AlbumList({ albums }) {
  if (!albums || albums.length === 0) return <p>No albums found.</p>;

  return (
    <ul className="album-list">
      {albums.map((album) => (
        <li key={album.id} className="album-item">
          <a href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer">
            <img src={album.images[2]?.url || album.images[0]?.url} alt={album.name} />
            <div>
              <strong>{album.name}</strong>
              <p>{album.artists.map((artist) => artist.name).join(", ")}</p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default AlbumList;
