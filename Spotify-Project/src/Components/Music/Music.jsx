import "./Music.css";
import React, { useState, useEffect } from 'react';

const Music = () => {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return;
    }

    const fetchWebApi = async (endpoint, method, body) => {
      try {
        setLoading(true);
        const res = await fetch(`https://api.spotify.com/${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method,
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (res.ok) {
          return data;
        } else {
          throw new Error(data.error.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Función para buscar pistas en Spotify
    const searchTracks = async (searchQuery) => {
      try {
        const result = await fetchWebApi(`v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=10`, 'GET');
        setTracks(result.tracks.items);
        setError(null);
      } catch (error) {
        setError(error.message);
      }
    };

    // Lógica para buscar pistas cuando se monta el componente o cambia la consulta
    if (query) {
      searchTracks(query);
    }
  }, [query]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (query) {
      searchTracks(query);
    }
  };
  return (
    <div>
      <h1 style={{color: "green"}}>Search Tracks</h1>
      <form onSubmit={handleSearch} style={{ marginBottom: '20px'}}>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a track"
        />

      </form>
      {loading && <div style={{color: "white"}}>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px',justifyContent: 'center', borderRadius: '56rem' }}>
        {tracks.map(track => (
          <div className="card" key={track.id} style={{ width: '18rem', marginBottom:'20px'}}>
            <img src={track.album.images[0].url} className="card-img-top" alt={track.name} />
            <div className="card-body">
              <h5 className="card-title">{track.name}</h5>
              <p className="card-text">Artists: {track.artists.map(artist => artist.name).join(', ')}</p>
              <button className="play-button">Play</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Music;