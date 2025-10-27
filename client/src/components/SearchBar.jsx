import React from "react";

function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search artists, tracks..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="search-bar"
      aria-label="Search artists and tracks"
      autoComplete="off"
    />
  );
}

export default SearchBar;
