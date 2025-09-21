import { useState } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../utils/supabaseClient'; // We will create this file next
import { GoSearch } from 'react-icons/go';

// This is the main component for the Search Page
export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // This function runs when the user types in the search bar
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);
    // Use Supabase to search for songs where the title, artist, or album matches the query
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .or(`title.ilike.%${query}%,artist.ilike.%${query}%,album.ilike.%${query}%`);

    if (error) {
      console.error('Error searching songs:', error);
      setResults([]);
    } else {
      setResults(data);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Search</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex items-center bg-gray-medium rounded-lg mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for songs, artists, albums..."
            className="w-full bg-transparent p-3 rounded-lg focus:outline-none"
          />
          <button type="submit" className="p-3 text-gray-400">
            <GoSearch size={24} />
          </button>
        </form>

        {/* Display Search Results */}
        {loading && <p>Searching...</p>}
        
        {results.length > 0 && !loading && (
          <div className="space-y-3">
            {results.map((song) => (
              <div key={song.id} className="flex items-center bg-gray-medium p-2 rounded-lg">
                <img 
                  src={song.album_art_url} 
                  alt={`${song.album} cover`}
                  className="w-16 h-16 rounded-md mr-4"
                />
                <div>
                  <h3 className="font-semibold">{song.title}</h3>
                  <p className="text-sm text-gray-400">{song.artist}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && !loading && query && (
          <p>No results found for "{query}".</p>
        )}
      </div>
    </Layout>
  );
}
